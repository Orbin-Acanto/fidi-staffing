"use client";
import { User } from "@/type";
import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";

interface ResetPasswordModalProps {
  user: User;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ResetPasswordModal({
  user,
  onCancel,
  onConfirm,
}: ResetPasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetLink, setResetLink] = useState<string>("");

  const handleSendResetLink = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiFetch<{
        message: string;
        token?: string;
        reset_link?: string;
      }>("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.reset_link) {
        setResetLink(response.reset_link);
        toastSuccess("Password reset link generated!");

        try {
          await navigator.clipboard.writeText(response.reset_link);
          toastSuccess("Reset link copied to clipboard!");
        } catch {}
      } else {
        toastSuccess("Password reset link sent to user's email!");
      }

      onConfirm();
    } catch (err) {
      toastError(err, "Failed to send password reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-700/70 transition-opacity"
          onClick={onCancel}
        />

        <div className="relative inline-block w-full max-w-md my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-orange-100">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-primary font-bold text-gray-900 text-center mb-2">
              Reset Password
            </h3>

            <p className="text-sm font-secondary text-gray-600 text-center mb-4">
              Send a password reset link to{" "}
              <span className="font-semibold text-gray-900">{user.name}</span>?
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

            {resetLink && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="font-secondary font-medium text-green-800 text-sm mb-2">
                  Reset link generated:
                </p>
                <p className="text-xs text-green-700 break-all">{resetLink}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={handleSendResetLink}
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white font-secondary font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full px-4 py-2 text-gray-700 font-secondary font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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
