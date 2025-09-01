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

import { MetaInfo } from '../../../../common/models/MetaInfo';
import { PaymentFlow } from '../../../../common/models/PaymentFlow';
import { PgCheckoutPaymentFlow } from './PgCheckoutPaymentFlow';

/**
 * Creates a request using the builder -> StandardCheckoutPayRequest.builder()
 */
export class StandardCheckoutPayRequest {
  public merchantOrderId: string;
  public amount: number;
  public paymentFlow: PaymentFlow;
  public metaInfo?: MetaInfo;
  public expireAfter?: number;

  public constructor(
    merchantOrderId: string,
    amount: number,
    metaInfo?: MetaInfo,
    message?: string,
    redirectUrl?: string,
    expireAfter?: number
  ) {
    this.merchantOrderId = merchantOrderId;
    this.amount = amount;
    this.metaInfo = metaInfo;
    this.expireAfter = expireAfter;
    this.paymentFlow = PgCheckoutPaymentFlow.builder()
      .message(message)
      .redirectUrl(redirectUrl)
      .build();
  }

  public static builder(): StandardCheckoutPayRequestBuilder {
    return new StandardCheckoutPayRequestBuilder();
  }
}

class StandardCheckoutPayRequestBuilder {
  private _merchantOrderId!: string;
  private _amount!: number;
  private _metaInfo?: MetaInfo;
  private _redirectUrl?: string;
  private _message?: string;
  private _expireAfter?: number;

  /**
   * Setters used for  builder
   */

  merchantOrderId = (
    merchantOrderId: string
  ): StandardCheckoutPayRequestBuilder => {
    this._merchantOrderId = merchantOrderId;
    return this;
  };

  amount = (amount: number): StandardCheckoutPayRequestBuilder => {
    this._amount = amount;
    return this;
  };

  metaInfo = (metaInfo: MetaInfo): StandardCheckoutPayRequestBuilder => {
    this._metaInfo = metaInfo;
    return this;
  };

  redirectUrl = (redirectUrl: string): StandardCheckoutPayRequestBuilder => {
    this._redirectUrl = redirectUrl;
    return this;
  };

  message = (message: string): StandardCheckoutPayRequestBuilder => {
    this._message = message;
    return this;
  };

  expireAfter = (expireAfter: number): StandardCheckoutPayRequestBuilder => {
    this._expireAfter = expireAfter;
    return this;
  };

  build = (): StandardCheckoutPayRequest => {
    return new StandardCheckoutPayRequest(
      this._merchantOrderId,
      this._amount,
      this._metaInfo,
      this._message,
      this._redirectUrl,
      this._expireAfter
    );
  };
}
