import ApolloClient from "apollo-client";

import { defaultConfig } from "../config";
import { LocalStorageManager } from "../data";
import { ApolloClientManager } from "../data/ApolloClientManager";
import { LocalStorageHandler } from "../helpers/LocalStorageHandler";
import { JobsManager } from "../jobs";
import { SaleorState } from "../state";
import { CustomConfig } from "../types";
import { APIProxy } from "./APIProxy";
import { AuthAPI } from "./Auth";
import { SaleorCartAPI } from "./Cart";
import { SaleorCheckoutAPI } from "./Checkout";

export * from "./Checkout";
export * from "./Cart";

export class SaleorAPI {
  auth: AuthAPI;
  checkout: SaleorCheckoutAPI;
  cart: SaleorCartAPI;

  /**
   * @deprecated Please do not use it anymore. Reference to API Proxy will be removed in future.
   * Now it just exists for legacy React hooks, which also will be removed.
   */
  legacyAPIProxy: APIProxy;

  constructor(
    client: ApolloClient<any>,
    apiProxy: APIProxy,
    config: CustomConfig,
    onStateUpdate?: () => any
  ) {
    this.legacyAPIProxy = apiProxy;
    const finalConfig = {
      ...defaultConfig,
      ...config,
      loadOnStart: {
        ...defaultConfig.loadOnStart,
        ...config?.loadOnStart,
      },
    };

    const localStorageHandler = new LocalStorageHandler();
    const apolloClientManager = new ApolloClientManager(client);
    const jobsManager = new JobsManager(
      localStorageHandler,
      apolloClientManager
    );
    const saleorState = new SaleorState(
      finalConfig,
      localStorageHandler,
      apolloClientManager,
      jobsManager
    );
    const localStorageManager = new LocalStorageManager(
      localStorageHandler,
      saleorState
    );

    if (onStateUpdate) {
      saleorState.subscribeToNotifiedChanges(onStateUpdate);
    }

    this.auth = new AuthAPI(saleorState, jobsManager);
    this.checkout = new SaleorCheckoutAPI(saleorState, jobsManager);
    this.cart = new SaleorCartAPI(
      localStorageManager,
      apolloClientManager,
      saleorState,
      jobsManager
    );

    this.legacyAPIProxy.attachAuthListener((authenticated) => {
      if (!authenticated) {
        localStorageHandler.setCheckout({});
        localStorageHandler.setPayment({});
        localStorageHandler.setJobs(null);
      }
    });
  }
}
