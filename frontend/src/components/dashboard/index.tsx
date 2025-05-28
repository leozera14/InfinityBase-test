import CreateCampaignForm from "./_components/create-campaign-form";
import { useDashboardHook } from "./_hook/use-dashboard";

export default function Dashboard() {
  const {
    tab,
    setTab,
    tabs,
    list,
    isLoadingList,
    createCampaign,
    createLoading,
    RenderComponent,
  } = useDashboardHook();

  return (
    <main className="flex flex-col  text-white p-4 space-y-2 h-full">
      <h1 className="text-2xl w-full text-center">Welcome to Crowdfund DApp</h1>

      <CreateCampaignForm onCreate={createCampaign} loading={createLoading} />

      <div className="flex space-x-4 mb-4">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 pb-2 text-center ${
              tab === key ? "border-b-2 border-green-1" : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className={`
          w-full h-full
          ${
            list.length > 0 && !isLoadingList
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center"
              : ""
          }`}
      >
        {RenderComponent}
      </div>
    </main>
  );
}
