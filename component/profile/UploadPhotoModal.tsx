"use client";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/apiFetch";

interface UploadPhotoModalProps {
  currentPhoto?: string;
  userName: string;
  onClose: () => void;
  onSave: (photoUrl: string) => void;
}

export default function UploadPhotoModal({
  currentPhoto,
  userName,
  onClose,
  onSave,
}: UploadPhotoModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File): boolean => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar file size cannot exceed 5MB", {
        toastId: "avatar-size-error",
      });
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WebP images are allowed", {
        toastId: "avatar-type-error",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (!validateAndProcessFile(file)) {
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !preview) {
      toast.error("Please select a photo first", {
        toastId: "no-file-selected",
      });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        try {
          const response = await apiFetch<{ user: any; message: string }>(
            "/api/profile/avatar",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ avatar_base64: base64String }),
            },
          );

          toast.success(response.message || "Avatar uploaded successfully", {
            toastId: "avatar-upload-success",
          });

          onSave(response.user.avatar_url || "");
        } catch (error: any) {
          console.error("Failed to upload avatar:", error);
          toast.error(error.message || "Failed to upload avatar", {
            toastId: "avatar-upload-error",
          });
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read file", {
          toastId: "file-read-error",
        });
        setIsUploading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred", {
        toastId: "unexpected-error",
      });
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) {
      return;
    }

    setIsUploading(true);

    try {
      const response = await apiFetch<{ user: any; message: string }>(
        "/api/profile/avatar",
        {
          method: "DELETE",
        },
      );

      toast.success(response.message || "Avatar removed successfully", {
        toastId: "avatar-remove-success",
      });

      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSave(response.user.avatar_url || "");
    } catch (error: any) {
      console.error("Failed to remove avatar:", error);
      toast.error(error.message || "Failed to remove avatar", {
        toastId: "avatar-remove-error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-700/70 transition-opacity"
          onClick={isUploading ? undefined : onClose}
        />

        <div className="relative inline-block w-full max-w-md my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-primary font-bold text-gray-900">
              Update Profile Photo
            </h2>
            <button
              onClick={onClose}
              disabled={isUploading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={preview || currentPhoto || "/male.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent" />
                  </div>
                )}

                {(preview || currentPhoto) && !isUploading && (
                  <button
                    onClick={handleRemove}
                    disabled={isUploading}
                    className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove photo"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isUploading
                  ? "opacity-50 cursor-not-allowed"
                  : isDragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleInputChange}
                disabled={isUploading}
                className="hidden"
              />
              <svg
                className="w-10 h-10 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-secondary text-gray-600">
                <span className="text-primary font-medium">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF, WebP up to 5MB
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-gray-700 font-secondary font-medium hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!preview || isUploading}
              className="px-4 py-2 bg-primary text-white font-secondary font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
              )}
              {isUploading ? "Uploading..." : "Save Photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
