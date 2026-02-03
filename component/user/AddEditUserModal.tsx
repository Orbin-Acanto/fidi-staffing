"use client";

import { CompaniesResponse, User, UserRole, UserStatus } from "@/type";
import { useState, useEffect, useMemo } from "react";
import { AppSelect } from "../ui/Select";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";

interface AddEditUserModalProps {
  user?: User | null;
  companies: CompaniesResponse;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
  currentUserId: string | null;
  currentUserRole: UserRole;
}

type InviteResponse = {
  message?: string;
  invitation?: {
    id: string;
    email: string;
    role: string;
    token: string;
    invitation_link: string;
    expires_at: string;
  };
};

export default function AddEditUserModal({
  user,
  companies,
  onClose,
  onSave,
  currentUserId,
  currentUserRole,
}: AddEditUserModalProps) {
  const isEditing = !!user;

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    message: string;
    companyId: string | undefined;
  }>({
    name: "",
    email: "",
    phone: "",
    role: "Manager",
    status: "Active",
    message: "",
    companyId: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizeRole = (role: UserRole | string | null | undefined) =>
    String(role || "")
      .trim()
      .toLowerCase();

  const meRole = normalizeRole(currentUserRole);
  const isOwner = meRole === "owner";
  const isSelf = !!user && !!currentUserId && user.id === currentUserId;

  const canChangeCompany = isEditing && isOwner && !isSelf;
  const canChangeRole = isEditing && isOwner && !isSelf;
  const canChangeStatus = isEditing && isOwner && !isSelf;

  const statusOptions: { label: string; value: UserStatus }[] = [
    { label: "Active", value: "Active" },
    { label: "Deactivated", value: "Deactivated" },
  ];

  const companyExists = useMemo(() => {
    return (
      !!formData.companyId &&
      (companies?.companies || []).some((c) => c.id === formData.companyId)
    );
  }, [companies, formData.companyId]);

  const companySelectValue = companyExists ? formData.companyId : "";

  const companyPlaceholder = companyExists
    ? "Select…"
    : user?.company || "Select…";

  const normalizedStatus = useMemo<UserStatus>(() => {
    const raw = String(formData.status ?? "")
      .trim()
      .toLowerCase();

    return raw === "active" ? "Active" : "Deactivated";
  }, [formData.status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const apiRole = useMemo(() => {
    return formData.role === "Admin" ? "admin" : "manager";
  }, [formData.role]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function updateUser() {
    setIsSubmitting(true);

    try {
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || nameParts[0] || "";

      await apiFetch(`/api/users/${user!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone?.trim() || null,
          role: apiRole,
          current_company: formData.companyId || null,
          is_active: normalizedStatus === "Active",
        }),
      });

      toastSuccess("User updated successfully!");

      const selectedCompany = companies?.companies?.find(
        (c) => c.id === formData.companyId,
      );

      onSave({
        id: user!.id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        role: formData.role,
        status: normalizedStatus,
        company: selectedCompany?.name,
        companyId: formData.companyId,
        createdAt: user?.createdAt || new Date().toISOString().split("T")[0],
      });

      onClose();
    } catch (err) {
      toastError(err, "Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function inviteUser() {
    setIsSubmitting(true);

    try {
      const res = (await apiFetch("/api/auth/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          role: apiRole,
          message: formData.message?.trim() || "",
        }),
      })) as InviteResponse;

      const link = res?.invitation?.invitation_link;

      toastSuccess("Invitation sent successfully!");

      const selectedCompany = companies?.companies?.find(
        (c) => c.id === formData.companyId,
      );

      onSave({
        id: `invite_${Date.now()}`,
        name: formData.name.trim() || "Invited User",
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        status: "Active",
        company: selectedCompany?.name,
        companyId: formData.companyId,
        createdAt: new Date().toISOString().split("T")[0],
      });

      onClose();
    } catch (err) {
      toastError(err, "Failed to send invitation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEditing) {
      await updateUser();
    } else {
      await inviteUser();
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role,
        status: user.status || "Active",
        message: "",
        companyId: user.companyId || undefined,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "Manager",
        status: "Active",
        message: "",
        companyId: undefined,
      });
    }
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-700/70 transition-opacity"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-lg my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-primary font-bold text-gray-900">
                  {isEditing ? "Edit User" : "Add New User"}
                </h2>
                <p className="text-sm font-secondary text-gray-500">
                  {isEditing
                    ? "Update the user details"
                    : "Invite a user to join your tenant"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g., John Smith"
                    className={`w-full px-4 py-2 border rounded-lg font-secondary text-sm text-gray-900
                              placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                              transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                                errors.name
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <AppSelect
                    label="Role"
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        role: value as UserRole,
                      }))
                    }
                    options={[
                      { label: "Manager", value: "Manager" },
                      { label: "Admin", value: "Admin" },
                    ]}
                    disabled={isSubmitting || (isEditing && !canChangeRole)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g., john@company.com"
                  className={`w-full px-4 py-2 border rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                             errors.email ? "border-red-500" : "border-gray-300"
                           }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g., +1 (212) 555-0123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              )}

              {isEditing && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <AppSelect
                      label="Company"
                      value={companySelectValue}
                      placeholder={companyPlaceholder}
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, companyId: value }));
                      }}
                      options={(companies?.companies || []).map((company) => ({
                        label: company.name,
                        value: company.id,
                      }))}
                      disabled={isSubmitting || !canChangeCompany}
                    />
                  </div>

                  <div>
                    <AppSelect
                      label="Status"
                      value={normalizedStatus}
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          status: value as UserStatus,
                        }));
                      }}
                      options={statusOptions}
                      disabled={isSubmitting || !canChangeStatus}
                    />
                  </div>
                </div>
              )}

              {!isEditing && (
                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    Invitation Message (optional)
                  </label>
                  <input
                    type="text"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g., Welcome to the team!"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 font-secondary font-medium hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-secondary font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
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
                    {isEditing ? "Updating..." : "Sending..."}
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {isEditing ? "Save Changes" : "Send Invitation"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
