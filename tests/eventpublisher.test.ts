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

import { eventSetup, setupBeforeAndAfter } from './baseSetup';
import { Env } from '../src/Env';
import { StandardCheckoutContants } from '../src/payments/v2/standardcheckout/Constants';
import { StandardCheckoutPayRequest } from '../src/payments/v2';
import { buildStandardCheckoutPayEvent } from '../src/common/events/builders/EventBuillder';
import { EventState } from '../src/common/events/models/enums/EventState';
import { EventType } from '../src/common/events/models/enums/EventType';
import { BaseEvent } from '../src/common/events/models/BaseEvent';
import { PhonePeResponse } from '../src/common/http';
import { EnvConfig } from '../src/EnvConfig';
import { Constants } from '../src/common/events/Constants';
import { BulkEvent } from '../src/common/events/models/BulkEvent';
import { TokenConstants } from '../src/common/tokenhandler/TokenConstants';
import { EventPublisherFactory } from '../src/common/events/publisher/EventPublisherFactory';
import axios from 'axios';

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Event Publisher Singleton', () => {
  it('Using Cached EventPublisher for different Clients', () => {
    const eventPublisherFactory1 = new EventPublisherFactory(
      axios.create(),
      'hostUrl'
    );

    const eventPublisherFactory2 = new EventPublisherFactory(
      axios.create(),
      'hostUrl'
    );

    const eventPublisher1 = eventPublisherFactory1.getEventPublisher(true);
    const eventPublisher2 = eventPublisherFactory2.getEventPublisher(true);

    expect(eventPublisher1).toBe(eventPublisher2);
  });
});

describe('Event Queue Handler', () => {
  const mock = setupBeforeAndAfter();

  it('Test Publishing Events by Calling Run Method Manually', async () => {
    const { queueHandler, eventPublisher, tokenService } = eventSetup(
      Env.SANDBOX
    );
    await sleep(1000);
    queueHandler.queue = []; //As TOKEN_SERVICE_INITIALIZED event will be added in the queue

    const api = StandardCheckoutContants.PAY_API;
    const req = StandardCheckoutPayRequest.builder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .build();

    const event = buildStandardCheckoutPayEvent(
      EventState.SUCCESS,
      EventType.PAY_SUCCESS,
      req,
      api
    );

    const listOfEvents = [event, event, event];

    listOfEvents.forEach((singleEvent: BaseEvent) => {
      eventPublisher.send(singleEvent);
    });
    await sleep(2000); //As the push operation is async, need to wait for the operation to get completed

    const response = new PhonePeResponse();

    const hostUrl = EnvConfig.getBaseUrls(Env.SANDBOX).eventsHostUrl;
    const baseUrl = Constants.EVENTS_ENDPOINT;
    const url = hostUrl + baseUrl;

    expect(queueHandler.size()).toEqual(3);

    mock.onPost(url).reply(200, response);
    eventPublisher.startPublishingEvents(tokenService.getOAuthToken);

    await sleep(2000); //As the run operation is async, need to wait for the calls to be made
    eventPublisher.scheduler = false; //Need to stop the run() method for completion of the test

    expect(mock.history.post[1].url).toEqual(url); // First call is to OAUTH, Second Call to Events API
    expect(queueHandler.size()).toEqual(0);
  });

  it('Queue Size Full, No More Events Are Added', async () => {
    const { queueHandler, eventPublisher } = eventSetup(Env.SANDBOX);

    await sleep(1000);
    queueHandler.queue = []; //As TOKEN_SERVICE_INITIALIZED event will be added in the queue

    const api = StandardCheckoutContants.PAY_API;

    const req = StandardCheckoutPayRequest.builder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .build();
    const event = buildStandardCheckoutPayEvent(
      EventState.SUCCESS,
      EventType.PAY_SUCCESS,
      req,
      api
    );

    const listOfEvents: BaseEvent[] = [];

    for (let i = 0; i < 20; i++) {
      listOfEvents.push(event);
    }
    listOfEvents.forEach((singleEvent) => {
      eventPublisher.send(singleEvent); //Adding 20 elements, but only 15 will get pushed, as MAX_SIZE is 15
    });
    await sleep(2000);

    expect(queueHandler.size()).toEqual(15);
  });

  it('BATCH_SIZE Pushing to API, if Queue Size if Greater than BATCH_SIZE', async () => {
    const { queueHandler, eventPublisher, tokenService } = eventSetup(
      Env.SANDBOX
    );

    await sleep(1000);
    queueHandler.queue = []; //As TOKEN_SERVICE_INITIALIZED event will be added in the queue

    const api = StandardCheckoutContants.PAY_API;

    const req = StandardCheckoutPayRequest.builder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .build();
    const event = buildStandardCheckoutPayEvent(
      EventState.SUCCESS,
      EventType.PAY_SUCCESS,
      req,
      api
    );

    const listOfEvents: BaseEvent[] = [];

    for (let i = 0; i < Constants.MAX_EVENTS_IN_BATCH + 5; i++) {
      listOfEvents.push(event); //Adding 5 More Events than BATCH_SZIE
    }

    listOfEvents.forEach((singleEvent) => {
      eventPublisher.send(singleEvent); //Pushing all events into the queue
    });
    await sleep(2000);

    const hostUrl = EnvConfig.getBaseUrls(Env.SANDBOX).eventsHostUrl;
    const baseUrl = Constants.EVENTS_ENDPOINT;
    const url = hostUrl + baseUrl;

    const response = new PhonePeResponse();
    expect(queueHandler.size()).toEqual(15);
    mock.onPost(url).reply(200, response);

    eventPublisher.startPublishingEvents(tokenService.getOAuthToken);

    await sleep(2000);
  
    eventPublisher.scheduler = false;

    const firstCallJson = JSON.parse(mock.history.post[2].data);
    const firstCallData = firstCallJson as BulkEvent;
    expect(firstCallData.events.length).toEqual(10);

    const secondCallJson = JSON.parse(mock.history.post[3].data);
    const secondCallData = secondCallJson as BulkEvent;
    expect(secondCallData.events.length).toEqual(5);
    expect(queueHandler.size()).toEqual(0);
  });

  it('Token Failure Event', async () => {
    mock.reset();
    const { queueHandler, eventPublisher, tokenService } = eventSetup(
      Env.SANDBOX
    );

    await sleep(1000);
    queueHandler.queue = []; //As TOKEN_SERVICE_INITIALIZED event will be added in the queue

    const expiredResponse = {
      access_token: 'expired_access_token',
      encrypted_access_token: 'encrypted_access_token',
      refresh_token: 'refresh_token',
      expires_in: 0,
      issued_at: 0,
      expires_at: 0,
      session_expires_at: 1709630316,
      token_type: 'O-Bearer',
    };

    const currentTime = Math.floor(Date.now() / 1000);
    const currentTimeMore10 = currentTime + 10;

    const correctTokenResponse = {
      access_token: 'correct_access_token',
      encrypted_access_token: 'encrypted_access_token',
      refresh_token: 'refresh_token',
      expires_in: currentTimeMore10,
      issued_at: currentTime,
      expires_at: currentTimeMore10,
      session_expires_at: 1709630316,
      token_type: 'O-Bearer',
    };

    const req = StandardCheckoutPayRequest.builder()
      .merchantOrderId('merchantOrderId')
      .amount(100)
      .build();

    const event = buildStandardCheckoutPayEvent(
      //A basic event to insert into the queue, to call the Events Ingestion API
      EventState.SUCCESS,
      EventType.PAY_SUCCESS,
      req,
      'API'
    );
    eventPublisher.send(event);
    const oAuthUrl =
      EnvConfig.getBaseUrls(Env.SANDBOX).oAuthHostUrl +
      TokenConstants.OAUTH_GET_TOKEN;

    mock
      .onPost(oAuthUrl)
      .replyOnce(200, expiredResponse)
      .onPost(oAuthUrl)
      .replyOnce(500)
      .onPost(oAuthUrl)
      .replyOnce(200, correctTokenResponse);

    const eventsUrl =
      EnvConfig.getBaseUrls(Env.SANDBOX).eventsHostUrl +
      Constants.EVENTS_ENDPOINT;
    mock.onPost(eventsUrl).reply(200);
    await tokenService.getOAuthToken();
  
    eventPublisher.startPublishingEvents(tokenService.getOAuthToken);
    await sleep(5000);
    eventPublisher.scheduler = false;
    const oAuthCalls = mock.history.post.filter((call) => call.url == oAuthUrl);
    const eventsCalls = mock.history.post.filter(
      (call) => call.url == eventsUrl
    );
    expect(oAuthCalls.length).toEqual(3); //First Call for expired Token, Second Call failed, Third Call for Correct Token
    expect(eventsCalls.length).toEqual(2); // First Call with Manually Added Event, Second Call with OAUTH_FETCH_FAILED event
  });
});
