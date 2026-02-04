"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/component/shared/LoadingSpinner";
import { useCamera } from "@/hooks";

interface CameraPreviewScreenProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  onCameraError: () => void;
}

export default function CameraPreviewScreen({
  onCapture,
  onCancel,
  onCameraError,
}: CameraPreviewScreenProps) {
  const {
    videoRef,
    canvasRef,
    permission,
    isReady,
    error,
    capturedImage,
    startCamera,
    stopCamera,
    capturePhoto,
    retakePhoto,
  } = useCamera({ facingMode: "user" });

  const [lightingGuidance, setLightingGuidance] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (permission === "denied" || permission === "error") {
      onCameraError();
    }
  }, [permission, onCameraError]);

  useEffect(() => {
    if (isReady) {
      const guidance = [
        "Please face the light",
        "Move to a brighter area",
        "Hold still",
        null,
      ];
      let index = 0;

      const interval = setInterval(() => {
        setLightingGuidance(guidance[index]);
        index = (index + 1) % guidance.length;
        if (index === guidance.length - 1) {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isReady]);

  const handleCapture = () => {
    const image = capturePhoto();
    if (image) {
    }
  };

  const handleConfirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  if (permission === "pending") {
    return (
      <div className="min-h-screen bg-dark-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Accessing camera..." light />
      </div>
    );
  }

  if (permission === "denied" || permission === "error") {
    return (
      <div className="min-h-screen bg-whitesmoke flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-primary font-semibold text-dark-black mb-2">
            Camera Access Required
          </h2>
          <p className="text-gray-600 font-secondary mb-6">
            {error ||
              "Please allow camera access to continue with face verification."}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-secondary font-medium text-dark-black mb-2">
              To enable camera:
            </p>
            <ul className="text-sm text-gray-600 font-secondary space-y-1">
              <li>
                • Click the lock/info icon in your browser&apos;s address bar
              </li>
              <li>• Find &quot;Camera&quot; in the permissions</li>
              <li>• Change it to &quot;Allow&quot;</li>
              <li>• Refresh the page</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg font-secondary font-medium",
                "bg-gray-100 text-gray-700 hover:bg-gray-200",
                "transition-all duration-200",
              )}
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={onCameraError}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg font-secondary font-semibold",
                "bg-primary text-white hover:bg-[#e0c580]",
                "transition-all duration-200",
              )}
            >
              Get Admin Help
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-dark-black flex flex-col"
    >
      <div className="flex-1 relative">
        {!capturedImage ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
        ) : (
          <div className="absolute inset-0">
            <Image
              src={capturedImage}
              alt="Captured photo"
              fill
              className="object-cover"
            />
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {!capturedImage && isReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-80 border-4 border-white/50 rounded-[50%] relative">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
            </div>
          </div>
        )}

        {!capturedImage && lightingGuidance && (
          <div className="absolute top-8 left-0 right-0 text-center">
            <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-secondary animate-pulse">
              {lightingGuidance}
            </span>
          </div>
        )}

        {!isReady && permission === "granted" && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-black">
            <LoadingSpinner size="lg" text="Starting camera..." light />
          </div>
        )}
      </div>

      <div className="bg-dark-black p-6 pb-safe">
        {!capturedImage ? (
          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "w-14 h-14 rounded-full bg-white/20 text-white",
                "flex items-center justify-center",
                "hover:bg-white/30 transition-colors",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleCapture}
              disabled={!isReady}
              className={cn(
                "w-20 h-20 rounded-full bg-white",
                "flex items-center justify-center",
                "hover:scale-105 active:scale-95 transition-transform",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "ring-4 ring-white/30",
              )}
            >
              <div className="w-16 h-16 rounded-full bg-primary" />
            </button>

            <div className="w-14 h-14" />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-white font-secondary mb-4">
              Does this photo look good?
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={retakePhoto}
                className={cn(
                  "flex-1 py-4 px-6 rounded-lg font-secondary font-semibold",
                  "bg-white/20 text-white hover:bg-white/30",
                  "transition-all duration-200",
                  "flex items-center justify-center gap-2",
                )}
              >
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Retake
              </button>
              <button
                type="button"
                onClick={handleConfirmCapture}
                className={cn(
                  "flex-1 py-4 px-6 rounded-lg font-secondary font-semibold",
                  "bg-primary text-white hover:bg-[#e0c580]",
                  "transition-all duration-200",
                  "flex items-center justify-center gap-2",
                )}
              >
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Use Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
