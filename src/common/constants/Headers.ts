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

export class Headers {
  static readonly INTEGRATION: string = 'API';
  static readonly API_VERSION: string = 'V2';
  static readonly SDK_VERSION: string = '2.0.1';
  static readonly SDK_TYPE: string = 'BACKEND_NODE_SDK';
  static readonly SOURCE: string = 'x-source';
  static readonly SOURCE_VERSION: string = 'x-source-version';
  static readonly SOURCE_PLATFORM: string = 'x-source-platform';
  static readonly SOURCE_PLATFORM_VERSION: string = 'x-source-platform-version';
  static readonly OAUTH_AUTHORIZATION: string = 'Authorization';
  static readonly CONTENT_TYPE: string = 'Content-Type';
  static readonly ACCEPT: string = 'Accept';
  static readonly APPLICATION_JSON = 'application/json';
  static readonly APPLICATION_FORM_URLENCODED =
    'application/x-www-form-urlencoded';
}
