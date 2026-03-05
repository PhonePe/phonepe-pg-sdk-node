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

export class PrefillUserLoginDetails {
  public phoneNumber?: string;

  public constructor(phoneNumber?: string) {
    this.phoneNumber = phoneNumber;
  }

  public static builder(): PrefillUserLoginDetailsBuilder {
    return new PrefillUserLoginDetailsBuilder();
  }
}

class PrefillUserLoginDetailsBuilder {
  private _phoneNumber?: string;

  phoneNumber = (phoneNumber: string): PrefillUserLoginDetailsBuilder => {
    this._phoneNumber = phoneNumber;
    return this;
  };

  build = (): PrefillUserLoginDetails => {
    return new PrefillUserLoginDetails(this._phoneNumber);
  };
}
