"use client";
import { useEffect, useMemo, useState } from "react";

import { AdminProfile } from "@/type";
import ProfileHeader from "@/component/profile/ProfileHeader";
import PersonalInfoCard from "@/component/profile/PersonalInfoCard";
import ChangePasswordCard from "@/component/profile/ChangePasswordCard";
import ProfileActivityLogCard from "@/component/profile/ProfileActivityLogCard";
import UploadPhotoModal from "@/component/profile/UploadPhotoModal";
import { userMeToAdminProfile } from "@/lib/mappers/adminProfile";
import { useMe } from "@/hooks/useMe";
import { apiFetch } from "@/lib/apiFetch";

export default function ProfilePage() {
  const { data: me, isLoading, mutate } = useMe();
  const mappedProfile = useMemo(() => {
    return me ? userMeToAdminProfile(me) : null;
  }, [me]);

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const [activityLogs, setActivityLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    if (mappedProfile) setProfile(mappedProfile);
  }, [mappedProfile]);

  const handleUpdateProfile = (data: Partial<AdminProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...data } : prev));
  };

  const handleUpdatePhoto = (photoUrl: string) => {
    setProfile((prev) => (prev ? { ...prev, avatar: photoUrl } : prev));
    setShowPhotoModal(false);
    mutate();
  };

  useEffect(() => {
    if (!me?.id) return;

    async function fetchLogs() {
      setLogsLoading(true);
      try {
        const res = await apiFetch(
          `/api/audit-logs?user=${me?.id}&page_size=20`,
        );
        setActivityLogs(res?.results || []);
      } catch {
        setActivityLogs([]);
      } finally {
        setLogsLoading(false);
      }
    }

    fetchLogs();
  }, [me?.id]);

  if (isLoading || !profile) {
    return null;
  }

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
        </div>

        <div className="lg:col-span-1">
          <ProfileActivityLogCard logs={activityLogs} loading={logsLoading} />
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
