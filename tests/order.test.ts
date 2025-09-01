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

describe('STANDARD_CHECKOUT: ORDER_STATUS', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = standardCheckoutClient();
  const orderId = 'orderId';
  const url: string = StandardCheckoutContants.ORDER_STATUS_API.replace(
    '{ORDER_ID}',
    orderId
  );

  it('Order Status Successfull', async () => {
    const mockOrderResponse = {
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

    mock.onGet(`${hostUrl}${url}?details=false`).reply(200, mockOrderResponse);
    const result = await client.getOrderStatus(orderId, false);

    expect(result).toEqual(mockOrderResponse);
  });

  it('Multiple Payment Tries ', async () => {
    const mockOrderResponse = {
      orderId: 'orderId',
      state: 'COMPLETED',
      expireAt: 238462442,
      amount: 100,
      paymentDetails: [
        {
          paymentMode: 'UPI_COLLECT',
          transactionId: 'transactionId',
          errorCode: 'errorCode',
          detailedErrorCode: 'detailedErrorCode',
          instrument: {
            type: 'ACCOUNT',
            ifsc: 'ifsc',
          },
        },
        {
          paymentMode: 'UPI_INTENT',
          transactionId: 'transactionId',
          state: 'COMPLETED',
          instrument: {
            type: 'ACCOUNT',
            accountHolderName: 'name',
          },
          rail: {
            type: 'PG',
            authorizationCode: 'code',
          },
        },
      ],
    };

    mock.onGet(`${hostUrl}${url}?details=true`).reply(200, mockOrderResponse);

    const result = await client.getOrderStatus(orderId, true);

    expect(result).toEqual(mockOrderResponse);
    expect(result.paymentDetails.length).toEqual(2);
    expect(result.paymentDetails[0].paymentMode).toEqual('UPI_COLLECT');
    expect(result.paymentDetails[1].paymentMode).toEqual('UPI_INTENT');
  });

  it('Split Instruments ', async () => {
    const mockOrderResponse = {
      orderId: 'orderId',
      state: 'COMPLETED',
      expireAt: 238462442,
      amount: 100,
      paymentDetails: [
        {
          paymentMode: 'UPI_COLLECT',
          transactionId: 'transactionId',
          errorCode: 'errorCode',
          detailedErrorCode: 'detailedErrorCode',
          instrument: {
            type: 'ACCOUNT',
            ifsc: 'ifsc',
          },
          splitInstruments: [
            {
              instrument: {
                type: 'ACCOUNT',
                accountHolderName: 'name',
              },
              rail: {
                type: 'PG',
                authorizationCode: 'code',
              },
              amount: 100,
            },
          ],
        },
      ],
    };

    mock.onGet(`${hostUrl}${url}?details=true`).reply(200, mockOrderResponse);

    const result = await client.getOrderStatus(orderId, true);

    expect(result).toEqual(mockOrderResponse);
    expect(result.paymentDetails.length).toEqual(1);
    if (result.paymentDetails[0].splitInstruments != null) {
      expect(
        result.paymentDetails[0].splitInstruments[0].instrument?.type
      ).toEqual('ACCOUNT');
      expect(result.paymentDetails[0].splitInstruments[0].rail?.type).toEqual(
        'PG'
      );
      expect(result.paymentDetails[0].splitInstruments[0].amount).toEqual(100);
    }
  });

  it('Order Status Failed Due To Wrong Order ID', async () => {
    const mockError = {
      code: 'MERCHANT_ORDER_MAPPING_NOT_FOUND',
      message: 'No entry found for Merchant',
      data: {},
    };

    mock.onGet(`${hostUrl}${url}?details=false`).reply(400, mockError);

    try {
      await client.getOrderStatus(orderId, false);
    } catch (error) {
      const badRequestError = error as BadRequest;
      expect(badRequestError).toBeInstanceOf(BadRequest);
      expect(badRequestError.message).toEqual('No entry found for Merchant');
      expect(badRequestError.code).toEqual('MERCHANT_ORDER_MAPPING_NOT_FOUND');
      expect(badRequestError.httpStatusCode).toEqual(400);
    }
  });
});

describe('CUSTOM_CHECKOUT: ORDER_STATUS', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = customCheckoutClient();
  const orderId = 'orderId';

  it('Order Status Successfull', async () => {
    const mockOrderResponse = {
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
    const url: string = CustomCheckoutConstants.ORDER_STATUS_API.replace(
      '{ORDER_ID}',
      orderId
    );

    mock.onGet(`${hostUrl}${url}?details=false`).reply(200, mockOrderResponse);

    const result = await client.getOrderStatus(orderId, false);

    expect(result).toEqual(mockOrderResponse);
  });
});
