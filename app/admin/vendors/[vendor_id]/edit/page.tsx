"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { VendorFormData, VendorDetail, VendorCategory } from "@/type/vendors";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { AppSelect } from "@/component/ui/Select";
import { AppDatePicker } from "@/component/ui/AppDatePicker";
import { AppCheckbox } from "@/component/ui/Checkbox";

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.vendor_id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<VendorCategory[]>([]);

  const [formData, setFormData] = useState<VendorFormData>({
    companyName: "",
    displayName: "",
    vendorType: "all",
    status: "active",
    website: "",
    primaryContactName: "",
    primaryContactTitle: "",
    workPhone: "",
    cellPhone: "",
    email: "",
    businessAddressStreet: "",
    businessAddressCity: "",
    businessAddressState: "",
    businessAddressZip: "",
    businessAddressCountry: "United States",
    servicesProvided: "",
    feesRates: "",
    isPreferred: false,
    taxId: "",
    insuranceExpiryDate: "",
    contractExpiryDate: "",
    internalFeedbackNotes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  const fetchCategories = async () => {
    try {
      const response = await apiFetch("/api/vendors/categories/list");
      setCategories(response.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchVendor = async () => {
    setIsLoading(true);
    try {
      const vendor: VendorDetail = await apiFetch(`/api/vendors/${vendorId}`);

      setFormData({
        companyName: vendor.company_name,
        displayName: vendor.display_name || "",
        vendorType: vendor.vendor_type || "all",
        status: vendor.status,
        website: vendor.website || "",
        primaryContactName: vendor.primary_contact_name || "",
        primaryContactTitle: vendor.primary_contact_title || "",
        workPhone: vendor.work_phone || "",
        cellPhone: vendor.cell_phone || "",
        email: vendor.email || "",
        businessAddressStreet: vendor.business_address_street || "",
        businessAddressCity: vendor.business_address_city || "",
        businessAddressState: vendor.business_address_state || "",
        businessAddressZip: vendor.business_address_zip || "",
        businessAddressCountry:
          vendor.business_address_country || "United States",
        servicesProvided: vendor.services_provided || "",
        feesRates: vendor.fees_rates || "",
        isPreferred: vendor.is_preferred,
        taxId: vendor.tax_id || "",
        insuranceExpiryDate: vendor.insurance_expiry_date || "",
        contractExpiryDate: vendor.contract_expiry_date || "",
        internalFeedbackNotes: vendor.internal_feedback_notes || "",
      });
    } catch (error) {
      console.error("Failed to fetch vendor:", error);
      toastError("Failed to load vendor data");
      router.push("/admin/vendors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toastError("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        company_name: formData.companyName.trim(),
        display_name: formData.displayName.trim() || null,
        vendor_type: formData.vendorType !== "all" ? formData.vendorType : null,
        status: formData.status,
        website: formData.website.trim() || null,
        primary_contact_name: formData.primaryContactName.trim() || null,
        primary_contact_title: formData.primaryContactTitle.trim() || null,
        work_phone: formData.workPhone.trim() || null,
        cell_phone: formData.cellPhone.trim() || null,
        email: formData.email.trim() || null,
        business_address_street: formData.businessAddressStreet.trim() || null,
        business_address_city: formData.businessAddressCity.trim() || null,
        business_address_state: formData.businessAddressState.trim() || null,
        business_address_zip: formData.businessAddressZip.trim() || null,
        business_address_country: formData.businessAddressCountry,
        services_provided: formData.servicesProvided.trim() || null,
        fees_rates: formData.feesRates.trim() || null,
        is_preferred: formData.isPreferred,
        tax_id: formData.taxId.trim() || null,
        insurance_expiry_date: formData.insuranceExpiryDate || null,
        contract_expiry_date: formData.contractExpiryDate || null,
        internal_feedback_notes: formData.internalFeedbackNotes.trim() || null,
      };

      if (vendorId) {
        await apiFetch(`/api/vendors/${vendorId}/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        toastSuccess("Vendor updated successfully!");
      } else {
        await apiFetch("/api/vendors/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        toastSuccess("Vendor created successfully!");
      }

      router.push("/admin/vendors");
    } catch (error: unknown) {
      console.error("Error saving vendor:", error);

      if (error && typeof error === "object" && "errors" in error) {
        const apiErrors = error.errors as Record<string, string[] | string>;
        const formErrors: Record<string, string> = {};

        Object.keys(apiErrors).forEach((key) => {
          const fieldMap: Record<string, string> = {
            company_name: "companyName",
            display_name: "displayName",
            vendor_type: "vendorType",
            primary_contact_name: "primaryContactName",
            primary_contact_title: "primaryContactTitle",
            work_phone: "workPhone",
            cell_phone: "cellPhone",
            business_address_street: "businessAddressStreet",
            business_address_city: "businessAddressCity",
            business_address_state: "businessAddressState",
            business_address_zip: "businessAddressZip",
            business_address_country: "businessAddressCountry",
            services_provided: "servicesProvided",
            fees_rates: "feesRates",
            is_preferred: "isPreferred",
            tax_id: "taxId",
            insurance_expiry_date: "insuranceExpiryDate",
            contract_expiry_date: "contractExpiryDate",
            internal_feedback_notes: "internalFeedbackNotes",
          };

          const frontendKey = fieldMap[key] || key;
          const errorValue = apiErrors[key];
          formErrors[frontendKey] = Array.isArray(errorValue)
            ? errorValue[0]
            : errorValue;
        });

        setErrors(formErrors);
      }

      if (error && typeof error === "object" && "message" in error) {
        toastError(error.message as string);
      } else {
        toastError(
          `Failed to ${vendorId ? "update" : "create"} vendor. Please try again.`,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-primary font-semibold text-gray-900">
            {vendorId ? "Edit Vendor" : "Add Vendor"}
          </h1>
          <p className="text-sm font-secondary text-gray-600 mt-1">
            {vendorId
              ? "Update vendor information and details"
              : "Add a new vendor to your system"}
          </p>
        </div>
        <Link
          href="/admin/vendors"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Vendors
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.companyName
                             ? "border-red-500"
                             : "border-gray-300"
                         }`}
                placeholder="ABC Catering Services"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.companyName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Display Name (Optional)
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="ABC Catering"
              />
            </div>

            <div>
              <AppSelect
                label="Category"
                value={formData.vendorType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    vendorType: value,
                  }))
                }
                placeholder="Select category"
                options={[
                  { label: "No Category", value: "all" },
                  ...categories.map((cat) => ({
                    label: cat.name,
                    value: cat.id,
                  })),
                ]}
              />
            </div>

            <div>
              <AppSelect
                label="Status"
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as
                      | "active"
                      | "inactive"
                      | "on_hold"
                      | "archived",
                  }))
                }
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                  { label: "On Hold", value: "on_hold" },
                  { label: "Archived", value: "archived" },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="https://www.example.com"
              />
            </div>

            <div className="flex items-center gap-2 mt-8">
              <AppCheckbox
                checked={formData.isPreferred}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPreferred: Boolean(checked),
                  }))
                }
              />
              <label className="text-sm font-secondary text-gray-700">
                Mark as Preferred Vendor
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Primary Contact Name
              </label>
              <input
                type="text"
                name="primaryContactName"
                value={formData.primaryContactName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Contact Title
              </label>
              <input
                type="text"
                name="primaryContactTitle"
                value={formData.primaryContactTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Sales Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Work Phone
              </label>
              <input
                type="tel"
                name="workPhone"
                value={formData.workPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Cell Phone
              </label>
              <input
                type="tel"
                name="cellPhone"
                value={formData.cellPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.email ? "border-red-500" : "border-gray-300"
                         }`}
                placeholder="contact@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Business Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="businessAddressStreet"
                value={formData.businessAddressStreet}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="businessAddressCity"
                value={formData.businessAddressCity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="New York"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                name="businessAddressState"
                value={formData.businessAddressState}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="NY"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                name="businessAddressZip"
                value={formData.businessAddressZip}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="10001"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="businessAddressCountry"
                value={formData.businessAddressCountry}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Services & Rates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Services Provided
              </label>
              <textarea
                name="servicesProvided"
                value={formData.servicesProvided}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Describe the services this vendor provides..."
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Fees & Rates
              </label>
              <textarea
                name="feesRates"
                value={formData.feesRates}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Pricing structure, rates, packages, etc..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Legal & Compliance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Tax ID / EIN
              </label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="XX-XXXXXXX"
              />
            </div>

            <div>
              <AppDatePicker
                label="Insurance Expiry Date"
                value={formData.insuranceExpiryDate}
                onChange={(ymd) =>
                  setFormData((prev) => ({
                    ...prev,
                    insuranceExpiryDate: ymd,
                  }))
                }
              />
            </div>

            <div>
              <AppDatePicker
                label="Contract Expiry Date"
                value={formData.contractExpiryDate}
                onChange={(ymd) =>
                  setFormData((prev) => ({
                    ...prev,
                    contractExpiryDate: ymd,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Internal Notes
          </h2>
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Internal Feedback Notes
            </label>
            <textarea
              name="internalFeedbackNotes"
              value={formData.internalFeedbackNotes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                       placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       transition-all duration-200"
              placeholder="Internal notes, feedback, performance reviews (not visible to vendor)..."
            />
            <p className="mt-1 text-xs text-gray-500 font-secondary">
              These notes are for internal use only and will not be shared with
              the vendor.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/vendors"
              className="w-full sm:w-auto inline-flex justify-center px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex justify-center px-6 py-2.5 bg-primary text-white font-secondary font-semibold rounded-lg
                   hover:bg-[#e0c580] transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transform sm:hover:scale-105 active:scale-95"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  {vendorId ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <>{vendorId ? "Update Vendor" : "Create Vendor"}</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
