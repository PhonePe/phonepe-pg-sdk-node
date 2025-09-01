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

export class DeviceContext {
  public deviceOS?: string;
  public merchantCallBackScheme?: string;

  public constructor(deviceOS?: string, merchantCallBackScheme?: string) {
    this.deviceOS = deviceOS;
    this.merchantCallBackScheme = merchantCallBackScheme;
  }

  static builder() {
    return new DeviceContextBuilder();
  }
}

class DeviceContextBuilder {
  private _deviveOS?: string;
  private _merchantCallBackScheme?: string;

  /**
   * SETTERS
   */
  deviceOS = (deviceOS?: string): DeviceContextBuilder => {
    this._deviveOS = deviceOS;
    return this;
  };

  merchantCallBackScheme = (
    merchantCallBackScheme?: string
  ): DeviceContextBuilder => {
    this._merchantCallBackScheme = merchantCallBackScheme;
    return this;
  };

  build = (): DeviceContext => {
    return new DeviceContext(this._deviveOS, this._merchantCallBackScheme);
  };
}
