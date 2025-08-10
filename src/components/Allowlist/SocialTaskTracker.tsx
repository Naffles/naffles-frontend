'use client';

import React, { useState } from 'react';
import { Card, CardBody, Button, Input, Link, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { CheckCircleIcon, ClockIcon, ExternalLinkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import { colors, spacing } from '../../styles/design-system/tokens';
import { SocialTask, SocialTaskCompletion, SocialTaskTrackerProps } from './types';

/**
 * SocialTaskTracker Component
 * 
 * Track and complete social media tasks for allowlist participation.
 * Handles Twitter, Discord, Telegram, and custom task verification.
 */
const SocialTaskTracker: React.FC<SocialTaskTrackerProps> = ({
  tasks,
  completions,
  onTaskComplete,
  className = ''
}) => {
  const [verificationModal, setVerificationModal] = useState<{
    isOpen: boolean;
    task: SocialTask | null;
  }>({ isOpen: false, task: null });
  const [verificationData, setVerificationData] = useState<any>({});

  const isTaskCompleted = (taskId: string) => {
    return completions.some(completion => completion.taskId === taskId && completion.completed);
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'twitter_follow':
        return '🐦';
      case 'discord_join':
        return '💬';
      case 'telegram_join':
        return '📱';
      case 'custom':
        return '⭐';
      default:
        return '📋';
    }
  };

  const getTaskTypeLabel = (taskType: string) => {
    switch (taskType) {
      case 'twitter_follow':
        return 'Twitter';
      case 'discord_join':
        return 'Discord';
      case 'telegram_join':
        return 'Telegram';
      case 'custom':
        return 'Custom';
      default:
        return 'Task';
    }
  };

  const getTaskActionLabel = (task: SocialTask) => {
    switch (task.taskType) {
      case 'twitter_follow':
        const twitterAction = task.verificationData.twitter?.action || 'follow';
        return `${twitterAction.charAt(0).toUpperCase() + twitterAction.slice(1)} @${task.verificationData.twitter?.username}`;
      case 'discord_join':
        return `Join ${task.verificationData.discord?.serverName || 'Discord Server'}`;
      case 'telegram_join':
        return `Join ${task.verificationData.telegram?.channelName || 'Telegram Channel'}`;
      case 'custom':
        return task.verificationData.custom?.title || 'Complete Custom Task';
      default:
        return 'Complete Task';
    }
  };

  const getTaskUrl = (task: SocialTask) => {
    switch (task.taskType) {
      case 'twitter_follow':
        const username = task.verificationData.twitter?.username;
        if (username) {
          const cleanUsername = username.replace('@', '');
          return `https://twitter.com/${cleanUsername}`;
        }
        return task.verificationData.twitter?.targetUrl;
      case 'discord_join':
        return task.verificationData.discord?.serverId 
          ? `https://discord.gg/${task.verificationData.discord.serverId}`
          : null;
      case 'telegram_join':
        return task.verificationData.telegram?.channelId
          ? `https://t.me/${task.verificationData.telegram.channelId}`
          : null;
      case 'custom':
        return task.verificationData.custom?.verificationUrl;
      default:
        return null;
    }
  };

  const handleTaskClick = (task: SocialTask) => {
    if (isTaskCompleted(task.taskId)) return;

    const url = getTaskUrl(task);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    // Open verification modal after a short delay
    setTimeout(() => {
      setVerificationModal({ isOpen: true, task });
      setVerificationData({});
    }, 1000);
  };

  const handleVerificationSubmit = () => {
    if (!verificationModal.task) return;

    onTaskComplete(verificationModal.task.taskId, verificationData);
    setVerificationModal({ isOpen: false, task: null });
    setVerificationData({});
  };

  const renderVerificationModal = () => {
    const task = verificationModal.task;
    if (!task) return null;

    return (
      <Modal 
        isOpen={verificationModal.isOpen} 
        onClose={() => setVerificationModal({ isOpen: false, task: null })}
        size="md"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getTaskIcon(task.taskType)}</span>
              <div>
                <h3 className="text-lg font-semibold">Verify Task Completion</h3>
                <p className="text-sm text-gray-600 font-normal">
                  {getTaskActionLabel(task)}
                </p>
              </div>
            </div>
          </ModalHeader>
          
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Task Verification</p>
                    <p>
                      Please confirm that you have completed the required action. 
                      {task.pointsReward > 0 && ` You'll earn ${task.pointsReward} points for completing this task.`}
                    </p>
                  </div>
                </div>
              </div>

              {task.taskType === 'twitter_follow' && (
                <div>
                  <Input
                    label="Your Twitter Username (optional)"
                    placeholder="@yourusername"
                    value={verificationData.twitterUsername || ''}
                    onValueChange={(value) => setVerificationData(prev => ({ ...prev, twitterUsername: value }))}
                    description="This helps us verify your participation"
                  />
                </div>
              )}

              {task.taskType === 'discord_join' && (
                <div>
                  <Input
                    label="Your Discord Username (optional)"
                    placeholder="username#1234"
                    value={verificationData.discordUsername || ''}
                    onValueChange={(value) => setVerificationData(prev => ({ ...prev, discordUsername: value }))}
                    description="This helps us verify your server membership"
                  />
                </div>
              )}

              {task.taskType === 'telegram_join' && (
                <div>
                  <Input
                    label="Your Telegram Username (optional)"
                    placeholder="@yourusername"
                    value={verificationData.telegramUsername || ''}
                    onValueChange={(value) => setVerificationData(prev => ({ ...prev, telegramUsername: value }))}
                    description="This helps us verify your channel membership"
                  />
                </div>
              )}

              {task.taskType === 'custom' && task.verificationData.custom?.description && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Task Description</h4>
                  <p className="text-sm text-gray-700">
                    {task.verificationData.custom.description}
                  </p>
                </div>
              )}
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button 
              variant="light" 
              onPress={() => setVerificationModal({ isOpen: false, task: null })}
            >
              Cancel
            </Button>
            <AccessibleButton
              color="primary"
              onPress={handleVerificationSubmit}
            >
              Confirm Completion
            </AccessibleButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-600">No social tasks required</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {tasks.map((task) => {
        const completed = isTaskCompleted(task.taskId);
        const taskUrl = getTaskUrl(task);

        return (
          <Card 
            key={task.taskId}
            className={`transition-all duration-200 ${
              completed 
                ? 'bg-green-50 border-green-200' 
                : 'hover:shadow-md cursor-pointer'
            }`}
            isPressable={!completed}
            onPress={() => !completed && handleTaskClick(task)}
          >
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {completed ? (
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {getTaskIcon(task.taskType)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {getTaskActionLabel(task)}
                      </h4>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={completed ? 'success' : 'default'}
                      >
                        {getTaskTypeLabel(task.taskType)}
                      </Chip>
                      {task.required && (
                        <Chip size="sm" color="danger" variant="flat">
                          Required
                        </Chip>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {task.pointsReward > 0 && (
                        <span>+{task.pointsReward} points</span>
                      )}
                      
                      {completed && (
                        <span className="text-green-600 font-medium">
                          ✓ Completed
                        </span>
                      )}
                    </div>

                    {task.taskType === 'custom' && task.verificationData.custom?.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {task.verificationData.custom.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {taskUrl && !completed && (
                    <Button
                      size="sm"
                      variant="flat"
                      as={Link}
                      href={taskUrl}
                      isExternal
                      startContent={<ExternalLinkIcon className="w-4 h-4" />}
                    >
                      Open
                    </Button>
                  )}

                  {!completed && (
                    <AccessibleButton
                      size="sm"
                      color="primary"
                      variant={task.required ? 'solid' : 'flat'}
                      onPress={() => handleTaskClick(task)}
                    >
                      {task.required ? 'Complete' : 'Start'}
                    </AccessibleButton>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}

      {/* Task Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Tasks Completed: {completions.filter(c => c.completed).length} / {tasks.length}
          </span>
          <span className="text-gray-600">
            Total Points: {completions.filter(c => c.completed).reduce((sum, c) => sum + c.pointsAwarded, 0)}
          </span>
        </div>
      </div>

      {renderVerificationModal()}
    </div>
  );
};

export default SocialTaskTracker;