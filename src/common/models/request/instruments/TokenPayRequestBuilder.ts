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
import { Expiry } from './Expiry';
import { TokenDetails } from './TokenDetails';
import { TokenPaymentV2Instrument } from './TokenPaymentV2Instrument';
import { PgPaymentFlow } from '../../../../payments/v2/models/request/PgPaymentFlow';

export class TokenPayRequestBuilder {
  private _merchantOrderId!: string;
  private _amount!: number;
  private _encryptionKeyId!: number;
  private _encryptedToken!: string;
  private _encryptedCvv!: string;
  private _cryptogram!: string;
  private _panSuffix!: string;
  private _expiryMonth!: string;
  private _expiryYear!: string;
  private _authMode?: string;
  private _redirectUrl?: string;
  private _cardHolderName?: string;
  private _merchantUserId?: string;
  private _metaInfo?: MetaInfo;
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

  constraints = (constraints: InstrumentConstraint[]) => {
    this._constraints = constraints;
    return this;
  };

  encryptedToken = (encryptedToken: string) => {
    this._encryptedToken = encryptedToken;
    return this;
  };

  authMode = (authMode: string) => {
    this._authMode = authMode;
    return this;
  };

  encryptionKeyId = (encryptionKeyId: number) => {
    this._encryptionKeyId = encryptionKeyId;
    return this;
  };

  panSuffix = (panSuffix: string) => {
    this._panSuffix = panSuffix;
    return this;
  };

  cryptogram = (cryptogram: string) => {
    this._cryptogram = cryptogram;
    return this;
  };

  encryptedCvv = (encryptedCvv: string) => {
    this._encryptedCvv = encryptedCvv;
    return this;
  };

  expiryMonth = (expiryMonth: string) => {
    this._expiryMonth = expiryMonth;
    return this;
  };

  expiryYear = (expiryYear: string) => {
    this._expiryYear = expiryYear;
    return this;
  };

  redirectUrl = (redirectUrl: string) => {
    this._redirectUrl = redirectUrl;
    return this;
  };

  cardHolderName = (cardHolderName: string) => {
    this._cardHolderName = cardHolderName;
    return this;
  };

  merchantUserId = (merchantUserId: string) => {
    this._merchantUserId = merchantUserId;
    return this;
  };

  expireAfter = (expireAfter: number) => {
    this._expireAfter = expireAfter;
    return this;
  };

  build = () => {
    const tokenDetails = TokenDetails.builder()
      .cardHolderName(this._cardHolderName)
      .cryptogram(this._cryptogram)
      .panSuffix(this._panSuffix)
      .expiry(
        Expiry.builder()
          .expiryMonth(this._expiryMonth)
          .expiryYear(this._expiryYear)
          .build()
      )
      .encryptionKeyId(this._encryptionKeyId)
      .encryptedToken(this._encryptedToken)
      .encryptedCvv(this._encryptedCvv)
      .build();
    const paymentFlow = PgPaymentFlow.builder()
      .paymentMode(
        TokenPaymentV2Instrument.builder()
          .tokenDetails(tokenDetails)
          .authMode(this._authMode)
          .merchantUserId(this._merchantUserId)
          .build()
      )
      .redirectUrl(this._redirectUrl)
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
