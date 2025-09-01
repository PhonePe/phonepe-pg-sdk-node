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

export class Expiry {
  public month!: string;
  public year!: string;

  public constructor(month: string, year: string) {
    this.month = month;
    this.year = year;
  }

  static builder = () => {
    return new ExpiryBuilder();
  };
}

class ExpiryBuilder {
  private _expiryMonth!: string;
  private _expiryYear!: string;

  expiryMonth = (expiryMonth: string) => {
    this._expiryMonth = expiryMonth;
    return this;
  };

  expiryYear = (expiryYear: string) => {
    this._expiryYear = expiryYear;
    return this;
  };

  build = () => {
    return new Expiry(this._expiryMonth, this._expiryYear);
  };
}
