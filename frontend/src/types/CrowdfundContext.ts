import type { CampaignOutput } from "../contracts/MyCrowdfund";

type CrowdfundLoading = {
  campaigns: boolean;
  myCampaigns: boolean;
  contributedCampaigns: boolean;
  creating: boolean;
  contributing: boolean;
  withdrawing: boolean;
  refunding: boolean;
};

export interface CrowdfundContextData {
  campaigns: CampaignOutput[];
  myCampaigns: CampaignOutput[];
  contributedCampaigns: CampaignOutput[];
  loading: CrowdfundLoading;
  refreshAllCampaigns: () => Promise<void>;
  refreshMyCampaigns: () => Promise<void>;
  refreshContributedCampaigns: () => Promise<void>;
  createCampaign: (goal: string) => Promise<number | undefined>;
  contributeCampaign: (id: number, amount: string) => Promise<void>;
  withdrawCampaign: (id: number) => Promise<void>;
  refundCampaign: (id: number) => Promise<void>;
}
