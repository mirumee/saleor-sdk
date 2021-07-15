import { gql } from "@apollo/client";

import {
  accountErrorFragment,
  checkoutErrorFragment,
  checkoutFragment,
  // paymentErrorFragment,
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
    $redirectUrl: String!
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
      accountErrors {
        field
        message
        code
      }
      requiresConfirmation
    }
  }
`;

export const CREATE_CHECKOUT = gql`
  ${checkoutFragment}
  ${checkoutErrorFragment}
  mutation CreateCheckout($checkoutInput: CheckoutCreateInput!) {
    checkoutCreate(input: $checkoutInput) {
      errors {
        ...CheckoutErrorFragment
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
`;

export const ADD_LINES = gql`
  ${checkoutFragment}
  ${checkoutErrorFragment}
  mutation AddCheckoutLines($checkoutId: ID!, $lines: [CheckoutLineInput]!) {
    checkoutLinesAdd(checkoutId: $checkoutId, lines: $lines) {
      checkout {
        ...CheckoutFragment
      }
      errors {
        ...CheckoutErrorFragment
      }
    }
  }
`;

// export const tokenVeryficationMutation = gql`
//   ${accountErrorFragment}
//   mutation VerifyToken($token: String!) {
//     tokenVerify(token: $token) {
//       isValid
//       payload
//       user {
//         id
//       }
//       errors {
//         ...AccountErrorFragment
//       }
//     }
//   }
// `;

// export const tokenRefreshMutation = gql`
//   ${accountErrorFragment}
//   mutation RefreshToken($csrfToken: String, $refreshToken: String) {
//     tokenRefresh(csrfToken: $csrfToken, refreshToken: $refreshToken) {
//       token
//       user {
//         id
//       }
//       errors {
//         ...AccountErrorFragment
//       }
//     }
//   }
// `;

// export const changeUserPassword = gql`
//   ${accountErrorFragment}
//   mutation PasswordChange($newPassword: String!, $oldPassword: String!) {
//     passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
//       errors {
//         ...AccountErrorFragment
//       }
//     }
//   }
// `;

// export const resetPasswordRequest = gql`
//   mutation ResetPasswordRequest($email: String!, $redirectUrl: String!) {
//     requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
//       accountErrors {
//         field
//         message
//         code
//       }
//     }
//   }
// `;

// export const accountUpdate = gql`
//   ${userFragment}
//   ${accountErrorFragment}
//   mutation AccountUpdate($input: AccountInput!) {
//     accountUpdate(input: $input) {
//       errors {
//         ...AccountErrorFragment
//       }
//       user {
//         ...User
//       }
//     }
//   }
// `;

// export const setPassword = gql`
//   ${userFragment}
//   ${accountErrorFragment}
//   mutation SetPassword($token: String!, $email: String!, $password: String!) {
//     setPassword(token: $token, email: $email, password: $password) {
//       errors {
//         ...AccountErrorFragment
//       }
//       token
//       user {
//         ...User
//       }
//       accountErrors {
//         field
//         message
//         code
//       }
//     }
//   }
// `;

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

// export const setCustomerDefaultAddress = gql`
//   ${userFragment}
//   ${accountErrorFragment}
//   mutation SetCustomerDefaultAddress($id: ID!, $type: AddressTypeEnum!) {
//     accountSetDefaultAddress(id: $id, type: $type) {
//       errors {
//         ...AccountErrorFragment
//       }
//       user {
//         ...User
//       }
//     }
//   }
// `;

// export const deleteUserAddress = gql`
//   ${userFragment}
//   ${accountErrorFragment}
//   mutation DeleteUserAddress($addressId: ID!) {
//     accountAddressDelete(id: $addressId) {
//       errors {
//         ...AccountErrorFragment
//       }
//       user {
//         ...User
//       }
//     }
//   }
// `;

// export const createUserAddress = gql`
//   ${userFragment}
//   ${accountErrorFragment}
//   mutation CreateUserAddress($input: AddressInput!) {
//     accountAddressCreate(input: $input) {
//       errors {
//         ...AccountErrorFragment
//       }
//       user {
//         ...User
//       }
//     }
//   }
// `;

// export const updateUserAddress = gql`
//   ${userFragment}
//   ${accountErrorFragment}
//   mutation UpdateUserAddress($input: AddressInput!, $id: ID!) {
//     accountAddressUpdate(input: $input, id: $id) {
//       errors {
//         ...AccountErrorFragment
//       }
//       user {
//         ...User
//       }
//     }
//   }
// `;
