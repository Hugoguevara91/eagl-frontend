import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MarketingHome from "./pages/MarketingHome";
import "./index.css";

function LandingRoot() {
  return (
    <BrowserRouter>
      <MarketingHome />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LandingRoot />
  </React.StrictMode>,
);
