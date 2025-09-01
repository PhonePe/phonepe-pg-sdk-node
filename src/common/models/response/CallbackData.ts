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

import { MetaInfo } from '../MetaInfo';
import { PaymentDetail } from './PaymentDetail';

export class CallbackData {
  public state!: string;
  public amount!: number;
  public expireAt!: number;
  public orderId!: string;
  public merchantId!: string;
  public merchantRefundId?: string;
  public originalMerchantOrderId?: string;
  public refundId?: string;
  public merchantOrderId?: string;
  public errorCode?: string;
  public detailedErrorCode?: string;
  public metaInfo?: MetaInfo;
  public paymentDetails!: PaymentDetail[];
}
