import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { PencilIcon } from "@/utils";

type RoleRequirement = {
  id: string;
  role: string;
  role_name: string;
  role_color?: string | null;
  pay_type: "hourly" | "fixed" | string;
  event_rate: string | number;
  staff_count: number;
  filled_count?: number | null;
  start_time: string;
  end_time: string;
  estimated_hours?: string | number | null;
  estimated_cost?: string | number | null;
  notes?: string | null;
};

type RoleListItem = {
  id: string;
  name: string;
  color?: string | null;
  description?: string | null;
  pay_type: "hourly" | "fixed" | string;
  default_rate: string;
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

function toMinutes(time: string) {
  if (!time) return 0;
  const [h, m] = time.split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

function calcHours(start: string, end: string) {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (!s || !e) return 0;
  const diff = e - s;
  return diff > 0 ? diff / 60 : 0;
}

function calcCost(
  payType: string,
  rate: number,
  staffCount: number,
  hours: number,
) {
  if (!Number.isFinite(rate) || !Number.isFinite(staffCount)) return 0;
  if (payType === "hourly") return rate * staffCount * hours;
  return rate * staffCount;
}

type RolesTabProps = {
  eventId: string;
  roleRequirements: RoleRequirement[];
  onChanged: () => void;
  formatCurrency: (amount: string | number) => string;
  formatTime: (time: string) => string;
};

export function RolesTab({
  eventId,
  roleRequirements,
  onChanged,
  formatCurrency,
  formatTime,
}: RolesTabProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const [roleSearch, setRoleSearch] = useState("");
  const [roleList, setRoleList] = useState<RoleListItem[]>([]);
  const [roleLoading, setRoleLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<{
    start_time: string;
    end_time: string;
    staff_count: number;
    event_rate: number;
    notes: string;
  } | null>(null);

  const existingRoleIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const r of roleRequirements) s.add(String(r.role));
    return s;
  }, [roleRequirements]);

  const fetchRoles = async (q: string) => {
    setRoleLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", "active");
      params.set("page", "1");
      params.set("page_size", "30");
      if (q.trim()) params.set("search", q.trim());

      const res = await apiFetch(`/api/roles/list?${params.toString()}`);
      const results = (res?.roles ?? []) as RoleListItem[];
      setRoleList(results);
    } catch (e) {
      console.error(e);
      toastError("Failed to load roles");
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    if (!isPickerOpen) return;
    const t = window.setTimeout(() => fetchRoles(roleSearch), 250);
    return () => window.clearTimeout(t);
  }, [roleSearch, isPickerOpen]);

  //   useEffect(() => {
  //     if (isPickerOpen) fetchRoles("");
  //   }, [isPickerOpen]);

  const openEdit = (req: RoleRequirement) => {
    setEditingId(req.id);
    setEdit({
      start_time: (req.start_time || "18:00").slice(0, 5),
      end_time: (req.end_time || "22:00").slice(0, 5),
      staff_count: Number(req.staff_count ?? 1),
      event_rate: Number(req.event_rate ?? 0),
      notes: String(req.notes ?? ""),
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setEdit(null);
  };

  const saveEdit = async (req: RoleRequirement) => {
    if (!edit) return;
    setIsBusy(true);
    try {
      const body: any = {
        start_time: edit.start_time,
        end_time: edit.end_time,
        event_rate: Number(edit.event_rate),
        staff_count: Number(edit.staff_count),
        notes: edit.notes,
      };

      const res = await apiFetch(
        `/api/events/${eventId}/roles/${req.id}/update/`,
        { method: "PATCH", body: JSON.stringify(body) },
      );

      toastSuccess(res?.message || "Role requirement updated");
      await onChanged();
      closeEdit();
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to update role requirement");
    } finally {
      setIsBusy(false);
    }
  };

  const removeRequirement = async (requirementId: string) => {
    setIsBusy(true);
    try {
      const res = await apiFetch(
        `/api/events/${eventId}/roles/${requirementId}/delete/`,
        { method: "DELETE" },
      );
      toastSuccess(res?.message || "Role requirement removed");
      await onChanged();
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to remove role requirement");
    } finally {
      setIsBusy(false);
    }
  };

  const addRoleRequirement = async (role: RoleListItem) => {
    if (existingRoleIdSet.has(String(role.id))) {
      toastError("This role is already added to the event");
      return;
    }

    setIsBusy(true);
    try {
      const body = {
        role: role.id,
        start_time: "18:00",
        end_time: "22:00",
        pay_type: role.pay_type,
        event_rate: Number(role.default_rate || 0),
        staff_count: 1,
        notes: "",
      };

      const res = await apiFetch(`/api/events/${eventId}/roles/add/`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      toastSuccess(res?.message || "Role requirement added");
      await onChanged();
      setIsPickerOpen(false);
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to add role requirement");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-secondary font-semibold text-gray-700">
          Role Requirements ({roleRequirements.length})
        </h4>

        <button
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Add role requirement"
          title="Add role requirement"
          disabled={isBusy}
        >
          <PlusIcon />
        </button>
      </div>

      {roleRequirements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-900 font-secondary font-medium mb-1">
            No role requirements
          </p>
          <p className="text-gray-500 font-secondary text-sm mb-4">
            Add roles using the plus icon
          </p>
          <button
            onClick={() => setIsPickerOpen(true)}
            className="px-3 py-2 bg-primary text-white rounded-lg font-secondary font-semibold hover:bg-primary/80"
          >
            Add role
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {roleRequirements.map((req) => {
            const hours = calcHours(req.start_time, req.end_time);
            const staffCount = Number(req.staff_count ?? 0);
            const rate = Number(req.event_rate ?? 0);
            const computedHours = hours * staffCount;
            const computedCost = calcCost(
              req.pay_type,
              rate,
              staffCount,
              hours,
            );

            const isEditing = editingId === req.id;

            return (
              <div
                key={req.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div
                  className="h-1"
                  style={{ backgroundColor: req.role_color || "#6B7280" }}
                />

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-primary font-bold"
                        style={{
                          backgroundColor: req.role_color || "#6B7280",
                        }}
                      >
                        {String(req.role_name || "R").charAt(0)}
                      </div>

                      <div>
                        <h5 className="font-secondary font-semibold text-gray-900">
                          {req.role_name}
                        </h5>
                        <p className="text-xs text-gray-500 capitalize">
                          {req.pay_type} rate
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${
                          Number(req.filled_count ?? 0) >=
                          Number(req.staff_count ?? 0)
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {Number(req.filled_count ?? 0)} /{" "}
                        {Number(req.staff_count ?? 0)} filled
                      </span>
                      {!isEditing && (
                        <>
                          <div>
                            <button
                              onClick={() => openEdit(req)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                              disabled={isBusy}
                            >
                              <PencilIcon />
                            </button>
                          </div>

                          <button
                            onClick={() => removeRequirement(req.id)}
                            disabled={isBusy}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            aria-label="Remove role requirement"
                            title="Remove role requirement"
                          >
                            <XIcon />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {!isEditing ? (
                    <>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 font-secondary">
                            Time:
                          </span>
                          <p className="font-medium text-gray-900">
                            {formatTime(req.start_time)} to{" "}
                            {formatTime(req.end_time)}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-600 font-secondary">
                            Staff needed:
                          </span>
                          <p className="font-medium text-gray-900">
                            {Number(req.staff_count ?? 0)}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-600 font-secondary">
                            Rate:
                          </span>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(rate)}
                            {req.pay_type === "hourly" ? " per hour" : ""}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-600 font-secondary">
                            Computed:
                          </span>
                          <p className="font-medium text-green-700">
                            {formatCurrency(computedCost)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {computedHours.toFixed(1)} staff hours
                          </p>
                        </div>
                      </div>

                      {req.notes && (
                        <p className="mt-3 text-sm text-gray-600 font-secondary">
                          {req.notes}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 font-secondary mb-1">
                            Start time
                          </label>
                          <input
                            type="time"
                            value={edit?.start_time || ""}
                            onChange={(e) =>
                              setEdit((p) =>
                                p ? { ...p, start_time: e.target.value } : p,
                              )
                            }
                            className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg font-secondary text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 font-secondary mb-1">
                            End time
                          </label>
                          <input
                            type="time"
                            value={edit?.end_time || ""}
                            onChange={(e) =>
                              setEdit((p) =>
                                p ? { ...p, end_time: e.target.value } : p,
                              )
                            }
                            className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg font-secondary text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 font-secondary mb-1">
                            Staff needed
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={edit?.staff_count ?? 0}
                            onChange={(e) =>
                              setEdit((p) =>
                                p
                                  ? {
                                      ...p,
                                      staff_count: Math.max(
                                        0,
                                        Number(e.target.value || 0),
                                      ),
                                    }
                                  : p,
                              )
                            }
                            className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg font-secondary text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 font-secondary mb-1">
                            {req.pay_type === "hourly"
                              ? "Hourly rate"
                              : "Fixed rate"}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={edit?.event_rate ?? 0}
                            onChange={(e) =>
                              setEdit((p) =>
                                p
                                  ? {
                                      ...p,
                                      event_rate: Number(e.target.value || 0),
                                    }
                                  : p,
                              )
                            }
                            className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg font-secondary text-sm"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 font-secondary mb-1">
                            Notes
                          </label>
                          <textarea
                            rows={3}
                            value={edit?.notes || ""}
                            onChange={(e) =>
                              setEdit((p) =>
                                p ? { ...p, notes: e.target.value } : p,
                              )
                            }
                            placeholder="Add any notes for this roles"
                            className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg font-secondary text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          Computed now:{" "}
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(
                              calcCost(
                                req.pay_type,
                                Number(edit?.event_rate ?? 0),
                                Number(edit?.staff_count ?? 0),
                                calcHours(
                                  edit?.start_time || "",
                                  edit?.end_time || "",
                                ),
                              ),
                            )}
                          </span>{" "}
                          <span className="text-gray-500">
                            and{" "}
                            {(
                              calcHours(
                                edit?.start_time || "",
                                edit?.end_time || "",
                              ) * Number(edit?.staff_count ?? 0)
                            ).toFixed(1)}{" "}
                            staff hours
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={closeEdit}
                            className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium"
                            disabled={isBusy}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(req)}
                            className="px-3 py-2 bg-primary  text-white rounded-lg font-secondary font-semibold hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={isBusy}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isPickerOpen && (
        <div className="fixed inset-0 z-60 bg-gray-700/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex pb-4 px-2 flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-secondary font-semibold text-gray-900">
                  Add a role requirement
                </p>
                <p className="text-xs text-gray-500">
                  Select a role to add to this event
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
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                placeholder="Search roles by name"
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {roleLoading ? (
                <div className="p-6 text-sm text-gray-600 font-secondary">
                  Loading roles...
                </div>
              ) : roleList.length === 0 ? (
                <div className="p-6 text-sm text-gray-600 font-secondary">
                  No roles found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {roleList.map((r) => {
                    const disabled = existingRoleIdSet.has(String(r.id));
                    return (
                      <li
                        key={r.id}
                        className="p-4 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-primary font-bold shrink-0"
                            style={{ backgroundColor: r.color || "#6B7280" }}
                          >
                            {String(r.name || "R").charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-secondary font-semibold text-gray-900 truncate">
                              {r.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate capitalize">
                              {r.pay_type} • default{" "}
                              {formatCurrency(Number(r.default_rate || 0))}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => addRoleRequirement(r)}
                          disabled={isBusy || disabled}
                          className="px-3 py-2 bg-primary text-white rounded-lg font-secondary font-semibold hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed"
                          title={disabled ? "Already added" : "Add role"}
                        >
                          {disabled ? "Added" : "Add"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setIsPickerOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium"
              >
                Done
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
