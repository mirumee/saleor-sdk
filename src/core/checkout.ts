import {
  ApolloClient,
  FetchResult,
  NormalizedCacheObject,
} from "@apollo/client";
import { CREATE_CHECKOUT } from "../apollo/mutations";
import { CreateCheckoutMutation } from "../apollo/types";

import { createCheckoutOpts } from "./types";

export interface CheckoutSDK {
  create: (
    opts: createCheckoutOpts
  ) => Promise<FetchResult<CreateCheckoutMutation>>;
}

export const checkout = (
  client: ApolloClient<NormalizedCacheObject>
): CheckoutSDK => {
  const create: CheckoutSDK["create"] = async opts => {
    const result = await client.mutate({
      mutation: CREATE_CHECKOUT,
      variables: {
        checkoutInput: {
          ...opts,
        },
      },
    });

    return result;
  };

  return { create };
};
