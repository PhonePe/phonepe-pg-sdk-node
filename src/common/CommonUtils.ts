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

import { createHash } from 'crypto';

enum SHA_ALGORITHM {
  SHA256 = 'SHA256',
}

export class CommonUtils {
  static calculateSha256(args: object): string {
    const data = Object.values(args).join(':');
    return CommonUtils.shaHex(data, SHA_ALGORITHM.SHA256);
  }

  static shaHex(data: string, algorithm: SHA_ALGORITHM): string {
    switch (algorithm) {
      case SHA_ALGORITHM.SHA256: {
        const hash = createHash('sha256');
        hash.update(data);
        return hash.digest('hex');
      }
      default:
        return data;
    }
  }

  static isCallbackValid(
    username: string,
    password: string,
    authorization: string
  ) {
    const sha256 = this.calculateSha256({ username, password });
    return sha256 == authorization;
  }
}
