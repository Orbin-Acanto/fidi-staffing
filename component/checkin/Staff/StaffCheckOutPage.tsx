"use client";

import { useState, FormEvent, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import PhoneNumberInput, {
  isValidPhoneNumber,
} from "@/component/shared/PhoneNumberInput";
import LoadingSpinner from "@/component/shared/LoadingSpinner";
import { EventType, StaffType, CheckOutSession, CheckInRecord } from "@/type";
import {
  staffCheckOutAttendance,
  verifyStaffPhoneAttendanceCheckout,
} from "@/services/attendance-api";
import NetworkOfflineIndicator from "@/component/shared/NetworkOfflineIndicator";

interface StaffCheckOutPageProps {
  event: EventType;
  session: CheckOutSession;
  checkInCount: number;
  onCheckOutSuccess: (staff: StaffType, record: CheckInRecord) => void;
  onContactAdmin: () => void;
  onEndSession: () => void;
  isOnline: boolean;
}

export default function StaffCheckOutPage({
  event,
  session,
  checkInCount,
  onCheckOutSuccess,
  onContactAdmin,
  onEndSession,
  isOnline,
}: StaffCheckOutPageProps) {
  const [phone, setPhone] = useState("");
  const [clockCode, setClockCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = useCallback(() => {
    setPhone("");
    setClockCode("");
  }, []);

  const validateForm = (): string | null => {
    if (!phone) return "Please enter your phone number.";
    if (!isValidPhoneNumber(phone))
      return "Please enter a valid 10-digit phone number.";
    if (!clockCode) return "Please enter the event clock code.";
    if (clockCode.length < 3)
      return "Clock code must be at least 3 characters.";
    return null;
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error, { toastId: error });
      return;
    }

    setIsLoading(true);

    try {
      const verifyResponse = await verifyStaffPhoneAttendanceCheckout(
        phone,
        clockCode,
        event.id,
      );

      if (!verifyResponse.success || !verifyResponse.data) {
        toastError(
          verifyResponse.error,
          "Invalid phone number or clock code. Please try again.",
        );
        setClockCode("");
        return;
      }

      const staffData = verifyResponse.data;

      const checkOutResponse = await staffCheckOutAttendance(
        staffData.staff_id,
        event.id,
      );

      if (checkOutResponse.success && checkOutResponse.data) {
        const staff: StaffType = {
          id: staffData.staff_id,
          firstName: staffData.staff_name.split(" ")[0] || "",
          lastName: staffData.staff_name.split(" ").slice(1).join(" ") || "",
          phone: phone,
          email: "",
          photoUrl: staffData.staff_avatar || "",
          position: staffData.role,
        };

        const record: CheckInRecord = {
          id: checkOutResponse.data.clock_entry_id,
          staffId: staffData.staff_id,
          staff: staff,
          sessionId: session.id,
          checkInTime: new Date().toISOString(),
          checkOutTime: new Date().toISOString(),
          verificationMethod: "pin",
          isLate: false,
        };

        toastSuccess(
          `Goodbye, ${staff.firstName}! You worked ${checkOutResponse.data.actual_hours.toFixed(1)} hours.`,
        );
        onCheckOutSuccess(staff, record);
        resetForm();
      } else {
        toastError(
          checkOutResponse.error,
          "Check-out failed. Please try again.",
        );
      }
    } catch (err) {
      toastError(err, "Check-out failed. Please try again.");
      setClockCode("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-whitesmoke flex flex-col">
      <NetworkOfflineIndicator />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-primary/15" />
                <div className="relative p-2 bg-white rounded-2xl border border-primary/20 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-primary font-semibold text-dark-black truncate">
                  {event.name}
                </h1>

                <div className="mt-1 inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <p className="text-xs font-secondary text-gray-600">
                    Check-Out Mode
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onEndSession}
              className={cn(
                "shrink-0 inline-flex items-center gap-2",
                "px-3 py-2 rounded-xl text-xs sm:text-sm font-secondary font-semibold",
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
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-primary text-dark-black mb-2">
                Staff Check-Out
              </h2>
              <p className="text-gray-600 font-secondary text-sm">
                Enter your phone number and event clock code
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
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Event Clock Code
                </label>
                <input
                  type="text"
                  value={clockCode}
                  onChange={(e) => setClockCode(e.target.value.toUpperCase())}
                  disabled={isLoading}
                  placeholder="Enter clock code"
                  className={cn(
                    "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg",
                    "text-dark-black font-secondary placeholder-gray-400",
                    "focus:outline-none focus:ring-0 focus:border-primary/90",
                    "transition-all duration-200 uppercase",
                    "disabled:bg-gray-100 disabled:cursor-not-allowed",
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !phone || !clockCode}
                className={cn(
                  "w-full py-4 px-4 rounded-lg font-secondary font-semibold text-lg",
                  "bg-primary text-white",
                  "hover:bg-primary/90 hover:shadow-lg",
                  "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2",
                  "transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transform hover:scale-[1.02] active:scale-[0.98]",
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" light />
                    Processing...
                  </span>
                ) : (
                  "Check Out"
                )}
              </button>
            </form>

            {!isOnline && (
              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm bg-amber-50 border-amber-200 text-amber-800 font-secondary text-center">
                  You&apos;re offline. Check-outs may be delayed.
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
            Checked Out:{" "}
            <span className="font-semibold text-dark-black">
              {session.totalCheckedOut}
            </span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            Remaining:{" "}
            <span className="font-semibold text-dark-black">
              {checkInCount - session.totalCheckedOut}
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}
