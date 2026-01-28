"use client";
import { useEffect, useState } from "react";
import { AppSelect } from "@/component/ui/Select";
import { activityLogs } from "@/data";
import { User, UserRole } from "@/type";
import UserHeader from "@/component/user/UserHeader";
import UserSummaryPanel from "@/component/user/UserSummaryPanel";
import UserTableView from "@/component/user/UserTableView";
import ActivityLogPanel from "@/component/user/ActivityLogPanel";
import UserDetailModal from "@/component/user/UserDetailModal";
import AddEditUserModal from "@/component/user/AddEditUserModal";
import SuspendUserModal from "@/component/user/SuspendUserModal";
import ResetPasswordModal from "@/component/user/ResetPasswordModal";
import { apiFetch } from "@/lib/apiFetch";
import { toastError } from "@/lib/toast";
import { useMe } from "@/hooks/useMe";

type UsersResponse = {
  count: number;
  users: Array<{
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    avatar: string | null;
    is_active: boolean;
    current_company: {
      id: string;
      name: string;
    } | null;
    current_tenant: {
      id: string;
      name: string;
    } | null;
    tenant_membership: {
      role: string;
    } | null;
    tenant_role: string | null;
    created_at: string;
    updated_at: string;
  }>;
};

type Company = {
  id: string;
  name: string;
  is_active: boolean;
};

export default function UserManagementPage() {
  const { data: me, isLoading } = useMe();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "Admin").length;
  const managerCount = users.filter((u) => u.role === "Manager").length;
  const staffCount = users.filter((u) => u.role === "Staff").length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const deactivatedUsers = users.filter(
    (u) => u.status === "Deactivated",
  ).length;

  const currentUserRole: UserRole = mapBackendRoleToFrontend(
    me?.tenant_role || null,
  );

  const fetchCompanies = async () => {
    try {
      const data = await apiFetch<Company[]>("/api/companies/list-company");
      setCompanies(data);
    } catch (err) {
      toastError(err, "Failed to load companies");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiFetch<UsersResponse>(
        "/api/users/list-admin-mod",
      );

      const transformedUsers: User[] = response.users.map((user) => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone || undefined,
        avatar: user.avatar || undefined,
        role: mapBackendRoleToFrontend(
          user.tenant_membership?.role || user.tenant_role,
        ),
        status: user.is_active ? "Active" : "Deactivated",
        company: user.current_company?.name || user.current_tenant?.name,
        companyId: user.current_company?.id || user.current_tenant?.id,
        createdAt: new Date(user.created_at).toISOString().split("T")[0],
        lastUpdated: new Date(user.updated_at).toISOString().split("T")[0],
      }));

      setUsers(transformedUsers);
    } catch (err) {
      toastError(err, "Failed to load users");
    }
  };

  function mapBackendRoleToFrontend(backendRole: string | null): UserRole {
    const roleMap: Record<string, UserRole> = {
      owner: "Owner",
      admin: "Admin",
      manager: "Manager",
      staff: "Staff",
    };
    return roleMap[backendRole?.toLowerCase() || ""] || "Staff";
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesCompany =
      filterCompany === "all" || user.companyId === filterCompany;

    return matchesSearch && matchesRole && matchesStatus && matchesCompany;
  });

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  const handleSaveUser = (data: Partial<User>) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...data } : u)),
      );
    } else {
      setUsers((prev) => [...prev, data as User]);
    }
    setShowAddEditModal(false);
    setSelectedUser(null);
    fetchUsers();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserHeader
        onAddUser={() => {
          setSelectedUser(null);
          setShowAddEditModal(true);
        }}
      />

      <UserSummaryPanel
        totalUsers={totalUsers}
        adminCount={adminCount}
        managerCount={managerCount}
        staffCount={staffCount}
        activeUsers={activeUsers}
        suspendedUsers={deactivatedUsers}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-primary font-semibold text-gray-900 mb-4">
              All Users
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Search Users
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
                    placeholder="Search by name, email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black
                             placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <AppSelect
                  label="Role"
                  value={filterRole}
                  onValueChange={(value) => setFilterRole(value)}
                  options={[
                    { label: "All Roles", value: "all" },
                    { label: "Admin", value: "Admin" },
                    { label: "Manager", value: "Manager" },
                    { label: "Staff", value: "Staff" },
                  ]}
                />
              </div>

              <div>
                <AppSelect
                  label="Company"
                  value={filterCompany}
                  onValueChange={(value) => setFilterCompany(value)}
                  options={[
                    { label: "All Companies", value: "all" },
                    ...companies.map((company) => ({
                      label: company.name,
                      value: company.id,
                    })),
                  ]}
                />
              </div>

              <div>
                <AppSelect
                  label="Status"
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value)}
                  options={[
                    { label: "All Status", value: "all" },
                    { label: "Active", value: "Active" },
                    { label: "Deactivated", value: "Deactivated" },
                  ]}
                />
              </div>
            </div>
          </div>

          <UserTableView
            filteredUsers={filteredUsers}
            currentUserRole={currentUserRole}
            onOpenDetail={(user) => {
              setSelectedUser(user);
              setShowDetailModal(true);
            }}
            onSuspend={(user) => {
              setSelectedUser(user);
              setShowSuspendModal(true);
            }}
            onResetPassword={(user) => {
              setSelectedUser(user);
              setShowResetPasswordModal(true);
            }}
          />
        </div>

        <div className="lg:col-span-1">
          <ActivityLogPanel logs={activityLogs} />
        </div>
      </div>

      {showDetailModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          currentUserRole={currentUserRole}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedUser(null);
          }}
          onEdit={() => {
            setShowDetailModal(false);
            setShowAddEditModal(true);
          }}
        />
      )}

      {showAddEditModal && (
        <AddEditUserModal
          user={selectedUser}
          companies={companies}
          onClose={() => {
            setShowAddEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {showSuspendModal && selectedUser && (
        <SuspendUserModal
          user={selectedUser}
          onCancel={() => setShowSuspendModal(false)}
          onUpdated={(patch) => {
            setUsers((prev) =>
              prev.map((u) => (u.id === patch.id ? { ...u, ...patch } : u)),
            );
          }}
        />
      )}

      {showResetPasswordModal && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          onCancel={() => {
            setShowResetPasswordModal(false);
            setSelectedUser(null);
          }}
          onConfirm={() => {
            setShowResetPasswordModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
