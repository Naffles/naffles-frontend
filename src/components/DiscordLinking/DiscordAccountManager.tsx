/**
 * Discord Account Manager Component
 * Provides interface for Discord account linking and management
 */

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Avatar, Chip, Divider, Spinner } from '@nextui-org/react';
import { FaDiscord, FaUnlink, FaSync, FaCheck, FaExclamationTriangle, FaUserShield } from 'react-icons/fa';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  verified: boolean;
}

interface DiscordLinkingStatus {
  isLinked: boolean;
  isActive?: boolean;
  needsRefresh?: boolean;
  discordUser?: DiscordUser;
  linkedAt?: string;
  lastVerified?: string;
  scopes?: string[];
}

interface ManagementData {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  discord: DiscordLinkingStatus;
  actions: {
    canLink: boolean;
    canUnlink: boolean;
    canRefresh: boolean;
    canVerify: boolean;
  };
}

interface DiscordAccountManagerProps {
  onLinkingChange?: (isLinked: boolean) => void;
  showAdvancedOptions?: boolean;
  className?: string;
}

const DiscordAccountManager: React.FC<DiscordAccountManagerProps> = ({
  onLinkingChange,
  showAdvancedOptions = false,
  className = ''
}) => {
  const [managementData, setManagementData] = useState<ManagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load management data
  useEffect(() => {
    loadManagementData();
  }, []);

  const loadManagementData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/discord/oauth/management', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load Discord account data');
      }

      setManagementData(data.data);
      onLinkingChange?.(data.data.discord.isLinked);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Discord account data');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkDiscord = async () => {
    try {
      setActionLoading('linking');
      setError(null);
      setSuccess(null);

      // Generate authorization URL
      const authResponse = await fetch('/api/discord/oauth/authorize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        throw new Error(authData.message || 'Failed to generate Discord authorization URL');
      }

      // Store state for callback verification
      localStorage.setItem('discord_oauth_state', authData.state);

      // Redirect to Discord OAuth
      window.location.href = authData.authUrl;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate Discord linking');
      setActionLoading(null);
    }
  };

  const handleUnlinkDiscord = async () => {
    if (!confirm('Are you sure you want to unlink your Discord account? This will remove Discord-based features and role verification.')) {
      return;
    }

    try {
      setActionLoading('unlinking');
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/discord/oauth/unlink', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'user_request' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to unlink Discord account');
      }

      setSuccess('Discord account successfully unlinked');
      await loadManagementData();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlink Discord account');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefreshToken = async () => {
    try {
      setActionLoading('refreshing');
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/discord/oauth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to refresh Discord token');
      }

      setSuccess('Discord token refreshed successfully');
      await loadManagementData();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh Discord token');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyAccount = async () => {
    try {
      setActionLoading('verifying');
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/discord/oauth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify Discord account');
      }

      setSuccess('Discord account verified successfully');
      await loadManagementData();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify Discord account');
    } finally {
      setActionLoading(null);
    }
  };

  const getDiscordAvatarUrl = (user: DiscordUser) => {
    if (!user.avatar) {
      return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;
    }
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
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

  if (loading) {
    return (
      <Card className={className}>
        <CardBody className="flex items-center justify-center py-8">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading Discord account information...</p>
        </CardBody>
      </Card>
    );
  }

  if (!managementData) {
    return (
      <Card className={className}>
        <CardBody className="flex items-center justify-center py-8">
          <FaExclamationTriangle className="text-4xl text-warning mb-4" />
          <p className="text-gray-600">Failed to load Discord account information</p>
          <Button 
            color="primary" 
            variant="light" 
            onPress={loadManagementData}
            className="mt-4"
          >
            Retry
          </Button>
        </CardBody>
      </Card>
    );
  }

  const { user, discord, actions } = managementData;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error/Success Messages */}
      {error && (
        <Card className="border-danger-200 bg-danger-50">
          <CardBody>
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-danger text-xl" />
              <p className="text-danger">{error}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {success && (
        <Card className="border-success-200 bg-success-50">
          <CardBody>
            <div className="flex items-center gap-3">
              <FaCheck className="text-success text-xl" />
              <p className="text-success">{success}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Main Discord Account Card */}
      <Card>
        <CardHeader className="flex gap-3">
          <FaDiscord className="text-3xl text-[#5865F2]" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Discord Account</p>
            <p className="text-small text-gray-500">
              {discord.isLinked ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          {discord.isLinked && discord.discordUser ? (
            <>
              {/* Discord User Info */}
              <div className="flex items-center gap-4">
                <Avatar
                  src={getDiscordAvatarUrl(discord.discordUser)}
                  size="lg"
                  className="border-2 border-[#5865F2]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {discord.discordUser.username}#{discord.discordUser.discriminator}
                    </h3>
                    {discord.discordUser.verified && (
                      <Chip
                        startContent={<FaCheck />}
                        color="success"
                        variant="flat"
                        size="sm"
                      >
                        Verified
                      </Chip>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Discord ID: {discord.discordUser.id}
                  </p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex flex-wrap gap-2">
                <Chip
                  color={discord.isActive ? 'success' : 'danger'}
                  variant="flat"
                  size="sm"
                >
                  {discord.isActive ? 'Active' : 'Inactive'}
                </Chip>
                
                {discord.needsRefresh && (
                  <Chip color="warning" variant="flat" size="sm">
                    Token Needs Refresh
                  </Chip>
                )}

                {discord.scopes && discord.scopes.length > 0 && (
                  <Chip color="primary" variant="flat" size="sm">
                    {discord.scopes.length} Permission{discord.scopes.length !== 1 ? 's' : ''}
                  </Chip>
                )}
              </div>

              {/* Timestamps */}
              <div className="text-sm text-gray-500 space-y-1">
                {discord.linkedAt && (
                  <p>Linked: {formatDate(discord.linkedAt)}</p>
                )}
                {discord.lastVerified && (
                  <p>Last verified: {formatDate(discord.lastVerified)}</p>
                )}
              </div>

              {/* Advanced Information */}
              {showAdvancedOptions && discord.scopes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-1">
                    {discord.scopes.map((scope) => (
                      <Chip key={scope} size="sm" variant="flat">
                        {scope}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {actions.canUnlink && (
                  <Button
                    color="danger"
                    variant="light"
                    startContent={<FaUnlink />}
                    onPress={handleUnlinkDiscord}
                    isLoading={actionLoading === 'unlinking'}
                    isDisabled={!!actionLoading}
                  >
                    Unlink Account
                  </Button>
                )}

                {actions.canRefresh && (
                  <Button
                    color="warning"
                    variant="light"
                    startContent={<FaSync />}
                    onPress={handleRefreshToken}
                    isLoading={actionLoading === 'refreshing'}
                    isDisabled={!!actionLoading}
                  >
                    Refresh Token
                  </Button>
                )}

                {actions.canVerify && (
                  <Button
                    color="primary"
                    variant="light"
                    startContent={<FaUserShield />}
                    onPress={handleVerifyAccount}
                    isLoading={actionLoading === 'verifying'}
                    isDisabled={!!actionLoading}
                  >
                    Verify Account
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Not Linked State */}
              <div className="text-center py-8">
                <FaDiscord className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect Your Discord Account</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Link your Discord account to access community features, role verification, 
                  and enhanced platform functionality.
                </p>
                
                {actions.canLink && (
                  <Button
                    color="primary"
                    size="lg"
                    startContent={<FaDiscord />}
                    onPress={handleLinkDiscord}
                    isLoading={actionLoading === 'linking'}
                    isDisabled={!!actionLoading}
                    className="bg-[#5865F2] hover:bg-[#4752C4]"
                  >
                    Connect Discord
                  </Button>
                )}
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* User Information Card */}
      {showAdvancedOptions && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Account Information</h3>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Username</p>
                <p className="text-gray-600">{user.username}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Email</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Account Created</p>
                <p className="text-gray-600">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">User ID</p>
                <p className="text-gray-600 font-mono text-xs">{user.id}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default DiscordAccountManager;