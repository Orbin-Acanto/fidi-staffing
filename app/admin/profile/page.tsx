"use client";
import { useState } from "react";

import { adminProfile as initialProfile, profileActivityLogs } from "@/data";
import { AdminProfile, NotificationPreferences } from "@/type";
import ProfileHeader from "@/component/profile/ProfileHeader";
import PersonalInfoCard from "@/component/profile/PersonalInfoCard";
import ChangePasswordCard from "@/component/profile/ChangePasswordCard";
import TwoFactorAuthCard from "@/component/profile/TwoFactorAuthCard";
import NotificationPreferencesCard from "@/component/profile/NotificationPreferencesCard";
import ProfileActivityLogCard from "@/component/profile/ProfileActivityLogCard";
import UploadPhotoModal from "@/component/profile/UploadPhotoModal";

export default function ProfilePage() {
  const [profile, setProfile] = useState<AdminProfile>(initialProfile);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleUpdateProfile = (data: Partial<AdminProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
    console.log("Profile updated:", data);
  };

  const handleUpdatePhoto = (photoUrl: string) => {
    setProfile((prev) => ({ ...prev, avatar: photoUrl }));
    setShowPhotoModal(false);
    console.log("Photo updated");
  };

  const handleChangePassword = (
    currentPassword: string,
    newPassword: string
  ) => {
    console.log("Password change requested");
    setProfile((prev) => ({
      ...prev,
      lastPasswordChange: new Date().toISOString(),
    }));
  };

  const handleUpdateNotifications = (preferences: NotificationPreferences) => {
    setProfile((prev) => ({
      ...prev,
      notificationPreferences: preferences,
    }));
    console.log("Notification preferences updated:", preferences);
  };

  const handleEnable2FA = (method: "authenticator" | "sms" | "email") => {
    setProfile((prev) => ({
      ...prev,
      twoFactorAuth: {
        enabled: true,
        method,
        lastUpdated: new Date().toISOString(),
        backupCodesRemaining: 10,
      },
    }));
    console.log("2FA enabled with method:", method);
  };

  const handleDisable2FA = () => {
    setProfile((prev) => ({
      ...prev,
      twoFactorAuth: {
        enabled: false,
        method: null,
      },
    }));
    console.log("2FA disabled");
  };

  const handleRegenerateBackupCodes = () => {
    setProfile((prev) => ({
      ...prev,
      twoFactorAuth: {
        ...prev.twoFactorAuth,
        backupCodesRemaining: 10,
        lastUpdated: new Date().toISOString(),
      },
    }));
    console.log("Backup codes regenerated");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-primary font-bold text-gray-900">
          My Profile
        </h1>
        <p className="text-sm font-secondary text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <ProfileHeader
        profile={profile}
        onEditPhoto={() => setShowPhotoModal(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfoCard profile={profile} onSave={handleUpdateProfile} />

          <ChangePasswordCard
            lastPasswordChange={profile.lastPasswordChange}
            onChangePassword={handleChangePassword}
          />

          <TwoFactorAuthCard
            twoFactorAuth={profile.twoFactorAuth}
            onEnable={handleEnable2FA}
            onDisable={handleDisable2FA}
            onRegenerateBackupCodes={handleRegenerateBackupCodes}
          />

          <NotificationPreferencesCard
            preferences={profile.notificationPreferences}
            onUpdate={handleUpdateNotifications}
          />
        </div>

        <div className="lg:col-span-1">
          <ProfileActivityLogCard logs={profileActivityLogs} />
        </div>
      </div>

      {showPhotoModal && (
        <UploadPhotoModal
          currentPhoto={profile.avatar}
          userName={profile.name}
          onClose={() => setShowPhotoModal(false)}
          onSave={handleUpdatePhoto}
        />
      )}
    </div>
  );
}
