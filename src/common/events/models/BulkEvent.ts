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

import { Headers } from '../../constants/Headers';
import { Constants } from '../Constants';
import { BaseEvent } from './BaseEvent';

export class BulkEvent {
  public events!: BaseEvent[];
  public source: string = Constants.SOURCE;
  public clientVersion: string = Headers.SDK_TYPE + ':' + Headers.SDK_VERSION;

  constructor(events: BaseEvent[], source: string, clientVersion: string) {
    this.events = events;
    this.source = source;
    this.clientVersion = clientVersion;
  }

  static builder = () => {
    return new BulkEventBuilder();
  };
}

class BulkEventBuilder {
  private _events!: BaseEvent[];
  private _source!: string;
  private _clientVersion!: string;

  events = (eventList: BaseEvent[]) => {
    this._events = eventList;
    return this;
  };

  source = (source: string) => {
    this._source = source;
    return this;
  };

  clientVersion = (clientVersion: string) => {
    this._clientVersion = clientVersion;
    return this;
  };

  build = () => {
    this._source = this._source ?? Constants.SOURCE;
    this._clientVersion =
      this._clientVersion ?? Headers.SDK_TYPE + ':' + Headers.SDK_VERSION;
    return new BulkEvent(this._events, this._source, this._clientVersion);
  };
}
