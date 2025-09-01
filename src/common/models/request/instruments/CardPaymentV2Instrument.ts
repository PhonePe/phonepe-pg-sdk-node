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

import { PgV2InstrumentType } from '../../PgV2InstrumentType';
import { NewCardDetails } from './NewCardDetails';
import { PaymentV2Instrument } from './PaymentV2Instrument';

export class CardPaymentV2Instrument extends PaymentV2Instrument {
  public cardDetails!: NewCardDetails;
  public authMode?: string;
  public savedCard?: boolean;
  public merchantUserId?: string;

  public constructor(
    cardDetails: NewCardDetails,
    authMode?: string,
    merchantUserId?: string,
    savedCard?: boolean
  ) {
    super(PgV2InstrumentType.CARD);
    this.authMode = authMode;
    this.cardDetails = cardDetails;
    this.merchantUserId = merchantUserId;
    this.savedCard = savedCard;
  }

  static builder = () => {
    return new CardPaymentV2InstrumentBuilder();
  };
}

class CardPaymentV2InstrumentBuilder {
  private _cardDetails!: NewCardDetails;
  private _authMode?: string;
  private _savedCard?: boolean;
  private _merchantUserId?: string;

  cardDetails = (cardDetails: NewCardDetails) => {
    this._cardDetails = cardDetails;
    return this;
  };

  authMode = (authMode?: string) => {
    this._authMode = authMode;
    return this;
  };

  savedCard = (savedCard?: boolean) => {
    this._savedCard = savedCard;
    return this;
  };

  merchantUserId = (merchantUserId?: string) => {
    this._merchantUserId = merchantUserId;
    return this;
  };

  build = () => {
    return new CardPaymentV2Instrument(
      this._cardDetails,
      this._authMode,
      this._merchantUserId,
      this._savedCard
    );
  };
}
