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

import { BillingAddress } from './BillingAddress';
import { Expiry } from './Expiry';

export class NewCardDetails {
  public encryptedCardNumber!: string;
  public encryptionKeyId!: number;
  public encryptedCvv!: string;
  public expiry!: Expiry;
  public cardHolderName?: string;
  public billingAddress?: BillingAddress;

  public constructor(
    encryptedCardNumber: string,
    encryptedCvv: string,
    encryptionKeyId: number,
    expiry: Expiry,
    cardHolderName?: string
  ) {
    this.encryptedCardNumber = encryptedCardNumber;
    this.encryptedCvv = encryptedCvv;
    this.encryptionKeyId = encryptionKeyId;
    this.expiry = expiry;
    this.cardHolderName = cardHolderName;
  }
  static builder = () => {
    return new NewCardDetailsBuilder();
  };
}

class NewCardDetailsBuilder {
  private _encryptedCardNumber!: string;
  private _encryptionKeyId!: number;
  private _encryptedCvv!: string;
  private _cardHolderName?: string;
  private _expiry!: Expiry;

  /**
   * SETTERS
   */

  encryptedCardNumber = (encryptedCardNumber: string) => {
    this._encryptedCardNumber = encryptedCardNumber;
    return this;
  };

  encryptedCvv = (encryptedCvv: string) => {
    this._encryptedCvv = encryptedCvv;
    return this;
  };

  encryptionKeyId = (encryptionKeyId: number) => {
    this._encryptionKeyId = encryptionKeyId;
    return this;
  };

  expiry = (expiry: Expiry) => {
    this._expiry = expiry;
    return this;
  };

  cardHolderName = (cardHolderName?: string) => {
    this._cardHolderName = cardHolderName;
    return this;
  };

  build = () => {
    return new NewCardDetails(
      this._encryptedCardNumber,
      this._encryptedCvv,
      this._encryptionKeyId,
      this._expiry,
      this._cardHolderName
    );
  };
}
