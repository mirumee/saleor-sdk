import React from "react";
import ReactDOM from "react-dom";
import { SaleorProvider } from "@saleor/sdk/lib/react";

import "./index.css";
import App from "./App";

const CUSTOM_CONFIG = { apiUrl: "http://localhost:8000/graphql/" };

ReactDOM.render(
  <React.StrictMode>
    <SaleorProvider config={CUSTOM_CONFIG}>
      <App />
    </SaleorProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
