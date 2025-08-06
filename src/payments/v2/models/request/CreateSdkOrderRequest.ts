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

import { InstrumentConstraint } from '../../../../common/models/request/InstrumentConstraint';
import { MetaInfo } from '../../../../common/models/MetaInfo';
import { PaymentFlow } from '../../../../common/models/PaymentFlow';
import { PgCheckoutPaymentFlow } from './PgCheckoutPaymentFlow';

/**
 * Creates a request to initiate a order for SDK Integration
 * 1. For Standard Checkout -> CreateSdkOrderRequest.StandardCheckoutBuilder()
 * 2. For Custom Checkout -> CreateSdkOrderRequest.CustomCheckoutBuilder()
 */
export class CreateSdkOrderRequest {
  public merchantOrderId!: string;
  public amount!: number;
  public paymentFlow!: PaymentFlow;
  public metaInfo?: MetaInfo;
  public constraints?: InstrumentConstraint[];
  public expireAfter?: number;

  public constructor(
    merchantOrderId: string,
    amount: number,
    paymentFlow: PaymentFlow,
    metaInfo?: MetaInfo,
    expireAfter?: number,
    constraints?: InstrumentConstraint[]
  ) {
    this.merchantOrderId = merchantOrderId;
    this.amount = amount;
    this.metaInfo = metaInfo;
    this.paymentFlow = paymentFlow;
    this.constraints = constraints;
    this.expireAfter = expireAfter;
  }

  static StandardCheckoutBuilder = () => {
    return new StandardCheckoutBuilder();
  };

  static CustomCheckoutBuilder = () => {
    return new CustomCheckoutBuilder();
  };
}

class CustomCheckoutBuilder {
  private _merchantOrderId!: string;
  private _amount!: number;
  private _metaInfo?: MetaInfo;
  private _message!: string;
  private _redirectUrl!: string;
  private _constraints?: InstrumentConstraint[];
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

  message = (message: string) => {
    this._message = message;
    return this;
  };

  redirectUrl = (redirectUrl: string) => {
    this._redirectUrl = redirectUrl;
    return this;
  };

  constraints = (constraints: InstrumentConstraint[]) => {
    this._constraints = constraints;
    return this;
  };

  expireAfter = (expireAfter: number) => {
    this._expireAfter = expireAfter;
    return this;
  };

  build = () => {
    const paymentFlow = PgCheckoutPaymentFlow.builder()
      .redirectUrl(this._redirectUrl)
      .message(this._message)
      .build();
    return new CreateSdkOrderRequest(
      this._merchantOrderId,
      this._amount,
      paymentFlow,
      this._metaInfo,
      this._expireAfter,
      this._constraints
    );
  };
}

class StandardCheckoutBuilder {
  private _merchantOrderId!: string;
  private _amount!: number;
  private _metaInfo?: MetaInfo;
  private _message!: string;
  private _redirectUrl!: string;
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

  message = (message: string) => {
    this._message = message;
    return this;
  };

  redirectUrl = (redirectUrl: string) => {
    this._redirectUrl = redirectUrl;
    return this;
  };

  expireAfter = (expireAfter: number) => {
    this._expireAfter = expireAfter;
    return this;
  };

  build = () => {
    const paymentFlow = PgCheckoutPaymentFlow.builder()
      .redirectUrl(this._redirectUrl)
      .message(this._message)
      .build();
    return new CreateSdkOrderRequest(
      this._merchantOrderId,
      this._amount,
      paymentFlow,
      this._metaInfo,
      this._expireAfter
    );
  };
}
