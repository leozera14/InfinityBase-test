import { useWalletContext } from "../../contexts/WalletContext";
import { HeaderComponent } from "./header-component";

export default function Header() {
  const { account, provider, balance, disconnectAsync } = useWalletContext();

  const handleDisconnect = async () => await disconnectAsync();

  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-black-2 shadow-md">
      <HeaderComponent
        account={account}
        balance={balance}
        provider={provider}
        disconnect={handleDisconnect}
      />
    </header>
  );
}
