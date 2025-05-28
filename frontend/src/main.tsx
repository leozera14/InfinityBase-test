import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProviders } from "./contexts/Providers";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <App />
  </AppProviders>
);
