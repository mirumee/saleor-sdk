import { CHECKOUT } from "../../apollo/queries";
import {
  AddressFragment,
  CheckoutDetailsQuery,
  CheckoutDetailsQueryVariables,
  CheckoutLineFragment,
  PriceFragment,
  ShippingMethodFragment,
} from "../../apollo/types";
import { hookFactory } from "../helpers/hookFactory";
import { hookStateFactory } from "../helpers/hookStateFactory";

type CheckoutState = {
  id: string | undefined;
  billingAddress?: AddressFragment | undefined;
  shippingAddress?: AddressFragment | undefined;
  lines?: Array<CheckoutLineFragment> | undefined;
  shippingPrice?: PriceFragment | undefined;
  shippingMethod?: ShippingMethodFragment | undefined;
  totalPrice?: PriceFragment | undefined;
};

/**
 * React hook to get checkout methods
 *
 * @returns Saleor's checkout methods
 */
export const useCheckout = hookFactory("checkout");

/**
 * React hook to get checkout data.
 *
 * @returns Object with checkout data
 */
export const useCheckoutState = (): CheckoutState => {
  const { data } = hookStateFactory<
    CheckoutDetailsQuery,
    CheckoutDetailsQueryVariables
  >(CHECKOUT);

  return {
    id: data?.checkout?.id,
    billingAddress: data?.checkout?.billingAddress,
    shippingAddress: data?.checkout?.shippingAddress,
    lines: data?.checkout?.lines,
    shippingPrice: data?.checkout?.shippingPrice,
    shippingMethod: data?.checkout?.shippingMethod,
    totalPrice: data?.checkout?.totalPrice,
  };
};
