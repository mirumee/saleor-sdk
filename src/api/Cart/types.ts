import {
  ICheckoutModelLine,
  ICheckoutModelPrice,
  ICheckoutModelPriceValue,
} from "../../helpers/LocalStorageHandler";

export type IItems = ICheckoutModelLine[] | null | undefined;
export type ITotalPrice = ICheckoutModelPrice | null | undefined;
export type ISubtotalPrice = ICheckoutModelPrice | null | undefined;
export type IShippingPrice = ICheckoutModelPriceValue | null | undefined;
export type IDiscount = ICheckoutModelPriceValue | null | undefined;
