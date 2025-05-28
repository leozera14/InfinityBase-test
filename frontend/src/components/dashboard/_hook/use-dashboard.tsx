import { useState, useMemo } from "react";

import type { DashboardTabKey } from "../../../types/Dashboard";
import type { CampaignOutput } from "../../../contracts/MyCrowdfund";
import { useCrowdfundContext } from "../../../contexts/CrowdfundContext";
import { defaultDivMessageClass } from "../_constants/default-div-message";
import CampaignCard from "../_components/campaign-card";

export function useDashboardHook() {
  const [tab, setTab] = useState<DashboardTabKey>("all");
  const {
    campaigns,
    myCampaigns,
    contributedCampaigns,
    loading,
    createCampaign,
    contributeCampaign,
  } = useCrowdfundContext();

  const handleContributeCampaign = async (id: number, amount: string) =>
    await contributeCampaign(id, amount);

  const listMap: Record<DashboardTabKey, CampaignOutput[]> = useMemo(
    () => ({
      all: campaigns,
      mine: myCampaigns,
      contributed: contributedCampaigns,
    }),
    [campaigns, myCampaigns, contributedCampaigns]
  );
  const list = listMap[tab];

  const loadingKey = useMemo(() => {
    switch (tab) {
      case "all":
        return "All Campaigns";
      case "mine":
        return "Your Campaigns";
      default:
        return "Your Contributed Campaigns";
    }
  }, [tab]) as keyof typeof loading;

  const isLoadingList = loading[loadingKey];

  const tabs = useMemo(
    () => [
      { key: "all" as DashboardTabKey, label: "All Campaigns" },
      { key: "mine" as DashboardTabKey, label: "My Campaigns" },
      { key: "contributed" as DashboardTabKey, label: "Contributed Campaigns" },
    ],
    []
  );

  const RenderComponent = useMemo(() => {
    if (isLoadingList) {
      return (
        <div className={defaultDivMessageClass}>
          <p>Loading campaigns...</p>
        </div>
      );
    }

    if (list.length === 0) {
      return (
        <div className={defaultDivMessageClass}>
          <p>No campaigns to show...</p>
        </div>
      );
    }

    return list.map((c) => (
      <CampaignCard
        key={c.id.toString()}
        campaign={c}
        onContribute={handleContributeCampaign}
      />
    ));
  }, [isLoadingList, list, handleContributeCampaign]);

  return {
    tab,
    setTab,
    tabs,
    list,
    isLoadingList,
    createCampaign,
    createLoading: loading.creating,
    RenderComponent,
  };
}
