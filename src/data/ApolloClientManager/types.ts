import { ApolloError } from "apollo-client";

export enum PendingSaveItems {
  UPDATE_CART = "updateCart",
  BILLING_ADDRESS = "billingAddress",
  SHIPPING_ADDRESS = "shippingAddress",
  SHIPPING_AS_BILLING_ADDRESS = "shippingAsBillingAddress",
}

export interface ApolloErrorWithUserInput extends ApolloError {
  extraInfo: {
    userInputErrors?: any[];
  };
}

export interface IApolloClientManagerResponse<T> {
  data?: T;
  error?: ApolloErrorWithUserInput;
}
