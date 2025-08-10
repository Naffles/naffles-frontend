'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab, Button } from '@nextui-org/react';
import { PlusIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../../components/Accessibility/AccessibleButton';
import AllowlistBrowser from '../../components/Allowlist/AllowlistBrowser';
import AllowlistCreationForm from '../../components/Allowlist/AllowlistCreationForm';
import AllowlistHistory from '../../components/Allowlist/AllowlistHistory';
import WinnerNotificationPanel from '../../components/Allowlist/WinnerNotificationPanel';

/**
 * Allowlists Page
 * 
 * Main page for the allowlist system showcasing browsing, creation,
 * and participation features.
 */
export default function AllowlistsPage() {
  const [selectedTab, setSelectedTab] = useState('browse');
  const [showCreationForm, setShowCreationForm] = useState(false);

  const handleCreateAllowlist = () => {
    setShowCreationForm(true);
  };

  const handleCreationSuccess = () => {
    setShowCreationForm(false);
    setSelectedTab('browse');
    // Refresh the browser
    window.location.reload();
  };

  const renderBrowseTab = () => (
    <div className="space-y-6">
      <WinnerNotificationPanel />
      <AllowlistBrowser
        showCreateButton={true}
        onCreateAllowlist={handleCreateAllowlist}
      />
    </div>
  );

  const renderCreateTab = () => (
    <div className="max-w-4xl mx-auto">
      <AllowlistCreationForm
        onSuccess={handleCreationSuccess}
        onCancel={() => setSelectedTab('browse')}
      />
    </div>
  );

  const renderHistoryTab = () => (
    <div className="max-w-4xl mx-auto">
      <AllowlistHistory />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Naffles Allowlists
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create and participate in allowlists with social tasks, profit guarantees, and provably fair winner selection.
              Build your community engagement while offering exciting opportunities to your members.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <TrophyIcon className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-semibold text-gray-900">Allowlist System</h2>
              </div>
              
              {selectedTab === 'browse' && (
                <AccessibleButton
                  color="primary"
                  onPress={handleCreateAllowlist}
                  startContent={<PlusIcon className="w-4 h-4" />}
                >
                  Create Allowlist
                </AccessibleButton>
              )}
            </div>
          </CardHeader>

          <CardBody>
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              className="w-full"
            >
              <Tab key="browse" title="Browse Allowlists">
                {renderBrowseTab()}
              </Tab>
              
              <Tab key="create" title="Create Allowlist">
                {renderCreateTab()}
              </Tab>
              
              <Tab key="history" title="My History">
                {renderHistoryTab()}
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardBody className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Provably Fair
              </h3>
              <p className="text-gray-600">
                Winner selection uses Chainlink VRF for transparent, verifiable randomness that can't be manipulated.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Social Engagement
              </h3>
              <p className="text-gray-600">
                Integrate Twitter, Discord, and Telegram tasks to boost community engagement and grow your following.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">%</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Profit Guarantee
              </h3>
              <p className="text-gray-600">
                Optional profit guarantee system ensures even losing participants can receive a share of the proceeds.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card className="mt-12">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Getting Started</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">For Creators</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                    Click "Create Allowlist" to start building your allowlist
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                    Configure entry price, winner count, and profit guarantee
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                    Add social tasks to boost engagement
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                    Launch and watch participants join
                  </li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">For Participants</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                    Browse active allowlists and find ones you like
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                    Complete required social tasks (follow, join, etc.)
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                    Pay entry fee (if required) and submit your entry
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                    Wait for results and claim if you win!
                  </li>
                </ol>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}