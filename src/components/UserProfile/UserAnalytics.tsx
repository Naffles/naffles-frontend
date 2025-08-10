'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Select,
  SelectItem,
  Spinner
} from '@nextui-org/react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { UserProfile } from '@/hooks/useUserProfile';

interface UserAnalyticsProps {
  profile: UserProfile;
}

interface AnalyticsData {
  timeRange: string;
  startDate: string;
  endDate: string;
  raffleActivity: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  gameActivity: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  pointsActivity: any[];
  stakingActivity: any[];
}

export function UserAnalytics({ profile }: UserAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async (range: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/profile/analytics?timeRange=${range}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeRange);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5" />
          Analytics Dashboard
        </h3>
        <Select
          size="sm"
          selectedKeys={[timeRange]}
          onSelectionChange={(keys) => setTimeRange(Array.from(keys)[0] as string)}
          className="w-32"
        >
          <SelectItem key="7d">7 Days</SelectItem>
          <SelectItem key="30d">30 Days</SelectItem>
          <SelectItem key="90d">90 Days</SelectItem>
          <SelectItem key="1y">1 Year</SelectItem>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardBody className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {formatNumber(profile.activitySummary.totalRafflesEntered)}
                  </p>
                  <p className="text-sm text-default-500">Total Raffles</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    {formatNumber(profile.activitySummary.totalGamesPlayed)}
                  </p>
                  <p className="text-sm text-default-500">Games Played</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">
                    {formatNumber(profile.activitySummary.totalPointsEarned)}
                  </p>
                  <p className="text-sm text-default-500">Points Earned</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">
                    {formatNumber(profile.activitySummary.totalAchievements)}
                  </p>
                  <p className="text-sm text-default-500">Achievements</p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Activity Charts */}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Raffle Activity */}
              <Card>
                <CardHeader>
                  <h4 className="font-semibold">Raffle Activity</h4>
                </CardHeader>
                <CardBody>
                  {analytics.raffleActivity.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.raffleActivity.map((activity) => (
                        <div key={activity._id} className="flex justify-between items-center">
                          <span className="text-sm">{formatDate(activity._id)}</span>
                          <div className="text-right">
                            <p className="font-medium">{activity.count} entries</p>
                            <p className="text-sm text-default-500">
                              ${activity.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-default-500">
                      No raffle activity in this period
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Game Activity */}
              <Card>
                <CardHeader>
                  <h4 className="font-semibold">Gaming Activity</h4>
                </CardHeader>
                <CardBody>
                  {analytics.gameActivity.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.gameActivity.map((activity) => (
                        <div key={activity._id} className="flex justify-between items-center">
                          <span className="text-sm">{formatDate(activity._id)}</span>
                          <div className="text-right">
                            <p className="font-medium">{activity.count} games</p>
                            <p className="text-sm text-default-500">
                              ${activity.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-default-500">
                      No gaming activity in this period
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          )}

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <h4 className="font-semibold">Performance Metrics</h4>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-lg font-semibold text-success">
                    {profile.activitySummary.totalRafflesCreated > 0 
                      ? ((profile.activitySummary.totalRafflesCreated / profile.activitySummary.totalRafflesEntered) * 100).toFixed(1)
                      : 0}%
                  </p>
                  <p className="text-sm text-default-500">Creation Rate</p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-semibold text-primary">
                    {profile.pointsBalance > 0 
                      ? (profile.activitySummary.totalPointsEarned / profile.pointsBalance * 100).toFixed(1)
                      : 0}%
                  </p>
                  <p className="text-sm text-default-500">Points Efficiency</p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-semibold text-warning">
                    {profile.activitySummary.totalStakingRewards}
                  </p>
                  <p className="text-sm text-default-500">Staking Rewards</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}