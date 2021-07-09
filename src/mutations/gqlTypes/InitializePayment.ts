/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaymentErrorCode } from "./../../gqlTypes/globalTypes";

// ====================================================
// GraphQL mutation operation: InitializePayment
// ====================================================

export interface InitializePayment_paymentInitialize_initializedPayment {
  __typename: "PaymentInitialized";
  /**
   * Payment gateway.
   */
  gateway: string;
  /**
   * Payment gateway name.
   */
  name: string;
  /**
   * Initiliazed data by gateway.
   */
  data: any | null;
}

export interface InitializePayment_paymentInitialize_errors {
  __typename: "PaymentError";
  /**
   * The error code.
   */
  code: PaymentErrorCode;
  /**
   * Name of a field that caused the error. A value of `null` indicates that the
   * error isn't associated with a particular field.
   */
  field: string | null;
  /**
   * The error message.
   */
  message: string | null;
}

export interface InitializePayment_paymentInitialize {
  __typename: "PaymentInitialize";
  initializedPayment: InitializePayment_paymentInitialize_initializedPayment | null;
  errors: InitializePayment_paymentInitialize_errors[];
}

export interface InitializePayment {
  /**
   * Initializes payment process when it is required by gateway.
   */
  paymentInitialize: InitializePayment_paymentInitialize | null;
}

export interface InitializePaymentVariables {
  gateway: string;
  paymentData?: any | null;
}
