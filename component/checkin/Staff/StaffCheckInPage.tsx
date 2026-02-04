"use client";

import { useState, FormEvent, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import PhoneNumberInput, {
  isValidPhoneNumber,
} from "@/component/shared/PhoneNumberInput";
import LoadingSpinner from "@/component/shared/LoadingSpinner";
import { EventType, StaffType, CheckInSession } from "@/type";
import {
  validateStaffCredentials,
  sendForgotPIN,
  getStaffCheckInStatus,
} from "@/services/api";
import NetworkOfflineIndicator from "@/component/shared/NetworkOfflineIndicator";
import PINInput from "@/component/shared/PINInput";
import SessionTimer from "@/component/shared/SessionTimer";

interface StaffCheckInPageProps {
  event: EventType;
  session: CheckInSession;
  onStaffValidated: (staff: StaffType) => void;
  onForgotPIN: (phone: string) => void;
  onContactAdmin: () => void;
  onEndSession: () => void;
  isOnline: boolean;
  offlineQueueCount: number;
  onAlreadyCheckedIn: (staff: StaffType, checkInTime: string) => void;
}

export default function StaffCheckInPage({
  event,
  session,
  onStaffValidated,
  onForgotPIN,
  onContactAdmin,
  onEndSession,
  isOnline,
  offlineQueueCount,
  onAlreadyCheckedIn,
}: StaffCheckInPageProps) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingPIN, setIsSendingPIN] = useState(false);

  const resetForm = useCallback(() => {
    setPhone("");
    setPin("");
  }, []);

  const validateForm = (pinValue?: string): string | null => {
    const pinToCheck = pinValue || pin;
    if (!phone) return "Please enter your phone number.";
    if (!isValidPhoneNumber(phone))
      return "Please enter a valid 10-digit phone number.";
    if (!pinToCheck) return "Please enter your PIN.";
    if (pinToCheck.length !== 6) return "PIN must be 6 digits.";
    return null;
  };

  const handleSubmit = async (e?: FormEvent, pinValue?: string) => {
    e?.preventDefault();

    const pinToValidate = pinValue || pin;

    const error = validateForm(pinToValidate);

    if (error) {
      toast.error(error, { toastId: error });
      return;
    }

    setIsLoading(true);

    try {
      const credResponse = await validateStaffCredentials(phone, pinToValidate);

      if (!credResponse.success || !credResponse.data) {
        toastError(credResponse.error, "Invalid phone number or PIN.");
        setPin("");
        return;
      }

      const staff = credResponse.data;

      const statusResponse = await getStaffCheckInStatus(staff.id, session.id);

      if (statusResponse.success && statusResponse.data?.checkedIn) {
        onAlreadyCheckedIn(staff, statusResponse.data.checkInTime || "");
        resetForm();
        return;
      }

      onStaffValidated(staff);
      resetForm();
    } catch (err) {
      toastError(err, "Check-in failed. Please try again.");
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePINComplete = (value: string) => {
    setPin(value);
    if (phone && isValidPhoneNumber(phone) && value.length === 6) {
      handleSubmit(undefined, value);
    }
  };

  const handleForgotPIN = async () => {
    if (!phone) {
      toast.error("Please enter your phone number first.", {
        toastId: "phone-required",
      });
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      toast.error("Please enter a valid phone number.", {
        toastId: "invalid-phone",
      });
      return;
    }

    setIsSendingPIN(true);
    try {
      const response = await sendForgotPIN(phone);
      if (response.success) {
        toast.success("PIN sent to your phone!", { toastId: "pin-sent" });
        onForgotPIN(phone);
      } else {
        toastError(response.error, "Failed to send PIN. Please try again.");
      }
    } catch (err) {
      toastError(err, "Failed to send PIN. Please try again.");
    } finally {
      setIsSendingPIN(false);
    }
  };

  return (
    <div className="min-h-screen bg-whitesmoke flex flex-col">
      <NetworkOfflineIndicator queuedCount={offlineQueueCount} />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-3 sm:py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Brand + Event */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-primary/15" />
                <div className="relative p-2 bg-white rounded-2xl border border-primary/20 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-primary font-semibold text-dark-black leading-tight truncate">
                  {event.name}
                </h1>

                <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-3 py-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 font-secondary truncate max-w-[70vw] lg:max-w-[520px]">
                    {event.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Compact Actions + Metrics */}
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {/* Compact Timer chip */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-3 py-2">
                <SessionTimer
                  startTime={session.startedAt}
                  autoCloseAt={session.autoCloseAt}
                  className={cn(
                    "bg-transparent border-0 shadow-none p-0",
                    "flex items-center gap-6",
                  )}
                />
              </div>

              {/* Counts chips */}
              <div className="flex items-center rounded-xl border border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
                <div className="px-3 py-2 text-center">
                  <p className="text-xl font-primary font-bold text-primary leading-none">
                    {session.totalCheckedIn}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-600 font-secondary">
                    Checked
                  </p>
                </div>
                <div className="w-px h-10 bg-primary/20" />
                <div className="px-3 py-2 text-center bg-white">
                  <p className="text-xl font-primary font-bold text-gray-700 leading-none">
                    {event.expectedStaffCount}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-600 font-secondary">
                    Expected
                  </p>
                </div>
              </div>

              {/* End Session button (kept) */}
              <button
                type="button"
                onClick={onEndSession}
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "px-3 py-2 rounded-xl text-sm font-secondary font-semibold",
                  "border border-gray-200 bg-white text-gray-700",
                  "hover:bg-red-50 hover:text-red-600 hover:border-red-200",
                  "focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2",
                  "transition-all",
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 12H3" />
                  <path d="M10 18H3" />
                  <path d="M10 6H3" />
                  <path d="M21 12a9 9 0 0 0-9-9" />
                  <path d="M21 12a9 9 0 0 1-9 9" />
                  <path d="M21 12h-6" />
                </svg>
                End Session
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-primary text-dark-black mb-2">
                Staff Check-In
              </h2>
              <p className="text-gray-600 font-secondary text-sm">
                Enter your phone number and PIN to check in
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <PhoneNumberInput
                label="Phone Number"
                value={phone}
                onChange={(value) => setPhone(value)}
                disabled={isLoading}
                autoFocus
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-secondary font-medium text-gray-700">
                    6-Digit PIN
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPIN}
                    disabled={isSendingPIN || isLoading}
                    className={cn(
                      "text-xs text-primary font-secondary",
                      "hover:underline transition-all",
                      "disabled:text-gray-400 disabled:no-underline",
                    )}
                  >
                    {isSendingPIN ? "Sending..." : "Forgot PIN?"}
                  </button>
                </div>
                <PINInput
                  length={6}
                  value={pin}
                  onChange={setPin}
                  onComplete={handlePINComplete}
                  disabled={isLoading}
                  autoFocus={false}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !phone || pin.length !== 6}
                className={cn(
                  "w-full py-4 px-4 rounded-lg font-secondary font-semibold text-lg",
                  "bg-primary text-white",
                  "hover:bg-[#e0c580] hover:shadow-lg hover:shadow-primary/20",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transform hover:scale-[1.02] active:scale-[0.98]",
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" light />
                    Verifying...
                  </span>
                ) : (
                  "Check In"
                )}
              </button>
            </form>

            {!isOnline && (
              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 font-secondary text-center">
                  You&apos;re offline. Check-ins will be saved and synced when
                  connection is restored.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onContactAdmin}
              className={cn(
                "text-sm text-gray-500 font-secondary",
                "hover:text-primary transition-colors",
              )}
            >
              Need help? <span className="underline">Contact Admin</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-6 text-sm font-secondary">
          <span className="text-gray-500">
            Checked In:{" "}
            <span className="font-semibold text-dark-black">
              {session.totalCheckedIn}
            </span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            Expected:{" "}
            <span className="font-semibold text-dark-black">
              {event.expectedStaffCount}
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}
