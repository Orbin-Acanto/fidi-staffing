"use client";

import { useEffect, useMemo, useState } from "react";
import { AppCheckbox } from "../ui/Checkbox";

export type UiGroup = {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  companyId?: string;
  companyName?: string;
};

const COLOR_OPTIONS = [
  "#6B7280",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export default function GroupFormModal({
  group,
  onClose,
  onSave,
}: {
  group: UiGroup | null;
  onClose: () => void;
  onSave: (group: UiGroup) => void;
}) {
  const initial: UiGroup = useMemo(
    () =>
      group || {
        id: "",
        name: "",
        description: "",
        color: "#6B7280",
        isActive: true,
        memberCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    [group],
  );

  const [formData, setFormData] = useState<UiGroup>(initial);

  useEffect(() => {
    setFormData(initial);
  }, [initial]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter a group name");
      return;
    }

    onSave({
      ...formData,
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-primary font-bold text-gray-900">
              {group ? "Edit Group" : "Create New Group"}
            </h2>
            <p className="text-sm text-gray-600 font-secondary mt-1">
              {group
                ? "Update group details"
                : "Create a group to organize your staff"}
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

        <div className="px-6 pt-3 space-y-6">
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Bartender Squad"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
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
              placeholder="Brief description of this group..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="block text-sm font-secondary font-medium text-gray-700">
              Status
            </label>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isActive: true }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <AppCheckbox
                  checked={formData.isActive === true}
                  onCheckedChange={() =>
                    setFormData((prev) => ({ ...prev, isActive: true }))
                  }
                />
                <span className="text-sm font-secondary text-gray-700">
                  Active
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isActive: false }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <AppCheckbox
                  checked={formData.isActive === false}
                  onCheckedChange={() =>
                    setFormData((prev) => ({ ...prev, isActive: false }))
                  }
                />
                <span className="text-sm font-secondary text-gray-700">
                  Inactive
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Group Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color: c }))}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    formData.color === c
                      ? "border-gray-900 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className="w-full h-8 rounded"
                    style={{ backgroundColor: c }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 font-secondary mb-2">Preview</p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-primary font-bold text-lg"
                style={{ backgroundColor: formData.color }}
              >
                {formData.name ? formData.name.charAt(0).toUpperCase() : "G"}
              </div>
              <div className="flex-1">
                <p className="font-secondary font-semibold text-gray-900">
                  {formData.name || "Group Name"}
                </p>
                <p className="text-sm text-gray-500">
                  {formData.isActive ? "Active" : "Inactive"}
                  {typeof formData.memberCount === "number"
                    ? ` • ${formData.memberCount} member${
                        formData.memberCount === 1 ? "" : "s"
                      }`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs font-secondary text-gray-500">
            Bulk member assignment will be connected later.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#e0c580] font-secondary font-medium transition-colors cursor-pointer"
          >
            {group ? "Update Group" : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
