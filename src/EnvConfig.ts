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

import { BaseUrl } from './common/constants/BaseUrl';
import { Env } from './Env';

export class EnvConfig {
  private _pgHostUrl: string;
  private _oAuthHostUrl: string;
  private _eventsHostUrl: string;

  private constructor(
    pgHostUrl: string,
    oAuthHostUrl: string,
    eventsHostUrl: string
  ) {
    this._pgHostUrl = pgHostUrl;
    this._oAuthHostUrl = oAuthHostUrl;
    this._eventsHostUrl = eventsHostUrl;
  }

  public static getBaseUrls(envType: Env): EnvConfig {
    if (Object.prototype.hasOwnProperty.call(BaseUrl, envType))
      return new EnvConfig(
        BaseUrl[envType].PG_HOST_URL,
        BaseUrl[envType].OAUTH_HOST_URL,
        BaseUrl[envType].EVENTS_HOST_URL
      );

    return new EnvConfig(
      BaseUrl[Env.SANDBOX].PG_HOST_URL,
      BaseUrl[Env.SANDBOX].OAUTH_HOST_URL,
      BaseUrl[Env.SANDBOX].EVENTS_HOST_URL
    );
  }

  get pgHostUrl(): string {
    return this._pgHostUrl;
  }

  get oAuthHostUrl(): string {
    return this._oAuthHostUrl;
  }

  get eventsHostUrl(): string {
    return this._eventsHostUrl;
  }
}
