import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/* =====================================
   APPLY SAVED THEME (STEP 3)
===================================== */

// Priority:
// 1️⃣ User theme from DB (stored in localStorage user)
// 2️⃣ Theme saved locally
// 3️⃣ Default = light

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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
