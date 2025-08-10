'use client';

import React from 'react';
import { Card, CardBody, CardHeader, Progress, Chip, Button, Divider } from '@nextui-org/react';
import { 
  TrophyIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  StarIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { UserProfile } from '@/hooks/useUserProfile';

interface UserProfileOverviewProps {
  profile: UserProfile;
  onRefresh: () => void;
}

export function UserProfileOverview({ profile, onRefresh }: UserProfileOverviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-default-500">Points Balance</p>
                <p className="text-xl font-semibold">{formatNumber(profile.pointsBalance)}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-default-500">Achievements</p>
                <p className="text-xl font-semibold">{profile.achievements?.length || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-default-500">Games Played</p>
                <p className="text-xl font-semibold">{formatNumber(profile.activitySummary.totalGamesPlayed)}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <StarIcon className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-default-500">Raffles Entered</p>
                <p className="text-xl font-semibold">{formatNumber(profile.activitySummary.totalRafflesEntered)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold">Account Information</h3>
          </CardHeader>
          <CardBody className="pt-0 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-default-500">Username</span>
              <span className="font-medium">{profile.username}</span>
            </div>
            
            {profile.email && (
              <div className="flex justify-between items-center">
                <span className="text-default-500">Email</span>
                <span className="font-medium">{profile.email}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-default-500">Tier</span>
              <Chip color="primary" variant="flat" size="sm">
                {profile.tier}
              </Chip>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-default-500">Status</span>
              <div className="flex gap-2">
                {profile.isVerified && (
                  <Chip color="success" variant="flat" size="sm">
                    Verified
                  </Chip>
                )}
                {profile.isBlocked && (
                  <Chip color="danger" variant="flat" size="sm">
                    Blocked
                  </Chip>
                )}
                {!profile.isVerified && !profile.isBlocked && (
                  <Chip color="default" variant="flat" size="sm">
                    Active
                  </Chip>
                )}
              </div>
            </div>
            
            <Divider />
            
            <div className="flex justify-between items-center">
              <span className="text-default-500">Member Since</span>
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(profile.createdAt)}</span>
              </div>
            </div>
            
            {profile.lastLoginAt && (
              <div className="flex justify-between items-center">
                <span className="text-default-500">Last Login</span>
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="w-4 h-4" />
                  <span>{formatDate(profile.lastLoginAt)}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-default-500">Login Count</span>
              <span className="font-medium">{formatNumber(profile.loginCount)}</span>
            </div>
          </CardBody>
        </Card>

        {/* Founders Key Benefits */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold">Founders Key Benefits</h3>
          </CardHeader>
          <CardBody className="pt-0 space-y-4">
            {profile.foundersKeys?.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-default-500">Keys Owned</span>
                  <Chip color="warning" variant="flat" size="sm">
                    {profile.foundersKeys.length} Key{profile.foundersKeys.length !== 1 ? 's' : ''}
                  </Chip>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-default-500">Fee Discount</span>
                  <span className="font-medium text-success">
                    {profile.foundersKeyBenefits.feeDiscount}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-default-500">Priority Access</span>
                  <Chip 
                    color={profile.foundersKeyBenefits.priorityAccess ? "success" : "default"} 
                    variant="flat" 
                    size="sm"
                  >
                    {profile.foundersKeyBenefits.priorityAccess ? "Yes" : "No"}
                  </Chip>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-default-500">Open Entry Tickets</span>
                  <span className="font-medium">
                    {formatNumber(profile.foundersKeyBenefits.openEntryTickets)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <TrophyIcon className="w-12 h-12 text-default-300 mx-auto mb-3" />
                <p className="text-default-500 mb-4">No Founders Keys owned</p>
                <Button color="primary" variant="flat" size="sm">
                  Learn About Founders Keys
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Activity Summary</h3>
            <Button color="primary" variant="flat" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-default-500">Raffles Created</span>
                <span className="text-sm font-medium">{formatNumber(profile.activitySummary.totalRafflesCreated)}</span>
              </div>
              <Progress 
                value={Math.min(profile.activitySummary.totalRafflesCreated, 100)} 
                maxValue={100}
                color="primary"
                size="sm"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-default-500">Points Earned</span>
                <span className="text-sm font-medium">{formatNumber(profile.activitySummary.totalPointsEarned)}</span>
              </div>
              <Progress 
                value={Math.min(profile.activitySummary.totalPointsEarned / 1000, 100)} 
                maxValue={100}
                color="success"
                size="sm"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-default-500">Staking Rewards</span>
                <span className="text-sm font-medium">{formatNumber(profile.activitySummary.totalStakingRewards)}</span>
              </div>
              <Progress 
                value={Math.min(profile.activitySummary.totalStakingRewards, 100)} 
                maxValue={100}
                color="warning"
                size="sm"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recent Transactions */}
      {profile.transactionHistory?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-3">
              {profile.transactionHistory.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{transaction.eventType}</p>
                    <p className="text-sm text-default-500">{transaction.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.amount}</p>
                    <p className="text-sm text-default-500">{formatDate(transaction.dateCreated)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {profile.transactionHistory.length > 5 && (
              <div className="text-center mt-4">
                <Button color="primary" variant="flat" size="sm">
                  View All Transactions
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}