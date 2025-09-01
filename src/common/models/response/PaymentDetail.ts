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

import { PgV2InstrumentType } from '../PgV2InstrumentType';
import { InstrumentCombo } from './InstrumentCombo';
import { AccountPaymentInstrumentV2 } from './paymentinstruments/AccountInstrumentV2';
import { UpiPaymentRail } from './rails/UpiPaymentRail';
import { CreditCardPaymentInstrumentV2 } from './paymentinstruments/CreditCardPaymentInstrumentV2';
import { PgPaymentRail } from './rails/PgPaymentRail';
import { DebitCardPaymentInstrumentV2 } from './paymentinstruments/DebitCardPaymentInstrumentV2';
import { EgvPaymentInstrumentV2 } from './paymentinstruments/EgvPaymentInstrumentV2';
import { NetbankingPaymentInstrumentV2 } from './paymentinstruments/NetbankingPaymentInstrumentV2';
import { WalletPaymentInstrumentV2 } from './paymentinstruments/WalletPaymentInstrumentV2';
import { PpiEgvPaymentRail } from './rails/PpiEgvPaymentRail';
import { PpiWalletPaymentRail } from './rails/PpiWalletPaymentRail';

export class PaymentDetail {
  public transactionId!: string;
  public paymentMode!: PgV2InstrumentType;
  public timestamp!: number;
  public amount!: number;
  public state!: string;
  public errorCode?: string;
  public detailedErrorCode?: string;
  public instrument?:
    | AccountPaymentInstrumentV2
    | CreditCardPaymentInstrumentV2
    | DebitCardPaymentInstrumentV2
    | EgvPaymentInstrumentV2
    | NetbankingPaymentInstrumentV2
    | WalletPaymentInstrumentV2;
  public rail?:
    | UpiPaymentRail
    | PgPaymentRail
    | PpiEgvPaymentRail
    | PpiWalletPaymentRail;
  public splitInstruments?: InstrumentCombo[];
}
