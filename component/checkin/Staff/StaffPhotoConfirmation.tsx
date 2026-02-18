"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { StaffType } from "@/type";
import { toMediaProxyUrl } from "@/lib/mediaUrl";

interface StaffPhotoConfirmationProps {
  staff: StaffType;
  onConfirm: () => void;
  onReject: () => void;
}

export default function StaffPhotoConfirmation({
  staff,
  onConfirm,
  onReject,
}: StaffPhotoConfirmationProps) {
  return (
    <div className="min-h-screen bg-whitesmoke flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-xl font-primary font-semibold text-dark-black mb-2">
              Confirm Your Identity
            </h2>
            <p className="text-gray-600 font-secondary text-sm">
              Is this your photo?
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border-4 border-primary/20 shadow-lg">
              <Image
                src={toMediaProxyUrl(staff.photoUrl) || "./male.png"}
                alt={`${staff.firstName} ${staff.lastName}`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-primary font-bold text-dark-black">
              {staff.firstName} {staff.lastName}
            </h3>
            <p className="text-gray-500 font-secondary mt-1">
              {staff.position}
            </p>
          </div>

          <p className="text-center text-dark-black font-secondary font-medium mb-6">
            Is this you?
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onReject}
              className={cn(
                "flex-1 py-4 px-6 rounded-lg font-secondary font-semibold",
                "bg-gray-100 text-gray-700 hover:bg-gray-200",
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              No
            </button>
            <button
              type="button"
              onClick={onConfirm}
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
              Yes, Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
