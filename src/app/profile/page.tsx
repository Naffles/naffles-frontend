'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab, Avatar, Button, Chip, Spinner } from '@nextui-org/react';
import { UserIcon, CogIcon, BellIcon, ChartBarIcon, TrophyIcon, WalletIcon } from '@heroicons/react/24/outline';
import { UserProfileOverview } from '@/components/UserProfile/UserProfileOverview';
import { UserSettings } from '@/components/UserProfile/UserSettings';
import { UserNotifications } from '@/components/UserProfile/UserNotifications';
import { UserAnalytics } from '@/components/UserProfile/UserAnalytics';
import { UserAchievements } from '@/components/UserProfile/UserAchievements';
import { UserWallets } from '@/components/UserProfile/UserWallets';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { profile, loading, error, refreshProfile } = useUserProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <p className="text-danger mb-4">Error loading profile: {error}</p>
            <Button color="primary" onClick={refreshProfile}>
              Retry
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <p className="text-default-500">Profile not found</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar
              src={profile.profileImageUrl}
              alt={profile.username}
              className="w-24 h-24 text-large"
              name={profile.username}
            />
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{profile.profileData?.displayName || profile.username}</h1>
                <div className="flex gap-2">
                  <Chip color="primary" variant="flat" size="sm">
                    {profile.tier}
                  </Chip>
                  {profile.isVerified && (
                    <Chip color="success" variant="flat" size="sm">
                      Verified
                    </Chip>
                  )}
                  {profile.foundersKeys?.length > 0 && (
                    <Chip color="warning" variant="flat" size="sm">
                      Founders Key Holder
                    </Chip>
                  )}
                </div>
              </div>
              
              {profile.profileData?.bio && (
                <p className="text-default-600 mb-4">{profile.profileData.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-default-500">
                <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{profile.pointsBalance.toLocaleString()} points</span>
                <span>•</span>
                <span>{profile.achievements?.length || 0} achievements</span>
                {profile.profileData?.location && (
                  <>
                    <span>•</span>
                    <span>{profile.profileData.location}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button
                color="primary"
                variant="flat"
                size="sm"
                onClick={() => setSelectedTab('settings')}
              >
                Edit Profile
              </Button>
              {profile.actionItems?.length > 0 && (
                <Button
                  color="warning"
                  variant="flat"
                  size="sm"
                  onClick={() => setSelectedTab('notifications')}
                >
                  {profile.actionItems.length} Action{profile.actionItems.length !== 1 ? 's' : ''} Required
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Profile Tabs */}
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary"
        }}
      >
        <Tab
          key="overview"
          title={
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4" />
              <span>Overview</span>
            </div>
          }
        >
          <UserProfileOverview profile={profile} onRefresh={refreshProfile} />
        </Tab>
        
        <Tab
          key="wallets"
          title={
            <div className="flex items-center space-x-2">
              <WalletIcon className="w-4 h-4" />
              <span>Wallets</span>
            </div>
          }
        >
          <UserWallets profile={profile} onRefresh={refreshProfile} />
        </Tab>
        
        <Tab
          key="achievements"
          title={
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-4 h-4" />
              <span>Achievements</span>
              {profile.achievements?.length > 0 && (
                <Chip size="sm" variant="flat" color="primary">
                  {profile.achievements.length}
                </Chip>
              )}
            </div>
          }
        >
          <UserAchievements profile={profile} onRefresh={refreshProfile} />
        </Tab>
        
        <Tab
          key="analytics"
          title={
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-4 h-4" />
              <span>Analytics</span>
            </div>
          }
        >
          <UserAnalytics profile={profile} />
        </Tab>
        
        <Tab
          key="notifications"
          title={
            <div className="flex items-center space-x-2">
              <BellIcon className="w-4 h-4" />
              <span>Notifications</span>
              {profile.actionItems?.length > 0 && (
                <Chip size="sm" variant="flat" color="warning">
                  {profile.actionItems.length}
                </Chip>
              )}
            </div>
          }
        >
          <UserNotifications profile={profile} onRefresh={refreshProfile} />
        </Tab>
        
        <Tab
          key="settings"
          title={
            <div className="flex items-center space-x-2">
              <CogIcon className="w-4 h-4" />
              <span>Settings</span>
            </div>
          }
        >
          <UserSettings profile={profile} onRefresh={refreshProfile} />
        </Tab>
      </Tabs>
    </div>
  );
}