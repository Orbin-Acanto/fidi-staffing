"use client";

import { roleColors } from "@/data";
import { Role, RoleFormData } from "@/type";
import { useState, useEffect } from "react";
import { AppCheckbox } from "../ui/Checkbox";

interface RoleModalProps {
  role?: Role | null;
  onSave: (data: RoleFormData) => void;
  onClose: () => void;
}

export default function RoleModal({ role, onSave, onClose }: RoleModalProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    payType: "hourly",
    defaultRate: 20,
    overtimeMultiplier: 1.5,
    color: roleColors[0],
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || "",
        payType: role.payType,
        defaultRate: role.defaultRate,
        overtimeMultiplier: role.overtimeMultiplier,
        color: role.color,
        status: role.status,
      });
    }
  }, [role]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    }
    if (formData.defaultRate <= 0) {
      newErrors.defaultRate = "Rate must be greater than 0";
    }
    if (formData.overtimeMultiplier < 1) {
      newErrors.overtimeMultiplier = "Multiplier must be at least 1";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const isEdit = !!role;

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-primary font-bold text-gray-900">
              {isEdit ? "Edit Role" : "Add New Role"}
            </h2>
            <p className="text-sm text-gray-500 font-secondary mt-1">
              {isEdit
                ? "Update role details and pay settings"
                : "Create a new role for staff assignment"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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

        <div className="px-6 pt-3 space-y-5">
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Server, Bartender, Event Captain"
              className={`w-full px-3 py-2.5 border rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of this role's responsibilities..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
              Pay Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, payType: "hourly" }))
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.payType === "hourly"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.payType === "hourly"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-500"
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p
                      className={`font-secondary font-semibold ${
                        formData.payType === "hourly"
                          ? "text-primary"
                          : "text-gray-700"
                      }`}
                    >
                      Hourly
                    </p>
                    <p className="text-xs text-gray-500">Pay per hour worked</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, payType: "fixed" }))
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.payType === "fixed"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.payType === "fixed"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-500"
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p
                      className={`font-secondary font-semibold ${
                        formData.payType === "fixed"
                          ? "text-primary"
                          : "text-gray-700"
                      }`}
                    >
                      Fixed
                    </p>
                    <p className="text-xs text-gray-500">Flat rate per event</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                Default Rate ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={formData.defaultRate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      defaultRate: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min="0"
                  step="0.5"
                  className={`w-full pl-7 pr-12 py-2.5 border rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black ${
                    errors.defaultRate ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  {formData.payType === "hourly" ? "/hr" : "/event"}
                </span>
              </div>
              {errors.defaultRate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.defaultRate}
                </p>
              )}
            </div>

            {formData.payType == "hourly" ? (
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  OT Multiplier <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.overtimeMultiplier}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        overtimeMultiplier: parseFloat(e.target.value) || 1,
                      }))
                    }
                    min="1"
                    max="3"
                    step="0.1"
                    className={`w-full px-3 py-2.5 border rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black ${
                      errors.overtimeMultiplier
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    x
                  </span>
                </div>
                {errors.overtimeMultiplier && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.overtimeMultiplier}
                  </p>
                )}
              </div>
            ) : (
              ""
            )}
          </div>

          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
              Role Color
            </label>
            <div className="flex flex-wrap gap-2">
              {roleColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full transition-all ${
                    formData.color === color
                      ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="shrink-0">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                Status
              </label>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "active" }))
                  }
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <AppCheckbox
                    checked={formData.status === "active"}
                    onCheckedChange={() =>
                      setFormData((prev) => ({ ...prev, status: "active" }))
                    }
                  />
                  <span className="text-sm font-secondary text-gray-700">
                    Active
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "inactive" }))
                  }
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <AppCheckbox
                    checked={formData.status === "inactive"}
                    onCheckedChange={() =>
                      setFormData((prev) => ({ ...prev, status: "inactive" }))
                    }
                  />
                  <span className="text-sm font-secondary text-gray-700">
                    Inactive
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-secondary mb-1">
                Preview
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-primary font-bold text-lg"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "R"}
                </div>
                <div>
                  <p className="font-secondary font-semibold text-gray-900">
                    {formData.name || "Role Name"}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${formData.defaultRate}
                    {formData.payType === "hourly" ? "/hr" : "/event"}
                    {formData.payType === "hourly"
                      ? ` • ${formData.overtimeMultiplier}x OT`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-secondary font-medium transition-colors"
          >
            {isEdit ? "Save Changes" : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
