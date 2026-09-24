import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/bebas-neue/400.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/manrope";
import "@fontsource-variable/noto-sans-arabic";
import { App } from "./App.jsx";
import "./styles.css";

document.documentElement.dataset.release = "2026-07-14-r2";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
