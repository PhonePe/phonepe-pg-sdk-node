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

import { Headers } from '../src/common/constants/Headers';
import { version } from '../package.json';

describe('Headers', () => {
  it('should derive SDK_VERSION from package.json', () => {
    expect(Headers.SDK_VERSION).toBe(version);
  });

  it('should keep SDK_VERSION in sync when package.json version changes', () => {
    // Ensures no hardcoded version diverges from the package manifest
    expect(Headers.SDK_VERSION).toMatch(/^\d+\.\d+\.\d+/);
    expect(Headers.SDK_VERSION).toBe(version);
  });
});
