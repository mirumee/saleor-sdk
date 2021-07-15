import { gql } from "@apollo/client";
import {
  checkoutFragment,
  // checkoutFragment,
  // checkoutProductVariantFragment,
  userFragment,
} from "./fragments";

export const USER = gql`
  ${userFragment}
  query UserDetails {
    me {
      ...UserFragment
    }
    authenticated @client
  }
`;

export const CHECKOUT = gql`
  ${checkoutFragment}
  query CheckoutDetails($token: UUID!) {
    checkout(token: $token) {
      ...CheckoutFragment
    }
  }
`;

// export const userCheckoutTokenList = gql`
//   query UserCheckoutTokenList($channel: String) {
//     me {
//       id
//       checkoutTokens(channel: $channel)
//     }
//   }
// `;

// export const checkoutProductVariants = gql`
//   ${checkoutProductVariantFragment}
//   query CheckoutProductVariants($ids: [ID], $channel: String) {
//     productVariants(ids: $ids, first: 100, channel: $channel) {
//       edges {
//         node {
//           ...ProductVariant
//         }
//       }
//     }
//   }
// `;
