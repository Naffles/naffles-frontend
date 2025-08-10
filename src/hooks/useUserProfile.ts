import { useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  profileImage?: string;
  profileImageUrl?: string;
  role: string;
  tier: string;
  isVerified: boolean;
  isBlocked: boolean;
  profileData: {
    displayName?: string;
    bio?: string;
    location?: string;
    website?: string;
    preferences?: {
      notifications?: {
        email: boolean;
        push: boolean;
        marketing: boolean;
        gameResults: boolean;
        raffleUpdates: boolean;
        stakingRewards: boolean;
        communityActivity: boolean;
        achievementUnlocks: boolean;
      };
      privacy?: {
        showProfile: boolean;
        showActivity: boolean;
      };
    };
  };
  authMethods: {
    wallet: boolean;
    email: boolean;
  };
  createdAt: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  loginCount: number;
  wallets: Array<{
    id: string;
    address: string;
    walletType: string;
    chainId: string;
    isPrimary: boolean;
    connectedAt: string;
    metadata?: any;
  }>;
  primaryWallet?: {
    address: string;
    walletType: string;
    chainId: string;
  };
  walletBalance: {
    balances: Map<string, string>;
    fundingBalances: Map<string, string>;
    lastUpdated: string;
  };
  pointsBalance: number;
  temporaryPoints: number;
  achievements: Array<{
    id: string;
    achievement: any;
    unlockedAt: string;
    progress: number;
    isCompleted: boolean;
  }>;
  foundersKeys: Array<any>;
  foundersKeyBenefits: {
    feeDiscount: number;
    priorityAccess: boolean;
    openEntryTickets: number;
  };
  stakingPositions: Array<{
    id: string;
    contract: any;
    tokenId: string;
    duration: number;
    stakedAt: string;
    expiresAt: string;
    rewards: any;
    isActive: boolean;
  }>;
  communityMemberships: Array<{
    id: string;
    community: any;
    role: string;
    joinedAt: string;
    isActive: boolean;
    permissions: any;
  }>;
  actionItems: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    actionUrl: string;
    priority: string;
    createdAt: string;
    expiresAt?: string;
    metadata?: any;
  }>;
  transactionHistory: Array<{
    id: string;
    eventType: string;
    eventId: string;
    status: string;
    amount: string;
    details: string;
    dateCreated: string;
  }>;
  activitySummary: {
    totalRafflesCreated: number;
    totalRafflesEntered: number;
    totalGamesPlayed: number;
    totalPointsEarned: number;
    totalAchievements: number;
    totalStakingRewards: number;
    memberSince: string;
    lastActivity: string;
  };
  socials: {
    twitter?: { username?: string };
    telegram?: { id?: string; username?: string; name?: string };
    discord?: { id?: string; username?: string; name?: string };
  };
  geolocation?: {
    country?: string;
    region?: string;
    city?: string;
    isBlocked?: boolean;
  };
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user/profile/comprehensive', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfileData = useCallback(async (profileData: Partial<UserProfile['profileData']>) => {
    try {
      const response = await fetch('/api/user/profile/data', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local profile state
        setProfile(prev => prev ? {
          ...prev,
          profileData: { ...prev.profileData, ...profileData }
        } : null);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile data:', err);
      throw err;
    }
  }, []);

  const updateNotificationPreferences = useCallback(async (preferences: UserProfile['profileData']['preferences']['notifications']) => {
    try {
      const response = await fetch('/api/user/profile/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`Failed to update notifications: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local profile state
        setProfile(prev => prev ? {
          ...prev,
          profileData: {
            ...prev.profileData,
            preferences: {
              ...prev.profileData.preferences,
              notifications: preferences
            }
          }
        } : null);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update notifications');
      }
    } catch (err) {
      console.error('Error updating notification preferences:', err);
      throw err;
    }
  }, []);

  const setPrimaryWallet = useCallback(async (walletAddress: string) => {
    try {
      const response = await fetch('/api/user/profile/primary-wallet', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        throw new Error(`Failed to set primary wallet: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh profile to get updated wallet data
        await fetchProfile();
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to set primary wallet');
      }
    } catch (err) {
      console.error('Error setting primary wallet:', err);
      throw err;
    }
  }, [fetchProfile]);

  const markActionItemCompleted = useCallback(async (actionItemId: string) => {
    try {
      const response = await fetch(`/api/user/profile/action-items/${actionItemId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to complete action item: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Remove completed action item from local state
        setProfile(prev => prev ? {
          ...prev,
          actionItems: prev.actionItems.filter(item => item.id !== actionItemId)
        } : null);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to complete action item');
      }
    } catch (err) {
      console.error('Error completing action item:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refreshProfile,
    updateProfileData,
    updateNotificationPreferences,
    setPrimaryWallet,
    markActionItemCompleted,
  };
}