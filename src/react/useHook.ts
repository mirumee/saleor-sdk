import React from "react";
import { SaleorAPI } from "../api";
import { useSaleorClient } from "./helpers";

const useHook = <T extends keyof SaleorAPI>(dataName: T): SaleorAPI[T] => {
  const saleor = useSaleorClient();

  const hookData = React.useMemo(() => {
    return saleor[dataName];
  }, [dataName]);

  return hookData;
};

export const hookFactory = <T extends keyof SaleorAPI>(query: T) => () =>
  useHook(query);
