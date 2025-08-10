# Discord Linking Components

This directory contains React components for Discord account linking and OAuth integration.

## Components

### DiscordAccountManager
Main component for managing Discord account linking status and actions.

```tsx
import { DiscordAccountManager } from '@/components/DiscordLinking';

function ProfilePage() {
  return (
    <DiscordAccountManager
      onLinkingChange={(isLinked) => console.log('Discord linked:', isLinked)}
      showAdvancedOptions={true}
      className="max-w-2xl"
    />
  );
}
```

**Props:**
- `onLinkingChange?: (isLinked: boolean) => void` - Callback when linking status changes
- `showAdvancedOptions?: boolean` - Show advanced account information
- `className?: string` - Additional CSS classes

### DiscordOAuthCallback
Handles the Discord OAuth callback flow after user authorization.

```tsx
import { DiscordOAuthCallback } from '@/components/DiscordLinking';

function DiscordCallbackPage() {
  return (
    <DiscordOAuthCallback
      onSuccess={(result) => console.log('Linking successful:', result)}
      onError={(error) => console.error('Linking failed:', error)}
      redirectPath="/profile"
    />
  );
}
```

**Props:**
- `onSuccess?: (result: CallbackResult) => void` - Success callback
- `onError?: (error: string) => void` - Error callback
- `redirectPath?: string` - Path to redirect after success (default: '/profile')

### DiscordRoleVerification
Verifies user's Discord roles in specific servers.

```tsx
import { DiscordRoleVerification } from '@/components/DiscordLinking';

function CommunityAccessPage() {
  return (
    <DiscordRoleVerification
      serverId="123456789012345678"
      requiredRoleId="987654321098765432"
      onVerificationComplete={(hasRole, roles) => {
        console.log('Has required role:', hasRole);
        console.log('All roles:', roles);
      }}
      className="max-w-3xl"
    />
  );
}
```

**Props:**
- `serverId?: string` - Discord server ID to verify roles in
- `requiredRoleId?: string` - Specific role ID to check for
- `onVerificationComplete?: (hasRole: boolean, roles: string[]) => void` - Verification callback
- `className?: string` - Additional CSS classes

## Usage Examples

### Basic Discord Account Linking
```tsx
import { DiscordAccountManager } from '@/components/DiscordLinking';

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <DiscordAccountManager />
    </div>
  );
}
```

### Community Access with Role Verification
```tsx
import { DiscordRoleVerification } from '@/components/DiscordLinking';

export default function CommunityPage() {
  const handleRoleVerification = (hasRole: boolean, roles: string[]) => {
    if (hasRole) {
      // Grant access to community features
      console.log('User has required role, granting access');
    } else {
      // Show access denied message
      console.log('User does not have required role');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Community Access</h1>
      <DiscordRoleVerification
        serverId="YOUR_DISCORD_SERVER_ID"
        requiredRoleId="YOUR_REQUIRED_ROLE_ID"
        onVerificationComplete={handleRoleVerification}
      />
    </div>
  );
}
```

### OAuth Callback Page
```tsx
// app/auth/discord/callback/page.tsx
import { DiscordOAuthCallback } from '@/components/DiscordLinking';

export default function DiscordCallbackPage() {
  return <DiscordOAuthCallback redirectPath="/profile?tab=discord" />;
}
```

## API Endpoints

These components interact with the following backend API endpoints:

- `POST /api/discord/oauth/authorize` - Generate authorization URL
- `POST /api/discord/oauth/callback` - Handle OAuth callback
- `GET /api/discord/oauth/status` - Get linking status
- `POST /api/discord/oauth/refresh` - Refresh access token
- `DELETE /api/discord/oauth/unlink` - Unlink Discord account
- `POST /api/discord/oauth/verify` - Verify and sync account
- `GET /api/discord/oauth/roles/:serverId` - Get user roles
- `GET /api/discord/oauth/management` - Get management data

## Styling

Components use NextUI for styling and are fully responsive. They support:

- Light/dark theme compatibility
- Custom CSS classes via `className` prop
- Consistent Discord branding colors
- Responsive design for mobile/desktop

## Error Handling

All components include comprehensive error handling:

- Network request failures
- Invalid OAuth states
- Missing Discord account linking
- Server role verification errors
- Rate limiting and fraud detection

## Security Features

- State parameter validation for OAuth security
- Fraud detection and rate limiting
- Secure token storage and refresh
- IP address tracking for suspicious activity
- Comprehensive audit logging