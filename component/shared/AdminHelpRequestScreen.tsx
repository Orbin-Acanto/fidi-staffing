"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks";
import LoadingSpinner from "./LoadingSpinner";
import CountdownTimer from "./CountdownTimer";

interface AdminHelpRequestScreenProps {
  onCancel: () => void;
  onTimeout: () => void;
  timeoutSeconds?: number;
}

export default function AdminHelpRequestScreen({
  onCancel,
  onTimeout,
  timeoutSeconds = 120,
}: AdminHelpRequestScreenProps) {
  const { playNotification } = useSound();

  useEffect(() => {
    playNotification();
  }, [playNotification]);

  const handleTimeout = useCallback(() => {
    onTimeout();
  }, [onTimeout]);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-blue-500 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-28 h-28 rounded-full border-4 border-blue-300 animate-ping opacity-30" />
          </div>
        </div>

        <h1 className="text-2xl font-primary font-bold text-dark-black mb-2">
          Admin Notified
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LoadingSpinner size="sm" />
            <span className="text-gray-700 font-secondary">
              Please wait for assistance...
            </span>
          </div>
          <p className="text-sm text-gray-500 font-secondary">
            An admin has been notified and will come to help you shortly.
          </p>
        </div>

        <div className="mb-6">
          <CountdownTimer
            seconds={timeoutSeconds}
            onComplete={handleTimeout}
            text="Request expires in"
            size="sm"
          />
        </div>

        <button
          type="button"
          onClick={onCancel}
          className={cn(
            "w-full py-3 px-4 rounded-lg font-secondary font-medium",
            "bg-gray-100 text-gray-700 hover:bg-gray-200",
            "transition-all duration-200",
          )}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
