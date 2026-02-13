"use client";

import { useState } from "react";
import { VendorReview } from "@/type/vendors";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";

interface VendorReviewsSectionProps {
  vendorId: string;
  reviews: VendorReview[];
  averageRating: string;
  totalReviews: number;
  onRefresh: () => void;
}

interface ReviewFormData {
  rating: number;
  notes: string;
  event: string;
}

export default function VendorReviewsSection({
  vendorId,
  reviews,
  averageRating,
  totalReviews,
  onRefresh,
}: VendorReviewsSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<VendorReview | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [addForm, setAddForm] = useState<ReviewFormData>({
    rating: 0,
    notes: "",
    event: "",
  });

  const [editForm, setEditForm] = useState<ReviewFormData>({
    rating: 0,
    notes: "",
    event: "",
  });

  const handleOpenAdd = () => {
    setAddForm({
      rating: 0,
      notes: "",
      event: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (review: VendorReview) => {
    setSelectedReview(review);
    setEditForm({
      rating: parseFloat(review.rating),
      notes: review.notes || "",
      event: review.event || "",
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (review: VendorReview) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (addForm.rating === 0) {
      toastError("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch(`/api/vendors/${vendorId}/reviews/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: addForm.rating,
          notes: addForm.notes || null,
          event: addForm.event || null,
        }),
      });

      toastSuccess("Review added successfully");
      setShowAddModal(false);
      onRefresh();
    } catch (error) {
      console.error("Add review error:", error);
      if (error && typeof error === "object" && "message" in error) {
        toastError(error.message as string);
      } else {
        toastError("Failed to add review");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReview) return;

    if (editForm.rating === 0) {
      toastError("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch(
        `/api/vendors/${vendorId}/reviews/${selectedReview.id}/update`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: editForm.rating,
            notes: editForm.notes || null,
            event: editForm.event || null,
          }),
        },
      );

      toastSuccess("Review updated successfully");
      setShowEditModal(false);
      setSelectedReview(null);
      onRefresh();
    } catch (error) {
      console.error("Update review error:", error);
      toastError("Failed to update review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;

    setIsDeleting(true);

    try {
      await apiFetch(
        `/api/vendors/${vendorId}/reviews/${selectedReview.id}/delete`,
        {
          method: "DELETE",
        },
      );

      toastSuccess("Review deleted successfully");
      setShowDeleteModal(false);
      setSelectedReview(null);
      onRefresh();
    } catch (error) {
      console.error("Delete review error:", error);
      toastError("Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  const StarRating = ({
    rating,
    onRatingChange,
    interactive = false,
  }: {
    rating: number;
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
  }) => {
    const [localHover, setLocalHover] = useState(0);

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            onMouseEnter={() => interactive && setLocalHover(star)}
            onMouseLeave={() => interactive && setLocalHover(0)}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-colors`}
          >
            <svg
              className={`w-6 h-6 ${
                star <= (interactive ? localHover || rating : rating)
                  ? "text-amber-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        ))}
        {interactive && (
          <span className="ml-2 text-sm font-secondary text-gray-600">
            {rating > 0 ? `${rating.toFixed(1)} / 5.0` : "Select rating"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-secondary font-semibold text-gray-700">
            Reviews ({reviews.length})
          </h4>
          {totalReviews > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(parseFloat(averageRating))
                        ? "text-amber-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-secondary font-semibold text-gray-900">
                {parseFloat(averageRating).toFixed(1)} / 5.0
              </span>
              <span className="text-xs text-gray-500 font-secondary">
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleOpenAdd}
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

      {reviews.length === 0 ? (
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
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <p className="text-gray-900 font-secondary font-medium mb-1">
            No reviews yet
          </p>
          <p className="text-gray-500 font-secondary text-sm">
            Click "Add Review" to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(parseFloat(review.rating))
                              ? "text-amber-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-secondary font-semibold text-gray-900">
                      {parseFloat(review.rating).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-secondary mb-2">
                    By {review.created_by_name || "Unknown"} on{" "}
                    {new Date(review.created_at).toLocaleDateString()}
                    {review.event_name && (
                      <span className="ml-1">• {review.event_name}</span>
                    )}
                  </p>
                  {review.notes && (
                    <p className="text-sm font-secondary text-gray-900">
                      {review.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleOpenEdit(review)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleOpenDelete(review)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
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

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <form onSubmit={handleAdd}>
              <div className="p-6">
                <h3 className="text-lg font-primary font-semibold text-gray-900 mb-4">
                  Add Review
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <StarRating
                      rating={addForm.rating}
                      onRatingChange={(rating) =>
                        setAddForm((prev) => ({ ...prev, rating }))
                      }
                      interactive
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Review (Optional)
                    </label>
                    <textarea
                      value={addForm.notes}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Share your experience with this vendor..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white font-secondary font-semibold rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : "Add Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedReview && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <form onSubmit={handleUpdate}>
              <div className="p-6">
                <h3 className="text-lg font-primary font-semibold text-gray-900 mb-4">
                  Edit Review
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <StarRating
                      rating={editForm.rating}
                      onRatingChange={(rating) =>
                        setEditForm((prev) => ({ ...prev, rating }))
                      }
                      interactive
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Review (Optional)
                    </label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Share your experience with this vendor..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedReview(null);
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white font-secondary font-semibold rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating..." : "Update Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedReview && (
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
                Delete Review
              </h3>
              <p className="text-sm text-gray-600 font-secondary text-center mb-6">
                Are you sure you want to delete this review (
                {parseFloat(selectedReview.rating).toFixed(1)}/5.0)? This action
                cannot be undone.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedReview(null);
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
