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

export class CustomCheckoutConstants {
  static readonly PAY_API: string = '/payments/v2/pay';
  static readonly ORDER_STATUS_API: string =
    '/payments/v2/order/{ORDER_ID}/status';
  static readonly ORDER_DETAILS: string = 'details';
  static readonly REFUND_API: string = '/payments/v2/refund';
  static readonly REFUND_STATUS_API: string =
    '/payments/v2/refund/{REFUND_ID}/status';
  static readonly TRANSACTION_STATUS_API: string =
    '/payments/v2/transaction/{TRANSACTION_ID}/status';
  static readonly CREATE_ORDER_API: string = '/payments/v2/sdk/order';
}
