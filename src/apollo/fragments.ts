import { gql } from "@apollo/client";

export const accountErrorFragment = gql`
  fragment AccountErrorFragment on AccountError {
    code
    field
    message
  }
`;

export const addressFragment = gql`
  fragment AddressFragment on Address {
    id
    firstName
    lastName
    companyName
    streetAddress1
    streetAddress2
    city
    postalCode
    country {
      code
      country
    }
    countryArea
    phone
    isDefaultBillingAddress
    isDefaultShippingAddress
  }
`;

export const userFragment = gql`
  ${addressFragment}
  fragment UserFragment on User {
    id
    email
    firstName
    lastName
    isStaff
    defaultShippingAddress {
      ...AddressFragment
    }
    defaultBillingAddress {
      ...AddressFragment
    }
    addresses {
      ...AddressFragment
    }
  }
`;

// export const paymentGatewayFragment = gql`
//   fragment PaymentGateway on PaymentGateway {
//     id
//     name
//     config {
//       field
//       value
//     }
//     currencies
//   }
// `;

// export const checkoutPriceFragment = gql`
//   fragment Price on TaxedMoney {
//     gross {
//       amount
//       currency
//     }
//     net {
//       amount
//       currency
//     }
//   }
// `;

// export const checkoutProductVariantFragment = gql`
//   ${checkoutPriceFragment}
//   fragment ProductVariant on ProductVariant {
//     id
//     name
//     sku
//     quantityAvailable
//     pricing {
//       onSale
//       priceUndiscounted {
//         ...Price
//       }
//       price {
//         ...Price
//       }
//     }
//     attributes {
//       attribute {
//         id
//         name
//       }
//       values {
//         id
//         name
//         value: name
//       }
//     }
//     product {
//       id
//       name
//       slug
//       thumbnail {
//         url
//         alt
//       }
//       thumbnail2x: thumbnail(size: 510) {
//         url
//       }
//       productType {
//         id
//         isShippingRequired
//       }
//     }
//   }
// `;

// export const checkoutShippingMethodFragment = gql`
//   fragment ShippingMethod on ShippingMethod {
//     id
//     name
//     price {
//       currency
//       amount
//     }
//   }
// `;

// export const checkoutLineFragment = gql`
//   ${checkoutPriceFragment}
//   ${checkoutProductVariantFragment}
//   fragment CheckoutLine on CheckoutLine {
//     id
//     quantity
//     totalPrice {
//       ...Price
//     }
//     variant {
//       ...ProductVariant
//     }
//   }
// `;

// export const checkoutFragment = gql`
//   ${checkoutLineFragment}
//   ${checkoutAddressFragment}
//   ${checkoutPriceFragment}
//   ${checkoutShippingMethodFragment}
//   ${paymentGatewayFragment}
//   fragment Checkout on Checkout {
//     token
//     id
//     totalPrice {
//       ...Price
//     }
//     subtotalPrice {
//       ...Price
//     }
//     billingAddress {
//       ...Address
//     }
//     shippingAddress {
//       ...Address
//     }
//     email
//     availableShippingMethods {
//       ...ShippingMethod
//     }
//     shippingMethod {
//       ...ShippingMethod
//     }
//     shippingPrice {
//       ...Price
//     }
//     lines {
//       ...CheckoutLine
//     }
//     isShippingRequired
//     discount {
//       currency
//       amount
//     }
//     discountName
//     translatedDiscountName
//     voucherCode
//     availablePaymentGateways {
//       ...PaymentGateway
//     }
//   }
// `;

// export const checkoutErrorFragment = gql`
//   fragment CheckoutError on CheckoutError {
//     code
//     field
//     message
//   }
// `;

// export const paymentErrorFragment = gql`
//   fragment PaymentError on PaymentError {
//     code
//     field
//     message
//   }
// `;

// export const paymentFragment = gql`
//   fragment Payment on Payment {
//     id
//     gateway
//     token
//     creditCard {
//       brand
//       firstDigits
//       lastDigits
//       expMonth
//       expYear
//     }
//     total {
//       amount
//       currency
//     }
//   }
// `;

// export const checkoutAddressFragment = gql`
//   fragment Address on Address {
//     id
//     firstName
//     lastName
//     companyName
//     streetAddress1
//     streetAddress2
//     city
//     postalCode
//     country {
//       code
//       country
//     }
//     countryArea
//     phone
//     isDefaultBillingAddress
//     isDefaultShippingAddress
//   }
// `;

// export const paymentGatewayFragment = gql`
//   fragment PaymentGateway on PaymentGateway {
//     id
//     name
//     config {
//       field
//       value
//     }
//     currencies
//   }
// `;

// export const checkoutPriceFragment = gql`
//   fragment Price on TaxedMoney {
//     gross {
//       amount
//       currency
//     }
//     net {
//       amount
//       currency
//     }
//   }
// `;

// export const checkoutProductVariantFragment = gql`
//   ${checkoutPriceFragment}
//   fragment ProductVariant on ProductVariant {
//     id
//     name
//     sku
//     quantityAvailable
//     pricing {
//       onSale
//       priceUndiscounted {
//         ...Price
//       }
//       price {
//         ...Price
//       }
//     }
//     attributes {
//       attribute {
//         id
//         name
//       }
//       values {
//         id
//         name
//         value: name
//       }
//     }
//     product {
//       id
//       name
//       slug
//       thumbnail {
//         url
//         alt
//       }
//       thumbnail2x: thumbnail(size: 510) {
//         url
//       }
//       productType {
//         id
//         isShippingRequired
//       }
//     }
//   }
// `;

// export const checkoutShippingMethodFragment = gql`
//   fragment ShippingMethod on ShippingMethod {
//     id
//     name
//     price {
//       currency
//       amount
//     }
//   }
// `;

// export const checkoutLineFragment = gql`
//   ${checkoutPriceFragment}
//   ${checkoutProductVariantFragment}
//   fragment CheckoutLine on CheckoutLine {
//     id
//     quantity
//     totalPrice {
//       ...Price
//     }
//     variant {
//       ...ProductVariant
//     }
//   }
// `;

// export const checkoutFragment = gql`
//   ${checkoutLineFragment}
//   ${checkoutAddressFragment}
//   ${checkoutPriceFragment}
//   ${checkoutShippingMethodFragment}
//   ${paymentGatewayFragment}
//   fragment Checkout on Checkout {
//     token
//     id
//     totalPrice {
//       ...Price
//     }
//     subtotalPrice {
//       ...Price
//     }
//     billingAddress {
//       ...Address
//     }
//     shippingAddress {
//       ...Address
//     }
//     email
//     availableShippingMethods {
//       ...ShippingMethod
//     }
//     shippingMethod {
//       ...ShippingMethod
//     }
//     shippingPrice {
//       ...Price
//     }
//     lines {
//       ...CheckoutLine
//     }
//     isShippingRequired
//     discount {
//       currency
//       amount
//     }
//     discountName
//     translatedDiscountName
//     voucherCode
//     availablePaymentGateways {
//       ...PaymentGateway
//     }
//   }
// `;

// export const checkoutErrorFragment = gql`
//   fragment CheckoutError on CheckoutError {
//     code
//     field
//     message
//   }
// `;

// export const paymentErrorFragment = gql`
//   fragment PaymentError on PaymentError {
//     code
//     field
//     message
//   }
// `;

// export const paymentFragment = gql`
//   fragment Payment on Payment {
//     id
//     gateway
//     token
//     creditCard {
//       brand
//       firstDigits
//       lastDigits
//       expMonth
//       expYear
//     }
//     total {
//       amount
//       currency
//     }
//   }
// `;
