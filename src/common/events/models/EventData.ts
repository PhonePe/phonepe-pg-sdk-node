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
import {
  DeviceContext,
  PaymentFlowType,
  PgV2InstrumentType,
} from '../../models';
import { EventDataBuilder } from '../builders/EventDataBuilder';
import { EventState } from './enums/EventState';
import { FlowType } from './enums/FlowType';

export class EventData {
  //Product Type Detail (PG, PG_CHECKOUT)
  public flowType!: FlowType;
  public paymentFlow?: PaymentFlowType;
  public sdkType: string = Headers.SDK_TYPE;
  public sdkVersion: string = Headers.SDK_VERSION;

  //API Details
  public apiPath?: string;
  public amount?: number;
  public targetApp?: string;
  public deviceContext?: DeviceContext;
  public expireAfter?: number;
  public merchantRefundId?: string;
  public originalMerchantOrderId?: string;
  public transactionId?: string;
  public eventState!: EventState;
  public paymentInstrument?: PgV2InstrumentType;

  //Token Details
  public cachedTokenIssuedAt?: number;
  public cachedTokenExpiresAt?: number;
  public tokenFetchAttemptTimestamp?: number;

  //Exception Data
  public exceptionClass?: string;
  public exceptionMessage?: string;
  public exceptionCode?: string;
  public exceptionHttpStatusCode?: number;
  public exceptionData?: { [key: string]: object };

  public constructor(builder: EventDataBuilder) {
    this.flowType = builder.flowType;
    this.paymentFlow = builder.paymentFlow;
    this.sdkType = builder.sdkType ?? this.sdkType;
    this.sdkVersion = builder.sdkVersion ?? this.sdkVersion;
    this.apiPath = builder.apiPath;
    this.amount = builder.amount;
    this.targetApp = builder.targetApp;
    this.deviceContext = builder.deviceContext;
    this.expireAfter = builder.expireAfter;
    this.merchantRefundId = builder.merchantRefundId;
    this.originalMerchantOrderId = builder.originalMerchantOrderId;
    this.transactionId = builder.transactionId;
    this.eventState = builder.eventState;
    this.paymentInstrument = builder.paymentInstrument;
    this.cachedTokenIssuedAt = builder.cachedTokenIssuedAt;
    this.cachedTokenExpiresAt = builder.cachedTokenExpiresAt;
    this.tokenFetchAttemptTimestamp = builder.tokenFetchAttemptTimestamp;
    this.exceptionClass = builder.exceptionClass;
    this.exceptionMessage = builder.exceptionMessage;
    this.exceptionCode = builder.exceptionCode;
    this.exceptionHttpStatusCode = builder.exceptionHttpStatusCode;
    this.exceptionData = builder.exceptionData;
  }

  static builder() {
    return new EventDataBuilder();
  }
}
