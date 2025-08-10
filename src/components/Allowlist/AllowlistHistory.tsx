'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Chip, Button, Pagination, Spinner, Tabs, Tab } from '@nextui-org/react';
import { TrophyIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { colors, spacing } from '../../styles/design-system/tokens';
import { AllowlistParticipation, AllowlistWinner } from './types';

interface AllowlistHistoryProps {
  userId?: string;
  className?: string;
}

/**
 * AllowlistHistory Component
 * 
 * Display user's allowlist participation history including
 * entries, wins, and claim status.
 */
const AllowlistHistory: React.FC<AllowlistHistoryProps> = ({
  userId,
  className = ''
}) => {
  const [participations, setParticipations] = useState<AllowlistParticipation[]>([]);
  const [wins, setWins] = useState<AllowlistWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadHistory();
  }, [selectedTab, currentPage]);

  const loadHistory = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: selectedTab === 'all' ? 'all' : selectedTab
      });

      const response = await fetch(`/api/allowlists/user/history?${params}`);
      if (response.ok) {
        const data = await response.json();
        setParticipations(data.data.participations);
        setTotalPages(data.data.pagination.pages);
        
        // Load wins separately
        if (selectedTab === 'all' || selectedTab === 'won') {
          loadWins();
        }
      } else {
        console.error('Failed to load allowlist history');
      }
    } catch (error) {
      console.error('Error loading allowlist history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWins = async () => {
    try {
      const response = await fetch('/api/allowlists/user/wins');
      if (response.ok) {
        const data = await response.json();
        setWins(data.data.wins || []);
      }
    } catch (error) {
      console.error('Error loading wins:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'claimed':
        return 'success';
      case 'expired':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getClaimStatusIcon = (status: string) => {
    switch (status) {
      case 'claimed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'expired':
        return <XCircleIcon className="w-4 h-4" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const isWinner = (allowlistId: string) => {
    return wins.some(win => win.allowlistId === allowlistId);
  };

  const getWinData = (allowlistId: string) => {
    return wins.find(win => win.allowlistId === allowlistId);
  };

  const renderParticipationCard = (participation: AllowlistParticipation) => {
    const winner = isWinner(participation.allowlistId);
    const winData = getWinData(participation.allowlistId);

    return (
      <Card key={participation._id} className={winner ? 'bg-green-50 border-green-200' : ''}>
        <CardBody className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-gray-900 truncate">
                  {(participation as any).allowlistId?.title || 'Allowlist'}
                </h4>
                {winner && (
                  <Chip color="success" variant="flat" size="sm">
                    Winner
                  </Chip>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Entry Date:</span>
                  <span>{new Date(participation.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Entry Price:</span>
                  <span>
                    {participation.entryPrice.amount === '0' 
                      ? 'Free' 
                      : `${participation.entryPrice.amount} ${participation.entryPrice.tokenType}`
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Tasks Completed:</span>
                  <span>
                    {participation.socialTasksCompleted.filter(t => t.completed).length} / {participation.socialTasksCompleted.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Chip
                    size="sm"
                    color={getStatusColor((participation as any).allowlistId?.status || 'unknown')}
                    variant="flat"
                  >
                    {(participation as any).allowlistId?.status || 'Unknown'}
                  </Chip>
                </div>

                {winner && winData && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Winner Position:</span>
                      <span className="font-medium text-green-600">#{winData.winnerPosition}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Claim Status:</span>
                      <Chip
                        size="sm"
                        color={getClaimStatusColor(winData.claimStatus)}
                        variant="flat"
                        startContent={getClaimStatusIcon(winData.claimStatus)}
                      >
                        {winData.claimStatus.charAt(0).toUpperCase() + winData.claimStatus.slice(1)}
                      </Chip>
                    </div>

                    {winData.claimedAt && (
                      <div className="flex items-center justify-between">
                        <span>Claimed:</span>
                        <span>{new Date(winData.claimedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="ml-4 flex-shrink-0">
              {winner ? (
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {winner && winData && winData.claimStatus === 'pending' && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <Button
                size="sm"
                color="primary"
                onPress={() => {
                  window.location.href = `/allowlists/${participation.allowlistId}/claim`;
                }}
              >
                Claim Winner Status
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {selectedTab === 'won' ? 'No Wins Yet' : 'No Allowlist History'}
      </h3>
      <p className="text-gray-600">
        {selectedTab === 'won' 
          ? "You haven't won any allowlists yet. Keep participating!"
          : "You haven't participated in any allowlists yet."
        }
      </p>
    </div>
  );

  const renderStats = () => {
    const totalParticipations = participations.length;
    const totalWins = wins.length;
    const winRate = totalParticipations > 0 ? (totalWins / totalParticipations) * 100 : 0;
    const claimedWins = wins.filter(w => w.claimStatus === 'claimed').length;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{totalParticipations}</p>
            <p className="text-sm text-gray-600">Total Entries</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{totalWins}</p>
            <p className="text-sm text-gray-600">Wins</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{Math.round(winRate)}%</p>
            <p className="text-sm text-gray-600">Win Rate</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{claimedWins}</p>
            <p className="text-sm text-gray-600">Claimed</p>
          </CardBody>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Allowlist History</h2>
            <p className="text-gray-600">Your participation history and wins</p>
          </div>
        </CardHeader>

        <CardBody>
          {renderStats()}

          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => {
              setSelectedTab(key as string);
              setCurrentPage(1);
            }}
            className="w-full mb-6"
          >
            <Tab key="all" title="All Entries">
              <div className="space-y-4">
                {participations.length === 0 ? (
                  renderEmptyState()
                ) : (
                  participations.map(renderParticipationCard)
                )}
              </div>
            </Tab>

            <Tab key="won" title="Wins">
              <div className="space-y-4">
                {wins.length === 0 ? (
                  renderEmptyState()
                ) : (
                  participations
                    .filter(p => isWinner(p.allowlistId))
                    .map(renderParticipationCard)
                )}
              </div>
            </Tab>

            <Tab key="active" title="Active">
              <div className="space-y-4">
                {participations
                  .filter(p => (p as any).allowlistId?.status === 'active')
                  .length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No active allowlist entries</p>
                  </div>
                ) : (
                  participations
                    .filter(p => (p as any).allowlistId?.status === 'active')
                    .map(renderParticipationCard)
                )}
              </div>
            </Tab>
          </Tabs>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
                showShadow
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AllowlistHistory;