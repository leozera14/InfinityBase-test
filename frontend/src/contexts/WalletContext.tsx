import React, { createContext, useContext, useMemo, useEffect } from "react";
import {
  useConnectors,
  useConnect,
  useDisconnect,
  useIsConnected,
  useAccount,
  useBalance,
  useProvider,
  useChain,
  useWallet as useWalletFuel,
} from "@fuels/react";

import type { WalletContextData } from "../types/WalletContext";

const WalletContext = createContext<WalletContextData | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useConnectors();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { account } = useAccount();
  const { provider } = useProvider();
  const { chain } = useChain();
  const { wallet } = useWalletFuel();
  const { balance, refetch: refetchBalance } = useBalance({
    account,
    assetId: chain?.consensusParameters.baseAssetId,
  });

  useEffect(() => {
    if (!account) return;
    const iv = setInterval(refetchBalance, 15_000);
    return () => clearInterval(iv);
  }, [account, refetchBalance]);

  const value = useMemo<WalletContextData>(
    () => ({
      connectors,
      wallet,
      connectAsync,
      disconnectAsync,
      isConnected,
      account,
      provider,
      balance,
    }),
    [
      connectors,
      wallet,
      connectAsync,
      disconnectAsync,
      isConnected,
      account,
      provider,
      balance,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext(): WalletContextData {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("Invalid useWalletContext value");
  return ctx;
}
