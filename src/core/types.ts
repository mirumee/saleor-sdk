import {
  AccountRegisterInput,
  CheckoutCreateInput,
  MutationTokenCreateArgs,
} from "../apollo/types";

export interface Config {
  /** Api url used in client */
  apiUrl: string;
}

export type registerOpts = AccountRegisterInput;
export type loginOpts = MutationTokenCreateArgs;

export type createCheckoutOpts = CheckoutCreateInput;
