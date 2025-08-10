'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Chip } from '@nextui-org/react';
import { 
  Plus, 
  Users, 
  Settings, 
  BarChart3,
  Target,
  ShoppingCart,
  Star,
  Crown
} from 'lucide-react';
import {
  CommunityCreationForm,
  CommunityDashboard,
  CommunityMemberManagement,
  SocialTaskManagement,
  CommunityMarketplace,
  CommunityPointsManagement,
  type CommunityData
} from '@/components/CommunityManagement';

interface UserCommunity {
  id: string;
  name: string;
  description: string;
  slug: string;
  role: 'creator' | 'admin' | 'moderator';
  memberCount: number;
  pointsName: string;
  pointsSymbol: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const CommunityManagementPage: React.FC = () => {
  const router = useRouter();
  const [userCommunities, setUserCommunities] = useState<UserCommunity[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'dashboard' | 'members' | 'tasks' | 'marketplace' | 'points' | 'settings'>('list');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserCommunities();
  }, []);

  const fetchUserCommunities = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockCommunities: UserCommunity[] = [
        {
          id: '1',
          name: 'Crypto Enthusiasts',
          description: 'A community for cryptocurrency enthusiasts and traders',
          slug: 'crypto-enthusiasts',
          role: 'creator',
          memberCount: 1247,
          pointsName: 'Crypto Points',
          pointsSymbol: 'CP',
          status: 'active',
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'NFT Collectors Hub',
          description: 'Connect with fellow NFT collectors and discover new projects',
          slug: 'nft-collectors-hub',
          role: 'admin',
          memberCount: 892,
          pointsName: 'Collector Points',
          pointsSymbol: 'COL',
          status: 'active',
          createdAt: '2024-01-10T00:00:00Z'
        },
        {
          id: '3',
          name: 'DeFi Traders',
          description: 'Share strategies and insights about decentralized finance',
          slug: 'defi-traders',
          role: 'moderator',
          memberCount: 456,
          pointsName: 'DeFi Points',
          pointsSymbol: 'DFP',
          status: 'active',
          createdAt: '2024-01-08T00:00:00Z'
        }
      ];
      
      setUserCommunities(mockCommunities);
    } catch (error) {
      console.error('Error fetching user communities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCommunity = async (communityData: any) => {
    try {
      // TODO: API call to create community
      console.log('Creating community:', communityData);
      
      const newCommunity: UserCommunity = {
        id: Date.now().toString(),
        name: communityData.name,
        description: communityData.description,
        slug: communityData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        role: 'creator',
        memberCount: 1,
        pointsName: communityData.pointsConfiguration.pointsName,
        pointsSymbol: communityData.pointsConfiguration.pointsSymbol,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      setUserCommunities(prev => [newCommunity, ...prev]);
      setCurrentView('list');
    } catch (error) {
      console.error('Error creating community:', error);
      throw error;
    }
  };

  const handleSelectCommunity = (communityId: string, view: string = 'dashboard') => {
    setSelectedCommunity(communityId);
    setCurrentView(view as any);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'creator':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <Settings className="w-4 h-4" />;
      case 'moderator':
        return <Users className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'creator':
        return 'warning';
      case 'admin':
        return 'primary';
      case 'moderator':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const selectedCommunityData = userCommunities.find(c => c.id === selectedCommunity);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Community List View
  if (currentView === 'list') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Communities</h1>
            <p className="text-gray-600 mt-1">
              Manage your communities and engage with your members
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={() => setCurrentView('create')}
          >
            Create Community
          </Button>
        </div>

        {userCommunities.length === 0 ? (
          <Card className="p-12 text-center">
            <CardBody>
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Communities Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first community to start building and engaging with your audience
              </p>
              <Button
                color="primary"
                startContent={<Plus className="w-4 h-4" />}
                onPress={() => setCurrentView('create')}
              >
                Create Your First Community
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {community.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {community.description}
                      </p>
                    </div>
                    <Chip
                      startContent={getRoleIcon(community.role)}
                      color={getRoleColor(community.role)}
                      variant="flat"
                      size="sm"
                    >
                      {community.role.charAt(0).toUpperCase() + community.role.slice(1)}
                    </Chip>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {community.memberCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {community.pointsSymbol}
                      </span>
                    </div>
                    <Chip
                      color={community.status === 'active' ? 'success' : 'default'}
                      variant="flat"
                      size="sm"
                    >
                      {community.status.charAt(0).toUpperCase() + community.status.slice(1)}
                    </Chip>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="bordered"
                      startContent={<BarChart3 className="w-3 h-3" />}
                      onPress={() => handleSelectCommunity(community.id, 'dashboard')}
                    >
                      Dashboard
                    </Button>
                    <Button
                      size="sm"
                      variant="bordered"
                      startContent={<Users className="w-3 h-3" />}
                      onPress={() => handleSelectCommunity(community.id, 'members')}
                    >
                      Members
                    </Button>
                    <Button
                      size="sm"
                      variant="bordered"
                      startContent={<Target className="w-3 h-3" />}
                      onPress={() => handleSelectCommunity(community.id, 'tasks')}
                    >
                      Tasks
                    </Button>
                    <Button
                      size="sm"
                      variant="bordered"
                      startContent={<ShoppingCart className="w-3 h-3" />}
                      onPress={() => handleSelectCommunity(community.id, 'marketplace')}
                    >
                      Shop
                    </Button>
                  </div>

                  <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                    Created {new Date(community.createdAt).toLocaleDateString()}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Create Community View
  if (currentView === 'create') {
    return (
      <CommunityCreationForm
        onSubmit={handleCreateCommunity}
        onCancel={() => setCurrentView('list')}
      />
    );
  }

  // Community Management Views
  if (selectedCommunityData) {
    const commonProps = {
      communityId: selectedCommunityData.id,
      pointsName: selectedCommunityData.pointsName,
      pointsSymbol: selectedCommunityData.pointsSymbol
    };

    // Navigation header for community views
    const renderCommunityHeader = () => (
      <div className="bg-white border-b mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="light"
                onPress={() => setCurrentView('list')}
              >
                ← Back to Communities
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedCommunityData.name}
                </h1>
                <p className="text-gray-600">{selectedCommunityData.description}</p>
              </div>
            </div>
            <Chip
              startContent={getRoleIcon(selectedCommunityData.role)}
              color={getRoleColor(selectedCommunityData.role)}
              variant="flat"
            >
              {selectedCommunityData.role.charAt(0).toUpperCase() + selectedCommunityData.role.slice(1)}
            </Chip>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={currentView === 'dashboard' ? 'solid' : 'bordered'}
              color={currentView === 'dashboard' ? 'primary' : 'default'}
              startContent={<BarChart3 className="w-4 h-4" />}
              onPress={() => setCurrentView('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              size="sm"
              variant={currentView === 'members' ? 'solid' : 'bordered'}
              color={currentView === 'members' ? 'primary' : 'default'}
              startContent={<Users className="w-4 h-4" />}
              onPress={() => setCurrentView('members')}
            >
              Members
            </Button>
            <Button
              size="sm"
              variant={currentView === 'tasks' ? 'solid' : 'bordered'}
              color={currentView === 'tasks' ? 'primary' : 'default'}
              startContent={<Target className="w-4 h-4" />}
              onPress={() => setCurrentView('tasks')}
            >
              Social Tasks
            </Button>
            <Button
              size="sm"
              variant={currentView === 'marketplace' ? 'solid' : 'bordered'}
              color={currentView === 'marketplace' ? 'primary' : 'default'}
              startContent={<ShoppingCart className="w-4 h-4" />}
              onPress={() => setCurrentView('marketplace')}
            >
              Marketplace
            </Button>
            <Button
              size="sm"
              variant={currentView === 'points' ? 'solid' : 'bordered'}
              color={currentView === 'points' ? 'primary' : 'default'}
              startContent={<Star className="w-4 h-4" />}
              onPress={() => setCurrentView('points')}
            >
              Points
            </Button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-50">
        {renderCommunityHeader()}
        
        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && (
            <CommunityDashboard
              {...commonProps}
              onNavigateToSettings={() => setCurrentView('settings')}
              onNavigateToMembers={() => setCurrentView('members')}
              onNavigateToTasks={() => setCurrentView('tasks')}
              onNavigateToMarketplace={() => setCurrentView('marketplace')}
              onNavigateToAnalytics={() => setCurrentView('dashboard')}
            />
          )}
          
          {currentView === 'members' && (
            <CommunityMemberManagement
              {...commonProps}
              currentUserRole={selectedCommunityData.role}
            />
          )}
          
          {currentView === 'tasks' && (
            <SocialTaskManagement {...commonProps} />
          )}
          
          {currentView === 'marketplace' && (
            <CommunityMarketplace {...commonProps} />
          )}
          
          {currentView === 'points' && (
            <CommunityPointsManagement {...commonProps} />
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default CommunityManagementPage;