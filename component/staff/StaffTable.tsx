"use client";

import { AppCheckbox } from "@/component/ui/Checkbox";
import { StaffMemberBackend } from "@/type/staff";
import Link from "next/link";

interface StaffTableProps {
  staff: StaffMemberBackend[];
  selectedStaff: string[];
  onSelectAll: () => void;
  onSelectStaff: (id: string) => void;
  onViewDetails: (staff: StaffMemberBackend) => void;
  onDelete: (staff: StaffMemberBackend) => void;
  isLoading?: boolean;
}

export default function StaffTable({
  staff,
  selectedStaff,
  onSelectAll,
  onSelectStaff,
  onViewDetails,
  onDelete,
  isLoading = false,
}: StaffTableProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      case "on_leave":
        return "bg-yellow-100 text-yellow-700";
      case "terminated":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusDot = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-400";
      case "on_leave":
        return "bg-yellow-500";
      case "terminated":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case "on_leave":
        return "On Leave";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-primary"
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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <AppCheckbox
                  checked={
                    selectedStaff.length === staff.length && staff.length > 0
                  }
                  onCheckedChange={onSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Staff Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Groups
              </th>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-secondary font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staff.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-gray-900 font-secondary font-medium mb-1">
                      No staff found
                    </p>
                    <p className="text-gray-500 font-secondary text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <AppCheckbox
                      checked={selectedStaff.includes(member.id)}
                      onCheckedChange={() => onSelectStaff(member.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-secondary font-medium text-gray-600">
                            {member.first_name[0]}
                            {member.last_name[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-secondary font-medium text-gray-900">
                          {member.full_name}
                        </p>
                        <p className="text-xs text-gray-500 font-secondary">
                          ID: {member.employee_id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-secondary text-gray-900">
                        {member.email}
                      </p>
                      <p className="text-xs text-gray-500 font-secondary">
                        {member.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {member.primary_role ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium bg-gray-100 text-gray-700">
                        {member.primary_role.name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-secondary">
                        No role
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {member.groups.slice(0, 2).map((group) => (
                        <span
                          key={group.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary bg-gray-100 text-gray-600"
                        >
                          {group.name}
                        </span>
                      ))}
                      {member.groups.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary bg-gray-100 text-gray-600">
                          +{member.groups.length - 2}
                        </span>
                      )}
                      {member.groups.length === 0 && (
                        <span className="text-xs text-gray-400 font-secondary">
                          No groups
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${getStatusColor(
                        member.status,
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(
                          member.status,
                        )}`}
                      />
                      {getStatusLabel(member.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-secondary text-gray-600">
                      {formatDate(member.updated_at)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                        onClick={() => onViewDetails(member)}
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <Link
                        href={`/admin/staff/${member.id}/edit`}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        onClick={() => onDelete(member)}
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
