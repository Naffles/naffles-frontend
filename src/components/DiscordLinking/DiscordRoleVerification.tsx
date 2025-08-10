/**
 * Discord Role Verification Component
 * Verifies user's Discord roles in specific servers
 */

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Divider, Spinner, Input } from '@nextui-org/react';
import { FaDiscord, FaUserShield, FaCheck, FaTimes, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

interface ServerRole {
    serverId: string;
    roles: string[];
    memberFound: boolean;
    error?: string;
}

interface RoleVerificationResult {
    discordUser: {
        id: string;
        username: string;
        discriminator: string;
        avatar: string | null;
        verified: boolean;
    };
    serverRoles: ServerRole;
}

interface DiscordRoleVerificationProps {
    serverId?: string;
    requiredRoleId?: string;
    onVerificationComplete?: (hasRole: boolean, roles: string[]) => void;
    className?: string;
}

const DiscordRoleVerification: React.FC<DiscordRoleVerificationProps> = ({
    serverId: initialServerId,
    requiredRoleId,
    onVerificationComplete,
    className = ''
}) => {
    const [serverId, setServerId] = useState(initialServerId || '');
    const [verificationResult, setVerificationResult] = useState<RoleVerificationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLinked, setIsLinked] = useState<boolean | null>(null);

    // Check Discord linking status on mount
    useEffect(() => {
        checkLinkingStatus();
    }, []);

    const checkLinkingStatus = async () => {
        try {
            const response = await fetch('/api/discord/oauth/status', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setIsLinked(data.isLinked && data.isActive);
            } else {
                setIsLinked(false);
            }
        } catch (err) {
            console.error('Error checking Discord linking status:', err);
            setIsLinked(false);
        }
    };

    const handleVerifyRoles = async () => {
        if (!serverId.trim()) {
            setError('Please enter a Discord server ID');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setVerificationResult(null);

            const response = await fetch(`/api/discord/oauth/roles/${serverId.trim()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to verify Discord roles');
            }

            setVerificationResult(data);

            // Check if user has required role
            if (requiredRoleId && onVerificationComplete) {
                const hasRequiredRole = data.serverRoles.roles.includes(requiredRoleId);
                onVerificationComplete(hasRequiredRole, data.serverRoles.roles);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to verify Discord roles');
        } finally {
            setLoading(false);
        }
    };

    const handleLinkDiscord = () => {
        // Redirect to Discord linking page
        window.location.href = '/profile?tab=discord';
    };

    if (isLinked === null) {
        return (
            <Card className={className}>
                <CardBody className="flex items-center justify-center py-8">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-600">Checking Discord account status...</p>
                </CardBody>
            </Card>
        );
    }

    if (!isLinked) {
        return (
            <Card className={className}>
                <CardHeader className="flex gap-3">
                    <FaDiscord className="text-3xl text-[#5865F2]" />
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">Discord Role Verification</p>
                        <p className="text-small text-gray-500">Discord account required</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="text-center py-8">
                    <FaExclamationTriangle className="text-4xl text-warning mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Discord Account Required</h3>
                    <p className="text-gray-600 mb-6">
                        You need to link your Discord account to verify server roles and access
                        Discord-based features.
                    </p>
                    <Button
                        color="primary"
                        size="lg"
                        startContent={<FaDiscord />}
                        onPress={handleLinkDiscord}
                        className="bg-[#5865F2] hover:bg-[#4752C4]"
                    >
                        Link Discord Account
                    </Button>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader className="flex gap-3">
                <FaUserShield className="text-3xl text-primary" />
                <div className="flex flex-col">
                    <p className="text-lg font-semibold">Discord Role Verification</p>
                    <p className="text-small text-gray-500">Verify your roles in Discord servers</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                        <FaExclamationTriangle className="text-danger text-xl" />
                        <p className="text-danger">{error}</p>
                    </div>
                )}

                {/* Server ID Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Discord Server ID
                    </label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter Discord server ID (e.g., 123456789012345678)"
                            value={serverId}
                            onChange={(e) => setServerId(e.target.value)}
                            className="flex-1"
                            disabled={loading}
                        />
                        <Button
                            color="primary"
                            onPress={handleVerifyRoles}
                            isLoading={loading}
                            isDisabled={!serverId.trim() || loading}
                            startContent={!loading && <FaSearch />}
                        >
                            Verify
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                        You can find the server ID by right-clicking on the server name in Discord
                        (with Developer Mode enabled) and selecting "Copy ID"
                    </p>
                </div>

                {/* Verification Results */}
                {verificationResult && (
                    <div className="space-y-4">
                        <Divider />

                        {/* Discord User Info */}
                        <div className="flex items-center gap-3">
                            <img
                                src={
                                    verificationResult.discordUser.avatar
                                        ? `https://cdn.discordapp.com/avatars/${verificationResult.discordUser.id}/${verificationResult.discordUser.avatar}.png`
                                        : `https://cdn.discordapp.com/embed/avatars/${parseInt(verificationResult.discordUser.discriminator) % 5}.png`
                                }
                                alt="Discord Avatar"
                                className="w-12 h-12 rounded-full border-2 border-[#5865F2]"
                            />
                            <div>
                                <h3 className="font-semibold">
                                    {verificationResult.discordUser.username}#{verificationResult.discordUser.discriminator}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">
                                        ID: {verificationResult.discordUser.id}
                                    </p>
                                    {verificationResult.discordUser.verified && (
                                        <Chip color="success" size="sm" variant="flat">
                                            Verified
                                        </Chip>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Server Membership Status */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                {verificationResult.serverRoles.memberFound ? (
                                    <FaCheck className="text-success text-lg" />
                                ) : (
                                    <FaTimes className="text-danger text-lg" />
                                )}
                                <h4 className="font-semibold">
                                    Server Membership: {verificationResult.serverRoles.memberFound ? 'Found' : 'Not Found'}
                                </h4>
                            </div>

                            {verificationResult.serverRoles.error && (
                                <p className="text-danger text-sm mb-3">
                                    Error: {verificationResult.serverRoles.error}
                                </p>
                            )}

                            {verificationResult.serverRoles.memberFound ? (
                                <div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        You are a member of this Discord server with the following roles:
                                    </p>

                                    {verificationResult.serverRoles.roles.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {verificationResult.serverRoles.roles.map((roleId) => (
                                                <Chip
                                                    key={roleId}
                                                    color={requiredRoleId === roleId ? 'success' : 'default'}
                                                    variant={requiredRoleId === roleId ? 'solid' : 'flat'}
                                                    size="sm"
                                                    startContent={requiredRoleId === roleId ? <FaCheck /> : undefined}
                                                >
                                                    {roleId}
                                                </Chip>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No special roles found (you have the @everyone role)
                                        </p>
                                    )}

                                    {/* Required Role Check */}
                                    {requiredRoleId && (
                                        <div className="mt-4 p-3 border rounded-lg">
                                            <div className="flex items-center gap-2">
                                                {verificationResult.serverRoles.roles.includes(requiredRoleId) ? (
                                                    <>
                                                        <FaCheck className="text-success" />
                                                        <span className="text-success font-medium">
                                                            Required role verified!
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaTimes className="text-danger" />
                                                        <span className="text-danger font-medium">
                                                            Required role not found
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Required role ID: {requiredRoleId}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    You are not a member of this Discord server, or the bot doesn't have
                                    permission to view your membership.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Help Text */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p>• Make sure you're a member of the Discord server you want to verify</p>
                    <p>• The Naffles bot must be present in the server to verify your roles</p>
                    <p>• Role verification is updated in real-time when you verify</p>
                </div>
            </CardBody>
        </Card>
    );
};

export default DiscordRoleVerification;