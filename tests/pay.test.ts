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

import { StandardCheckoutPayRequest } from '../src/payments/v2/models/request/StandardCheckoutPayRequest';
import { BadRequest } from '../src/common/exception/Exceptions';
import { CustomCheckoutPayRequest } from '../src/payments/v2/models/request/CustomCheckoutPayRequest';
import {
  customCheckoutClient,
  setupBeforeAndAfter,
  standardCheckoutClient,
} from './baseSetup';
import { StandardCheckoutContants } from '../src/payments/v2/standardcheckout/Constants';
import { CustomCheckoutConstants } from '../src/payments/v2/customcheckout/Constants';

describe('STANDARD_CHECKOUT: PAY', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = standardCheckoutClient();
  const url = StandardCheckoutContants.PAY_API;

  it('pay successfull', async () => {
    const mockPayResponse = {
      orderId: 'orderId',
      state: 'PENDING',
      expireAt: 238462442,
      redirectUrl: 'redirectUrl',
    };

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .build();
    mock.onPost(`${hostUrl}${url}`).reply(200, mockPayResponse);

    const result = await client.pay(request);

    expect(result).toEqual(mockPayResponse);
  });

  it('pay failed due to bad request', async () => {
    const mockError = {
      code: 'BAD_REQUEST',
      message: 'merchantOrderId must not be blank.',
      data: {},
    };

    mock.onPost(`${hostUrl}${url}`).reply(400, mockError);

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .build();

    try {
      await client.pay(request);
    } catch (error) {
      const badRequestError = error as BadRequest;
      expect(error).toBeInstanceOf(BadRequest);
      expect(badRequestError).toBeInstanceOf(BadRequest);
      expect(badRequestError.message).toBe(
        'merchantOrderId must not be blank.'
      );
      expect(badRequestError.httpStatusCode).toBe(400);
    }
  });
});

describe('CUSTOM_CHECKOUT: PAY', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = customCheckoutClient();

  it('pay successfull for UPI_INTENT', async () => {
    const mockPayResponse = {
      orderId: 'orderId',
      state: 'PENDING',
      expireAt: 238462442,
      intentUrl: 'intentUrl',
    };

    const request = CustomCheckoutPayRequest.UpiIntentPayRequestBuilder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .deviceOS('IOS')
      .targetApp('PHONEPE')
      .build();

    mock
      .onPost(`${hostUrl}${CustomCheckoutConstants.PAY_API}`)
      .reply(200, mockPayResponse);

    const result = await client.pay(request);

    expect(result).toEqual(mockPayResponse);
  });
});
