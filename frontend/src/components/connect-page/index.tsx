import { transitionEffect } from "../../constants/transition-effect";
import { useWallet } from "../../contexts/WalletContext";

export default function ConnectPage() {
  const { connect } = useWallet();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <button
        onClick={() => connect()}
        className={`px-6 py-3 bg-green font-semibold rounded-lg hover:opacity-90 ${transitionEffect}`}
      >
        <p className="text-black font-bold text-lg">Connect</p>
      </button>
    </div>
  );
}
