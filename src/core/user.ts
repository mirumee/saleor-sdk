import { FetchResult } from "@apollo/client";
import {
  CREATE_ACCOUNT_ADDRESS,
  DELETE_ACCOUNT_ADDRESS,
  SET_ACCOUNT_DEFAULT_ADDRESS,
  UPDATE_ACCOUNT,
  UPDATE_ACCOUNT_ADDRESS,
} from "../apollo/mutations";
import {
  AccountUpdateMutation,
  AccountUpdateMutationVariables,
  CreateAccountAddressMutation,
  CreateAccountAddressMutationVariables,
  DeleteAccountAddressMutation,
  DeleteAccountAddressMutationVariables,
  SetAccountDefaultAddressMutation,
  SetAccountDefaultAddressMutationVariables,
  UpdateAccountAddressMutation,
  UpdateAccountAddressMutationVariables,
} from "../apollo/types";
import { CoreMethodsProps } from "./types";
import {
  CreateAccountAddressOpts,
  SetAccountDefaultAddressOpts,
  UpdateAccountOpts,
  UpdateAccountAddressOpts,
} from "./types";

export interface UserSDK {
  createAccountAddress: (
    opts: CreateAccountAddressOpts
  ) => Promise<FetchResult<CreateAccountAddressMutation>>;
  deleteAccountAddress: (
    addressId: string
  ) => Promise<FetchResult<DeleteAccountAddressMutation>>;
  setAccountDefaultAddress: (
    opts: SetAccountDefaultAddressOpts
  ) => Promise<FetchResult<SetAccountDefaultAddressMutation>>;
  updateAccount: (
    opts: UpdateAccountOpts
  ) => Promise<FetchResult<AccountUpdateMutation>>;
  updateAccountAddress: (
    opts: UpdateAccountAddressOpts
  ) => Promise<FetchResult<UpdateAccountAddressMutation>>;
}

export const user = ({ apolloClient: client }: CoreMethodsProps): UserSDK => {
  /**
   * Updates the account of the logged-in account.
   *
   * @param opts - Fields required to update the account of the logged-in account.
   * @returns Updated user account.
   */
  const updateAccount: UserSDK["updateAccount"] = async opts => {
    const result = await client.mutate<
      AccountUpdateMutation,
      AccountUpdateMutationVariables
    >({
      mutation: UPDATE_ACCOUNT,
      variables: { ...opts },
    });

    return result;
  };

  /**
   * Sets a default address for the authenticated account.
   *
   * @param opts - Object with ID of the address to set as default and the type of address.
   * @returns Updated user account.
   */
  const setAccountDefaultAddress: UserSDK["setAccountDefaultAddress"] = async opts => {
    const result = await client.mutate<
      SetAccountDefaultAddressMutation,
      SetAccountDefaultAddressMutationVariables
    >({
      mutation: SET_ACCOUNT_DEFAULT_ADDRESS,
      variables: { ...opts },
    });

    return result;
  };

  /**
   * Create a new address for the account.
   *
   * @param opts - Object with fields required to create address and a type of address.
   * If provided, the new address will be automatically assigned as the customer's default address of that type..
   * @returns Updated user account.
   */
  const createAccountAddress: UserSDK["createAccountAddress"] = async opts => {
    const result = await client.mutate<
      CreateAccountAddressMutation,
      CreateAccountAddressMutationVariables
    >({
      mutation: CREATE_ACCOUNT_ADDRESS,
      variables: { ...opts },
    });

    return result;
  };

  /**
   * Delete an address of the logged-in account.
   *
   * @param addressId - ID of the address to delete.
   * @returns Updated user account.
   */
  const deleteAccountAddress: UserSDK["deleteAccountAddress"] = async addressId => {
    const result = await client.mutate<
      DeleteAccountAddressMutation,
      DeleteAccountAddressMutationVariables
    >({
      mutation: DELETE_ACCOUNT_ADDRESS,
      variables: { addressId },
    });

    return result;
  };

  /**
   * Updates an address of the logged-in account.
   *
   * @param opts - Object with ID of the address to update and fields required to update the address.
   * @returns Updated user account.
   */
  const updateAccountAddress: UserSDK["updateAccountAddress"] = async opts => {
    const result = await client.mutate<
      UpdateAccountAddressMutation,
      UpdateAccountAddressMutationVariables
    >({
      mutation: UPDATE_ACCOUNT_ADDRESS,
      variables: { ...opts },
    });

    return result;
  };

  return {
    createAccountAddress,
    deleteAccountAddress,
    updateAccount,
    updateAccountAddress,
    setAccountDefaultAddress,
  };
};
