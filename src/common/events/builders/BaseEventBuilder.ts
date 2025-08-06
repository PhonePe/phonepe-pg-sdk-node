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

import { BaseEvent } from '../models/BaseEvent';
import { EventType } from '../models/enums/EventType';
import { EventData } from '../models/EventData';

export class BaseEventBuilder {
  private _merchantOrderId!: string;
  private _eventName!: EventType;
  private _eventTime!: number;
  private _data!: EventData;

  /**
   * SETTERS
   **/

  setMerchantOrderId = (merchantOrderId: string) => {
    this._merchantOrderId = merchantOrderId;
    return this;
  };

  setEventName = (eventName: EventType) => {
    this._eventName = eventName;
    return this;
  };

  setEventTime = (eventTime: number) => {
    this._eventTime = eventTime;
    return this;
  };

  setData = (data: EventData) => {
    this._data = data;
    return this;
  };

  build = () => {
    return new BaseEvent(
      this._merchantOrderId,
      this._eventName,
      this._eventTime,
      this._data
    );
  };
}
