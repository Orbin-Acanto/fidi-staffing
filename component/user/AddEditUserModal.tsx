"use client";
import { User, UserRole, UserStatus, defaultPermissionsByRole } from "@/type";
import { useState, useEffect } from "react";
import { AppSelect } from "../ui/Select";

interface AddEditUserModalProps {
  user?: User | null;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
}

export default function AddEditUserModal({
  user,
  onClose,
  onSave,
}: AddEditUserModalProps) {
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Manager" as UserRole,
    status: "Active" as UserStatus,
    department: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "Manager",
        status: user.status || "Active",
        department: user.department || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        id: user?.id || `user_${Date.now()}`,
        permissions:
          user?.permissions || defaultPermissionsByRole[formData.role],
        createdAt: user?.createdAt || new Date().toISOString().split("T")[0],
      });
    }
  };

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
                    : "Enter the user information below"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., John Smith"
                  className={`w-full px-4 py-2 border rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           transition-all duration-200 ${
                             errors.name ? "border-red-500" : "border-gray-300"
                           }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
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
                  placeholder="e.g., john@company.com"
                  className={`w-full px-4 py-2 border rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           transition-all duration-200 ${
                             errors.email ? "border-red-500" : "border-gray-300"
                           }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., +1 (212) 555-0123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g., Operations"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200"
                  />
                </div>
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Deactivated">Deactivated</option>
                  </select>
                </div>
              )}

              {!isEditing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-secondary font-medium text-blue-800">
                        Default Permissions
                      </p>
                      <p className="text-sm text-blue-700">
                        The user will receive default permissions based on their
                        role. You can customize permissions after creating the
                        user.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 font-secondary font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-secondary font-medium rounded-lg hover:bg-primary/90 transition-colors"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {isEditing ? "Save Changes" : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
