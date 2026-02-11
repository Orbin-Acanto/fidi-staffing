"use client";

import { useEffect } from "react";
import { AppCheckbox } from "../ui/Checkbox";
import { AppTimePicker } from "../ui/AppTimePicker";
import { EventRoleRequirement } from "@/type/events";

interface Role {
  id: string;
  name: string;
  color: string;
  default_pay_type: string;
  hourly_rate: number | null;
  fixed_rate: number | null;
}

interface StaffGroup {
  id: string;
  name: string;
}

interface EventStaffingSectionProps {
  roles: Role[];
  requirements: EventRoleRequirement[];
  onRequirementsChange: (requirements: EventRoleRequirement[]) => void;
  eventStartTime?: string;
  eventEndTime?: string;
  autoAssign: boolean;
  onAutoAssignChange: (value: boolean) => void;
  assignedGroups: string[];
  availableGroups: StaffGroup[];
  onToggleGroup: (groupId: string) => void;
}

export default function EventStaffingSection({
  roles,
  requirements,
  onRequirementsChange,
  eventStartTime,
  eventEndTime,
  autoAssign,
  onAutoAssignChange,
  assignedGroups,
  availableGroups,
  onToggleGroup,
}: EventStaffingSectionProps) {
  const activeRoles = roles.filter((r) => r);

  useEffect(() => {
    if (requirements.length === 0 && activeRoles.length > 0) {
      const initialRequirements: EventRoleRequirement[] = activeRoles.map(
        (role) => {
          const defaultRate =
            role.default_pay_type === "hourly"
              ? role.hourly_rate || 0
              : role.fixed_rate || 0;

          return {
            id: role.id,
            roleId: role.id,
            roleName: role.name,
            roleColor: role.color,
            payType: role.default_pay_type as "hourly" | "fixed",
            defaultRate: defaultRate,
            eventRate: defaultRate,
            startTime: eventStartTime || "",
            endTime: eventEndTime || "",
            staffCount: 0,
            estimatedHours: 0,
            estimatedCost: 0,
            notes: "",
          };
        },
      );
      onRequirementsChange(initialRequirements);
    }
  }, [activeRoles, requirements.length, onRequirementsChange]);

  useEffect(() => {
    if (requirements.length > 0 && eventStartTime && eventEndTime) {
      const hasEmptyTimes = requirements.some(
        (req) => !req.startTime || !req.endTime,
      );

      if (hasEmptyTimes) {
        const updated = requirements.map((req) => {
          if (!req.startTime || !req.endTime) {
            const hours = calculateHours(eventStartTime, eventEndTime);
            const estimatedHours = hours * req.staffCount;
            const estimatedCost =
              req.payType === "hourly"
                ? estimatedHours * req.eventRate
                : req.staffCount * req.eventRate;

            return {
              ...req,
              startTime: eventStartTime,
              endTime: eventEndTime,
              estimatedHours,
              estimatedCost,
            };
          }
          return req;
        });

        onRequirementsChange(updated);
      }
    }
  }, [eventStartTime, eventEndTime]);

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0;

    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    let hours = endHour - startHour;
    let mins = endMin - startMin;

    if (mins < 0) {
      hours -= 1;
      mins += 60;
    }

    if (hours < 0) {
      hours += 24;
    }

    return hours + mins / 60;
  };

  const updateRequirement = (
    roleId: string,
    field: keyof EventRoleRequirement,
    value: string | number,
  ) => {
    const updated = requirements.map((req) => {
      if (req.roleId !== roleId) return req;

      const updatedReq = { ...req, [field]: value };

      const hours = calculateHours(updatedReq.startTime, updatedReq.endTime);
      updatedReq.estimatedHours = hours * updatedReq.staffCount;

      if (updatedReq.payType === "hourly") {
        updatedReq.estimatedCost =
          updatedReq.estimatedHours * updatedReq.eventRate;
      } else {
        updatedReq.estimatedCost = updatedReq.staffCount * updatedReq.eventRate;
      }

      return updatedReq;
    });

    onRequirementsChange(updated);
  };

  const applyEventTimesToAll = () => {
    if (!eventStartTime || !eventEndTime) return;

    const updated = requirements.map((req) => {
      const hours = calculateHours(eventStartTime, eventEndTime);
      const estimatedHours = hours * req.staffCount;
      const estimatedCost =
        req.payType === "hourly"
          ? estimatedHours * req.eventRate
          : req.staffCount * req.eventRate;

      return {
        ...req,
        startTime: eventStartTime,
        endTime: eventEndTime,
        estimatedHours,
        estimatedCost,
      };
    });

    onRequirementsChange(updated);
  };

  const resetToDefaultRate = (roleId: string) => {
    const req = requirements.find((r) => r.roleId === roleId);
    if (req) {
      updateRequirement(roleId, "eventRate", req.defaultRate);
    }
  };

  const totalStaff = requirements.reduce((sum, r) => sum + r.staffCount, 0);
  const totalHours = requirements.reduce((sum, r) => sum + r.estimatedHours, 0);
  const totalCost = requirements.reduce((sum, r) => sum + r.estimatedCost, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-primary font-semibold text-gray-900">
            Staffing Requirements
          </h2>
          <p className="text-sm text-gray-500 font-secondary mt-1">
            Configure roles, times, and pay rates for this event
          </p>
        </div>

        <div className="flex items-center gap-4">
          {eventStartTime && eventEndTime && (
            <button
              type="button"
              onClick={applyEventTimesToAll}
              className="text-sm font-secondary text-primary hover:text-primary/80 transition-colors underline"
            >
              Apply event times to all
            </button>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <AppCheckbox
              checked={autoAssign}
              onCheckedChange={(checked) =>
                onAutoAssignChange(Boolean(checked))
              }
            />
            <span className="text-sm font-secondary text-gray-700">
              Auto-assign staff
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-blue-600 font-secondary mb-1">
            Total Staff
          </p>
          <p className="text-2xl font-primary font-bold text-blue-700">
            {totalStaff}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-xs text-purple-600 font-secondary mb-1">
            Total Hours
          </p>
          <p className="text-2xl font-primary font-bold text-purple-700">
            {totalHours.toFixed(1)}h
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-green-600 font-secondary mb-1">
            Est. Cost
          </p>
          <p className="text-2xl font-primary font-bold text-green-700">
            {formatCurrency(totalCost)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {requirements.map((req) => {
          const role = roles.find((r) => r.id === req.roleId);
          const isModifiedRate = req.eventRate !== req.defaultRate;
          const hasStaff = req.staffCount > 0;

          return (
            <div
              key={req.roleId}
              className={`border rounded-lg overflow-hidden transition-all ${
                hasStaff
                  ? "border-primary/30 bg-primary/5"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div
                className="h-1"
                style={{ backgroundColor: role?.color || "#6B7280" }}
              />

              <div className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-3 lg:w-48 shrink-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-primary font-bold"
                      style={{ backgroundColor: role?.color || "#6B7280" }}
                    >
                      {req.roleName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-secondary font-semibold text-gray-900">
                        {req.roleName}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {req.payType} rate
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div>
                      <AppTimePicker
                        label="Start Time"
                        value={req.startTime}
                        onChange={(time) =>
                          updateRequirement(req.roleId, "startTime", time)
                        }
                      />
                    </div>

                    <div>
                      <AppTimePicker
                        label="End Time"
                        value={req.endTime}
                        onChange={(time) =>
                          updateRequirement(req.roleId, "endTime", time)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                        Rate {req.payType === "hourly" ? "(/hr)" : "(fixed)"}
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          value={req.eventRate}
                          onChange={(e) =>
                            updateRequirement(
                              req.roleId,
                              "eventRate",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          min="0"
                          step="0.5"
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg font-secondary
                                      focus:outline-none focus:ring-2 focus:ring-primary text-black
                                      ${
                                        isModifiedRate
                                          ? "border-orange-300 bg-orange-50"
                                          : "border-gray-300"
                                      }`}
                        />
                      </div>
                      {isModifiedRate && (
                        <button
                          type="button"
                          onClick={() => resetToDefaultRate(req.roleId)}
                          className="text-[10px] text-orange-600 hover:text-orange-700 mt-0.5 underline"
                        >
                          Reset to {formatCurrency(req.defaultRate)}
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                        Staff Needed
                      </label>
                      <input
                        type="number"
                        value={req.staffCount || ""}
                        onChange={(e) =>
                          updateRequirement(
                            req.roleId,
                            "staffCount",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        min="0"
                        placeholder="0"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg font-secondary focus:outline-none focus:ring-2 focus:ring-primary text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                        Est. Hours
                      </label>
                      <div className="px-4 py-2 text-sm font-secondary bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                        {req.estimatedHours.toFixed(1)}h
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                        Est. Cost
                      </label>
                      <div
                        className={`px-4 py-2 text-sm font-secondary font-semibold rounded-lg ${
                          req.estimatedCost > 0
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : "bg-gray-50 border border-gray-200 text-gray-400"
                        }`}
                      >
                        {formatCurrency(req.estimatedCost)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {requirements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-300"
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
          <p className="font-secondary">No active roles found.</p>
          <p className="text-sm">
            Please add roles in the Roles section first.
          </p>
        </div>
      )}

      {requirements.length > 0 && totalStaff > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm font-secondary">
              <span className="text-gray-500">
                <span className="font-semibold text-gray-900">
                  {totalStaff}
                </span>{" "}
                staff
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">
                <span className="font-semibold text-gray-900">
                  {totalHours.toFixed(1)}
                </span>{" "}
                total hours
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">
                <span className="font-semibold text-green-600">
                  {formatCurrency(totalCost)}
                </span>{" "}
                estimated cost
              </span>
            </div>
          </div>
        </div>
      )}

      {availableGroups.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <label className="block text-sm font-secondary font-medium text-gray-700 mb-3">
            Assign Groups (Optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableGroups.map((group) => (
              <label
                key={group.id}
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  assignedGroups.includes(group.id)
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <AppCheckbox
                  checked={assignedGroups.includes(group.id)}
                  onCheckedChange={() => onToggleGroup(group.id)}
                />
                <span className="text-sm font-secondary text-gray-700">
                  {group.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
