import { transitionEffect } from "../../constants/transition-effect";
import { useWalletContext } from "../../contexts/WalletContext";

export default function ConnectPage() {
  const { connectAsync } = useWalletContext();

  const handleConnect = async () => await connectAsync();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <button
        onClick={() => handleConnect()}
        className={`px-6 py-3 bg-green-1 font-semibold rounded-lg hover:opacity-90 ${transitionEffect}`}
      >
        <p className="text-black-1 font-bold text-lg">Connect</p>
      </button>
    </div>
  );
}
