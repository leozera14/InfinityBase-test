import { formatUnits } from "ethers/lib/utils";
import { useWalletContext } from "../../../contexts/WalletContext";
import type { CampaignOutput } from "../../../contracts/MyCrowdfund";
import { walletEllipsis } from "../../../utils/wallet-ellipsis";
import { copyToClipboard } from "../../../utils/copy-to-clipboard";

import { ClipboardIcon } from "@heroicons/react/24/outline";
import { transitionEffect } from "../../../constants/transition-effect";
import { useState } from "react";
import { handleAmountInputChange } from "../../../utils/handle-amount-input-change";

interface Props {
  campaign: CampaignOutput;
  onContribute: (id: number, amount: string) => Promise<void>;
}

export default function CampaignCard({ campaign, onContribute }: Props) {
  const { account } = useWalletContext();

  const [donate, setDonate] = useState<string>("0");

  const owner = campaign.creator.bits;

  const goalEther = parseFloat(formatUnits(campaign.goal.toString(), 9));
  const pledgedEther = parseFloat(formatUnits(campaign.pledged.toString(), 9));
  const remaining = Math.max(goalEther - pledgedEther, 0);
  const progressPct =
    goalEther > 0 ? Math.min((pledgedEther / goalEther) * 100, 100) : 0;

  const handleContribute = async () => {
    const amount = parseFloat(donate);
    const id = campaign.id.toNumber();

    if (!donate || isNaN(amount) || amount <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    if (amount > remaining) {
      alert(`Amount exceeds remaining goal (${remaining.toFixed(4)} ETH).`);
      return;
    }

    try {
      await onContribute(id, donate);
    } catch (e) {
      console.log(e);
    }
  };

  // const isOwner = account?.toLowerCase() === owner.toLowerCase();

  return (
    <div
      className={`
        w-full flex flex-col justify-between bg-black-2/10 border border-green-1/20 p-3 rounded-lg max-w-xs h-full max-h-[400px] 
        transition-colors ${transitionEffect} hover:shadow-lg hover:border-green-1/30`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center ">
          <span className="text-xs text-white font-semibold font-mono">
            Goal
          </span>

          <span className="text-sm text-green-1 font-mono">
            {goalEther.toFixed(4)} ETH
          </span>
        </div>

        <div className="flex justify-between items-center ">
          <span className="text-xs text-white font-semibold font-mono">
            Pledged
          </span>
          <span className="text-sm text-green-1 font-mono">
            {pledgedEther.toFixed(4)} ETH
          </span>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-white font-semibold font-mono">Owner:</p>
          <div className="flex items-center bg-black-1/70 border border-green-1/60 px-3 py-1 rounded-lg gap-x-2">
            <span className="text-xs text-green-1 font-mono">
              {walletEllipsis(owner!, 5, 7)}
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
      </div>

      <div className="flex flex-col mt-auto gap-y-4">
        {/* {!isOwner && ( */}
        <div className="flex flex-col gap-y-1.5">
          <div className="flex flex-col gap-y-1">
            <label className="text-[11px] font-font-normal text-white">
              Contribute with:
            </label>
            <input
              value={donate}
              type="text"
              onChange={(e) => handleAmountInputChange(e, setDonate)}
              placeholder="0.000006"
              className="w-full px-3 py-1 bg-black-1/60 border border-green-1/20 rounded text-white text-sm outline-none"
            />
          </div>

          <button
            onClick={() => handleContribute()}
            className={`py-2 text-xs font-semibold rounded bg-green-1/80 hover:opacity-80 ${transitionEffect}`}
          >
            Contribute
          </button>
        </div>

        <div className="flex flex-col gap-y-1">
          <div className="w-full h-2 bg-black-1/60 border border-green-1/70 rounded-full overflow-hidden ">
            <div
              className="h-full bg-green-1"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[9px] text-white font-normal">
            {progressPct.toFixed(1)}% pledged
          </p>
        </div>

        {/* )} */}
      </div>
    </div>
  );
}
