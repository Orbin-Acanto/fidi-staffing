"use client";

import BulkAssignModal from "@/component/admin/BulkAssignModal";
import GroupFormModal from "@/component/admin/GroupModal";
import { AppCheckbox } from "@/component/ui/Checkbox";
import { Group } from "@/type";
import { useState } from "react";

export default function GroupManagementPage() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "Wedding Team A",
      description: "Primary wedding service team",
      color: "#d2b371",
      memberIds: ["STF001", "STF002", "STF003"],
      createdAt: "2024-01-15",
      archived: false,
    },
    {
      id: "2",
      name: "Bartender Squad",
      description: "Experienced bartending team",
      color: "#8B4513",
      memberIds: ["STF004", "STF005"],
      createdAt: "2024-01-20",
      archived: false,
    },
    {
      id: "3",
      name: "Corporate Events",
      description: "Professional corporate event staff",
      color: "#4A5568",
      memberIds: ["STF001", "STF006"],
      createdAt: "2024-02-01",
      archived: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesArchived = showArchived ? true : !group.archived;
    return matchesSearch && matchesArchived;
  });

  const handleSelectGroup = (id: string) => {
    if (selectedGroups.includes(id)) {
      setSelectedGroups(selectedGroups.filter((g) => g !== id));
    } else {
      setSelectedGroups([...selectedGroups, id]);
    }
  };

  const handleArchiveGroup = (group: Group) => {
    setGroups(
      groups.map((g) =>
        g.id === group.id ? { ...g, archived: !g.archived } : g
      )
    );
    alert(
      `Group "${group.name}" ${
        group.archived ? "restored" : "archived"
      } successfully!`
    );
  };

  const handleDeleteGroup = () => {
    if (selectedGroup) {
      setGroups(groups.filter((g) => g.id !== selectedGroup.id));
      setShowDeleteModal(false);
      setSelectedGroup(null);
      alert(`Group "${selectedGroup.name}" deleted successfully!`);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Top Row  */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-primary font-semibold text-gray-900">
              Group Management
            </h1>
            <p className="text-sm font-secondary text-gray-600 mt-1">
              Organize staff into teams for faster event assignments.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                   font-secondary font-semibold rounded-lg
                   hover:bg-primary/80 transition-all duration-200
                   transform hover:scale-105"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Total Groups
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {groups.filter((g) => !g.archived).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Total Members
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {groups
                .filter((g) => !g.archived)
                .reduce((acc, g) => acc + g.memberIds.length, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Archived
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {groups.filter((g) => g.archived).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Avg. Members
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {groups.filter((g) => !g.archived).length > 0
                ? Math.round(
                    groups
                      .filter((g) => !g.archived)
                      .reduce((acc, g) => acc + g.memberIds.length, 0) /
                      groups.filter((g) => !g.archived).length
                  )
                : 0}
            </p>
          </div>
        </div>

        {/* Filter Area  */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-4 lg:flex-row items-end lg:items-center md:justify-between">
            {/* LEFT: Search */}
            <div className="w-full md:flex-1">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                Search Groups
              </label>

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
                  placeholder="Search by group name..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300
                     font-secondary text-sm text-dark-black
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent
                     transition"
                />
              </div>
            </div>

            <div className="flex sm:flex-row flex-col items-end gap-4">
              <div className="hidden md:block h-[22px]" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-secondary text-gray-700 whitespace-nowrap">
                  Show archived
                </span>
                <button
                  type="button"
                  onClick={() => setShowArchived(!showArchived)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition
                                ${showArchived ? "bg-primary" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition
                                ${
                                  showArchived
                                    ? "translate-x-4"
                                    : "translate-x-1"
                                }`}
                  />
                </button>
              </div>

              <span className="text-sm font-secondary text-gray-600 whitespace-nowrap">
                {selectedGroups.length} selected
              </span>

              <button
                disabled={selectedGroups.length === 0}
                onClick={() => setShowBulkAssignModal(true)}
                className={`h-10 px-3 rounded-lg text-sm font-secondary font-medium transition w-full sm:w-auto

                ${
                  selectedGroups.length > 0
                    ? "bg-primary text-white hover:opacity-90"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Bulk Assign
              </button>

              <button
                disabled={selectedGroups.length === 0}
                className={`h-10 px-3 rounded-lg text-sm font-secondary font-medium transition w-full sm:w-auto

                ${
                  selectedGroups.length > 0
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
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
              <p className="text-gray-900 font-secondary font-medium mb-1">
                No groups found
              </p>
              <p className="text-gray-500 font-secondary text-sm">
                {searchTerm
                  ? "Try adjusting your search"
                  : "Create your first group to get started"}
              </p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group.id}
                className={`bg-white rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedGroups.includes(group.id)
                    ? "border-primary"
                    : "border-gray-200"
                } ${group.archived ? "opacity-60" : ""}`}
              >
                <div
                  className="h-3 rounded-t-lg"
                  style={{ backgroundColor: group.color }}
                />

                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AppCheckbox
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={() => handleSelectGroup(group.id)}
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-primary font-semibold text-gray-900">
                          {group.name}
                        </h3>
                        {group.archived && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary font-medium bg-gray-200 text-gray-600">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 font-secondary mt-1">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  {/* Member Count */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                    <span className="text-sm font-secondary text-gray-900">
                      <span className="font-semibold">
                        {group.memberIds.length}
                      </span>{" "}
                      member{group.memberIds.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedGroup(group);
                        setShowEditModal(true);
                      }}
                      className="flex-1 px-3 py-2 text-sm font-secondary font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleArchiveGroup(group)}
                      className="flex-1 px-3 py-2 text-sm font-secondary font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer"
                    >
                      {group.archived ? "Restore" : "Archive"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGroup(group);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <GroupFormModal
          group={showEditModal ? selectedGroup : null}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedGroup(null);
          }}
          onSave={(group) => {
            if (showEditModal && selectedGroup) {
              setGroups(groups.map((g) => (g.id === group.id ? group : g)));
              alert("Group updated successfully!");
            } else {
              setGroups([...groups, { ...group, id: Date.now().toString() }]);
              alert("Group created successfully!");
            }
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedGroup(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedGroup && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-primary font-semibold text-gray-900 text-center mb-2">
                Delete Group
              </h3>
              <p className="text-sm text-gray-600 font-secondary text-center">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {selectedGroup.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedGroup(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-secondary font-medium transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Assign Modal */}
      {showBulkAssignModal && (
        <BulkAssignModal
          selectedGroups={selectedGroups}
          groups={groups}
          onClose={() => setShowBulkAssignModal(false)}
        />
      )}
    </>
  );
}
