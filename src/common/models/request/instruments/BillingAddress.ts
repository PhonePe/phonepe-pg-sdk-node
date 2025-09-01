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

export class BillingAddress {
  public line1?: string;
  public line2?: string;
  public city?: string;
  public state?: string;
  public zip?: string;
  public country?: string;

  public constructor(
    line1?: string,
    line2?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string
  ) {
    this.line1 = line1;
    this.line2 = line2;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.country = country;
  }

  static builder() {
    return new BillingAddressBuilder();
  }
}

class BillingAddressBuilder {
  private _line1?: string;
  private _line2?: string;
  private _city?: string;
  private _state?: string;
  private _zip?: string;
  private _country?: string;

  /**
   * SETTERS
   */

  line1 = (line1: string) => {
    this._line1 = line1;
  };

  line2 = (line2: string) => {
    this._line2 = line2;
  };

  city = (city: string) => {
    this._city = city;
  };

  state = (state: string) => {
    this._state = state;
  };

  zip = (zip: string) => {
    this._zip = zip;
  };

  country = (country: string) => {
    this._country = country;
  };

  build = () => {
    return new BillingAddress(
      this._line1,
      this._line2,
      this._city,
      this._state,
      this._zip,
      this._country
    );
  };
}
