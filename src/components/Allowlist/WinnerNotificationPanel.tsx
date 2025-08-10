'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Chip, Button, Divider } from '@nextui-org/react';
import { TrophyIcon, ClockIcon, CheckCircleIcon, BellIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import { colors, spacing } from '../../styles/design-system/tokens';
import { AllowlistWinner } from './types';

interface WinnerNotificationPanelProps {
  className?: string;
}

/**
 * WinnerNotificationPanel Component
 * 
 * Display panel for winner notifications and claim actions.
 * Shows pending winner claims and provides quick claim functionality.
 */
const WinnerNotificationPanel: React.FC<WinnerNotificationPanelProps> = ({
  className = ''
}) => {
  const [pendingWins, setPendingWins] = useState<AllowlistWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingWins();
    
    // Set up periodic refresh for pending wins
    const interval = setInterval(loadPendingWins, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPendingWins = async () => {
    try {
      const response = await fetch('/api/allowlists/user/pending-wins');
      if (response.ok) {
        const data = await response.json();
        setPendingWins(data.data.wins || []);
      } else {
        setPendingWins([]);
      }
    } catch (error) {
      console.error('Error loading pending wins:', error);
      setPendingWins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimWin = async (allowlistId: string) => {
    try {
      const response = await fetch(`/api/allowlists/${allowlistId}/claim`, {
        method: 'POST'
      });

      if (response.ok) {
        // Refresh pending wins after successful claim
        loadPendingWins();
      } else {
        const error = await response.json();
        console.error('Failed to claim win:', error.message);
      }
    } catch (error) {
      console.error('Error claiming win:', error);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const timeLeft = expiry.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isExpiringSoon = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const timeLeft = expiry.getTime() - now.getTime();
    const hoursLeft = timeLeft / (1000 * 60 * 60);
    
    return hoursLeft <= 24; // Expiring within 24 hours
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <Card>
          <CardBody className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (pendingWins.length === 0) {
    return null; // Don't show the panel if there are no pending wins
  }

  return (
    <div className={className}>
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900">
                🎉 Congratulations! You Won!
              </h3>
              <p className="text-sm text-yellow-700">
                You have {pendingWins.length} pending winner claim{pendingWins.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-2">
          <div className="space-y-3">
            {pendingWins.map((win) => {
              const timeRemaining = getTimeRemaining(win.claimExpiresAt);
              const expiringSoon = isExpiringSoon(win.claimExpiresAt);
              
              return (
                <div key={win._id} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {(win as any).allowlistId?.title || 'Allowlist Winner'}
                        </h4>
                        <Chip size="sm" color="warning" variant="flat">
                          Winner #{win.winnerPosition}
                        </Chip>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>
                            Claim expires in: 
                            <span className={`ml-1 font-medium ${
                              expiringSoon ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {timeRemaining}
                            </span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <BellIcon className="w-4 h-4" />
                          <span>Selected {new Date(win.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {expiringSoon && timeRemaining !== 'Expired' && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          ⚠️ Claim expires soon! Don't miss out on your win.
                        </div>
                      )}

                      {timeRemaining === 'Expired' && (
                        <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                          ❌ Claim period has expired
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex-shrink-0">
                      {timeRemaining !== 'Expired' ? (
                        <AccessibleButton
                          size="sm"
                          color="primary"
                          onPress={() => handleClaimWin((win as any).allowlistId?._id || win.allowlistId)}
                          startContent={<CheckCircleIcon className="w-4 h-4" />}
                        >
                          Claim Now
                        </AccessibleButton>
                      ) : (
                        <Chip size="sm" color="danger" variant="flat">
                          Expired
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Divider className="my-4" />

          <div className="flex items-center justify-between text-sm">
            <div className="text-yellow-700">
              <p className="font-medium">Important:</p>
              <p>Claims must be made within the specified time limit to secure your winner status.</p>
            </div>
            
            <Button
              size="sm"
              variant="flat"
              onPress={loadPendingWins}
            >
              Refresh
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default WinnerNotificationPanel;