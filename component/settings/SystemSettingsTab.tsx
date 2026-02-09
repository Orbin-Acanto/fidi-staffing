"use client";

import { TenantSettings, UserMe } from "@/type";
import { useEffect, useState } from "react";
import { AppSelect } from "@/component/ui/Select";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "react-toastify";

const SYSTEM_FIELDS: (keyof TenantSettings)[] = [
  "backup_frequency",
  "retention_period",
  "automatic_backup_enabled",
];

function pickSystem(data: TenantSettings): Partial<TenantSettings> {
  const out: Partial<TenantSettings> = {};
  for (const k of SYSTEM_FIELDS) out[k] = data[k] as any;
  return out;
}

type Props = { me: UserMe };

export default function SystemSettingsTab({ me }: Props) {
  const isOwner = me.tenant_role === "owner";

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<TenantSettings>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const denyEdit = () => {
    toast.error("View only. Only the owner can update system settings.", {
      toastId: "system-view-only",
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<TenantSettings>("/api/tenant/settings", {
        method: "GET",
      });
      setTenantSettings(data);
      setFormData(pickSystem(data));
      setHasChanges(false);
      console.log(data);
    } catch (e) {
      toast.error("Failed to load system settings", {
        toastId: "system-load-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    name: keyof TenantSettings,
    value: string | boolean | number,
  ) => {
    if (!isOwner) {
      denyEdit();
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value as any }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!isOwner) {
      denyEdit();
      return;
    }
    setIsSaving(true);
    try {
      const updated = await apiFetch<TenantSettings>("/api/tenant/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setTenantSettings(updated);
      setFormData(pickSystem(updated));
      setHasChanges(false);
      toast.success("System settings saved", {
        toastId: "system-save-success",
      });
    } catch (e) {
      toast.error("Failed to save system settings", {
        toastId: "system-save-error",
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
    if (!tenantSettings) return;
    setFormData(pickSystem(tenantSettings));
    setHasChanges(false);
  };

  const handleExport = async () => {
    if (!isOwner) return denyEdit();
    setIsExporting(true);
    try {
      alert("Export Request Submitted");
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackupNow = async () => {
    if (!isOwner) return denyEdit();
    setIsBackingUp(true);
    try {
      alert("Backup Request Submitted");
    } finally {
      setIsBackingUp(false);
    }
  };

  const formatLastBackup = (dateString?: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? "Never" : date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="py-10 text-sm text-gray-500">
        Loading system settings...
      </div>
    );
  }

  if (!tenantSettings) {
    return (
      <div className="py-10">
        <p className="text-sm text-gray-500">Failed to load system settings</p>
        <button
          onClick={load}
          className="mt-3 px-4 py-2 text-sm font-secondary font-medium text-primary border border-primary rounded-lg hover:bg-primary/10"
        >
          Retry
        </button>
      </div>
    );
  }

  const lastBackupAt = (tenantSettings as TenantSettings).last_backup_at as
    | string
    | null
    | undefined;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Backup Settings
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure automatic backups and data retention
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-secondary font-medium text-gray-900">
                Automatic Backups
              </p>
              <p className="text-sm text-gray-500">
                Automatically backup your data on a schedule
              </p>
            </div>
            <button
              onClick={() =>
                handleChange(
                  "automatic_backup_enabled",
                  !formData.automatic_backup_enabled,
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.automatic_backup_enabled ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.automatic_backup_enabled
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {formData.automatic_backup_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppSelect
                label="Backup Frequency"
                value={formData.backup_frequency || undefined}
                onValueChange={(value) =>
                  handleChange(
                    "backup_frequency",
                    value as "daily" | "weekly" | "monthly",
                  )
                }
                options={[
                  { label: "Daily", value: "daily" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Monthly", value: "monthly" },
                ]}
              />
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Retention Period (Days)
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={formData.retention_period ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "retention_period",
                      parseInt(e.target.value || "0"),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-secondary text-gray-500">
                Last Backup
              </p>
              <p className="font-secondary font-medium text-gray-900">
                {formatLastBackup(lastBackupAt)}
              </p>
            </div>
            <button
              onClick={handleBackupNow}
              disabled={isBackingUp}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-secondary font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              {isBackingUp ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Backing up...
                </>
              ) : (
                <>
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Backup Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Export Data
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Download your data for external use or migration
          </p>
        </div>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-secondary font-medium text-gray-900">
                Full Data Export
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Export all data including staff, events, locations, and settings
                as a ZIP file
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-secondary font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Exporting...
                </>
              ) : (
                <>
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export All Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-secondary font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset Changes
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-secondary font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
