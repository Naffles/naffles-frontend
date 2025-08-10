'use client';

import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { Input, Textarea, Switch, Select, SelectItem } from '@nextui-org/react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { colors, spacing, typography } from '@/styles/design-system/tokens';

interface CommunityCreationData {
  name: string;
  description: string;
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
}

interface CommunityCreationFormProps {
  onSubmit: (data: CommunityCreationData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CommunityCreationForm: React.FC<CommunityCreationFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CommunityCreationData>({
    name: '',
    description: '',
    pointsConfiguration: {
      pointsName: 'Community Points',
      pointsSymbol: 'CP',
      initialBalance: 100,
      enableAchievements: true,
      enableLeaderboards: true,
    },
    features: {
      enableMarketplace: true,
      enableSocialTasks: true,
      enableAllowlists: true,
    },
    accessControl: {
      isPublic: true,
      requireApproval: false,
      nftRequirements: [],
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Community name is required';
      }
      if (formData.name.length > 100) {
        newErrors.name = 'Community name must be 100 characters or less';
      }
      if (formData.description.length > 500) {
        newErrors.description = 'Description must be 500 characters or less';
      }
    }

    if (step === 2) {
      if (!formData.pointsConfiguration.pointsName.trim()) {
        newErrors.pointsName = 'Points name is required';
      }
      if (!formData.pointsConfiguration.pointsSymbol.trim()) {
        newErrors.pointsSymbol = 'Points symbol is required';
      }
      if (formData.pointsConfiguration.pointsSymbol.length > 10) {
        newErrors.pointsSymbol = 'Points symbol must be 10 characters or less';
      }
      if (formData.pointsConfiguration.initialBalance < 0) {
        newErrors.initialBalance = 'Initial balance cannot be negative';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error creating community:', error);
      }
    }
  };

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step}
          </div>
          {step < 4 && (
            <div
              className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600">
          Set up the basic details for your community
        </p>
      </div>

      <Input
        label="Community Name"
        placeholder="Enter your community name"
        value={formData.name}
        onChange={(e) => updateFormData('name', e.target.value)}
        isInvalid={!!errors.name}
        errorMessage={errors.name}
        maxLength={100}
        description={`${formData.name.length}/100 characters`}
        required
      />

      <Textarea
        label="Description"
        placeholder="Describe your community and its purpose"
        value={formData.description}
        onChange={(e) => updateFormData('description', e.target.value)}
        isInvalid={!!errors.description}
        errorMessage={errors.description}
        maxLength={500}
        description={`${formData.description.length}/500 characters`}
        minRows={3}
        maxRows={6}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Points System
        </h2>
        <p className="text-gray-600">
          Configure your community's points and rewards system
        </p>
      </div>

      <Input
        label="Points Name"
        placeholder="e.g., Community Points, Tokens, Credits"
        value={formData.pointsConfiguration.pointsName}
        onChange={(e) => updateFormData('pointsConfiguration.pointsName', e.target.value)}
        isInvalid={!!errors.pointsName}
        errorMessage={errors.pointsName}
        required
      />

      <Input
        label="Points Symbol"
        placeholder="e.g., CP, TKN, PTS"
        value={formData.pointsConfiguration.pointsSymbol}
        onChange={(e) => updateFormData('pointsConfiguration.pointsSymbol', e.target.value)}
        isInvalid={!!errors.pointsSymbol}
        errorMessage={errors.pointsSymbol}
        maxLength={10}
        required
      />

      <Input
        type="number"
        label="Initial Balance"
        placeholder="Starting points for new members"
        value={formData.pointsConfiguration.initialBalance.toString()}
        onChange={(e) => updateFormData('pointsConfiguration.initialBalance', parseInt(e.target.value) || 0)}
        isInvalid={!!errors.initialBalance}
        errorMessage={errors.initialBalance}
        min={0}
      />

      <div className="space-y-4">
        <Switch
          isSelected={formData.pointsConfiguration.enableAchievements}
          onValueChange={(value) => updateFormData('pointsConfiguration.enableAchievements', value)}
        >
          Enable Achievements System
        </Switch>
        <p className="text-sm text-gray-500 ml-12">
          Allow members to earn achievements and badges
        </p>

        <Switch
          isSelected={formData.pointsConfiguration.enableLeaderboards}
          onValueChange={(value) => updateFormData('pointsConfiguration.enableLeaderboards', value)}
        >
          Enable Leaderboards
        </Switch>
        <p className="text-sm text-gray-500 ml-12">
          Show member rankings and top performers
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Community Features
        </h2>
        <p className="text-gray-600">
          Choose which features to enable for your community
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Community Marketplace
                </h3>
                <p className="text-sm text-gray-600">
                  Allow members to purchase digital products with points
                </p>
              </div>
              <Switch
                isSelected={formData.features.enableMarketplace}
                onValueChange={(value) => updateFormData('features.enableMarketplace', value)}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Social Tasks
                </h3>
                <p className="text-sm text-gray-600">
                  Create Twitter, Discord, and Telegram engagement tasks
                </p>
              </div>
              <Switch
                isSelected={formData.features.enableSocialTasks}
                onValueChange={(value) => updateFormData('features.enableSocialTasks', value)}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Allowlists
                </h3>
                <p className="text-sm text-gray-600">
                  Create and manage allowlist campaigns for your community
                </p>
              </div>
              <Switch
                isSelected={formData.features.enableAllowlists}
                onValueChange={(value) => updateFormData('features.enableAllowlists', value)}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Access Control
        </h2>
        <p className="text-gray-600">
          Configure who can join your community
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Public Community
                </h3>
                <p className="text-sm text-gray-600">
                  Anyone can discover and join your community
                </p>
              </div>
              <Switch
                isSelected={formData.accessControl.isPublic}
                onValueChange={(value) => updateFormData('accessControl.isPublic', value)}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Require Approval
                </h3>
                <p className="text-sm text-gray-600">
                  Manually approve new member requests
                </p>
              </div>
              <Switch
                isSelected={formData.accessControl.requireApproval}
                onValueChange={(value) => updateFormData('accessControl.requireApproval', value)}
              />
            </div>
          </CardBody>
        </Card>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            NFT Requirements (Optional)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Require members to hold specific NFTs to join
          </p>
          <Button
            variant="bordered"
            size="sm"
            className="w-full"
            isDisabled
          >
            Add NFT Requirement (Coming Soon)
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="w-full">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
              Create Community
            </h1>
            {renderStepIndicator()}
          </div>
        </CardHeader>
        
        <CardBody className="pt-0">
          <div className="min-h-[400px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="bordered"
                  onClick={handlePrevious}
                  isDisabled={isLoading}
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="light"
                onClick={onCancel}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  color="primary"
                  onClick={handleNext}
                  isDisabled={isLoading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  color="primary"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                >
                  Create Community
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CommunityCreationForm;