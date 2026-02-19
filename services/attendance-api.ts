import { clockAuth } from "@/lib/clock-auth";
import { ApiResponse } from "@/type";

const API_BASE = "/api/attendance";

async function clockApiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers = clockAuth.getHeaders();

  if (!headers) {
    return {
      success: false,
      error: "Not authenticated. Please log in again.",
    };
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Request failed",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export async function adminClockLogin(
  phone: string,
  password: string,
): Promise<
  ApiResponse<{
    token: string;
    admin_name: string;
    tenant_name: string;
    tenant_id: string;
  }>
> {
  try {
    const response = await fetch(`${API_BASE}/admin-clock/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Login failed",
      };
    }

    if (data.data) {
      clockAuth.save({
        token: data.data.token,
        adminName: data.data.admin_name,
        tenantName: data.data.tenant_name,
        adminId: phone,
      });
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function adminClockLogout(): Promise<ApiResponse<null>> {
  const result = await clockApiCall("/admin-clock/logout/", {
    method: "POST",
  });

  clockAuth.clear();

  return result;
}

export async function getTodayEventsAttendance(): Promise<ApiResponse<any[]>> {
  return clockApiCall("/admin-clock/today-events/");
}

export async function startCheckInSessionAttendance(
  eventId: string,
  adminPhone: string,
): Promise<ApiResponse<any>> {
  return clockApiCall("/admin-clock/start-session/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_id: eventId,
      session_type: "check_in",
      admin_phone: adminPhone,
    }),
  });
}

export async function stopCheckInSessionAttendance(
  sessionId: string,
  adminPhone: string,
): Promise<ApiResponse<any>> {
  return clockApiCall("/admin-clock/stop-session/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      admin_phone: adminPhone,
    }),
  });
}

export async function verifyStaffPhoneAttendance(
  phone: string,
  clockCode: string,
  eventId: string,
): Promise<
  ApiResponse<{
    staff_id: string;
    staff_name: string;
    staff_avatar: string | null;
    assignment_id: string;
    role: string;
    scheduled_start: string;
    scheduled_end: string;
    check_in_status: string;
    check_out_status: string;
    time_difference_minutes: number | null;
    punctuality_status: string | null;
  }>
> {
  return clockApiCall("/staff/verify-phone/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone,
      clock_code: clockCode,
      event_id: eventId,
    }),
  });
}

export async function verifyStaffPhoneAttendanceCheckout(
  phone: string,
  clockCode: string,
  eventId: string,
): Promise<
  ApiResponse<{
    staff_id: string;
    staff_name: string;
    staff_avatar: string | null;
    assignment_id: string;
    role: string;
    scheduled_start: string;
    scheduled_end: string;
    check_in_status: string;
    check_out_status: string;
    time_difference_minutes: number | null;
    punctuality_status: string | null;
  }>
> {
  return clockApiCall("/staff/verify-phone-checkout/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone,
      clock_code: clockCode,
      event_id: eventId,
    }),
  });
}

export async function staffCheckInAttendance(
  staffId: string,
  eventId: string,
  assignmentId: string,
  location?: { latitude?: number; longitude?: number; name?: string },
): Promise<
  ApiResponse<{
    clock_entry_id: string;
    staff_avatar: string | null;
    requires_face_verification: boolean;
    punctuality: string;
  }>
> {
  return clockApiCall("/staff/check-in/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      staff_id: staffId,
      event_id: eventId,
      assignment_id: assignmentId,
      latitude: location?.latitude,
      longitude: location?.longitude,
      location: location?.name,
    }),
  });
}

export async function verifyFacePhotoAttendance(
  clockEntryId: string,
  photoBlob: Blob,
): Promise<
  ApiResponse<{
    verified: boolean;
    confidence_score: number;
    punctuality: string;
    requires_approval: boolean;
  }>
> {
  const formData = new FormData();
  formData.append("clock_entry_id", clockEntryId);
  formData.append("verification_photo", photoBlob, "verification.jpg");

  return clockApiCall("/staff/verify-face/", {
    method: "POST",
    body: formData,
  });
}

export async function adminManualCheckInAttendance(
  clockEntryId: string,
  adminPhone: string,
  adminPassword: string,
  overrideReason: string,
): Promise<ApiResponse<any>> {
  return clockApiCall("/admin-clock/manual-check-in/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clock_entry_id: clockEntryId,
      admin_phone: adminPhone,
      admin_password: adminPassword,
      override_reason: overrideReason,
    }),
  });
}

export async function staffCheckOutAttendance(
  staffId: string,
  eventId: string,
  location?: { latitude?: number; longitude?: number; name?: string },
): Promise<
  ApiResponse<{
    clock_entry_id: string;
    actual_hours: number;
    overtime_hours: number;
    total_hours: number;
  }>
> {
  return clockApiCall("/staff/check-out/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      staff_id: staffId,
      event_id: eventId,
      latitude: location?.latitude,
      longitude: location?.longitude,
      location: location?.name,
    }),
  });
}

export async function startCheckOutSessionAttendance(
  eventId: string,
  adminPhone: string,
): Promise<ApiResponse<any>> {
  return clockApiCall("/admin-clock/start-session/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_id: eventId,
      session_type: "check_out",
      admin_phone: adminPhone,
    }),
  });
}

export async function getActiveSessionAttendance(
  eventId: string,
): Promise<ApiResponse<any>> {
  return clockApiCall(`/admin-clock/active-session/${eventId}/`);
}
