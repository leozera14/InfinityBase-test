import type { Account, BN, FuelConnector, Provider } from "fuels";

export interface ChainProps {
  name: string;
  url: string;
  explorer: string;
}

export interface WalletContextData {
  connectors: FuelConnector[];
  wallet: Account | null;
  connectAsync: (name?: string) => Promise<boolean>;
  disconnectAsync: () => Promise<boolean>;
  isConnected: boolean;
  account: string | null;
  provider: Provider | undefined;
  balance: BN | null;
}
