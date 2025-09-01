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
  CreateSdkOrderRequest,
  CustomCheckoutPayRequest,
  PgPaymentFlow,
  StandardCheckoutPayRequest,
} from '../../../payments/v2';
import {
  IntentPaymentV2Instrument,
  PaymentFlowType,
  RefundRequest,
} from '../../models';
import { BaseEvent } from '../models/BaseEvent';
import { EventState } from '../models/enums/EventState';
import { EventType } from '../models/enums/EventType';
import { FlowType } from '../models/enums/FlowType';
import { EventData } from '../models/EventData';

export const buildInitClientEvent = (
  eventName: EventType,
  paymentFlow?: PaymentFlowType
): BaseEvent => {
  return BaseEvent.builder()
    .setEventName(eventName)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setData(
      EventData.builder()
        .setEventState(EventState.INITIATED)
        .setFlowType(FlowType.B2B_PG)
        .setPaymentFlow(paymentFlow)
        .build()
    )
    .build();
};

export const buildStandardCheckoutPayEvent = (
  eventState: EventState,
  eventName: EventType,
  standardCheckoutPayRequest: StandardCheckoutPayRequest,
  apiPath: string,
  exception: unknown = null
): BaseEvent => {
  const event: BaseEvent = BaseEvent.builder()
    .setEventName(eventName)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setMerchantOrderId(standardCheckoutPayRequest.merchantOrderId)
    .setData(
      EventData.builder()
        .setEventState(eventState)
        .setAmount(standardCheckoutPayRequest.amount)
        .setPaymentFlow(PaymentFlowType.PG_CHECKOUT)
        .setApiPath(apiPath)
        .setExpireAfter(standardCheckoutPayRequest.expireAfter)
        .setFlowType(FlowType.B2B_PG)
        .build()
    )
    .build();

  return populateExceptionFields(event, exception);
};

export const buildCustomCheckoutPayRequest = (
  eventState: EventState,
  eventName: EventType,
  request: CustomCheckoutPayRequest,
  apiPath: string,
  exception: unknown = null
) => {
  const pgPaymentFlow = request.paymentFlow as PgPaymentFlow;
  const targetApp =
    pgPaymentFlow.paymentMode instanceof IntentPaymentV2Instrument
      ? pgPaymentFlow.paymentMode.targetApp
      : undefined;
  const event: BaseEvent = BaseEvent.builder()
    .setEventName(eventName)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setMerchantOrderId(request.merchantOrderId)
    .setData(
      EventData.builder()
        .setEventState(eventState)
        .setAmount(request.amount)
        .setPaymentFlow(PaymentFlowType.PG)
        .setApiPath(apiPath)
        .setExpireAfter(request.expireAfter)
        .setFlowType(FlowType.B2B_PG)
        .setPaymentInstrument(pgPaymentFlow.paymentMode.type)
        .setTargetApp(targetApp)
        .setDeviceContext(request.deviceContext)
        .build()
    )
    .build();

  return populateExceptionFields(event, exception);
};

export const buildOrderStatusEvent = (
  eventState: EventState,
  merchantOrderId: string,
  paymentFlow: PaymentFlowType,
  apiPath: string,
  eventName: EventType,
  exception: unknown = null
) => {
  const event: BaseEvent = BaseEvent.builder()
    .setEventName(eventName)
    .setMerchantOrderId(merchantOrderId)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setData(
      EventData.builder()
        .setEventState(eventState)
        .setPaymentFlow(paymentFlow)
        .setApiPath(apiPath)
        .setFlowType(FlowType.B2B_PG)
        .build()
    )
    .build();

  return populateExceptionFields(event, exception);
};

export const buildRefundEvent = (
  eventState: EventState,
  refundRequest: RefundRequest,
  apiPath: string,
  paymentFlow: PaymentFlowType,
  eventName: EventType,
  exception: unknown = null
) => {
  const event: BaseEvent = BaseEvent.builder()
    .setEventName(eventName)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setMerchantOrderId(refundRequest.originalMerchantOrderId)
    .setData(
      EventData.builder()
        .setMerchantRefundId(refundRequest.merchantRefundId)
        .setEventState(eventState)
        .setPaymentFlow(paymentFlow)
        .setApiPath(apiPath)
        .setAmount(refundRequest.amount)
        .setOriginalMerchantOrderId(refundRequest.originalMerchantOrderId)
        .setFlowType(FlowType.B2B_PG)
        .build()
    )
    .build();

  return populateExceptionFields(event, exception);
};

export const buildRefundStatusEvent = (
  eventState: EventState,
  eventName: EventType,
  refundId: string,
  apiPath: string,
  paymentFlow: PaymentFlowType,
  exception: unknown = null
) => {
  const event: BaseEvent = BaseEvent.builder()
    .setEventName(eventName)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setData(
      EventData.builder()
        .setMerchantRefundId(refundId)
        .setEventState(eventState)
        .setApiPath(apiPath)
        .setPaymentFlow(paymentFlow)
        .setFlowType(FlowType.B2B_PG)
        .build()
    )
    .build();

  return populateExceptionFields(event, exception);
};

export const buildCreateSdkOrderEvent = (
  eventState: EventState,
  eventName: EventType,
  createSdkOrderRequest: CreateSdkOrderRequest,
  apiPath: string,
  paymentFlow: PaymentFlowType,
  exception: unknown = null
) => {
  const event: BaseEvent = BaseEvent.builder()
    .setMerchantOrderId(createSdkOrderRequest.merchantOrderId)
    .setEventName(eventName)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setData(
      EventData.builder()
        .setAmount(createSdkOrderRequest.amount)
        .setApiPath(apiPath)
        .setEventState(eventState)
        .setExpireAfter(createSdkOrderRequest.expireAfter)
        .setPaymentFlow(paymentFlow)
        .setFlowType(FlowType.B2B_PG)
        .build()
    )
    .build();

  return populateExceptionFields(event, exception);
};

export const buildTransactionStatusEvent = (
  eventState: EventState,
  eventName: EventType,
  transactionId: string,
  apiPath: string,
  paymentFlow: PaymentFlowType,
  exception: unknown = null
) => {
  const event: BaseEvent = BaseEvent.builder()
    .setEventName(eventName)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setData(
      EventData.builder()
        .setEventState(eventState)
        .setTransactionId(transactionId)
        .setApiPath(apiPath)
        .setFlowType(FlowType.B2B_PG)
        .setPaymentFlow(paymentFlow)
        .build()
    )
    .build();

  return populateExceptionFields(event, exception);
};

export const buildOAuthEvent = (
  fetchAttemptTime: number,
  apiPath: string,
  eventName: EventType,
  exception: unknown,
  cachedTokenIssuedAt: number,
  cachedTokenExpiresAt: number
) => {
  const event: BaseEvent = BaseEvent.builder()
    .setEventName(eventName)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setData(
      EventData.builder()
        .setTokenFetchAttemptTimestamp(fetchAttemptTime)
        .setApiPath(apiPath)
        .setEventState(EventState.FAILED)
        .setCachedTokenExpiresAt(cachedTokenExpiresAt)
        .setCachedTokenIssuesAt(cachedTokenIssuedAt)
        .build()
    )
    .build();
  return populateExceptionFields(event, exception);
};

export const buildCallbackSerializationFailedEvent = (
  eventState: EventState,
  paymentFlow: PaymentFlowType,
  eventName: EventType,
  exception: unknown = null
) => {
  const event: BaseEvent = BaseEvent.builder()
    .setEventName(eventName)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setData(
      EventData.builder()
        .setEventState(eventState)
        .setPaymentFlow(paymentFlow)
        .build()
    )
    .build();
  return populateExceptionFields(event, exception);
};

export const populateExceptionFields = (
  event: BaseEvent,
  exception: any
): BaseEvent => {
  if (exception == null) return event;
  event.data.exceptionClass = exception?.type ?? null;
  event.data.exceptionMessage = exception?.message ?? null;
  event.data.exceptionCode = exception?.code ?? null;
  event.data.exceptionHttpStatusCode = exception?.httpStatusCode ?? null;
  event.data.exceptionData = exception?.data ?? null;

  return event;
};
