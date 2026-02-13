"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { VendorBackend, VendorCategory } from "@/type/vendors";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";

import { AppSelect } from "@/component/ui/Select";
import VendorGridView from "@/component/vendor/VendorGridView";
import VendorTableView from "@/component/vendor/VendorTableView";
import DeleteVendorModal from "@/component/vendor/DeleteVendorModal";
import VendorDetailModal from "@/component/vendor/VendorDetailModal";
import VendorSummaryPanel from "@/component/vendor/VendorSummaryPanel";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorBackend[]>([]);
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [preferredFilter, setPreferredFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);

  const [selectedVendor, setSelectedVendor] = useState<VendorBackend | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    preferredVendors: 0,
    averageRating: "0.00",
  });

  useEffect(() => {
    fetchVendors();
    fetchCategories();
  }, [currentPage, searchQuery, statusFilter, categoryFilter, preferredFilter]);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
        order_by: "company_name",
      });

      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter && statusFilter !== "all")
        params.append("status", statusFilter);
      if (categoryFilter && categoryFilter !== "all")
        params.append("vendor_type", categoryFilter);
      if (preferredFilter === "true") params.append("is_preferred", "true");

      const response = await apiFetch(`/api/vendors/list?${params.toString()}`);

      setVendors(response.results || []);
      setTotalCount(response.count || 0);

      const total = response.count || 0;
      const active = response.results.filter(
        (v: VendorBackend) => v.status === "active",
      ).length;
      const preferred = response.results.filter(
        (v: VendorBackend) => v.is_preferred,
      ).length;
      const avgRating =
        response.results.length > 0
          ? (
              response.results.reduce(
                (sum: number, v: VendorBackend) => sum + parseFloat(v.rating),
                0,
              ) / response.results.length
            ).toFixed(2)
          : "0.00";

      setStats({
        totalVendors: total,
        activeVendors: active,
        preferredVendors: preferred,
        averageRating: avgRating,
      });
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
      toastError("Failed to load vendors");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiFetch("/api/vendors/categories/list");
      setCategories(response.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleOpenDetail = (vendor: VendorBackend) => {
    setSelectedVendor(vendor);
    setShowDetailModal(true);
  };

  const handleOpenDelete = (vendor: VendorBackend) => {
    setSelectedVendor(vendor);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedVendor) return;

    try {
      await apiFetch(`/api/vendors/${selectedVendor.id}/delete`, {
        method: "DELETE",
      });

      toastSuccess("Vendor deleted successfully");
      setShowDeleteModal(false);
      setSelectedVendor(null);
      fetchVendors();
    } catch (error) {
      console.error("Delete error:", error);
      if (error && typeof error === "object" && "message" in error) {
        toastError(error.message as string);
      } else {
        toastError("Failed to delete vendor");
      }
    }
  };

  const handleToggleStatus = async (vendorId: string) => {
    try {
      await apiFetch(`/api/vendors/${vendorId}/toggle-status`, {
        method: "POST",
      });

      toastSuccess("Vendor status updated");
      fetchVendors();
    } catch (error) {
      console.error("Toggle status error:", error);
      toastError("Failed to update vendor status");
    }
  };

  const handleTogglePreferred = async (vendorId: string) => {
    try {
      await apiFetch(`/api/vendors/${vendorId}/toggle-preferred`, {
        method: "POST",
      });

      toastSuccess("Vendor preference updated");
      fetchVendors();
    } catch (error) {
      console.error("Toggle preferred error:", error);
      toastError("Failed to update vendor preference");
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (isLoading && vendors.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="animate-spin h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-primary font-semibold text-gray-900">
            Vendors
          </h1>
          <p className="text-sm font-secondary text-gray-600 mt-1">
            Manage your vendor relationships and contacts
          </p>
        </div>
        <Link
          href="/admin/vendors/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-secondary font-semibold rounded-lg hover:bg-primary/80 transition-colors"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Link>
      </div>

      <VendorSummaryPanel
        totalVendors={stats.totalVendors}
        activeVendors={stats.activeVendors}
        preferredVendors={stats.preferredVendors}
        averageRating={stats.averageRating}
      />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search vendors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <AppSelect
              label="Status"
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Statuses", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "On Hold", value: "on_hold" },
                { label: "Archived", value: "archived" },
              ]}
            />
          </div>

          <div>
            <AppSelect
              label="Category"
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Categories", value: "all" },
                ...categories.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                })),
              ]}
            />
          </div>

          <div>
            <AppSelect
              label="Preferred"
              value={preferredFilter}
              onValueChange={(value) => {
                setPreferredFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Vendors", value: "all" },
                { label: "Preferred Only", value: "true" },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "table"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <VendorGridView
          vendors={vendors}
          onOpenDetail={handleOpenDetail}
          onOpenDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
          onTogglePreferred={handleTogglePreferred}
        />
      ) : (
        <VendorTableView
          vendors={vendors}
          onOpenDetail={handleOpenDetail}
          onOpenDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
          onTogglePreferred={handleTogglePreferred}
        />
      )}

      {totalPages > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-secondary text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
              vendors
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) =>
                  page === -1 ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-2 text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-secondary font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-primary text-dark-black"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-secondary font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedVendor && (
        <VendorDetailModal
          vendorId={selectedVendor.id}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedVendor(null);
          }}
          onRefresh={fetchVendors}
        />
      )}

      {showDeleteModal && selectedVendor && (
        <DeleteVendorModal
          vendor={selectedVendor}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedVendor(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
