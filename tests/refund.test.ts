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

import { BadRequest } from '../src/common/exception/Exceptions';
import {
  customCheckoutClient,
  setupBeforeAndAfter,
  standardCheckoutClient,
} from './baseSetup';
import { StandardCheckoutContants } from '../src/payments/v2/standardcheckout/Constants';
import { CustomCheckoutConstants } from '../src/payments/v2/customcheckout/Constants';
import { RefundRequest } from '../src/common/models/request/RefundRequest';

describe('STANDARD_CHECKOUT: REFUND', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = standardCheckoutClient();
  const url = StandardCheckoutContants.REFUND_API;

  it('Refund Successfull', async () => {
    const mockOrderResponse = {
      refundId: 'refundId',
      amount: 100,
      state: 'PENDING',
    };

    mock.onPost(`${hostUrl}${url}`).reply(200, mockOrderResponse);

    const request = RefundRequest.builder()
      .merchantRefundId('merchantRefundId')
      .amount(100)
      .build();

    const result = await client.refund(request);

    expect(result).toEqual(mockOrderResponse);
  });

  it('Refund Failed Due To Bad Request', async () => {
    const mockError = {
      code: 'Refund ID Duplicated',
      data: {},
    };

    mock.onPost(`${hostUrl}${url}`).reply(400, mockError);

    const request = RefundRequest.builder()
      .merchantRefundId('merchantRefundId')
      .amount(100)
      .build();

    try {
      await client.refund(request);
    } catch (error) {
      const badRequestError = error as BadRequest;
      expect(badRequestError).toBeInstanceOf(BadRequest);
      expect(badRequestError.code).toEqual('Refund ID Duplicated');
      expect(badRequestError.httpStatusCode).toEqual(400);
    }
  });
});

describe('CUSTOM_CHECKOUT: REFUND', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = customCheckoutClient();
  const url = CustomCheckoutConstants.REFUND_API;

  it('Refund Successfull', async () => {
    const mockOrderResponse = {
      refundId: 'refundId',
      amount: 100,
      state: 'PENDING',
    };

    mock.onPost(`${hostUrl}${url}`).reply(200, mockOrderResponse);

    const request = RefundRequest.builder()
      .merchantRefundId('merchantRefundId')
      .amount(100)
      .build();

    const result = await client.refund(request);
    expect(result).toEqual(mockOrderResponse);
  });

  it('Refund Failed Due To Bad Request', async () => {
    const mockError = {
      code: 'Refund ID Duplicated',
      data: {},
    };

    mock.onPost(`${hostUrl}${url}`).reply(400, mockError);

    const request = RefundRequest.builder()
      .merchantRefundId('merchantRefundId')
      .amount(100)
      .build();

    try {
      const response = await client.refund(request);
    } catch (error) {
      const badRequestError = error as BadRequest;
      expect(badRequestError).toBeInstanceOf(BadRequest);
      expect(badRequestError.code).toEqual('Refund ID Duplicated');
      expect(badRequestError.httpStatusCode).toEqual(400);
    }
  });
});
