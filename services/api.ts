import { apiFetch } from "@/lib/apiFetch";
import {
  AdminHelpRequest,
  ApiResponse,
  CheckInRecord,
  CheckInSession,
  CheckOutSession,
  EventType,
  LiveStats,
  StaffType,
} from "@/type";

import {
  mockAdminLogin,
  mockAdminSendOTP,
  mockAdminVerifyOTP,
  mockGetTodayEvents,
  mockStartCheckInSession,
  mockEndCheckInSession,
  mockValidateStaffCredentials,
  mockGetStaffCheckInStatus,
  mockVerifyFace,
  mockSubmitCheckIn,
  mockRequestAdminHelp,
  mockStartCheckOutSession,
  mockSubmitCheckOut,
  mockSendForgotPIN,
  mockGetLiveStats,
} from "@/data/mockData";

const DEMO_MODE = true;

const API_BASE = "/api/checkin";

export const adminLogin = async (
  phone: string,
  password: string,
): Promise<
  ApiResponse<{ token: string; admin: { id: string; name: string } }>
> => {
  if (DEMO_MODE) {
    return mockAdminLogin(phone, password);
  }
  return apiFetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
};

export const adminSendOTP = async (
  adminId: string,
  action: string,
): Promise<ApiResponse<{ sent: boolean; maskedPhone: string }>> => {
  if (DEMO_MODE) {
    return mockAdminSendOTP(adminId, action);
  }
  return apiFetch(`${API_BASE}/admin/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminId, action }),
  });
};

export const adminVerifyOTP = async (
  adminId: string,
  otp: string,
  action: string,
): Promise<ApiResponse<{ verified: boolean }>> => {
  if (DEMO_MODE) {
    return mockAdminVerifyOTP(adminId, otp, action);
  }
  return apiFetch(`${API_BASE}/admin/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminId, otp, action }),
  });
};

export const adminLogout = async (): Promise<ApiResponse<null>> => {
  if (DEMO_MODE) {
    return { success: true, data: null };
  }
  return apiFetch(`${API_BASE}/admin/logout`, {
    method: "POST",
  });
};

export const getTodayEvents = async (): Promise<ApiResponse<EventType[]>> => {
  if (DEMO_MODE) {
    return mockGetTodayEvents();
  }
  return apiFetch(`${API_BASE}/events/today`, {
    method: "GET",
  });
};

export const getEventById = async (
  eventId: string,
): Promise<ApiResponse<EventType>> => {
  if (DEMO_MODE) {
    const events = await mockGetTodayEvents();
    const event = events.data?.find((e) => e.id === eventId);
    return event
      ? { success: true, data: event }
      : { success: false, error: "Event not found" };
  }
  return apiFetch(`${API_BASE}/events/${eventId}`, {
    method: "GET",
  });
};

export const startCheckInSession = async (
  eventId: string,
  adminId: string,
): Promise<ApiResponse<CheckInSession>> => {
  if (DEMO_MODE) {
    return mockStartCheckInSession(eventId, adminId);
  }
  return apiFetch(`${API_BASE}/check-in/start-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, adminId }),
  });
};

export const endCheckInSession = async (
  sessionId: string,
  adminId: string,
): Promise<ApiResponse<CheckInSession>> => {
  if (DEMO_MODE) {
    return mockEndCheckInSession(sessionId, adminId);
  }
  return apiFetch(`${API_BASE}/check-in/end-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, adminId }),
  });
};

export const submitCheckIn = async (
  sessionId: string,
  staffId: string,
  capturedPhoto?: string,
  verificationMethod?: string,
): Promise<ApiResponse<CheckInRecord>> => {
  if (DEMO_MODE) {
    return mockSubmitCheckIn(
      sessionId,
      staffId,
      capturedPhoto,
      verificationMethod,
    );
  }
  return apiFetch(`${API_BASE}/check-in/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      staffId,
      capturedPhoto,
      verificationMethod,
    }),
  });
};

export const requestAdminHelp = async (
  sessionId: string,
  staffId: string,
  reason: string,
): Promise<ApiResponse<AdminHelpRequest>> => {
  if (DEMO_MODE) {
    return mockRequestAdminHelp(sessionId, staffId, reason);
  }
  return apiFetch(`${API_BASE}/check-in/request-admin-help`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, staffId, reason }),
  });
};

export const adminVerifyStaff = async (
  requestId: string,
  adminId: string,
  approved: boolean,
  reason?: string,
): Promise<ApiResponse<CheckInRecord>> => {
  if (DEMO_MODE) {
    return { success: true, data: undefined as any };
  }
  return apiFetch(`${API_BASE}/check-in/admin-verify-staff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId, adminId, approved, reason }),
  });
};

export const getLiveStats = async (
  sessionId: string,
): Promise<ApiResponse<LiveStats>> => {
  if (DEMO_MODE) {
    return mockGetLiveStats(sessionId);
  }
  return apiFetch(`${API_BASE}/check-in/live-stats?sessionId=${sessionId}`, {
    method: "GET",
  });
};

export const getActiveSession = async (): Promise<
  ApiResponse<CheckInSession | null>
> => {
  if (DEMO_MODE) {
    return { success: true, data: null };
  }
  return apiFetch(`${API_BASE}/check-in/active-session`, {
    method: "GET",
  });
};

export const startCheckOutSession = async (
  eventId: string,
  adminId: string,
): Promise<ApiResponse<CheckOutSession>> => {
  if (DEMO_MODE) {
    return mockStartCheckOutSession(eventId, adminId);
  }
  return apiFetch(`${API_BASE}/check-out/start-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, adminId }),
  });
};

export const endCheckOutSession = async (
  sessionId: string,
  adminId: string,
): Promise<ApiResponse<CheckOutSession>> => {
  if (DEMO_MODE) {
    return { success: true, data: undefined as any };
  }
  return apiFetch(`${API_BASE}/check-out/end-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, adminId }),
  });
};

export const submitCheckOut = async (
  sessionId: string,
  staffId: string,
): Promise<ApiResponse<CheckInRecord>> => {
  if (DEMO_MODE) {
    return mockSubmitCheckOut(sessionId, staffId);
  }
  return apiFetch(`${API_BASE}/check-out/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, staffId }),
  });
};

export const validateStaffCredentials = async (
  phone: string,
  pin: string,
): Promise<ApiResponse<StaffType>> => {
  if (DEMO_MODE) {
    return mockValidateStaffCredentials(phone, pin);
  }
  return apiFetch(`${API_BASE}/staff/validate-credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, pin }),
  });
};

export const sendForgotPIN = async (
  phone: string,
): Promise<ApiResponse<{ sent: boolean; maskedPhone: string }>> => {
  if (DEMO_MODE) {
    return mockSendForgotPIN(phone);
  }
  return apiFetch(`${API_BASE}/staff/forgot-pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
};

export const getStaffById = async (
  staffId: string,
): Promise<ApiResponse<StaffType>> => {
  if (DEMO_MODE) {
    const { DEMO_STAFF } = await import("@/data/mockData");
    const staff = DEMO_STAFF.find((s) => s.id === staffId);
    return staff
      ? { success: true, data: staff }
      : { success: false, error: "Staff not found" };
  }
  return apiFetch(`${API_BASE}/staff/${staffId}`, {
    method: "GET",
  });
};

export const checkStaffScheduled = async (
  staffId: string,
  eventId: string,
): Promise<ApiResponse<{ scheduled: boolean; shiftTime?: string }>> => {
  if (DEMO_MODE) {
    return {
      success: true,
      data: { scheduled: true, shiftTime: "18:00 - 23:00" },
    };
  }
  return apiFetch(`${API_BASE}/staff/check-scheduled`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ staffId, eventId }),
  });
};

export const getStaffCheckInStatus = async (
  staffId: string,
  sessionId: string,
): Promise<ApiResponse<{ checkedIn: boolean; checkInTime?: string }>> => {
  if (DEMO_MODE) {
    return mockGetStaffCheckInStatus(staffId, sessionId);
  }
  return apiFetch(`${API_BASE}/staff/check-in-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ staffId, sessionId }),
  });
};

export const verifyFace = async (
  staffId: string,
  capturedImage: string,
): Promise<ApiResponse<{ verified: boolean; confidence: number }>> => {
  if (DEMO_MODE) {
    return mockVerifyFace(staffId, capturedImage);
  }
  return apiFetch(`${API_BASE}/face-verification/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ staffId, capturedImage }),
  });
};

export const syncOfflineQueue = async (
  queue: Array<{
    staffPhone: string;
    staffPin: string;
    capturedPhoto?: string;
    timestamp: string;
  }>,
): Promise<ApiResponse<{ synced: number; failed: number }>> => {
  if (DEMO_MODE) {
    return { success: true, data: { synced: queue.length, failed: 0 } };
  }
  return apiFetch(`${API_BASE}/sync/offline-queue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queue }),
  });
};
