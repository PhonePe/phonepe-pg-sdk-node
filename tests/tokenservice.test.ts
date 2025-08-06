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
import {
  BadRequest,
  UnauthorizedAccess,
} from '../src/common/exception/Exceptions';
import { TokenService } from '../src/common/tokenhandler/TokenService';
import { setupBeforeAndAfter, standardCheckoutClient } from './baseSetup';
import { TokenConstants } from '../src/common/tokenhandler/TokenConstants';
import { StandardCheckoutContants } from '../src/payments/v2/standardcheckout/Constants';
import { EnvConfig } from '../src/EnvConfig';

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('TOKEN SERVICE TEST', () => {
  const mock = setupBeforeAndAfter();
  const { client } = standardCheckoutClient();
  const oAuthUrl = `${EnvConfig.getBaseUrls(client.env).oAuthHostUrl}${
    TokenConstants.OAUTH_GET_TOKEN
  }`;

  it('OAuth First Fetch Fail', async () => {
    const errorResponse = {
      code: 'INVALID_CLIENT',
      errorCode: 'errorCode',
      message: 'Bad_Request',
      data: {
        errorDescription: 'Client Authentication Failure',
      },
    };
    TokenService.oAuthResponse = null;

    mock.onPost(oAuthUrl).reply(400, errorResponse);

    try {
      await client.tokenService.getOAuthToken();
    } catch (error) {
      const badRequestError = error as BadRequest;
      const data = {
        errorDescription: 'Client Authentication Failure',
      };
      expect(badRequestError.code).toEqual('errorCode');
      expect(badRequestError.httpStatusCode).toEqual(400);
      expect(badRequestError.data).toEqual(data);
    }
  });

  it('OAuth Fetch Token Success', async () => {
    const mockOAuthResponse = {
      access_token: 'access_token',
      encrypted_access_token: 'encrypted_access_token',
      issued_at: 2342423,
      expires_at: 45343534,
      token_type: 'O-Bearer',
    };

    mock.onPost(oAuthUrl).reply(200, mockOAuthResponse);

    TokenService.oAuthResponse = null;

    const actual = await client.tokenService.getOAuthToken();

    expect(actual).toEqual('O-Bearer access_token');
    expect(mock.history.post[0].url).toEqual(oAuthUrl);
  });

  it('OAuth Token Refresh', async () => {
    const mockOAuthResponse = {
      access_token: 'access_token',
      encrypted_access_token: 'encrypted_access_token',
      issued_at: 0,
      expires_at: 213221,
      token_type: 'O-Bearer',
    };

    mock.onPost(oAuthUrl).reply(200, mockOAuthResponse);

    TokenService.oAuthResponse = null;

    let actual = await client.tokenService.getOAuthToken(); //sets the token
    actual = await client.tokenService.getOAuthToken(); //token is expired, fetches new token

    expect(actual).toEqual('O-Bearer access_token');
    expect(mock.history.post[0].url).toEqual(oAuthUrl);
    expect(mock.history.post[1].url).toEqual(oAuthUrl);
  });

  it('OAuth Use Cached Token', async () => {
    const time = Math.floor(Date.now() / 1000);
    const mockOAuthResponse = {
      access_token: 'access_token',
      encrypted_access_token: 'encrypted_access_token',
      issued_at: time,
      expires_at: time + 6,
      token_type: 'O-Bearer',
    };

    mock.onPost(oAuthUrl).reply(200, mockOAuthResponse);

    TokenService.oAuthResponse = null;

    let actual = await client.tokenService.getOAuthToken(); //sets the token
    actual = await client.tokenService.getOAuthToken(); //token is valid, returns the cached token
    actual = await client.tokenService.getOAuthToken(); //token is valid, returns the cached token
    actual = await client.tokenService.getOAuthToken(); //token is valid, returns the cached token

    expect(actual).toEqual('O-Bearer access_token');
    expect(mock.history.post[0].url).toEqual(oAuthUrl);
    expect(mock.history.post.length).toEqual(1);

    await sleep(3000);
    mock.resetHistory();

    actual = await client.tokenService.getOAuthToken(); //token is invalid, tries to fetch new token
    actual = await client.tokenService.getOAuthToken(); //token is invalid, tries to fetch new token
    actual = await client.tokenService.getOAuthToken(); //token is invalid, tries to fetch new token

    expect(mock.history.post.length).toEqual(3);
  });

  it('OAuth Use Cached Token Then Invalid So Fetch', async () => {
    let time = Math.floor(Date.now() / 1000);
    let mockOAuthResponse = {
      access_token: 'access_token',
      encrypted_access_token: 'encrypted_access_token',
      issued_at: time,
      expires_at: time + 6,
      token_type: 'O-Bearer',
    };

    mock.onPost(oAuthUrl).reply(200, mockOAuthResponse);

    TokenService.oAuthResponse = null;

    let actual = await client.tokenService.getOAuthToken(); //sets the token
    actual = await client.tokenService.getOAuthToken(); //token is valid, returns the cached token

    expect(actual).toEqual('O-Bearer access_token');
    expect(mock.history.post[0].url).toEqual(oAuthUrl);
    expect(mock.history.post.length).toEqual(1);

    mock.reset();

    time = Math.floor(Date.now() / 1000);

    mockOAuthResponse = {
      access_token: 'new_access_token',
      encrypted_access_token: 'encrypted_access_token',
      issued_at: time,
      expires_at: time + 10,
      token_type: 'O-Bearer',
    };

    await sleep(3000);

    mock.onPost(oAuthUrl).reply(200, mockOAuthResponse);

    actual = await client.tokenService.getOAuthToken(); //token is invalid, fetches new token
    actual = await client.tokenService.getOAuthToken(); //token is valid, returns the same token
    actual = await client.tokenService.getOAuthToken(); //token is valid, returns the same token
    actual = await client.tokenService.getOAuthToken(); //token is valid, returns the same token

    expect(actual).toEqual('O-Bearer new_access_token');
    expect(mock.history.post[0].url).toEqual(oAuthUrl);
    expect(mock.history.post.length).toEqual(1);
  });

  it('Unauthorized for Pay, so Force Refresh', async () => {
    TokenService.oAuthResponse = null;
    const time = Math.floor(Date.now() / 1000);
    const firstCall = {
      access_token: 'access_token',
      encrypted_access_token: 'encrypted_access_token',
      issued_at: time,
      expires_at: time + 10,
      token_type: 'O-Bearer',
    };

    const secondCall = {
      access_token: 'new_access_token',
      encrypted_access_token: 'encrypted_access_token',
      issued_at: time,
      expires_at: time + 10,
      token_type: 'O-Bearer',
    };

    const unauthorizedResponse = {
      code: 'Unauthorized',
      message: 'message',
      data: {
        a: 'b',
      },
    };

    const payResponse = {
      orderId: 'orderId',
      state: 'PENDING',
      expireAt: 7495743,
    };

    // First Call return access_token, Seccond call will return new_access_token, when forceRefreshToken() will be triggered
    mock
      .onPost(oAuthUrl)
      .replyOnce(200, firstCall)
      .onPost(oAuthUrl)
      .reply(200, secondCall);

    const payUrl = `${EnvConfig.getBaseUrls(client.env).pgHostUrl}${
      StandardCheckoutContants.PAY_API
    }`;
    mock
      .onPost(payUrl)
      .replyOnce(401, unauthorizedResponse)
      .onPost(payUrl)
      .reply(200, payResponse);

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .build();

    try {
      await client.pay(request);
    } catch (error) {
      const unauthorizedError = error as UnauthorizedAccess;
      expect(unauthorizedError.httpStatusCode).toEqual(401);
      expect(unauthorizedError.data).toEqual({ a: 'b' });
      expect(unauthorizedError.message).toEqual('message');
      expect(mock.history.post[0].url).toEqual(oAuthUrl);
      expect(mock.history.post[1].url).toEqual(payUrl);
      expect(mock.history.post[2].url).toEqual(oAuthUrl);
      expect(await client.tokenService.getOAuthToken()).toEqual(
        'O-Bearer new_access_token'
      );
    }

    // Trying another pay call, which has oAuth token has new_access_token
    const actualPayResponse = await client.pay(request);
    expect(actualPayResponse).toEqual(payResponse);
    expect(await client.tokenService.getOAuthToken()).toEqual(
      'O-Bearer new_access_token'
    );
  });

  it('OAuth First Fetch Works, Second Call Fails So Returns Old Token', async () => {
    TokenService.oAuthResponse = null;

    const time = Math.floor(Date.now() / 1000);
    const mockOAuthResponse = {
      access_token: 'access_token',
      encrypted_access_token: 'encrypted_access_token',
      issued_at: time,
      expires_at: time + 6,
      token_type: 'O-Bearer',
    };

    const errorResponseForFetch = {
      code: 'INVALID_CLIENT',
      errorCode: 'errorCode',
      message: 'Bad_Request',
      data: {
        errorDescription: 'Client Authentication Failure',
      },
    };

    mock.onPost(oAuthUrl).reply(200, mockOAuthResponse);

    let actual = await client.tokenService.getOAuthToken(); //sets the token

    expect(actual).toEqual('O-Bearer access_token');
    expect(mock.history.post[0].url).toEqual(oAuthUrl);
    expect(mock.history.post.length).toEqual(1);

    await sleep(3000);
    mock.reset();
    mock
      .onPost('https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token')
      .reply(400, errorResponseForFetch);

    actual = await client.tokenService.getOAuthToken(); //fetches new token, error occured, returns old token
    actual = await client.tokenService.getOAuthToken(); //fetches new token, error occured, returns old token
    actual = await client.tokenService.getOAuthToken(); //fetches new token, error occured, returns old token

    expect(mock.history.post.length).toEqual(3);
    expect(actual).toEqual('O-Bearer access_token');
  });
});
