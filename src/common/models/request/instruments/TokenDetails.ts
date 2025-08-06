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

import { Expiry } from './Expiry';

export class TokenDetails {
  public encryptedToken!: string;
  public encryptedCvv!: string;
  public encryptionKeyId!: number;
  public expiry!: Expiry;
  public cryptogram!: string;
  public panSuffix!: string;
  public cardHolderName?: string;
  public eci?: string;
  public atc?: string;

  public constructor(
    encryptedToken: string,
    encryptedCvv: string,
    encryptionKeyId: number,
    expiry: Expiry,
    cryptogram: string,
    panSuffix: string,
    cardHolderName?: string,
    eci?: string,
    atc?: string
  ) {
    this.encryptedToken = encryptedToken;
    this.encryptedCvv = encryptedCvv;
    this.encryptionKeyId = encryptionKeyId;
    this.expiry = expiry;
    this.cryptogram = cryptogram;
    this.panSuffix = panSuffix;
    this.cardHolderName = cardHolderName;
    this.eci = eci;
    this.atc = atc;
  }

  static builder = () => {
    return new TokenDetailsBuilder();
  };
}

class TokenDetailsBuilder {
  private _encryptedToken!: string;
  private _encryptedCvv!: string;
  private _encryptionKeyId!: number;
  private _expiry!: Expiry;
  private _cryptogram!: string;
  private _panSuffix!: string;
  private _cardHolderName?: string;
  private _eci?: string;
  private _atc?: string;

  /**
   * SETTERS
   */

  encryptedToken = (encryptedToken: string) => {
    this._encryptedToken = encryptedToken;
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

  cryptogram = (cryptogram: string) => {
    this._cryptogram = cryptogram;
    return this;
  };

  panSuffix = (panSuffix: string) => {
    this._panSuffix = panSuffix;
    return this;
  };

  cardHolderName = (cardHolderName?: string) => {
    this._cardHolderName = cardHolderName;
    return this;
  };

  eci = (eci: string) => {
    this._eci = eci;
    return this;
  };

  atc = (atc: string) => {
    this._atc = atc;
    return this;
  };

  build = () => {
    return new TokenDetails(
      this._encryptedToken,
      this._encryptedCvv,
      this._encryptionKeyId,
      this._expiry,
      this._cryptogram,
      this._panSuffix,
      this._cardHolderName,
      this._eci,
      this._atc
    );
  };
}
