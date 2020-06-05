import { ApolloCache } from "apollo-cache";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { RetryLink } from "apollo-link-retry";

import { SaleorAPI } from "./api";
import { APIProxy } from "./api/APIProxy";
import { CustomConfig } from "./types";

const getLink = (
  apiUrl: string,
  invalidTokenLink: ApolloLink,
  authLink: ApolloLink
) =>
  ApolloLink.from([
    invalidTokenLink,
    authLink,
    new RetryLink(),
    new BatchHttpLink({ uri: apiUrl }),
  ]);

export function createSaleorClient(
  apiUrl: string,
  invalidTokenLink: ApolloLink,
  authLink: ApolloLink,
  cache: ApolloCache<any>
) {
  return new ApolloClient({
    cache,
    link: getLink(apiUrl, invalidTokenLink, authLink),
  });
}

export class SaleorManager {
  private apiProxy: APIProxy;
  private api: SaleorAPI;
  private apiChangeListener: ((api: SaleorAPI) => any) | undefined;

  constructor(client: ApolloClient<any>, config: CustomConfig) {
    this.apiProxy = new APIProxy(client);
    this.api = new SaleorAPI(
      client,
      this.apiProxy,
      config,
      this.onSaleorAPIChange
    );
  }

  /**
   * Use this method to obtain current API and listen to its update on occured changes within it.
   * @param apiChangeListener Function called to get an API and called on every API update.
   */
  connect(apiChangeListener: (api: SaleorAPI) => any) {
    this.apiChangeListener = apiChangeListener;
    this.apiChangeListener(this.api);
  }

  private onSaleorAPIChange = () => {
    if (this.apiChangeListener) {
      this.apiChangeListener(this.api);
    }
  };
}

export * from "./auth";
export * from "./gqlTypes/globalTypes";
export * from "./react";
