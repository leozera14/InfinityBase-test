import { useWallet } from "../../contexts/WalletContext";
import { HeaderComponent } from "./header-component";

export default function Header() {
  const { disconnect, account, chain, balance } = useWallet();

  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-black-2 shadow-md">
      <HeaderComponent
        account={account}
        balance={balance}
        chain={chain}
        disconnect={disconnect}
      />
    </header>
  );
}
