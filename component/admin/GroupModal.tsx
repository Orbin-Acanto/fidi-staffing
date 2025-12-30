import { colorOptions, staffList } from "@/data";
import { Group } from "@/type";
import { useState } from "react";
import { AppCheckbox } from "../ui/Checkbox";

export default function GroupFormModal({
  group,
  onClose,
  onSave,
}: {
  group: Group | null;
  onClose: () => void;
  onSave: (group: Group) => void;
}) {
  const [formData, setFormData] = useState<Group>(
    group || {
      id: "",
      name: "",
      description: "",
      color: "#d2b371",
      memberIds: [],
      createdAt: new Date().toISOString(),
      archived: false,
    }
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>(
    group?.memberIds || []
  );

  const availableStaff = staffList.filter((staff) =>
    staff.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStaff = (staffId: string) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter((id) => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter a group name");
      return;
    }
    onSave({ ...formData, memberIds: selectedStaff });
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-primary font-bold text-gray-900">
            {group ? "Edit Group" : "Create New Group"}
          </h2>
          <p className="text-sm text-gray-600 font-secondary mt-1">
            {group
              ? "Update group details and members"
              : "Set up a new team for easier staff management"}
          </p>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Wedding Team A, Bartender Squad"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of this group..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Group Color */}
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Group Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() =>
                    setFormData({ ...formData, color: color.value })
                  }
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    formData.color === color.value
                      ? "border-gray-900 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className="w-full h-8 rounded"
                    style={{ backgroundColor: color.value }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Assign Staff Members */}
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Assign Staff Members
            </label>
            <div className="mb-3">
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search staff..."
                  className="w-full pl-10 pr-4 text-dark-black py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg max-h-84 overflow-y-auto">
              {availableStaff.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-500 font-secondary">
                    No staff found
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {availableStaff.map((staff) => (
                    <label
                      key={staff.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <AppCheckbox
                        checked={selectedStaff.includes(staff.id)}
                        onCheckedChange={() => handleToggleStaff(staff.id)}
                      />

                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-secondary font-medium text-gray-600">
                          {staff.firstName[0]}
                          {staff.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-secondary font-semibold text-gray-900">
                          {staff.firstName} {staff.lastName}
                        </p>
                        <p className="text-xs text-gray-600 font-secondary">
                          {staff.profession}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${
                          staff.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {staff.status}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 font-secondary mt-2">
              {selectedStaff.length} staff member
              {selectedStaff.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
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
