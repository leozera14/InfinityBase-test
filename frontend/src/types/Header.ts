import type { BN, Provider } from "fuels";
export interface HeaderComponentProps {
  account: string | null;
  provider: Provider | undefined;
  balance: BN | null;
  disconnect: () => void;
}
