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

import {
  customCheckoutClient,
  setupBeforeAndAfter,
  standardCheckoutClient,
} from './baseSetup';
import { StandardCheckoutContants } from '../src/payments/v2/standardcheckout/Constants';
import { CustomCheckoutConstants } from '../src/payments/v2/customcheckout/Constants';

describe('STANDARD_CHECKOUT: REFUND_STATUS', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = standardCheckoutClient();

  it('Refund Status Successfull', async () => {
    const mockResponse = {
      merchantRefundId: 'refundId',
      amount: 100,
      state: 'PENDING',
      paymentDetails: [
        {
          paymentMode: 'UPI_COLLECT',
          timestamp: 34234324,
        },
      ],
    };

    const refundId = 'refundId';
    const url = StandardCheckoutContants.REFUND_STATUS_API.replace(
      '{REFUND_ID}',
      refundId
    );
    mock.onGet(`${hostUrl}${url}`).reply(200, mockResponse);

    const result = await client.getRefundStatus('refundId');
    expect(result).toEqual(mockResponse);
  });
});

describe('CUSTOM_CHECKOUT: REFUND_STATUS', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = customCheckoutClient();

  it('Refund Status Successfull', async () => {
    const mockResponse = {
      merchantRefundId: 'refundId',
      amount: 100,
      state: 'PENDING',
      paymentDetails: [
        {
          paymentMode: 'UPI_COLLECT',
          timestamp: 34234324,
        },
      ],
    };
    const refundId = 'refundId';
    const url = CustomCheckoutConstants.REFUND_STATUS_API.replace(
      '{REFUND_ID}',
      refundId
    );
    mock.onGet(`${hostUrl}${url}`).reply(200, mockResponse);

    const result = await client.getRefundStatus(refundId);
    expect(result).toEqual(mockResponse);
  });
});
