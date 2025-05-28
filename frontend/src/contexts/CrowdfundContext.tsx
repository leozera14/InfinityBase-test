import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useWalletContext } from "./WalletContext";
import { SUPPORTED_NETWORKS } from "../constants/supported-networks";
import { MyCrowdfund, type CampaignOutput } from "../contracts/MyCrowdfund";
import type { CrowdfundContextData } from "../types/CrowdfundContext";
import { parseUnits } from "ethers/lib/utils";
import type { BigNumberish } from "fuels";

const CrowdfundContext = createContext<CrowdfundContextData | undefined>(
  undefined
);

export function CrowdfundProvider({ children }: { children: React.ReactNode }) {
  const { wallet, provider } = useWalletContext();

  const [campaigns, setCampaigns] = useState<CampaignOutput[]>([]);
  const [myCampaigns, setMyCampaigns] = useState<CampaignOutput[]>([]);
  const [contributedCampaigns, setContributedCampaigns] = useState<
    CampaignOutput[]
  >([]);

  const [loading, setLoading] = useState({
    campaigns: false,
    myCampaigns: false,
    contributedCampaigns: false,
    creating: false,
    contributing: false,
    withdrawing: false,
    refunding: false,
  });

  const contract = useMemo(() => {
    if (!wallet || !provider) return null;

    const network = SUPPORTED_NETWORKS.find(
      (net) => net.url === provider.url && net.contractId
    );

    if (!network)
      throw new Error("Network not supported or contract not found!");

    return new MyCrowdfund(network.contractId, wallet);
  }, [wallet, provider]);

  const refreshAllCampaigns = useCallback(async () => {
    if (!contract) return;

    try {
      setLoading((prev) => {
        return { ...prev, campaigns: true };
      });

      const { value } = await contract.functions.get_all_campaigns().get();

      console.log("all campaigns", value);

      setCampaigns(value);
    } catch (error) {
      console.error(`Failed to get All Campaigns:`, error);
    } finally {
      setLoading((prev) => {
        return { ...prev, campaigns: false };
      });
    }
  }, [contract]);

  const refreshMyCampaigns = useCallback(async () => {
    if (!contract) return;

    try {
      setLoading((prev) => {
        return { ...prev, myCampaigns: true };
      });

      const { value } = await contract.functions.get_my_campaigns().get();

      console.log("my campaigns", value);

      setMyCampaigns(value);
    } catch (error) {
      console.error(`Failed to get My Campaigns:`, error);
    } finally {
      setLoading((prev) => {
        return { ...prev, myCampaigns: false };
      });
    }
  }, [contract]);

  const refreshContributedCampaigns = useCallback(async () => {
    if (!contract) return;

    try {
      setLoading((prev) => {
        return { ...prev, contributedCampaigns: true };
      });

      const { value } = await contract.functions
        .get_contributed_campaigns()
        .get();

      console.log("contributed campaigns", value);

      setContributedCampaigns(value);
    } catch (error) {
      console.error(`Failed to get Contributed Campaigns:`, error);
    } finally {
      setLoading((prev) => {
        return { ...prev, contributedCampaigns: false };
      });
    }
  }, [contract]);

  const executeAllPromises = useCallback(async () => {
    return Promise.all([
      refreshAllCampaigns(),
      refreshMyCampaigns(),
      refreshContributedCampaigns(),
    ]);
  }, [refreshAllCampaigns, refreshContributedCampaigns, refreshMyCampaigns]);

  useEffect(() => {
    if (contract) {
      executeAllPromises();
    }
  }, [contract, executeAllPromises]);

  const createCampaign = useCallback(
    async (goal: string) => {
      if (!contract) throw new Error("Contract not initialized");

      try {
        setLoading((prev) => ({ ...prev, creating: true }));

        const goalUnits: BigNumberish = parseUnits(goal, 9).toString();

        const transaction = await contract.functions
          .create_campaign(goalUnits)
          .txParams({})
          .call();

        const result = await transaction.waitForResult();

        await Promise.all([refreshAllCampaigns(), refreshMyCampaigns()]);

        return result.value.toNumber() as number;
      } catch (error) {
        console.error(`Error creating the Campaign`, error);
      } finally {
        setLoading((prev) => ({ ...prev, creating: false }));
      }
    },
    [contract, refreshMyCampaigns, refreshAllCampaigns]
  );

  const contributeCampaign = useCallback(
    async (id: number, amount: string) => {
      if (!contract) throw new Error("Contract not initialized");

      try {
        setLoading((prev) => ({ ...prev, contributing: true }));

        const amountUnits: BigNumberish = parseUnits(amount, 9).toString();

        const baseAssetId = await provider?.getBaseAssetId();

        const transaction = await contract.functions
          .contribute_campaign(id)
          .callParams({
            forward: [amountUnits, baseAssetId as string],
          })
          .txParams({})
          .call();

        await transaction.waitForResult();

        await Promise.all([
          refreshAllCampaigns(),
          refreshContributedCampaigns(),
        ]);
      } catch (error) {
        console.error(`Error contributing to the Campaign`, error);
      } finally {
        setLoading((prev) => ({ ...prev, contributing: false }));
      }
    },
    [contract, refreshContributedCampaigns, refreshAllCampaigns]
  );

  const withdrawCampaign = useCallback(
    async (id: number) => {
      if (!contract) throw new Error("Contract not initialized");
      try {
        setLoading((prev) => ({ ...prev, withdrawing: true }));

        const transaction = await contract.functions
          .withdraw_campaign(id)
          .txParams({})
          .call();

        await transaction.waitForResult();

        await Promise.all([refreshAllCampaigns(), refreshMyCampaigns()]);
      } catch (error) {
        console.error(`Error withdrawing the Campaign`, error);
      } finally {
        setLoading((prev) => ({ ...prev, withdrawing: false }));
      }
    },
    [contract, refreshMyCampaigns, refreshAllCampaigns]
  );

  const refundCampaign = useCallback(
    async (id: number) => {
      if (!contract) throw new Error("Contract not initialized");

      try {
        setLoading((prev) => ({ ...prev, refunding: true }));

        const transaction = await contract.functions
          .refund_campaign(id)
          .txParams({})
          .call();

        await transaction.waitForResult();

        await Promise.all([
          refreshAllCampaigns(),
          refreshContributedCampaigns(),
        ]);
      } catch (error) {
        console.error(`Error refunding the Campaign`, error);
      } finally {
        setLoading((prev) => ({ ...prev, refunding: false }));
      }
    },
    [contract, refreshContributedCampaigns, refreshAllCampaigns]
  );

  const contextValue = useMemo<CrowdfundContextData>(
    () => ({
      campaigns,
      myCampaigns,
      contributedCampaigns,
      loading,
      refreshAllCampaigns,
      refreshMyCampaigns,
      refreshContributedCampaigns,
      createCampaign,
      contributeCampaign,
      withdrawCampaign,
      refundCampaign,
    }),
    [
      campaigns,
      contributeCampaign,
      contributedCampaigns,
      createCampaign,
      loading,
      myCampaigns,
      refreshAllCampaigns,
      refreshContributedCampaigns,
      refreshMyCampaigns,
      refundCampaign,
      withdrawCampaign,
    ]
  );

  return (
    <CrowdfundContext.Provider value={contextValue}>
      {children}
    </CrowdfundContext.Provider>
  );
}

export function useCrowdfundContext() {
  const ctx = useContext(CrowdfundContext);
  if (!ctx) throw new Error("Invalid useCrowdfundContext value!");
  return ctx;
}
