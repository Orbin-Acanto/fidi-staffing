import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { toMediaProxyUrl } from "@/lib/mediaUrl";

type StaffAssignment = {
  id: string;
  staff: string;
  staff_name: string;
  staff_avatar?: string | null;
  role?: string | null;
  role_name?: string | null;
  pay_type?: "hourly" | "fixed" | string | null;
  pay_rate?: string | number | null;
  start_time?: string | null;
  end_time?: string | null;
  status?: string | null;
  confirmation_status?: string | null;
  notes?: string | null;
};

type StaffListItem = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  is_available?: boolean;
  status?: string;
  primary_role?: { id: string; name: string; color?: string | null } | null;
  hourly_rate?: string | null;
  fixed_rate?: string | null;
};

function initials(name: string) {
  return String(name || "S")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

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

type StaffTabProps = {
  eventId: string;
  staffAssignments: StaffAssignment[];
  onChanged: () => void;
  formatCurrency: (amount: string | number) => string;
  formatTime: (time: string) => string;
};

export function StaffTab({
  eventId,
  staffAssignments,
  onChanged,
  formatCurrency,
  formatTime,
}: StaffTabProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const [search, setSearch] = useState("");
  const [staffResults, setStaffResults] = useState<StaffListItem[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);

  const assignedStaffIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const a of staffAssignments) {
      if (a.staff) s.add(String(a.staff));
    }
    return s;
  }, [staffAssignments]);

  const fetchStaffList = async (q: string) => {
    setStaffLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", "active");
      params.set("page", "1");
      params.set("page_size", "30");
      if (q.trim()) params.set("search", q.trim());

      const res = await apiFetch(`/api/staff/list?${params.toString()}`);
      const results = (res?.results ?? []) as StaffListItem[];
      setStaffResults(results);
    } catch (e) {
      console.error(e);
      toastError("Failed to load staff list");
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    if (!isPickerOpen) return;
    const t = window.setTimeout(() => fetchStaffList(search), 250);
    return () => window.clearTimeout(t);
  }, [search, isPickerOpen]);

  useEffect(() => {
    if (isPickerOpen) fetchStaffList("");
  }, [isPickerOpen]);

  const removeStaff = async (assignmentId: string) => {
    setIsBusy(true);
    try {
      const res = await apiFetch(
        `/api/events/${eventId}/staff/${assignmentId}/remove/`,
        { method: "DELETE" },
      );
      toastSuccess(res?.message || "Staff removed");
      await onChanged();
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to remove staff");
    } finally {
      setIsBusy(false);
    }
  };

  const assignStaff = async (staff: StaffListItem) => {
    if (!staff.primary_role?.id) {
      toastError("This staff member has no primary role set");
      return;
    }

    setIsBusy(true);
    try {
      const body = {
        staff: staff.id,
        role: staff.primary_role.id,
        start_time: (staffAssignments?.[0]?.start_time || "18:00").slice(0, 5),
        end_time: (staffAssignments?.[0]?.end_time || "23:00").slice(0, 5),
        pay_type: staff.hourly_rate ? "hourly" : "fixed",
        pay_rate: staff.hourly_rate
          ? Number(staff.hourly_rate)
          : Number(staff.fixed_rate || 0),
        notes: "",
      };

      const res = await apiFetch(`/api/events/${eventId}/staff/assign/`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      toastSuccess(res?.message || "Staff assigned");
      await onChanged();
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to assign staff");
    } finally {
      setIsBusy(false);
    }
  };

  const toggleStaff = async (staff: StaffListItem) => {
    const isAssigned = assignedStaffIdSet.has(String(staff.id));
    if (!isAssigned) {
      await assignStaff(staff);
      return;
    }

    const assignment = staffAssignments.find(
      (a) => String(a.staff) === String(staff.id),
    );
    if (!assignment?.id) {
      toastError("Could not find assignment id for this staff member");
      return;
    }
    await removeStaff(assignment.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-secondary font-semibold text-gray-700">
          Staff Members ({staffAssignments.length})
        </h4>

        <button
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
          aria-label="Add staff"
          title="Add staff"
          disabled={isBusy}
        >
          <PlusIcon />
        </button>
      </div>

      {staffAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-900 font-secondary font-medium mb-1">
            No staff assigned
          </p>
          <p className="text-gray-500 font-secondary text-sm mb-4">
            Add staff using the plus icon
          </p>
          <button
            onClick={() => setIsPickerOpen(true)}
            className="px-3 py-2 bg-primary text-white rounded-lg font-secondary font-semibold hover:bg-primary/80"
          >
            Add staff
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {staffAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {assignment.staff_avatar ? (
                      <img
                        src={
                          toMediaProxyUrl(assignment.staff_avatar) ||
                          "./male.png"
                        }
                        alt={assignment.staff_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-secondary font-medium text-gray-600">
                        {initials(assignment.staff_name)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h5 className="font-secondary font-semibold text-gray-900">
                      {assignment.staff_name}
                    </h5>
                    <p className="text-sm text-gray-600 font-secondary">
                      {assignment.role_name || "Role"} •{" "}
                      {formatCurrency(Number(assignment.pay_rate || 0))}
                      {assignment.pay_type === "hourly" ? " per hour" : ""}
                    </p>
                    {(assignment.start_time || assignment.end_time) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(String(assignment.start_time || ""))} to{" "}
                        {formatTime(String(assignment.end_time || ""))}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${
                        assignment.status === "checked_in"
                          ? "bg-green-100 text-green-700"
                          : assignment.status === "checked_out"
                            ? "bg-purple-100 text-purple-700"
                            : assignment.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : assignment.status === "declined"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {String(assignment.status || "pending").replace(
                        /_/g,
                        " ",
                      )}
                    </span>

                    <span className="text-xs font-secondary text-gray-500">
                      {assignment.confirmation_status === "pending"
                        ? "Awaiting confirmation"
                        : assignment.confirmation_status || ""}
                    </span>
                  </div>

                  <button
                    onClick={() => removeStaff(assignment.id)}
                    disabled={isBusy}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label="Remove staff"
                    title="Remove staff"
                  >
                    <XIcon />
                  </button>
                </div>
              </div>

              {assignment.notes && (
                <p className="mt-2 text-sm text-gray-600 font-secondary">
                  {assignment.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {isPickerOpen && (
        <div className="fixed inset-0 z-60 bg-gray-700/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-secondary font-semibold text-gray-900">
                  Add or remove staff
                </p>
                <p className="text-xs text-gray-500">
                  Tick to assign. Untick to remove.
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff by name, email, phone"
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {staffLoading ? (
                <div className="p-6 text-sm text-gray-600 font-secondary">
                  Loading staff...
                </div>
              ) : staffResults.length === 0 ? (
                <div className="p-6 text-sm text-gray-600 font-secondary">
                  No staff found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {staffResults.map((s) => {
                    const checked = assignedStaffIdSet.has(String(s.id));
                    return (
                      <li key={s.id} className="p-4 flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleStaff(s)}
                          disabled={isBusy}
                          className="w-4 h-4"
                        />

                        <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                          {s.avatar ? (
                            <img
                              src={toMediaProxyUrl(s.avatar) || "./male.png"}
                              alt={`${s.first_name} ${s.last_name}`}
                              className="w-10 h-10 object-cover"
                            />
                          ) : (
                            <span className="text-xs font-secondary font-medium text-gray-600">
                              {initials(`${s.first_name} ${s.last_name}`)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-secondary font-semibold text-gray-900 truncate">
                            {s.first_name} {s.last_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {s.email || s.phone || "No contact info"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-600">
                            {s.primary_role?.name || "No primary role"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {s.hourly_rate
                              ? `${formatCurrency(Number(s.hourly_rate))} per hour`
                              : s.fixed_rate
                                ? `${formatCurrency(Number(s.fixed_rate))} fixed`
                                : ""}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setIsPickerOpen(false)}
                className="px-4 py-2 bg-white border text-gray-700 border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
