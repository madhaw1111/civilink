import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

/* =====================================
   APPLY SAVED THEME & LANGUAGE
===================================== */

try {
  const storedUser = JSON.parse(localStorage.getItem("civilink_user"));
  const theme =
    storedUser?.theme ||
    localStorage.getItem("civilink_theme") ||
    "light";
  document.documentElement.setAttribute("data-theme", theme);
} catch {
  document.documentElement.setAttribute("data-theme", "light");
}

try {
  const storedUser = JSON.parse(localStorage.getItem("civilink_user"));
  const lang =
    storedUser?.language ||
    localStorage.getItem("civilink_lang") ||
    "en";
  document.documentElement.setAttribute("lang", lang);
} catch {
  document.documentElement.setAttribute("lang", "en");
}

/* =====================================
   RENDER APP
===================================== */

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
