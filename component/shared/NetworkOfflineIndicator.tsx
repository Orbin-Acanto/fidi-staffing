"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NetworkOfflineIndicatorProps {
  queuedCount?: number;
  className?: string;
}

export default function NetworkOfflineIndicator({
  queuedCount = 0,
  className,
}: NetworkOfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showConnected, setShowConnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnecting(false);
      setShowConnected(true);

      setTimeout(() => setShowConnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnecting(true);

      setTimeout(() => setIsReconnecting(false), 5000);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showConnected) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center font-secondary text-sm",
        "transition-all duration-300 animate-slideDown",
        isOnline ? "bg-green-500 text-white" : "bg-amber-500 text-amber-900",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {!isOnline && (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>

            <span className="font-medium">Offline Mode</span>

            {isReconnecting && (
              <span className="flex items-center gap-1">
                <span className="animate-spin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Reconnecting...
              </span>
            )}

            {queuedCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-600 rounded-full text-xs text-white">
                {queuedCount} pending
              </span>
            )}
          </>
        )}

        {isOnline && showConnected && (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Connected</span>
          </>
        )}
      </div>

      {!isOnline && (
        <p className="text-xs mt-1 opacity-80">
          Check-ins will sync when connection restored
        </p>
      )}
    </div>
  );
}
