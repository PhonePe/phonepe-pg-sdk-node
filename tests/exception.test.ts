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

import { PhonePeException } from '../src/common/exception/Exceptions';
import { StandardCheckoutPayRequest } from '../src/payments/v2/models/request/StandardCheckoutPayRequest';
import { StandardCheckoutContants } from '../src/payments/v2/standardcheckout/Constants';
import { setupBeforeAndAfter, standardCheckoutClient } from './baseSetup';

describe('EXCEPTION', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = standardCheckoutClient();

  it('R999', async () => {
    const responseR999 = 'R999';

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .build();

    mock
      .onPost(`${hostUrl}${StandardCheckoutContants.PAY_API}`)
      .reply(503, responseR999);

    try {
      const result = await client.pay(request);
    } catch (error) {
      const phonePeException = error as PhonePeException;
      expect(phonePeException.httpStatusCode).toEqual(503);
    }
  });
});
