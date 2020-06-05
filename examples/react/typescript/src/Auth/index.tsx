import React, { useState, ChangeEvent } from "react";
import { GraphQLError } from "graphql";

import { useAuth } from "@saleor/sdk/lib/react";

import "./index.css";

const Auth: React.FC = () => {
  const { authenticated, user, signIn, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<GraphQLError | null>(null);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSignIn = async () => {
    const { dataError } = await signIn(email, password);

    if (dataError?.error?.length) {
      setError(dataError?.error[0]);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleTryAgain = () => {
    setError(null);
  };

  if (error) {
    return (
      <div>
        <span>{error.message}</span>
        <button onClick={handleTryAgain}>Try again</button>
      </div>
    );
  } else if (authenticated && user) {
    return (
      <div>
        <span>Signed in as {user.firstName}</span>
        <button onClick={handleSignOut}>Try again</button>
      </div>
    );
  } else {
    return (
      <form onSubmit={handleSignIn}>
        <input
          type="text"
          name="email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="text"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Sign in</button>
      </form>
    );
  }
};

export default Auth;
