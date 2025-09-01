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

export class UpiQrPaymentV2Instrument extends PaymentV2Instrument {
  public constructor() {
    super(PgV2InstrumentType.UPI_QR);
  }

  static builder = () => {
    return new UpiQrPaymentV2InstrumentBuilder();
  };
}

class UpiQrPaymentV2InstrumentBuilder {
  build = () => {
    return new UpiQrPaymentV2Instrument();
  };
}
