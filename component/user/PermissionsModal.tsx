"use client";
import {
  User,
  UserPermissions,
  UserRole,
  defaultPermissionsByRole,
} from "@/type";
import { useState, useEffect } from "react";

interface PermissionsModalProps {
  user: User;
  currentUserRole: UserRole;
  onClose: () => void;
  onSave: (userId: string, permissions: UserPermissions) => void;
}

export default function PermissionsModal({
  user,
  currentUserRole,
  onClose,
  onSave,
}: PermissionsModalProps) {
  const [permissions, setPermissions] = useState<UserPermissions>(
    user.permissions
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  const canEdit = currentUserRole === "Admin" && user.role !== "Admin";

  useEffect(() => {
    setPermissions(user.permissions);
    setSelectedRole(user.role);
  }, [user]);

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    setPermissions(defaultPermissionsByRole[newRole]);
  };

  const handlePermissionToggle = (key: keyof UserPermissions) => {
    if (!canEdit) return;
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(user.id, permissions);
  };

  const permissionLabels: Record<
    keyof UserPermissions,
    { label: string; description: string }
  > = {
    canCreateEditDeleteEvents: {
      label: "Events Management",
      description: "Create, edit, and delete events",
    },
    canCreateEditDeleteStaff: {
      label: "Staff Management",
      description: "Create, edit, and delete staff profiles",
    },
    canViewReports: {
      label: "View Reports",
      description: "Access analytics and reports",
    },
    canManageLocations: {
      label: "Location Management",
      description: "Add, edit, and delete locations",
    },
    canManageGroups: {
      label: "Group Management",
      description: "Create and manage staff groups",
    },
    canAccessSettings: {
      label: "System Settings",
      description: "Access and modify system settings",
    },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-700/70 transition-opacity"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-lg my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-primary font-bold text-gray-900">
                  Manage Permissions
                </h2>
                <p className="text-sm font-secondary text-gray-500">
                  {user.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-secondary font-medium text-gray-700">
                User Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {([user.role] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    disabled
                    className={`p-3 rounded-lg border-2 border-primary bg-primary/5 cursor-default`}
                  >
                    <span className="font-secondary font-medium text-primary">
                      {role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-secondary font-medium text-gray-700">
                Permissions
              </label>
              <div className="space-y-2">
                {(Object.keys(permissions) as (keyof UserPermissions)[]).map(
                  (key) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        permissions[key]
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div>
                        <p className="font-secondary font-medium text-gray-900">
                          {permissionLabels[key].label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {permissionLabels[key].description}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePermissionToggle(key)}
                        disabled={!canEdit}
                        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          permissions[key] ? "bg-green-500" : "bg-gray-300"
                        } ${
                          !canEdit
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            permissions[key] ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {!canEdit && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-amber-600 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <p className="font-secondary font-medium text-amber-800">
                      View Only
                    </p>
                    <p className="text-sm text-amber-700">
                      {user.role === "Admin"
                        ? "Admin permissions cannot be modified by other admins."
                        : "You don't have permission to modify this user's permissions."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-secondary font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {canEdit && (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-secondary font-medium rounded-lg hover:bg-primary/90 transition-colors"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Permissions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
