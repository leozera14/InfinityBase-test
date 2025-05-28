import type { ChainProps } from "./WalletContext";

export interface HeaderComponentProps {
  account: string | null;
  chain: ChainProps | undefined;
  balance: number;
  disconnect: () => void;
}
