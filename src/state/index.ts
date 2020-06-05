import { round } from "lodash";

import { ApolloClientManager } from "../data/ApolloClientManager";
import { PaymentGateway } from "../fragments/gqlTypes/PaymentGateway";
import { User } from "../fragments/gqlTypes/User";
import { NamedObservable } from "../helpers";
import {
  ICheckoutModel,
  IPaymentModel,
  LocalStorageEvents,
  LocalStorageHandler,
  LocalStorageItems,
} from "../helpers/LocalStorageHandler";
import { JobsManager } from "../jobs";
import { Config } from "../types";
import { ISaleorStateSummeryPrices, StateItems } from "./types";

export interface SaleorStateLoaded {
  user: boolean;
  signInToken: boolean;
  checkout: boolean;
  payment: boolean;
  paymentGateways: boolean;
  summaryPrices: boolean;
}

const defaultSaleorStateLoaded = {
  checkout: false,
  payment: false,
  paymentGateways: false,
  signInToken: false,
  summaryPrices: false,
  user: false,
};

export class SaleorState extends NamedObservable<StateItems> {
  user?: User | null;
  signInToken?: string | null;
  checkout?: ICheckoutModel;
  promoCode?: string;
  selectedShippingAddressId?: string;
  selectedBillingAddressId?: string;
  payment?: IPaymentModel | null;
  summaryPrices?: ISaleorStateSummeryPrices;
  // Should be changed it in future to shop object containing payment gateways besides all the shop data
  availablePaymentGateways?: PaymentGateway[] | null;

  loaded: SaleorStateLoaded;

  private localStorageHandler: LocalStorageHandler;
  private apolloClientManager: ApolloClientManager;
  private jobsManager: JobsManager;

  constructor(
    config: Config,
    localStorageHandler: LocalStorageHandler,
    apolloClientManager: ApolloClientManager,
    jobsManager: JobsManager
  ) {
    super();
    this.localStorageHandler = localStorageHandler;
    this.apolloClientManager = apolloClientManager;
    this.jobsManager = jobsManager;

    this.loaded = defaultSaleorStateLoaded;

    this.subscribeStateToChanges();
    this.initializeState(config);
  }

  /**
   * Subscribes to particular changes occuring in data sources like apollo cache or local storage.
   * Every update in data source will result in update of respective class member.
   */
  private subscribeStateToChanges = () => {
    this.localStorageHandler.subscribeToChange(
      LocalStorageItems.CHECKOUT,
      this.onCheckoutUpdate
    );
    this.localStorageHandler.subscribeToChange(
      LocalStorageItems.PAYMENT,
      this.onPaymentUpdate
    );
    this.apolloClientManager.subscribeToPaymentGatewaysChange(
      this.onPaymentGatewaysUpdate
    );
    this.localStorageHandler.subscribeToChange(
      LocalStorageItems.TOKEN,
      this.onSignInTokenUpdate
    );
    this.localStorageHandler.subscribeToChange(
      LocalStorageEvents.CLEAR,
      this.onClearLocalStorage
    );
    this.apolloClientManager.subscribeToUserChange(this.onUserUpdate);
  };

  /**
   * Initialize class members with cached or fetched data.
   */
  private initializeState = async (config: Config) => {
    if (config.loadOnStart.auth) {
      this.onSignInTokenUpdate(this.localStorageHandler.getSignInToken());
      await this.jobsManager.run("auth", "provideUser", undefined);
    }
    if (config.loadOnStart.checkout) {
      await this.jobsManager.run("checkout", "provideCheckout", {
        isUserSignedIn: !!this.user,
      });
      this.onPaymentUpdate(this.localStorageHandler.getPayment());
      await this.jobsManager.run(
        "checkout",
        "providePaymentGateways",
        undefined
      );
    }
  };

  private onLoadedUpdate = (newLoaded: Partial<SaleorStateLoaded>) => {
    this.loaded = {
      ...this.loaded,
      ...newLoaded,
    };
    this.notifyChange(StateItems.LOADED, this.loaded);
  };
  private onClearLocalStorage = () => {
    this.onSignInTokenUpdate(null);
    this.onUserUpdate(null);
    this.onCheckoutUpdate();
    this.onPaymentUpdate();
  };

  private onSignInTokenUpdate = (token: string | null) => {
    this.signInToken = token;
    this.notifyChange(StateItems.SIGN_IN_TOKEN, this.signInToken);
    this.onLoadedUpdate({
      signInToken: true,
    });
  };
  private onUserUpdate = (user: User | null) => {
    this.user = user;
    this.notifyChange(StateItems.USER, this.user);
    this.onLoadedUpdate({
      user: true,
    });
  };
  private onCheckoutUpdate = (checkout?: ICheckoutModel) => {
    this.checkout = checkout;
    this.summaryPrices = this.calculateSummaryPrices(checkout);
    this.notifyChange(StateItems.CHECKOUT, this.checkout);
    this.notifyChange(StateItems.SUMMARY_PRICES, this.summaryPrices);
    this.onLoadedUpdate({
      checkout: true,
      summaryPrices: true,
    });
  };
  private onPaymentUpdate = (payment?: IPaymentModel | null) => {
    this.payment = payment;
    this.notifyChange(StateItems.PAYMENT, this.payment);
    this.onLoadedUpdate({
      payment: true,
    });
  };
  private onPaymentGatewaysUpdate = (
    paymentGateways?: PaymentGateway[] | null
  ) => {
    this.availablePaymentGateways = paymentGateways;
    this.notifyChange(
      StateItems.PAYMENT_GATEWAYS,
      this.availablePaymentGateways
    );
    this.onLoadedUpdate({
      paymentGateways: true,
    });
  };

  private calculateSummaryPrices(
    checkout?: ICheckoutModel
  ): ISaleorStateSummeryPrices {
    const items = checkout?.lines;
    const shippingMethod = checkout?.shippingMethod;
    const promoCodeDiscount = checkout?.promoCodeDiscount?.discount;

    if (items && items.length) {
      const firstItemTotalPrice = items[0].totalPrice;

      if (firstItemTotalPrice) {
        const shippingPrice = {
          ...shippingMethod?.price,
          amount: shippingMethod?.price?.amount || 0,
          currency:
            shippingMethod?.price?.currency ||
            firstItemTotalPrice.gross.currency,
        };

        const { itemsNetPrice, itmesGrossPrice } = items.reduce(
          (prevVals, item) => {
            prevVals.itemsNetPrice += item.totalPrice?.net.amount || 0;
            prevVals.itmesGrossPrice += item.totalPrice?.gross.amount || 0;
            return prevVals;
          },
          {
            itemsNetPrice: 0,
            itmesGrossPrice: 0,
          }
        );

        const subtotalPrice = {
          ...firstItemTotalPrice,
          gross: {
            ...firstItemTotalPrice.gross,
            amount: round(itmesGrossPrice, 2),
          },
          net: {
            ...firstItemTotalPrice.net,
            amount: round(itemsNetPrice, 2),
          },
        };

        const discount = {
          ...promoCodeDiscount,
          amount: promoCodeDiscount?.amount || 0,
          currency:
            promoCodeDiscount?.currency || firstItemTotalPrice.gross.currency,
        };

        const totalPrice = {
          ...subtotalPrice,
          gross: {
            ...subtotalPrice.gross,
            amount: round(
              itmesGrossPrice + shippingPrice.amount - discount.amount,
              2
            ),
          },
          net: {
            ...subtotalPrice.net,
            amount: round(
              itemsNetPrice + shippingPrice.amount - discount.amount,
              2
            ),
          },
        };

        return {
          discount,
          shippingPrice,
          subtotalPrice,
          totalPrice,
        };
      }
    }
    return {};
  }
}
