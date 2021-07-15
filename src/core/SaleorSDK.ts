import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { auth, AuthSDK } from "./auth";
import { checkout, CheckoutSDK } from "./checkout";

export interface Core {
  auth: AuthSDK;
  checkout: CheckoutSDK;
}

export const SaleorSDK = (
  client: ApolloClient<NormalizedCacheObject>
): Core => {
  const authSDK = auth(client);
  const checkoutSDK = checkout(client);

  return { auth: authSDK, checkout: checkoutSDK };
};
