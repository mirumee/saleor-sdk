import {
  ICheckoutModelPrice,
  ICheckoutModelPriceValue,
} from "../helpers/LocalStorageHandler";

export enum StateItems {
  LOADED,
  USER,
  SIGN_IN_TOKEN,
  CHECKOUT,
  SUMMARY_PRICES,
  PROMO_CODE,
  PAYMENT,
  PAYMENT_GATEWAYS,
}

export interface ISaleorStateSummeryPrices {
  shippingPrice?: ICheckoutModelPriceValue;
  subtotalPrice?: ICheckoutModelPrice;
  totalPrice?: ICheckoutModelPrice;
  discount?: ICheckoutModelPriceValue;
}
