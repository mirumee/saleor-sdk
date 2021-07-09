import {
  DataErrorCheckoutTypes,
  FunctionErrorCheckoutTypes,
} from "../../api/Checkout/types";
import { ApolloClientManager } from "../../data/ApolloClientManager";
import { LocalStorageHandler } from "../../helpers/LocalStorageHandler";
import { JobRunResponse } from "../types";
import {
  CompleteCheckoutJobInput,
  CreatePaymentJobInput,
  RemovePromoCodeJobInput,
  AddPromoCodeJobInput,
  SetShippingMethodJobInput,
  ProvideCheckoutJobInput,
  CreateCheckoutJobInput,
  SetShippingAddressJobInput,
  SetBillingAddressJobInput,
  SetBillingAddressWithEmailJobInput,
} from "./types";
import { JobsHandler } from "../JobsHandler";
import { InitializePaymentVariables } from "../../mutations/gqlTypes/InitializePayment";

export type PromiseCheckoutJobRunResponse = Promise<
  JobRunResponse<DataErrorCheckoutTypes, FunctionErrorCheckoutTypes>
>;

class CheckoutJobs extends JobsHandler<{}> {
  private apolloClientManager: ApolloClientManager;

  private localStorageHandler: LocalStorageHandler;

  constructor(
    localStorageHandler: LocalStorageHandler,
    apolloClientManager: ApolloClientManager
  ) {
    super();
    this.apolloClientManager = apolloClientManager;
    this.localStorageHandler = localStorageHandler;
  }

  provideCheckout = async ({
    isUserSignedIn,
    channel,
  }: ProvideCheckoutJobInput): PromiseCheckoutJobRunResponse => {
    const checkout = LocalStorageHandler.getCheckout();

    const { data, error } = await this.apolloClientManager.getCheckout(
      isUserSignedIn,
      channel,
      checkout?.token
    );

    if (error) {
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.GET_CHECKOUT,
        },
      };
    }
    this.localStorageHandler.setCheckout(data || checkout);

    return {
      data,
    };
  };

  createCheckout = async ({
    email,
    lines,
    channel,
    shippingAddress,
    selectedShippingAddressId,
    billingAddress,
    selectedBillingAddressId,
  }: CreateCheckoutJobInput): PromiseCheckoutJobRunResponse => {
    const cleanedLines = lines.filter(line => line.quantity !== 0);
    const { data, error } = await this.apolloClientManager.createCheckout(
      email,
      cleanedLines,
      channel,
      shippingAddress,
      billingAddress
    );

    if (error) {
      /**
       * TODO: Differentiate errors!!! THIS IS A BUG!!!
       * DataErrorCheckoutTypes.SET_SHIPPING_ADDRESS is just one of every possible - instead of deprecated errors, checkoutErrors should be used.
       */
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.SET_SHIPPING_ADDRESS,
        },
      };
    }

    this.localStorageHandler.setCheckout({
      ...data,
      selectedBillingAddressId,
      selectedShippingAddressId,
    });
    return {
      data,
    };
  };

  setShippingAddress = async ({
    checkoutId,
    shippingAddress,
    email,
    selectedShippingAddressId,
    channel,
  }: SetShippingAddressJobInput): PromiseCheckoutJobRunResponse => {
    const checkout = LocalStorageHandler.getCheckout();

    const { data, error } = await this.apolloClientManager.setShippingAddress(
      shippingAddress,
      email,
      checkoutId,
      channel
    );

    if (error) {
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.SET_SHIPPING_ADDRESS,
        },
      };
    }

    this.localStorageHandler.setCheckout({
      ...checkout,
      availableShippingMethods: data?.availableShippingMethods,
      billingAsShipping: false,
      email: data?.email,
      selectedShippingAddressId,
      shippingAddress: data?.shippingAddress,
    });
    return { data };
  };

  setBillingAddress = async ({
    checkoutId,
    billingAddress,
    billingAsShipping,
    selectedBillingAddressId,
  }: SetBillingAddressJobInput): PromiseCheckoutJobRunResponse => {
    const checkout = LocalStorageHandler.getCheckout();

    const { data, error } = await this.apolloClientManager.setBillingAddress(
      billingAddress,
      checkoutId
    );

    if (error) {
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.SET_BILLING_ADDRESS,
        },
      };
    }

    this.localStorageHandler.setCheckout({
      ...checkout,
      availablePaymentGateways: data?.availablePaymentGateways,
      billingAddress: data?.billingAddress,
      billingAsShipping: !!billingAsShipping,
      selectedBillingAddressId,
    });
    return { data };
  };

  setBillingAddressWithEmail = async ({
    checkoutId,
    email,
    billingAddress,
    selectedBillingAddressId,
  }: SetBillingAddressWithEmailJobInput): PromiseCheckoutJobRunResponse => {
    const checkout = LocalStorageHandler.getCheckout();

    const {
      data,
      error,
    } = await this.apolloClientManager.setBillingAddressWithEmail(
      billingAddress,
      email,
      checkoutId
    );

    if (error) {
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.SET_BILLING_ADDRESS,
        },
      };
    }

    this.localStorageHandler.setCheckout({
      ...checkout,
      availablePaymentGateways: data?.availablePaymentGateways,
      billingAddress: data?.billingAddress,
      billingAsShipping: false,
      email: data?.email,
      selectedBillingAddressId,
    });
    return { data };
  };

  setShippingMethod = async ({
    checkoutId,
    shippingMethodId,
  }: SetShippingMethodJobInput): PromiseCheckoutJobRunResponse => {
    const checkout = LocalStorageHandler.getCheckout();

    const { data, error } = await this.apolloClientManager.setShippingMethod(
      shippingMethodId,
      checkoutId
    );

    if (error) {
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.SET_SHIPPING_METHOD,
        },
      };
    }

    this.localStorageHandler.setCheckout({
      ...checkout,
      promoCodeDiscount: data?.promoCodeDiscount,
      shippingMethod: data?.shippingMethod,
    });
    return { data };
  };

  addPromoCode = async ({
    checkoutId,
    promoCode,
  }: AddPromoCodeJobInput): PromiseCheckoutJobRunResponse => {
    const checkout = LocalStorageHandler.getCheckout();

    const { data, error } = await this.apolloClientManager.addPromoCode(
      promoCode,
      checkoutId
    );

    if (error) {
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.ADD_PROMO_CODE,
        },
      };
    }

    this.localStorageHandler.setCheckout({
      ...checkout,
      promoCodeDiscount: data?.promoCodeDiscount,
    });
    return { data };
  };

  removePromoCode = async ({
    checkoutId,
    promoCode,
  }: RemovePromoCodeJobInput): PromiseCheckoutJobRunResponse => {
    const checkout = LocalStorageHandler.getCheckout();

    const { data, error } = await this.apolloClientManager.removePromoCode(
      promoCode,
      checkoutId
    );

    if (error) {
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.REMOVE_PROMO_CODE,
        },
      };
    }

    this.localStorageHandler.setCheckout({
      ...checkout,
      promoCodeDiscount: data?.promoCodeDiscount,
    });
    return { data };
  };

  createPayment = async ({
    checkoutId,
    amount,
    gateway,
    token,
    creditCard,
    returnUrl,
  }: CreatePaymentJobInput): PromiseCheckoutJobRunResponse => {
    const payment = LocalStorageHandler.getPayment();

    const { data, error } = await this.apolloClientManager.createPayment({
      amount,
      checkoutId,
      gateway,
      returnUrl,
      token,
    });

    if (error) {
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.CREATE_PAYMENT,
        },
      };
    }

    this.localStorageHandler.setPayment({
      ...payment,
      creditCard,
      gateway: data?.gateway,
      id: data?.id,
      token: data?.token,
      total: data?.total,
    });
    return { data };
  };

  initializePayment = async (
    variables: InitializePaymentVariables
  ): PromiseCheckoutJobRunResponse => {
    const { data, error } = await this.apolloClientManager.initializePayment(
      variables
    );

    if (error) {
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.INITIALIZE_PAYMENT,
        },
      };
    }

    return { data };
  };

  completeCheckout = async ({
    checkoutId,
    paymentData,
    redirectUrl,
    storeSource,
  }: CompleteCheckoutJobInput): PromiseCheckoutJobRunResponse => {
    const { data, error } = await this.apolloClientManager.completeCheckout({
      checkoutId,
      paymentData,
      redirectUrl,
      storeSource,
    });

    if (error) {
      return {
        dataError: {
          error,
          type: DataErrorCheckoutTypes.COMPLETE_CHECKOUT,
        },
      };
    }

    if (!data?.confirmationNeeded) {
      this.localStorageHandler.setCheckout({});
      this.localStorageHandler.setPayment({});
    }

    return { data };
  };
}

export default CheckoutJobs;
