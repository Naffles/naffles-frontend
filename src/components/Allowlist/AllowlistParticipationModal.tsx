'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Card, CardBody, Chip, Progress, Divider, Checkbox, Link } from '@nextui-org/react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import { AccessibleInput } from '../Accessibility/AccessibleInput';
import { AccessibleModal } from '../Accessibility/AccessibleModal';
import SocialTaskTracker from './SocialTaskTracker';
import { colors, spacing } from '../../styles/design-system/tokens';
import { Allowlist, AllowlistParticipationModalProps, AllowlistParticipationFormData, SocialTaskCompletion } from './types';

/**
 * AllowlistParticipationModal Component
 * 
 * Modal for participating in allowlists with social task completion,
 * access requirement verification, and entry submission.
 */
const AllowlistParticipationModal: React.FC<AllowlistParticipationModalProps> = ({
  allowlist,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'requirements' | 'tasks' | 'entry' | 'confirmation'>('requirements');
  const [walletAddress, setWalletAddress] = useState('');
  const [socialTaskCompletions, setSocialTaskCompletions] = useState<{ [taskId: string]: SocialTaskCompletion }>({});
  const [accessRequirementsMet, setAccessRequirementsMet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userBalance, setUserBalance] = useState<{ [tokenType: string]: string }>({});
  const [hasExistingParticipation, setHasExistingParticipation] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      checkExistingParticipation();
      loadUserBalance();
      verifyAccessRequirements();
    }
  }, [isOpen, allowlist._id]);

  const resetForm = () => {
    setStep('requirements');
    setWalletAddress('');
    setSocialTaskCompletions({});
    setAccessRequirementsMet(false);
    setIsSubmitting(false);
    setHasExistingParticipation(false);
    setAgreedToTerms(false);
  };

  const checkExistingParticipation = async () => {
    try {
      const response = await fetch(`/api/allowlists/${allowlist._id}/participation`);
      if (response.ok) {
        setHasExistingParticipation(true);
      }
    } catch (error) {
      // User hasn't participated yet
      setHasExistingParticipation(false);
    }
  };

  const loadUserBalance = async () => {
    try {
      const response = await fetch('/api/user/balance');
      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.data.balances || {});
      }
    } catch (error) {
      console.error('Error loading user balance:', error);
    }
  };

  const verifyAccessRequirements = async () => {
    if (!allowlist.accessRequirements || allowlist.accessRequirements.length === 0) {
      setAccessRequirementsMet(true);
      return;
    }

    try {
      const response = await fetch(`/api/allowlists/${allowlist._id}/verify-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });

      if (response.ok) {
        const data = await response.json();
        setAccessRequirementsMet(data.data.requirementsMet);
      }
    } catch (error) {
      console.error('Error verifying access requirements:', error);
      setAccessRequirementsMet(false);
    }
  };

  const handleSocialTaskComplete = (taskId: string, verificationData?: any) => {
    const task = allowlist.socialTasks.find(t => t.taskId === taskId);
    if (!task) return;

    setSocialTaskCompletions(prev => ({
      ...prev,
      [taskId]: {
        taskId,
        taskType: task.taskType,
        completed: true,
        completedAt: new Date().toISOString(),
        verificationData,
        pointsAwarded: task.pointsReward
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData: AllowlistParticipationFormData = {
        walletAddress,
        socialTaskCompletions: Object.fromEntries(
          Object.entries(socialTaskCompletions).map(([taskId, completion]) => [
            taskId,
            {
              completed: completion.completed,
              verificationData: completion.verificationData
            }
          ])
        )
      };

      const response = await fetch(`/api/allowlists/${allowlist._id}/enter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        onSuccess?.(result.data);
        onClose();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to enter allowlist');
      }
    } catch (error) {
      console.error('Error entering allowlist:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToTasks = () => {
    return accessRequirementsMet && walletAddress.trim() !== '';
  };

  const canProceedToEntry = () => {
    const requiredTasks = allowlist.socialTasks.filter(task => task.required);
    const completedRequiredTasks = requiredTasks.filter(task => 
      socialTaskCompletions[task.taskId]?.completed
    );
    return completedRequiredTasks.length === requiredTasks.length;
  };

  const canSubmit = () => {
    const hasEnoughBalance = parseFloat(userBalance[allowlist.entryPrice.tokenType] || '0') >= 
                            parseFloat(allowlist.entryPrice.amount);
    return canProceedToEntry() && hasEnoughBalance && agreedToTerms;
  };

  const getTimeRemaining = () => {
    const endTime = new Date(allowlist.endTime);
    const now = new Date();
    const timeLeft = endTime.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Ended';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const renderRequirementsStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Entry Requirements</h3>
        
        <div className="space-y-4">
          <AccessibleInput
            label="Wallet Address"
            placeholder="Enter your wallet address"
            value={walletAddress}
            onValueChange={setWalletAddress}
            isRequired
            description="This wallet will be used for verification and prize distribution"
          />

          {allowlist.accessRequirements && allowlist.accessRequirements.length > 0 && (
            <Card>
              <CardBody className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Access Requirements</h4>
                <div className="space-y-2">
                  {allowlist.accessRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {accessRequirementsMet ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm text-gray-700">
                        {requirement.type === 'nft_ownership' && `Own NFT from ${requirement.contractAddress}`}
                        {requirement.type === 'token_balance' && `Hold ${requirement.minimumAmount} tokens`}
                        {requirement.type === 'community_member' && 'Community membership required'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Entry Details</p>
                <ul className="space-y-1">
                  <li>• Entry Price: {allowlist.entryPrice.amount === '0' ? 'Free' : `${allowlist.entryPrice.amount} ${allowlist.entryPrice.tokenType}`}</li>
                  <li>• Winners: {allowlist.winnerCount === 'everyone' ? 'Everyone wins' : `${allowlist.winnerCount} winners`}</li>
                  <li>• Time Remaining: {getTimeRemaining()}</li>
                  {allowlist.profitGuaranteePercentage > 0 && (
                    <li>• Profit Guarantee: {allowlist.profitGuaranteePercentage}% for losers</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTasksStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Social Tasks</h3>
        
        {allowlist.socialTasks.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No social tasks required for this allowlist</p>
          </div>
        ) : (
          <SocialTaskTracker
            tasks={allowlist.socialTasks}
            completions={Object.values(socialTaskCompletions)}
            onTaskComplete={handleSocialTaskComplete}
          />
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {Object.values(socialTaskCompletions).filter(c => c.completed).length} / {allowlist.socialTasks.length}
            </span>
          </div>
          <Progress
            value={(Object.values(socialTaskCompletions).filter(c => c.completed).length / allowlist.socialTasks.length) * 100}
            color="primary"
            className="mb-4"
          />
        </div>
      </div>
    </div>
  );

  const renderEntryStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Entry</h3>
        
        <div className="space-y-4">
          <Card>
            <CardBody className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Entry Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet Address:</span>
                  <span className="font-mono text-gray-900">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entry Price:</span>
                  <span className="font-medium text-gray-900">
                    {allowlist.entryPrice.amount === '0' ? 'Free' : `${allowlist.entryPrice.amount} ${allowlist.entryPrice.tokenType}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasks Completed:</span>
                  <span className="font-medium text-gray-900">
                    {Object.values(socialTaskCompletions).filter(c => c.completed).length} / {allowlist.socialTasks.length}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {allowlist.entryPrice.amount !== '0' && (
            <Card>
              <CardBody className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Balance Check</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your {allowlist.entryPrice.tokenType} Balance:</span>
                  <span className={`font-medium ${
                    parseFloat(userBalance[allowlist.entryPrice.tokenType] || '0') >= parseFloat(allowlist.entryPrice.amount)
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {userBalance[allowlist.entryPrice.tokenType] || '0'} {allowlist.entryPrice.tokenType}
                  </span>
                </div>
                
                {parseFloat(userBalance[allowlist.entryPrice.tokenType] || '0') < parseFloat(allowlist.entryPrice.amount) && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm text-red-700">
                        <p className="font-medium">Insufficient Balance</p>
                        <p>You need at least {allowlist.entryPrice.amount} {allowlist.entryPrice.tokenType} to enter this allowlist.</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          <div className="flex items-start space-x-3">
            <Checkbox
              isSelected={agreedToTerms}
              onValueChange={setAgreedToTerms}
            />
            <div className="text-sm text-gray-600">
              I agree to the{' '}
              <Link href="/terms" size="sm" isExternal>
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" size="sm" isExternal>
                Privacy Policy
              </Link>
              . I understand that entry fees are non-refundable except as specified in the profit guarantee terms.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepIndicator = () => {
    const steps = [
      { key: 'requirements', label: 'Requirements' },
      { key: 'tasks', label: 'Tasks' },
      { key: 'entry', label: 'Entry' }
    ];

    const currentStepIndex = steps.findIndex(s => s.key === step);

    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((stepItem, index) => (
          <React.Fragment key={stepItem.key}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                index <= currentStepIndex
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-1 mx-2 transition-colors ${
                  index < currentStepIndex ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (hasExistingParticipation) {
    return (
      <AccessibleModal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader>Already Participating</ModalHeader>
          <ModalBody>
            <div className="text-center py-6">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                You're already in this allowlist!
              </h3>
              <p className="text-gray-600">
                You have successfully entered this allowlist. You'll be notified if you're selected as a winner.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </AccessibleModal>
    );
  }

  return (
    <AccessibleModal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Join Allowlist</h2>
          <p className="text-sm text-gray-600 font-normal">{allowlist.title}</p>
        </ModalHeader>
        
        <ModalBody>
          {renderStepIndicator()}
          
          {step === 'requirements' && renderRequirementsStep()}
          {step === 'tasks' && renderTasksStep()}
          {step === 'entry' && renderEntryStep()}
        </ModalBody>
        
        <ModalFooter>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              {step !== 'requirements' && (
                <Button
                  variant="flat"
                  onPress={() => {
                    if (step === 'tasks') setStep('requirements');
                    if (step === 'entry') setStep('tasks');
                  }}
                >
                  Back
                </Button>
              )}
              
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
            </div>

            <div>
              {step === 'requirements' && (
                <AccessibleButton
                  color="primary"
                  onPress={() => setStep('tasks')}
                  isDisabled={!canProceedToTasks()}
                >
                  Next
                </AccessibleButton>
              )}
              
              {step === 'tasks' && (
                <AccessibleButton
                  color="primary"
                  onPress={() => setStep('entry')}
                  isDisabled={!canProceedToEntry()}
                >
                  Next
                </AccessibleButton>
              )}
              
              {step === 'entry' && (
                <AccessibleButton
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={!canSubmit()}
                >
                  Enter Allowlist
                </AccessibleButton>
              )}
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </AccessibleModal>
  );
};

export default AllowlistParticipationModal;