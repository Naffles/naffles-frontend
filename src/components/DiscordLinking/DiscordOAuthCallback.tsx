/**
 * Discord OAuth Callback Handler Component
 * Handles the Discord OAuth callback and completes the linking process
 */

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardBody, Spinner, Button } from '@nextui-org/react';
import { FaDiscord, FaCheck, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

interface CallbackResult {
  success: boolean;
  discordAccount?: {
    id: string;
    discordUserId: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    verified: boolean;
    linkedAt: string;
  };
  user?: {
    id: string;
    username: string;
  };
  message?: string;
}

interface DiscordOAuthCallbackProps {
  onSuccess?: (result: CallbackResult) => void;
  onError?: (error: string) => void;
  redirectPath?: string;
}

const DiscordOAuthCallback: React.FC<DiscordOAuthCallbackProps> = ({
  onSuccess,
  onError,
  redirectPath = '/profile'
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<CallbackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get OAuth parameters from URL
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      // Check for OAuth errors
      if (errorParam) {
        const errorDescription = searchParams.get('error_description') || 'OAuth authorization failed';
        throw new Error(`Discord OAuth Error: ${errorDescription}`);
      }

      // Validate required parameters
      if (!code || !state) {
        throw new Error('Missing OAuth parameters. Please try linking your Discord account again.');
      }

      // Verify state matches what we stored
      const storedState = localStorage.getItem('discord_oauth_state');
      if (!storedState || storedState !== state) {
        throw new Error('Invalid OAuth state. This may be a security issue. Please try again.');
      }

      // Clear stored state
      localStorage.removeItem('discord_oauth_state');

      // Complete OAuth flow
      const response = await fetch('/api/discord/oauth/callback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, state })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete Discord account linking');
      }

      setResult(data);
      onSuccess?.(data);

      // Auto-redirect after success
      setTimeout(() => {
        router.push(redirectPath);
      }, 3000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete Discord linking';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    router.push('/profile?tab=discord');
  };

  const handleGoBack = () => {
    router.push(redirectPath);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardBody className="text-center py-12">
            <div className="relative mb-6">
              <FaDiscord className="text-6xl text-[#5865F2] mx-auto" />
              <Spinner 
                size="lg" 
                className="absolute -bottom-2 -right-2"
                color="primary"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">Connecting Discord Account</h2>
            <p className="text-gray-600">
              Please wait while we complete the linking process...
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardBody className="text-center py-12">
            <FaExclamationTriangle className="text-6xl text-danger mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-4 text-danger">
              Discord Linking Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                color="primary"
                variant="solid"
                onPress={handleRetry}
                startContent={<FaDiscord />}
              >
                Try Again
              </Button>
              <Button
                color="default"
                variant="light"
                onPress={handleGoBack}
                startContent={<FaArrowLeft />}
              >
                Go Back
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (result?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardBody className="text-center py-12">
            <div className="relative mb-6">
              <FaDiscord className="text-6xl text-[#5865F2] mx-auto" />
              <div className="absolute -bottom-2 -right-2 bg-success rounded-full p-2">
                <FaCheck className="text-white text-lg" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-success">
              Discord Account Connected!
            </h2>
            
            {result.discordAccount && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <img
                    src={
                      result.discordAccount.avatar
                        ? `https://cdn.discordapp.com/avatars/${result.discordAccount.discordUserId}/${result.discordAccount.avatar}.png`
                        : `https://cdn.discordapp.com/embed/avatars/${parseInt(result.discordAccount.discriminator) % 5}.png`
                    }
                    alt="Discord Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">
                      {result.discordAccount.username}#{result.discordAccount.discriminator}
                    </p>
                    {result.discordAccount.verified && (
                      <p className="text-sm text-success">✓ Verified Account</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Successfully linked to your Naffles account
                </p>
              </div>
            )}

            <p className="text-gray-600 mb-6">
              You can now access Discord-based features and community roles.
              Redirecting you back to your profile...
            </p>

            <div className="flex justify-center">
              <Button
                color="primary"
                variant="light"
                onPress={handleGoBack}
                startContent={<FaArrowLeft />}
              >
                Continue to Profile
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Fallback state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardBody className="text-center py-12">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-6" />
          <h2 className="text-xl font-semibold mb-4">
            Unexpected State
          </h2>
          <p className="text-gray-600 mb-6">
            Something unexpected happened during the Discord linking process.
          </p>
          <Button
            color="primary"
            onPress={handleGoBack}
            startContent={<FaArrowLeft />}
          >
            Go Back
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default DiscordOAuthCallback;