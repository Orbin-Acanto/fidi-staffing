"use client";

import { AppSelect } from "@/component/ui/Select";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { StaffGroup, StaffRole } from "@/type/staff";

interface StaffFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterRole: string;
  onRoleChange: (value: string) => void;
  filterGroup: string;
  onGroupChange: (value: string) => void;
  filterAvailability?: string;
  onAvailabilityChange?: (value: string) => void;
}

export default function StaffFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterRole,
  onRoleChange,
  filterGroup,
  onGroupChange,
  filterAvailability,
  onAvailabilityChange,
}: StaffFiltersProps) {
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [groups, setGroups] = useState<StaffGroup[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  useEffect(() => {
    fetchRoles();
    fetchGroups();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await apiFetch("/api/roles/list?status=active");
      setRoles(response.roles || []);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await apiFetch("/api/groups/list?is_active=true");
      setGroups(response.groups || []);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
            Search Staff
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
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email, or employee ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     transition-all duration-200"
            />
          </div>
        </div>

        <AppSelect
          label="Status"
          value={filterStatus}
          onValueChange={onStatusChange}
          options={[
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "On Leave", value: "on_leave" },
            { label: "Terminated", value: "terminated" },
          ]}
        />

        <AppSelect
          label="Role"
          value={filterRole}
          onValueChange={onRoleChange}
          placeholder={isLoadingRoles ? "Loading roles..." : "All Roles"}
          disabled={isLoadingRoles}
          options={[
            { label: "All Roles", value: "all" },
            ...roles.map((role) => ({
              label: role.name,
              value: role.id,
            })),
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <AppSelect
          label="Group"
          value={filterGroup}
          onValueChange={onGroupChange}
          placeholder={isLoadingGroups ? "Loading groups..." : "All Groups"}
          disabled={isLoadingGroups}
          options={[
            { label: "All Groups", value: "all" },
            ...groups.map((group) => ({
              label: group.name,
              value: group.id,
            })),
          ]}
        />

        {filterAvailability !== undefined && onAvailabilityChange && (
          <AppSelect
            label="Availability"
            value={filterAvailability}
            onValueChange={onAvailabilityChange}
            options={[
              { label: "All Availability", value: "all" },
              { label: "Available", value: "available" },
              { label: "Unavailable", value: "unavailable" },
              { label: "Busy", value: "busy" },
            ]}
          />
        )}
      </div>
    </div>
  );
}
