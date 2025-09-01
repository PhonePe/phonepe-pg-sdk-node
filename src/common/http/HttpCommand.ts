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

import { HttpMethodType } from './HttpMethodType';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  BadRequest,
  ClientError,
  ExpectationFailed,
  ForbiddenAccess,
  PhonePeException,
  ResourceConflict,
  ResourceGone,
  ResourceInvalid,
  ResourceNotFound,
  ServerError,
  TooManyRequests,
  UnauthorizedAccess,
} from '../exception/Exceptions';

const HTTP_CODE_TO_EXCEPTION_MAPPER: { [key: number]: any } = {
  400: BadRequest,
  401: UnauthorizedAccess,
  403: ForbiddenAccess,
  404: ResourceNotFound,
  409: ResourceConflict,
  410: ResourceGone,
  417: ExpectationFailed,
  422: ResourceInvalid,
  429: TooManyRequests,
};

export class HttpCommand {
  private hostUrl: string;
  private httpClient: AxiosInstance;

  constructor(hostUrl: string, httpClient: AxiosInstance) {
    this.hostUrl = hostUrl;
    this.httpClient = httpClient;
  }

  private getCompleteUrl = (
    url: string,
    params: { [key: string]: string }
  ): string => {
    const urlFormat = new URL(this.hostUrl + url);
    urlFormat.search = new URLSearchParams(params).toString();
    return urlFormat.toString();
  };

  public request = async <T>(
    url: string,
    method: HttpMethodType,
    headers: { [key: string]: string } = {},
    data: object = {},
    params: { [key: string]: string } = {}
  ): Promise<T> => {
    try {
      const completeUrl: string = this.getCompleteUrl(url, params);
      const response = await this.makeCall(
        completeUrl,
        method,
        headers,
        data,
        params
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return this.handleError(error.response);
      }
      throw error;
    }
  };

  private makeCall = (
    url: string,
    method: HttpMethodType,
    headers: { [key: string]: string } = {},
    data: object = {},
    params: { [key: string]: string } = {}
  ) => {
    if (HttpMethodType.GET == method) {
      return this.httpClient.get(url, { params, headers });
    } else if (HttpMethodType.POST == method) {
      return this.httpClient.post(url, data, { headers });
    } else {
      throw new PhonePeException('Method Not Supported', 405);
    }
  };

  private handleError = (error: AxiosResponse) => {
    const responseCode = error.status;
    if (responseCode in HTTP_CODE_TO_EXCEPTION_MAPPER) {
      throw new HTTP_CODE_TO_EXCEPTION_MAPPER[error.status](
        error.statusText,
        error.status,
        error
      );
    } else if (responseCode >= 400 && responseCode <= 499) {
      throw new ClientError(error.statusText, error.status, error);
    } else if (responseCode >= 500 && responseCode <= 599) {
      throw new ServerError(error.statusText, error.status, error);
    }
    throw new PhonePeException(error.statusText, error.status, error);
  };
}
