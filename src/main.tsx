import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BuilderProvider } from "./store/BuilderContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <BuilderProvider>
        <App />
      </BuilderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
