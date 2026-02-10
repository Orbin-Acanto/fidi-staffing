"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import { employmentTypes, experienceLevels } from "@/data";
import { AppDatePicker } from "@/component/ui/AppDatePicker";
import { AppFileUpload } from "@/component/ui/AppFileUpload";
import { AppSelect } from "@/component/ui/Select";
import { AppCheckbox } from "@/component/ui/Checkbox";
import { apiFetch } from "@/lib/apiFetch";
import { toastSuccess, toastError } from "@/lib/toast";
import { StaffFormData } from "@/type/staff";

type PayType = "hourly" | "fixed";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
];

const relationOptions = [
  { label: "Spouse", value: "Spouse" },
  { label: "Parent", value: "Parent" },
  { label: "Sibling", value: "Sibling" },
  { label: "Child", value: "Child" },
  { label: "Friend", value: "Friend" },
  { label: "Other", value: "Other" },
];

export default function EditStaffPage() {
  const router = useRouter();
  const params = useParams();
  const staffId = params.staff_id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [groups, setGroups] = useState<Array<{ id: string; name: string }>>([]);

  const uniformSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  const [formData, setFormData] = useState<StaffFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    secondaryPhone: "",
    dateOfBirth: "",
    gender: "",
    profilePicture: null,
    profession: "",
    experienceLevel: "Junior",
    employeeId: "",
    startDate: new Date().toISOString().split("T")[0],
    employmentType: "Full-time",
    groups: [],
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    username: "",
    password: "",
    confirmPassword: "",
    status: "Active",
    wage: 16.5,
    payType: "hourly",
    fixedRate: 0,
    uniformSize: "",
    overtimeMultiplier: 1.5,
    taxWithholdingRate: 15.0,
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);

  useEffect(() => {
    fetchRolesAndGroups();
    fetchStaffData();
  }, [staffId]);

  const fetchRolesAndGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const [rolesResponse, groupsResponse] = await Promise.all([
        apiFetch("/api/roles/list?status=active"),
        apiFetch("/api/groups/list?is_active=true"),
      ]);

      setRoles(rolesResponse.roles || []);
      setGroups(groupsResponse.groups || []);
    } catch (error) {
      console.error("Failed to fetch roles and groups:", error);
      toastError("Failed to load roles and groups");
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const mapEmploymentTypeToDisplay = (type: string): string => {
    const typeMap: Record<string, string> = {
      full: "Full-time",
      part: "Part-time",
      contract: "Contract",
      casual: "Casual",
    };
    return typeMap[type] || "Full-time";
  };

  const fetchStaffData = async () => {
    try {
      const response = await apiFetch(`/api/staff/${staffId}`);

      setFormData({
        firstName: response.first_name || "",
        lastName: response.last_name || "",
        email: response.email || "",
        phone: response.phone || "",
        secondaryPhone: response.secondary_phone || "",
        dateOfBirth: response.date_of_birth || "",
        gender: response.gender || "",
        profilePicture: null,
        profession: response.primary_role?.id || "",
        experienceLevel: response.experience_level
          ? response.experience_level.charAt(0).toUpperCase() +
            response.experience_level.slice(1)
          : "Junior",
        employeeId: response.employee_id || "",
        startDate: response.hire_date || "",
        employmentType: response.employment_type
          ? mapEmploymentTypeToDisplay(response.employment_type)
          : "Full-time",
        groups: response.groups?.map((g: any) => String(g.id)) || [],
        street: response.address_street || "",
        city: response.address_city || "",
        state: response.address_state || "",
        zipCode: response.address_zip || "",
        country: response.address_country || "United States",
        emergencyContactName: response.emergency_contact_name || "",
        emergencyContactPhone: response.emergency_contact_phone || "",
        emergencyContactRelation: response.emergency_contact_relation || "",
        username: "",
        password: "",
        confirmPassword: "",
        status: response.status
          ? response.status.charAt(0).toUpperCase() +
            response.status.slice(1).replaceAll("_", " ")
          : "Active",
        wage:
          typeof response.hourly_rate === "number"
            ? response.hourly_rate
            : Number(response.hourly_rate || 0),
        payType: (response.pay_type as PayType) || "hourly",
        fixedRate:
          typeof response.fixed_rate === "number"
            ? response.fixed_rate
            : Number(response.fixed_rate || 0),
        uniformSize: response.uniform_size?.toUpperCase() || "",
        overtimeMultiplier:
          typeof response.overtime_multiplier === "number"
            ? response.overtime_multiplier
            : Number(response.overtime_multiplier || 1.5),
        taxWithholdingRate:
          typeof response.tax_withholding_rate === "number"
            ? response.tax_withholding_rate
            : Number(response.tax_withholding_rate || 15.0),
        notes: response.notes || "",
      });

      if (response.avatar) setCurrentAvatar(response.avatar);
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
      toastError("Failed to load staff data");
      router.push("/admin/staff");
    } finally {
      setIsLoading(false);
    }
  };

  const isPayType = (value: string): value is PayType =>
    value === "hourly" || value === "fixed";

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    const numericFields = new Set([
      "wage",
      "fixedRate",
      "overtimeMultiplier",
      "taxWithholdingRate",
    ]);

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.has(name)
        ? value === ""
          ? 0
          : Number(value)
        : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleToggleGroup = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      groups: prev.groups.includes(groupId)
        ? prev.groups.filter((g) => g !== groupId)
        : [...prev.groups, groupId],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.profession)
      newErrors.profession = "Profession/Role is required";

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (
      formData.payType === "hourly" &&
      (!formData.wage || formData.wage <= 0)
    ) {
      newErrors.wage = "Hourly rate must be greater than 0";
    }
    if (
      formData.payType === "fixed" &&
      (!formData.fixedRate || formData.fixedRate <= 0)
    ) {
      newErrors.fixedRate = "Fixed rate must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toastError("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("first_name", formData.firstName.trim());
      formDataToSend.append("last_name", formData.lastName.trim());
      formDataToSend.append("phone", formData.phone.trim());

      if (formData.secondaryPhone?.trim())
        formDataToSend.append(
          "secondary_phone",
          formData.secondaryPhone.trim(),
        );
      if (formData.dateOfBirth)
        formDataToSend.append("date_of_birth", formData.dateOfBirth);
      if (formData.gender) formDataToSend.append("gender", formData.gender);

      if (formData.profilePicture)
        formDataToSend.append("avatar", formData.profilePicture);

      if (formData.street?.trim())
        formDataToSend.append("address_street", formData.street.trim());
      if (formData.city?.trim())
        formDataToSend.append("address_city", formData.city.trim());
      if (formData.state?.trim())
        formDataToSend.append("address_state", formData.state.trim());
      if (formData.zipCode?.trim())
        formDataToSend.append("address_zip", formData.zipCode.trim());
      if (formData.country)
        formDataToSend.append("address_country", formData.country);

      if (formData.emergencyContactName?.trim())
        formDataToSend.append(
          "emergency_contact_name",
          formData.emergencyContactName.trim(),
        );
      if (formData.emergencyContactPhone?.trim())
        formDataToSend.append(
          "emergency_contact_phone",
          formData.emergencyContactPhone.trim(),
        );
      if (formData.emergencyContactRelation)
        formDataToSend.append(
          "emergency_contact_relation",
          formData.emergencyContactRelation,
        );

      if (formData.profession)
        formDataToSend.append("primary_role", formData.profession);

      formDataToSend.append(
        "experience_level",
        formData.experienceLevel.toLowerCase(),
      );
      formDataToSend.append("pay_type", formData.payType);

      const employmentTypeMap: Record<string, string> = {
        "Full-time": "full",
        "Part-time": "part",
        Contract: "contract",
        Casual: "casual",
      };
      formDataToSend.append(
        "employment_type",
        employmentTypeMap[formData.employmentType] || "full",
      );

      if (formData.uniformSize)
        formDataToSend.append(
          "uniform_size",
          formData.uniformSize.toLowerCase(),
        );

      if (formData.payType === "hourly")
        formDataToSend.append("hourly_rate", String(formData.wage));
      if (formData.payType === "fixed")
        formDataToSend.append("fixed_rate", String(formData.fixedRate));

      formDataToSend.append(
        "overtime_multiplier",
        String(formData.overtimeMultiplier),
      );
      formDataToSend.append(
        "tax_withholding_rate",
        String(formData.taxWithholdingRate),
      );

      formData.groups.forEach((groupId) =>
        formDataToSend.append("groups", groupId),
      );

      const normalizedStatus = formData.status
        .toLowerCase()
        .replaceAll(" ", "_");
      formDataToSend.append("status", normalizedStatus);

      if (formData.startDate)
        formDataToSend.append("hire_date", formData.startDate);

      if (formData.password)
        formDataToSend.append("password", formData.password);

      if (formData.notes?.trim())
        formDataToSend.append("notes", formData.notes.trim());

      const response = await fetch(`/api/staff/${staffId}/update`, {
        method: "PATCH",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const backendErrors: Record<string, string> = {};
          Object.keys(data.errors).forEach((key) => {
            const fieldMap: Record<string, string> = {
              first_name: "firstName",
              last_name: "lastName",
              email: "email",
              phone: "phone",
              secondary_phone: "secondaryPhone",
              hourly_rate: "wage",
              fixed_rate: "fixedRate",
              pay_type: "payType",
              primary_role: "profession",
              date_of_birth: "dateOfBirth",
              address_street: "street",
              address_city: "city",
              address_state: "state",
              address_zip: "zipCode",
              emergency_contact_name: "emergencyContactName",
              emergency_contact_phone: "emergencyContactPhone",
              emergency_contact_relation: "emergencyContactRelation",
            };

            const frontendKey = fieldMap[key] || key;
            backendErrors[frontendKey] = Array.isArray(data.errors[key])
              ? data.errors[key][0]
              : data.errors[key];
          });
          setErrors(backendErrors);
        }

        throw new Error(data.message || "Failed to update staff member");
      }

      toastSuccess(data.message || "Staff member updated successfully!");
      router.push("/admin/staff");
    } catch (err: any) {
      toastError(
        err.message || "Failed to update staff member. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="animate-spin h-12 w-12 text-primary"
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-primary font-semibold text-gray-900">
            Edit Staff Member
          </h1>
          <p className="text-sm font-secondary text-gray-600 mt-1">
            Update staff member information
          </p>
        </div>
        <Link
          href="/admin/staff"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Staff List
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.firstName
                             ? "border-red-500"
                             : "border-gray-300"
                         }`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.lastName
                             ? "border-red-500"
                             : "border-gray-300"
                         }`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black bg-gray-50 cursor-not-allowed"
                placeholder="email@example.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.phone ? "border-red-500" : "border-gray-300"
                         }`}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Secondary Phone
              </label>
              <input
                type="tel"
                name="secondaryPhone"
                value={formData.secondaryPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <AppSelect
                label="Gender"
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: value as any,
                  }))
                }
                placeholder="Select gender"
                options={genderOptions}
              />
            </div>

            <AppDatePicker
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(ymd) =>
                setFormData((prev) => ({
                  ...prev,
                  dateOfBirth: ymd,
                }))
              }
            />

            <div>
              <AppFileUpload
                label="Profile Picture"
                onChange={(file) => {
                  setFormData((prev) => ({
                    ...prev,
                    profilePicture: file,
                  }));
                }}
              />
              {currentAvatar && !formData.profilePicture && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Current photo:</p>
                  <img
                    src={currentAvatar}
                    alt="Current avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Professional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AppSelect
                label={
                  <>
                    Profession/Role <span className="text-red-500">*</span>
                  </>
                }
                value={formData.profession}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    profession: value,
                  }));
                  if (errors.profession) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.profession;
                      return newErrors;
                    });
                  }
                }}
                placeholder="Select profession"
                options={roles.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))}
              />
              {errors.profession && (
                <p className="mt-1 text-sm text-red-500">{errors.profession}</p>
              )}
            </div>

            <div>
              <AppSelect
                label="Experience Level"
                value={formData.experienceLevel}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    experienceLevel: value,
                  }))
                }
                placeholder="Select experience level"
                options={experienceLevels.map((level) => ({
                  label: level,
                  value: level,
                }))}
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Employment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                disabled
                value={formData.employeeId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Auto-generated"
              />
            </div>

            <div>
              <AppDatePicker
                label={
                  <>
                    Start Date <span className="text-red-500">*</span>
                  </>
                }
                value={formData.startDate}
                onChange={(ymd) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: ymd,
                  }))
                }
              />
            </div>

            <div>
              <AppSelect
                label="Employment Type"
                value={formData.employmentType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    employmentType: value,
                  }))
                }
                placeholder="Select employment type"
                options={employmentTypes.map((type) => ({
                  label: type,
                  value: type,
                }))}
              />
            </div>

            <div>
              <AppSelect
                label="Uniform Size"
                value={formData.uniformSize || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    uniformSize: value,
                  }))
                }
                placeholder="Select uniform size"
                options={uniformSizes.map((size) => ({
                  label: size,
                  value: size,
                }))}
              />
            </div>

            <div>
              <AppSelect
                label="Pay Type"
                value={formData.payType}
                onValueChange={(value) => {
                  if (!isPayType(value)) return;

                  setFormData((prev) => ({
                    ...prev,
                    payType: value,
                  }));
                }}
                placeholder="Select pay type"
                options={[
                  { label: "Hourly", value: "hourly" },
                  { label: "Fixed Salary", value: "fixed" },
                ]}
              />
            </div>

            {formData.payType === "hourly" && (
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Hourly Pay Rate <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="wage"
                  step="0.01"
                  min="0"
                  value={formData.wage}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
               transition-all duration-200 ${
                 errors.wage ? "border-red-500" : "border-gray-300"
               }`}
                  placeholder="Enter hourly wage rate"
                />
                {errors.wage && (
                  <p className="mt-1 text-sm text-red-500">{errors.wage}</p>
                )}
              </div>
            )}

            {formData.payType === "fixed" && (
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Fixed Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="fixedRate"
                  step="0.01"
                  min="0"
                  value={formData.fixedRate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
               transition-all duration-200 ${
                 errors.fixedRate ? "border-red-500" : "border-gray-300"
               }`}
                  placeholder="Enter fixed salary amount"
                />
                {errors.fixedRate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.fixedRate}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Overtime Multiplier
              </label>
              <input
                type="number"
                name="overtimeMultiplier"
                step="0.1"
                min="1"
                max="3"
                value={formData.overtimeMultiplier}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="1.5"
              />
              <p className="mt-1 text-xs text-gray-500">
                Multiplier for overtime pay (default: 1.5x)
              </p>
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Tax Withholding Rate (%)
              </label>
              <input
                type="number"
                name="taxWithholdingRate"
                step="0.01"
                min="0"
                max="100"
                value={formData.taxWithholdingRate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="15.00"
              />
              <p className="mt-1 text-xs text-gray-500">
                Tax withholding percentage (default: 15%)
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Group Assignment
              </label>
              {isLoadingGroups ? (
                <div className="border border-gray-300 rounded-lg p-4 text-center text-gray-500">
                  Loading groups...
                </div>
              ) : groups.length === 0 ? (
                <div className="border border-gray-300 rounded-lg p-4 text-center text-amber-600">
                  No groups available. Groups are optional.
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {groups.map((group) => (
                    <label
                      key={group.id}
                      className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                    >
                      <AppCheckbox
                        checked={formData.groups.includes(group.id)}
                        onCheckedChange={() => handleToggleGroup(group.id)}
                      />
                      <span className="text-sm font-secondary text-gray-700">
                        {group.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Farmingdale"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="NY"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="10001"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                disabled
                value={formData.country}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <AppSelect
                label="Relationship"
                value={formData.emergencyContactRelation}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergencyContactRelation: value,
                  }))
                }
                placeholder="Select relationship"
                options={relationOptions}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AppSelect
                label="Account Status"
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                  { label: "On Leave", value: "On Leave" },
                ]}
              />
            </div>

            <div></div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.password
                             ? "border-red-500"
                             : "border-gray-300"
                         }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.confirmPassword
                             ? "border-red-500"
                             : "border-gray-300"
                         }`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Additional Notes
          </h2>
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       transition-all duration-200"
              placeholder="Add any additional notes about this staff member..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/staff"
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-white font-secondary font-semibold rounded-lg cursor-pointer
                     hover:bg-[#e0c580] transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transform hover:scale-105 active:scale-95"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
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
                Updating Staff...
              </span>
            ) : (
              "Update Staff Member"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
