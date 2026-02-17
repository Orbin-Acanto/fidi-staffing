"use client";
import BulkAssignModal from "@/component/admin/BulkAssignModal";
import GroupFormModal from "@/component/admin/GroupModal";
import { useCompany } from "@/component/context/CompanyContext";
import { apiFetch } from "@/lib/apiFetch";
import { toastSuccess, toastError } from "@/lib/toast";
import { BackendGroup, ListGroupsResponse, UiGroup } from "@/type/group";
import { StaffListResponse, UiStaff } from "@/type/staff";
import {
  mapBackendGroup,
  mapGroupFormToPayload,
  mapStaffToUi,
  PencilIcon,
  ToggleIcon,
} from "@/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function GroupManagementPage() {
  const { companyVersion } = useCompany();
  const [groups, setGroups] = useState<UiGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [archiveFilter, setArchiveFilter] = useState<
    "all" | "active" | "archived"
  >("active");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UiGroup | null>(null);

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const [showArchiveConfirm, setShowArchiveConfirm] = useState<string | null>(
    null,
  );
  const [showReactivateConfirm, setShowReactivateConfirm] = useState<
    string | null
  >(null);
  const [showBulkAssignModal, setShowBulkAssignModal] =
    useState<boolean>(false);

  const [staff, setStaff] = useState<UiStaff[]>([]);
  const [staffCount, setStaffCount] = useState(0);
  const [staffPage, setStaffPage] = useState(1);
  const [staffPageSize] = useState(20);
  const [isStaffLoading, setIsStaffLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchTerm.trim()) params.set("search", searchTerm.trim());

      if (archiveFilter === "active") params.set("is_active", "true");
      if (archiveFilter === "archived") params.set("is_active", "false");

      const qs = params.toString();

      const res = await apiFetch<ListGroupsResponse>(
        `/api/groups/list${qs ? `?${qs}` : ""}`,
      );

      const mapped = (res.groups || []).map(mapBackendGroup);
      setGroups(mapped);

      setSelectedGroups((prev) =>
        prev.filter((id) => mapped.some((g) => g.id === id)),
      );
    } catch (err: any) {
      toastError(err, "Failed to load groups");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, archiveFilter]);

  const fetchStaff = useCallback(async () => {
    setIsStaffLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("status", "active");
      qs.set("page", String(staffPage));
      qs.set("page_size", String(staffPageSize));

      const res = await apiFetch<StaffListResponse>(
        `/api/staff/list?${qs.toString()}`,
      );

      setStaff((res.results || []).map(mapStaffToUi));
      setStaffCount(res.count || 0);
    } catch (err: any) {
      toastError(err, "Failed to load staff list");
    } finally {
      setIsStaffLoading(false);
    }
  }, [staffPage, staffPageSize]);

  useEffect(() => {
    const t = setTimeout(() => fetchGroups(), 250);
    return () => clearTimeout(t);
  }, [fetchGroups, companyVersion]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff, companyVersion]);

  const stats = useMemo(() => {
    const active = groups.filter((g) => g.isActive);
    const archived = groups.filter((g) => !g.isActive);

    const activeCount = active.length;
    const archivedCount = archived.length;

    const totalMembers = active.reduce(
      (acc, g) => acc + (g.memberCount || 0),
      0,
    );

    const avgMembers =
      activeCount > 0 ? Math.round(totalMembers / activeCount) : 0;

    return { activeCount, archivedCount, totalMembers, avgMembers };
  }, [groups]);

  const filteredGroups = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return groups.filter((g) => {
      const matchesSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        (g.description || "").toLowerCase().includes(q);

      const matchesArchive =
        archiveFilter === "all" ||
        (archiveFilter === "active" && g.isActive) ||
        (archiveFilter === "archived" && !g.isActive);

      return matchesSearch && matchesArchive;
    });
  }, [groups, searchTerm, archiveFilter]);

  const openEdit = (g: UiGroup) => {
    setSelectedGroup(g);
    setShowEditModal(true);
  };

  const handleSaveGroup = async (dataFromModal: any) => {
    try {
      const payload = mapGroupFormToPayload(dataFromModal);

      if (showEditModal && selectedGroup) {
        const res = await apiFetch<{ message?: string; group?: BackendGroup }>(
          `/api/groups/${selectedGroup.id}/update`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        toastSuccess(res.message || "Group updated successfully");

        if (res.group) {
          const updated = mapBackendGroup(res.group);
          setGroups((prev) =>
            prev.map((g) => (g.id === updated.id ? updated : g)),
          );
        } else {
          await fetchGroups();
        }
      } else {
        const res = await apiFetch<{ message?: string; group?: BackendGroup }>(
          `/api/groups/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        toastSuccess(res.message || "Group created successfully");

        if (res.group) {
          const created = mapBackendGroup(res.group);
          setGroups((prev) => [created, ...prev]);
        } else {
          await fetchGroups();
        }
      }

      setShowCreateModal(false);
      setShowEditModal(false);
      setSelectedGroup(null);
    } catch (err: any) {
      toastError(err, "Failed to save group");
    }
  };

  const archiveGroup = async (groupId: string) => {
    try {
      const res = await apiFetch<{ message?: string }>(
        `/api/groups/${groupId}/delete`,
        { method: "DELETE" },
      );

      toastSuccess(res.message || "Group archived");

      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, isActive: false } : g)),
      );
    } catch (err: any) {
      toastError(err, "Failed to archive group");
    } finally {
      setShowArchiveConfirm(null);
    }
  };

  const reactivateGroup = async (groupId: string) => {
    try {
      const res = await apiFetch<{ message?: string; group?: BackendGroup }>(
        `/api/groups/${groupId}/reactivate`,
        { method: "POST" },
      );

      toastSuccess(res.message || "Group reactivated");

      if (res.group) {
        const updated = mapBackendGroup(res.group);
        setGroups((prev) =>
          prev.map((g) => (g.id === updated.id ? updated : g)),
        );
      } else {
        setGroups((prev) =>
          prev.map((g) => (g.id === groupId ? { ...g, isActive: true } : g)),
        );
      }
    } catch (err: any) {
      toastError(err, "Failed to reactivate group");
    } finally {
      setShowReactivateConfirm(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
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
              transform hover:scale-105 cursor-pointer"
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
            Add Group
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Active Groups
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {stats.activeCount}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Total Members
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {stats.totalMembers}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Archived
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {stats.archivedCount}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-secondary text-gray-600 mb-1">
              Avg. Members
            </p>
            <p className="text-2xl font-primary font-semibold text-gray-900">
              {stats.avgMembers}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-4 lg:flex-row items-end lg:items-center md:justify-between">
            <div className="w-full md:flex-1">
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

            <div className="flex items-center gap-3">
              <span className="text-sm font-secondary text-gray-500 whitespace-nowrap">
                Status:
              </span>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {[
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "archived", label: "Archived" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setArchiveFilter(opt.value as any)}
                    className={`px-3 py-1.5 text-xs font-secondary font-medium rounded-md transition-all ${
                      archiveFilter === opt.value
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500 font-secondary">
              Loading groups...
            </div>
          ) : filteredGroups.length === 0 ? (
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
                } ${group.isActive ? "" : "opacity-70"}`}
              >
                <div
                  className="h-3 rounded-t-lg"
                  style={{ backgroundColor: group.color }}
                />

                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-primary font-semibold text-gray-900 truncate">
                              {group.name}
                            </h3>
                            {!group.isActive && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary font-medium bg-gray-200 text-gray-700">
                                Archived
                              </span>
                            )}
                          </div>

                          {group.description ? (
                            <p className="text-sm text-gray-600 font-secondary mt-1 line-clamp-2">
                              {group.description}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex items-center justify-end gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => openEdit(group)}
                            className="p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <PencilIcon />
                          </button>

                          {group.isActive ? (
                            <button
                              type="button"
                              onClick={() => setShowArchiveConfirm(group.id)}
                              className="p-2 text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer"
                              title="Archive"
                            >
                              <ToggleIcon active />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowReactivateConfirm(group.id)}
                              className="p-2 text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer"
                              title="Restore"
                            >
                              <ToggleIcon active={false} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-gray-200">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm font-secondary text-gray-900">
                      <span className="font-semibold">{group.memberCount}</span>{" "}
                      member{group.memberCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {(showCreateModal || showEditModal) && (
        <GroupFormModal
          group={showEditModal ? selectedGroup : null}
          staff={staff}
          isStaffLoading={isStaffLoading}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedGroup(null);
          }}
          onSave={handleSaveGroup}
        />
      )}

      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-orange-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0l-2 8H8l-2-8m14 0H4"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-primary font-semibold text-gray-900 text-center mb-2">
                Archive group
              </h3>
              <p className="text-sm text-gray-600 font-secondary text-center">
                This will set the group to archived. You can restore it later.
              </p>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowArchiveConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => archiveGroup(showArchiveConfirm)}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-secondary font-medium transition-colors cursor-pointer"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {showReactivateConfirm && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-primary font-semibold text-gray-900 text-center mb-2">
                Restore group
              </h3>
              <p className="text-sm text-gray-600 font-secondary text-center">
                This will reactivate the group and make it available again.
              </p>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowReactivateConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => reactivateGroup(showReactivateConfirm)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-secondary font-medium transition-colors cursor-pointer"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkAssignModal && (
        <BulkAssignModal
          selectedGroups={selectedGroups}
          groups={groups}
          staff={staff}
          staffCount={staffCount}
          staffPage={staffPage}
          staffPageSize={staffPageSize}
          isStaffLoading={isStaffLoading}
          onChangeStaffPage={setStaffPage}
          onClose={() => setShowBulkAssignModal(false)}
        />
      )}
    </>
  );
}
