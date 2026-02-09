"use client";
import { TenantSettings, timeFormats, UserMe } from "@/type";
import { timeZones, dateFormats, currencies } from "@/data";
import { useState, useRef, useEffect } from "react";
import { AppSelect } from "@/component/ui/Select";

import { toast } from "react-toastify";
import { apiFetch } from "@/lib/apiFetch";
import { toMediaProxyUrl } from "@/lib/mediaUrl";

const EDITABLE_FIELDS: (keyof TenantSettings)[] = [
  "email",
  "phone",
  "address",
  "currency",
  "timezone",
  "date_format",
  "time_format",
  "billing_email",
  "billing_address",
  // "notification_settings",
  "require_2fa",
  // "backup_frequency",
  // "retention_period",
  // "automatic_backup_enabled",
];

function pickEditable(data: TenantSettings): Partial<TenantSettings> {
  const out: Partial<TenantSettings> = {};
  for (const k of EDITABLE_FIELDS) out[k] = data[k] as any;
  return out;
}

const makeFreshLogoUrl = (urlOrKey?: string | null) => {
  const proxied = toMediaProxyUrl(urlOrKey) ?? null;
  if (!proxied) return null;

  const sep = proxied.includes("?") ? "&" : "?";
  return `${proxied}${sep}v=${Date.now()}`;
};

type Props = {
  me: UserMe;
};

export default function GeneralSettingsTab({ me }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<TenantSettings>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwner = me.tenant_role === "owner";

  const denyEdit = () => {
    toast.error("View only. Only the owner can update organization settings.", {
      toastId: "settings-view-only",
    });
  };

  useEffect(() => {
    loadTenantSettings();
    console.log(me.tenant_role);
  }, []);

  const loadTenantSettings = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<TenantSettings>("/api/tenant/settings", {
        method: "GET",
      });
      setTenantSettings(data);
      setFormData(pickEditable(data));
      setLogoPreview(makeFreshLogoUrl(data.logo_url ?? data.logo ?? null));
    } catch (error) {
      toast.error("Failed to load organization settings", {
        toastId: "load-tenant-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    name: keyof TenantSettings,
    value: string | boolean,
  ) => {
    if (!isOwner) {
      denyEdit();
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const clearFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwner) {
      denyEdit();
      if (e.target) e.target.value = "";
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file size cannot exceed 2MB", {
        toastId: "logo-size-error",
      });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WebP images are allowed", {
        toastId: "logo-type-error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setLogoPreview(base64String);

      setUploadingLogo(true);
      try {
        const updatedTenant = await apiFetch<TenantSettings>(
          "/api/tenant/settings",
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              logo_base64: base64String,
            }),
          },
        );
        setLogoPreview(
          makeFreshLogoUrl(
            updatedTenant.logo_url ?? updatedTenant.logo ?? null,
          ),
        );
        toast.success("Logo uploaded successfully", {
          toastId: "logo-upload-success",
        });
        clearFileInput();
      } catch (error) {
        setLogoPreview(
          makeFreshLogoUrl(
            tenantSettings?.logo_url ?? tenantSettings?.logo ?? null,
          ),
        );
        toast.error("Failed to upload logo. Please try again.", {
          toastId: "logo-upload-error",
        });
      } finally {
        setUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = async () => {
    if (!isOwner) {
      denyEdit();
      return;
    }

    if (!confirm("Are you sure you want to remove the organization logo?"))
      return;

    setUploadingLogo(true);
    try {
      const updatedTenant = await apiFetch<TenantSettings>(
        "/api/tenant/settings/logo",
        {
          method: "DELETE",
        },
      );
      setLogoPreview(null);
      toast.success("Logo removed successfully", {
        toastId: "logo-remove-success",
      });
    } catch (error) {
      console.error("Failed to remove logo:", error);
      toast.error("Failed to remove logo. Please try again.", {
        toastId: "logo-remove-error",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!isOwner) {
      denyEdit();
      return;
    }

    setIsSaving(true);
    try {
      const updatedTenant = await apiFetch<TenantSettings>(
        "/api/tenant/settings",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      setTenantSettings(updatedTenant);
      setHasChanges(false);
      toast.success("Organization settings saved successfully", {
        toastId: "settings-save-success",
      });
    } catch (error) {
      console.error("Failed to save tenant settings:", error);
      toast.error("Failed to save settings. Please try again.", {
        toastId: "settings-save-error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!isOwner) {
      denyEdit();
      return;
    }

    if (tenantSettings) {
      setFormData(tenantSettings);
      setLogoPreview(
        makeFreshLogoUrl(
          tenantSettings.logo_url ?? tenantSettings.logo ?? null,
        ),
      );
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">
            Loading organization settings...
          </p>
        </div>
      </div>
    );
  }

  if (!tenantSettings) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">
          Failed to load organization settings
        </p>
        <button
          onClick={loadTenantSettings}
          disabled={isLoading}
          className="mt-4 px-4 py-2 text-sm font-secondary font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-primary font-semibold text-gray-900">
            Organization Information
          </h3>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 bg-white">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-secondary font-medium text-gray-500">
                      Organization Name
                    </p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-secondary text-gray-900">
                      {tenantSettings.name}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-secondary font-medium text-gray-500">
                      Organization Owner
                    </p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-secondary text-gray-900">
                      {tenantSettings.owner_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {tenantSettings.owner_email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-xs font-secondary font-medium text-gray-500">
                    Subscription
                  </p>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                      tenantSettings.subscription_status === "active"
                        ? "bg-green-100 text-green-700"
                        : tenantSettings.subscription_status === "trial"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tenantSettings.subscription_status}
                  </span>
                </div>

                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-secondary text-gray-600">Plan</p>
                    <p className="text-sm font-secondary font-medium text-gray-900 capitalize">
                      {tenantSettings.subscription_plan}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-secondary text-gray-600">
                      {tenantSettings.subscription_plan === "trial"
                        ? "Trial ends"
                        : "Subscription expires"}
                    </p>
                    <p className="text-sm font-secondary text-gray-900">
                      {tenantSettings.subscription_plan === "trial"
                        ? tenantSettings.trial_ends_at
                          ? new Date(
                              tenantSettings.trial_ends_at,
                            ).toLocaleString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "—"
                        : tenantSettings.subscription_expires
                          ? new Date(
                              tenantSettings.subscription_expires,
                            ).toLocaleString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "—"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-secondary text-gray-600">
                      Member since
                    </p>
                    <p className="text-sm font-secondary text-gray-900">
                      {tenantSettings.created_at
                        ? new Date(tenantSettings.created_at).toLocaleString(
                            undefined,
                            { year: "numeric", month: "long", day: "numeric" },
                          )
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs font-secondary font-medium text-gray-500 mb-3">
                  Organization Logo
                </p>

                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Organization Logo"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-gray-400"
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
                      )}
                    </div>

                    {uploadingLogo && (
                      <div className="absolute inset-0 bg-white/75 flex items-center justify-center rounded-xl">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent" />
                      </div>
                    )}

                    {!!logoPreview && !uploadingLogo && (
                      <button
                        onClick={isOwner ? handleRemoveLogo : denyEdit}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
                        aria-label="Remove logo"
                      >
                        <svg
                          className="w-3.5 h-3.5"
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

                  <div className="min-w-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={uploadingLogo || !isOwner}
                    />

                    <button
                      onClick={() =>
                        isOwner ? fileInputRef.current?.click() : denyEdit()
                      }
                      disabled={uploadingLogo || !isOwner}
                      className="inline-flex items-center justify-center px-3 py-2 text-sm font-secondary font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingLogo
                        ? "Uploading..."
                        : logoPreview
                          ? "Change logo"
                          : "Upload logo"}
                    </button>

                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, GIF, WebP up to 2MB
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Only the logo can be updated here.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Contact Information
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Primary contact details for your organization
          </p>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email || ""}
              disabled={!isOwner}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="contact@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone || ""}
              disabled={!isOwner}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              Physical Address
            </label>
            <textarea
              value={formData.address || ""}
              disabled={!isOwner}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={2}
              placeholder="123 Main Street, City, State ZIP"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Regional Settings
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure time, date, and currency formats
          </p>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AppSelect
            label="Time Zone"
            value={formData.timezone || ""}
            disabled={!isOwner}
            onValueChange={(value) => handleChange("timezone", value)}
            options={timeZones}
          />
          <AppSelect
            label="Date Format"
            value={formData.date_format || ""}
            disabled={!isOwner}
            onValueChange={(value) => handleChange("date_format", value)}
            options={dateFormats}
          />
          <AppSelect
            label="Time Format"
            value={formData.time_format || ""}
            disabled={!isOwner}
            onValueChange={(value) => handleChange("time_format", value)}
            options={timeFormats}
          />
          <AppSelect
            label="Currency"
            value={formData.currency || ""}
            disabled={!isOwner}
            onValueChange={(value) => handleChange("currency", value)}
            options={currencies}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Billing Information
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Billing contact and address for invoices
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              Billing Email
            </label>
            <input
              type="email"
              value={formData.billing_email || ""}
              disabled={!isOwner}
              onChange={(e) => handleChange("billing_email", e.target.value)}
              placeholder="billing@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              Billing Address
            </label>
            <textarea
              value={formData.billing_address || ""}
              disabled={!isOwner}
              onChange={(e) => handleChange("billing_address", e.target.value)}
              rows={3}
              placeholder="Billing address (if different from physical address)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Security Settings
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Organization-wide security preferences
          </p>
        </div>
        <div className="p-4">
          <label
            className={`flex items-center gap-3 ${isOwner ? "cursor-pointer" : "cursor-not-allowed"}`}
          >
            <input
              type="checkbox"
              checked={formData.require_2fa || false}
              disabled={!isOwner}
              onChange={(e) => handleChange("require_2fa", e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <div>
              <p className="text-sm font-secondary font-medium text-gray-900">
                Require Two-Factor Authentication (2FA)
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                All users in this organization must enable 2FA
              </p>
            </div>
          </label>
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <button
            onClick={isOwner ? handleReset : denyEdit}
            disabled={isSaving || !isOwner}
            className="px-4 py-2 text-sm font-secondary font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Changes
          </button>
          <button
            onClick={isOwner ? handleSave : denyEdit}
            disabled={isSaving || !isOwner}
            className="px-4 py-2 text-sm font-secondary font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
