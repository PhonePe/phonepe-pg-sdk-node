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

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { StandardCheckoutClient } from '../src/payments/v2/StandardCheckoutClient';
import { Env } from '../src/Env';
import { EnvConfig } from '../src/EnvConfig';
import { CustomCheckoutClient } from '../src/payments/v2/CustomCheckoutClient';
import { TokenConstants } from '../src/common/tokenhandler/TokenConstants';
import { EventQueueHandler } from '../src/common/events/EventQueueHandler';
import { QueuedEventPublisher } from '../src/common/events/publisher/QueuedEventPublisher';
import { TokenService } from '../src/common/tokenhandler/TokenService';
import { CredentialConfig } from '../src/common/configs/CredentialConfig';

export function setupBeforeAndAfter() {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    const mockOAuthResponse = {
      access_token: 'access_token',
      encrypted_access_token: 'encrypted_access_token',
      issued_at: 2342423,
      expires_at: 45343534,
      token_type: 'token_type',
    };

    mock
      .onPost(
        `${EnvConfig.getBaseUrls(Env.SANDBOX).oAuthHostUrl}${
          TokenConstants.OAUTH_GET_TOKEN
        }`
      )
      .reply(200, mockOAuthResponse);
  });
  afterEach(() => {
    mock.reset();
  });
  afterAll(() => mock.restore());

  return mock;
}

export function standardCheckoutClient(
  clientId = 'clientId',
  clientSecret = 'clientSecret',
  clientVersion = 1,
  env: Env = Env.SANDBOX,
  shouldPublishEvents = true
) {
  const client = StandardCheckoutClient.getInstance(
    clientId,
    clientSecret,
    clientVersion,
    env,
    shouldPublishEvents
  );
  const hostUrl = EnvConfig.getBaseUrls(client.env).pgHostUrl;
  return { client, hostUrl };
}

export function customCheckoutClient(
  clientId = 'clientId',
  clientSecret = 'clientSecret',
  clientVersion = 1,
  env: Env = Env.SANDBOX,
  shouldPublishEvents = true
) {
  const client = CustomCheckoutClient.getInstance(
    clientId,
    clientSecret,
    clientVersion,
    env,
    shouldPublishEvents
  );
  const hostUrl = EnvConfig.getBaseUrls(client.env).pgHostUrl;
  return { client, hostUrl };
}

export function eventSetup(env: Env) {
  const queueHandler = new EventQueueHandler(15);
  const eventPublisher = new QueuedEventPublisher(
    axios.create(),
    EnvConfig.getBaseUrls(env).eventsHostUrl,
    queueHandler
  );

  const tokenService = new TokenService(
    axios.create(),
    CredentialConfig.builder()
      .clientId('clientId-new')
      .clientSecret('clientSecret')
      .clientVersion(1)
      .build(),
    Env.SANDBOX,
    eventPublisher
  );

  return { queueHandler, eventPublisher, tokenService };
}
