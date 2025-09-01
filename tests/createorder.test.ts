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

import { CreateSdkOrderRequest } from '../src/payments/v2/models/request/CreateSdkOrderRequest';
import {
  customCheckoutClient,
  setupBeforeAndAfter,
  standardCheckoutClient,
} from './baseSetup';
import { StandardCheckoutContants } from '../src/payments/v2/standardcheckout/Constants';
import { CustomCheckoutConstants } from '../src/payments/v2/customcheckout/Constants';

describe('STANDARD_CHECKOUT: CREATE_ORDER', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = standardCheckoutClient();

  it('Create Order Successfull', async () => {
    const mockResponse = {
      orderId: 'orderId',
      expireAt: 3242342,
      state: 'PENDING',
      token: 'token',
    };

    mock
      .onPost(`${hostUrl}${StandardCheckoutContants.CREATE_ORDER_API}`)
      .reply(200, mockResponse);

    const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
      .amount(100)
      .merchantOrderId('merchantOrderId')
      .build();
    const result = await client.createSdkOrder(request);
    expect(result).toEqual(mockResponse);
  });
});

describe('CUSTOM_CHECKOUT: CREATE_ORDER', () => {
  const mock = setupBeforeAndAfter();
  const { client, hostUrl } = customCheckoutClient();

  it('Create Order Successfull', async () => {
    const mockResponse = {
      orderId: 'orderId',
      expireAt: 3242342,
      state: 'PENDING',
      token: 'token',
    };

    mock
      .onPost(`${hostUrl}${CustomCheckoutConstants.CREATE_ORDER_API}`)
      .reply(200, mockResponse);

    const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
      .amount(100)
      .merchantOrderId('merchantOrderId')
      .build();
    const result = await client.createSdkOrder(request);
    expect(result).toEqual(mockResponse);
  });
});
