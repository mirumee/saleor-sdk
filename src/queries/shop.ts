import gql from "graphql-tag";
import { paymentGatewayFragment } from "../fragments/shop";

export const getShop = gql`
  query GetShop {
    shop {
      displayGrossPrices
      defaultCountry {
        code
        country
      }
      countries {
        country
        code
      }
      geolocalization {
        country {
          code
          country
        }
      }
    }
  }
`;

export const getShopPaymentGateways = gql`
  ${paymentGatewayFragment}
  query GetShopPaymentGateways {
    shop {
      availablePaymentGateways {
        ...PaymentGateway
      }
    }
  }
`;
