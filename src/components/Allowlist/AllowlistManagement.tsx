'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { PlusIcon, ChartBarIcon, PlayIcon, StopIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import AllowlistBrowser from './AllowlistBrowser';
import AllowlistCreationForm from './AllowlistCreationForm';
import AllowlistAnalytics from './AllowlistAnalytics';
import { colors, spacing } from '../../styles/design-system/tokens';
import { Allowlist } from './types';

interface AllowlistManagementProps {
  communityId?: string;
  className?: string;
}

/**
 * AllowlistManagement Component
 * 
 * Comprehensive management interface for allowlist creators including
 * creation, analytics, and administration tools.
 */
const AllowlistManagement: React.FC<AllowlistManagementProps> = ({
  communityId,
  className = ''
}) => {
  const [selectedTab, setSelectedTab] = useState('active');
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [selectedAllowlist, setSelectedAllowlist] = useState<Allowlist | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [communityLimits, setCommunityLimits] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    action: 'execute' | 'cancel' | null;
    allowlist: Allowlist | null;
  }>({ isOpen: false, action: null, allowlist: null });

  useEffect(() => {
    if (communityId) {
      loadCommunityLimits();
    }
  }, [communityId]);

  const loadCommunityLimits = async () => {
    try {
      const response = await fetch(`/api/allowlists/community/${communityId}/limits`);
      if (response.ok) {
        const data = await response.json();
        setCommunityLimits(data.data);
      }
    } catch (error) {
      console.error('Error loading community limits:', error);
    }
  };

  const handleCreateAllowlist = () => {
    setShowCreationForm(true);
  };

  const handleCreationSuccess = (allowlist: Allowlist) => {
    setShowCreationForm(false);
    // Refresh the allowlist browser
    window.location.reload();
  };

  const handleViewAnalytics = (allowlistId: string) => {
    // Find the allowlist to show analytics for
    setSelectedAllowlist({ _id: allowlistId } as Allowlist);
    setShowAnalytics(true);
  };

  const handleExecuteAllowlist = async (allowlist: Allowlist) => {
    try {
      const response = await fetch(`/api/allowlists/${allowlist._id}/execute`, {
        method: 'POST'
      });

      if (response.ok) {
        // Refresh the allowlist browser
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('Failed to execute allowlist:', error.message);
      }
    } catch (error) {
      console.error('Error executing allowlist:', error);
    }
  };

  const handleCancelAllowlist = async (allowlist: Allowlist) => {
    try {
      const response = await fetch(`/api/allowlists/${allowlist._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        // Refresh the allowlist browser
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('Failed to cancel allowlist:', error.message);
      }
    } catch (error) {
      console.error('Error cancelling allowlist:', error);
    }
  };

  const renderManagementActions = (allowlist: Allowlist) => {
    const actions = [];

    // Analytics action (always available)
    actions.push(
      <Button
        key="analytics"
        size="sm"
        variant="flat"
        onPress={() => handleViewAnalytics(allowlist._id)}
        startContent={<ChartBarIcon className="w-4 h-4" />}
      >
        Analytics
      </Button>
    );

    // Status-specific actions
    if (allowlist.status === 'active') {
      // Execute allowlist (if ended)
      const hasEnded = new Date() > new Date(allowlist.endTime);
      if (hasEnded) {
        actions.push(
          <AccessibleButton
            key="execute"
            size="sm"
            color="primary"
            onPress={() => setConfirmAction({ isOpen: true, action: 'execute', allowlist })}
            startContent={<PlayIcon className="w-4 h-4" />}
          >
            Execute Draw
          </AccessibleButton>
        );
      }

      // Cancel allowlist
      actions.push(
        <Button
          key="cancel"
          size="sm"
          color="danger"
          variant="flat"
          onPress={() => setConfirmAction({ isOpen: true, action: 'cancel', allowlist })}
          startContent={<StopIcon className="w-4 h-4" />}
        >
          Cancel
        </Button>
      );
    }

    return actions;
  };

  const renderConfirmationModal = () => {
    const { isOpen, action, allowlist } = confirmAction;
    if (!isOpen || !action || !allowlist) return null;

    return (
      <Modal 
        isOpen={isOpen} 
        onClose={() => setConfirmAction({ isOpen: false, action: null, allowlist: null })}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">
              {action === 'execute' ? 'Execute Allowlist Draw' : 'Cancel Allowlist'}
            </h3>
          </ModalHeader>
          
          <ModalBody>
            <div className="space-y-4">
              <p className="text-gray-700">
                {action === 'execute' 
                  ? `Are you sure you want to execute the draw for "${allowlist.title}"? This will select winners and cannot be undone.`
                  : `Are you sure you want to cancel "${allowlist.title}"? This will refund all participants and cannot be undone.`
                }
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Allowlist Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Participants: {allowlist.totalEntries}</div>
                  <div>Winners: {allowlist.winnerCount === 'everyone' ? 'Everyone' : allowlist.winnerCount}</div>
                  <div>Entry Price: {allowlist.entryPrice.amount === '0' ? 'Free' : `${allowlist.entryPrice.amount} ${allowlist.entryPrice.tokenType}`}</div>
                </div>
              </div>

              {action === 'execute' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Winner selection will use Chainlink VRF for provably fair randomness. 
                    Winners will be notified automatically and can claim their status.
                  </p>
                </div>
              )}

              {action === 'cancel' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">
                    <strong>Warning:</strong> Cancelling will refund all participants and permanently end this allowlist. 
                    This action cannot be reversed.
                  </p>
                </div>
              )}
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button 
              variant="light" 
              onPress={() => setConfirmAction({ isOpen: false, action: null, allowlist: null })}
            >
              Cancel
            </Button>
            <AccessibleButton
              color={action === 'execute' ? 'primary' : 'danger'}
              onPress={() => {
                if (action === 'execute') {
                  handleExecuteAllowlist(allowlist);
                } else {
                  handleCancelAllowlist(allowlist);
                }
                setConfirmAction({ isOpen: false, action: null, allowlist: null });
              }}
            >
              {action === 'execute' ? 'Execute Draw' : 'Cancel Allowlist'}
            </AccessibleButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const renderCreationModal = () => (
    <Modal 
      isOpen={showCreationForm} 
      onClose={() => setShowCreationForm(false)}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">Create New Allowlist</h2>
        </ModalHeader>
        <ModalBody className="p-0">
          <AllowlistCreationForm
            communityId={communityId}
            onSuccess={handleCreationSuccess}
            onCancel={() => setShowCreationForm(false)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  const renderAnalyticsModal = () => (
    <Modal 
      isOpen={showAnalytics} 
      onClose={() => setShowAnalytics(false)}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">Allowlist Analytics</h2>
        </ModalHeader>
        <ModalBody className="p-0">
          {selectedAllowlist && (
            <AllowlistAnalytics
              allowlistId={selectedAllowlist._id}
              allowlist={selectedAllowlist}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Allowlist Management</h2>
              <p className="text-gray-600">
                {communityId ? 'Manage your community allowlists' : 'Manage all your allowlists'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {communityLimits && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {communityLimits.currentLiveAllowlists} / {communityLimits.maxLiveAllowlists} live
                  </p>
                  <p className="text-xs text-gray-500">allowlists</p>
                </div>
              )}
              
              <AccessibleButton
                color="primary"
                onPress={handleCreateAllowlist}
                startContent={<PlusIcon className="w-4 h-4" />}
                isDisabled={communityLimits && !communityLimits.canCreateNew}
              >
                Create Allowlist
              </AccessibleButton>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            className="w-full"
          >
            <Tab key="active" title="Active">
              <AllowlistBrowser
                communityId={communityId}
                showCreateButton={false}
              />
            </Tab>
            
            <Tab key="completed" title="Completed">
              <AllowlistBrowser
                communityId={communityId}
                showCreateButton={false}
              />
            </Tab>
            
            <Tab key="all" title="All">
              <AllowlistBrowser
                communityId={communityId}
                showCreateButton={false}
              />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Modals */}
      {renderCreationModal()}
      {renderAnalyticsModal()}
      {renderConfirmationModal()}
    </div>
  );
};

export default AllowlistManagement;