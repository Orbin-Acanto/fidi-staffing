"use client";
import { Company } from "@/type";
import { useState } from "react";
import { AppSelect } from "../ui/Select";
import { AppCheckbox } from "../ui/Checkbox";

export default function CompanyModal({
  mode,
  company,
  onClose,
  onSave,
  isSaving,
}: {
  mode: "create" | "edit";
  company?: Company;
  onClose: () => void;
  onSave: (data: Partial<Company>) => void;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState<Partial<Company>>({
    name: company?.name || "",
    slug: company?.slug || "",
    email: company?.email || "",
    phone: company?.phone || "",
    address_street: company?.address_street || "",
    address_city: company?.address_city || "",
    address_state: company?.address_state || "",
    address_zip: company?.address_zip || "",
    address_country: company?.address_country || "",
    company_type: company?.company_type || "subsidiary",
    description: company?.description || "",
    primary_color: company?.primary_color || "#3b82f6",
    is_active: company?.is_active ?? true,
  });

  const handleChange = (
    name: keyof Company,
    value: string | boolean | null,
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const slugify = (value: string) =>
    value.toLowerCase().trim().replace(/\s+/g, "-");

  const isPrimaryCompany = company?.is_tenant;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-primary font-semibold text-gray-900">
            {mode === "create" ? "Create New Company" : "Edit Company"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
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

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="p-6 space-y-4">
            {isPrimaryCompany && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  This is the primary company. Name and slug are locked and
                  synced with tenant settings.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    handleChange("name", name);
                    if (
                      !isPrimaryCompany &&
                      (mode === "create" || !company?.slug)
                    ) {
                      handleChange("slug", slugify(name));
                    }
                  }}
                  disabled={isPrimaryCompany}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="auto-generated"
                />
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="contact@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <AppSelect
                  label="Company Type"
                  placeholder="Select type"
                  value={formData.company_type || "subsidiary"}
                  onValueChange={(value) => handleChange("company_type", value)}
                  options={[
                    { label: "Subsidiary", value: "subsidiary" },
                    { label: "Division", value: "division" },
                    { label: "Branch", value: "branch" },
                    { label: "Partner", value: "partner" },
                    { label: "Other", value: "other" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={formData.primary_color || "#3b82f6"}
                  onChange={(e) =>
                    handleChange("primary_color", e.target.value)
                  }
                  className="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Brief description of the company"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address_street || ""}
                  onChange={(e) =>
                    handleChange("address_street", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address_city || ""}
                  onChange={(e) => handleChange("address_city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                  State/Province <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address_state || ""}
                  onChange={(e) =>
                    handleChange("address_state", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="NY"
                />
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                  ZIP/Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address_zip || ""}
                  onChange={(e) => handleChange("address_zip", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="10001"
                />
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address_country || ""}
                  onChange={(e) =>
                    handleChange("address_country", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="United States"
                />
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <AppCheckbox
                  checked={!!formData.is_active}
                  onCheckedChange={(checked) =>
                    handleChange("is_active", checked)
                  }
                />
                <span className="text-sm font-secondary font-medium text-gray-700">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-secondary font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-secondary font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
              )}
              {isSaving
                ? "Saving..."
                : mode === "create"
                  ? "Create Company"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
