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

export enum EventType {
  PAY_SUCCESS = 'PAY_SUCCESS',
  PAY_FAILED = 'PAY_FAILED',

  REFUND_SUCCESS = 'REFUND_SUCCESS',
  REFUND_FAILED = 'REFUND_FAILED',

  REFUND_STATUS_SUCCESS = 'REFUND_STATUS_SUCCESS',
  REFUND_STATUS_FAILED = 'REFUND_STATUS_FAILED',

  ORDER_STATUS_SUCCESS = 'ORDER_STATUS_SUCCESS',
  ORDER_STATUS_FAILED = 'ORDER_STATUS_FAILED',

  TRANSACTION_STATUS_SUCCESS = 'TRANSACTION_STATUS_SUCCESS',
  TRANSACTION_STATUS_FAILED = 'TRANSACTION_STATUS_FAILED',

  CREATE_SDK_ORDER_SUCCESS = 'CREATE_SDK_ORDER_SUCCESS',
  CREATE_SDK_ORDER_FAILED = 'CREATE_SDK_ORDER_FAILED',

  STANDARD_CHECKOUT_CLIENT_INITIALIZED = 'STANDARD_CHECKOUT_CLIENT_INITIALIZED',
  CUSTOM_CHECKOUT_CLIENT_INITIALIZED = 'CUSTOM_CHECKOUT_CLIENT_INITIALIZED',
  TOKEN_SERVICE_INITIALIZED = 'TOKEN_SERVICE_INITIALIZED',

  OAUTH_FETCH_FAILED_USED_CACHED_TOKEN = 'OAUTH_FETCH_FAILED_USED_CACHED_TOKEN',

  CALLBACK_SERIALIZATION_FAILED = 'CALLBACK_SERIALIZATION_FAILED',
}
