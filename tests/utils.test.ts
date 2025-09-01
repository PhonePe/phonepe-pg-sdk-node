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

import { Env } from '../src/Env';
import { CommonUtils } from '../src/common/CommonUtils';

describe('Utils Test', () => {
  it('Sha 256 for 5 Parameters for Clients', () => {
    const clientId: string = '';
    const clientSecret: string = '';
    const clientVersion: number = 1;
    const env = Env.SANDBOX;
    const expected =
      'e39cd1485eaa4da69dce15f1b0e11d0c52075500fc062efca139b1f00348f974';
    const result = CommonUtils.calculateSha256({
      clientId: clientId,
      clientSecret: clientSecret,
      clientVersion: clientVersion,
      env: env,
      shouldPublishEvents: false,
    });

    expect(result).toEqual(expected);
  });

  it('Sha 256 for Callback Validity', () => {
    const username = '';
    const password = '';
    const authorization =
      'e7ac0786668e0ff0f02b62bd04f45ff636fd82db63b1104601c975dc005f3a67';

    const result = CommonUtils.calculateSha256({ username, password });

    expect(result).toEqual(authorization);
  });
});
