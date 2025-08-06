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

import { BaseEvent } from './models/BaseEvent';
import { Mutex } from 'async-mutex';

export class EventQueueHandler {
  public queue!: BaseEvent[];
  public maxSize!: number;
  private mutex = new Mutex();

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.queue = [];
  }

  add = async (event: BaseEvent) => {
    await this.mutex.runExclusive(() => {
      if (this.queue.length < this.maxSize && event != null) {
        this.queue.push(event);
      } else {
        console.warn(
          'Reached queue max size, skipping event {}',
          event.eventName
        );
      }
    });
  };

  isEmpty = () => {
    return this.queue.length == 0;
  };

  size = () => {
    return this.queue.length;
  };

  poll = async () => {
    return await this.mutex.runExclusive(() => {
      return this.queue.shift();
    });
  };
}
