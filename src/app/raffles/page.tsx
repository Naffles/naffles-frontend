'use client';

import React, { useState } from 'react';
import { Button, Tabs, Tab } from '@nextui-org/react';
import { PlusIcon, TicketIcon, ClockIcon } from '@heroicons/react/24/outline';
import { colors, typography } from '@/styles/design-system/tokens';
import RaffleBrowser from '@/components/Raffle/RaffleBrowser';
import RaffleHistory from '@/components/Raffle/RaffleHistory';
import RaffleCreationWizard from '@/components/Raffle/RaffleCreationWizard';

const RafflesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [showCreationWizard, setShowCreationWizard] = useState(false);

  const handleRaffleCreated = () => {
    setShowCreationWizard(false);
    setActiveTab('browse'); // Switch to browse tab to see the new raffle
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 
                className="text-3xl font-bold"
                style={{ 
                  color: colors.gray[900],
                  fontFamily: typography.fontFamily.display.join(', ')
                }}
              >
                Naffles Raffles
              </h1>
              <p className="mt-2 text-lg" style={{ color: colors.gray[600] }}>
                Discover, create, and participate in exciting raffles
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
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            className="w-full"
            classNames={{
              tabList: "w-full",
              tab: "h-12",
            }}
          >
            <Tab 
              key="browse" 
              title={
                <div className="flex items-center gap-2">
                  <TicketIcon className="w-5 h-5" />
                  <span>Browse Raffles</span>
                </div>
              }
            />
            <Tab 
              key="history" 
              title={
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>My History</span>
                </div>
              }
            />
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <RaffleBrowser />
        )}
        
        {activeTab === 'history' && (
          <RaffleHistory />
        )}
      </div>

      {/* Creation Wizard Modal */}
      {showCreationWizard && (
        <RaffleCreationWizard
          isOpen={showCreationWizard}
          onClose={() => setShowCreationWizard(false)}
          onSuccess={handleRaffleCreated}
        />
      )}
    </div>
  );
};

export default RafflesPage;