import {
  ApolloClient,
  ApolloQueryResult,
  FetchResult,
  NormalizedCacheObject,
} from "@apollo/client";
import { LOGIN, REGISTER } from "../apollo/mutations";

export interface AuthSDK {
  login: (
    email: string,
    password: string
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  logout: () => Promise<ApolloQueryResult<any>[] | null>;
  register: (
    email: string,
    password: string,
    redirectUrl: string
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
}

export const auth = (client: ApolloClient<NormalizedCacheObject>): AuthSDK => {
  /**
   * Authenticates user with email and password.
   *
   * @param email - User's email
   * @param password - User's password
   * @returns Promise resolved with CreateToken type data
   */
  const login = async (email: string, password: string) =>
    await client.mutate({
      fetchPolicy: "no-cache",
      mutation: LOGIN,
      variables: {
        email,
        password,
      },
    });

  /**
   * Clears the localStorage and Apollo store.
   *
   * @returns Apollo's native resetStore method
   */
  const logout = async () => await client.resetStore();

  /**
   * Registers user with email and password.
   *
   * @param email - User's email
   * @param password - User's password
   * @param redirectUrl - URL to redirect after registration
   * @returns Promise resolved with AccountRegister type data
   */
  const register = async (
    email: string,
    password: string,
    redirectUrl: string
  ) =>
    await client.mutate({
      fetchPolicy: "no-cache",
      mutation: REGISTER,
      variables: {
        email,
        password,
        redirectUrl,
      },
    });

  return { login, logout, register };
};
