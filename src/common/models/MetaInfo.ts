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

export class MetaInfo {
  public udf1?: string;
  public udf2?: string;
  public udf3?: string;
  public udf4?: string;
  public udf5?: string;

  public constructor(
    udf1: string,
    udf2: string,
    udf3: string,
    udf4: string,
    udf5: string
  ) {
    this.udf1 = udf1;
    this.udf2 = udf2;
    this.udf3 = udf3;
    this.udf4 = udf4;
    this.udf5 = udf5;
  }

  public static builder() {
    return new MetaInfoBuilder();
  }
}

class MetaInfoBuilder {
  private _udf1!: string;
  private _udf2!: string;
  private _udf3!: string;
  private _udf4!: string;
  private _udf5!: string;

  /**
   * SETTERS
   */

  udf1 = (udf1: string): MetaInfoBuilder => {
    this._udf1 = udf1;
    return this;
  };

  udf2 = (udf2: string): MetaInfoBuilder => {
    this._udf2 = udf2;
    return this;
  };

  udf3 = (udf3: string): MetaInfoBuilder => {
    this._udf3 = udf3;
    return this;
  };

  udf4 = (udf4: string): MetaInfoBuilder => {
    this._udf4 = udf4;
    return this;
  };

  udf5 = (udf5: string): MetaInfoBuilder => {
    this._udf5 = udf5;
    return this;
  };

  build = (): MetaInfo => {
    return new MetaInfo(
      this._udf1,
      this._udf2,
      this._udf3,
      this._udf4,
      this._udf5
    );
  };
}
