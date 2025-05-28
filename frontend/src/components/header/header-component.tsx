import { walletEllipsis } from "../../utils/wallet-ellipsis";

import { ClipboardIcon } from "@heroicons/react/24/outline";

import type { HeaderComponentProps } from "../../types/Header";

export function HeaderComponent({
  account,
  balance,
  chain,
  disconnect,
}: HeaderComponentProps) {
  const displayBalance = `${balance.toFixed(3)}…`;
  const titleBalance = `${balance.toFixed(9)} ETH`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full flex items-center justify-between px-4 py-2 bg-black shadow-md">
      <h1 className="text-xl font-bold text-green">InfinityBase Test</h1>

      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <div className="text-sm text-white font-mono flex items-center gap-x-2">
            <p>Address:</p>
            <div className="flex items-center bg-black/70 border border-green/60 px-3 py-1 rounded-lg gap-x-2">
              <span className="text-sm text-white font-mono">
                {walletEllipsis(account!)}
              </span>
              <div
                title="Copy Address"
                className="w-4 h-4 flex items-center justify-center cursor-pointer"
                onClick={() => copyToClipboard(account!)}
              >
                <ClipboardIcon className="text-green" />
              </div>
            </div>
          </div>

          <div className="text-sm text-white font-mono flex items-center gap-x-2">
            <p>Balance:</p>

            <div
              className="flex items-center bg-black/70 border border-green/60 px-3 py-1 rounded-lg "
              title={titleBalance}
            >
              <span className="">{displayBalance} ETH</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-2 py-1 bg-green text-black text-xs font-semibold rounded-lg">
            {chain?.name}
          </span>

          <button
            className="bg-green px-3 py-1 rounded-md hover:bg-opacity-90 transition"
            onClick={disconnect}
          >
            <span className="text-black text-sm font-semibold">Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  );
}
