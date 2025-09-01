/* 
 *  Copyright (c) 2025 Original Author(s), PhonePe India Pvt. Ltd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { AxiosInstance } from 'axios';
import { CredentialConfig } from '../configs/CredentialConfig';
import { Env } from '../../Env';
import { OAuthResponse } from './OAuthResponse';
import { Headers } from '../constants/Headers';
import { TokenConstants } from './TokenConstants';
import { HttpCommand } from '../http/HttpCommand';
import { HttpMethodType } from '../http/HttpMethodType';
import { plainToClass } from 'class-transformer';
import { EnvConfig } from '../../EnvConfig';
import { OAuthRequest } from './OAuthRequest';
import { EventPublisher } from '../events/publisher/EventPublisher';
import {
  buildInitClientEvent,
  buildOAuthEvent,
} from '../events/builders/EventBuillder';
import { EventType } from '../events/models/enums/EventType';
import { Mutex } from 'async-mutex';

export class TokenService {
  private credentialConfig: CredentialConfig;
  static oAuthResponse: OAuthResponse | null;
  private httpCommand: HttpCommand;
  private eventPublisher: EventPublisher;
  private mutex = new Mutex();

  set oAuthResponse(oAuthResponse: OAuthResponse) {
    TokenService.oAuthResponse = oAuthResponse;
  }

  constructor(
    httpClient: AxiosInstance,
    credentialConfig: CredentialConfig,
    env: Env,
    eventPublisher: EventPublisher
  ) {
    this.credentialConfig = credentialConfig;
    this.httpCommand = new HttpCommand(
      EnvConfig.getBaseUrls(env).oAuthHostUrl,
      httpClient
    );
    this.eventPublisher = eventPublisher;
    this.eventPublisher.send(
      buildInitClientEvent(EventType.TOKEN_SERVICE_INITIALIZED)
    );
  }

  private prepareRequestHeaders = (): { [key: string]: string } => {
    return {
      [Headers.CONTENT_TYPE]: Headers.APPLICATION_FORM_URLENCODED,
      [Headers.ACCEPT]: Headers.APPLICATION_JSON,
    };
  };

  private formatCachedToken = (): string => {
    return `${TokenService.oAuthResponse?.tokenType} ${TokenService.oAuthResponse?.accessToken}`;
  };

  private getCurrentTime = () => {
    return Math.floor(Date.now() / 1000);
  };

  public getOAuthToken = async () => {
    if (this.isCachedTokenValid()) {
      return this.formatCachedToken();
    }

    try {
      await this.fetchTokenFromPhonePe();
    } catch (error) {
      if (TokenService.oAuthResponse == null) {
        console.warn(
          'No cached token, error occurred while fetching new token',
          error
        );
        throw error;
      }
      console.warn(
        'Returning cached token, error occurred while fetching new token',
        error
      );
      this.eventPublisher.send(
        buildOAuthEvent(
          this.getCurrentTime(),
          TokenConstants.OAUTH_GET_TOKEN,
          EventType.OAUTH_FETCH_FAILED_USED_CACHED_TOKEN,
          error,
          TokenService.oAuthResponse.issuedAt,
          TokenService.oAuthResponse.expiresAt
        )
      );
    }
    return this.formatCachedToken();
  };

  private fetchTokenFromPhonePe = async (forceRefresh = false) => {
    await this.mutex.runExclusive(async () => {
      // if multiple operations call the fetchTokenFromPhonePe, first operations will enter and fetch the token, and the subsequent operations will use the fetched token, avoiding unnecessary api call
      if (forceRefresh != true && this.isCachedTokenValid()) {
        return;
      }
      const formBody = this.prepareFormBody();
      const url = TokenConstants.OAUTH_GET_TOKEN;

      const response = await this.httpCommand.request(
        url,
        HttpMethodType.POST,
        this.prepareRequestHeaders(),
        formBody
      );
      TokenService.oAuthResponse = plainToClass(OAuthResponse, response);
    });
  };

  public forceRefreshToken = async () => {
    await this.fetchTokenFromPhonePe(true);
  };

  private isCachedTokenValid = () => {
    if (TokenService.oAuthResponse == null) {
      return false;
    }
    const issuedAt = TokenService.oAuthResponse?.issuedAt;
    const expireAt = TokenService.oAuthResponse?.expiresAt;
    const currentTime = this.getCurrentTime();
    const reloadTime = Math.floor(issuedAt + (expireAt - issuedAt) / 2);
    return currentTime < reloadTime;
  };

  private prepareFormBody = (): OAuthRequest => {
    const formBody: OAuthRequest = {
      client_id: this.credentialConfig.clientId,
      client_secret: this.credentialConfig.clientSecret,
      client_version: this.credentialConfig.clientVersion.toString(),
      grant_type: TokenConstants.OAUTH_GRANT_TYPE,
    };
    return formBody;
  };
}
