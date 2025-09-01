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

import { AxiosInstance } from 'axios';
import { EventPublisher } from './EventPublisher';
import { QueuedEventPublisher } from './QueuedEventPublisher';
import { DefaultEventPublisher } from './DefaultEventPublisher';
import { Constants } from '../Constants';
import { EventQueueHandler } from '../EventQueueHandler';

export class EventPublisherFactory {
  private httpClient!: AxiosInstance;
  private hostUrl!: string;
  private static cachedEventPublisher: EventPublisher;

  public constructor(httpClient: AxiosInstance, hostUrl: string) {
    this.httpClient = httpClient;
    this.hostUrl = hostUrl;
  }

  public getEventPublisher(shouldPublishEvents: boolean): EventPublisher {
    if (shouldPublishEvents) {
      if (EventPublisherFactory.cachedEventPublisher == undefined) {
        EventPublisherFactory.cachedEventPublisher = new QueuedEventPublisher(
          this.httpClient,
          this.hostUrl,
          new EventQueueHandler(Constants.QUEUE_MAX_SIZE)
        );
      }
      return EventPublisherFactory.cachedEventPublisher;
    }
    return new DefaultEventPublisher();
  }
}
