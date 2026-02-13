import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";

type AssignedGroup = {
  id: string;
  name: string;
  color?: string | null;
  company?: string;
  company_name?: string;
};

type GroupListItem = {
  id: string;
  name: string;
  color?: string | null;
  description?: string | null;
  company?: string;
  company_name?: string;
  is_active?: boolean;
};

function PlusIcon() {
  return (
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
        d="M12 5v14M5 12h14"
      />
    </svg>
  );
}

function XIcon() {
  return (
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

type GroupsTabProps = {
  eventId: string;
  assignedGroups: AssignedGroup[];
  onChanged: () => void;
};

export function GroupsTab({
  eventId,
  assignedGroups,
  onChanged,
}: GroupsTabProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const [groupSearch, setGroupSearch] = useState("");
  const [groupList, setGroupList] = useState<GroupListItem[]>([]);
  const [groupLoading, setGroupLoading] = useState(false);

  const existingGroupIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const g of assignedGroups) s.add(String(g.id));
    return s;
  }, [assignedGroups]);

  const fetchGroups = async (q: string) => {
    setGroupLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", "active");
      params.set("page", "1");
      params.set("page_size", "50");
      if (q.trim()) params.set("search", q.trim());

      const res = await apiFetch(`/api/groups/list?${params.toString()}`);
      const results = (res?.groups ?? res?.results ?? []) as GroupListItem[];
      setGroupList(results);
    } catch (e) {
      console.error(e);
      toastError("Failed to load groups");
    } finally {
      setGroupLoading(false);
    }
  };

  useEffect(() => {
    if (!isPickerOpen) return;
    const t = window.setTimeout(() => fetchGroups(groupSearch), 250);
    return () => window.clearTimeout(t);
  }, [groupSearch, isPickerOpen]);

  const addGroupToEvent = async (group: GroupListItem) => {
    if (existingGroupIdSet.has(String(group.id))) {
      toastError("This group is already assigned to the event");
      return;
    }

    setIsBusy(true);
    try {
      const body = {
        group_ids: [group.id],
        mode: "append",
        add_staff: true,
      };

      const res = await apiFetch(`/api/events/${eventId}/groups/assign/`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      toastSuccess(res?.message || "Group assigned to event");
      await onChanged();
      setIsPickerOpen(false);
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to assign group to event");
    } finally {
      setIsBusy(false);
    }
  };

  const removeGroupFromEvent = async (groupId: string) => {
    setIsBusy(true);
    try {
      const body = {
        group_ids: [groupId],
        remove_staff: false,
      };

      const res = await apiFetch(`/api/events/${eventId}/groups/remove/`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      toastSuccess(res?.message || "Group removed from event");
      await onChanged();
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to remove group from event");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-secondary font-semibold text-gray-700">
          Assigned Groups ({assignedGroups.length})
        </h4>

        <button
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Add group"
          title="Add group"
          disabled={isBusy}
        >
          <PlusIcon />
        </button>
      </div>

      {assignedGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-900 font-secondary font-medium mb-1">
            No groups assigned
          </p>
          <p className="text-gray-500 font-secondary text-sm mb-4">
            Add groups using the plus icon
          </p>
          <button
            onClick={() => setIsPickerOpen(true)}
            className="px-3 py-2 bg-primary text-white rounded-lg font-secondary font-semibold hover:bg-primary/80"
            disabled={isBusy}
          >
            Add group
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {assignedGroups.map((g) => (
            <div
              key={g.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="h-1"
                style={{ backgroundColor: g.color || "#6B7280" }}
              />

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-primary font-bold shrink-0"
                      style={{ backgroundColor: g.color || "#6B7280" }}
                    >
                      {String(g.name || "G").charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <h5 className="font-secondary font-semibold text-gray-900 truncate">
                        {g.name}
                      </h5>
                      <p className="text-xs text-gray-500 truncate">
                        {g.company_name
                          ? `Company: ${g.company_name}`
                          : "Group"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeGroupFromEvent(g.id)}
                    disabled={isBusy}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label="Remove group"
                    title="Remove group"
                  >
                    <XIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isPickerOpen && (
        <div className="fixed inset-0 z-60 bg-gray-700/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex pb-4 px-2 flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-secondary font-semibold text-gray-900">
                  Add a group
                </p>
                <p className="text-xs text-gray-500">
                  Select a group to assign to this event
                </p>
              </div>

              <button
                onClick={() => setIsPickerOpen(false)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
                aria-label="Close"
              >
                <XIcon />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <input
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                placeholder="Search groups by name"
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {groupLoading ? (
                <div className="p-6 text-sm text-gray-600 font-secondary">
                  Loading groups...
                </div>
              ) : groupList.length === 0 ? (
                <div className="p-6 text-sm text-gray-600 font-secondary">
                  No groups found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {groupList.map((g) => {
                    const disabled = existingGroupIdSet.has(String(g.id));
                    return (
                      <li
                        key={g.id}
                        className="p-4 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-primary font-bold shrink-0"
                            style={{ backgroundColor: g.color || "#6B7280" }}
                          >
                            {String(g.name || "G").charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-secondary font-semibold text-gray-900 truncate">
                              {g.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {g.company_name
                                ? `Company: ${g.company_name}`
                                : "Group"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => addGroupToEvent(g)}
                          disabled={isBusy || disabled}
                          className="px-3 py-2 bg-primary text-white rounded-lg font-secondary font-semibold hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed"
                          title={disabled ? "Already assigned" : "Assign group"}
                        >
                          {disabled ? "Added" : "Add"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
