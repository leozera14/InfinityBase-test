import { SUPPORTED_NETWORKS } from "../constants/supported-networks";
import { MyCrowdfund } from "../contracts/MyCrowdfund";
import { useProvider, useWallet } from "@fuels/react";

export function useCrowdfund() {
  const { wallet } = useWallet();
  const { provider } = useProvider();

  if (!wallet || !provider) return null;

  const net = SUPPORTED_NETWORKS.find(
    (n) => n.url === provider.url && n.contractId !== ""
  );

  if (!net) throw new Error("Network not supported or contract not found!");

  return new MyCrowdfund(net.contractId, wallet);
}
