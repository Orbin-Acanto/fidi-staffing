"use client";

import { useState } from "react";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

import {
  endCheckInSession,
  adminSendOTP,
  adminVerifyOTP,
} from "@/services/api";
import LoadingSpinner from "@/component/shared/LoadingSpinner";
import PINInput from "@/component/shared/PINInput";

interface EndCheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  adminId: string;
  checkedOutCount: number;
  expectedCount: number;
  lastCheckOutTime?: string;
  onSessionEnded: () => void;
}

type Step = "confirm" | "otp" | "processing";

export default function EndCheckOutModal({
  isOpen,
  onClose,
  sessionId,
  adminId,
  checkedOutCount,
  expectedCount,
  lastCheckOutTime,
  onSessionEnded,
}: EndCheckOutModalProps) {
  const [step, setStep] = useState<Step>("confirm");
  const [otp, setOtp] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await adminSendOTP(adminId, "end_session");
      if (response.success && response.data) {
        setMaskedPhone(response.data.maskedPhone);
        setStep("otp");
      } else {
        toastError(response.error, "Failed to send verification code.");
      }
    } catch (err) {
      toastError(err, "Failed to send verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = async (code: string) => {
    setStep("processing");
    try {
      const otpResponse = await adminVerifyOTP(adminId, code, "end_session");
      if (!otpResponse.success || !otpResponse.data?.verified) {
        toastError(otpResponse.error, "Invalid verification code.");
        setOtp("");
        setStep("otp");
        return;
      }

      const endResponse = await endCheckInSession(sessionId, adminId);
      if (endResponse.success) {
        toastSuccess("Check-out session ended successfully!");
        onSessionEnded();
      } else {
        toastError(endResponse.error, "Failed to end session.");
        setStep("otp");
      }
    } catch (err) {
      toastError(err, "Failed to end session.");
      setStep("otp");
    }
  };

  const handleClose = () => {
    setStep("confirm");
    setOtp("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={step !== "processing" ? handleClose : undefined}
      />

      <div
        className={cn(
          "relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6",
          "animate-slideUp transform",
        )}
      >
        {step === "confirm" && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-primary font-semibold text-dark-black mb-2">
                End Check-Out Session?
              </h2>
              <p className="text-gray-600 font-secondary text-sm">
                This will close check-out for all staff. You&apos;ll need admin
                verification to proceed.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-primary font-bold text-dark-black">
                    {checkedOutCount}
                  </p>
                  <p className="text-sm text-gray-500 font-secondary">
                    Checked Out
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-primary font-bold text-gray-400">
                    {expectedCount}
                  </p>
                  <p className="text-sm text-gray-500 font-secondary">
                    Expected
                  </p>
                </div>
              </div>
              {lastCheckOutTime && (
                <p className="text-center text-xs text-gray-500 font-secondary mt-3 pt-3 border-t border-gray-200">
                  Last check-out: {lastCheckOutTime}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg font-secondary font-medium",
                  "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  "transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg font-secondary font-semibold",
                  "bg-amber-500 text-white hover:bg-amber-600",
                  "transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2",
                )}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" light />
                    Sending...
                  </>
                ) : (
                  "End Session"
                )}
              </button>
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-primary font-semibold text-dark-black mb-2">
                Enter Verification Code
              </h2>
              <p className="text-gray-600 font-secondary text-sm">
                Code sent to {maskedPhone}
              </p>
            </div>

            <div className="mb-6">
              <PINInput
                length={6}
                value={otp}
                onChange={setOtp}
                onComplete={handleOTPComplete}
                masked={false}
              />
            </div>

            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "w-full py-3 px-4 rounded-lg font-secondary font-medium",
                "bg-gray-100 text-gray-700 hover:bg-gray-200",
                "transition-all duration-200",
              )}
            >
              Cancel
            </button>
          </>
        )}

        {step === "processing" && (
          <div className="py-8">
            <LoadingSpinner size="lg" text="Ending session..." />
          </div>
        )}
      </div>
    </div>
  );
}
