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

import { InstrumentConstraint } from './InstrumentConstraint';
import { PaymentInstrumentType } from './PaymentInstrumentType';

/**
 * Used to create an Account Constraint which can be send with the pay request
 */
export class AccountConstraint extends InstrumentConstraint {
  public accountNumber!: string;
  public ifsc!: string;

  public constructor(accountNumber: string, ifsc: string) {
    super(PaymentInstrumentType.ACCOUNT);
    this.accountNumber = accountNumber;
    this.ifsc = ifsc;
  }

  static builder = () => {
    return new AccountConstraintBuilder();
  };
}

class AccountConstraintBuilder {
  private _accountNumber!: string;
  private _ifsc!: string;

  accountNumber = (accountNumber: string) => {
    this._accountNumber = accountNumber;
    return this;
  };

  ifsc = (ifsc: string) => {
    this._ifsc = ifsc;
    return this;
  };

  build = () => {
    return new AccountConstraint(this._accountNumber, this._ifsc);
  };
}
