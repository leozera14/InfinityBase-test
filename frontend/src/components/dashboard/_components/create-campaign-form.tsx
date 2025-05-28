import { useState } from "react";
import { handleAmountInputChange } from "../../../utils/handle-amount-input-change";

interface Props {
  onCreate: (goal: string) => Promise<number | undefined>;
  loading: boolean;
}

export default function CreateCampaignForm({ onCreate, loading }: Props) {
  const [goal, setGoal] = useState<string>("0");

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleCreate = async () => {
    if (!goal || parseFloat(goal) <= 0) {
      alert("Goal cannot be 0!");
      return;
    }

    try {
      const newId = await onCreate(goal);

      if (newId !== undefined) {
        closeModal();
        setGoal("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-end">
        <button
          onClick={openModal}
          className="bg-green-1 px-3 py-1 rounded-md hover:bg-opacity-90 transition"
        >
          <span className="text-black-1 text-sm font-semibold">
            Create Campaign
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-[#1D1C24]  rounded-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-800 px-4 py-2">
              <h2 className="text-lg font-semibold text-white">
                Create Campaign
              </h2>
              <button
                onClick={closeModal}
                className="text-white text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-4 flex flex-col gap-y-1">
              <label className="text-base font-semibold mb-1 text-white">
                Goal:
              </label>
              <input
                value={goal}
                type="text"
                onChange={(e) => handleAmountInputChange(e, setGoal)}
                placeholder="0.000006"
                className="w-full px-3 py-2 bg-[#2A2933] rounded text-white outline-none"
              />
            </div>

            <div className="flex justify-end p-4">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-green-1 px-3 py-1 rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
              >
                <span className="text-black-1 text-sm font-semibold">
                  {loading ? "Creating..." : "Create"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
