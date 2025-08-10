'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, SelectItem, Switch, Divider, Chip, Progress } from '@nextui-org/react';
import { PlusIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import { AccessibleInput } from '../Accessibility/AccessibleInput';
import { colors, spacing, typography, shadows } from '../../styles/design-system/tokens';
import { AllowlistCreationFormData, AllowlistCreationFormProps, SocialTaskFormData, AccessRequirementFormData } from './types';

/**
 * AllowlistCreationForm Component
 * 
 * Comprehensive form for creating allowlists with social task configuration,
 * access requirements, and entry settings.
 */
const AllowlistCreationForm: React.FC<AllowlistCreationFormProps> = ({
  communityId,
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [communityLimits, setCommunityLimits] = useState<any>(null);
  const [availableTokens] = useState(['ETH', 'SOL', 'MATIC', 'USDC', 'USDT', 'BTC', 'points']);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<AllowlistCreationFormData>({
    defaultValues: {
      title: '',
      description: '',
      communityId: communityId || '',
      entryPrice: {
        tokenType: 'points',
        amount: '0'
      },
      winnerCount: 10,
      profitGuaranteePercentage: 0,
      duration: 24,
      socialTasks: [],
      accessRequirements: [],
      maxEntries: undefined,
      allowDuplicateWallets: false
    },
    mode: 'onChange'
  });

  const {
    fields: socialTaskFields,
    append: appendSocialTask,
    remove: removeSocialTask
  } = useFieldArray({
    control,
    name: 'socialTasks'
  });

  const {
    fields: accessRequirementFields,
    append: appendAccessRequirement,
    remove: removeAccessRequirement
  } = useFieldArray({
    control,
    name: 'accessRequirements'
  });

  const watchedValues = watch();
  const totalSteps = 4;

  // Load community limits on mount
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

  const handleAddSocialTask = () => {
    const newTask: SocialTaskFormData = {
      taskType: 'twitter_follow',
      required: true,
      pointsReward: 10,
      verificationData: {
        twitter: {
          username: '',
          action: 'follow',
          targetUrl: ''
        }
      }
    };
    appendSocialTask(newTask);
  };

  const handleAddAccessRequirement = () => {
    const newRequirement: AccessRequirementFormData = {
      type: 'nft_ownership',
      contractAddress: '',
      minimumAmount: '1'
    };
    appendAccessRequirement(newRequirement);
  };

  const onSubmit = async (data: AllowlistCreationFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/allowlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        onSuccess?.(result.data);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create allowlist');
      }
    } catch (error) {
      console.error('Error creating allowlist:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <React.Fragment key={index}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              index + 1 <= currentStep
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-12 h-1 mx-2 transition-colors ${
                index + 1 < currentStep ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Title is required', maxLength: { value: 200, message: 'Title must be less than 200 characters' } }}
            render={({ field }) => (
              <AccessibleInput
                {...field}
                label="Allowlist Title"
                placeholder="Enter a descriptive title for your allowlist"
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
                isRequired
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required', maxLength: { value: 2000, message: 'Description must be less than 2000 characters' } }}
            render={({ field }) => (
              <div>
                <Textarea
                  {...field}
                  label="Description"
                  placeholder="Describe your allowlist, what participants can expect to win, and any special requirements"
                  minRows={4}
                  maxRows={8}
                  isInvalid={!!errors.description}
                  errorMessage={errors.description?.message}
                  isRequired
                />
                <p className="text-sm text-gray-500 mt-1">
                  {field.value?.length || 0}/2000 characters
                </p>
              </div>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="duration"
              control={control}
              rules={{ required: 'Duration is required', min: { value: 1, message: 'Duration must be at least 1 hour' } }}
              render={({ field }) => (
                <AccessibleInput
                  {...field}
                  type="number"
                  label="Duration (hours)"
                  placeholder="24"
                  min={1}
                  max={720}
                  isInvalid={!!errors.duration}
                  errorMessage={errors.duration?.message}
                  isRequired
                  endContent={<span className="text-gray-500">hours</span>}
                />
              )}
            />

            <Controller
              name="maxEntries"
              control={control}
              render={({ field }) => (
                <AccessibleInput
                  {...field}
                  type="number"
                  label="Max Entries (Optional)"
                  placeholder="No limit"
                  min={1}
                  endContent={<span className="text-gray-500">entries</span>}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderWinnerConfiguration = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Winner Configuration</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="winnerCount"
              control={control}
              rules={{ required: 'Winner count is required' }}
              render={({ field }) => (
                <div>
                  <AccessibleInput
                    {...field}
                    type="number"
                    label="Number of Winners"
                    placeholder="10"
                    min={1}
                    max={100000}
                    isInvalid={!!errors.winnerCount}
                    errorMessage={errors.winnerCount?.message}
                    isRequired
                    endContent={<span className="text-gray-500">winners</span>}
                  />
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => setValue('winnerCount', 'everyone' as any)}
                    >
                      Everyone Wins
                    </Button>
                  </div>
                </div>
              )}
            />

            <Controller
              name="profitGuaranteePercentage"
              control={control}
              render={({ field }) => (
                <div>
                  <AccessibleInput
                    {...field}
                    type="number"
                    label="Profit Guarantee %"
                    placeholder="0"
                    min={0}
                    max={100}
                    endContent={<span className="text-gray-500">%</span>}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Percentage of winner ticket sales distributed to losers
                  </p>
                </div>
              )}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Profit Guarantee System</p>
                <p>
                  When set above 0%, losing participants receive a portion of the winner ticket sales as compensation.
                  This creates a more engaging experience where everyone has a chance to benefit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEntryConfiguration = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Entry Configuration</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="entryPrice.tokenType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Entry Token Type"
                  placeholder="Select token type"
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    field.onChange(selectedKey);
                  }}
                >
                  {availableTokens.map((token) => (
                    <SelectItem key={token} value={token}>
                      {token}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="entryPrice.amount"
              control={control}
              rules={{ required: 'Entry amount is required', min: { value: 0, message: 'Amount must be 0 or greater' } }}
              render={({ field }) => (
                <AccessibleInput
                  {...field}
                  type="number"
                  label="Entry Amount"
                  placeholder="0"
                  min={0}
                  step="0.000001"
                  isInvalid={!!errors.entryPrice?.amount}
                  errorMessage={errors.entryPrice?.amount?.message}
                  isRequired
                  endContent={<span className="text-gray-500">{watchedValues.entryPrice?.tokenType}</span>}
                />
              )}
            />
          </div>

          <Controller
            name="allowDuplicateWallets"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Allow Duplicate Wallets</p>
                  <p className="text-sm text-gray-500">
                    Allow the same wallet address to enter multiple times
                  </p>
                </div>
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                />
              </div>
            )}
          />

          {watchedValues.entryPrice?.amount === '0' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <InformationCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-green-700">
                  <p className="font-medium mb-1">Free Allowlist</p>
                  <p>
                    This allowlist is free to enter. Price-related features will be disabled.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSocialTasksAndRequirements = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Tasks & Requirements</h3>
        
        {/* Social Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Social Tasks</h4>
            <AccessibleButton
              variant="flat"
              size="sm"
              onPress={handleAddSocialTask}
              startContent={<PlusIcon className="w-4 h-4" />}
            >
              Add Task
            </AccessibleButton>
          </div>

          {socialTaskFields.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No social tasks added yet</p>
              <p className="text-sm text-gray-400 mt-1">Add tasks to increase engagement</p>
            </div>
          ) : (
            <div className="space-y-4">
              {socialTaskFields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h5 className="font-medium text-gray-900">Task {index + 1}</h5>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => removeSocialTask(index)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                      name={`socialTasks.${index}.taskType`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Task Type"
                          selectedKeys={field.value ? [field.value] : []}
                          onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys)[0] as string;
                            field.onChange(selectedKey);
                          }}
                        >
                          <SelectItem key="twitter_follow" value="twitter_follow">Twitter Follow</SelectItem>
                          <SelectItem key="discord_join" value="discord_join">Discord Join</SelectItem>
                          <SelectItem key="telegram_join" value="telegram_join">Telegram Join</SelectItem>
                          <SelectItem key="custom" value="custom">Custom Task</SelectItem>
                        </Select>
                      )}
                    />

                    <Controller
                      name={`socialTasks.${index}.pointsReward`}
                      control={control}
                      render={({ field }) => (
                        <AccessibleInput
                          {...field}
                          type="number"
                          label="Points Reward"
                          min={0}
                          endContent={<span className="text-gray-500">pts</span>}
                        />
                      )}
                    />

                    <Controller
                      name={`socialTasks.${index}.required`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center justify-center">
                          <Switch
                            isSelected={field.value}
                            onValueChange={field.onChange}
                          >
                            Required
                          </Switch>
                        </div>
                      )}
                    />
                  </div>

                  {/* Task-specific configuration */}
                  {watchedValues.socialTasks?.[index]?.taskType === 'twitter_follow' && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name={`socialTasks.${index}.verificationData.twitter.username`}
                        control={control}
                        render={({ field }) => (
                          <AccessibleInput
                            {...field}
                            label="Twitter Username"
                            placeholder="@username"
                          />
                        )}
                      />
                      <Controller
                        name={`socialTasks.${index}.verificationData.twitter.action`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Action"
                            selectedKeys={field.value ? [field.value] : []}
                            onSelectionChange={(keys) => {
                              const selectedKey = Array.from(keys)[0] as string;
                              field.onChange(selectedKey);
                            }}
                          >
                            <SelectItem key="follow" value="follow">Follow</SelectItem>
                            <SelectItem key="retweet" value="retweet">Retweet</SelectItem>
                            <SelectItem key="like" value="like">Like</SelectItem>
                          </Select>
                        )}
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Access Requirements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Access Requirements</h4>
            <AccessibleButton
              variant="flat"
              size="sm"
              onPress={handleAddAccessRequirement}
              startContent={<PlusIcon className="w-4 h-4" />}
            >
              Add Requirement
            </AccessibleButton>
          </div>

          {accessRequirementFields.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No access requirements added</p>
              <p className="text-sm text-gray-400 mt-1">Add requirements to restrict access</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accessRequirementFields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h5 className="font-medium text-gray-900">Requirement {index + 1}</h5>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => removeAccessRequirement(index)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                      name={`accessRequirements.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Requirement Type"
                          selectedKeys={field.value ? [field.value] : []}
                          onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys)[0] as string;
                            field.onChange(selectedKey);
                          }}
                        >
                          <SelectItem key="nft_ownership" value="nft_ownership">NFT Ownership</SelectItem>
                          <SelectItem key="token_balance" value="token_balance">Token Balance</SelectItem>
                          <SelectItem key="community_member" value="community_member">Community Member</SelectItem>
                        </Select>
                      )}
                    />

                    {watchedValues.accessRequirements?.[index]?.type !== 'community_member' && (
                      <Controller
                        name={`accessRequirements.${index}.contractAddress`}
                        control={control}
                        render={({ field }) => (
                          <AccessibleInput
                            {...field}
                            label="Contract Address"
                            placeholder="0x..."
                          />
                        )}
                      />
                    )}

                    <Controller
                      name={`accessRequirements.${index}.minimumAmount`}
                      control={control}
                      render={({ field }) => (
                        <AccessibleInput
                          {...field}
                          type="number"
                          label="Minimum Amount"
                          placeholder="1"
                          min={1}
                        />
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderWinnerConfiguration();
      case 3:
        return renderEntryConfiguration();
      case 4:
        return renderSocialTasksAndRequirements();
      default:
        return renderBasicInformation();
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card className="p-6">
        <CardHeader className="pb-6">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Allowlist</h2>
            <p className="text-gray-600">
              Set up your allowlist with social tasks, access requirements, and winner configuration.
            </p>
            
            {communityLimits && !communityLimits.canCreateNew && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">
                  Community Limit Reached
                </p>
                <p className="text-red-600 text-sm">
                  This community has reached the maximum of {communityLimits.maxLiveAllowlists} live allowlists.
                  Please wait for existing allowlists to complete before creating new ones.
                </p>
              </div>
            )}
          </div>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepIndicator()}
            
            <div className="min-h-[500px]">
              {renderCurrentStep()}
            </div>

            <Divider className="my-8" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {currentStep > 1 && (
                  <Button
                    variant="flat"
                    onPress={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                )}
                
                {onCancel && (
                  <Button
                    variant="light"
                    onPress={onCancel}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {currentStep < totalSteps ? (
                  <AccessibleButton
                    color="primary"
                    onPress={() => setCurrentStep(currentStep + 1)}
                  >
                    Next
                  </AccessibleButton>
                ) : (
                  <AccessibleButton
                    type="submit"
                    color="primary"
                    isLoading={isSubmitting}
                    isDisabled={!isValid || (communityLimits && !communityLimits.canCreateNew)}
                  >
                    Create Allowlist
                  </AccessibleButton>
                )}
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AllowlistCreationForm;