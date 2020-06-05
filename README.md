<div align="center">
  <h1>Saleor SDK</h1>
</div>

This package contains methods providing Saleor business logic for storefront. It handles Saleor GraphQL queries and mutations, manages Apollo cache and provides internal state to manage popular storefront use cases, like user authentication or checkout process.

Please take a look at [sample storefront](https://github.com/mirumee/saleor-storefront) which already uses Saleor SDK. For specific use cases you may also refer to [saleor-sdk/examples](https://github.com/mirumee/saleor-sdk/tree/add/examples/examples/react/typescript/src).

> :warning: **Note: Saleor SDK is still under heavy development and its API may change.**

## Table of Contents

- [Setup](#setup)
- [Features](#features)
- [Local development](#local-development)

## Setup

There are two ways to use SDK - making custom implementation or using React components and hooks, which already has that implementation ready.

### Using React

First install SDK as dependency to your project

```bash
npm install @saleor/sdk
```

Use `SaleorProvider` with passed custom config in a prop. Then use React hooks in any component passed as child to `SaleorProvider`.

```tsx
import { SaleorProvider, useAuth } from "@saleor/sdk";

const CUSTOM_CONFIG = { apiUrl: "http://localhost:8000/graphql/" };

const rootElement = document.getElementById("root");
ReactDOM.render(
  <SaleorProvider config={CUSTOM_CONFIG}>
    <App />
  </SaleorProvider>,
  rootElement
);

const App = () => {
  const { authenticated, user, signIn } = useAuth();

  const handleSignIn = async () => {
    const { data, dataError } = await signIn("admin@example.com", "admin");

    if (dataError) {
      /**
       * Unable to sign in.
       **/
    } else if (data) {
      /**
       * User signed in succesfully.
       **/
    }
  };

  if (authenticated && user) {
    return <span>Signed in as {user.firstName}</span>;
  } else {
    return <button onClick={handleSignIn}>Sign in</button>;
  }
};
```

### Custom implementation

```bash
npm install @saleor/sdk
```

Create new saleor client by using our built-in pre-configured Apollo links and cache:

```tsx
import { createSaleorClient } from "@saleor/sdk";
import { invalidTokenLinkWithTokenHandler, authLink } from "@saleor/sdk/auth";
import { cache } from "@saleor/sdk/cache";

const CUSTOM_CONFIG = { apiUrl: "http://localhost:8000/graphql/" };

const invalidTokenLink = invalidTokenLinkWithTokenHandler(() => {
  /* Handle token expiration case */
});

await persistCache({
  cache,
  storage: window.localStorage,
});

const client = createSaleorClient(
  CUSTOM_CONFIG.apiUrl,
  invalidTokenLink,
  authLink,
  cache
);
```

Then use SaleorManager to get `SaleorAPI` from `connect` method. This method takes function as an argument, which will be executed every time the `SaleorAPI` state changes.

```tsx
const manager = new SaleorManager(client, config);

let saleorAPI;

manager.connect((referenceToSaleorAPI) => {
  if (saleorAPI === undefined) {
    saleorAPI = referenceToSaleorAPI;
  }
});
```

Finally, methods from `saleorAPI` might be used:

```tsx
const { data, dataError } = await saleorAPI.auth.signIn(
  "admin@example.com",
  "admin"
);

if (dataError) {
  /**
   * Unable to sign in.
   **/
} else if (data) {
  /**
   * User signed in succesfully. Read user object from data or from saleorAPI.auth.
   **/
  const userData = saleorAPI.auth.user;
}
```

## Features

We provide an API with methods and fields, performing one, scoped type of work. You may access them straight from `SaleorAPI` or use React hooks, depending on [which setup do you select](#setup).

| API object           | React hook      | Description                                                                     |
| :------------------- | :-------------- | :------------------------------------------------------------------------------ |
| `SaleorAPI.auth`     | `useAuth()`     | Handles user authentication and stores data about the currently signed in user. |
| `SaleorAPI.cart`     | `useCart()`     | Collects products to cart and calculates their prices.                          |
| `SaleorAPI.checkout` | `useCheckout()` | Uses cart and handles the whole checkout process.                               |

## Local development

Our aim it to build SDK, highly configurable, as a separate package, which you will not require modifications. Although if you want to alter the project, escecially if you want to contribute, it is possible to develop storefront and SDK simultaneously. To do this, you need
to link it to the storefront's project.

```bash
$ cd lib
$ npm link
$ cd <your storefront path>
$ npm link @saleor/sdk
```

Notice that in [our example storefront](https://github.com/mirumee/saleor-storefront)
webpack is configured to always resolve `react` to `./node_modules/react`. It may
seem redundant for the most use cases, but helps in sdk's local development, because
it overcomes `npm`'s limitations regarding peer dependencies hoisting, explicitely
telling webpack to always have one and only copy of `react`.
