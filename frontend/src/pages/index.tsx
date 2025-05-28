import ConnectPage from "../components/connect-page";
import Dashboard from "../components/dashboard";
import Header from "../components/header";
import { useWalletContext } from "../contexts/WalletContext";

export default function MainPage() {
  const { account } = useWalletContext();

  return (
    <div className="w-full flex flex-col min-h-full">
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
