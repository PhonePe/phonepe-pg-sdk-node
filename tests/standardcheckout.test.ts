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
import { PhonePeException } from '../src/common/exception/Exceptions';
import { TokenService } from '../src/common/tokenhandler/TokenService';
import { setupBeforeAndAfter, standardCheckoutClient } from './baseSetup';

describe('STANDARD_CHECKOUT: SINGLETON TEST', () => {
  const mock = setupBeforeAndAfter();

  it('Sigleton via Get Instance', async () => {
    const { client: client1 } = standardCheckoutClient();
    const { client: client2 } = standardCheckoutClient();
    expect(client1).toEqual(client2);
  });

  it('Singleton with Different Parameters', async () => {
    const { client: client1 } = standardCheckoutClient();

    try {
      const { client: client2 } = standardCheckoutClient('clientId1');
    } catch (error) {
      const phonePeException = (await error) as PhonePeException;
      expect(phonePeException.message).toEqual(
        'Cannot re-initialize StandardCheckoutClient. Please utilize the existing client object with required credentials'
      );
    }
  });

  it('Multiple Client but Single Auth Call', async () => {
    TokenService.oAuthResponse = null;
    const req = StandardCheckoutPayRequest.builder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .build();

    const payResponse = {
      state: 'PENDING',
      orderId: 'orderId',
      expireAt: 4353534,
    };
    const time = Math.floor(Date.now() / 1000);

    const mockOAuthResponse = {
      access_token: 'access_token',
      encrypted_access_token: 'encrypted_access_token',
      issued_at: time,
      expires_at: time + 6,
      token_type: 'token_type',
    };

    mock
      .onPost('https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token')
      .reply(200, mockOAuthResponse);

    const { client: client1 } = standardCheckoutClient();
    const { client: client2 } = standardCheckoutClient();
    const { client: client3 } = standardCheckoutClient();
    const { client: client4 } = standardCheckoutClient();

    mock
      .onPost('https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay')
      .reply(200, payResponse);

    let response = await client1.pay(req);
    response = await client2.pay(req);
    response = await client3.pay(req);
    response = await client4.pay(req);

    const authCalls = mock.history.post.filter(
      (call) =>
        call.url ==
        'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token'
    );

    const payCalls = mock.history.post.filter(
      (call) =>
        call.url ==
        'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay'
    );

    expect(authCalls.length).toEqual(1); //Only one OAuth fetch call
    expect(payCalls.length).toEqual(4);
    expect(response).toEqual(payResponse);
  });
});
