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

export class Constants {
  static readonly MAX_EVENTS_IN_BATCH = 10;
  static readonly SOURCE = 'BACKEND_SDK';
  static readonly CLIENT_VERSION = 'V2';
  static readonly AUTHORIZATION = 'Authorization';
  static readonly EVENTS_ENDPOINT = '/client/v1/backend/events/batch';
  static readonly QUEUE_MAX_SIZE = 20000; // Should be greater than MAX_EVENTS_IN_BATCH
  static readonly INITIAL_DELAY = 1000; //in ms
  static readonly DELAY = 1000; //in ms
}
