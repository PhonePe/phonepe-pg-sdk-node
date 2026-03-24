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
  public udf6?: string;
  public udf7?: string;
  public udf8?: string;
  public udf9?: string;
  public udf10?: string;
  public udf11?: string;
  public udf12?: string;
  public udf13?: string;
  public udf14?: string;
  public udf15?: string;

  public constructor(
    udf1?: string,
    udf2?: string,
    udf3?: string,
    udf4?: string,
    udf5?: string,
    udf6?: string,
    udf7?: string,
    udf8?: string,
    udf9?: string,
    udf10?: string,
    udf11?: string,
    udf12?: string,
    udf13?: string,
    udf14?: string,
    udf15?: string
  ) {
    this.udf1 = udf1;
    this.udf2 = udf2;
    this.udf3 = udf3;
    this.udf4 = udf4;
    this.udf5 = udf5;
    this.udf6 = udf6;
    this.udf7 = udf7;
    this.udf8 = udf8;
    this.udf9 = udf9;
    this.udf10 = udf10;
    this.udf11 = udf11;
    this.udf12 = udf12;
    this.udf13 = udf13;
    this.udf14 = udf14;
    this.udf15 = udf15;
  }

  public static builder() {
    return new MetaInfoBuilder();
  }
}

class MetaInfoBuilder {
  private _udf1?: string;
  private _udf2?: string;
  private _udf3?: string;
  private _udf4?: string;
  private _udf5?: string;
  private _udf6?: string;
  private _udf7?: string;
  private _udf8?: string;
  private _udf9?: string;
  private _udf10?: string;
  private _udf11?: string;
  private _udf12?: string;
  private _udf13?: string;
  private _udf14?: string;
  private _udf15?: string;

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

  udf6 = (udf6: string): MetaInfoBuilder => {
    this._udf6 = udf6;
    return this;
  };

  udf7 = (udf7: string): MetaInfoBuilder => {
    this._udf7 = udf7;
    return this;
  };

  udf8 = (udf8: string): MetaInfoBuilder => {
    this._udf8 = udf8;
    return this;
  };

  udf9 = (udf9: string): MetaInfoBuilder => {
    this._udf9 = udf9;
    return this;
  };

  udf10 = (udf10: string): MetaInfoBuilder => {
    this._udf10 = udf10;
    return this;
  };

  udf11 = (udf11: string): MetaInfoBuilder => {
    this._udf11 = udf11;
    return this;
  };

  udf12 = (udf12: string): MetaInfoBuilder => {
    this._udf12 = udf12;
    return this;
  };

  udf13 = (udf13: string): MetaInfoBuilder => {
    this._udf13 = udf13;
    return this;
  };

  udf14 = (udf14: string): MetaInfoBuilder => {
    this._udf14 = udf14;
    return this;
  };

  udf15 = (udf15: string): MetaInfoBuilder => {
    this._udf15 = udf15;
    return this;
  };

  build = (): MetaInfo => {
    this.validateSize('udf1', this._udf1, 256);
    this.validateSize('udf2', this._udf2, 256);
    this.validateSize('udf3', this._udf3, 256);
    this.validateSize('udf4', this._udf4, 256);
    this.validateSize('udf5', this._udf5, 256);
    this.validateSize('udf6', this._udf6, 256);
    this.validateSize('udf7', this._udf7, 256);
    this.validateSize('udf8', this._udf8, 256);
    this.validateSize('udf9', this._udf9, 256);
    this.validateSize('udf10', this._udf10, 256);
    this.validateSizeAndPattern('udf11', this._udf11, 50);
    this.validateSizeAndPattern('udf12', this._udf12, 50);
    this.validateSizeAndPattern('udf13', this._udf13, 50);
    this.validateSizeAndPattern('udf14', this._udf14, 50);
    this.validateSizeAndPattern('udf15', this._udf15, 50);
    return new MetaInfo(
      this._udf1,
      this._udf2,
      this._udf3,
      this._udf4,
      this._udf5,
      this._udf6,
      this._udf7,
      this._udf8,
      this._udf9,
      this._udf10,
      this._udf11,
      this._udf12,
      this._udf13,
      this._udf14,
      this._udf15
    );
  };

  private validateSize = (field: string, value: string | undefined, max: number): void => {
    if (value !== undefined && value.length > max) {
      throw new Error(`${field} exceeds maximum allowed size of ${max} characters`);
    }
  };

  private static readonly RESTRICTED_PATTERN = /^[a-zA-Z0-9_\- @.+]*$/;

  private validateSizeAndPattern = (field: string, value: string | undefined, max: number): void => {
    if (value === undefined) return;
    if (value.length > max) {
      throw new Error(`${field} exceeds maximum allowed size of ${max} characters`);
    }
    if (!MetaInfoBuilder.RESTRICTED_PATTERN.test(value)) {
      throw new Error(
        `${field} should only contain alphanumeric characters, underscores, hyphens, spaces, @, ., and +`
      );
    }
  };
}
