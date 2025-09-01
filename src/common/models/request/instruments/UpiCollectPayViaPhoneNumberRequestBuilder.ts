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

import { CustomCheckoutPayRequest } from '../../../../payments/v2/models/request/CustomCheckoutPayRequest';
import { InstrumentConstraint } from '../InstrumentConstraint';
import { MetaInfo } from '../../MetaInfo';
import { PaymentFlow } from '../../PaymentFlow';
import { CollectPaymentV2Instrument } from './CollectPaymentV2Instrument';
import { PhoneNumberCollectPaymentDetails } from './PhoneNumberCollectPaymentDetails';
import { PgPaymentFlow } from '../../../../payments/v2/models/request/PgPaymentFlow';

export class UpiCollectPayViaPhoneNumberRequestBuilder {
  private _merchantOrderId!: string;
  private _amount!: number;
  private _metaInfo?: MetaInfo;
  private _constraints?: InstrumentConstraint[];
  private _phoneNumber!: string;
  private _message?: string;
  private _expireAfter?: number;

  /**
   * SETTERS
   */

  merchantOrderId = (merchantOrderId: string) => {
    this._merchantOrderId = merchantOrderId;
    return this;
  };

  amount = (amount: number) => {
    this._amount = amount;
    return this;
  };

  metaInfo = (metaInfo: MetaInfo) => {
    this._metaInfo = metaInfo;
    return this;
  };

  constraints = (constraints: InstrumentConstraint[]) => {
    this._constraints = constraints;
    return this;
  };

  message = (message: string) => {
    this._message = message;
    return this;
  };

  phoneNumber = (phoneNumber: string) => {
    this._phoneNumber = phoneNumber;
    return this;
  };

  expireAfter = (expireAfter: number) => {
    this._expireAfter = expireAfter;
    return this;
  };

  build = () => {
    const paymentFlow: PaymentFlow = PgPaymentFlow.builder()
      .paymentMode(
        CollectPaymentV2Instrument.builder()
          .details(
            PhoneNumberCollectPaymentDetails.builder()
              .phoneNumber(this._phoneNumber)
              .build()
          )
          .message(this._message)
          .build()
      )
      .build();

    return new CustomCheckoutPayRequest(
      this._merchantOrderId,
      this._amount,
      paymentFlow,
      this._expireAfter,
      this._metaInfo,
      this._constraints
    );
  };
}
