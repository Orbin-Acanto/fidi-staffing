"use client";
import { GeneralSettings } from "@/type";
import { timeZones, dateFormats, currencies } from "@/data";
import { useState, useRef } from "react";
import { AppSelect } from "@/component/ui/Select";

interface GeneralSettingsTabProps {
  settings: GeneralSettings;
  onSave: (settings: GeneralSettings) => void;
}

export default function GeneralSettingsTab({
  settings,
  onSave,
}: GeneralSettingsTabProps) {
  const [formData, setFormData] = useState<GeneralSettings>(settings);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    settings.logo || null
  );
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    name: keyof GeneralSettings,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setFormData((prev) => ({ ...prev, logo: reader.result as string }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logo: "" }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    setFormData(settings);
    setLogoPreview(settings.logo || null);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Company Information
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Basic information about your business
          </p>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-start gap-6 justify-between">
            <div className="flex-1">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                Company/Business Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                Company Logo
              </label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Company Logo"
                      className="w-12 h-12 object-contain border border-gray-200 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <svg
                      className="w-6 h-6 text-gray-400"
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
                  </div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-sm font-secondary font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Upload Logo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>
            </div>
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
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppSelect
            label="Time Zone"
            value={formData.timeZone}
            onValueChange={(value) => handleChange("timeZone", value)}
            options={timeZones}
          />
          <AppSelect
            label="Date Format"
            value={formData.dateFormat}
            onValueChange={(value) => handleChange("dateFormat", value)}
            options={dateFormats}
          />
          <AppSelect
            label="Currency"
            value={formData.currency}
            onValueChange={(value) => handleChange("currency", value)}
            options={currencies}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Overtime Rules
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure overtime pay calculations
          </p>
        </div>
        <div className="p-4">
          <div className="max-w-xs">
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              Overtime Pay Multiplier
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="1"
                max="3"
                value={formData.overtimeMultiplier}
                onChange={(e) =>
                  handleChange("overtimeMultiplier", parseFloat(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                x
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Example: 1.5x means overtime hours are paid at 150% of regular
              rate
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Tax & Compliance
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Tax rates and compliance settings
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                max="100"
                value={formData.taxRate}
                onChange={(e) =>
                  handleChange("taxRate", parseFloat(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                Tax ID / EIN
              </label>
              <input
                type="text"
                value={formData.taxId || ""}
                onChange={(e) => handleChange("taxId", e.target.value)}
                placeholder="XX-XXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              Compliance Notes
            </label>
            <textarea
              value={formData.complianceNotes || ""}
              onChange={(e) => handleChange("complianceNotes", e.target.value)}
              rows={3}
              placeholder="Add any compliance requirements or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
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
