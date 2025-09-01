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
import { customCheckoutClient, standardCheckoutClient } from './baseSetup';

describe('Validate Callback', () => {
  it('StandardCheckout Client validateCallback with correct credentials', () => {
    const { client } = standardCheckoutClient();

    const username = 'username';
    const password = 'password';

    const authorization =
      'bc842c31a9e54efe320d30d948be61291f3ceee4766e36ab25fa65243cd76e0e';

    const responseBody =
      '{"type":"CHECKOUT_TRANSACTION_ATTEMPT_FAILED","payload":{"orderId":"OMOxx","paymentDetails":[{"paymentMode":"UPI_COLLECT"}]}}';

    const result = client.validateCallback(
      username,
      password,
      authorization,
      responseBody
    );
    const expected = {
      type: 'CHECKOUT_TRANSACTION_ATTEMPT_FAILED',
      payload: {
        orderId: 'OMOxx',
        paymentDetails: [
          {
            paymentMode: 'UPI_COLLECT',
          },
        ],
      },
    };

    expect(result).toEqual(expected);
  });

  it('CustomCheckout Client validateCallback with correct credentials', () => {
    const { client } = customCheckoutClient();

    const username = 'username';
    const password = 'password';

    const authorization =
      'bc842c31a9e54efe320d30d948be61291f3ceee4766e36ab25fa65243cd76e0e';

    const responseBody =
      '{"type":"CHECKOUT_TRANSACTION_ATTEMPT_FAILED","payload":{"orderId":"OMOxx","paymentDetails":[{"paymentMode":"UPI_COLLECT"}]}}';

    const result = client.validateCallback(
      username,
      password,
      authorization,
      responseBody
    );
    const expected = {
      type: 'CHECKOUT_TRANSACTION_ATTEMPT_FAILED',
      payload: {
        orderId: 'OMOxx',
        paymentDetails: [
          {
            paymentMode: 'UPI_COLLECT',
          },
        ],
      },
    };

    expect(result).toEqual(expected);
  });

  it('CustomCheckout validateCallback with wrong credentials', () => {
    const { client } = customCheckoutClient();

    const username = 'wrong_username';
    const password = 'password';

    const authorization =
      'bc842c31a9e54efe320d30d948be61291f3ceee4766e36ab25fa65243cd76e0e';

    const responseBody =
      '{"type":"CHECKOUT_TRANSACTION_ATTEMPT_FAILED","payload":{"orderId":"OMOxx","paymentDetails":[{"paymentMode":"UPI_COLLECT"}]}}';

    try {
      client.validateCallback(username, password, authorization, responseBody);
    } catch (error) {
      const phonePeException = error as PhonePeException;
      expect(phonePeException.message).toEqual('Invalid Callback');
      expect(phonePeException.httpStatusCode).toEqual(417);
    }
  });
});
