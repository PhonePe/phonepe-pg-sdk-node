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

export class CredentialConfig {
  private _clientId: string;
  private _clientSecret: string;
  private _clientVersion: number;

  public constructor(
    clientId: string,
    clientSecret: string,
    clientVersion: number
  ) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._clientVersion = clientVersion;
  }

  public static builder(): CredentialConfigBuilder {
    return new CredentialConfigBuilder();
  }

  /**
   * Getter Functions
   */

  get clientId(): string {
    return this._clientId;
  }

  get clientSecret(): string {
    return this._clientSecret;
  }

  get clientVersion(): number {
    return this._clientVersion;
  }
}

export class CredentialConfigBuilder {
  private _clientId!: string;
  private _clientSecret!: string;
  private _clientVersion!: number;

  /**
   * Setters used for MerchantConfig builder
   */

  clientId = (clientId: string): CredentialConfigBuilder => {
    this._clientId = clientId;
    return this;
  };

  clientSecret = (clientSecret: string): CredentialConfigBuilder => {
    this._clientSecret = clientSecret;
    return this;
  };

  clientVersion = (clientVersion: number): CredentialConfigBuilder => {
    this._clientVersion = clientVersion;
    return this;
  };

  build = (): CredentialConfig => {
    return new CredentialConfig(
      this._clientId,
      this._clientSecret,
      this._clientVersion
    );
  };
}
