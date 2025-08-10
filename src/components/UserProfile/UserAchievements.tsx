'use client';

import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Progress,
  Chip,
  Button
} from '@nextui-org/react';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/outline';
import { UserProfile } from '@/hooks/useUserProfile';

interface UserAchievementsProps {
  profile: UserProfile;
  onRefresh: () => void;
}

export function UserAchievements({ profile, onRefresh }: UserAchievementsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAchievementColor = (achievement: any) => {
    if (achievement.achievement?.category === 'gaming') return 'primary';
    if (achievement.achievement?.category === 'raffle') return 'success';
    if (achievement.achievement?.category === 'staking') return 'warning';
    if (achievement.achievement?.category === 'community') return 'secondary';
    return 'default';
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Achievement Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <TrophyIcon className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Achievement Progress</h3>
            </div>
            <Button color="primary" variant="flat" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {profile.achievements?.filter(a => a.isCompleted).length || 0}
              </div>
              <div className="text-sm text-default-500">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-warning mb-1">
                {profile.achievements?.filter(a => !a.isCompleted && a.progress > 0).length || 0}
              </div>
              <div className="text-sm text-default-500">In Progress</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-1">
                {profile.activitySummary.totalPointsEarned}
              </div>
              <div className="text-sm text-default-500">Points from Achievements</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-1">
                {profile.achievements?.length || 0}
              </div>
              <div className="text-sm text-default-500">Total Achievements</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Achievements List */}
      <div className="space-y-4">
        {profile.achievements && profile.achievements.length > 0 ? (
          profile.achievements.map((userAchievement) => (
            <Card 
              key={userAchievement.id} 
              className={`${userAchievement.isCompleted ? 'border-success' : 'border-default-200'} border-2`}
            >
              <CardBody className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    userAchievement.isCompleted 
                      ? 'bg-success/10' 
                      : 'bg-default-100'
                  }`}>
                    {userAchievement.isCompleted ? (
                      <TrophyIcon className="w-6 h-6 text-success" />
                    ) : (
                      <StarIcon className="w-6 h-6 text-default-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">
                        {userAchievement.achievement?.name || 'Achievement'}
                      </h4>
                      <Chip 
                        color={getAchievementColor(userAchievement) as any}
                        variant="flat" 
                        size="sm"
                      >
                        {userAchievement.achievement?.category || 'General'}
                      </Chip>
                      {userAchievement.isCompleted && (
                        <Chip color="success" variant="flat" size="sm">
                          Completed
                        </Chip>
                      )}
                    </div>
                    
                    <p className="text-default-600 mb-3">
                      {userAchievement.achievement?.description || 'No description available'}
                    </p>
                    
                    {!userAchievement.isCompleted && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-default-500">Progress</span>
                          <span className="text-sm font-medium">
                            {userAchievement.progress}% Complete
                          </span>
                        </div>
                        <Progress 
                          value={userAchievement.progress} 
                          color={getAchievementColor(userAchievement) as any}
                          size="sm"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-default-500">
                        {userAchievement.isCompleted && userAchievement.unlockedAt && (
                          <span>Unlocked: {formatDate(userAchievement.unlockedAt)}</span>
                        )}
                        {userAchievement.achievement?.points && (
                          <span>Reward: {userAchievement.achievement.points} points</span>
                        )}
                      </div>
                      
                      {userAchievement.achievement?.rarity && (
                        <Chip 
                          color={
                            userAchievement.achievement.rarity === 'legendary' ? 'warning' :
                            userAchievement.achievement.rarity === 'epic' ? 'secondary' :
                            userAchievement.achievement.rarity === 'rare' ? 'primary' :
                            'default'
                          }
                          variant="flat" 
                          size="sm"
                        >
                          {userAchievement.achievement.rarity}
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <TrophyIcon className="w-16 h-16 text-default-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">No Achievements Yet</h4>
              <p className="text-default-500 mb-4">
                Start playing games, entering raffles, and participating in the community to unlock achievements!
              </p>
              <Button color="primary" variant="flat">
                Explore Platform
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}