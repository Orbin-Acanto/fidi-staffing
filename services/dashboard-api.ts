import { apiFetch } from "@/lib/apiFetch";
import { ApiResponse, CompaniesResponse } from "@/type";
import {
  ClockEntry,
  ClockEntryDetail,
  AttendanceStatistics,
  TimeEditRequest,
  EventSummary,
  Event,
  Company,
} from "@/type/attendance";

const API_BASE = "/api/attendance";

async function dashboardApiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: any;
}> {
  try {
    const response = await apiFetch<any>(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    return {
      success: true,
      data: response.data || response,
      message: response.message,
      pagination: response.pagination,
    };
  } catch (error: any) {
    console.error("Dashboard API call failed:", error);
    return {
      success: false,
      error: error.message || "Network error",
    };
  }
}

export async function getClockEntries(params: {
  company_id?: string;
  event_id?: string;
  staff_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}): Promise<{
  success: boolean;
  data?: ClockEntry[];
  error?: string;
  pagination?: any;
}> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return dashboardApiCall(`${API_BASE}/entries/?${queryParams.toString()}`);
}

export async function getClockEntry(
  entryId: string,
): Promise<{ success: boolean; data?: ClockEntryDetail; error?: string }> {
  return dashboardApiCall(`${API_BASE}/entries/${entryId}/`);
}

export async function getAttendanceStatistics(params: {
  company_id?: string;
  event_id?: string;
  date_from?: string;
  date_to?: string;
}): Promise<{ success: boolean; data?: AttendanceStatistics; error?: string }> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return dashboardApiCall(`${API_BASE}/statistics/?${queryParams.toString()}`);
}

export async function getTimeEditRequests(params: {
  status?: "pending" | "approved" | "rejected";
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}): Promise<{ success: boolean; data?: TimeEditRequest[]; error?: string }> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return dashboardApiCall(`${API_BASE}/time-edits/?${queryParams.toString()}`);
}

export async function approveTimeEditRequest(
  requestId: string,
  notes?: string,
): Promise<{ success: boolean; data?: TimeEditRequest; error?: string }> {
  return dashboardApiCall(`${API_BASE}/time-edits/${requestId}/approve/`, {
    method: "POST",
    body: JSON.stringify({ notes: notes || "" }),
  });
}

export async function rejectTimeEditRequest(
  requestId: string,
  notes: string,
): Promise<{ success: boolean; data?: TimeEditRequest; error?: string }> {
  return dashboardApiCall(`${API_BASE}/time-edits/${requestId}/reject/`, {
    method: "POST",
    body: JSON.stringify({ notes }),
  });
}

export async function approveClockEntry(
  entryId: string,
  notes?: string,
): Promise<{ success: boolean; data?: ClockEntry; error?: string }> {
  return dashboardApiCall(`${API_BASE}/entries/${entryId}/approve/`, {
    method: "POST",
    body: JSON.stringify({ notes: notes || "" }),
  });
}

export async function rejectClockEntry(
  entryId: string,
  reason: string,
): Promise<{ success: boolean; data?: ClockEntry; error?: string }> {
  return dashboardApiCall(`${API_BASE}/entries/${entryId}/reject/`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function getEventSummary(
  eventId: string,
): Promise<{ success: boolean; data?: EventSummary; error?: string }> {
  return dashboardApiCall(`${API_BASE}/events/${eventId}/summary/`);
}

export async function getEvents(params?: {
  date_from?: string;
  date_to?: string;
  company_id?: string;
  status?: string;
}): Promise<{
  success: boolean;
  data?: { results: Event[]; count: number };
  error?: string;
}> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
  }

  return dashboardApiCall(
    `/api/events/list/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
  );
}

export async function getCompanies(): Promise<{
  success: boolean;
  data?: CompaniesResponse;
  error?: string;
}> {
  return dashboardApiCall("/api/companies/list-company/");
}

export async function exportAttendanceCSV(params: {
  company_id?: string;
  event_id?: string;
  date_from?: string;
  date_to?: string;
}): Promise<Blob> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${API_BASE}/export/?${queryParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Export failed");
  }

  return response.blob();
}

export async function submitTimeEditRequest(data: {
  clock_entry_id: string;
  request_type:
    | "time_correction"
    | "missed_check_in"
    | "missed_check_out"
    | "both_missed";
  requested_clock_in?: string;
  requested_clock_out?: string;
  reason: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  return dashboardApiCall(`${API_BASE}/time-edits/submit/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function adminEditTime(
  entryId: string,
  data: {
    clock_in_time?: string;
    clock_out_time?: string;
    notes?: string;
  },
): Promise<{ success: boolean; data?: ClockEntryDetail; error?: string }> {
  return dashboardApiCall(`${API_BASE}/entries/${entryId}/edit-time/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
