"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/component/shared/LoadingSpinner";

interface FaceVerificationProcessingProps {
  capturedPhoto: string;
  onTimeout: () => void;
  timeoutSeconds?: number;
}

export default function FaceVerificationProcessing({
  capturedPhoto,
  onTimeout,
  timeoutSeconds = 30,
}: FaceVerificationProcessingProps) {
  const [progress, setProgress] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasTimedOut(true);
      onTimeout();
    }, timeoutSeconds * 1000);

    return () => clearTimeout(timeout);
  }, [timeoutSeconds, onTimeout]);

  if (hasTimedOut) {
    return (
      <div className="min-h-screen bg-whitesmoke flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-primary font-semibold text-dark-black mb-2">
            Taking Longer Than Expected
          </h2>
          <p className="text-gray-600 font-secondary mb-6">
            The verification is taking longer than usual. You can wait or
            request admin assistance.
          </p>
          <button
            type="button"
            onClick={onTimeout}
            className={cn(
              "w-full py-3 px-4 rounded-lg font-secondary font-semibold",
              "bg-primary text-white hover:bg-[#e0c580]",
              "transition-all duration-200",
            )}
          >
            Get Admin Help
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-whitesmoke flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
              <Image
                src={capturedPhoto}
                alt="Your photo"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-b from-primary/20 to-transparent animate-scan" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-primary font-semibold text-dark-black mb-2">
              Verifying Your Identity
            </h2>
            <p className="text-gray-600 font-secondary text-sm">
              Please wait while we verify your photo...
            </p>
          </div>

          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 font-secondary mt-2">
              {progress < 30
                ? "Analyzing photo..."
                : progress < 60
                  ? "Comparing with profile..."
                  : progress < 90
                    ? "Finalizing verification..."
                    : "Almost done..."}
            </p>
          </div>

          <div className="flex justify-center">
            <LoadingSpinner size="md" />
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onTimeout}
              className="text-sm text-gray-500 font-secondary hover:text-primary transition-colors"
            >
              Having trouble? <span className="underline">Get admin help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
