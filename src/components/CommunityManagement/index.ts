// Community Management Components
export { default as CommunityCreationForm } from './CommunityCreationForm';
export { default as CommunityDashboard } from './CommunityDashboard';
export { default as CommunityMemberManagement } from './CommunityMemberManagement';
export { default as SocialTaskManagement } from './SocialTaskManagement';
export { default as CommunityMarketplace } from './CommunityMarketplace';
export { default as CommunityPointsManagement } from './CommunityPointsManagement';

// Types
export interface CommunityData {
  id: string;
  name: string;
  description: string;
  slug: string;
  creatorId: string;
  isNafflesCommunity: boolean;
  pointsConfiguration: {
    pointsName: string;
    pointsSymbol: string;
    initialBalance: number;
    enableAchievements: boolean;
    enableLeaderboards: boolean;
  };
  features: {
    enableMarketplace: boolean;
    enableSocialTasks: boolean;
    enableAllowlists: boolean;
  };
  accessControl: {
    isPublic: boolean;
    requireApproval: boolean;
    nftRequirements: Array<{
      contractAddress: string;
      blockchain: string;
      minTokens: number;
    }>;
  };
  stats: {
    totalMembers: number;
    activeMembers: number;
    totalPoints: number;
    pointsDistributed: number;
    tasksCompleted: number;
    achievementsEarned: number;
    marketplaceSales: number;
    allowlistsCreated: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommunityMember {
  id: string;
  userId: string;
  username: string;
  walletAddress: string;
  role: 'creator' | 'admin' | 'moderator' | 'member';
  joinedAt: string;
  lastActive: string;
  pointsBalance: number;
  tasksCompleted: number;
  achievementsCount: number;
  status: 'active' | 'inactive' | 'banned' | 'pending';
  permissions: {
    canManagePoints: boolean;
    canManageAchievements: boolean;
    canManageMembers: boolean;
    canModerateContent: boolean;
    canViewAnalytics: boolean;
  };
}

export interface SocialTask {
  id: string;
  title: string;
  description: string;
  type: 'twitter_follow' | 'twitter_retweet' | 'twitter_like' | 'discord_join' | 'telegram_join' | 'custom_url';
  targetUrl: string;
  pointsReward: number;
  maxCompletions: number;
  currentCompletions: number;
  status: 'active' | 'paused' | 'completed' | 'expired';
  createdAt: string;
  expiresAt?: string;
  requirements?: {
    minFollowers?: number;
    accountAge?: number;
    verificationRequired?: boolean;
  };
}

export interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'software' | 'other';
  price: number;
  currency: 'points' | 'tokens';
  tokenType?: string;
  imageUrl?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  downloadCount: number;
  totalSales: number;
  revenue: number;
  status: 'active' | 'inactive' | 'sold_out';
  createdAt: string;
  updatedAt: string;
  maxPurchases?: number;
  currentPurchases: number;
  tags: string[];
}

export interface PointsTransaction {
  id: string;
  userId: string;
  username: string;
  type: 'earned' | 'spent' | 'admin_credit' | 'admin_debit' | 'bonus' | 'refund';
  amount: number;
  description: string;
  source: string;
  timestamp: string;
  adminId?: string;
  adminUsername?: string;
}

export interface PointsBalance {
  userId: string;
  username: string;
  walletAddress: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  rank: number;
  lastActivity: string;
}