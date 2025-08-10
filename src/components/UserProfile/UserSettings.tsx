'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Textarea, 
  Button, 
  Switch, 
  Divider,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import { 
  UserIcon, 
  CogIcon, 
  ShieldCheckIcon, 
  EyeIcon, 
  EyeSlashIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { UserProfile, useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'react-hot-toast';

interface UserSettingsProps {
  profile: UserProfile;
  onRefresh: () => void;
}

export function UserSettings({ profile, onRefresh }: UserSettingsProps) {
  const { updateProfileData, updateNotificationPreferences } = useUserProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    displayName: profile.profileData?.displayName || '',
    bio: profile.profileData?.bio || '',
    location: profile.profileData?.location || '',
    website: profile.profileData?.website || ''
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    email: profile.profileData?.preferences?.notifications?.email ?? true,
    push: profile.profileData?.preferences?.notifications?.push ?? true,
    marketing: profile.profileData?.preferences?.notifications?.marketing ?? false,
    gameResults: profile.profileData?.preferences?.notifications?.gameResults ?? true,
    raffleUpdates: profile.profileData?.preferences?.notifications?.raffleUpdates ?? true,
    stakingRewards: profile.profileData?.preferences?.notifications?.stakingRewards ?? true,
    communityActivity: profile.profileData?.preferences?.notifications?.communityActivity ?? true,
    achievementUnlocks: profile.profileData?.preferences?.notifications?.achievementUnlocks ?? true
  });

  // Privacy preferences state
  const [privacy, setPrivacy] = useState({
    showProfile: profile.profileData?.preferences?.privacy?.showProfile ?? true,
    showActivity: profile.profileData?.preferences?.privacy?.showActivity ?? true
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await updateProfileData(profileData);
      toast.success('Profile updated successfully');
      onRefresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      setLoading(true);
      await updateNotificationPreferences(notifications);
      toast.success('Notification preferences updated');
      onRefresh();
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image must be smaller than 5MB');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Avatar updated successfully');
        onRefresh();
      } else {
        throw new Error(data.message || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Profile Information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <UserIcon className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Profile Information</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <Avatar
              src={profile.profileImageUrl}
              alt={profile.username}
              className="w-20 h-20 text-large"
              name={profile.username}
            />
            <div>
              <p className="text-sm text-default-500 mb-2">Profile Picture</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload">
                <Button
                  as="span"
                  color="primary"
                  variant="flat"
                  size="sm"
                  startContent={<PhotoIcon className="w-4 h-4" />}
                  isLoading={loading}
                >
                  Change Avatar
                </Button>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              placeholder="Enter your display name"
              value={profileData.displayName}
              onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
            />
            
            <Input
              label="Location"
              placeholder="Enter your location"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <Input
            label="Website"
            placeholder="https://your-website.com"
            value={profileData.website}
            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
          />

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            maxRows={4}
          />

          <div className="flex justify-end">
            <Button
              color="primary"
              onClick={handleProfileUpdate}
              isLoading={loading}
            >
              Update Profile
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <CogIcon className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-default-500">Receive notifications via email</p>
              </div>
              <Switch
                isSelected={notifications.email}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, email: value }))}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-default-500">Receive browser push notifications</p>
              </div>
              <Switch
                isSelected={notifications.push}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, push: value }))}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Marketing Communications</p>
                <p className="text-sm text-default-500">Receive promotional emails and updates</p>
              </div>
              <Switch
                isSelected={notifications.marketing}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, marketing: value }))}
              />
            </div>

            <Divider />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Game Results</p>
                <p className="text-sm text-default-500">Notifications for game outcomes</p>
              </div>
              <Switch
                isSelected={notifications.gameResults}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, gameResults: value }))}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Raffle Updates</p>
                <p className="text-sm text-default-500">Notifications for raffle activities</p>
              </div>
              <Switch
                isSelected={notifications.raffleUpdates}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, raffleUpdates: value }))}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Staking Rewards</p>
                <p className="text-sm text-default-500">Notifications for staking rewards</p>
              </div>
              <Switch
                isSelected={notifications.stakingRewards}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, stakingRewards: value }))}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Community Activity</p>
                <p className="text-sm text-default-500">Notifications for community updates</p>
              </div>
              <Switch
                isSelected={notifications.communityActivity}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, communityActivity: value }))}
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Achievement Unlocks</p>
                <p className="text-sm text-default-500">Notifications when you unlock achievements</p>
              </div>
              <Switch
                isSelected={notifications.achievementUnlocks}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, achievementUnlocks: value }))}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              color="primary"
              onClick={handleNotificationUpdate}
              isLoading={loading}
            >
              Update Notifications
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Privacy Settings</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Public Profile</p>
              <p className="text-sm text-default-500">Allow others to view your profile</p>
            </div>
            <Switch
              isSelected={privacy.showProfile}
              onValueChange={(value) => setPrivacy(prev => ({ ...prev, showProfile: value }))}
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Show Activity</p>
              <p className="text-sm text-default-500">Display your activity on your profile</p>
            </div>
            <Switch
              isSelected={privacy.showActivity}
              onValueChange={(value) => setPrivacy(prev => ({ ...prev, showActivity: value }))}
            />
          </div>
        </CardBody>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Account Security</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-default-500">Add an extra layer of security</p>
              </div>
              <Button color="primary" variant="flat" size="sm">
                Enable 2FA
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-default-500">Update your account password</p>
              </div>
              <Button color="primary" variant="flat" size="sm" onPress={onOpen}>
                Change Password
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Login Sessions</p>
                <p className="text-sm text-default-500">Manage your active sessions</p>
              </div>
              <Button color="primary" variant="flat" size="sm">
                View Sessions
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Change Password Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Current Password"
                type={showPassword ? "text" : "password"}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4 text-default-400" />
                    ) : (
                      <EyeIcon className="w-4 h-4 text-default-400" />
                    )}
                  </button>
                }
              />
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
              />
              <Input
                label="Confirm New Password"
                type={showPassword ? "text" : "password"}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={onClose}>
              Update Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}