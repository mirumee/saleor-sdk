import { auth } from "./auth";
import { user } from "./user";
import { createSaleorClient } from "../apollo";
import { Core, SaleorSDKConfig } from "./types";

export const SaleorSDK = ({ apiUrl, channel }: SaleorSDKConfig): Core => {
  let _channel = channel;
  const setChannel = (channel: string): string => {
    _channel = channel;
    return _channel;
  };

  const apolloClient = createSaleorClient(apiUrl);
  const coreInternals = { apolloClient, channel: _channel };
  const authSDK = auth(coreInternals);
  const userSDK = user(coreInternals);

  return {
    auth: authSDK,
    user: userSDK,
    config: { channel: _channel, setChannel },
    _internal: { apolloClient },
  };
};
