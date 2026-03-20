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

import { CustomCheckoutPayRequest } from '../src/payments/v2/models/request/CustomCheckoutPayRequest';
import { customCheckoutClient, setupBeforeAndAfter } from './baseSetup';
import { CustomCheckoutConstants } from '../src/payments/v2/customcheckout/Constants';
import { EnvConfig } from '../src/EnvConfig';
import { Env } from '../src/Env';
import { Headers } from '../src/common/constants/Headers';

const mock = setupBeforeAndAfter();

describe('CUSTOM_CHECKOUT: PCI HOST ROUTING TESTS', () => {
  const envConfig = EnvConfig.getBaseUrls(Env.SANDBOX);
  const pciPayUrl = `${envConfig.pciPgHostUrl}${CustomCheckoutConstants.PAY_API}`;
  const defaultPayUrl = `${envConfig.pgHostUrl}${CustomCheckoutConstants.PAY_API}`;

  const mockPayResponse = {
    state: 'PENDING',
    orderId: 'orderId',
    expireAt: 4353534,
  };

  it('Card instrument pay request uses PCI host URL', async () => {
    const { client } = customCheckoutClient();

    const payRequest = CustomCheckoutPayRequest.CardPayRequestBuilder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .encryptionKeyId(1)
      .encryptedCardNumber('encryptedCardNumber')
      .encryptedCvv('encryptedCvv')
      .expiryMonth('12')
      .expiryYear('2030')
      .build();

    mock.onPost(pciPayUrl).reply(200, mockPayResponse);

    try {
      const response = await client.pay(payRequest);
      expect(response).toBeDefined();
    } catch (error) {}

    const payCall = mock.history.post.find((call) => call.url === pciPayUrl);
    expect(payCall).toBeDefined();
  });

  it('Token instrument pay request uses PCI host URL', async () => {
    const { client } = customCheckoutClient();

    const payRequest = CustomCheckoutPayRequest.TokenPayRequestBuilder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .encryptionKeyId(1)
      .encryptedToken('encryptedToken')
      .encryptedCvv('encryptedCvv')
      .cryptogram('cryptogram')
      .panSuffix('1234')
      .expiryMonth('12')
      .expiryYear('2030')
      .build();

    mock.onPost(pciPayUrl).reply(200, mockPayResponse);

    try {
      const response = await client.pay(payRequest);
      expect(response).toBeDefined();
    } catch (error) {}

    const payCall = mock.history.post.find((call) => call.url === pciPayUrl);
    expect(payCall).toBeDefined();
  });

  it('UPI collect pay request uses default host URL', async () => {
    const { client } = customCheckoutClient();

    const payRequest = CustomCheckoutPayRequest.UpiCollectPayViaVpaRequestBuilder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .vpa('test@upi')
      .build();

    mock.onPost(defaultPayUrl).reply(200, mockPayResponse);

    try {
      const response = await client.pay(payRequest);
      expect(response).toBeDefined();
    } catch (error) {}

    const payCall = mock.history.post.find((call) => call.url === defaultPayUrl);
    expect(payCall).toBeDefined();
  });

  it('deviceOS header is injected when set on non-PCI instrument', async () => {
    const { client } = customCheckoutClient();

    const payRequest = CustomCheckoutPayRequest.UpiCollectPayViaVpaRequestBuilder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .vpa('test@upi')
      .deviceOS('ANDROID')
      .build();

    mock.onPost(defaultPayUrl).reply(200, mockPayResponse);

    try {
      await client.pay(payRequest);
    } catch (error) {}

    const payCall = mock.history.post.find((call) => call.url === defaultPayUrl);
    expect(payCall!.headers![Headers.X_DEVICE_OS]).toEqual('ANDROID');
  });
});
