"use client";
import { TwoFactorAuth } from "@/type";
import { useState } from "react";

interface TwoFactorAuthCardProps {
  twoFactorAuth: TwoFactorAuth;
  onEnable: (method: "authenticator" | "sms" | "email") => void;
  onDisable: () => void;
  onRegenerateBackupCodes: () => void;
}

export default function TwoFactorAuthCard({
  twoFactorAuth,
  onEnable,
  onDisable,
  onRegenerateBackupCodes,
}: TwoFactorAuthCardProps) {
  const [showSetup, setShowSetup] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "authenticator" | "sms" | "email"
  >("authenticator");

  const methods = [
    {
      id: "authenticator" as const,
      name: "Authenticator App",
      description: "Use Google Authenticator, Authy, or similar apps",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "sms" as const,
      name: "SMS",
      description: "Receive verification codes via text message",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
    {
      id: "email" as const,
      name: "Email",
      description: "Receive verification codes via email",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
  ];

  const handleEnable = () => {
    onEnable(selectedMethod);
    setShowSetup(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Two-Factor Authentication
        </h3>
      </div>

      <div className="p-4">
        {twoFactorAuth.enabled ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-secondary font-medium text-green-800">
                    2FA is enabled
                  </p>
                  <p className="text-sm text-green-600">
                    Using{" "}
                    {twoFactorAuth.method === "authenticator"
                      ? "Authenticator App"
                      : twoFactorAuth.method?.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={onDisable}
                className="px-3 py-1.5 text-sm font-secondary font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                Disable
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-secondary font-medium text-gray-900">
                    Backup Codes
                  </p>
                  <p className="text-sm text-gray-500">
                    {twoFactorAuth.backupCodesRemaining} codes remaining
                  </p>
                </div>
                <button
                  onClick={onRegenerateBackupCodes}
                  className="px-3 py-1.5 text-sm font-secondary font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Regenerate
                </button>
              </div>
            </div>

            {twoFactorAuth.lastUpdated && (
              <p className="text-xs text-gray-500">
                Last updated:{" "}
                {new Date(twoFactorAuth.lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : showSetup ? (
          <div className="space-y-4">
            <p className="text-sm font-secondary text-gray-600">
              Choose your preferred 2FA method:
            </p>

            <div className="space-y-2">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={
                      selectedMethod === method.id
                        ? "text-primary"
                        : "text-gray-400"
                    }
                  >
                    {method.icon}
                  </span>
                  <div className="text-left">
                    <p
                      className={`font-secondary font-medium ${
                        selectedMethod === method.id
                          ? "text-primary"
                          : "text-gray-900"
                      }`}
                    >
                      {method.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSetup(false)}
                className="px-3 py-1.5 text-sm font-secondary font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEnable}
                className="px-3 py-1.5 text-sm font-secondary font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                Continue Setup
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <svg
                    className="w-5 h-5 text-yellow-600"
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
                </div>
                <div>
                  <p className="font-secondary font-medium text-yellow-800">
                    2FA is not enabled
                  </p>
                  <p className="text-sm text-yellow-600">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSetup(true)}
              className="w-full px-4 py-2 text-sm font-secondary font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Enable Two-Factor Authentication
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
