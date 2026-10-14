import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist/wght.css";
import "@fontsource/jetbrains-mono/400.css";
import "./index.css";
import { PLAUSIBLE_DOMAIN } from "./config";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Optional, cookie-free analytics (off unless a domain is set in config.js).
if (PLAUSIBLE_DOMAIN) {
  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = PLAUSIBLE_DOMAIN;
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);
}
