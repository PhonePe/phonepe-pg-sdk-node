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

import { MerchantUrls } from './MerchantUrls';
import { PaymentFlow } from '../../../../common/models/PaymentFlow';
import { PaymentFlowType } from '../../../../common/models/PaymentFlowType';

export class PgCheckoutPaymentFlow extends PaymentFlow {
  private message?: string;
  private merchantUrls?: MerchantUrls;

  public constructor(message?: string, redirectUrl?: string) {
    super(PaymentFlowType.PG_CHECKOUT);
    this.message = message;
    this.merchantUrls = new MerchantUrls(redirectUrl);
  }

  public static builder(): PgCheckoutPaymentFlowBuilder {
    return new PgCheckoutPaymentFlowBuilder();
  }
}

class PgCheckoutPaymentFlowBuilder {
  private _message?: string;
  private _redirectUrl?: string;

  /**
   * SETTERS FOR PG_CHECKOUT PAYMENT FLOW
   */
  public message(message?: string) {
    this._message = message;
    return this;
  }

  public redirectUrl(redirectUrl?: string) {
    this._redirectUrl = redirectUrl;
    return this;
  }

  public build() {
    return new PgCheckoutPaymentFlow(this._message, this._redirectUrl);
  }
}
