"use client";

import { useState } from "react";
import { VendorMedia } from "@/type/vendors";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { AppSelect } from "@/component/ui/Select";
import { AppCheckbox } from "@/component/ui/Checkbox";
import { toMediaProxyUrl } from "@/lib/mediaUrl";

interface VendorMediaSectionProps {
  vendorId: string;
  media: VendorMedia[];
  onRefresh: () => void;
}

interface UploadFormData {
  mediaType: "image" | "video";
  title: string;
  file: File | null;
  isFeatured: boolean;
  notes: string;
}

interface EditFormData {
  title: string;
  mediaType: "image" | "video";
  isFeatured: boolean;
  notes: string;
}

export default function VendorMediaSection({
  vendorId,
  media,
  onRefresh,
}: VendorMediaSectionProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<VendorMedia | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    mediaType: "image",
    title: "",
    file: null,
    isFeatured: false,
    notes: "",
  });

  const [editForm, setEditForm] = useState<EditFormData>({
    title: "",
    mediaType: "image",
    isFeatured: false,
    notes: "",
  });

  const handleOpenUpload = () => {
    setUploadForm({
      mediaType: "image",
      title: "",
      file: null,
      isFeatured: false,
      notes: "",
    });
    setPreviewUrl(null);
    setShowUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadForm((prev) => ({ ...prev, file }));

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleOpenEdit = (mediaItem: VendorMedia) => {
    setSelectedMedia(mediaItem);
    setEditForm({
      title: mediaItem.title || "",
      mediaType: mediaItem.media_type,
      isFeatured: mediaItem.is_featured,
      notes: mediaItem.notes || "",
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (mediaItem: VendorMedia) => {
    setSelectedMedia(mediaItem);
    setShowDeleteModal(true);
  };

  const handleOpenPreview = (mediaItem: VendorMedia) => {
    setSelectedMedia(mediaItem);
    setShowPreviewModal(true);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.file) {
      toastError("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("media_type", uploadForm.mediaType);
      formData.append("file", uploadForm.file);
      if (uploadForm.title) {
        formData.append("title", uploadForm.title);
      }
      formData.append("is_featured", uploadForm.isFeatured.toString());
      if (uploadForm.notes) {
        formData.append("notes", uploadForm.notes);
      }

      await apiFetch(`/api/vendors/${vendorId}/media/upload`, {
        method: "POST",
        body: formData,
      });

      toastSuccess("Media uploaded successfully");
      setShowUploadModal(false);
      setPreviewUrl(null);
      onRefresh();
    } catch (error) {
      console.error("Upload error:", error);
      if (error && typeof error === "object" && "message" in error) {
        toastError(error.message as string);
      } else {
        toastError("Failed to upload media");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMedia) return;

    setIsUpdating(true);

    try {
      await apiFetch(
        `/api/vendors/${vendorId}/media/${selectedMedia.id}/update`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editForm.title || null,
            media_type: editForm.mediaType,
            is_featured: editForm.isFeatured,
            notes: editForm.notes || null,
          }),
        },
      );

      toastSuccess("Media updated successfully");
      setShowEditModal(false);
      setSelectedMedia(null);
      onRefresh();
    } catch (error) {
      console.error("Update error:", error);
      toastError("Failed to update media");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMedia) return;

    setIsDeleting(true);

    try {
      await apiFetch(
        `/api/vendors/${vendorId}/media/${selectedMedia.id}/delete`,
        {
          method: "DELETE",
        },
      );

      toastSuccess("Media deleted successfully");
      setShowDeleteModal(false);
      setSelectedMedia(null);
      onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      toastError("Failed to delete media");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFeatured = async (mediaItem: VendorMedia) => {
    try {
      await apiFetch(
        `/api/vendors/${vendorId}/media/${mediaItem.id}/toggle-featured`,
        {
          method: "POST",
        },
      );

      toastSuccess(
        mediaItem.is_featured
          ? "Media unfeatured successfully"
          : "Media featured successfully",
      );
      onRefresh();
    } catch (error) {
      console.error("Toggle featured error:", error);
      toastError("Failed to toggle featured status");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-secondary font-semibold text-gray-700">
          Media ({media.length})
        </h4>
        <button
          onClick={handleOpenUpload}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-white font-secondary font-medium rounded-lg hover:bg-primary/80 transition-colors text-sm"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {media.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
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
          <p className="text-gray-900 font-secondary font-medium mb-1">
            No media uploaded
          </p>
          <p className="text-gray-500 font-secondary text-sm">
            Click "Upload Media" to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {media.map((mediaItem) => (
            <div
              key={mediaItem.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors group relative"
            >
              <div
                className="relative w-full h-48 bg-gray-100 cursor-pointer"
                onClick={() => handleOpenPreview(mediaItem)}
              >
                {mediaItem.file_url && mediaItem.media_type === "image" ? (
                  <img
                    src={toMediaProxyUrl(mediaItem.file_url) || undefined}
                    alt={mediaItem.title || "Vendor media"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {mediaItem.is_featured && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500 text-white text-xs font-secondary font-medium">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPreview(mediaItem);
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="View"
                  >
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFeatured(mediaItem);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      mediaItem.is_featured
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    title={mediaItem.is_featured ? "Unfeature" : "Feature"}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={mediaItem.is_featured ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(mediaItem);
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDelete(mediaItem);
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-3">
                {mediaItem.title && (
                  <p className="text-sm font-secondary font-medium text-gray-900 truncate mb-1">
                    {mediaItem.title}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-secondary capitalize">
                    {mediaItem.media_type}
                  </span>
                  <span className="text-xs text-gray-400 font-secondary">
                    {new Date(mediaItem.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full my-8">
            <form onSubmit={handleUpload}>
              <div className="p-6">
                <h3 className="text-lg font-primary font-semibold text-gray-900 mb-4">
                  Upload Media
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Media Type <span className="text-red-500">*</span>
                    </label>
                    <AppSelect
                      value={uploadForm.mediaType}
                      onValueChange={(value) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          mediaType: value as "image" | "video",
                        }))
                      }
                      options={[
                        { label: "Image", value: "image" },
                        { label: "Video", value: "video" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Event Setup Photos"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-secondary font-semibold text-gray-700">
                      File <span className="text-red-500">*</span>
                    </label>

                    <div className="flex items-center justify-between gap-4 p-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600">
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
                              d="M7 16V4m0 0l-3 3m3-3l3 3M17 20v-8m0 0l-3 3m3-3l3 3"
                            />
                          </svg>
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-secondary font-medium text-gray-900 truncate">
                            {uploadForm.file
                              ? uploadForm.file.name
                              : "No file selected"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {uploadForm.mediaType === "image"
                              ? "JPG, PNG, GIF, WEBP up to 10MB"
                              : "MP4, MOV, AVI up to 50MB"}
                          </p>
                        </div>
                      </div>

                      <label className="px-4 py-2 bg-primary text-white rounded-lg font-secondary font-semibold hover:bg-primary/80 cursor-pointer whitespace-nowrap">
                        Browse
                        <input
                          type="file"
                          hidden
                          accept={
                            uploadForm.mediaType === "image"
                              ? "image/*"
                              : "video/*"
                          }
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>
                  </div>

                  {previewUrl && (
                    <div className="border border-gray-200 rounded-lg p-2">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <AppCheckbox
                      checked={uploadForm.isFeatured}
                      onCheckedChange={(checked) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          isFeatured: Boolean(checked),
                        }))
                      }
                    />
                    <label className="text-sm font-secondary text-gray-700">
                      Mark as Featured
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={uploadForm.notes}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Additional information about this media..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setPreviewUrl(null);
                  }}
                  disabled={isUploading}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-primary text-white font-secondary font-semibold rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedMedia && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <form onSubmit={handleUpdate}>
              <div className="p-6">
                <h3 className="text-lg font-primary font-semibold text-gray-900 mb-4">
                  Edit Media
                </h3>

                <div className="space-y-4">
                  {/* <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Media Type <span className="text-red-500">*</span>
                    </label>
                    <AppSelect
                      value={editForm.mediaType}
                      onValueChange={(value) =>
                        setEditForm((prev) => ({
                          ...prev,
                          mediaType: value as "image" | "video",
                        }))
                      }
                      options={[
                        { label: "Image", value: "image" },
                        { label: "Video", value: "video" },
                      ]}
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <AppCheckbox
                      checked={editForm.isFeatured}
                      onCheckedChange={(checked) =>
                        setEditForm((prev) => ({
                          ...prev,
                          isFeatured: Boolean(checked),
                        }))
                      }
                    />
                    <label className="text-sm font-secondary text-gray-700">
                      Mark as Featured
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMedia(null);
                  }}
                  disabled={isUpdating}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-primary text-white font-secondary font-semibold rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedMedia && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-primary font-semibold text-gray-900 text-center mb-2">
                Delete Media
              </h3>
              <p className="text-sm text-gray-600 font-secondary text-center mb-6">
                Are you sure you want to delete this{" "}
                <span className="font-semibold text-gray-900">
                  {selectedMedia.title || selectedMedia.media_type}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedMedia(null);
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-secondary font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && selectedMedia && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowPreviewModal(false);
            setSelectedMedia(null);
          }}
        >
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                {selectedMedia.title && (
                  <h3 className="text-lg font-primary font-semibold text-white">
                    {selectedMedia.title}
                  </h3>
                )}
                <p className="text-sm text-gray-300 font-secondary">
                  {selectedMedia.media_type} •{" "}
                  {new Date(selectedMedia.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedMedia(null);
                }}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-8 h-8"
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

            <div className="bg-white rounded-lg overflow-hidden">
              {selectedMedia.file_url &&
              selectedMedia.media_type === "image" ? (
                <img
                  src={selectedMedia.file_url}
                  alt={selectedMedia.title || "Media preview"}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              ) : selectedMedia.file_url &&
                selectedMedia.media_type === "video" ? (
                <video
                  src={selectedMedia.file_url}
                  controls
                  className="w-full h-auto max-h-[80vh]"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500 font-secondary">
                    Preview not available
                  </p>
                </div>
              )}
            </div>

            {selectedMedia.notes && (
              <div className="mt-4 bg-white/10 rounded-lg p-4">
                <p className="text-sm text-white font-secondary">
                  {selectedMedia.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
