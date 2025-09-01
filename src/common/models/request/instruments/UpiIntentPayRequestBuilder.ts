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
import { DeviceContext } from '../DeviceContext';
import { InstrumentConstraint } from '../InstrumentConstraint';
import { IntentPaymentV2Instrument } from './IntentPaymentV2Instrument';
import { MetaInfo } from '../../MetaInfo';
import { PgPaymentFlow } from '../../../../payments/v2/models/request/PgPaymentFlow';

export class UpiIntentPayRequestBuilder {
  private _merchantOrderId!: string;
  private _amount!: number;
  private _metaInfo?: MetaInfo;
  private _constraints?: InstrumentConstraint[];
  private _deviceOS?: string;
  private _merchantCallBackScheme?: string;
  private _targetApp?: string;
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
  };

  deviceOS = (deviceOS: string) => {
    this._deviceOS = deviceOS;
    return this;
  };

  merchantCallBackScheme = (merchantCallBackScheme: string) => {
    this._merchantCallBackScheme = merchantCallBackScheme;
    return this;
  };

  targetApp = (targetApp: string) => {
    this._targetApp = targetApp;
    return this;
  };

  expireAfter = (expireAfter: number) => {
    this._expireAfter = expireAfter;
    return this;
  };

  build = (): CustomCheckoutPayRequest => {
    const paymentFlow = PgPaymentFlow.builder()
      .paymentMode(
        IntentPaymentV2Instrument.builder().targetApp(this._targetApp).build()
      )
      .build();

    const deviceContext = DeviceContext.builder()
      .deviceOS(this._deviceOS)
      .merchantCallBackScheme(this._merchantCallBackScheme)
      .build();

    return new CustomCheckoutPayRequest(
      this._merchantOrderId,
      this._amount,
      paymentFlow,
      this._expireAfter,
      this._metaInfo,
      this._constraints,
      deviceContext
    );
  };
}
