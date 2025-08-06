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
import { PaymentV2Instrument } from '../../../../common/models/request/instruments/PaymentV2Instrument';
import { PaymentFlowType } from '../../../../common/models/PaymentFlowType';

export class PgPaymentFlow extends PaymentFlow {
  public paymentMode!: PaymentV2Instrument;
  public merchantUrls?: MerchantUrls;

  public constructor(paymentMode: PaymentV2Instrument, redirectUrl?: string) {
    super(PaymentFlowType.PG);
    this.paymentMode = paymentMode;
    this.merchantUrls = new MerchantUrls(redirectUrl);
  }

  static builder = () => {
    return new PgPaymentFlowBuilder();
  };
}

class PgPaymentFlowBuilder {
  private _paymentMode!: PaymentV2Instrument;
  private _redirectUrl?: string;

  /**
   * SETTERS FOR PG PAYMENT FLOW
   */
  paymentMode = (paymentMode: PaymentV2Instrument) => {
    this._paymentMode = paymentMode;
    return this;
  };

  redirectUrl = (redirectUrl?: string) => {
    this._redirectUrl = redirectUrl;
    return this;
  };

  build = () => {
    return new PgPaymentFlow(this._paymentMode, this._redirectUrl);
  };
}
