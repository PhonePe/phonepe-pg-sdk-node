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

import { MetaInfo } from '../src/common/models/MetaInfo';

describe('MetaInfo: BUILDER TESTS', () => {
  it('builds MetaInfo with all 15 udf fields set correctly', () => {
    const metaInfo = MetaInfo.builder()
      .udf1('val1')
      .udf2('val2')
      .udf3('val3')
      .udf4('val4')
      .udf5('val5')
      .udf6('val6')
      .udf7('val7')
      .udf8('val8')
      .udf9('val9')
      .udf10('val10')
      .udf11('val11')
      .udf12('val12')
      .udf13('val13')
      .udf14('val14')
      .udf15('val15')
      .build();

    expect(metaInfo.udf1).toBe('val1');
    expect(metaInfo.udf2).toBe('val2');
    expect(metaInfo.udf3).toBe('val3');
    expect(metaInfo.udf4).toBe('val4');
    expect(metaInfo.udf5).toBe('val5');
    expect(metaInfo.udf6).toBe('val6');
    expect(metaInfo.udf7).toBe('val7');
    expect(metaInfo.udf8).toBe('val8');
    expect(metaInfo.udf9).toBe('val9');
    expect(metaInfo.udf10).toBe('val10');
    expect(metaInfo.udf11).toBe('val11');
    expect(metaInfo.udf12).toBe('val12');
    expect(metaInfo.udf13).toBe('val13');
    expect(metaInfo.udf14).toBe('val14');
    expect(metaInfo.udf15).toBe('val15');
  });

  it('udf6 through udf15 are undefined by default when not set', () => {
    const metaInfo = MetaInfo.builder()
      .udf1('val1')
      .udf2('val2')
      .udf3('val3')
      .udf4('val4')
      .udf5('val5')
      .build();

    expect(metaInfo.udf1).toBe('val1');
    expect(metaInfo.udf2).toBe('val2');
    expect(metaInfo.udf3).toBe('val3');
    expect(metaInfo.udf4).toBe('val4');
    expect(metaInfo.udf5).toBe('val5');
    expect(metaInfo.udf6).toBeUndefined();
    expect(metaInfo.udf7).toBeUndefined();
    expect(metaInfo.udf8).toBeUndefined();
    expect(metaInfo.udf9).toBeUndefined();
    expect(metaInfo.udf10).toBeUndefined();
    expect(metaInfo.udf11).toBeUndefined();
    expect(metaInfo.udf12).toBeUndefined();
    expect(metaInfo.udf13).toBeUndefined();
    expect(metaInfo.udf14).toBeUndefined();
    expect(metaInfo.udf15).toBeUndefined();
  });

  it('can set udf11 through udf15 independently', () => {
    const metaInfo = MetaInfo.builder()
      .udf11('eleven')
      .udf12('twelve')
      .udf13('thirteen')
      .udf14('fourteen')
      .udf15('fifteen')
      .build();

    expect(metaInfo.udf1).toBeUndefined();
    expect(metaInfo.udf5).toBeUndefined();
    expect(metaInfo.udf10).toBeUndefined();
    expect(metaInfo.udf11).toBe('eleven');
    expect(metaInfo.udf12).toBe('twelve');
    expect(metaInfo.udf13).toBe('thirteen');
    expect(metaInfo.udf14).toBe('fourteen');
    expect(metaInfo.udf15).toBe('fifteen');
  });
});
