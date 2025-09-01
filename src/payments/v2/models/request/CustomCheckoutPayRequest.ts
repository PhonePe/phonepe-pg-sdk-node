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

import { UpiIntentPayRequestBuilder } from '../../../../common/models/request/instruments/UpiIntentPayRequestBuilder';
import { DeviceContext } from '../../../../common/models/request/DeviceContext';
import { InstrumentConstraint } from '../../../../common/models/request/InstrumentConstraint';
import { MetaInfo } from '../../../../common/models/MetaInfo';
import { PaymentFlow } from '../../../../common/models/PaymentFlow';
import { UpiCollectPayViaVpaRequestBuilder } from '../../../../common/models/request/instruments/UpiCollectPayViaVpaRequestBuilder';
import { UpiQrRequestBuilder } from '../../../../common/models/request/instruments/UpiQrRequestBuilder';
import { NetBankingPayRequestBuilder } from '../../../../common/models/request/instruments/NetBankingPayRequestBuilder';
import { TokenPayRequestBuilder } from '../../../../common/models/request/instruments/TokenPayRequestBuilder';
import { CardPayRequestBuilder } from '../../../../common/models/request/instruments/CardPayRequestBuilder';

/**
 * Creates a request based on different builder for different instruments.
 * 1. UpiIntentPayRequestBuilder -> Upi Intent
 * 2. UpiCollectPayViaVpaRequestBuilder -> Upi Collect
 * 3. UpiQrRequestBuilder -> Upi QR
 * 4. NetBankingPayRequestBuilder -> Netbanking
 * 5. TokenPayRequestBuilder -> Token
 * 6. CardPayRequestBuilder -> Card
 */
export class CustomCheckoutPayRequest {
  public merchantOrderId!: string;
  public amount!: number;
  public paymentFlow!: PaymentFlow;
  public metaInfo?: MetaInfo;
  public constraints?: InstrumentConstraint[];
  public deviceContext?: DeviceContext;
  public expireAfter?: number;

  public constructor(
    merchantOrderId: string,
    amount: number,
    paymentFlow: PaymentFlow,
    expireAfter?: number,
    metaInfo?: MetaInfo,
    constrainsts?: InstrumentConstraint[],
    deviceContext?: DeviceContext
  ) {
    this.merchantOrderId = merchantOrderId;
    this.amount = amount;
    this.paymentFlow = paymentFlow;
    this.metaInfo = metaInfo;
    this.constraints = constrainsts;
    this.deviceContext = deviceContext;
    this.expireAfter = expireAfter;
  }

  static UpiIntentPayRequestBuilder() {
    return new UpiIntentPayRequestBuilder();
  }

  static UpiCollectPayViaVpaRequestBuilder() {
    return new UpiCollectPayViaVpaRequestBuilder();
  }

  static UpiQrRequestBuilder() {
    return new UpiQrRequestBuilder();
  }

  static NetBankingPayRequestBuilder() {
    return new NetBankingPayRequestBuilder();
  }

  static TokenPayRequestBuilder() {
    return new TokenPayRequestBuilder();
  }

  static CardPayRequestBuilder() {
    return new CardPayRequestBuilder();
  }
}
