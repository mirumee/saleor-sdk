import { ApolloErrorWithUserInput } from "../data/ApolloClientManager/types";

export class QueuedJobsHandler<ErrorTypes> {
  protected onErrorListener:
    | ((error: ApolloErrorWithUserInput | any, type: ErrorTypes) => any)
    | undefined;

  attachErrorListener(
    onErrorListener: (
      error: ApolloErrorWithUserInput | any,
      type: ErrorTypes
    ) => any
  ) {
    this.onErrorListener = onErrorListener;
  }
}
