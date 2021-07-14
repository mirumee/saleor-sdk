import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { Context, setupPolly } from "setup-polly-jest";
import { Polly } from "@pollyjs/core";
import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import FSPersister from "@pollyjs/persister-fs";
import path from "path";

import { API_URI } from "../src/config";
import { Core, SaleorSDK } from "../src/core";

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

export const setupRecording = (): Context =>
  setupPolly({
    adapterOptions: {
      fetch: {
        context: global,
      },
    },
    adapters: ["node-http"],
    matchRequestsBy: {
      headers: {
        exclude: ["authorization", "host", "content-length"],
      },
      url: {
        hash: false,
        hostname: false,
        password: false,
        pathname: false,
        port: false,
        protocol: false,
        query: false,
        username: false,
      },
      body(body, req): string {
        if (req.recordingName === "auth api/can register") {
          // Custom rule which prevents polly recording on every run due to
          // changing email address.
          const json = JSON.parse(body);
          delete json.variables.email;
          delete json.variables.redirectUrl;
          return JSON.stringify(json);
        }
        if (
          [
            "auth api/can login",
            "auth api/login caches user data",
            "auth api/refreshes the auth token",
            "auth api/logout clears user cache",
            "auth api/verifies if token is valid",
            "auth api/sends request to reset password",
          ].includes(req.recordingName)
        ) {
          // Make auth tests recording to ignore changes in the user/password variables
          const json = JSON.parse(body);
          delete json.variables.email;
          delete json.variables.password;
          return JSON.stringify(json);
        }
        return body;
      },
    },
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "../recordings"),
      },
    },
    recordIfMissing: true,
  });

export const setupAPI = (): {
  apiUrl: string;
  client: ApolloClient<NormalizedCacheObject>;
  saleor: Core;
} => {
  const saleor = SaleorSDK({ apiUrl: API_URI, channel: "default-channel" });

  return {
    apiUrl: API_URI,
    client: saleor._internal.apolloClient,
    saleor,
  };
};
