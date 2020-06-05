import React from "react";

import "./App.css";
import { useProductList } from "@saleor/sdk/lib/react";

const App: React.FC = () => {
  const { data: products, loading } = useProductList({
    // TODO: Pls no hardcodino es variables
    id: "Q2F0ZWdvcnk6Nw==",
    pageSize: 20,
  });

  return (
    <div className="wrapper">
      {products === null && loading
        ? Array(3)
            .fill(0)
            .map((_, index) => (
              <div className="product-tile" key={index}>
                <div className="product-tile__img skeleton" />
                <div className="product-tile__label skeleton" />
              </div>
            ))
        : products?.edges.map((edge) => (
            <div className="product-tile" key={edge.node.id}>
              <img
                className="product-tile__img"
                src={edge.node.thumbnail?.url}
                alt={edge.node.thumbnail?.alt || undefined}
              />
              <div className="product-tile__label">{edge.node.name}</div>
            </div>
          ))}
    </div>
  );
};

export default App;
