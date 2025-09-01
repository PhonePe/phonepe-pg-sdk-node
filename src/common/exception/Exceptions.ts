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

import { AxiosResponse } from 'axios';
import { PhonePeResponse } from '../http/PhonePeResponse';
import { plainToClass } from 'class-transformer';

export class PhonePeException extends Error {
  stack?: undefined;
  type: string;
  httpStatusCode?: number;
  message: string;
  data?: { [key: string]: object };
  code?: string;

  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message);
    this.type = this.constructor.name;
    this.message = message;
    this.httpStatusCode = httpStatusCode;
    if (error != null) {
      const phonePeResponse = plainToClass(PhonePeResponse, error.data ?? {});
      this.code = phonePeResponse.errorCode || phonePeResponse.code;
      this.data = phonePeResponse.context || phonePeResponse.data;
      this.message = phonePeResponse.message || message;
    }
  }
}

export class ClientError extends PhonePeException {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}

export class BadRequest extends ClientError {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}

export class UnauthorizedAccess extends ClientError {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}

export class ForbiddenAccess extends ClientError {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}

export class ResourceNotFound extends ClientError {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}

export class ResourceConflict extends ClientError {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}

export class ResourceGone extends ClientError {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}

export class ResourceInvalid extends ClientError {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}

export class ExpectationFailed extends ClientError {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}

export class TooManyRequests extends ClientError {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}

export class ServerError extends PhonePeException {
  constructor(message: string, httpStatusCode?: number, error?: AxiosResponse) {
    super(message, httpStatusCode, error);
  }
}
