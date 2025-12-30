"use client";
import { User } from "@/type";

interface SuspendUserModalProps {
  user: User;
  onCancel: () => void;
  onConfirm: (action: "suspend" | "activate" | "deactivate") => void;
}

export default function SuspendUserModal({
  user,
  onCancel,
  onConfirm,
}: SuspendUserModalProps) {
  const isActive = user.status === "Active";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-700/70 transition-opacity"
          onClick={onCancel}
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
              {isActive ? "Suspend User Account" : "Activate User Account"}
            </h3>

            <p className="text-sm font-secondary text-gray-600 text-center mb-4">
              {isActive ? (
                <>
                  Are you sure you want to suspend{" "}
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
                  src={
                    user.avatar ||
                    `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                      user.name
                    )}`
                  }
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
              {isActive ? (
                <>
                  <button
                    onClick={() => onConfirm("suspend")}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white font-secondary font-medium rounded-lg hover:bg-yellow-600 transition-colors"
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
                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Suspend Account
                  </button>
                  <button
                    onClick={() => onConfirm("deactivate")}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-secondary font-medium rounded-lg hover:bg-red-700 transition-colors"
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
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    Deactivate Account
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onConfirm("activate")}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-secondary font-medium rounded-lg hover:bg-green-700 transition-colors"
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Activate Account
                </button>
              )}
              <button
                onClick={onCancel}
                className="w-full px-4 py-2 text-gray-700 font-secondary font-medium hover:bg-gray-100 rounded-lg transition-colors"
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
