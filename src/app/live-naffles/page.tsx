"use client";

import Footer from "@components/shared/Footer/Footer";
import RaffleBrowser from "@/components/Raffle/RaffleBrowser";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import RaffleCreationWizard from "@/components/Raffle/RaffleCreationWizard";

const LiveNaffles = () => {
  const [showCreationWizard, setShowCreationWizard] = useState(false);

  const handleRaffleCreated = () => {
    setShowCreationWizard(false);
    // Refresh the raffle list
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Live Raffles
            </h1>
            <p className="text-lg text-gray-600">
              Discover and participate in exciting raffles
            </p>
          </div>
          
          <Button
            color="primary"
            size="lg"
            startContent={<PlusIcon className="w-5 h-5" />}
            onPress={() => setShowCreationWizard(true)}
            className="font-semibold"
          >
            Create Raffle
          </Button>
        </div>

        {/* Raffle Browser */}
        <RaffleBrowser />
      </div>

      {/* Creation Wizard Modal */}
      {showCreationWizard && (
        <RaffleCreationWizard
          isOpen={showCreationWizard}
          onClose={() => setShowCreationWizard(false)}
          onSuccess={handleRaffleCreated}
        />
      )}

      <Footer />
    </div>
  );
};

export default LiveNaffles;
