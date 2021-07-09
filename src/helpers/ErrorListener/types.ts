import { ApolloErrorWithUserInput } from "../../data/ApolloClientManager/types";

export interface IErrorListener {
  addOnErrorListener: (
    func: (error: ApolloErrorWithUserInput | any) => any
  ) => void;
  removeOnErrorListener: (
    func: (error: ApolloErrorWithUserInput | any) => any
  ) => void;
}
