"use client";

import { useState } from "react";
import { VendorDocument } from "@/type/vendors";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { AppSelect } from "@/component/ui/Select";
import { AppDatePicker } from "@/component/ui/AppDatePicker";
import { toMediaProxyUrl } from "@/lib/mediaUrl";

interface VendorDocumentsSectionProps {
  vendorId: string;
  documents: VendorDocument[];
  onRefresh: () => void;
}

interface UploadFormData {
  documentType: string;
  name: string;
  file: File | null;
  expiryDate: string;
  notes: string;
}

interface EditFormData {
  name: string;
  documentType: string;
  expiryDate: string;
  notes: string;
}

export default function VendorDocumentsSection({
  vendorId,
  documents,
  onRefresh,
}: VendorDocumentsSectionProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<VendorDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    documentType: "other",
    name: "",
    file: null,
    expiryDate: "",
    notes: "",
  });

  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    documentType: "",
    expiryDate: "",
    notes: "",
  });

  const handleOpenUpload = () => {
    setUploadForm({
      documentType: "other",
      name: "",
      file: null,
      expiryDate: "",
      notes: "",
    });
    setShowUploadModal(true);
  };

  const handleOpenEdit = (doc: VendorDocument) => {
    setSelectedDocument(doc);
    setEditForm({
      name: doc.name,
      documentType: doc.document_type,
      expiryDate: doc.expiry_date || "",
      notes: doc.notes || "",
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (doc: VendorDocument) => {
    setSelectedDocument(doc);
    setShowDeleteModal(true);
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
      formData.append("document_type", uploadForm.documentType);
      formData.append("name", uploadForm.name);
      formData.append("file", uploadForm.file);
      if (uploadForm.expiryDate) {
        formData.append("expiry_date", uploadForm.expiryDate);
      }
      if (uploadForm.notes) {
        formData.append("notes", uploadForm.notes);
      }

      await apiFetch(`/api/vendors/${vendorId}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      toastSuccess("Document uploaded successfully");
      setShowUploadModal(false);
      onRefresh();
    } catch (error) {
      console.error("Upload error:", error);
      if (error && typeof error === "object" && "message" in error) {
        toastError(error.message as string);
      } else {
        toastError("Failed to upload document");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDocument) return;

    setIsUpdating(true);

    try {
      await apiFetch(
        `/api/vendors/${vendorId}/documents/${selectedDocument.id}/update`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editForm.name,
            document_type: editForm.documentType,
            expiry_date: editForm.expiryDate || null,
            notes: editForm.notes || null,
          }),
        },
      );

      toastSuccess("Document updated successfully");
      setShowEditModal(false);
      setSelectedDocument(null);
      onRefresh();
    } catch (error) {
      console.error("Update error:", error);
      toastError("Failed to update document");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;

    setIsDeleting(true);

    try {
      await apiFetch(
        `/api/vendors/${vendorId}/documents/${selectedDocument.id}/delete`,
        {
          method: "DELETE",
        },
      );

      toastSuccess("Document deleted successfully");
      setShowDeleteModal(false);
      setSelectedDocument(null);
      onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      toastError("Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVerify = async (doc: VendorDocument) => {
    try {
      await apiFetch(`/api/vendors/${vendorId}/documents/${doc.id}/verify`, {
        method: "POST",
      });

      toastSuccess(
        doc.is_verified
          ? "Document unverified successfully"
          : "Document verified successfully",
      );
      onRefresh();
    } catch (error) {
      console.error("Verify error:", error);
      toastError("Failed to verify document");
    }
  };

  const getDocumentTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      agreement: "Agreement",
      invoice: "Invoice",
      insurance: "Insurance",
      form: "Required Form",
      other: "Other",
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-secondary font-semibold text-gray-700">
          Documents ({documents.length})
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

      {documents.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-900 font-secondary font-medium mb-1">
            No documents uploaded
          </p>
          <p className="text-gray-500 font-secondary text-sm">
            Click "Upload Document" to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-secondary font-semibold text-gray-900">
                      {doc.name}
                    </h5>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary font-medium bg-blue-100 text-blue-700 capitalize">
                      {getDocumentTypeDisplay(doc.document_type)}
                    </span>
                    {doc.is_verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-secondary font-medium bg-green-100 text-green-700">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-secondary space-y-1">
                    <p>
                      Uploaded by {doc.uploaded_by_name || "Unknown"} on{" "}
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                    {doc.expiry_date && (
                      <p className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Expires:{" "}
                        {new Date(doc.expiry_date).toLocaleDateString()}
                      </p>
                    )}
                    {doc.is_verified && doc.verified_by_name && (
                      <p className="text-green-600">
                        Verified by {doc.verified_by_name} on{" "}
                        {doc.verified_at &&
                          new Date(doc.verified_at).toLocaleDateString()}
                      </p>
                    )}
                    {doc.notes && (
                      <p className="mt-2 text-gray-700">{doc.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {doc.file_url && (
                    <a
                      href={toMediaProxyUrl(doc.file_url) || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Download"
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </a>
                  )}
                  <button
                    onClick={() => handleVerify(doc)}
                    className={`rounded-full transition-colors ${
                      doc.is_verified
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(doc)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleOpenDelete(doc)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <form onSubmit={handleUpload}>
              <div className="p-6">
                <h3 className="text-lg font-primary font-semibold text-gray-900 mb-4">
                  Upload Document
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Document Type <span className="text-red-500">*</span>
                    </label>
                    <AppSelect
                      value={uploadForm.documentType}
                      onValueChange={(value) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          documentType: value,
                        }))
                      }
                      options={[
                        { label: "Agreement", value: "agreement" },
                        { label: "Invoice", value: "invoice" },
                        { label: "Insurance", value: "insurance" },
                        { label: "Required Form", value: "form" },
                        { label: "Other", value: "other" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Document Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={uploadForm.name}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Liability Insurance 2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-secondary font-semibold text-gray-700">
                      Upload File
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
                            PDF, DOC, DOCX, JPG, PNG
                          </p>
                        </div>
                      </div>

                      <label className="px-4 py-2 bg-primary text-white rounded-lg font-secondary font-semibold hover:bg-primary/80 cursor-pointer whitespace-nowrap">
                        Browse
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            setUploadForm((prev) => ({
                              ...prev,
                              file: e.target.files?.[0] || null,
                            }))
                          }
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <AppDatePicker
                      label="Expiry Date (Optional)"
                      value={uploadForm.expiryDate}
                      onChange={(ymd) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          expiryDate: ymd,
                        }))
                      }
                    />
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
                      placeholder="Additional information about this document..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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

      {showEditModal && selectedDocument && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <form onSubmit={handleUpdate}>
              <div className="p-6">
                <h3 className="text-lg font-primary font-semibold text-gray-900 mb-4">
                  Edit Document
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Document Type <span className="text-red-500">*</span>
                    </label>
                    <AppSelect
                      value={editForm.documentType}
                      onValueChange={(value) =>
                        setEditForm((prev) => ({
                          ...prev,
                          documentType: value,
                        }))
                      }
                      options={[
                        { label: "Agreement", value: "agreement" },
                        { label: "Invoice", value: "invoice" },
                        { label: "Insurance", value: "insurance" },
                        { label: "Required Form", value: "form" },
                        { label: "Other", value: "other" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Document Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <AppDatePicker
                      label="Expiry Date (Optional)"
                      value={editForm.expiryDate}
                      onChange={(ymd) =>
                        setEditForm((prev) => ({
                          ...prev,
                          expiryDate: ymd,
                        }))
                      }
                    />
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
                    setSelectedDocument(null);
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

      {showDeleteModal && selectedDocument && (
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
                Delete Document
              </h3>
              <p className="text-sm text-gray-600 font-secondary text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {selectedDocument.name}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDocument(null);
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
    </div>
  );
}
