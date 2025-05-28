import { useWallet } from "../../contexts/WalletContext";
import { HeaderComponent } from "./header-component";

export default function Header() {
  const { disconnect, account, chain, balance } = useWallet();

  return (
    <header className="w-full">
      <HeaderComponent
        account={account}
        balance={balance}
        chain={chain}
        disconnect={disconnect}
      />
    </header>
  );
}
