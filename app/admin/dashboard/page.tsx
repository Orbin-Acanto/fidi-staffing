"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StatCard from "@/component/admin/Statcard";

import { apiFetch } from "@/lib/apiFetch";
import { toastError } from "@/lib/toast";
import { safeStr } from "@/lib/utils";
import QuickActionCard from "@/component/admin/Quickactioncard";
import { AUDIT_FILTERS, quickActions, severityColor } from "@/data";
import {
  AuditFilterValue,
  AuditLogItem,
  EventItem,
  Paginated,
  PendingContractsResponse,
  StaffItem,
  VendorItem,
} from "@/type/dashboard";
import {
  formatDate,
  formatTime,
  getActionIconPath,
  readinessLabel,
  timeAgo,
} from "@/utils";
import { AppSelect } from "@/component/ui/Select";
import { useCompany } from "@/component/context/CompanyContext";

export default function AdminDashboard() {
  const { companyVersion } = useCompany();
  const [loading, setLoading] = useState(false);

  const [staffCount, setStaffCount] = useState(0);
  const [activeStaffCount, setActiveStaffCount] = useState(0);

  const [vendorCount, setVendorCount] = useState(0);
  const [activeVendorCount, setActiveVendorCount] = useState(0);

  const [eventCount, setEventCount] = useState(0);
  const [events, setEvents] = useState<EventItem[]>([]);

  const [pendingContractsTotal, setPendingContractsTotal] = useState(0);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditFilter, setAuditFilter] = useState<AuditFilterValue>("all");

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [staffRes, vendorRes, eventsRes, pendingRes] = await Promise.all([
        apiFetch("/api/staff/list?page=1&page_size=200"),
        apiFetch("/api/vendors/list?page=1&page_size=200"),
        apiFetch("/api/events/list?page=1&page_size=200"),
        apiFetch("/api/contracts/?status=pending_signature&page=1&page_size=1"),
      ]);

      const staff = staffRes as Paginated<StaffItem>;
      const vendors = vendorRes as Paginated<VendorItem>;
      const eventsPayload = eventsRes as Paginated<EventItem>;
      const pending = pendingRes as PendingContractsResponse;

      const staffResults = Array.isArray(staff?.results) ? staff.results : [];
      const vendorResults = Array.isArray(vendors?.results)
        ? vendors.results
        : [];
      const eventResults = Array.isArray(eventsPayload?.results)
        ? eventsPayload.results
        : [];

      setStaffCount(staff?.count ?? staffResults.length);
      setActiveStaffCount(
        staffResults.filter((s) => safeStr(s.status) === "active").length,
      );

      setVendorCount(vendors?.count ?? vendorResults.length);
      setActiveVendorCount(
        vendorResults.filter((v) => safeStr(v.status) === "active").length,
      );

      setEventCount(eventsPayload?.count ?? eventResults.length);

      const sortedEvents = [...eventResults].sort((a, b) => {
        const da = new Date(safeStr(a.event_date)).getTime();
        const db = new Date(safeStr(b.event_date)).getTime();
        return da - db;
      });

      setEvents(sortedEvents);
      setPendingContractsTotal(Number(pending?.total || 0));
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async (filter: AuditFilterValue) => {
    setAuditLoading(true);
    try {
      const filterConfig = AUDIT_FILTERS.find((f) => f.value === filter);
      const filterParams = filterConfig?.params ?? {};

      const params = new URLSearchParams();
      params.append("page_size", "15");

      if (filter === "all") {
        params.append(
          "action__in",
          [
            "create",
            "update",
            "delete",
            "restore",
            "staff_assigned",
            "staff_unassigned",
            "clock_in",
            "clock_out",
            "event_published",
            "event_cancelled",
            "company_created",
            "company_updated",
            "company_disabled",
            "contract_created",
            "contract_signed",
            "payroll_created",
            "payroll_approved",
            "payroll_paid",
            "invite_sent",
            "invite_accepted",
          ].join(","),
        );
      }

      Object.entries(filterParams).forEach(([key, val]) => {
        params.append(key, String(val));
      });

      const res = (await apiFetch(
        `/api/audit-logs?${params.toString()}`,
      )) as Paginated<AuditLogItem>;

      setAuditLogs(Array.isArray(res?.results) ? res.results : []);
    } catch (e: any) {
      console.error("Failed to load audit logs:", e);
      setAuditLogs([]);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadAuditLogs("all");
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [companyVersion]);

  useEffect(() => {
    loadAuditLogs(auditFilter);
  }, [auditFilter]);

  const statCards = useMemo(() => {
    return [
      {
        title: "Total Staff",
        value: staffCount,
        subtitle: activeStaffCount ? `${activeStaffCount} active` : undefined,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
      },
      {
        title: "Vendors",
        value: vendorCount,
        subtitle: activeVendorCount ? `${activeVendorCount} active` : undefined,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7h18M5 7l1 14h12l1-14M9 7V5a3 3 0 016 0v2"
            />
          </svg>
        ),
      },
      {
        title: "Events",
        value: eventCount,
        subtitle: events.length
          ? `Next: ${formatDate(safeStr(events[0]?.event_date))}`
          : "No events",
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        title: "Pending Signatures",
        value: pendingContractsTotal,
        subtitle: pendingContractsTotal
          ? "Contracts awaiting signature"
          : "None right now",
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V7l-5-5H8a2 2 0 00-2 2v16a2 2 0 002 2z"
            />
          </svg>
        ),
      },
    ];
  }, [
    staffCount,
    activeStaffCount,
    vendorCount,
    activeVendorCount,
    eventCount,
    events,
    pendingContractsTotal,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-primary font-bold text-gray-900">
          Overview
        </h1>
        <p className="text-sm font-secondary text-gray-600 mt-1">
          Track upcoming events, manage staff assignments, and stay on top of
          operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            subtitle={s.subtitle}
            icon={s.icon}
          />
        ))}
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-primary font-semibold text-primary">
                Upcoming Events
              </h2>
              <Link
                href="/admin/events"
                className="text-sm text-primary hover:text-[#e0c580] font-secondary font-medium"
              >
                View All
              </Link>
            </div>

            <div className="max-h-[420px] overflow-y-auto space-y-4">
              {events.length === 0 ? (
                <div className="text-sm text-gray-500 font-secondary">
                  No events found
                </div>
              ) : (
                events.map((event) => {
                  const when = formatDate(safeStr(event.event_date));
                  const where = safeStr(event.location_name) || "Location";
                  const { label, ok } = readinessLabel(event);
                  const needed = Number(event.total_staff_needed || 0);
                  const filled = Number(event.total_staff_filled || 0);

                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
                    >
                      <div className="shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-secondary font-semibold text-gray-900 mb-1">
                          {safeStr(event.name) || "Event"}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-gray-600 font-secondary">
                          <span className="flex items-center gap-1">
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {when}
                            {event.start_time && event.end_time
                              ? ` • ${formatTime(safeStr(event.start_time))} to ${formatTime(
                                  safeStr(event.end_time),
                                )}`
                              : ""}
                          </span>

                          <span className="flex items-center gap-1">
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
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                            </svg>
                            {where}
                          </span>
                        </div>

                        {safeStr(event.location_address) ? (
                          <div className="text-xs text-gray-500 font-secondary mt-1">
                            {safeStr(event.location_address)}
                          </div>
                        ) : null}

                        <div className="flex items-center gap-2 mt-2">
                          <span className="flex items-center gap-1 text-sm text-gray-600 font-secondary">
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
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                            {filled}/{needed} staff
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold font-secondary ${
                              ok
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {label}
                          </span>

                          {safeStr(event.status_display) ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-secondary bg-gray-100 text-gray-700">
                              {safeStr(event.status_display)}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="text-gray-400 hover:text-primary transition-colors"
                        aria-label="View event"
                        title="View"
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-primary font-semibold text-gray-900">
                  Recent Activity
                </h2>
              </div>

              <div className="mt-3">
                <AppSelect
                  label="Audit Filter"
                  value={auditFilter}
                  onValueChange={(value) =>
                    setAuditFilter(value as AuditFilterValue)
                  }
                  options={AUDIT_FILTERS.map((option) => ({
                    label: `${option.label} Activity`,
                    value: option.value,
                  }))}
                />
              </div>
            </div>

            <div className="max-h-[375px] overflow-y-auto">
              {auditLoading ? (
                <div className="px-6 py-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 animate-pulse"
                    >
                      <div className="w-9 h-9 bg-gray-100 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2 pt-0.5">
                        <div className="h-3.5 bg-gray-100 rounded w-4/5" />
                        <div className="h-2.5 bg-gray-50 rounded w-2/5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 font-secondary">
                    No activity found
                    {auditFilter !== "all" ? " for this filter" : ""}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {auditLogs.map((log) => {
                    const colorClass =
                      severityColor[log.severity] || severityColor.info;

                    return (
                      <div
                        key={log.id}
                        className="px-6 py-3.5 hover:bg-gray-50/60 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d={getActionIconPath(log.action)}
                              />
                            </svg>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-secondary font-medium text-gray-900 leading-tight">
                              {log.action_display}
                            </p>

                            {log.object_repr ? (
                              <p className="text-xs font-secondary text-gray-500 mt-0.5 truncate">
                                {log.object_repr}
                              </p>
                            ) : null}

                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-[11px] text-gray-400 font-secondary">
                                {timeAgo(log.created_at)}
                              </span>

                              {log.user_full_name &&
                              log.user_full_name !== "System" ? (
                                <>
                                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                                  <span className="text-[11px] text-gray-400 font-secondary truncate max-w-[110px]">
                                    {log.user_full_name}
                                  </span>
                                </>
                              ) : null}

                              {log.company_name ? (
                                <>
                                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                                  <span className="text-[11px] text-gray-400 font-secondary truncate max-w-[90px]">
                                    {log.company_name}
                                  </span>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
