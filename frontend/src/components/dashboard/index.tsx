import { useEffect } from "react";
import { useCrowdfund } from "../../hooks/use-crowdfund-contract";

export default function Dashboard() {
  const contract = useCrowdfund();

  useEffect(() => {
    async function load() {
      if (!contract) return;

      console.log("contract", contract);

      const { value } = await contract.functions.get_campaign_count().get();

      console.log("campaign count", value);
    }
    load();
  }, [contract]);

  return (
    <main className="flex-1 text-white mt-2">
      <h1 className="text-2xl mb-4">Welcome to Crowdfund DApp</h1>
    </main>
  );
}
