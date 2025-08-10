'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Button, Chip, Progress, Tabs, Tab } from '@nextui-org/react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Settings, 
  BarChart3, 
  Calendar,
  Star,
  Target,
  DollarSign,
  Activity
} from 'lucide-react';

interface CommunityStats {
  totalMembers: number;
  activeMembers: number;
  totalPoints: number;
  pointsDistributed: number;
  tasksCompleted: number;
  achievementsEarned: number;
  marketplaceSales: number;
  allowlistsCreated: number;
}

interface CommunityData {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  pointsConfiguration: {
    pointsName: string;
    pointsSymbol: string;
  };
  stats: CommunityStats;
  recentActivity: Array<{
    id: string;
    type: 'member_joined' | 'task_completed' | 'achievement_earned' | 'marketplace_purchase';
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

interface CommunityDashboardProps {
  communityId: string;
  onNavigateToSettings: () => void;
  onNavigateToMembers: () => void;
  onNavigateToTasks: () => void;
  onNavigateToMarketplace: () => void;
  onNavigateToAnalytics: () => void;
}

const CommunityDashboard: React.FC<CommunityDashboardProps> = ({
  communityId,
  onNavigateToSettings,
  onNavigateToMembers,
  onNavigateToTasks,
  onNavigateToMarketplace,
  onNavigateToAnalytics
}) => {
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchCommunityData();
  }, [communityId]);

  const fetchCommunityData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockData: CommunityData = {
        id: communityId,
        name: 'Crypto Enthusiasts',
        description: 'A community for cryptocurrency enthusiasts and traders',
        slug: 'crypto-enthusiasts',
        createdAt: '2024-01-15T00:00:00Z',
        pointsConfiguration: {
          pointsName: 'Crypto Points',
          pointsSymbol: 'CP'
        },
        stats: {
          totalMembers: 1247,
          activeMembers: 892,
          totalPoints: 125000,
          pointsDistributed: 89500,
          tasksCompleted: 3421,
          achievementsEarned: 567,
          marketplaceSales: 89,
          allowlistsCreated: 12
        },
        recentActivity: [
          {
            id: '1',
            type: 'member_joined',
            description: 'New member joined the community',
            timestamp: '2024-01-20T10:30:00Z',
            user: 'CryptoTrader123'
          },
          {
            id: '2',
            type: 'task_completed',
            description: 'Twitter follow task completed',
            timestamp: '2024-01-20T09:15:00Z',
            user: 'BlockchainFan'
          },
          {
            id: '3',
            type: 'achievement_earned',
            description: 'First Purchase achievement earned',
            timestamp: '2024-01-20T08:45:00Z',
            user: 'NFTCollector'
          }
        ]
      };
      
      setCommunity(mockData);
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'member_joined':
        return <Users className="w-4 h-4" />;
      case 'task_completed':
        return <Target className="w-4 h-4" />;
      case 'achievement_earned':
        return <Award className="w-4 h-4" />;
      case 'marketplace_purchase':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'member_joined':
        return 'success';
      case 'task_completed':
        return 'primary';
      case 'achievement_earned':
        return 'warning';
      case 'marketplace_purchase':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (isLoading || !community) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(community.stats.totalMembers)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                {community.stats.activeMembers} active this month
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{community.pointsConfiguration.pointsName}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(community.stats.pointsDistributed)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress 
                value={(community.stats.pointsDistributed / community.stats.totalPoints) * 100}
                className="max-w-md"
                size="sm"
                color="success"
              />
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(community.stats.tasksCompleted)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                +12% from last month
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(community.stats.achievementsEarned)}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                {community.stats.marketplaceSales} marketplace sales
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="bordered"
              startContent={<Users className="w-4 h-4" />}
              onClick={onNavigateToMembers}
              className="h-auto py-4 flex-col"
            >
              <span className="mt-1">Manage Members</span>
            </Button>
            
            <Button
              variant="bordered"
              startContent={<Target className="w-4 h-4" />}
              onClick={onNavigateToTasks}
              className="h-auto py-4 flex-col"
            >
              <span className="mt-1">Social Tasks</span>
            </Button>
            
            <Button
              variant="bordered"
              startContent={<DollarSign className="w-4 h-4" />}
              onClick={onNavigateToMarketplace}
              className="h-auto py-4 flex-col"
            >
              <span className="mt-1">Marketplace</span>
            </Button>
            
            <Button
              variant="bordered"
              startContent={<Settings className="w-4 h-4" />}
              onClick={onNavigateToSettings}
              className="h-auto py-4 flex-col"
            >
              <span className="mt-1">Settings</span>
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {community.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full bg-${getActivityColor(activity.type)}-100`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  {activity.user && (
                    <p className="text-xs text-gray-500">
                      by {activity.user}
                    </p>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="light" size="sm">
              View All Activity
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Community Growth</h3>
        </CardHeader>
        <CardBody>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Analytics charts coming soon</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Member Engagement</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily Active Users</span>
                <span className="font-semibold">{Math.round(community.stats.activeMembers * 0.3)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Weekly Active Users</span>
                <span className="font-semibold">{Math.round(community.stats.activeMembers * 0.7)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Active Users</span>
                <span className="font-semibold">{community.stats.activeMembers}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Points Distribution</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Pool</span>
                <span className="font-semibold">{formatNumber(community.stats.totalPoints)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Distributed</span>
                <span className="font-semibold">{formatNumber(community.stats.pointsDistributed)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining</span>
                <span className="font-semibold">
                  {formatNumber(community.stats.totalPoints - community.stats.pointsDistributed)}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
            <p className="text-gray-600 mt-1">{community.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Chip color="success" variant="flat">
              Active
            </Chip>
            <Button
              color="primary"
              startContent={<BarChart3 className="w-4 h-4" />}
              onClick={onNavigateToAnalytics}
            >
              View Analytics
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>Community ID: {community.slug}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="mb-6"
      >
        <Tab key="overview" title="Overview">
          {renderOverview()}
        </Tab>
        <Tab key="analytics" title="Analytics">
          {renderAnalytics()}
        </Tab>
      </Tabs>
    </div>
  );
};

export default CommunityDashboard;