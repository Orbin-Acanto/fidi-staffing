"use client";

import RoleCard from "@/component/role/RoleCard";
import RoleModal from "@/component/role/RoleModal";
import { apiFetch } from "@/lib/apiFetch";
import { toastSuccess, toastError } from "@/lib/toast";
import type { Role, RoleFormData } from "@/type";
import { useCallback, useEffect, useState } from "react";

type BackendRole = {
  id: string;
  company: string;
  company_name: string;
  name: string;
  description: string | null;
  pay_type: "hourly" | "fixed";
  default_rate: string | number | null;
  overtime_multiplier: string | number | null;
  color: string | null;
  icon: string | null;
  status: "active" | "inactive";
  sort_order: number;
  staff_count: number;
  created_at: string;
  updated_at: string;
};

type ListRolesResponse = {
  roles: BackendRole[];
  total: number;
};

function toNumber(v: unknown, fallback = 0) {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function mapBackendRole(r: BackendRole): Role {
  return {
    id: r.id,
    name: r.name ?? "",
    description: r.description ?? "",
    payType: r.pay_type,
    defaultRate: toNumber(r.default_rate, 0),
    overtimeMultiplier: toNumber(r.overtime_multiplier, 1.5),
    color: r.color ?? "#3B82F6",
    icon: r.icon ?? null,
    status: r.status,
    sortOrder: r.sort_order ?? 0,
    staffCount: r.staff_count ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    companyId: r.company,
    companyName: r.company_name,
  } as unknown as Role;
}

function mapRoleFormToPayload(data: RoleFormData) {
  return {
    name: data.name?.trim(),
    description: data.description?.trim() || "",
    pay_type: data.payType,
    default_rate: String(data.defaultRate ?? 0),
    overtime_multiplier: String(data.overtimeMultiplier ?? 1.5),
    color: data.color || "#3B82F6",
    status: data.status ?? "active",
    sort_order: data.sortOrder ?? 0,
  };
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterPayType, setFilterPayType] = useState<
    "all" | "hourly" | "fixed"
  >("all");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterPayType !== "all") params.set("pay_type", filterPayType);

      const qs = params.toString();
      const res = await apiFetch<ListRolesResponse>(
        `/api/roles/list${qs ? `?${qs}` : ""}`,
      );

      const mapped = (res.roles || []).map(mapBackendRole);
      setRoles(mapped);
    } catch (err: any) {
      toastError(err, "Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterStatus, filterPayType]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchRoles();
    }, 250);
    return () => clearTimeout(t);
  }, [fetchRoles]);

  const activeRoles = roles.filter((r) => r.status === "active").length;
  const hourlyRoles = roles.filter((r) => r.payType === "hourly").length;
  const totalStaff = roles.reduce((sum, r) => sum + (r.staffCount || 0), 0);

  const handleAddRole = () => {
    setEditingRole(null);
    setShowModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleSaveRole = async (data: RoleFormData) => {
    try {
      const payload = mapRoleFormToPayload(data);

      if (editingRole) {
        const res = await apiFetch<{ message?: string; role?: BackendRole }>(
          `/api/roles/${editingRole.id}/update`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        toastSuccess(res.message || "Role updated successfully");

        if (res.role) {
          const updated = mapBackendRole(res.role);
          setRoles((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r)),
          );
        } else {
          await fetchRoles();
        }
      } else {
        const res = await apiFetch<{ message?: string; role?: BackendRole }>(
          `/api/roles/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        toastSuccess(res.message || "Role created successfully");

        if (res.role) {
          const created = mapBackendRole(res.role);
          setRoles((prev) => [created, ...prev]);
        } else {
          await fetchRoles();
        }
      }

      setShowModal(false);
      setEditingRole(null);
    } catch (err: any) {
      if (err?.data?.errors) {
        toastError(err, "Please fix the form errors");
        return;
      }
      toastError(err, "Failed to save role");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      const role = roles.find((r) => r.id === roleId);

      if (role && (role.staffCount || 0) > 0) {
        toastError(
          "Failed to update role status because staff members are assigned to it",
        );
        return;
      }

      const res = await apiFetch<{ message?: string }>(
        `/api/roles/${roleId}/delete`,
        { method: "DELETE" },
      );

      toastSuccess(res.message || "Role deactivated successfully");
      setRoles((prev) =>
        prev.map((r) => (r.id === roleId ? { ...r, status: "inactive" } : r)),
      );
      setShowDeleteConfirm(null);
    } catch (err: any) {
      toastError(err, "Failed to delete role");
    }
  };

  const handleToggleStatus = async (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    try {
      if (role.status === "inactive") {
        const res = await apiFetch<{ message?: string; role?: BackendRole }>(
          `/api/roles/${roleId}/reactivate`,
          { method: "POST" },
        );

        toastSuccess(res.message || "Role Reactivated");

        if (res.role) {
          const updated = mapBackendRole(res.role);
          setRoles((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r)),
          );
        } else {
          setRoles((prev) =>
            prev.map((r) => (r.id === roleId ? { ...r, status: "active" } : r)),
          );
        }
      } else {
        setShowDeleteConfirm(roleId);
      }
    } catch (err: any) {
      toastError(err, "Failed to update role status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-primary font-bold text-gray-900">
            Roles & Pay Rates
          </h1>
          <p className="text-sm font-secondary text-gray-600 mt-1">
            Manage staff roles and their default compensation settings
          </p>
        </div>
        <button
          onClick={handleAddRole}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-secondary font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm transition-colors"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Role
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-primary font-bold text-gray-900">
                {roles.length}
              </p>
              <p className="text-xs text-gray-500 font-secondary">
                Total Roles
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg
                className="w-5 h-5 text-green-600"
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
            <div>
              <p className="text-2xl font-primary font-bold text-green-600">
                {activeRoles}
              </p>
              <p className="text-xs text-gray-500 font-secondary">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg
                className="w-5 h-5 text-purple-600"
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
            <div>
              <p className="text-2xl font-primary font-bold text-purple-600">
                {hourlyRoles}
              </p>
              <p className="text-xs text-gray-500 font-secondary">
                Hourly Roles
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <svg
                className="w-5 h-5 text-orange-600"
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
            </div>
            <div>
              <p className="text-2xl font-primary font-bold text-orange-600">
                {totalStaff}
              </p>
              <p className="text-xs text-gray-500 font-secondary">
                Staff Assigned
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-secondary text-gray-500">
              Status:
            </span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value as any)}
                  className={`px-3 py-1.5 text-xs font-secondary font-medium rounded-md transition-all ${
                    filterStatus === option.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-secondary text-gray-500">Pay:</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {[
                { value: "all", label: "All" },
                { value: "hourly", label: "Hourly" },
                { value: "fixed", label: "Fixed" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterPayType(option.value as any)}
                  className={`px-3 py-1.5 text-xs font-secondary font-medium rounded-md transition-all ${
                    filterPayType === option.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500 font-secondary">
          Loading roles...
        </div>
      ) : roles.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="font-primary font-semibold text-gray-900 mb-1">
            No roles found
          </h3>
          <p className="text-sm text-gray-500 font-secondary mb-4">
            Try adjusting your filters or create a new role
          </p>
          <button
            onClick={handleAddRole}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-secondary font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Role
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleEditRole}
              onDelete={(id) => setShowDeleteConfirm(id)}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {showModal && (
        <RoleModal
          role={editingRole}
          onSave={handleSaveRole}
          onClose={() => {
            setShowModal(false);
            setEditingRole(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-primary font-semibold text-gray-900 text-center mb-2">
              Deactivate Role?
            </h3>
            <p className="text-sm text-gray-500 font-secondary text-center mb-6">
              This will set the role to inactive. You can activate it later.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRole(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 font-secondary font-medium transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
