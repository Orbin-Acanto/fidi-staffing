"use client";
import { AdminProfile } from "@/type";

interface ProfileHeaderProps {
  profile: AdminProfile;
  onEditPhoto: () => void;
}

export default function ProfileHeader({
  profile,
  onEditPhoto,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="relative">
          <img
            src={profile.avatar || "/male.png"}
            alt={profile.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button
            onClick={onEditPhoto}
            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
            title="Change Photo"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-primary font-bold text-gray-900">
                {profile.name}
              </h1>
              <p className="text-sm font-secondary text-gray-500 mt-1">
                {profile.email}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-secondary font-medium bg-purple-100 text-purple-700">
                  {profile.role}
                </span>
                {profile.department && (
                  <span className="text-sm font-secondary text-gray-500">
                    {profile.department}
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm font-secondary text-gray-500">
              <p>
                Member since{" "}
                {new Date(profile.joinedAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
