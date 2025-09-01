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

describe('STANDARD_CHECKOUT: TRANSACTION_TEST', () => {
  const mock = setupBeforeAndAfter();
  const { client } = standardCheckoutClient();

  it('Transaction Status Successfull', async () => {
    const mockResponse = {
      orderId: 'orderId',
      state: 'PENDING',
      expireAt: 238462442,
      amount: 100,
      paymentDetails: [
        {
          paymentMode: 'UPI_COLLECT',
          transactionId: 'transactionId',
          instrument: {
            type: 'ACCOUNT',
            ifsc: 'ifsc',
          },
        },
      ],
    };

    mock
      .onGet(
        'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/transaction/transactionId/status'
      )
      .reply(200, mockResponse);

    const result = await client.getTransactionStatus('transactionId');

    expect(result).toEqual(mockResponse);
    expect(result.paymentDetails.length).toEqual(1);
  });

  it('Transaction Status Failed Due To Wrong ID', async () => {
    const mockError = {
      code: 'MAPPING_NOT_FOUND',
      message: 'No entry found for Merchant',
      data: {},
    };

    mock
      .onGet(
        'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/transaction/transactionId/status'
      )
      .reply(400, mockError);

    try {
      await client.getTransactionStatus('transactionId');
    } catch (error) {
      const badRequestError = error as BadRequest;
      expect(badRequestError).toBeInstanceOf(BadRequest);
      expect(badRequestError.message).toEqual('No entry found for Merchant');
      expect(badRequestError.code).toEqual('MAPPING_NOT_FOUND');
      expect(badRequestError.httpStatusCode).toEqual(400);
    }
  });
});

describe('CUSTOM_CHECKOUT: TRANSACTION_TEST', () => {
  const mock = setupBeforeAndAfter();
  const { client } = customCheckoutClient();

  it('Transaction Status Successfull', async () => {
    const mockResponse = {
      orderId: 'orderId',
      state: 'PENDING',
      expireAt: 238462442,
      amount: 100,
      paymentDetails: [
        {
          paymentMode: 'UPI_COLLECT',
          transactionId: 'transactionId',
          instrument: {
            type: 'ACCOUNT',
            ifsc: 'ifsc',
          },
        },
      ],
    };

    mock
      .onGet(
        'https://api-preprod.phonepe.com/apis/pg-sandbox/payments/v2/transaction/transactionId/status'
      )
      .reply(200, mockResponse);

    const result = await client.getTransactionStatus('transactionId');

    expect(result).toEqual(mockResponse);
    expect(result.paymentDetails.length).toEqual(1);
  });
});
