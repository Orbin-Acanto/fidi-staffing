"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhotoComparisonProps {
  profilePhoto: string;
  capturedPhoto: string;
  staffName?: string;
  className?: string;
}

export default function PhotoComparison({
  profilePhoto,
  capturedPhoto,
  staffName,
  className,
}: PhotoComparisonProps) {
  return (
    <div className={cn("w-full", className)}>
      {staffName && (
        <h3 className="text-lg font-primary font-semibold text-dark-black text-center mb-4">
          Verifying: {staffName}
        </h3>
      )}

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
            <Image
              src={profilePhoto}
              alt="Profile photo"
              fill
              className="object-cover"
            />
          </div>
          <span className="mt-2 text-sm font-secondary text-gray-500">
            Profile Photo
          </span>
        </div>

        <div className="flex items-center justify-center">
          <div className="hidden sm:flex flex-col items-center gap-2">
            <div className="h-16 w-px bg-gray-300" />
            <span className="text-sm font-secondary font-medium text-gray-400 uppercase tracking-wide">
              vs
            </span>
            <div className="h-16 w-px bg-gray-300" />
          </div>
          <div className="sm:hidden flex items-center gap-2">
            <div className="w-16 h-px bg-gray-300" />
            <span className="text-sm font-secondary font-medium text-gray-400 uppercase tracking-wide">
              vs
            </span>
            <div className="w-16 h-px bg-gray-300" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden border-2 border-primary shadow-lg">
            <Image
              src={capturedPhoto}
              alt="Captured photo"
              fill
              className="object-cover"
            />
          </div>
          <span className="mt-2 text-sm font-secondary text-gray-500">
            Just Captured
          </span>
        </div>
      </div>
    </div>
  );
}
