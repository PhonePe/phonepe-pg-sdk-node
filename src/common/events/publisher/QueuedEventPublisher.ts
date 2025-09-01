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
import { BaseEvent } from '../models/BaseEvent';
import { EventPublisher } from './EventPublisher';
import { EventQueueHandler } from '../EventQueueHandler';
import { Constants } from '../Constants';
import { HttpCommand } from '../../http/HttpCommand';
import { BulkEvent } from '../models/BulkEvent';
import { Headers } from '../../constants/Headers';
import { HttpMethodType } from '../../http';

export class QueuedEventPublisher extends EventPublisher {
  public scheduler: boolean;
  private _queueHandler!: EventQueueHandler;
  private _authTokenSupplier!: () => Promise<string>;
  private _httpCommand: HttpCommand;

  public constructor(
    httpClient: AxiosInstance,
    hostUrl: string,
    queueHandler: EventQueueHandler
  ) {
    super();
    this._httpCommand = new HttpCommand(hostUrl, httpClient);
    this._queueHandler = queueHandler;
    this.scheduler = false;
  }

  setAuthTokenSupplier(authTokenSupplier: () => Promise<string>): void {
    this._authTokenSupplier = authTokenSupplier;
  }

  startPublishingEvents(authTokenSupplier: () => Promise<string>): void {
    this._authTokenSupplier = authTokenSupplier;
    if (this.scheduler == false) {
      this.scheduler = true;
      setTimeout(() => this.run(), Constants.INITIAL_DELAY);
    }
  }

  async send(event: BaseEvent) {
    await this._queueHandler.add(event);
  }

  async run() {
    if (this.scheduler) {
      await this.sendEvents();
      setTimeout(() => this.run(), Constants.DELAY);
    }
  }

  async sendEvents() {
    try {
      if (this._queueHandler.isEmpty()) {
        return;
      }
      const bulkEventBatch: BaseEvent[][] = await this.createEventBatches();

      bulkEventBatch.forEach(async (sdkEventList) => {
        try {
          await this.sendBatchData(sdkEventList);
        } catch (error) {
          console.error(
            'Error occurred sending events batch to backend',
            error
          );
        }
      });
    } catch (error) {
      console.error('Error occurred sending events batch to backend', error);
    }
  }

  async sendBatchData(sdkEventList: BaseEvent[]) {
    const bulkEvent = BulkEvent.builder().events(sdkEventList).build();
    const headers = await this.getHeaders();
    await this._httpCommand.request(
      Constants.EVENTS_ENDPOINT,
      HttpMethodType.POST,
      headers,
      bulkEvent
    );
  }

  async getHeaders() {
    return {
      [Headers.ACCEPT]: Headers.APPLICATION_JSON,
      [Headers.OAUTH_AUTHORIZATION]: await this._authTokenSupplier(),
      [Headers.CONTENT_TYPE]: Headers.APPLICATION_JSON,
    };
  }

  async createEventBatches() {
    const CUR_QUEUE_SIZE = this._queueHandler.size();
    const bulkEventBatch: BaseEvent[][] = [];
    let currentBatch: BaseEvent[] = [];
    for (
      let numEventsProcessed = 0;
      numEventsProcessed < CUR_QUEUE_SIZE;
      numEventsProcessed++
    ) {
      const event = await this._queueHandler.poll();
      if (event == undefined) {
        break;
      }
      currentBatch.push(event);
      if (currentBatch.length == Constants.MAX_EVENTS_IN_BATCH) {
        bulkEventBatch.push(currentBatch);
        currentBatch = [];
      }
    }
    if (currentBatch.length != 0) {
      bulkEventBatch.push(currentBatch);
    }
    return bulkEventBatch;
  }
}
