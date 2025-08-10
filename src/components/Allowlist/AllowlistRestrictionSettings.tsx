'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Switch, Button, Divider, Chip, Select, SelectItem } from '@nextui-org/react';
import { Cog6ToothIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import { AccessibleInput } from '../Accessibility/AccessibleInput';
import { colors, spacing } from '../../styles/design-system/tokens';
import { AllowlistConfiguration } from './types';

interface AllowlistRestrictionSettingsProps {
  onUpdate?: () => void;
  className?: string;
}

/**
 * AllowlistRestrictionSettings Component
 * 
 * Administrative interface for configuring allowlist system restrictions,
 * limits, and platform-wide settings.
 */
const AllowlistRestrictionSettings: React.FC<AllowlistRestrictionSettingsProps> = ({
  onUpdate,
  className = ''
}) => {
  const [configuration, setConfiguration] = useState<AllowlistConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/allowlists/configuration');
      if (response.ok) {
        const data = await response.json();
        setConfiguration(data.data);
      } else {
        console.error('Failed to load configuration');
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigurationChange = (field: keyof AllowlistConfiguration, value: any) => {
    if (!configuration) return;

    setConfiguration(prev => ({
      ...prev!,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!configuration || !hasChanges) return;

    setSaving(true);
    
    try {
      const response = await fetch('/api/admin/allowlists/configuration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configuration)
      });

      if (response.ok) {
        setHasChanges(false);
        onUpdate?.();
      } else {
        const error = await response.json();
        console.error('Failed to save configuration:', error.message);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    loadConfiguration();
    setHasChanges(false);
  };

  if (loading || !configuration) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-600">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">General Settings</h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AccessibleInput
              type="number"
              label="Max Live Allowlists per Community"
              value={configuration.maxLiveAllowlistsPerCommunity.toString()}
              onValueChange={(value) => handleConfigurationChange('maxLiveAllowlistsPerCommunity', parseInt(value) || 5)}
              min={1}
              max={50}
              description="Maximum number of active allowlists a community can have simultaneously"
            />

            <AccessibleInput
              type="number"
              label="Platform Fee Percentage"
              value={configuration.platformFeePercentage.toString()}
              onValueChange={(value) => handleConfigurationChange('platformFeePercentage', parseFloat(value) || 0)}
              min={0}
              max={50}
              step={0.1}
              endContent={<span className="text-gray-500">%</span>}
              description="Percentage fee taken from allowlist creator profits"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Restrict Allowlist Creation</p>
              <p className="text-sm text-gray-600">
                When enabled, only authorized users can create allowlists
              </p>
            </div>
            <Switch
              isSelected={configuration.allowlistCreationRestricted}
              onValueChange={(value) => handleConfigurationChange('allowlistCreationRestricted', value)}
            />
          </div>

          {configuration.allowlistCreationRestricted && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <InformationCircleIcon className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Allowlist Creation Restricted</p>
                  <p>
                    Only users with special permissions or community owners can create allowlists.
                    This setting can be overridden per community.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Allowlist Limits */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Allowlist Limits</h3>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AccessibleInput
              type="number"
              label="Maximum Winner Count"
              value={configuration.maxWinnerCount.toString()}
              onValueChange={(value) => handleConfigurationChange('maxWinnerCount', parseInt(value) || 100000)}
              min={1}
              max={1000000}
              description="Maximum number of winners allowed per allowlist"
            />

            <AccessibleInput
              type="number"
              label="Default Profit Guarantee %"
              value={configuration.defaultProfitGuaranteePercentage.toString()}
              onValueChange={(value) => handleConfigurationChange('defaultProfitGuaranteePercentage', parseFloat(value) || 0)}
              min={0}
              max={100}
              step={1}
              endContent={<span className="text-gray-500">%</span>}
              description="Default profit guarantee percentage for new allowlists"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AccessibleInput
              type="number"
              label="Minimum Duration (hours)"
              value={configuration.minDuration.toString()}
              onValueChange={(value) => handleConfigurationChange('minDuration', parseInt(value) || 1)}
              min={1}
              max={168}
              endContent={<span className="text-gray-500">hours</span>}
              description="Minimum allowlist duration"
            />

            <AccessibleInput
              type="number"
              label="Maximum Duration (hours)"
              value={configuration.maxDuration.toString()}
              onValueChange={(value) => handleConfigurationChange('maxDuration', parseInt(value) || 720)}
              min={1}
              max={8760}
              endContent={<span className="text-gray-500">hours</span>}
              description="Maximum allowlist duration (720h = 30 days)"
            />
          </div>
        </CardBody>
      </Card>

      {/* Supported Tokens */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Supported Token Types</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Configure which token types are allowed for allowlist entry fees
            </p>
            
            <div className="flex flex-wrap gap-2">
              {configuration.supportedTokenTypes.map((tokenType) => (
                <Chip
                  key={tokenType}
                  color="primary"
                  variant="flat"
                  onClose={() => {
                    const newTokenTypes = configuration.supportedTokenTypes.filter(t => t !== tokenType);
                    handleConfigurationChange('supportedTokenTypes', newTokenTypes);
                  }}
                >
                  {tokenType}
                </Chip>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Select
                placeholder="Add token type"
                className="max-w-xs"
                onSelectionChange={(keys) => {
                  const selectedToken = Array.from(keys)[0] as string;
                  if (selectedToken && !configuration.supportedTokenTypes.includes(selectedToken)) {
                    handleConfigurationChange('supportedTokenTypes', [...configuration.supportedTokenTypes, selectedToken]);
                  }
                }}
              >
                <SelectItem key="ETH" value="ETH">ETH</SelectItem>
                <SelectItem key="SOL" value="SOL">SOL</SelectItem>
                <SelectItem key="MATIC" value="MATIC">MATIC</SelectItem>
                <SelectItem key="USDC" value="USDC">USDC</SelectItem>
                <SelectItem key="USDT" value="USDT">USDT</SelectItem>
                <SelectItem key="BTC" value="BTC">BTC</SelectItem>
                <SelectItem key="points" value="points">Points</SelectItem>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Required Social Tasks */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Required Social Task Types</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Configure which social task types are available for allowlists
            </p>
            
            <div className="flex flex-wrap gap-2">
              {configuration.requiredSocialTasks.map((taskType) => (
                <Chip
                  key={taskType}
                  color="secondary"
                  variant="flat"
                  onClose={() => {
                    const newTaskTypes = configuration.requiredSocialTasks.filter(t => t !== taskType);
                    handleConfigurationChange('requiredSocialTasks', newTaskTypes);
                  }}
                >
                  {taskType.replace('_', ' ')}
                </Chip>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Select
                placeholder="Add task type"
                className="max-w-xs"
                onSelectionChange={(keys) => {
                  const selectedTask = Array.from(keys)[0] as string;
                  if (selectedTask && !configuration.requiredSocialTasks.includes(selectedTask)) {
                    handleConfigurationChange('requiredSocialTasks', [...configuration.requiredSocialTasks, selectedTask]);
                  }
                }}
              >
                <SelectItem key="twitter_follow" value="twitter_follow">Twitter Follow</SelectItem>
                <SelectItem key="discord_join" value="discord_join">Discord Join</SelectItem>
                <SelectItem key="telegram_join" value="telegram_join">Telegram Join</SelectItem>
                <SelectItem key="custom" value="custom">Custom Task</SelectItem>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      <Divider />

      {/* Save Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {hasChanges ? (
            <span className="text-orange-600">You have unsaved changes</span>
          ) : (
            <span>All changes saved</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="flat"
            onPress={handleReset}
            isDisabled={!hasChanges}
          >
            Reset
          </Button>
          
          <AccessibleButton
            color="primary"
            onPress={handleSave}
            isLoading={saving}
            isDisabled={!hasChanges}
          >
            Save Configuration
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
};

export default AllowlistRestrictionSettings;