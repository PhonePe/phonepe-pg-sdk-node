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

import axios, { AxiosInstance } from 'axios';
import { Env } from '../Env';
import { CredentialConfig } from './configs/CredentialConfig';
import { TokenService } from './tokenhandler/TokenService';
import { HttpMethodType } from './http/HttpMethodType';
import { HttpCommand } from './http/HttpCommand';
import { Headers } from './constants/Headers';
import { ClassType } from 'class-transformer-validator';
import { plainToClass } from 'class-transformer';
import axiosRetry from 'axios-retry';
import { UnauthorizedAccess } from './exception/Exceptions';
import { EnvConfig } from '../EnvConfig';
import { EventPublisherFactory } from './events/publisher/EventPublisherFactory';
import { EventPublisher } from './events/publisher/EventPublisher';

export abstract class BaseClient {
  private readonly _env: Env;
  private readonly _tokenService: TokenService;
  private readonly _merchantConfig: CredentialConfig;
  private readonly _httpCommand: HttpCommand;
  private readonly _httpClient: AxiosInstance;
  private readonly _shouldPublishEvents: boolean;
  private readonly _eventPublisherFactory: EventPublisherFactory;
  private readonly _eventPublisher: EventPublisher;

  protected constructor(
    clientId: string,
    clientSecret: string,
    clientVersion: number,
    env: Env,
    shouldPublishEvents: boolean
  ) {
    this._httpClient = axios.create();
    this._env = env;
    this._merchantConfig = CredentialConfig.builder()
      .clientId(clientId)
      .clientSecret(clientSecret)
      .clientVersion(clientVersion)
      .build();
    axiosRetry(this._httpClient, {
      retries: 0, // No retries
    });
    this._httpCommand = new HttpCommand(
      EnvConfig.getBaseUrls(env).pgHostUrl,
      this._httpClient
    );
    this._shouldPublishEvents = shouldPublishEvents;
    this._eventPublisherFactory = new EventPublisherFactory(
      this.httpClient,
      EnvConfig.getBaseUrls(env).eventsHostUrl
    );
    this._eventPublisher =
      this._eventPublisherFactory.getEventPublisher(shouldPublishEvents);
    this._tokenService = new TokenService(
      this._httpClient,
      this._merchantConfig,
      env,
      this._eventPublisher
    );
    this._eventPublisher.startPublishingEvents(this.tokenService.getOAuthToken);
  }

  protected requestViaAuthRefresh = async <T>(
    method: HttpMethodType,
    url: string,
    responseType: ClassType<T>,
    headers: { [key: string]: string },
    data?: object,
    pathParams?: { [key: string]: string }
  ): Promise<T> => {
    const httpHeaders = await this.addAuthHeader(headers);
    try {
      const response = await this._httpCommand.request<T>(
        url,
        method,
        httpHeaders,
        data,
        pathParams
      );
      const deserializedResponse = plainToClass(responseType, response);
      return deserializedResponse;
    } catch (error) {
      if (error instanceof UnauthorizedAccess) {
        await this.tokenService.forceRefreshToken();
      }
      throw error;
    }
  };

  private addAuthHeader = async (headers: { [key: string]: string }) => {
    const httpHeaders = { ...headers };
    httpHeaders[Headers.OAUTH_AUTHORIZATION] =
      await this._tokenService.getOAuthToken();
    return httpHeaders;
  };

  /**
   * Getters for BaseClient fields
   */
  get env(): Env {
    return this._env;
  }

  get httpClient(): AxiosInstance {
    return this._httpClient;
  }

  get tokenService(): TokenService {
    return this._tokenService;
  }

  get merchantConfig(): CredentialConfig {
    return this._merchantConfig;
  }

  get shouldPublishEvents(): boolean {
    return this._shouldPublishEvents;
  }

  get eventPublisher(): EventPublisher {
    return this._eventPublisher;
  }
}
