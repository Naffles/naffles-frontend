'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab, Chip, Progress, Spinner, Button } from '@nextui-org/react';
import { ChartBarIcon, UsersIcon, ClockIcon, TrophyIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import WinnerExportInterface from './WinnerExportInterface';
import { colors, spacing } from '../../styles/design-system/tokens';
import { Allowlist, AllowlistAnalyticsData, AllowlistAnalyticsProps } from './types';

/**
 * AllowlistAnalytics Component
 * 
 * Comprehensive analytics dashboard for allowlist creators showing
 * participation metrics, task completion rates, and winner data.
 */
const AllowlistAnalytics: React.FC<AllowlistAnalyticsProps> = ({
  allowlistId,
  allowlist: initialAllowlist,
  className = ''
}) => {
  const [analyticsData, setAnalyticsData] = useState<AllowlistAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [allowlistId]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/allowlists/${allowlistId}/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
      } else {
        console.error('Failed to load analytics data');
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-600">Failed to load analytics data</p>
        <Button onPress={loadAnalyticsData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const { allowlist, statistics, participationTrends, taskCompletionRates, winnerData } = analyticsData;

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalParticipants}</p>
                <p className="text-sm text-gray-600">Total Participants</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{statistics.completedTasks}</p>
                <p className="text-sm text-gray-600">Tasks Completed</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{Math.round(statistics.averageTaskCompletion)}%</p>
                <p className="text-sm text-gray-600">Avg Completion</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {allowlist.winnerCount === 'everyone' ? 'All' : allowlist.winnerCount}
                </p>
                <p className="text-sm text-gray-600">Winners</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Allowlist Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Allowlist Status</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <Chip
                color={allowlist.status === 'active' ? 'success' : allowlist.status === 'completed' ? 'primary' : 'danger'}
                variant="flat"
              >
                {allowlist.status.charAt(0).toUpperCase() + allowlist.status.slice(1)}
              </Chip>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Entry Price</span>
              <span className="font-medium">
                {allowlist.entryPrice.amount === '0' 
                  ? 'Free' 
                  : `${allowlist.entryPrice.amount} ${allowlist.entryPrice.tokenType}`
                }
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Profit Guarantee</span>
              <span className="font-medium">
                {allowlist.profitGuaranteePercentage}%
              </span>
            </div>

            {allowlist.maxEntries && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Entry Limit</span>
                  <span className="font-medium">
                    {allowlist.totalEntries} / {allowlist.maxEntries}
                  </span>
                </div>
                <Progress
                  value={(allowlist.totalEntries / allowlist.maxEntries) * 100}
                  color={allowlist.totalEntries >= allowlist.maxEntries ? 'success' : 'primary'}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Created</span>
              <span className="font-medium">
                {new Date(allowlist.createdAt).toLocaleDateString()}
              </span>
            </div>

            {allowlist.endTime && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {allowlist.status === 'active' ? 'Ends' : 'Ended'}
                </span>
                <span className="font-medium">
                  {new Date(allowlist.endTime).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Entry Distribution */}
      {Object.keys(statistics.entryDistribution).length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Entry Distribution</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {Object.entries(statistics.entryDistribution).map(([tokenType, data]) => (
                <div key={tokenType} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Chip size="sm" variant="flat">{tokenType}</Chip>
                    <span className="text-gray-600">{data.count} entries</span>
                  </div>
                  <span className="font-medium">
                    {data.totalAmount} {tokenType}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );

  const renderTasksTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Social Task Performance</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {Object.entries(statistics.socialTaskStats).map(([taskType, stats]) => (
              <div key={taskType}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium capitalize">
                      {taskType.replace('_', ' ')}
                    </span>
                    <Chip size="sm" variant="flat">
                      {stats.totalTasks} task{stats.totalTasks !== 1 ? 's' : ''}
                    </Chip>
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.round(stats.completionRate)}% completion
                  </span>
                </div>
                <Progress
                  value={stats.completionRate}
                  color={stats.completionRate >= 80 ? 'success' : stats.completionRate >= 50 ? 'warning' : 'danger'}
                />
                <div className="flex items-center justify-between mt-1 text-sm text-gray-600">
                  <span>{stats.completedTasks} completed</span>
                  <span>{stats.totalTasks - stats.completedTasks} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Individual Task Completion Rates */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Individual Task Analysis</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {taskCompletionRates.map((task, index) => (
              <div key={task.taskId} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Task {index + 1}</span>
                    <Chip size="sm" variant="flat" color="primary">
                      {task.taskType.replace('_', ' ')}
                    </Chip>
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.round(task.completionRate)}% completed
                  </span>
                </div>
                <Progress
                  value={task.completionRate}
                  color={task.completionRate >= 80 ? 'success' : task.completionRate >= 50 ? 'warning' : 'danger'}
                  className="mb-2"
                />
                <div className="text-sm text-gray-600">
                  Average completion time: {Math.round(task.averageTime / 60)} minutes
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderParticipantsTab = () => (
    <div className="space-y-6">
      {/* Participation Trends */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Participation Timeline</h3>
        </CardHeader>
        <CardBody>
          {participationTrends.length > 0 ? (
            <div className="space-y-3">
              {participationTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">
                    {new Date(trend.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">
                      <span className="font-medium text-blue-600">{trend.participants}</span> joined
                    </span>
                    <span className="text-sm">
                      <span className="font-medium text-green-600">{trend.completions}</span> completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No participation data available</p>
          )}
        </CardBody>
      </Card>

      {/* Time to Completion Stats */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Completion Time Analysis</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(statistics.timeToCompletion.average / 60)}m
              </p>
              <p className="text-sm text-gray-600">Average</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(statistics.timeToCompletion.median / 60)}m
              </p>
              <p className="text-sm text-gray-600">Median</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(statistics.timeToCompletion.fastest / 60)}m
              </p>
              <p className="text-sm text-gray-600">Fastest</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {Math.round(statistics.timeToCompletion.slowest / 60)}m
              </p>
              <p className="text-sm text-gray-600">Slowest</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderWinnersTab = () => {
    if (allowlist.status !== 'completed' || !winnerData) {
      return (
        <div className="text-center py-12">
          <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {allowlist.status === 'active' ? 'Allowlist Still Active' : 'No Winners Yet'}
          </h3>
          <p className="text-gray-600">
            {allowlist.status === 'active' 
              ? 'Winners will be selected when the allowlist ends.'
              : 'Winner selection has not been completed yet.'
            }
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Winner Export Interface */}
        <WinnerExportInterface
          allowlistId={allowlistId}
          allowlist={allowlist}
        />

        {/* Winners List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <h3 className="text-lg font-semibold">Winners List</h3>
              <Chip color="success" variant="flat">
                {winnerData.winners.length} Winner{winnerData.winners.length !== 1 ? 's' : ''}
              </Chip>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {winnerData.winners.map((winner, index) => (
                <div key={winner._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-yellow-700">
                        #{winner.winnerPosition}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {winner.walletAddress.slice(0, 6)}...{winner.walletAddress.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Selected {new Date(winner.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Chip
                      size="sm"
                      color={
                        winner.claimStatus === 'claimed' ? 'success' :
                        winner.claimStatus === 'expired' ? 'danger' : 'warning'
                      }
                      variant="flat"
                    >
                      {winner.claimStatus.charAt(0).toUpperCase() + winner.claimStatus.slice(1)}
                    </Chip>
                    {winner.claimedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Claimed {new Date(winner.claimedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Payout Summary */}
        {allowlist.payoutSummary && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Payout Summary</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Refunds</span>
                  <span className="font-medium">
                    {allowlist.payoutSummary.totalRefunds.amount} {allowlist.payoutSummary.totalRefunds.tokenType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profit Guarantee</span>
                  <span className="font-medium">
                    {allowlist.payoutSummary.totalProfitGuarantee.amount} {allowlist.payoutSummary.totalProfitGuarantee.tokenType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Creator Profit</span>
                  <span className="font-medium text-green-600">
                    {allowlist.payoutSummary.creatorProfit.amount} {allowlist.payoutSummary.creatorProfit.tokenType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">
                    {allowlist.payoutSummary.platformFee.amount} {allowlist.payoutSummary.platformFee.tokenType}
                  </span>
                </div>
                {allowlist.profitGuaranteePercentage > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Profit per Loser</span>
                    <span className="font-medium">
                      {allowlist.payoutSummary.profitPerLoser.amount} {allowlist.payoutSummary.profitPerLoser.tokenType}
                    </span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{allowlist.title}</h2>
              <p className="text-gray-600">Allowlist Analytics</p>
            </div>
            <Chip
              color={allowlist.status === 'active' ? 'success' : allowlist.status === 'completed' ? 'primary' : 'danger'}
              variant="flat"
            >
              {allowlist.status.charAt(0).toUpperCase() + allowlist.status.slice(1)}
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
            <Tab key="tasks" title="Social Tasks">
              {renderTasksTab()}
            </Tab>
            <Tab key="participants" title="Participants">
              {renderParticipantsTab()}
            </Tab>
            <Tab key="winners" title="Winners">
              {renderWinnersTab()}
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default AllowlistAnalytics;