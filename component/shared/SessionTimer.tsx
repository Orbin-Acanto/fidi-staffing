"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SessionTimerProps {
  startTime: string;
  autoCloseAt?: string;
  onAutoClose?: () => void;
  className?: string;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export default function SessionTimer({
  startTime,
  autoCloseAt,
  onAutoClose,
  className,
}: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const autoClose = autoCloseAt ? new Date(autoCloseAt).getTime() : null;

    const updateTimes = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - start) / 1000);
      setElapsed(elapsedSeconds);

      if (autoClose) {
        const remainingMs = autoClose - now;
        if (remainingMs <= 0) {
          setRemaining(0);
          onAutoClose?.();
        } else {
          setRemaining(Math.floor(remainingMs / 1000));
        }
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, [startTime, autoCloseAt, onAutoClose]);

  const isWarning = remaining !== null && remaining < 600;
  const isCritical = remaining !== null && remaining < 120;

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-2 rounded-lg bg-gray-100",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <span className="text-xs font-secondary text-gray-500">Session</span>
          <p className="text-sm font-secondary font-medium text-dark-black">
            {formatDuration(elapsed)}
          </p>
        </div>
      </div>

      {remaining !== null && (
        <>
          <div className="w-px h-8 bg-gray-300" />
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "h-5 w-5",
                isCritical
                  ? "text-red-500 animate-pulse"
                  : isWarning
                    ? "text-yellow-500"
                    : "text-gray-500",
              )}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <span className="text-xs font-secondary text-gray-500">
                Auto-close
              </span>
              <p
                className={cn(
                  "text-sm font-secondary font-medium",
                  isCritical
                    ? "text-red-600"
                    : isWarning
                      ? "text-yellow-600"
                      : "text-dark-black",
                )}
              >
                {formatDuration(remaining)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
