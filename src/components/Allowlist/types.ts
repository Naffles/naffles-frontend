/**
 * Allowlist System Types and Interfaces
 * 
 * TypeScript definitions for the allowlist system components and data structures.
 */

// =============================================================================
// Core Allowlist Types
// =============================================================================

export interface Allowlist {
  _id: string;
  title: string;
  description: string;
  communityId?: string;
  creatorId: string;
  
  // Entry configuration
  entryPrice: {
    tokenType: 'ETH' | 'SOL' | 'MATIC' | 'USDC' | 'USDT' | 'BTC' | 'points';
    amount: string;
  };
  
  // Winner configuration
  winnerCount: number | 'everyone';
  profitGuaranteePercentage: number;
  
  // Timing
  duration: number;
  endTime: string;
  
  // Social tasks
  socialTasks: SocialTask[];
  
  // Access requirements
  accessRequirements: AccessRequirement[];
  
  // Entry limits
  maxEntries?: number;
  allowDuplicateWallets: boolean;
  
  // Status
  status: 'active' | 'completed' | 'cancelled';
  
  // VRF and completion
  vrfRequestId?: string;
  randomness?: string;
  winnerSelectionMethod?: 'vrf' | 'failsafe';
  completedAt?: string;
  
  // Statistics
  totalEntries: number;
  totalTicketSales: {
    tokenType: string;
    amount: string;
  };
  
  // Payout tracking
  payoutProcessed: boolean;
  payoutSummary?: PayoutSummary;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Virtual fields
  isLive?: boolean;
}

export interface SocialTask {
  taskId: string;
  taskType: 'twitter_follow' | 'discord_join' | 'telegram_join' | 'custom';
  required: boolean;
  pointsReward: number;
  verificationData: {
    twitter?: {
      username: string;
      action: 'follow' | 'retweet' | 'like';
      targetUrl: string;
    };
    discord?: {
      serverId: string;
      serverName: string;
      requiredRole?: string;
    };
    telegram?: {
      channelId: string;
      channelName: string;
      action: 'join' | 'message';
    };
    custom?: {
      title: string;
      description: string;
      verificationUrl: string;
    };
  };
}

export interface AccessRequirement {
  type: 'nft_ownership' | 'token_balance' | 'community_member';
  contractAddress?: string;
  minimumAmount?: string;
  communityId?: string;
}

export interface PayoutSummary {
  totalRefunds: {
    tokenType: string;
    amount: string;
  };
  totalProfitGuarantee: {
    tokenType: string;
    amount: string;
  };
  creatorProfit: {
    tokenType: string;
    amount: string;
  };
  platformFee: {
    tokenType: string;
    amount: string;
  };
  profitPerLoser: {
    tokenType: string;
    amount: string;
  };
}

// =============================================================================
// Participation Types
// =============================================================================

export interface AllowlistParticipation {
  _id: string;
  allowlistId: string;
  userId: string;
  walletAddress: string;
  
  // Entry details
  entryPrice: {
    tokenType: string;
    amount: string;
  };
  
  // Social task completion
  socialTasksCompleted: SocialTaskCompletion[];
  allRequiredTasksCompleted: boolean;
  
  // Access verification
  accessRequirementsMet: boolean;
  accessVerificationData?: any;
  
  // Entry status
  entryStatus: 'pending' | 'confirmed' | 'rejected';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface SocialTaskCompletion {
  taskId: string;
  taskType: string;
  completed: boolean;
  completedAt?: string;
  verificationData?: any;
  pointsAwarded: number;
}

export interface AllowlistWinner {
  _id: string;
  allowlistId: string;
  userId: string;
  walletAddress: string;
  winnerPosition: number;
  
  // Claim status
  claimStatus: 'pending' | 'claimed' | 'expired';
  claimedAt?: string;
  claimExpiresAt: string;
  
  // Notification
  notificationSent: boolean;
  actionItemId?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Form and UI Types
// =============================================================================

export interface AllowlistCreationFormData {
  title: string;
  description: string;
  communityId?: string;
  
  // Entry configuration
  entryPrice: {
    tokenType: 'ETH' | 'SOL' | 'MATIC' | 'USDC' | 'USDT' | 'BTC' | 'points';
    amount: string;
  };
  
  // Winner configuration
  winnerCount: number | 'everyone';
  profitGuaranteePercentage: number;
  
  // Timing
  duration: number;
  
  // Social tasks
  socialTasks: SocialTaskFormData[];
  
  // Access requirements
  accessRequirements: AccessRequirementFormData[];
  
  // Entry limits
  maxEntries?: number;
  allowDuplicateWallets: boolean;
}

export interface SocialTaskFormData {
  taskType: 'twitter_follow' | 'discord_join' | 'telegram_join' | 'custom';
  required: boolean;
  pointsReward: number;
  verificationData: {
    twitter?: {
      username: string;
      action: 'follow' | 'retweet' | 'like';
      targetUrl: string;
    };
    discord?: {
      serverId: string;
      serverName: string;
      requiredRole?: string;
    };
    telegram?: {
      channelId: string;
      channelName: string;
      action: 'join' | 'message';
    };
    custom?: {
      title: string;
      description: string;
      verificationUrl: string;
    };
  };
}

export interface AccessRequirementFormData {
  type: 'nft_ownership' | 'token_balance' | 'community_member';
  contractAddress?: string;
  minimumAmount?: string;
  communityId?: string;
}

export interface AllowlistParticipationFormData {
  walletAddress: string;
  socialTaskCompletions: {
    [taskId: string]: {
      completed: boolean;
      verificationData?: any;
    };
  };
}

// =============================================================================
// Analytics and Statistics Types
// =============================================================================

export interface AllowlistStatistics {
  totalParticipants: number;
  completedTasks: number;
  averageTaskCompletion: number;
  entryDistribution: {
    [tokenType: string]: {
      count: number;
      totalAmount: string;
    };
  };
  socialTaskStats: {
    [taskType: string]: {
      totalTasks: number;
      completedTasks: number;
      completionRate: number;
    };
  };
  timeToCompletion: {
    average: number;
    median: number;
    fastest: number;
    slowest: number;
  };
}

export interface AllowlistAnalyticsData {
  allowlist: Allowlist;
  statistics: AllowlistStatistics;
  participationTrends: {
    date: string;
    participants: number;
    completions: number;
  }[];
  taskCompletionRates: {
    taskId: string;
    taskType: string;
    completionRate: number;
    averageTime: number;
  }[];
  winnerData?: {
    winners: AllowlistWinner[];
    exportData: WinnerExportData;
  };
}

export interface WinnerExportData {
  format: 'json' | 'csv';
  data: string | WinnerExportRecord[];
  filename: string;
  generatedAt: string;
}

export interface WinnerExportRecord {
  position: number;
  walletAddress: string;
  username?: string;
  twitterHandle?: string;
  discordUsername?: string;
  telegramUsername?: string;
  claimStatus: string;
  claimedAt?: string;
}

// =============================================================================
// Admin and Management Types
// =============================================================================

export interface AllowlistConfiguration {
  maxLiveAllowlistsPerCommunity: number;
  allowlistCreationRestricted: boolean;
  platformFeePercentage: number;
  defaultProfitGuaranteePercentage: number;
  maxWinnerCount: number;
  minDuration: number;
  maxDuration: number;
  supportedTokenTypes: string[];
  requiredSocialTasks: string[];
}

export interface AllowlistAdminData {
  configuration: AllowlistConfiguration;
  systemStats: {
    totalAllowlists: number;
    activeAllowlists: number;
    completedAllowlists: number;
    totalParticipants: number;
    totalWinners: number;
    totalPayouts: {
      [tokenType: string]: string;
    };
  };
  recentActivity: {
    allowlistsCreated: number;
    participantsJoined: number;
    winnersSelected: number;
    payoutsProcessed: number;
  };
}

// =============================================================================
// API Response Types
// =============================================================================

export interface AllowlistApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AllowlistListResponse {
  allowlists: Allowlist[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AllowlistParticipationResponse {
  participation: AllowlistParticipation;
  allowlist: Allowlist;
  userStatus: {
    canParticipate: boolean;
    hasParticipated: boolean;
    requirementsMet: boolean;
    missingRequirements: string[];
  };
}

// =============================================================================
// Component Props Types
// =============================================================================

export interface AllowlistCardProps {
  allowlist: Allowlist;
  showParticipationButton?: boolean;
  showAnalytics?: boolean;
  onParticipate?: (allowlistId: string) => void;
  onViewAnalytics?: (allowlistId: string) => void;
  className?: string;
}

export interface AllowlistCreationFormProps {
  communityId?: string;
  onSuccess?: (allowlist: Allowlist) => void;
  onCancel?: () => void;
  className?: string;
}

export interface AllowlistParticipationModalProps {
  allowlist: Allowlist;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (participation: AllowlistParticipation) => void;
}

export interface AllowlistAnalyticsProps {
  allowlistId: string;
  allowlist?: Allowlist;
  className?: string;
}

export interface SocialTaskTrackerProps {
  tasks: SocialTask[];
  completions: SocialTaskCompletion[];
  onTaskComplete: (taskId: string, verificationData?: any) => void;
  className?: string;
}

export interface WinnerExportInterfaceProps {
  allowlistId: string;
  allowlist: Allowlist;
  onExport?: (data: WinnerExportData) => void;
  className?: string;
}

// =============================================================================
// Utility Types
// =============================================================================

export type AllowlistStatus = 'active' | 'completed' | 'cancelled';
export type SocialTaskType = 'twitter_follow' | 'discord_join' | 'telegram_join' | 'custom';
export type AccessRequirementType = 'nft_ownership' | 'token_balance' | 'community_member';
export type TokenType = 'ETH' | 'SOL' | 'MATIC' | 'USDC' | 'USDT' | 'BTC' | 'points';
export type WinnerClaimStatus = 'pending' | 'claimed' | 'expired';
export type EntryStatus = 'pending' | 'confirmed' | 'rejected';
export type ExportFormat = 'json' | 'csv';