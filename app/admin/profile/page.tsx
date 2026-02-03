"use client";
import { useEffect, useMemo, useState } from "react";

import { profileActivityLogs } from "@/data";
import { AdminProfile } from "@/type";
import ProfileHeader from "@/component/profile/ProfileHeader";
import PersonalInfoCard from "@/component/profile/PersonalInfoCard";
import ChangePasswordCard from "@/component/profile/ChangePasswordCard";
import ProfileActivityLogCard from "@/component/profile/ProfileActivityLogCard";
import UploadPhotoModal from "@/component/profile/UploadPhotoModal";
import { userMeToAdminProfile } from "@/lib/mappers/adminProfile";
import { useMe } from "@/hooks/useMe";

export default function ProfilePage() {
  const { data: me, isLoading } = useMe();
  const mappedProfile = useMemo(() => {
    return me ? userMeToAdminProfile(me) : null;
  }, [me]);

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    if (mappedProfile) setProfile(mappedProfile);
  }, [mappedProfile]);

  if (isLoading || !profile) {
    return null;
  }

  const handleUpdateProfile = (data: Partial<AdminProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...data } : prev));
  };

  const handleUpdatePhoto = (photoUrl: string) => {
    setProfile((prev) => (prev ? { ...prev, avatar: photoUrl } : prev));
    setShowPhotoModal(false);
  };

  // const handleUpdateNotifications = (preferences: NotificationPreferences) => {
  //   setProfile((prev) =>
  //     prev ? { ...prev, notificationPreferences: preferences } : prev,
  //   );
  // };

  // const handleEnable2FA = (method: "authenticator" | "sms" | "email") => {
  //   setProfile((prev) =>
  //     prev
  //       ? {
  //           ...prev,
  //           twoFactorAuth: {
  //             enabled: true,
  //             method,
  //             lastUpdated: new Date().toISOString(),
  //             backupCodesRemaining: 10,
  //           },
  //         }
  //       : prev,
  //   );
  // };

  // const handleDisable2FA = () => {
  //   setProfile((prev) =>
  //     prev
  //       ? {
  //           ...prev,
  //           twoFactorAuth: { enabled: false, method: null },
  //         }
  //       : prev,
  //   );
  // };

  // const handleRegenerateBackupCodes = () => {
  //   setProfile((prev) =>
  //     prev
  //       ? {
  //           ...prev,
  //           twoFactorAuth: {
  //             ...prev.twoFactorAuth,
  //             backupCodesRemaining: 10,
  //             lastUpdated: new Date().toISOString(),
  //           },
  //         }
  //       : prev,
  //   );
  // };

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

          <ChangePasswordCard lastPasswordChange={profile.lastPasswordChange} />

          {/* <TwoFactorAuthCard
            twoFactorAuth={profile.twoFactorAuth}
            onEnable={handleEnable2FA}
            onDisable={handleDisable2FA}
            onRegenerateBackupCodes={handleRegenerateBackupCodes}
          />

          <NotificationPreferencesCard
            preferences={profile.notificationPreferences}
            onUpdate={handleUpdateNotifications}
          /> */}
        </div>

        <div className="lg:col-span-1">
          <ProfileActivityLogCard logs={profileActivityLogs} />
        </div>
      </div>

      {showPhotoModal && (
        <UploadPhotoModal
          currentPhoto={profile.avatar ?? "/male.png"}
          userName={profile.name}
          onClose={() => setShowPhotoModal(false)}
          onSave={handleUpdatePhoto}
        />
      )}
    </div>
  );
}
