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

/**
 * Creates a request to initiate a refund -> RefundRequest.builder()
 */
export class RefundRequest {
  public merchantRefundId!: string;
  public originalMerchantOrderId!: string;
  public amount!: number;

  public constructor(
    merchantRefundId: string,
    originalMerchantOrderId: string,
    amount: number
  ) {
    this.merchantRefundId = merchantRefundId;
    this.originalMerchantOrderId = originalMerchantOrderId;
    this.amount = amount;
  }

  static builder = () => {
    return new RefundRequestBuilder();
  };
}

class RefundRequestBuilder {
  private _merchantRefundId!: string;
  private _originalMerchantOrderId!: string;
  private _amount!: number;

  merchantRefundId = (merchantRefundId: string): RefundRequestBuilder => {
    this._merchantRefundId = merchantRefundId;
    return this;
  };

  originalMerchantOrderId = (
    originalMerchantOrderId: string
  ): RefundRequestBuilder => {
    this._originalMerchantOrderId = originalMerchantOrderId;
    return this;
  };

  amount = (amount: number): RefundRequestBuilder => {
    this._amount = amount;
    return this;
  };

  build = (): RefundRequest => {
    return new RefundRequest(
      this._merchantRefundId,
      this._originalMerchantOrderId,
      this._amount
    );
  };
}
