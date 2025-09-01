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

import {
  DeviceContext,
  PaymentFlowType,
  PgV2InstrumentType,
} from '../../models';
import { EventState } from '../models/enums/EventState';
import { FlowType } from '../models/enums/FlowType';
import { EventData } from '../models/EventData';

export class EventDataBuilder {
  public flowType!: FlowType;
  public paymentFlow?: PaymentFlowType;
  public sdkType!: string;
  public sdkVersion!: string;

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

  setFlowType = (flowType: FlowType) => {
    this.flowType = flowType;
    return this;
  };

  setPaymentFlow = (paymentFlow?: PaymentFlowType) => {
    this.paymentFlow = paymentFlow;
    return this;
  };

  setSdkType = (sdkType: string) => {
    this.sdkType = sdkType;
    return this;
  };

  setSdkVersion = (sdkVersion: string) => {
    this.sdkVersion = sdkVersion;
    return this;
  };

  setApiPath = (apiPath: string) => {
    this.apiPath = apiPath;
    return this;
  };

  setAmount = (amount?: number) => {
    this.amount = amount;
    return this;
  };

  setTargetApp = (targetApp?: string) => {
    this.targetApp = targetApp;
    return this;
  };

  setDeviceContext = (deviceContext?: DeviceContext) => {
    this.deviceContext = deviceContext;
    return this;
  };

  setExpireAfter = (expireAfter?: number) => {
    this.expireAfter = expireAfter;
    return this;
  };

  setMerchantRefundId = (merchantRefundId: string) => {
    this.merchantRefundId = merchantRefundId;
    return this;
  };

  setOriginalMerchantOrderId = (originalMerchantOrderId: string) => {
    this.originalMerchantOrderId = originalMerchantOrderId;
    return this;
  };

  setTransactionId = (transactionId: string) => {
    this.transactionId = transactionId;
    return this;
  };

  setEventState = (eventState: EventState) => {
    this.eventState = eventState;
    return this;
  };

  setPaymentInstrument = (paymentInstrument: PgV2InstrumentType) => {
    this.paymentInstrument = paymentInstrument;
    return this;
  };

  setCachedTokenIssuesAt = (cachedTokenIssuedAt: number) => {
    this.cachedTokenIssuedAt = cachedTokenIssuedAt;
    return this;
  };

  setCachedTokenExpiresAt = (cachedTokenExpiresAt: number) => {
    this.cachedTokenExpiresAt = cachedTokenExpiresAt;
    return this;
  };

  setTokenFetchAttemptTimestamp = (tokenFetchAttemptTimestamp: number) => {
    this.tokenFetchAttemptTimestamp = tokenFetchAttemptTimestamp;
    return this;
  };

  setExceptionClass = (exceptionClass: string) => {
    this.exceptionClass = exceptionClass;
    return this;
  };

  setExceptionMessage = (exceptionMessage: string) => {
    this.exceptionMessage = exceptionMessage;
    return this;
  };

  setExceptionCode = (exceptionCode: string) => {
    this.exceptionCode = exceptionCode;
    return this;
  };

  setExceptionHttpStatusCode = (exceptionHttpStatusCode: number) => {
    this.exceptionHttpStatusCode = exceptionHttpStatusCode;
    return this;
  };

  setExceptionData = (exceptionData: { [key: string]: object }) => {
    this.exceptionData = exceptionData;
    return this;
  };

  build = () => {
    return new EventData(this);
  };
}
