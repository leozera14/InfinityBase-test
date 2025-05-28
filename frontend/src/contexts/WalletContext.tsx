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
} from "@fuels/react";

import type { WalletContextData } from "../types/WalletContext";
import { SUPPORTED_NETWORKS } from "../constants/supported-networks";
import { formatFuelBalance } from "../utils/format-fuel-balance";

const WalletContext = createContext<WalletContextData | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useConnectors();
  const { connect, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { account } = useAccount();
  const { provider } = useProvider();
  const { chain } = useChain();
  const { balance, refetch: refetchBalance } = useBalance({
    account,
    assetId: chain?.consensusParameters.baseAssetId,
  });

  useEffect(() => {
    if (!account) return;
    const iv = setInterval(refetchBalance, 15_000);
    return () => clearInterval(iv);
  }, [account, refetchBalance]);

  const fullNetworkInfo = useMemo(() => {
    return SUPPORTED_NETWORKS.find((network) => network.url === provider?.url);
  }, [provider?.url]);

  const formattedBalance = useMemo(() => {
    if (!balance) return 0.0;

    return formatFuelBalance(balance.toString() as string);
  }, [balance]);

  console.log({
    connectors,
    isConnected,
    account,
    provider,
    balance,
  });

  const value = useMemo<WalletContextData>(
    () => ({
      connectors,
      connect,
      connectAsync,
      disconnect,
      isConnected,
      account,
      chain: fullNetworkInfo,
      balance: formattedBalance,
    }),
    [
      connectors,
      connect,
      connectAsync,
      disconnect,
      isConnected,
      account,
      fullNetworkInfo,
      formattedBalance,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextData {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be within <WalletProvider>");
  return ctx;
}
