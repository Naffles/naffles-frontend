'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Chip, Button, Divider, Progress, Spinner } from '@nextui-org/react';
import { TrophyIcon, UserGroupIcon, CurrencyDollarIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import WinnerExportInterface from './WinnerExportInterface';
import { colors, spacing } from '../../styles/design-system/tokens';
import { Allowlist, AllowlistWinner, AllowlistStatistics } from './types';

interface AllowlistResultsProps {
  allowlistId: string;
  allowlist?: Allowlist;
  showExportInterface?: boolean;
  className?: string;
}

/**
 * AllowlistResults Component
 * 
 * Display allowlist results including winners, statistics, and payout information.
 * Shows different views for creators vs participants.
 */
const AllowlistResults: React.FC<AllowlistResultsProps> = ({
  allowlistId,
  allowlist: initialAllowlist,
  showExportInterface = false,
  className = ''
}) => {
  const [allowlist, setAllowlist] = useState<Allowlist | null>(initialAllowlist || null);
  const [winners, setWinners] = useState<AllowlistWinner[]>([]);
  const [statistics, setStatistics] = useState<AllowlistStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [userParticipation, setUserParticipation] = useState<any>(null);

  useEffect(() => {
    loadResults();
    loadUserParticipation();
  }, [allowlistId]);

  const loadResults = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/allowlists/${allowlistId}/results`);
      if (response.ok) {
        const data = await response.json();
        setAllowlist(data.data.allowlist);
        setWinners(data.data.winners);
        setStatistics(data.data.statistics);
      } else {
        console.error('Failed to load allowlist results');
      }
    } catch (error) {
      console.error('Error loading allowlist results:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserParticipation = async () => {
    try {
      const response = await fetch(`/api/allowlists/${allowlistId}/participation`);
      if (response.ok) {
        const data = await response.json();
        setUserParticipation(data.data);
      }
    } catch (error) {
      // User didn't participate
      setUserParticipation(null);
    }
  };

  const isUserWinner = () => {
    if (!userParticipation) return false;
    return winners.some(winner => winner.userId === userParticipation.userId);
  };

  const getUserWinnerData = () => {
    if (!userParticipation) return null;
    return winners.find(winner => winner.userId === userParticipation.userId);
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

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!allowlist || allowlist.status !== 'completed') {
    return (
      <div className={`text-center py-12 ${className}`}>
        <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Results Not Available
        </h3>
        <p className="text-gray-600">
          This allowlist has not been completed yet or results are not available.
        </p>
      </div>
    );
  }

  const userWinner = getUserWinnerData();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* User Participation Status */}
      {userParticipation && (
        <Card className={isUserWinner() ? 'bg-green-50 border-green-200' : 'bg-gray-50'}>
          <CardBody className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isUserWinner() ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                {isUserWinner() ? (
                  <TrophyIcon className="w-6 h-6 text-white" />
                ) : (
                  <UserGroupIcon className="w-6 h-6 text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  isUserWinner() ? 'text-green-900' : 'text-gray-900'
                }`}>
                  {isUserWinner() ? 'Congratulations! You Won!' : 'Thanks for Participating'}
                </h3>
                
                {isUserWinner() && userWinner ? (
                  <div className="space-y-2 mt-2">
                    <p className="text-green-700">
                      You were selected as winner #{userWinner.winnerPosition}
                    </p>
                    <div className="flex items-center space-x-4">
                      <Chip
                        color={getClaimStatusColor(userWinner.claimStatus)}
                        variant="flat"
                        startContent={getClaimStatusIcon(userWinner.claimStatus)}
                      >
                        {userWinner.claimStatus.charAt(0).toUpperCase() + userWinner.claimStatus.slice(1)}
                      </Chip>
                      
                      {userWinner.claimStatus === 'pending' && (
                        <AccessibleButton
                          size="sm"
                          color="primary"
                          onPress={() => {
                            // Handle claim action
                            window.location.href = `/allowlists/${allowlistId}/claim`;
                          }}
                        >
                          Claim Winner Status
                        </AccessibleButton>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-gray-700">
                      You participated but were not selected as a winner.
                    </p>
                    {allowlist.profitGuaranteePercentage > 0 && allowlist.payoutSummary && (
                      <p className="text-green-600 text-sm mt-1">
                        You received {allowlist.payoutSummary.profitPerLoser.amount} {allowlist.payoutSummary.profitPerLoser.tokenType} profit guarantee
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Allowlist Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{allowlist.title}</h2>
              <p className="text-gray-600">Allowlist Results</p>
            </div>
            <Chip color="primary" variant="flat">
              Completed
            </Chip>
          </div>
        </CardHeader>
        
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{statistics?.totalParticipants || 0}</p>
                <p className="text-sm text-gray-600">Total Participants</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{winners.length}</p>
                <p className="text-sm text-gray-600">Winners Selected</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {allowlist.entryPrice.amount === '0' ? 'Free' : allowlist.entryPrice.amount}
                </p>
                <p className="text-sm text-gray-600">
                  Entry Price {allowlist.entryPrice.amount !== '0' && `(${allowlist.entryPrice.tokenType})`}
                </p>
              </div>
            </div>
          </div>

          {allowlist.completedAt && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Completed on {new Date(allowlist.completedAt).toLocaleDateString()}</span>
                <span>
                  Winner selection: {allowlist.winnerSelectionMethod === 'vrf' ? 'Chainlink VRF' : 'Failsafe'}
                </span>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Winners List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold">Winners</h3>
            <Chip color="success" variant="flat">
              {winners.length} Winner{winners.length !== 1 ? 's' : ''}
            </Chip>
          </div>
        </CardHeader>
        
        <CardBody>
          {winners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No winners have been selected yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {winners.map((winner, index) => (
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
                      color={getClaimStatusColor(winner.claimStatus)}
                      variant="flat"
                      startContent={getClaimStatusIcon(winner.claimStatus)}
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
          )}
        </CardBody>
      </Card>

      {/* Payout Summary */}
      {allowlist.payoutSummary && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Payout Summary</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-3">
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
                </div>
              </div>

              {allowlist.profitGuaranteePercentage > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">%</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          {allowlist.profitGuaranteePercentage}% Profit Guarantee Applied
                        </p>
                        <p className="text-sm text-green-700">
                          Each losing participant received {allowlist.payoutSummary.profitPerLoser.amount} {allowlist.payoutSummary.profitPerLoser.tokenType}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Export Interface for Creators */}
      {showExportInterface && (
        <WinnerExportInterface
          allowlistId={allowlistId}
          allowlist={allowlist}
        />
      )}
    </div>
  );
};

export default AllowlistResults;