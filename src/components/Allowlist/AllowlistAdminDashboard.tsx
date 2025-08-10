'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab, Chip, Button, Progress, Spinner } from '@nextui-org/react';
import { ChartBarIcon, UsersIcon, TrophyIcon, CurrencyDollarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import AllowlistRestrictionSettings from './AllowlistRestrictionSettings';
import { colors, spacing } from '../../styles/design-system/tokens';
import { AllowlistAdminData } from './types';

interface AllowlistAdminDashboardProps {
  className?: string;
}

/**
 * AllowlistAdminDashboard Component
 * 
 * Administrative dashboard for managing allowlist system settings,
 * viewing platform statistics, and configuring restrictions.
 */
const AllowlistAdminDashboard: React.FC<AllowlistAdminDashboardProps> = ({
  className = ''
}) => {
  const [adminData, setAdminData] = useState<AllowlistAdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [recentAllowlists, setRecentAllowlists] = useState<any[]>([]);

  useEffect(() => {
    loadAdminData();
    loadRecentAllowlists();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/allowlists/dashboard');
      if (response.ok) {
        const data = await response.json();
        setAdminData(data.data);
      } else {
        console.error('Failed to load admin data');
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentAllowlists = async () => {
    try {
      const response = await fetch('/api/admin/allowlists/recent?limit=10');
      if (response.ok) {
        const data = await response.json();
        setRecentAllowlists(data.data.allowlists || []);
      }
    } catch (error) {
      console.error('Error loading recent allowlists:', error);
    }
  };

  const handleConfigurationUpdate = () => {
    // Refresh admin data after configuration changes
    loadAdminData();
  };

  const renderOverviewTab = () => {
    if (!adminData) return null;

    const { systemStats, recentActivity } = adminData;

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalAllowlists}</p>
                  <p className="text-sm text-gray-600">Total Allowlists</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalParticipants}</p>
                  <p className="text-sm text-gray-600">Total Participants</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalWinners}</p>
                  <p className="text-sm text-gray-600">Total Winners</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.activeAllowlists}</p>
                  <p className="text-sm text-gray-600">Active Allowlists</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Allowlist Status Distribution</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Active</span>
                  <span className="font-medium">{systemStats.activeAllowlists}</span>
                </div>
                <Progress
                  value={(systemStats.activeAllowlists / systemStats.totalAllowlists) * 100}
                  color="primary"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium">{systemStats.completedAllowlists}</span>
                </div>
                <Progress
                  value={(systemStats.completedAllowlists / systemStats.totalAllowlists) * 100}
                  color="success"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-medium">
                    {systemStats.totalAllowlists - systemStats.activeAllowlists - systemStats.completedAllowlists}
                  </span>
                </div>
                <Progress
                  value={((systemStats.totalAllowlists - systemStats.activeAllowlists - systemStats.completedAllowlists) / systemStats.totalAllowlists) * 100}
                  color="danger"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Activity (Last 24 Hours)</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{recentActivity.allowlistsCreated}</p>
                <p className="text-sm text-gray-600">Allowlists Created</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{recentActivity.participantsJoined}</p>
                <p className="text-sm text-gray-600">New Participants</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{recentActivity.winnersSelected}</p>
                <p className="text-sm text-gray-600">Winners Selected</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{recentActivity.payoutsProcessed}</p>
                <p className="text-sm text-gray-600">Payouts Processed</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Total Payouts */}
        {Object.keys(systemStats.totalPayouts).length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Total Platform Payouts</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {Object.entries(systemStats.totalPayouts).map(([tokenType, amount]) => (
                  <div key={tokenType} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Chip size="sm" variant="flat">{tokenType}</Chip>
                    </div>
                    <span className="font-medium">{amount}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    );
  };

  const renderAllowlistsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold">Recent Allowlists</h3>
            <Button
              size="sm"
              variant="flat"
              onPress={loadRecentAllowlists}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {recentAllowlists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No recent allowlists found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAllowlists.map((allowlist) => (
                <div key={allowlist._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{allowlist.title}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>Created {new Date(allowlist.createdAt).toLocaleDateString()}</span>
                      <span>{allowlist.totalEntries} participants</span>
                      <span>
                        {allowlist.entryPrice.amount === '0' 
                          ? 'Free' 
                          : `${allowlist.entryPrice.amount} ${allowlist.entryPrice.tokenType}`
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Chip
                      size="sm"
                      color={
                        allowlist.status === 'active' ? 'primary' :
                        allowlist.status === 'completed' ? 'success' : 'danger'
                      }
                      variant="flat"
                    >
                      {allowlist.status.charAt(0).toUpperCase() + allowlist.status.slice(1)}
                    </Chip>
                    
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        // Navigate to allowlist details
                        window.open(`/allowlists/${allowlist._id}`, '_blank');
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <AllowlistRestrictionSettings onUpdate={handleConfigurationUpdate} />
    </div>
  );

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-600">Failed to load admin data</p>
        <Button onPress={loadAdminData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Allowlist Administration</h2>
              <p className="text-gray-600">Manage allowlist system settings and monitor platform activity</p>
            </div>
            <Chip color="primary" variant="flat">
              Admin
            </Chip>
          </div>
        </CardHeader>

        <CardBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            className="w-full"
          >
            <Tab key="overview" title="Overview">
              {renderOverviewTab()}
            </Tab>
            
            <Tab key="allowlists" title="Recent Allowlists">
              {renderAllowlistsTab()}
            </Tab>
            
            <Tab key="settings" title="Settings">
              {renderSettingsTab()}
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default AllowlistAdminDashboard;