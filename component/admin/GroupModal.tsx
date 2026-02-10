"use client";

import { useEffect, useMemo, useState } from "react";
import { AppCheckbox } from "../ui/Checkbox";
import { UiStaff } from "@/type/staff";
import { UiGroup } from "@/app/admin/groups/page";

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
  staff,
  isStaffLoading,
  onClose,
  onSave,
}: {
  group: UiGroup | null;
  staff: UiStaff[];
  isStaffLoading: boolean;
  onClose: () => void;
  onSave: (group: any) => void;
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
  const [staffSearch, setStaffSearch] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>(
    group?.members?.map((m: any) => m.id) ?? [],
  );

  useEffect(() => {
    setFormData(initial);
    setSelectedStaffIds(group?.members?.map((m: any) => m.id) ?? []);
  }, [initial, group]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter a group name");
      return;
    }

    onSave({
      ...formData,
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      memberIds: selectedStaffIds,
    });
  };

  const filteredStaff = useMemo(() => {
    const q = staffSearch.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter((s) => {
      const full = `${s.firstName} ${s.lastName}`.toLowerCase();
      return full.includes(q) || (s.profession || "").toLowerCase().includes(q);
    });
  }, [staff, staffSearch]);

  const toggleStaff = (id: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full overflow-scroll max-h-176 flex flex-col">
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
              <div
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
              </div>

              <div
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
              </div>
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

          <div className="bg-gray-50 rounded-lg px-4">
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

          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Assign staff members
            </label>

            <div className="relative mb-3">
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
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                placeholder="Search staff..."
                className="w-full pl-10 pr-4 text-dark-black py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="border border-gray-200 rounded-lg max-h-72 overflow-y-auto">
              {isStaffLoading ? (
                <div className="p-4 text-sm text-gray-500 font-secondary">
                  Loading staff...
                </div>
              ) : filteredStaff.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 font-secondary">
                  No staff found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredStaff.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => toggleStaff(s.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <AppCheckbox
                        checked={selectedStaffIds.includes(s.id)}
                        onCheckedChange={() => toggleStaff(s.id)}
                      />

                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-secondary font-medium text-gray-600">
                          {(s.firstName?.[0] || "").toUpperCase()}
                          {(s.lastName?.[0] || "").toUpperCase()}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-secondary font-semibold text-gray-900 truncate">
                          {s.firstName} {s.lastName}
                        </p>
                        {s.profession ? (
                          <p className="text-xs text-gray-600 font-secondary truncate">
                            {s.profession}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 font-secondary mt-2">
              {selectedStaffIds.length} selected
            </p>
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
