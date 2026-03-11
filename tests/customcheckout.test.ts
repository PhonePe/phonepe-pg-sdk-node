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
import { TokenService } from '../src/common/tokenhandler/TokenService';
import { CustomCheckoutPayRequest } from '../src/payments/v2/models/request/CustomCheckoutPayRequest';
import { customCheckoutClient, setupBeforeAndAfter } from './baseSetup';
import { Headers } from '../src/common/constants/Headers';
import { CustomCheckoutConstants } from '../src/payments/v2/customcheckout/Constants';
import { EnvConfig } from '../src/EnvConfig';
import { Env } from '../src/Env';

// Single shared mock adapter for the entire file so all axios.create() instances
// (including the singleton client) use the same adapter and history.
const mock = setupBeforeAndAfter();

describe('CUSTOM_CHECKOUT: SINGLETON TEST', () => {

  it('Singleton via Get Instance', async () => {
    const { client: client1 } = customCheckoutClient();
    const { client: client2 } = customCheckoutClient();
    expect(client1).toEqual(client2);
  });

  it('Singleton with Different Parameters', async () => {
    const { client: client1 } = customCheckoutClient();

    try {
      const { client: client2 } = customCheckoutClient('clientId2');
    } catch (error) {
      const phonePeException = error as PhonePeException;
      expect(phonePeException.message).toEqual(
        'Cannot re-initialize CustomCheckoutClient. Please utilize the existing client object with required credentials'
      );
    }
  });

  it('Multiple Client but Single Auth Call', async () => {
    const req = CustomCheckoutPayRequest.UpiIntentPayRequestBuilder()
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
      expires_at: time + 3600, // 1 hour validity to avoid race with background event publisher
      token_type: 'token_type',
    };

    mock
      .onPost('https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token')
      .reply(200, mockOAuthResponse);

    const { client: client1 } = customCheckoutClient();
    const { client: client2 } = customCheckoutClient();
    const { client: client3 } = customCheckoutClient();
    const { client: client4 } = customCheckoutClient();

    mock
      .onPost('https://api-preprod.phonepe.com/apis/pg-sandbox/payments/v2/pay')
      .reply(200, payResponse);

    // Reset token and history immediately before pay() calls so any background
    // event-publisher activity is excluded from the assertion window.
    TokenService.oAuthResponse = null;
    mock.resetHistory();

    try {
      let response = await client1.pay(req);
      response = await client2.pay(req);
      response = await client3.pay(req);
      response = await client4.pay(req);
    } catch (error) {}
    const authCalls = mock.history.post.filter(
      (call) =>
        call.url ==
        'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token'
    );

    const payCalls = mock.history.post.filter(
      (call) =>
        call.url ==
        'https://api-preprod.phonepe.com/apis/pg-sandbox/payments/v2/pay'
    );

    expect(authCalls.length).toEqual(1); //Only one OAuth fetch call
    expect(payCalls.length).toEqual(4);
  });
});

describe('CUSTOM_CHECKOUT: X-DEVICE-OS HEADER TESTS', () => {
  const payUrl = `${EnvConfig.getBaseUrls(Env.SANDBOX).pgHostUrl}${CustomCheckoutConstants.PAY_API}`;

  const mockPayResponse = {
    state: 'PENDING',
    orderId: 'orderId',
    expireAt: 4353534,
  };

  it('sends x-device-os header for UPI_COLLECT request', async () => {
    const { client } = customCheckoutClient();
    const payRequest = CustomCheckoutPayRequest.UpiCollectPayViaVpaRequestBuilder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .vpa('test@upi')
      .deviceOS('ANDROID')
      .build();

    mock.onPost(payUrl).reply(200, mockPayResponse);

    try {
      await client.pay(payRequest);
    } catch (error) {}

    const payCall = mock.history.post.find((call) => call.url === payUrl);
    expect(payCall!.headers![Headers.X_DEVICE_OS]).toEqual('ANDROID');
  });

  it('does not send x-device-os header when not set', async () => {
    const { client } = customCheckoutClient();
    const payRequest = CustomCheckoutPayRequest.UpiCollectPayViaVpaRequestBuilder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .vpa('test@upi')
      .build();

    mock.onPost(payUrl).reply(200, mockPayResponse);

    try {
      await client.pay(payRequest);
    } catch (error) {}

    const payCall = mock.history.post.find((call) => call.url === payUrl);
    expect(payCall!.headers![Headers.X_DEVICE_OS]).toBeUndefined();
  });

  it('x-device-os is not in JSON request body', async () => {
    const { client } = customCheckoutClient();
    const payRequest = CustomCheckoutPayRequest.UpiCollectPayViaVpaRequestBuilder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .vpa('test@upi')
      .deviceOS('ANDROID')
      .build();

    mock.onPost(payUrl).reply(200, mockPayResponse);

    try {
      await client.pay(payRequest);
    } catch (error) {}

    const payCall = mock.history.post.find((call) => call.url === payUrl);
    const requestBody = JSON.parse(payCall!.data);
    expect(requestBody).not.toHaveProperty('deviceOS');
  });
});
