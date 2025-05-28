import ConnectPage from "../components/connect-page";
import Dashboard from "../components/dashboard";
import Header from "../components/header";
import { useWallet } from "../contexts/WalletContext";

export default function MainPage() {
  const { account } = useWallet();

  return (
    <div className="w-full flex flex-col min-h-full p-2">
      {account ? (
        <>
          <Header />
          <Dashboard />
        </>
      ) : (
        <ConnectPage />
      )}
    </div>
  );
}
