import {
  ApolloClient,
  FetchResult,
  NormalizedCacheObject,
} from "@apollo/client";
import { ADD_LINES, CREATE_CHECKOUT } from "../apollo/mutations";
import { CHECKOUT } from "../apollo/queries";
import {
  AddCheckoutLinesMutation,
  CreateCheckoutMutation,
} from "../apollo/types";

import { addLinesCheckoutOpts, createCheckoutOpts } from "./types";

export interface CheckoutSDK {
  create: (
    opts: createCheckoutOpts
  ) => Promise<FetchResult<CreateCheckoutMutation>>;
  addLines: (
    opts: addLinesCheckoutOpts
  ) => Promise<FetchResult<AddCheckoutLinesMutation>>;
}

export const checkout = (
  client: ApolloClient<NormalizedCacheObject>
): CheckoutSDK => {
  /**
   * Creates checkout.
   *
   * @param opts - Object with lines and parameters of checkout.
   * @returns Promise resolved with CheckoutFragment type data
   */
  const create: CheckoutSDK["create"] = async opts => {
    const result = await client.mutate({
      mutation: CREATE_CHECKOUT,
      variables: {
        checkoutInput: {
          ...opts,
        },
      },
    });

    client.writeQuery({
      query: CHECKOUT,
      data: {
        checkout: {
          ...result.data.checkoutCreate.checkout,
        },
      },
    });

    return result;
  };

  /**
   * Add lines to specified checkout.
   *
   * @param opts - Object with lines and specified id of checkout.
   * @returns Promise resolved with CheckoutFragment type data
   */
  const addLines: CheckoutSDK["addLines"] = async opts => {
    const result = await client.mutate({
      mutation: ADD_LINES,
      variables: {
        ...opts,
      },
    });

    return result;
  };

  return { create, addLines };
};
