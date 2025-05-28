import { walletEllipsis } from "../../utils/wallet-ellipsis";

import { ClipboardIcon } from "@heroicons/react/24/outline";

import type { HeaderComponentProps } from "../../types/Header";
import { transitionEffect } from "../../constants/transition-effect";
import { useMemo } from "react";
import { formatFuelBalance } from "../../utils/format-fuel-balance";
import { SUPPORTED_NETWORKS } from "../../constants/supported-networks";
import { copyToClipboard } from "../../utils/copy-to-clipboard";

export function HeaderComponent({
  account,
  balance,
  provider,
  disconnect,
}: HeaderComponentProps) {
  const formattedBalance = useMemo(() => {
    if (!balance) return 0.0;

    return formatFuelBalance(balance.toString() as string);
  }, [balance]);

  const fullNetworkInfo = useMemo(() => {
    if (!provider?.url) return null;

    return SUPPORTED_NETWORKS.find((network) => network.url === provider.url);
  }, [provider?.url]);

  const displayBalance = `${formattedBalance.toFixed(3)}…`;
  const titleBalance = `${formattedBalance.toFixed(9)} ETH`;

  return (
    <>
      <h1 className="text-xl font-bold text-green-1">InfinityBase Test</h1>

      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <div className="text-sm text-white font-mono flex items-center gap-x-2">
            <p>Address:</p>
            <div className="flex items-center bg-black-1/70 border border-green-1/60 px-3 py-1 rounded-lg gap-x-2">
              <span className="text-sm text-white font-mono">
                {walletEllipsis(account!, 7, 10)}
              </span>
              <div
                title="Copy Address"
                className={`w-4 h-4 flex items-center justify-center cursor-pointer hover:scale-105 ${transitionEffect}`}
                onClick={() => copyToClipboard(account!)}
              >
                <ClipboardIcon className="text-green-1" />
              </div>
            </div>
          </div>

          <div className="text-sm text-white font-mono flex items-center gap-x-2">
            <p>Balance:</p>

            <div
              className="flex items-center bg-black-1/70 border border-green-1/60 px-3 py-1 rounded-lg "
              title={titleBalance}
            >
              <span className="">{displayBalance} ETH</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-2 py-1 bg-green-1 text-black-1 text-xs font-semibold rounded-lg">
            {fullNetworkInfo?.name ?? ""}
          </span>

          <button
            className="bg-green-1 px-3 py-1 rounded-md hover:bg-opacity-90 transition"
            onClick={disconnect}
          >
            <span className="text-black-1 text-sm font-semibold">
              Disconnect
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
