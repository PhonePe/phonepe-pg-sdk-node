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
import { CollectPaymentDetails } from './CollectPaymentDetails';
import { PaymentV2Instrument } from './PaymentV2Instrument';

export class CollectPaymentV2Instrument extends PaymentV2Instrument {
  public details!: CollectPaymentDetails;
  public message?: string;

  public constructor(details: CollectPaymentDetails, message?: string) {
    super(PgV2InstrumentType.UPI_COLLECT);
    this.details = details;
    this.message = message;
  }

  static builder = () => {
    return new CollectPaymentV2InstrumentBuilder();
  };
}

class CollectPaymentV2InstrumentBuilder {
  private _details!: CollectPaymentDetails;
  private _message?: string;

  /**
   * SETTERS
   */

  details = (details: CollectPaymentDetails) => {
    this._details = details;
    return this;
  };

  message = (message?: string) => {
    this._message = message;
    return this;
  };

  build = () => {
    return new CollectPaymentV2Instrument(this._details, this._message);
  };
}
