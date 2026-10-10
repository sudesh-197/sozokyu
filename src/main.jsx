import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LoginModalProvider } from "./context/LoginModalContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "./styles/global.css";
import "./styles/responsive.css";
import "./styles/collection-mobile.css";
import "./styles/pdp-mobile.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginModalProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LoginModalProvider>
  </BrowserRouter>,
);
