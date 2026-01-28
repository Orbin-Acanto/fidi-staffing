"use client";

import { useMemo, useState } from "react";
import { User } from "@/type";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";

interface SuspendUserModalProps {
  user: User;
  onCancel: () => void;
  onUpdated?: (updated: Partial<User>) => void;
}

export default function SuspendUserModal({
  user,
  onCancel,
  onUpdated,
}: SuspendUserModalProps) {
  const isActive = user.status === "Active";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actionLabel = useMemo(() => {
    return isActive ? "Deactivate Account" : "Activate Account";
  }, [isActive]);

  const nextIsActive = !isActive;

  async function handleConfirm() {
    setIsSubmitting(true);

    try {
      await apiFetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: nextIsActive,
        }),
      });

      toastSuccess(
        nextIsActive
          ? "User activated successfully!"
          : "User deactivated successfully!",
      );

      onUpdated?.({
        id: user.id,
        status: nextIsActive ? "Active" : "Deactivated",
      });

      onCancel();
    } catch (err) {
      toastError(err, "Failed to update user status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-700/70 transition-opacity"
          onClick={isSubmitting ? undefined : onCancel}
        />

        <div className="relative inline-block w-full max-w-md my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
          <div className="p-6">
            <div
              className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full ${
                isActive ? "bg-red-100" : "bg-green-100"
              }`}
            >
              {isActive ? (
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>

            <h3 className="text-lg font-primary font-bold text-gray-900 text-center mb-2">
              {isActive ? "Deactivate User Account" : "Activate User Account"}
            </h3>

            <p className="text-sm font-secondary text-gray-600 text-center mb-4">
              {isActive ? (
                <>
                  Are you sure you want to deactivate{" "}
                  <span className="font-semibold text-gray-900">
                    {user.name}
                  </span>
                  ? They will lose access to the system.
                </>
              ) : (
                <>
                  Are you sure you want to activate{" "}
                  <span className="font-semibold text-gray-900">
                    {user.name}
                  </span>
                  ? They will regain access to the system.
                </>
              )}
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || "/male.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-secondary font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-white font-secondary font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSubmitting
                  ? isActive
                    ? "Deactivating..."
                    : "Activating..."
                  : actionLabel}
              </button>

              <button
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full px-4 py-2 text-gray-700 font-secondary font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
