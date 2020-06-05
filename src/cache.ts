import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";

export const cache = new InMemoryCache({
  dataIdFromObject: (obj) => {
    if (obj.__typename === "Shop") {
      return "shop";
    }
    return defaultDataIdFromObject(obj);
  },
});
