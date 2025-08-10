'use client';

import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip,
  Divider
} from '@nextui-org/react';
import { 
  BellIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { UserProfile, useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'react-hot-toast';

interface UserNotificationsProps {
  profile: UserProfile;
  onRefresh: () => void;
}

export function UserNotifications({ profile, onRefresh }: UserNotificationsProps) {
  const { markActionItemCompleted } = useUserProfile();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'high': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'medium': return <InformationCircleIcon className="w-5 h-5" />;
      case 'low': return <InformationCircleIcon className="w-5 h-5" />;
      default: return <BellIcon className="w-5 h-5" />;
    }
  };

  const handleCompleteAction = async (actionItemId: string) => {
    try {
      await markActionItemCompleted(actionItemId);
      toast.success('Action completed successfully');
      onRefresh();
    } catch (error) {
      console.error('Error completing action:', error);
      toast.error('Failed to complete action');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Action Items */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <BellIcon className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Action Items</h3>
              {profile.actionItems?.length > 0 && (
                <Chip color="warning" variant="flat" size="sm">
                  {profile.actionItems.length}
                </Chip>
              )}
            </div>
            <Button color="primary" variant="flat" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          {profile.actionItems?.length > 0 ? (
            <div className="space-y-4">
              {profile.actionItems.map((item) => (
                <Card key={item.id} className="border-l-4" style={{
                  borderLeftColor: `hsl(var(--nextui-${getPriorityColor(item.priority)}))`
                }}>
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg bg-${getPriorityColor(item.priority)}/10`}>
                          {getPriorityIcon(item.priority)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{item.title}</h4>
                            <Chip 
                              color={getPriorityColor(item.priority) as any} 
                              variant="flat" 
                              size="sm"
                            >
                              {item.priority}
                            </Chip>
                          </div>
                          <p className="text-default-600 mb-3">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm text-default-500">
                            <span>Created: {formatDate(item.createdAt)}</span>
                            {item.expiresAt && (
                              <>
                                <span>•</span>
                                <span>Expires: {formatDate(item.expiresAt)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          as="a"
                          href={item.actionUrl}
                          color="primary"
                          variant="flat"
                          size="sm"
                        >
                          Take Action
                        </Button>
                        <Button
                          color="success"
                          variant="flat"
                          size="sm"
                          startContent={<CheckCircleIcon className="w-4 h-4" />}
                          onClick={() => handleCompleteAction(item.id)}
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircleIcon className="w-16 h-16 text-success mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">All caught up!</h4>
              <p className="text-default-500">You have no pending action items.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}