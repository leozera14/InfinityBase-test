import { createRoot } from "react-dom/client";
import App from "./App";
import { WalletProvider } from "./contexts/WalletContext";
import { AppProviders } from "./contexts/Providers";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <WalletProvider>
      <App />
    </WalletProvider>
  </AppProviders>
);
