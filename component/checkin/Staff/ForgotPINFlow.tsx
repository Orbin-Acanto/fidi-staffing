"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { sendForgotPIN } from "@/services/api";
import PhoneNumberInput, {
  isValidPhoneNumber,
} from "@/component/shared/PhoneNumberInput";
import LoadingSpinner from "@/component/shared/LoadingSpinner";

interface ForgotPINFlowProps {
  initialPhone?: string;
  onBack: () => void;
}

export default function ForgotPINFlow({
  initialPhone = "",
  onBack,
}: ForgotPINFlowProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [smsSent, setSMSSent] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState("");

  const handleSubmit = async () => {
    if (!phone) {
      toast.error("Please enter your phone number.", {
        toastId: "phone-required",
      });
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      toast.error("Please enter a valid 10-digit phone number.", {
        toastId: "invalid-phone",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendForgotPIN(phone);
      if (response.success && response.data) {
        setSMSSent(true);
        setMaskedPhone(response.data.maskedPhone);
        toastSuccess("PIN sent to your phone!");
      } else {
        toastError(
          response.error,
          "Phone number not found. Please check and try again.",
        );
      }
    } catch (err) {
      toastError(err, "Failed to send PIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (smsSent) {
    return (
      <div className="min-h-screen bg-whitesmoke flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-xl font-primary font-semibold text-dark-black mb-2">
            PIN Sent!
          </h2>
          <p className="text-gray-600 font-secondary mb-2">
            We&apos;ve sent your PIN to
          </p>
          <p className="text-dark-black font-secondary font-semibold mb-6">
            {maskedPhone}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 font-secondary">
              Check your text messages for your 6-digit PIN. It may take a few
              moments to arrive.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className={cn(
              "w-full py-3 px-4 rounded-lg font-secondary font-semibold",
              "bg-primary text-white hover:bg-[#e0c580]",
              "transition-all duration-200",
            )}
          >
            Back to Check-In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-whitesmoke flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
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
            Didn't Receive Your PIN?
          </h2>
          <p className="text-gray-600 font-secondary text-sm">
            Try entering your phone number again to receive your PIN via SMS.
          </p>
        </div>

        <div className="mb-6">
          <PhoneNumberInput
            label="Phone Number"
            value={phone}
            onChange={(value) => setPhone(value)}
            disabled={isLoading}
            autoFocus
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !phone}
          className={cn(
            "w-full py-3 px-4 rounded-lg font-secondary font-semibold",
            "bg-primary text-white hover:bg-[#e0c580]",
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
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Send PIN via SMS
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className={cn(
            "w-full mt-4 py-3 px-4 rounded-lg font-secondary font-medium",
            "bg-gray-100 text-gray-700 hover:bg-gray-200",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          Back to Check-In
        </button>
      </div>
    </div>
  );
}
