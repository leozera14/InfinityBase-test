import type { FuelConnector } from "fuels";

export interface ChainProps {
  name: string;
  url: string;
  explorer: string;
}

export interface WalletContextData {
  connectors: FuelConnector[];
  connect: (name?: string) => void;
  connectAsync: (name?: string) => Promise<boolean>;
  disconnect: () => void;
  isConnected: boolean;
  account: string | null;
  chain: ChainProps | undefined;
  balance: number;
}
