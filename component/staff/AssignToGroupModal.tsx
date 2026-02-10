"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { StaffGroup } from "@/type/staff";

interface AssignToGroupModalProps {
  selectedStaffIds: string[];
  selectedStaffCount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignToGroupModal({
  selectedStaffIds,
  selectedStaffCount,
  onClose,
  onSuccess,
}: AssignToGroupModalProps) {
  const [groups, setGroups] = useState<StaffGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await apiFetch("/api/groups/list?is_active=true");
      setGroups(response.groups || []);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toastError("Failed to load groups");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleGroup = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  const handleAssign = async () => {
    if (selectedGroups.length === 0) return;

    setIsAssigning(true);

    try {
      const updatePromises = selectedStaffIds.map(async (staffId) => {
        return apiFetch(`/api/staff/${staffId}/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groups: selectedGroups,
          }),
        });
      });

      await Promise.all(updatePromises);

      toastSuccess(
        `Successfully assigned ${selectedStaffCount} staff member${selectedStaffCount !== 1 ? "s" : ""} to ${selectedGroups.length} group${selectedGroups.length !== 1 ? "s" : ""}`,
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to assign to groups:", error);
      toastError("Failed to assign staff to groups");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-primary font-semibold text-gray-900">
                Assign to Groups
              </h3>
              <p className="text-sm text-gray-600 font-secondary mt-1">
                Select groups to assign {selectedStaffCount} staff member
                {selectedStaffCount !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
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
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-primary"
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
          ) : groups.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-gray-500 font-secondary">
                No groups available. Create groups first.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => handleToggleGroup(group.id)}
                  className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                    selectedGroups.includes(group.id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedGroups.includes(group.id)
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {selectedGroups.includes(group.id) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-secondary font-semibold text-gray-900">
                        {group.name}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 font-secondary">
              {selectedGroups.length} group
              {selectedGroups.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isAssigning}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={selectedGroups.length === 0 || isAssigning}
                className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors flex items-center gap-2 ${
                  selectedGroups.length > 0 && !isAssigning
                    ? "bg-primary text-white hover:bg-primary/80"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isAssigning ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
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
                    Assigning...
                  </>
                ) : (
                  `Assign to ${selectedGroups.length} Group${selectedGroups.length !== 1 ? "s" : ""}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
