import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "@fontsource-variable/funnel-display/wght.css";
import "@fontsource/jetbrains-mono/400.css";
import "./index.css";
import { PLAUSIBLE_DOMAIN } from "./config";
import App from "./App.jsx";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

// Optional, cookie-free analytics (off unless a domain is set in config.js).
if (PLAUSIBLE_DOMAIN) {
  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = PLAUSIBLE_DOMAIN;
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);
}
