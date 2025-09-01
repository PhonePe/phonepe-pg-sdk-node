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
import { PaymentV2Instrument } from './PaymentV2Instrument';

import { TokenDetails } from './TokenDetails';

export class TokenPaymentV2Instrument extends PaymentV2Instrument {
  public tokenDetails!: TokenDetails;
  public authMode?: string;
  public merchantUserId?: string;

  public constructor(
    tokenDetails: TokenDetails,
    authMode?: string,
    merchantUserId?: string
  ) {
    super(PgV2InstrumentType.TOKEN);
    this.authMode = authMode;
    this.tokenDetails = tokenDetails;
    this.merchantUserId = merchantUserId;
  }

  static builder = () => {
    return new TokenPaymentV2InstrumentBuilder();
  };
}

class TokenPaymentV2InstrumentBuilder {
  private _tokenDetails!: TokenDetails;
  private _authMode?: string;
  private _merchantUserId?: string;

  tokenDetails = (tokenDetails: TokenDetails) => {
    this._tokenDetails = tokenDetails;
    return this;
  };

  authMode = (authMode?: string) => {
    this._authMode = authMode;
    return this;
  };

  merchantUserId = (merchantUserId?: string) => {
    this._merchantUserId = merchantUserId;
    return this;
  };

  build = () => {
    return new TokenPaymentV2Instrument(
      this._tokenDetails,
      this._authMode,
      this._merchantUserId
    );
  };
}
