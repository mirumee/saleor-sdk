import React, { useEffect, useMemo, useState } from "react";
import { persistCache } from "apollo-cache-persist";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

import { SaleorManager, createSaleorClient } from "../../../";
import { SaleorAPI } from "../../../api";
import { SaleorContext } from "../../context";
import { invalidTokenLinkWithTokenHandler, authLink } from "../../../auth";
import { cache } from "../../../cache";

import { IProps } from "./types";
import { PersistentStorage, PersistedData } from "apollo-cache-persist/types";

export function SaleorProvider({
  config,
  children,
}: IProps): React.ReactElement<IProps> {
  const [cachePersisted, setCachePersisted] = useState(false);
  const [context, setContext] = useState<SaleorAPI | null>(null);
  const [tokenExpired, setTokenExpired] = useState(false);

  /**
   * Persist cache for Apollo in local storage
   */
  useEffect(() => {
    (async function anyNameFunction() {
      await persistCache({
        cache,
        storage: window.localStorage as PersistentStorage<
          PersistedData<NormalizedCacheObject>
        >,
      });
      setCachePersisted(true);
    })();
  }, []);

  const tokenExpirationCallback = () => {
    setTokenExpired(true);
  };

  /**
   * Initialize Apollo Client and Saleor Manager
   */
  const apolloClient = useMemo(() => {
    if (cachePersisted) {
      const invalidTokenLink = invalidTokenLinkWithTokenHandler(
        tokenExpirationCallback
      );

      const client = createSaleorClient(
        config.apiUrl,
        invalidTokenLink,
        authLink,
        cache
      );

      const manager = new SaleorManager(client, config);

      manager.connect((saleorAPI) => setContext({ ...saleorAPI }));

      return client;
    }
  }, [cachePersisted]);

  useEffect(() => {
    if (tokenExpired) {
      context?.auth.signOut();
      setTokenExpired(false);
    }
  }, [tokenExpired, context]);

  if (apolloClient && context) {
    return (
      <SaleorContext.Provider value={context}>
        <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
      </SaleorContext.Provider>
    );
  }
  return <></>;
}
