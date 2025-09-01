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

import { plainToClass } from 'class-transformer';
import { BaseClient } from '../../common/BaseClient';
import { CommonUtils } from '../../common/CommonUtils';
import { PhonePeException } from '../../common/exception/Exceptions';
import { HttpMethodType } from '../../common/http/HttpMethodType';
import { Env } from '../../Env';
import { CustomCheckoutConstants } from './customcheckout/Constants';
import { CustomCheckoutPayRequest } from './models/request/CustomCheckoutPayRequest';
import { RefundRequest } from '../../common/models/request/RefundRequest';
import { CallbackResponse } from '../../common/models/response/CallbackResponse';
import { CustomCheckoutPayResponse } from './models/response/CustomCheckoutPayResponse';
import { OrderStatusResponse } from '../../common/models/response/OrderStatusResponse';
import { RefundResponse } from '../../common/models/response/RefundResponse';
import { RefundStatusResponse } from '../../common/models/response/RefundStatusResponse';
import { PaymentFlowType } from '../../common/models/PaymentFlowType';
import { CreateSdkOrderRequest } from './models/request/CreateSdkOrderRequest';
import { CreateSdkOrderResponse } from './models/response/CreateSdkOrderResponse';
import { Constants } from '../../common/exception/Constants';
import { Headers } from '../../common/constants/Headers';
import { EventType } from '../../common/events/models/enums/EventType';
import { EventState } from '../../common/events/models/enums/EventState';
import {
  buildCreateSdkOrderEvent,
  buildCustomCheckoutPayRequest,
  buildInitClientEvent,
  buildOrderStatusEvent,
  buildRefundEvent,
  buildRefundStatusEvent,
  buildTransactionStatusEvent,
} from '../../common/events/builders/EventBuillder';

export class CustomCheckoutClient extends BaseClient {
  private static _client: CustomCheckoutClient;
  private headers: { [key: string]: string };

  private constructor(
    clientId: string,
    clientSecret: string,
    clientVersion: number,
    env: Env,
    shouldPublishEvents: boolean
  ) {
    super(clientId, clientSecret, clientVersion, env, shouldPublishEvents);
    this.eventPublisher.send(
      buildInitClientEvent(
        EventType.CUSTOM_CHECKOUT_CLIENT_INITIALIZED,
        PaymentFlowType.PG
      )
    );
    this.headers = this.prepareHeaders();
  }

  /**
   * Generates a CustomCheckout Client for interacting with the PhonePe APIs
   *
   * @param clientId      Unique clientId assigned to merchant by PhonePe
   * @param clientSecret  Secret provided by PhonePe
   * @param clientVersion The client version used for secure transactions
   * @param env           Set to `Env.SANDBOX` for the SANDBOX environment  or `Env.PRODUCTION` for the production
   *                      environment.
   * @param shouldPublishEvents When true, events are sent to PhonePe providing smoother experience
   * @return CustomCheckoutClient object for interacting with the PhonePe APIs
   */
  static getInstance = (
    clientId: string,
    clientSecret: string,
    clientVersion: number,
    env: Env,
    shouldPublishEvents = true
  ): CustomCheckoutClient => {
    shouldPublishEvents = shouldPublishEvents && env == Env.PRODUCTION;
    if (CustomCheckoutClient._client == undefined) {
      CustomCheckoutClient._client = new CustomCheckoutClient(
        clientId,
        clientSecret,
        clientVersion,
        env,
        shouldPublishEvents
      );
      return CustomCheckoutClient._client;
    }

    const requestedClientSHA: string = CommonUtils.calculateSha256({
      clientId: clientId,
      clientSecret: clientSecret,
      clientVersion: clientVersion,
      env: env,
      shouldPublishEvents: shouldPublishEvents,
      paymentFlowType: PaymentFlowType.PG,
    });

    const cachedClientSHA: string = CommonUtils.calculateSha256({
      clientId: CustomCheckoutClient._client.merchantConfig.clientId,
      clientSecret: CustomCheckoutClient._client.merchantConfig.clientSecret,
      clientVersion: CustomCheckoutClient._client.merchantConfig.clientVersion,
      env: CustomCheckoutClient._client.env,
      shouldPublishEvents: CustomCheckoutClient._client.shouldPublishEvents,
      paymentFlowType: PaymentFlowType.PG,
    });

    if (requestedClientSHA == cachedClientSHA)
      return CustomCheckoutClient._client;

    throw new PhonePeException(
      Constants.CLIENT_EXCEPTION(CustomCheckoutClient._client.constructor.name)
    );
  };

  /**
   * Initiate a Pay Order
   *
   * @param payRequest Request required to initiate the order. Depending on the instrument type, different builders can be used
   * @return Promise<CustomCheckoutPayResponse> which contains the data according to the instrument used
   */
  pay = async (
    payRequest: CustomCheckoutPayRequest
  ): Promise<CustomCheckoutPayResponse> => {
    const url: string = CustomCheckoutConstants.PAY_API;
    try {
      const response =
        await this.requestViaAuthRefresh<CustomCheckoutPayResponse>(
          HttpMethodType.POST,
          url,
          CustomCheckoutPayResponse,
          this.headers,
          payRequest
        );
      this.eventPublisher.send(
        buildCustomCheckoutPayRequest(
          EventState.SUCCESS,
          EventType.PAY_SUCCESS,
          payRequest,
          url
        )
      );
      return response;
    } catch (error: unknown) {
      this.eventPublisher.send(
        buildCustomCheckoutPayRequest(
          EventState.FAILED,
          EventType.PAY_FAILED,
          payRequest,
          url,
          error
        )
      );
      throw error;
    }
  };

  /**
   * Gets status of an order
   *
   * @param merchantOrderId Order id generated by merchant
   * @param details         true -> order status has all attempt details under paymentDetails list
   *                        false -> order status has only latest attempt details under paymentDetails list
   * @return Promise<OrderStatusResponse> which contains the details about the order
   */
  getOrderStatus = async (
    merchantOrderId: string,
    details = false
  ): Promise<OrderStatusResponse> => {
    const url: string = CustomCheckoutConstants.ORDER_STATUS_API.replace(
      '{ORDER_ID}',
      merchantOrderId
    );
    try {
      const response = await this.requestViaAuthRefresh<OrderStatusResponse>(
        HttpMethodType.GET,
        url,
        OrderStatusResponse,
        this.headers,
        {},
        { [CustomCheckoutConstants.ORDER_DETAILS]: details.toString() }
      );
      this.eventPublisher.send(
        buildOrderStatusEvent(
          EventState.SUCCESS,
          merchantOrderId,
          PaymentFlowType.PG,
          url,
          EventType.ORDER_STATUS_SUCCESS
        )
      );
      return response;
    } catch (error: unknown) {
      this.eventPublisher.send(
        buildOrderStatusEvent(
          EventState.FAILED,
          merchantOrderId,
          PaymentFlowType.PG,
          url,
          EventType.ORDER_STATUS_FAILED,
          error
        )
      );
      throw error;
    }
  };

  /**
   * Initiate a refund of an order which is in completed state
   *
   * @param refundRequest Request required to initiate the order. It is build using RefundRequest.builder()
   * @return Promise<RefundResponse> which contains the details about the refund
   */
  refund = async (refundRequest: RefundRequest): Promise<RefundResponse> => {
    const url: string = CustomCheckoutConstants.REFUND_API;
    try {
      const response = await this.requestViaAuthRefresh<RefundResponse>(
        HttpMethodType.POST,
        url,
        RefundResponse,
        this.headers,
        refundRequest
      );
      this.eventPublisher.send(
        buildRefundEvent(
          EventState.SUCCESS,
          refundRequest,
          url,
          PaymentFlowType.PG,
          EventType.REFUND_SUCCESS
        )
      );
      return response;
    } catch (error: unknown) {
      this.eventPublisher.send(
        buildRefundEvent(
          EventState.FAILED,
          refundRequest,
          url,
          PaymentFlowType.PG,
          EventType.REFUND_FAILED,
          error
        )
      );
      throw error;
    }
  };

  /**
   * Gets the status of refund
   *
   * @param refundId Generated by merchant at the time of initiating the refund
   * @return Promise<RefundStatusResponse> which contains the status about the refund
   */
  getRefundStatus = async (refundId: string): Promise<RefundStatusResponse> => {
    const url: string = CustomCheckoutConstants.REFUND_STATUS_API.replace(
      '{REFUND_ID}',
      refundId
    );
    try {
      const response = await this.requestViaAuthRefresh<RefundStatusResponse>(
        HttpMethodType.GET,
        url,
        RefundStatusResponse,
        this.headers
      );
      this.eventPublisher.send(
        buildRefundStatusEvent(
          EventState.SUCCESS,
          EventType.REFUND_STATUS_SUCCESS,
          refundId,
          url,
          PaymentFlowType.PG
        )
      );
      return response;
    } catch (error: unknown) {
      this.eventPublisher.send(
        buildRefundStatusEvent(
          EventState.FAILED,
          EventType.REFUND_STATUS_FAILED,
          refundId,
          url,
          PaymentFlowType.PG
        )
      );
      throw error;
    }
  };

  /**
   * Gets the status of a transaction attempted
   *
   * @param transactionId Transaction attempt id generated by PhonePe
   * @return Promise<OrderStatusResponse> which contains the details about that specific transactionId
   */
  getTransactionStatus = async (
    transactionId: string
  ): Promise<OrderStatusResponse> => {
    const url: string = CustomCheckoutConstants.TRANSACTION_STATUS_API.replace(
      '{TRANSACTION_ID}',
      transactionId
    );
    try {
      const response = await this.requestViaAuthRefresh<OrderStatusResponse>(
        HttpMethodType.GET,
        url,
        OrderStatusResponse,
        this.headers
      );
      this.eventPublisher.send(
        buildTransactionStatusEvent(
          EventState.SUCCESS,
          EventType.TRANSACTION_STATUS_SUCCESS,
          transactionId,
          url,
          PaymentFlowType.PG
        )
      );
      return response;
    } catch (error: unknown) {
      this.eventPublisher.send(
        buildTransactionStatusEvent(
          EventState.FAILED,
          EventType.TRANSACTION_STATUS_FAILED,
          transactionId,
          url,
          PaymentFlowType.PG,
          error
        )
      );
      throw error;
    }
  };

  /**
   * Create order token for SDK integrated order requests
   *
   * @param sdkRequest Request object build using CreateSdkOrderRequest.builder()
   * @return Promise<CreateSdkOrderResponse> which contains token details to be consumed by the UI
   */
  createSdkOrder = async (
    sdkRequest: CreateSdkOrderRequest
  ): Promise<CreateSdkOrderResponse> => {
    const url: string = CustomCheckoutConstants.CREATE_ORDER_API;
    try {
      const response = await this.requestViaAuthRefresh<CreateSdkOrderResponse>(
        HttpMethodType.POST,
        url,
        CreateSdkOrderResponse,
        this.headers,
        sdkRequest
      );
      this.eventPublisher.send(
        buildCreateSdkOrderEvent(
          EventState.SUCCESS,
          EventType.CREATE_SDK_ORDER_SUCCESS,
          sdkRequest,
          url,
          PaymentFlowType.PG
        )
      );
      return response;
    } catch (error: unknown) {
      this.eventPublisher.send(
        buildCreateSdkOrderEvent(
          EventState.SUCCESS,
          EventType.CREATE_SDK_ORDER_SUCCESS,
          sdkRequest,
          url,
          PaymentFlowType.PG
        )
      );
      throw error;
    }
  };

  /**
   * Validate if the callback is valid
   *
   * @param username      username set by the merchant on the dashboard
   * @param password      password set by the merchant on the dashboard
   * @param authorization String data under `authorization` key of response headers
   * @param responseBody  Callback response body
   * @return CallbackResponse Deserialized callback body
   * @throws PhonePeException when callback is not valid
   */
  validateCallback = (
    username: string,
    password: string,
    authorization: string,
    responseBody: string
  ) => {
    if (!CommonUtils.isCallbackValid(username, password, authorization)) {
      throw new PhonePeException('Invalid Callback', 417);
    }
    const parsedBody = JSON.parse(responseBody);
    return plainToClass(CallbackResponse, parsedBody);
  };

  prepareHeaders = () => {
    return {
      [Headers.CONTENT_TYPE]: Headers.APPLICATION_JSON,
      [Headers.SOURCE]: Headers.INTEGRATION,
      [Headers.SOURCE_VERSION]: Headers.API_VERSION,
      [Headers.SOURCE_PLATFORM]: Headers.SDK_TYPE,
      [Headers.SOURCE_PLATFORM_VERSION]: Headers.SDK_VERSION,
    };
  };
}
