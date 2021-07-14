import { gql } from "@apollo/client";

import {
  accountErrorFragment,
  // checkoutErrorFragment,
  // paymentErrorFragment,
  // checkoutFragment,
  // orderDetailFragment,
  // paymentFragment,
  userFragment,
} from "./fragments";

export const LOGIN = gql`
  ${accountErrorFragment}
  ${userFragment}
  mutation login($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      csrfToken
      refreshToken
      token
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserFragment
      }
    }
  }
`;

export const REGISTER = gql`
  mutation register(
    $email: String!
    $password: String!
    $redirectUrl: String
    $channel: String!
  ) {
    accountRegister(
      input: {
        email: $email
        password: $password
        redirectUrl: $redirectUrl
        channel: $channel
      }
    ) {
      errors {
        field
        message
        code
      }
      requiresConfirmation
    }
  }
`;

export const REFRESH_TOKEN = gql`
  ${accountErrorFragment}
  mutation refreshToken($csrfToken: String, $refreshToken: String) {
    tokenRefresh(csrfToken: $csrfToken, refreshToken: $refreshToken) {
      token
      user {
        id
      }
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const VERIFY_TOKEN = gql`
  ${accountErrorFragment}
  mutation verifyToken($token: String!) {
    tokenVerify(token: $token) {
      isValid
      payload
      user {
        id
      }
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const CHANGE_USER_PASSWORD = gql`
  ${accountErrorFragment}
  mutation passwordChange($newPassword: String!, $oldPassword: String!) {
    passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  mutation requestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors {
        field
        message
        code
      }
    }
  }
`;

export const SET_PASSWORD = gql`
  ${userFragment}
  ${accountErrorFragment}
  mutation setPassword($token: String!, $email: String!, $password: String!) {
    setPassword(token: $token, email: $email, password: $password) {
      errors {
        ...AccountErrorFragment
      }
      token
      user {
        ...UserFragment
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  ${userFragment}
  ${accountErrorFragment}
  mutation accountUpdate($input: AccountInput!) {
    accountUpdate(input: $input) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserFragment
      }
    }
  }
`;

export const SET_ACCOUNT_DEFAULT_ADDRESS = gql`
  ${userFragment}
  ${accountErrorFragment}
  mutation setAccountDefaultAddress($id: ID!, $type: AddressTypeEnum!) {
    accountSetDefaultAddress(id: $id, type: $type) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserFragment
      }
    }
  }
`;

export const DELETE_ACCOUNT_ADDRESS = gql`
  ${userFragment}
  ${accountErrorFragment}
  mutation deleteAccountAddress($addressId: ID!) {
    accountAddressDelete(id: $addressId) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserFragment
      }
    }
  }
`;

export const CREATE_ACCOUNT_ADDRESS = gql`
  ${userFragment}
  ${accountErrorFragment}
  mutation createAccountAddress($input: AddressInput!) {
    accountAddressCreate(input: $input) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserFragment
      }
    }
  }
`;

export const UPDATE_ACCOUNT_ADDRESS = gql`
  ${userFragment}
  ${accountErrorFragment}
  mutation updateAccountAddress($input: AddressInput!, $id: ID!) {
    accountAddressUpdate(input: $input, id: $id) {
      errors {
        ...AccountErrorFragment
      }
      user {
        ...UserFragment
      }
    }
  }
`;

// export const updateCheckoutLineMutation = gql`
//   ${checkoutFragment}
//   ${checkoutErrorFragment}
//   mutation UpdateCheckoutLine($checkoutId: ID!, $lines: [CheckoutLineInput]!) {
//     checkoutLinesUpdate(checkoutId: $checkoutId, lines: $lines) {
//       checkout {
//         ...Checkout
//       }
//       errors {
//         ...CheckoutError
//       }
//     }
//   }
// `;

// export const createCheckoutMutation = gql`
//   ${checkoutFragment}
//   ${checkoutErrorFragment}
//   mutation CreateCheckout($checkoutInput: CheckoutCreateInput!) {
//     checkoutCreate(input: $checkoutInput) {
//       errors {
//         ...CheckoutError
//       }
//       checkout {
//         ...Checkout
//       }
//     }
//   }
// `;

// export const updateCheckoutBillingAddressWithEmailMutation = gql`
//   ${checkoutFragment}
//   ${checkoutErrorFragment}
//   mutation UpdateCheckoutBillingAddressWithEmail(
//     $checkoutId: ID!
//     $billingAddress: AddressInput!
//     $email: String!
//   ) {
//     checkoutBillingAddressUpdate(
//       checkoutId: $checkoutId
//       billingAddress: $billingAddress
//     ) {
//       errors {
//         ...CheckoutError
//       }
//       checkout {
//         ...Checkout
//       }
//     }
//     checkoutEmailUpdate(checkoutId: $checkoutId, email: $email) {
//       checkout {
//         ...Checkout
//       }
//       errors {
//         code
//         field
//         message
//       }
//     }
//   }
// `;

// export const updateCheckoutBillingAddressMutation = gql`
//   ${checkoutFragment}
//   ${checkoutErrorFragment}
//   mutation UpdateCheckoutBillingAddress(
//     $checkoutId: ID!
//     $billingAddress: AddressInput!
//   ) {
//     checkoutBillingAddressUpdate(
//       checkoutId: $checkoutId
//       billingAddress: $billingAddress
//     ) {
//       errors {
//         ...CheckoutError
//       }
//       checkout {
//         ...Checkout
//       }
//     }
//   }
// `;

// export const updateCheckoutShippingAddressMutation = gql`
//   ${checkoutFragment}
//   ${checkoutErrorFragment}
//   mutation UpdateCheckoutShippingAddress(
//     $checkoutId: ID!
//     $shippingAddress: AddressInput!
//     $email: String!
//   ) {
//     checkoutShippingAddressUpdate(
//       checkoutId: $checkoutId
//       shippingAddress: $shippingAddress
//     ) {
//       errors {
//         ...CheckoutError
//       }
//       checkout {
//         ...Checkout
//       }
//     }
//     checkoutEmailUpdate(checkoutId: $checkoutId, email: $email) {
//       checkout {
//         ...Checkout
//       }
//       errors {
//         ...CheckoutError
//       }
//     }
//   }
// `;

// export const updateCheckoutShippingMethodMutation = gql`
//   ${checkoutFragment}
//   ${checkoutErrorFragment}
//   mutation UpdateCheckoutShippingMethod(
//     $checkoutId: ID!
//     $shippingMethodId: ID!
//   ) {
//     checkoutShippingMethodUpdate(
//       checkoutId: $checkoutId
//       shippingMethodId: $shippingMethodId
//     ) {
//       checkout {
//         ...Checkout
//       }
//       errors {
//         ...CheckoutError
//       }
//     }
//   }
// `;

// export const addCheckoutPromoCode = gql`
//   ${checkoutFragment}
//   ${checkoutErrorFragment}
//   mutation AddCheckoutPromoCode($checkoutId: ID!, $promoCode: String!) {
//     checkoutAddPromoCode(checkoutId: $checkoutId, promoCode: $promoCode) {
//       checkout {
//         ...Checkout
//       }
//       errors {
//         ...CheckoutError
//       }
//     }
//   }
// `;

// export const removeCheckoutPromoCode = gql`
//   ${checkoutFragment}
//   ${checkoutErrorFragment}
//   mutation RemoveCheckoutPromoCode($checkoutId: ID!, $promoCode: String!) {
//     checkoutRemovePromoCode(checkoutId: $checkoutId, promoCode: $promoCode) {
//       checkout {
//         ...Checkout
//       }
//       errors {
//         ...CheckoutError
//       }
//     }
//   }
// `;

// export const createCheckoutPaymentMutation = gql`
//   ${checkoutFragment}
//   ${paymentFragment}
//   ${paymentErrorFragment}
//   mutation CreateCheckoutPayment(
//     $checkoutId: ID!
//     $paymentInput: PaymentInput!
//   ) {
//     checkoutPaymentCreate(checkoutId: $checkoutId, input: $paymentInput) {
//       checkout {
//         ...Checkout
//       }
//       payment {
//         ...Payment
//       }
//       errors {
//         ...PaymentError
//       }
//     }
//   }
// `;

// export const completeCheckoutMutation = gql`
//   ${orderDetailFragment}
//   ${checkoutErrorFragment}
//   mutation CompleteCheckout(
//     $checkoutId: ID!
//     $paymentData: JSONString
//     $redirectUrl: String
//     $storeSource: Boolean
//   ) {
//     checkoutComplete(
//       checkoutId: $checkoutId
//       paymentData: $paymentData
//       redirectUrl: $redirectUrl
//       storeSource: $storeSource
//     ) {
//       errors {
//         ...CheckoutError
//       }
//       order {
//         ...OrderDetail
//       }
//       confirmationNeeded
//       confirmationData
//     }
//   }
// `;
