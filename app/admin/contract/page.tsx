"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppSelect } from "@/component/ui/Select";
import { apiFetch } from "@/lib/apiFetch";
import { toastError } from "@/lib/toast";
import {
  ContractDetail,
  ContractListItem,
  OptionItem,
  PreviewForm,
} from "@/type/contracts";
import { safeStr, splitName, toNumber } from "@/lib/utils";
import { AppDatePicker } from "@/component/ui/AppDatePicker";
import { useCompany } from "@/component/context/CompanyContext";

export default function ContractsPage() {
  const { companyVersion } = useCompany();
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [contractsLoading, setContractsLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedPersonKey, setSelectedPersonKey] = useState<string>("all");

  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const [query, setQuery] = useState<string>("");

  const [selectedContractId, setSelectedContractId] = useState<string>("");
  const [detail, setDetail] = useState<ContractDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [form, setForm] = useState<PreviewForm>({
    contractId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventName: "",
    eventDate: "",
    eventTimes: "",
    location: "",
    locationAddress: "",
    payType: "hourly",
    rate: 0,
    dressCode: "",
    jobDescription: "",
    additionalDetails: "",
  });

  const formatTime = (time: string) => {
    if (!time) return "";
    const t = time.slice(0, 5);
    const [hours, minutes] = t.split(":");
    const h = parseInt(hours, 10);
    if (!Number.isFinite(h)) return t;
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statusLabel = (s: string) => {
    const v = safeStr(s).toLowerCase();
    if (v === "draft") return "Draft";
    if (v === "pending_signature") return "Pending Signature";
    if (v === "signed") return "Signed";
    if (v === "completed") return "Completed";
    if (v === "cancelled") return "Cancelled";
    return s || "Unknown";
  };

  const statusPillClass = (s: string) => {
    const v = safeStr(s).toLowerCase();
    if (v === "draft") return "bg-gray-100 text-gray-700 border-gray-200";
    if (v === "pending_signature")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (v === "signed") return "bg-green-50 text-green-700 border-green-200";
    if (v === "completed") return "bg-blue-50 text-blue-700 border-blue-200";
    if (v === "cancelled") return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const buildListParams = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("page_size", "200");

    if (statusFilter !== "all") params.set("status", statusFilter);
    if (selectedEvent !== "all") params.set("event", selectedEvent);

    if (selectedPersonKey !== "all") {
      if (selectedPersonKey === "staff") {
        params.set("party_type", "staff");
      } else if (selectedPersonKey === "vendor") {
        params.set("party_type", "vendor");
      } else {
        const [kind, id] = selectedPersonKey.split(":");
        if (kind === "staff" && id) params.set("staff", id);
        if (kind === "vendor" && id) params.set("vendor", id);
      }
    }

    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);

    if (query.trim()) params.set("search", query.trim());

    return params;
  };

  const loadContracts = async () => {
    setContractsLoading(true);
    try {
      const params = buildListParams();
      const res = await apiFetch(`/api/contracts?${params.toString()}`);

      const list =
        (res?.contracts as ContractListItem[] | undefined) ||
        (res?.results as ContractListItem[] | undefined) ||
        (Array.isArray(res) ? (res as ContractListItem[]) : []);

      setContracts(list);

      if (selectedContractId) {
        const stillThere = list.some(
          (c) => safeStr(c.id) === selectedContractId,
        );
        if (!stillThere) {
          setSelectedContractId("");
          setDetail(null);
          setShowPreview(false);
        }
      }
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to load contracts");
    } finally {
      setContractsLoading(false);
    }
  };

  const loadContractDetail = async (contractId: string) => {
    if (!contractId) return;

    setDetailLoading(true);
    try {
      const res = await apiFetch(`/api/contracts/${contractId}`);
      const d: ContractDetail =
        (res?.contract as ContractDetail) ||
        (res?.data as ContractDetail) ||
        (res as ContractDetail);

      setDetail(d);

      const isStaff = !!d.staff;
      const personName = isStaff
        ? safeStr(d.staff_name)
        : safeStr(d.vendor_name);
      const personEmail = isStaff
        ? safeStr(d.staff_email)
        : safeStr(d.vendor_email);
      const personPhone = isStaff
        ? safeStr(d.staff_phone)
        : safeStr(d.vendor_phone);

      const nameParts = splitName(personName);

      const start = safeStr(d.event_start_time).slice(0, 5);
      const end = safeStr(d.event_end_time).slice(0, 5);

      setForm({
        contractId: safeStr(d.id),

        firstName: nameParts.firstName,
        lastName: nameParts.lastName,
        email: personEmail,
        phone: personPhone,

        eventName: safeStr(d.event_name),
        eventDate: safeStr(d.event_date),
        eventTimes:
          start && end ? `${formatTime(start)} - ${formatTime(end)}` : "",

        location: safeStr(d.event_location),
        locationAddress: safeStr(d.event_location_address),

        payType:
          safeStr(d.pay_type).toLowerCase() === "fixed" ? "fixed" : "hourly",
        rate: toNumber(d.pay_rate),

        dressCode: safeStr(d.dress_code),
        jobDescription: safeStr(d.job_description),
        additionalDetails: safeStr(d.additional_details),
      });

      setShowPreview(true);
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to load contract details");
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, [companyVersion]);

  useEffect(() => {
    loadContracts();
  }, [statusFilter, selectedEvent, selectedPersonKey, dateFrom, dateTo, query]);

  const statusOptions: OptionItem[] = useMemo(() => {
    return [
      { value: "all", label: "All statuses" },
      { value: "draft", label: "Draft" },
      { value: "pending_signature", label: "Pending Signature" },
      { value: "signed", label: "Signed" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ];
  }, []);

  const eventOptions: OptionItem[] = useMemo(() => {
    const seen = new Set<string>();
    const out: OptionItem[] = [{ value: "all", label: "All events" }];

    for (const c of contracts) {
      const id = safeStr(c.event);
      const date = safeStr(c.event_date);
      if (!id || seen.has(id)) continue;
      seen.add(id);

      out.push({
        value: id,
        label: `${safeStr(c.event_name) || "Event"} | ${formatDate(date)}`,
      });
    }

    return out;
  }, [contracts]);

  const personOptions: OptionItem[] = useMemo(() => {
    const seen = new Set<string>();
    const out: OptionItem[] = [
      { value: "all", label: "All staff and vendors" },
      { value: "staff", label: "Staff" },
      { value: "vendor", label: "Vendor" },
    ];

    for (const c of contracts) {
      if (c.staff) {
        const key = `staff:${c.staff}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push({
            value: key,
            label: `${safeStr(c.staff_name) || "Staff"} | Staff`,
          });
        }
      }

      if (c.vendor) {
        const key = `vendor:${c.vendor}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push({
            value: key,
            label: `${safeStr(c.vendor_name) || "Vendor"} | Vendor`,
          });
        }
      }
    }

    return out;
  }, [contracts]);

  const handleView = async (c: ContractListItem) => {
    const id = safeStr(c.id);
    setSelectedContractId(id);
    await loadContractDetail(id);
  };

  const handleSendContract = async () => {
    const id = safeStr(form.contractId);
    if (!id) {
      toastError("No contract selected");
      return;
    }

    setIsSending(true);
    try {
      await apiFetch(`/api/contracts/${id}/send/`, { method: "POST" });
      await loadContracts();
      await loadContractDetail(id);
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to send contract");
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadContract = () => {
    const file = detail?.contract_file;
    if (!file) {
      toastError("No contract PDF available yet");
      return;
    }
    window.open(file, "_blank", "noopener,noreferrer");
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setSelectedEvent("all");
    setSelectedPersonKey("all");
    setDateFrom("");
    setDateTo("");
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-primary font-bold text-gray-900">
            Contracts
          </h1>
          <p className="text-sm font-secondary text-gray-600 mt-1">
            View your contacts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadContracts}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary transition-colors disabled:opacity-60"
            disabled={contractsLoading}
            type="button"
          >
            <svg
              className={`w-4 h-4 ${contractsLoading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7 9 9 0 00-14-7"
              />
            </svg>
            Refresh
          </button>

          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary transition-colors"
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
            Back to Events
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AppSelect
                label={<span className="font-secondary">Status</span>}
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={statusOptions}
                placeholder="All statuses"
              />

              <AppSelect
                label={<span className="font-secondary">Event</span>}
                value={selectedEvent}
                onValueChange={setSelectedEvent}
                options={eventOptions}
                placeholder="All events"
              />

              <AppSelect
                label={<span className="font-secondary">Staff or Vendor</span>}
                value={selectedPersonKey}
                onValueChange={setSelectedPersonKey}
                options={personOptions}
                placeholder="All staff and vendors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <AppDatePicker
                  label="From"
                  value={dateFrom}
                  onChange={(ymd) => setDateFrom(ymd)}
                />
              </div>

              <div>
                <AppDatePicker
                  label="To"
                  value={dateTo}
                  onChange={(ymd) => setDateTo(ymd)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Search
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="contract number, event, name, email, role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 font-secondary">
                {contractsLoading
                  ? "Loading..."
                  : `${contracts.length} contracts`}
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-secondary text-gray-700 hover:text-gray-900"
              >
                Reset filters
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-primary font-semibold text-gray-900">
                Contracts
              </h2>
              <div className="text-xs text-gray-500 font-secondary">
                Click the view icon to load details
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 font-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Contract
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Event</th>
                    <th className="px-4 py-3 text-left font-medium">Person</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Pay</th>
                    <th className="px-4 py-3 text-right font-medium">View</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {contracts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-gray-500 font-secondary"
                      >
                        No contracts found
                      </td>
                    </tr>
                  ) : (
                    contracts.map((c) => {
                      const isSelected =
                        safeStr(c.id) === safeStr(selectedContractId);

                      const person = c.staff
                        ? `${safeStr(c.staff_name) || "Staff"} (Staff)`
                        : `${safeStr(c.vendor_name) || "Vendor"} (Vendor)`;

                      const pay =
                        safeStr(c.pay_type).toLowerCase() === "hourly"
                          ? `${formatCurrency(toNumber(c.pay_rate))}/hr`
                          : formatCurrency(toNumber(c.pay_rate));

                      return (
                        <tr
                          key={c.id}
                          className={`${
                            isSelected ? "bg-primary/5" : "bg-white"
                          } hover:bg-gray-50`}
                        >
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full border text-xs font-secondary ${statusPillClass(
                                c.status,
                              )}`}
                            >
                              {statusLabel(c.status)}
                            </span>
                          </td>

                          <td className="px-4 py-3 font-secondary text-gray-900">
                            {c.contract_number || "Pending number"}
                          </td>

                          <td className="px-4 py-3 font-secondary text-gray-900">
                            <div className="font-medium">
                              {safeStr(c.event_name) || "Event"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(safeStr(c.event_date))}
                            </div>
                          </td>

                          <td className="px-4 py-3 font-secondary text-gray-900">
                            <div className="font-medium">{person}</div>
                            <div className="text-xs text-gray-500">
                              {safeStr(c.staff_email || c.vendor_email)}
                            </div>
                          </td>

                          <td className="px-4 py-3 font-secondary text-gray-700">
                            {safeStr(c.role_name) || "—"}
                          </td>

                          <td className="px-4 py-3 font-secondary text-gray-700">
                            {pay}
                          </td>

                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleView(c)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
                              aria-label="View contract"
                              title="View"
                            >
                              <svg
                                className="w-4 h-4 text-gray-700"
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
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-primary font-semibold text-gray-900">
                Contract Preview
              </h2>
            </div>

            {showPreview ? (
              detailLoading ? (
                <div className="p-8 text-center text-sm text-gray-500 font-secondary">
                  Loading contract details...
                </div>
              ) : detail ? (
                <>
                  <div className="p-4 max-h-[600px] overflow-y-auto">
                    <div className="text-center mb-4 pb-4 border-b border-gray-200">
                      <h3 className="font-primary font-bold text-gray-900">
                        PERFORMANCE AGREEMENT
                      </h3>
                      <p className="text-xs text-gray-500 font-secondary mt-1">
                        {detail.contract_number
                          ? `Contract ${detail.contract_number}`
                          : "Contract"}
                      </p>
                      <p className="text-xs text-gray-500 font-secondary">
                        Status {statusLabel(detail.status)}
                      </p>
                    </div>

                    <div className="mb-4 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-secondary">
                          Name:
                        </span>
                        <span className="font-secondary font-medium text-gray-900">
                          {form.firstName} {form.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-secondary">
                          Email:
                        </span>
                        <span className="font-secondary text-gray-900">
                          {form.email}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-secondary">
                          Phone:
                        </span>
                        <span className="font-secondary text-gray-900">
                          {form.phone}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 space-y-1.5 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-secondary">
                          Event:
                        </span>
                        <span className="font-secondary font-medium text-gray-900 text-right max-w-[60%]">
                          {form.eventName}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-secondary">
                          Date:
                        </span>
                        <span className="font-secondary text-gray-900">
                          {formatDate(form.eventDate)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-secondary">
                          Event Times:
                        </span>
                        <span className="font-secondary text-gray-900">
                          {form.eventTimes || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-secondary">
                          Location:
                        </span>
                        <span className="font-secondary text-gray-900 text-right max-w-[60%]">
                          {form.location || "Not set"}
                        </span>
                      </div>
                      {form.locationAddress ? (
                        <div className="text-xs text-gray-500 font-secondary">
                          {form.locationAddress}
                        </div>
                      ) : null}
                    </div>

                    <div className="mb-4 space-y-1.5 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-secondary">
                          Rate:
                        </span>
                        <span className="font-secondary font-bold text-green-600">
                          {formatCurrency(form.rate)}
                          {form.payType === "hourly" ? "/hr" : ""}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-secondary">
                          Dress Code:
                        </span>
                        <span className="font-secondary text-gray-900 text-right max-w-[60%]">
                          {form.dressCode || "—"}
                        </span>
                      </div>

                      {form.jobDescription ? (
                        <div className="text-xs">
                          <span className="text-gray-500 font-secondary block mb-1">
                            Job Description:
                          </span>
                          <span className="font-secondary text-gray-900">
                            {form.jobDescription}
                          </span>
                        </div>
                      ) : null}

                      {form.additionalDetails ? (
                        <div className="text-xs">
                          <span className="text-gray-500 font-secondary block mb-1">
                            Additional Details:
                          </span>
                          <span className="font-secondary text-gray-900">
                            {form.additionalDetails}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-[10px] text-gray-400 font-secondary mb-3">
                        I acknowledge that I have read and agree to all terms
                        and conditions listed in this agreement.
                      </p>
                      <div className="border-b border-dashed border-gray-300 mb-1" />
                      <p className="text-[10px] text-gray-400 font-secondary">
                        Signature and Date
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 space-y-2">
                    {/* <button
                      onClick={handleSendContract}
                      disabled={isSending || !form.contractId}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-secondary font-medium transition-colors disabled:opacity-50"
                      type="button"
                    >
                      <svg
                        className={`w-4 h-4 ${isSending ? "animate-spin" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Send
                    </button> */}

                    <button
                      onClick={handleDownloadContract}
                      className="w-full inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
                      type="button"
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download PDF
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-sm text-gray-500 font-secondary">
                  Contract not found
                </div>
              )
            ) : (
              <div className="p-8 text-center">
                <svg
                  className="w-12 h-12 text-gray-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500 font-secondary">
                  Click the eye icon on a contract to view details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
