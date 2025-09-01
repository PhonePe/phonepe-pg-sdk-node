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

import { BaseEventBuilder } from '../builders/BaseEventBuilder';
import { EventType } from './enums/EventType';
import { EventData } from './EventData';

export class BaseEvent {
  public merchantOrderId!: string;
  public eventName!: EventType;
  public eventTime!: number;
  public data!: EventData;

  public constructor(
    merchantOrderId: string,
    eventName: EventType,
    eventTime: number,
    data: EventData
  ) {
    this.merchantOrderId = merchantOrderId;
    this.eventName = eventName;
    this.eventTime = eventTime;
    this.data = data;
  }

  static builder() {
    return new BaseEventBuilder();
  }
}
