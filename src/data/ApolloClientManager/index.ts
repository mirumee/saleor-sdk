import ApolloClient from "apollo-client";

import { Checkout } from "../../fragments/gqlTypes/Checkout";
import { Payment } from "../../fragments/gqlTypes/Payment";
import { User } from "../../fragments/gqlTypes/User";
import { CountryCode } from "../../gqlTypes/globalTypes";
import {
  ICheckoutAddress,
  ICheckoutModel,
  ICheckoutModelLine,
  IPaymentModel,
} from "../../helpers/LocalStorageHandler";
import * as AuthMutations from "../../mutations/auth";
import * as UserMutations from "../../mutations/user";
import * as CheckoutMutations from "../../mutations/checkout";
import {
  AddCheckoutPromoCode,
  AddCheckoutPromoCodeVariables,
} from "../../mutations/gqlTypes/AddCheckoutPromoCode";
import {
  CompleteCheckout,
  CompleteCheckoutVariables,
} from "../../mutations/gqlTypes/CompleteCheckout";
import {
  CreateCheckout,
  CreateCheckoutVariables,
} from "../../mutations/gqlTypes/CreateCheckout";
import {
  CreateCheckoutPayment,
  CreateCheckoutPaymentVariables,
} from "../../mutations/gqlTypes/CreateCheckoutPayment";
import {
  RemoveCheckoutPromoCode,
  RemoveCheckoutPromoCodeVariables,
} from "../../mutations/gqlTypes/RemoveCheckoutPromoCode";
import {
  RegisterAccount,
  RegisterAccountVariables,
} from "../../mutations/gqlTypes/RegisterAccount";
import {
  ResetPasswordRequest,
  ResetPasswordRequestVariables,
} from "../../mutations/gqlTypes/ResetPasswordRequest";
import {
  TokenAuth,
  TokenAuthVariables,
} from "../../mutations/gqlTypes/TokenAuth";
import {
  VerifyToken,
  VerifyTokenVariables,
} from "../../mutations/gqlTypes/VerifyToken";
import {
  RefreshToken,
  RefreshTokenVariables,
} from "../../mutations/gqlTypes/RefreshToken";
import {
  UpdateCheckoutBillingAddress,
  UpdateCheckoutBillingAddressVariables,
} from "../../mutations/gqlTypes/UpdateCheckoutBillingAddress";
import {
  UpdateCheckoutBillingAddressWithEmail,
  UpdateCheckoutBillingAddressWithEmailVariables,
} from "../../mutations/gqlTypes/UpdateCheckoutBillingAddressWithEmail";
import {
  UpdateCheckoutLine,
  UpdateCheckoutLineVariables,
} from "../../mutations/gqlTypes/UpdateCheckoutLine";
import {
  UpdateCheckoutShippingAddress,
  UpdateCheckoutShippingAddressVariables,
} from "../../mutations/gqlTypes/UpdateCheckoutShippingAddress";
import {
  UpdateCheckoutShippingMethod,
  UpdateCheckoutShippingMethodVariables,
} from "../../mutations/gqlTypes/UpdateCheckoutShippingMethod";
import {
  InitializePayment,
  InitializePaymentVariables,
} from "../../mutations/gqlTypes/InitializePayment";
import * as CheckoutQueries from "../../queries/checkout";
import { CheckoutDetails } from "../../queries/gqlTypes/CheckoutDetails";
import {
  CheckoutProductVariants,
  CheckoutProductVariants_productVariants,
} from "../../queries/gqlTypes/CheckoutProductVariants";
import {
  UserCheckoutTokenList,
  UserCheckoutTokenListVariables,
} from "../../queries/gqlTypes/UserCheckoutTokenList";
import { UserDetails } from "../../queries/gqlTypes/UserDetails";
import * as UserQueries from "../../queries/user";
import { filterNotEmptyArrayItems } from "../../utils";
import {
  CreatePaymentInput,
  CompleteCheckoutInput,
  VerifySignInTokenInput,
  RefreshSignInTokenInput,
} from "./types";

export class ApolloClientManager {
  private client: ApolloClient<any>;

  constructor(client: ApolloClient<any>) {
    this.client = client;
  }

  subscribeToUserChange = (
    next: (value: User | null) => void,
    error?: (error: any) => void,
    complete?: () => void
  ) => {
    this.client
      .watchQuery<UserDetails, any>({
        fetchPolicy: "cache-only",
        query: UserQueries.getUserDetailsQuery,
      })
      .subscribe(value => next(value.data?.me), error, complete);
  };

  getUser = async () => {
    const { data, errors } = await this.client.query<UserDetails, any>({
      fetchPolicy: "network-only",
      query: UserQueries.getUserDetailsQuery,
    });

    if (errors?.length) {
      return {
        error: errors,
      };
    }
    return {
      data: data?.me,
    };
  };

  registerAccount = async (
    email: string,
    password: string,
    redirectUrl: string
  ) => {
    const { data, errors } = await this.client.mutate<
      RegisterAccount,
      RegisterAccountVariables
    >({
      fetchPolicy: "no-cache",
      mutation: UserMutations.registerAccount,
      variables: {
        email,
        password,
        redirectUrl,
      },
    });

    if (errors?.length) {
      return {
        error: errors,
      };
    }
    if (data?.accountRegister?.accountErrors.length) {
      return {
        error: data.accountRegister.accountErrors,
      };
    }
    return {
      data: {
        requiresConfirmation: data?.accountRegister?.requiresConfirmation,
      },
    };
  };

  resetPasswordRequest = async (email: string, redirectUrl: string) => {
    const { data, errors } = await this.client.mutate<
      ResetPasswordRequest,
      ResetPasswordRequestVariables
    >({
      fetchPolicy: "no-cache",
      mutation: UserMutations.resetPasswordRequest,
      variables: {
        email,
        redirectUrl,
      },
    });

    if (errors?.length) {
      return {
        error: errors,
      };
    }
    if (data?.requestPasswordReset?.accountErrors.length) {
      return {
        error: data.requestPasswordReset.accountErrors,
      };
    }
    return {};
  };

  signIn = async (email: string, password: string) => {
    const { data, errors } = await this.client.mutate<
      TokenAuth,
      TokenAuthVariables
    >({
      fetchPolicy: "no-cache",
      mutation: AuthMutations.tokenAuthMutation,
      variables: {
        email,
        password,
      },
    });

    if (errors?.length) {
      return {
        error: errors,
      };
    }
    if (data?.tokenCreate?.errors.length) {
      return {
        error: data.tokenCreate.errors,
      };
    }
    return {
      data: {
        csrfToken: data?.tokenCreate?.csrfToken,
        token: data?.tokenCreate?.token,
        user: data?.tokenCreate?.user,
      },
    };
  };

  signOut = async () => {
    await this.client.resetStore();
  };

  verifySignInToken = async ({ token }: VerifySignInTokenInput) => {
    const { data, errors } = await this.client.mutate<
      VerifyToken,
      VerifyTokenVariables
    >({
      fetchPolicy: "no-cache",
      mutation: AuthMutations.tokenVeryficationMutation,
      variables: {
        token,
      },
    });

    if (errors?.length) {
      return {
        error: errors,
      };
    }
    if (data?.tokenVerify?.errors.length) {
      return {
        error: data.tokenVerify.errors,
      };
    }
    return {
      data: {
        isValid: data?.tokenVerify?.isValid,
        payload: data?.tokenVerify?.payload,
        user: data?.tokenVerify?.user,
      },
    };
  };

  refreshSignInToken = async ({
    csrfToken,
    refreshToken,
  }: RefreshSignInTokenInput) => {
    const { data, errors } = await this.client.mutate<
      RefreshToken,
      RefreshTokenVariables
    >({
      fetchPolicy: "no-cache",
      mutation: AuthMutations.tokenRefreshMutation,
      variables: {
        csrfToken,
        refreshToken,
      },
    });

    if (errors?.length) {
      return {
        error: errors,
      };
    }
    if (data?.tokenRefresh?.errors.length) {
      return {
        error: data.tokenRefresh.errors,
      };
    }
    return {
      data: {
        token: data?.tokenRefresh?.token,
        user: data?.tokenRefresh?.user,
      },
    };
  };

  getCheckout = async (
    isUserSignedIn: boolean,
    channel: string,
    checkoutToken: string | null
  ) => {
    let checkout: Checkout | null;
    try {
      checkout = await new Promise(async (resolve, reject) => {
        let token = checkoutToken;
        if (isUserSignedIn) {
          const { data, errors } = await this.client.query<
            UserCheckoutTokenList,
            UserCheckoutTokenListVariables
          >({
            fetchPolicy: "network-only",
            query: CheckoutQueries.userCheckoutTokenList,
            variables: {
              channel,
            },
          });

          if (errors?.length) {
            reject(errors);
          } else if (data.me?.checkoutTokens) {
            [token] = data.me.checkoutTokens;
          }
        }

        if (token) {
          const observable = this.client.watchQuery<CheckoutDetails, any>({
            fetchPolicy: "network-only",
            query: CheckoutQueries.checkoutDetails,
            variables: {
              token,
            },
          });
          observable.subscribe(
            result => {
              const { data, errors } = result;
              if (errors?.length) {
                reject(errors);
              } else {
                resolve(data.checkout);
              }
            },
            error => {
              reject(error);
            }
          );
        } else {
          resolve(null);
        }
      });

      if (checkout) {
        return {
          data: this.constructCheckoutModel(checkout),
        };
      }
    } catch (error) {
      return {
        error,
      };
    }
    return {};
  };

  getRefreshedCheckoutLines = async (
    checkoutlines: ICheckoutModelLine[] | null,
    channel: string
  ) => {
    const idsOfMissingVariants = checkoutlines
      ?.filter(line => !line.variant || !line.totalPrice)
      .map(line => line.variant.id);
    const linesWithProperVariant =
      checkoutlines?.filter(line => line.variant && line.totalPrice) || [];

    let variants: CheckoutProductVariants_productVariants | null | undefined;
    if (idsOfMissingVariants && idsOfMissingVariants.length) {
      try {
        const observable = this.client.watchQuery<CheckoutProductVariants, any>(
          {
            query: CheckoutQueries.checkoutProductVariants,
            variables: {
              channel,
              ids: idsOfMissingVariants,
            },
          }
        );
        variants = await new Promise((resolve, reject) => {
          observable.subscribe(
            result => {
              const { data, errors } = result;
              if (errors?.length) {
                reject(errors);
              } else {
                resolve(data.productVariants);
              }
            },
            error => {
              reject(error);
            }
          );
        });
      } catch (error) {
        return {
          error,
        };
      }
    }

    const linesWithMissingVariantUpdated = variants
      ? variants.edges.map(edge => {
          const existingLine = checkoutlines?.find(
            line => line.variant.id === edge.node.id
          );
          const variantPricing = edge.node.pricing?.price;
          const totalPrice = variantPricing
            ? {
                gross: {
                  ...variantPricing.gross,
                  amount:
                    variantPricing.gross.amount * (existingLine?.quantity || 0),
                },
                net: {
                  ...variantPricing.net,
                  amount:
                    variantPricing.net.amount * (existingLine?.quantity || 0),
                },
              }
            : null;

          return {
            id: existingLine?.id,
            quantity: existingLine?.quantity || 0,
            totalPrice,
            variant: {
              attributes: edge.node.attributes,
              id: edge.node.id,
              name: edge.node.name,
              pricing: edge.node.pricing,
              product: edge.node.product,
              quantityAvailable: edge.node.quantityAvailable,
              sku: edge.node.sku,
            },
          };
        })
      : [];

    const linesWithProperVariantUpdated = linesWithProperVariant.map(line => {
      const variantPricing = line.variant.pricing?.price;
      const totalPrice = variantPricing
        ? {
            gross: {
              ...variantPricing.gross,
              amount: variantPricing.gross.amount * line.quantity,
            },
            net: {
              ...variantPricing.net,
              amount: variantPricing.net.amount * line.quantity,
            },
          }
        : null;

      return {
        id: line.id,
        quantity: line.quantity,
        totalPrice,
        variant: line.variant,
      };
    });

    return {
      data: [
        ...linesWithMissingVariantUpdated,
        ...linesWithProperVariantUpdated,
      ],
    };
  };

  createCheckout = async (
    email: string,
    lines: Array<{ variantId: string; quantity: number }>,
    channel: string,
    shippingAddress?: ICheckoutAddress,
    billingAddress?: ICheckoutAddress
  ) => {
    try {
      const variables = {
        checkoutInput: {
          billingAddress: billingAddress && {
            city: billingAddress.city,
            companyName: billingAddress.companyName,
            country:
              CountryCode[
                billingAddress?.country?.code as keyof typeof CountryCode
              ],
            countryArea: billingAddress.countryArea,
            firstName: billingAddress.firstName,
            lastName: billingAddress.lastName,
            phone: billingAddress.phone,
            postalCode: billingAddress.postalCode,
            streetAddress1: billingAddress.streetAddress1,
            streetAddress2: billingAddress.streetAddress2,
          },
          channel,
          email,
          lines,
          shippingAddress: shippingAddress && {
            city: shippingAddress.city,
            companyName: shippingAddress.companyName,
            country:
              CountryCode[
                shippingAddress?.country?.code as keyof typeof CountryCode
              ],
            countryArea: shippingAddress.countryArea,
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            phone: shippingAddress.phone,
            postalCode: shippingAddress.postalCode,
            streetAddress1: shippingAddress.streetAddress1,
            streetAddress2: shippingAddress.streetAddress2,
          },
        },
      };
      const { data, errors } = await this.client.mutate<
        CreateCheckout,
        CreateCheckoutVariables
      >({
        mutation: CheckoutMutations.createCheckoutMutation,
        variables,
      });

      if (errors?.length) {
        return {
          error: errors,
        };
      }
      if (data?.checkoutCreate?.errors.length) {
        return {
          error: data?.checkoutCreate?.errors,
        };
      }
      if (data?.checkoutCreate?.checkout) {
        return {
          data: this.constructCheckoutModel(data.checkoutCreate.checkout),
        };
      }
    } catch (error) {
      return {
        error,
      };
    }
    return {};
  };

  setCartItem = async (checkout: ICheckoutModel) => {
    const checkoutId = checkout.id;
    const { lines } = checkout;

    if (checkoutId && lines) {
      const alteredLines = lines.map(line => ({
        quantity: line.quantity,
        variantId: line.variant.id,
      }));

      try {
        const { data, errors } = await this.client.mutate<
          UpdateCheckoutLine,
          UpdateCheckoutLineVariables
        >({
          mutation: CheckoutMutations.updateCheckoutLineMutation,
          variables: {
            checkoutId,
            lines: alteredLines,
          },
        });

        if (errors?.length) {
          return {
            error: errors,
          };
        }
        if (data?.checkoutLinesUpdate?.errors.length) {
          return {
            error: data?.checkoutLinesUpdate?.errors,
          };
        }
        if (data?.checkoutLinesUpdate?.checkout) {
          return {
            data: this.constructCheckoutModel(
              data.checkoutLinesUpdate.checkout
            ),
          };
        }
      } catch (error) {
        return {
          error,
        };
      }
    }
    return {};
  };

  setShippingAddress = async (
    shippingAddress: ICheckoutAddress,
    email: string,
    checkoutId: string,
    channel: string
  ) => {
    try {
      const variables = {
        channel,
        checkoutId,
        email,
        shippingAddress: {
          city: shippingAddress.city,
          companyName: shippingAddress.companyName,
          country:
            CountryCode[
              shippingAddress?.country?.code as keyof typeof CountryCode
            ],
          countryArea: shippingAddress.countryArea,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          phone: shippingAddress.phone,
          postalCode: shippingAddress.postalCode,
          streetAddress1: shippingAddress.streetAddress1,
          streetAddress2: shippingAddress.streetAddress2,
        },
      };
      const { data, errors } = await this.client.mutate<
        UpdateCheckoutShippingAddress,
        UpdateCheckoutShippingAddressVariables
      >({
        mutation: CheckoutMutations.updateCheckoutShippingAddressMutation,
        variables,
      });

      if (errors?.length) {
        return {
          error: errors,
        };
      }
      if (data?.checkoutEmailUpdate?.errors.length) {
        return {
          error: data?.checkoutEmailUpdate?.errors,
        };
      }
      if (data?.checkoutShippingAddressUpdate?.errors.length) {
        return {
          error: data?.checkoutShippingAddressUpdate?.errors,
        };
      }
      if (data?.checkoutShippingAddressUpdate?.checkout) {
        return {
          data: this.constructCheckoutModel(
            data.checkoutShippingAddressUpdate.checkout
          ),
        };
      }
      return {};
    } catch (error) {
      return {
        error,
      };
    }
  };

  setBillingAddress = async (
    billingAddress: ICheckoutAddress,
    checkoutId: string
  ) => {
    try {
      const variables = {
        billingAddress: {
          city: billingAddress.city,
          companyName: billingAddress.companyName,
          country:
            CountryCode[
              billingAddress?.country?.code as keyof typeof CountryCode
            ],
          countryArea: billingAddress.countryArea,
          firstName: billingAddress.firstName,
          lastName: billingAddress.lastName,
          phone: billingAddress.phone,
          postalCode: billingAddress.postalCode,
          streetAddress1: billingAddress.streetAddress1,
          streetAddress2: billingAddress.streetAddress2,
        },
        checkoutId,
      };
      const { data, errors } = await this.client.mutate<
        UpdateCheckoutBillingAddress,
        UpdateCheckoutBillingAddressVariables
      >({
        mutation: CheckoutMutations.updateCheckoutBillingAddressMutation,
        variables,
      });

      if (errors?.length) {
        return {
          error: errors,
        };
      }
      if (data?.checkoutBillingAddressUpdate?.errors.length) {
        return {
          error: data?.checkoutBillingAddressUpdate?.errors,
        };
      }
      if (data?.checkoutBillingAddressUpdate?.checkout) {
        return {
          data: this.constructCheckoutModel(
            data.checkoutBillingAddressUpdate.checkout
          ),
        };
      }
      return {};
    } catch (error) {
      return {
        error,
      };
    }
  };

  setBillingAddressWithEmail = async (
    billingAddress: ICheckoutAddress,
    email: string,
    checkoutId: string
  ) => {
    try {
      const variables = {
        billingAddress: {
          city: billingAddress.city,
          companyName: billingAddress.companyName,
          country:
            CountryCode[
              billingAddress?.country?.code as keyof typeof CountryCode
            ],
          countryArea: billingAddress.countryArea,
          firstName: billingAddress.firstName,
          lastName: billingAddress.lastName,
          phone: billingAddress.phone,
          postalCode: billingAddress.postalCode,
          streetAddress1: billingAddress.streetAddress1,
          streetAddress2: billingAddress.streetAddress2,
        },
        checkoutId,
        email,
      };
      const { data, errors } = await this.client.mutate<
        UpdateCheckoutBillingAddressWithEmail,
        UpdateCheckoutBillingAddressWithEmailVariables
      >({
        mutation:
          CheckoutMutations.updateCheckoutBillingAddressWithEmailMutation,
        variables,
      });

      if (errors?.length) {
        return {
          error: errors,
        };
      }
      if (data?.checkoutEmailUpdate?.errors.length) {
        return {
          error: data?.checkoutEmailUpdate?.errors,
        };
      }
      if (data?.checkoutBillingAddressUpdate?.errors.length) {
        return {
          error: data?.checkoutBillingAddressUpdate?.errors,
        };
      }
      if (data?.checkoutBillingAddressUpdate?.checkout) {
        return {
          data: this.constructCheckoutModel(
            data.checkoutBillingAddressUpdate.checkout
          ),
        };
      }
      return {};
    } catch (error) {
      return {
        error,
      };
    }
  };

  setShippingMethod = async (shippingMethodId: string, checkoutId: string) => {
    try {
      const { data, errors } = await this.client.mutate<
        UpdateCheckoutShippingMethod,
        UpdateCheckoutShippingMethodVariables
      >({
        mutation: CheckoutMutations.updateCheckoutShippingMethodMutation,
        variables: {
          checkoutId,
          shippingMethodId,
        },
      });

      if (errors?.length) {
        return {
          error: errors,
        };
      }
      if (data?.checkoutShippingMethodUpdate?.errors.length) {
        return {
          error: data?.checkoutShippingMethodUpdate?.errors,
        };
      }
      if (data?.checkoutShippingMethodUpdate?.checkout) {
        return {
          data: this.constructCheckoutModel(
            data.checkoutShippingMethodUpdate.checkout
          ),
        };
      }
      return {};
    } catch (error) {
      return {
        error,
      };
    }
  };

  addPromoCode = async (promoCode: string, checkoutId: string) => {
    try {
      const { data, errors } = await this.client.mutate<
        AddCheckoutPromoCode,
        AddCheckoutPromoCodeVariables
      >({
        mutation: CheckoutMutations.addCheckoutPromoCode,
        variables: { checkoutId, promoCode },
      });

      if (errors?.length) {
        return {
          error: errors,
        };
      }
      if (data?.checkoutAddPromoCode?.errors.length) {
        return {
          error: data?.checkoutAddPromoCode?.errors,
        };
      }
      if (data?.checkoutAddPromoCode?.checkout) {
        return {
          data: this.constructCheckoutModel(data.checkoutAddPromoCode.checkout),
        };
      }
      return {};
    } catch (error) {
      return {
        error,
      };
    }
  };

  removePromoCode = async (promoCode: string, checkoutId: string) => {
    try {
      const { data, errors } = await this.client.mutate<
        RemoveCheckoutPromoCode,
        RemoveCheckoutPromoCodeVariables
      >({
        mutation: CheckoutMutations.removeCheckoutPromoCode,
        variables: { checkoutId, promoCode },
      });

      if (errors?.length) {
        return {
          error: errors,
        };
      }
      if (data?.checkoutRemovePromoCode?.errors.length) {
        return {
          error: data?.checkoutRemovePromoCode?.errors,
        };
      }
      if (data?.checkoutRemovePromoCode?.checkout) {
        return {
          data: this.constructCheckoutModel(
            data.checkoutRemovePromoCode.checkout
          ),
        };
      }
      return {};
    } catch (error) {
      return {
        error,
      };
    }
  };

  createPayment = async ({
    amount,
    checkoutId,
    gateway,
    token,
    returnUrl,
  }: CreatePaymentInput) => {
    try {
      const variables = {
        checkoutId,
        paymentInput: {
          amount,
          gateway,
          returnUrl,
          token,
        },
      };
      const { data, errors } = await this.client.mutate<
        CreateCheckoutPayment,
        CreateCheckoutPaymentVariables
      >({
        mutation: CheckoutMutations.createCheckoutPaymentMutation,
        variables,
      });

      if (errors?.length) {
        return {
          error: errors,
        };
      }
      if (data?.checkoutPaymentCreate?.errors.length) {
        return {
          error: data?.checkoutPaymentCreate?.errors,
        };
      }
      if (data?.checkoutPaymentCreate?.payment) {
        return {
          data: this.constructPaymentModel(data.checkoutPaymentCreate.payment),
        };
      }
      return {};
    } catch (error) {
      return {
        error,
      };
    }
  };

  initializePayment = async (variables: InitializePaymentVariables) => {
    try {
      const { data, errors } = await this.client.mutate<
        InitializePayment,
        InitializePaymentVariables
      >({
        mutation: CheckoutMutations.initializePaymentMutation,
        variables,
      });

      if (errors?.length) {
        return {
          error: errors,
        };
      }
      if (data?.paymentInitialize?.errors.length) {
        return {
          error: data?.paymentInitialize?.errors,
        };
      }
      if (data?.paymentInitialize?.initializedPayment) {
        return {
          data: data.paymentInitialize.initializedPayment,
        };
      }
      return {};
    } catch (error) {
      return {
        error,
      };
    }
  };

  completeCheckout = async ({
    checkoutId,
    paymentData,
    redirectUrl,
    storeSource,
  }: CompleteCheckoutInput) => {
    try {
      const paymentDataString = paymentData && JSON.stringify(paymentData);

      const { data, errors } = await this.client.mutate<
        CompleteCheckout,
        CompleteCheckoutVariables
      >({
        mutation: CheckoutMutations.completeCheckoutMutation,
        variables: {
          checkoutId,
          paymentData: paymentDataString,
          redirectUrl,
          storeSource,
        },
      });

      if (errors?.length) {
        return {
          error: errors,
        };
      }
      if (data?.checkoutComplete?.errors.length) {
        return {
          error: data?.checkoutComplete?.errors,
        };
      }
      if (data?.checkoutComplete) {
        return {
          data: data.checkoutComplete,
        };
      }
      return {};
    } catch (error) {
      return {
        error,
      };
    }
  };

  private constructCheckoutModel = ({
    id,
    token,
    email,
    shippingAddress,
    billingAddress,
    discount,
    discountName,
    voucherCode,
    lines,
    availablePaymentGateways,
    availableShippingMethods,
    shippingMethod,
  }: Checkout): ICheckoutModel => ({
    availablePaymentGateways,
    availableShippingMethods: availableShippingMethods
      ? availableShippingMethods.filter(filterNotEmptyArrayItems)
      : [],
    billingAddress,
    email,
    id,
    lines: lines
      ?.filter(item => item?.quantity && item.variant.id)
      .map(item => {
        const itemVariant = item?.variant;

        return {
          id: item!.id,
          quantity: item!.quantity,
          totalPrice: item?.totalPrice,
          variant: {
            attributes: itemVariant?.attributes,
            id: itemVariant!.id,
            name: itemVariant?.name,
            pricing: itemVariant?.pricing,
            product: itemVariant?.product,
            quantityAvailable: itemVariant?.quantityAvailable,
            sku: itemVariant?.sku,
          },
        };
      }),
    promoCodeDiscount: {
      discount,
      discountName,
      voucherCode,
    },
    shippingAddress,
    shippingMethod,
    token,
  });

  private constructPaymentModel = ({
    id,
    gateway,
    token,
    creditCard,
    total,
  }: Payment): IPaymentModel => ({
    creditCard,
    gateway,
    id,
    token,
    total,
  });
}
