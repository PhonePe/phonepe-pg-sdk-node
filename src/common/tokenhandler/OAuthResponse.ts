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

import { Expose } from 'class-transformer';

export class OAuthResponse {
  @Expose({ name: 'access_token' })
  public accessToken!: string;

  @Expose({ name: 'encrypted_access_token' })
  public encryptedAccessToken!: string;

  @Expose({ name: 'refresh_token' })
  public refreshToken!: string;

  @Expose({ name: 'expires_in' })
  public expiresIn!: number;

  @Expose({ name: 'issued_at' })
  public issuedAt!: number;

  @Expose({ name: 'expires_at' })
  public expiresAt!: number;

  @Expose({ name: 'session_expires_at' })
  public sessionExpiresAt!: number;

  @Expose({ name: 'token_type' })
  public tokenType!: string;
}
