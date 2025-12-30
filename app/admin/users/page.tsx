"use client";
import { useState } from "react";
import { AppSelect } from "@/component/ui/Select";
import { users as initialUsers, activityLogs } from "@/data";
import { User, UserPermissions, UserRole } from "@/type";
import UserHeader from "@/component/user/UserHeader";
import UserSummaryPanel from "@/component/user/UserSummaryPanel";
import UserTableView from "@/component/user/UserTableView";
import ActivityLogPanel from "@/component/user/ActivityLogPanel";
import UserDetailModal from "@/component/user/UserDetailModal";
import AddEditUserModal from "@/component/user/AddEditUserModal";
import PermissionsModal from "@/component/user/PermissionsModal";
import SuspendUserModal from "@/component/user/SuspendUserModal";
import ResetPasswordModal from "@/component/user/ResetPasswordModal";

export default function UserManagementPage() {
  const currentUserRole: UserRole = "Admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "Admin").length;
  const managerCount = users.filter((u) => u.role === "Manager").length;
  const staffCount = users.filter((u) => u.role === "Staff").length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const suspendedUsers = users.filter((u) => u.status === "Suspended").length;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSaveUser = (data: Partial<User>) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...data } : u))
      );
    } else {
      setUsers((prev) => [...prev, data as User]);
    }
    setShowAddEditModal(false);
    setSelectedUser(null);
  };

  const handleSavePermissions = (
    userId: string,
    permissions: UserPermissions
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, permissions } : u))
    );
    setShowPermissionsModal(false);
    setSelectedUser(null);
  };

  const handleSuspendAction = (
    action: "suspend" | "activate" | "deactivate"
  ) => {
    if (!selectedUser) return;

    const newStatus =
      action === "suspend"
        ? "Suspended"
        : action === "deactivate"
        ? "Deactivated"
        : "Active";

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, status: newStatus } : u
      )
    );
    setShowSuspendModal(false);
    setSelectedUser(null);
  };

  const handleResetPassword = () => {
    console.log("Password reset for:", selectedUser?.email);
    setShowResetPasswordModal(false);
    setSelectedUser(null);
  };

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
        suspendedUsers={suspendedUsers}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-primary font-semibold text-gray-900 mb-4">
              All Users
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  label="Status"
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value)}
                  options={[
                    { label: "All Status", value: "all" },
                    { label: "Active", value: "Active" },
                    { label: "Suspended", value: "Suspended" },
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
            onOpenPermissions={(user) => {
              setSelectedUser(user);
              setShowPermissionsModal(true);
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
          onClose={() => {
            setShowAddEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {showPermissionsModal && selectedUser && (
        <PermissionsModal
          user={selectedUser}
          currentUserRole={currentUserRole}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSavePermissions}
        />
      )}

      {showSuspendModal && selectedUser && (
        <SuspendUserModal
          user={selectedUser}
          onCancel={() => {
            setShowSuspendModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleSuspendAction}
        />
      )}

      {showResetPasswordModal && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          onCancel={() => {
            setShowResetPasswordModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleResetPassword}
        />
      )}
    </div>
  );
}
