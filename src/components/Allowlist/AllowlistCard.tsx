'use client';

import React from 'react';
import { Card, CardBody, CardFooter, CardHeader, Chip, Button, Progress, Avatar, Tooltip } from '@nextui-org/react';
import { ClockIcon, UserGroupIcon, CurrencyDollarIcon, TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import { colors, spacing } from '../../styles/design-system/tokens';
import { Allowlist, AllowlistCardProps } from './types';

/**
 * AllowlistCard Component
 * 
 * Display card for individual allowlists with key information,
 * participation status, and action buttons.
 */
const AllowlistCard: React.FC<AllowlistCardProps> = ({
  allowlist,
  showParticipationButton = false,
  showAnalytics = false,
  onParticipate,
  onViewAnalytics,
  className = ''
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getTimeRemaining = () => {
    if (allowlist.status !== 'active') return null;
    
    const endTime = new Date(allowlist.endTime);
    const now = new Date();
    const timeLeft = endTime.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Ended';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getProgressPercentage = () => {
    if (!allowlist.maxEntries) return 0;
    return Math.min((allowlist.totalEntries / allowlist.maxEntries) * 100, 100);
  };

  const formatTokenAmount = (amount: string, tokenType: string) => {
    const numAmount = parseFloat(amount);
    if (numAmount === 0) return 'Free';
    
    if (tokenType === 'points') {
      return `${numAmount} pts`;
    }
    
    return `${numAmount} ${tokenType}`;
  };

  const getWinnerCountDisplay = () => {
    if (allowlist.winnerCount === 'everyone') {
      return 'Everyone Wins';
    }
    return `${allowlist.winnerCount} Winner${allowlist.winnerCount !== 1 ? 's' : ''}`;
  };

  const timeRemaining = getTimeRemaining();
  const progressPercentage = getProgressPercentage();

  return (
    <Card 
      className={`hover:shadow-lg transition-shadow duration-200 ${className}`}
      isPressable={false}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-lg">
              {allowlist.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {allowlist.description}
            </p>
          </div>
          
          <div className="ml-3 flex-shrink-0">
            <Chip
              color={getStatusColor(allowlist.status)}
              variant="flat"
              size="sm"
            >
              {allowlist.status.charAt(0).toUpperCase() + allowlist.status.slice(1)}
            </Chip>
          </div>
        </div>
      </CardHeader>

      <CardBody className="py-4">
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Winners</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getWinnerCountDisplay()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Entry Price</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {formatTokenAmount(allowlist.entryPrice.amount, allowlist.entryPrice.tokenType)}
                </p>
              </div>
            </div>
          </div>

          {/* Participation Info */}
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Participants</p>
                <p className="text-xs text-gray-500">
                  {allowlist.totalEntries}
                  {allowlist.maxEntries && ` / ${allowlist.maxEntries}`}
                </p>
              </div>
              {allowlist.maxEntries && (
                <Progress
                  value={progressPercentage}
                  size="sm"
                  color={progressPercentage >= 90 ? 'danger' : progressPercentage >= 70 ? 'warning' : 'primary'}
                  className="mt-1"
                />
              )}
            </div>
          </div>

          {/* Time Remaining */}
          {allowlist.status === 'active' && timeRemaining && (
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Time Remaining</p>
                <p className="text-sm font-medium text-gray-900">
                  {timeRemaining}
                </p>
              </div>
            </div>
          )}

          {/* Social Tasks Preview */}
          {allowlist.socialTasks && allowlist.socialTasks.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-xs text-purple-600 font-medium">
                    {allowlist.socialTasks.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Social Tasks</p>
              </div>
              
              <div className="flex -space-x-1">
                {allowlist.socialTasks.slice(0, 3).map((task, index) => (
                  <Tooltip key={index} content={`${task.taskType.replace('_', ' ')}`}>
                    <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs">
                        {task.taskType === 'twitter_follow' && '🐦'}
                        {task.taskType === 'discord_join' && '💬'}
                        {task.taskType === 'telegram_join' && '📱'}
                        {task.taskType === 'custom' && '⭐'}
                      </span>
                    </div>
                  </Tooltip>
                ))}
                {allowlist.socialTasks.length > 3 && (
                  <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      +{allowlist.socialTasks.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profit Guarantee */}
          {allowlist.profitGuaranteePercentage > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">%</span>
                </div>
                <div>
                  <p className="text-xs text-green-700 font-medium">
                    {allowlist.profitGuaranteePercentage}% Profit Guarantee
                  </p>
                  <p className="text-xs text-green-600">
                    Losers receive profit share
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardBody>

      <CardFooter className="pt-2">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-gray-500">
            Created {new Date(allowlist.createdAt).toLocaleDateString()}
          </div>
          
          <div className="flex items-center space-x-2">
            {showAnalytics && onViewAnalytics && (
              <Button
                size="sm"
                variant="flat"
                onPress={() => onViewAnalytics(allowlist._id)}
                startContent={<ChartBarIcon className="w-4 h-4" />}
              >
                Analytics
              </Button>
            )}
            
            {showParticipationButton && onParticipate && allowlist.status === 'active' && (
              <AccessibleButton
                size="sm"
                color="primary"
                onPress={() => onParticipate(allowlist)}
                isDisabled={allowlist.maxEntries ? allowlist.totalEntries >= allowlist.maxEntries : false}
              >
                {allowlist.maxEntries && allowlist.totalEntries >= allowlist.maxEntries 
                  ? 'Full' 
                  : 'Join'
                }
              </AccessibleButton>
            )}
            
            {allowlist.status === 'completed' && (
              <Chip color="primary" variant="flat" size="sm">
                View Results
              </Chip>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AllowlistCard;