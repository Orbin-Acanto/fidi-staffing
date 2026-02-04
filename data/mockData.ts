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

export const DEMO_STAFF: StaffType[] = [
  {
    id: "staff-001",
    firstName: "John",
    lastName: "Smith",
    phone: "5551234567",
    email: "john.smith@example.com",
    photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    position: "Server",
    notes: "Experienced bartender",
  },
  {
    id: "staff-002",
    firstName: "Sarah",
    lastName: "Johnson",
    phone: "5559876543",
    email: "sarah.j@example.com",
    photoUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    position: "Bartender",
    notes: "",
  },
  {
    id: "staff-003",
    firstName: "Michael",
    lastName: "Davis",
    phone: "5555551234",
    email: "m.davis@example.com",
    photoUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    position: "Host",
    notes: "Team lead",
  },
  {
    id: "staff-004",
    firstName: "Emily",
    lastName: "Wilson",
    phone: "5554445555",
    email: "emily.w@example.com",
    photoUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    position: "Server",
    notes: "",
  },
  {
    id: "staff-005",
    firstName: "David",
    lastName: "Brown",
    phone: "5556667777",
    email: "d.brown@example.com",
    photoUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    position: "Busser",
    notes: "New hire",
  },
];

export const DEMO_PIN = "123456";

export const DEMO_EVENTS: EventType[] = [
  {
    id: "event-001",
    name: "Corporate Gala Dinner",
    date: new Date().toISOString().split("T")[0],
    startTime: "18:00",
    endTime: "23:00",
    location: "48 Wall St, Grand Ballroom",
    expectedStaffCount: 5,
    checkedInCount: 0,
    status: "upcoming",
  },
  {
    id: "event-002",
    name: "Wedding Reception - Johnson",
    date: new Date().toISOString().split("T")[0],
    startTime: "16:00",
    endTime: "22:00",
    location: "48 Wall St, Rooftop Terrace",
    expectedStaffCount: 8,
    checkedInCount: 0,
    status: "upcoming",
  },
  {
    id: "event-003",
    name: "Tech Conference Lunch",
    date: new Date().toISOString().split("T")[0],
    startTime: "11:00",
    endTime: "14:00",
    location: "48 Wall St, Conference Hall A",
    expectedStaffCount: 3,
    checkedInCount: 0,
    status: "active",
  },
];

export const DEMO_ADMIN = {
  id: "admin-001",
  name: "Admin User",
  phone: "5550001111",
  password: "admin123",
};

let currentSession: CheckInSession | null = null;
let currentCheckOutSession: CheckOutSession | null = null;
let checkInRecords: CheckInRecord[] = [];
let helpRequests: AdminHelpRequest[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const success = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

const error = <T>(message: string): ApiResponse<T> => ({
  success: false,
  error: message,
});

export const mockAdminLogin = async (
  phone: string,
  password: string,
): Promise<
  ApiResponse<{ token: string; admin: { id: string; name: string } }>
> => {
  await delay(800);

  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone === DEMO_ADMIN.phone && password === DEMO_ADMIN.password) {
    return success({
      token: "demo-token-12345",
      admin: { id: DEMO_ADMIN.id, name: DEMO_ADMIN.name },
    });
  }

  return error("Invalid phone number or password");
};

export const mockAdminSendOTP = async (
  adminId: string,
  action: string,
): Promise<ApiResponse<{ sent: boolean; maskedPhone: string }>> => {
  await delay(500);

  return success({
    sent: true,
    maskedPhone: "(***) ***-1111",
  });
};

export const mockAdminVerifyOTP = async (
  adminId: string,
  otp: string,
  action: string,
): Promise<ApiResponse<{ verified: boolean }>> => {
  await delay(600);

  if (otp.length === 6 && /^\d+$/.test(otp)) {
    return success({ verified: true });
  }

  return error("Invalid verification code");
};

export const mockGetTodayEvents = async (): Promise<
  ApiResponse<EventType[]>
> => {
  await delay(600);
  return success(DEMO_EVENTS);
};

export const mockStartCheckInSession = async (
  eventId: string,
  adminId: string,
): Promise<ApiResponse<CheckInSession>> => {
  await delay(700);

  const event = DEMO_EVENTS.find((e) => e.id === eventId);
  if (!event) {
    return error("Event not found");
  }

  currentSession = {
    id: `session-${Date.now()}`,
    eventId,
    event,
    startedAt: new Date().toISOString(),
    startedBy: adminId,
    status: "active",
    totalCheckedIn: 0,
    autoCloseAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };

  checkInRecords = [];

  return success(currentSession);
};

export const mockEndCheckInSession = async (
  sessionId: string,
  adminId: string,
): Promise<ApiResponse<CheckInSession>> => {
  await delay(500);

  if (currentSession) {
    currentSession = {
      ...currentSession,
      status: "ended",
      endedAt: new Date().toISOString(),
      endedBy: adminId,
    };
    return success(currentSession);
  }

  return error("No active session found");
};

export const mockValidateStaffCredentials = async (
  phone: string,
  pin: string,
): Promise<ApiResponse<StaffType>> => {
  await delay(600);

  const cleanPhone = phone.replace(/\D/g, "");
  const staff = DEMO_STAFF.find((s) => s.phone === cleanPhone);

  if (!staff) {
    return error("Phone number not found");
  }

  if (pin !== DEMO_PIN) {
    return error("Invalid PIN");
  }

  return success(staff);
};

export const mockGetStaffCheckInStatus = async (
  staffId: string,
  sessionId: string,
): Promise<ApiResponse<{ checkedIn: boolean; checkInTime?: string }>> => {
  await delay(400);

  const record = checkInRecords.find((r) => r.staffId === staffId);

  if (record) {
    return success({
      checkedIn: true,
      checkInTime: new Date(record.checkInTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }

  return success({ checkedIn: false });
};

export const mockVerifyFace = async (
  staffId: string,
  capturedImage: string,
): Promise<ApiResponse<{ verified: boolean; confidence: number }>> => {
  await delay(1500);

  const verified = Math.random() > 0.1;

  return success({
    verified,
    confidence: verified ? 0.92 : 0.45,
  });
};

export const mockSubmitCheckIn = async (
  sessionId: string,
  staffId: string,
  capturedPhoto?: string,
  verificationMethod?: string,
): Promise<ApiResponse<CheckInRecord>> => {
  await delay(500);

  const staff = DEMO_STAFF.find((s) => s.id === staffId);
  if (!staff) {
    return error("Staff not found");
  }

  const record: CheckInRecord = {
    id: `checkin-${Date.now()}`,
    staffId,
    staff,
    sessionId,
    checkInTime: new Date().toISOString(),
    verifiedBy: verificationMethod === "admin" ? DEMO_ADMIN.id : undefined,
    verificationMethod:
      (verificationMethod as "face" | "admin" | "pin") || "face",
    isLate: false,
    capturedPhotoUrl: capturedPhoto,
  };

  checkInRecords.push(record);

  if (currentSession) {
    currentSession.totalCheckedIn = checkInRecords.length;
  }

  return success(record);
};

export const mockRequestAdminHelp = async (
  sessionId: string,
  staffId: string,
  reason: string,
): Promise<ApiResponse<AdminHelpRequest>> => {
  await delay(400);

  const staff = DEMO_STAFF.find((s) => s.id === staffId);

  const request: AdminHelpRequest = {
    id: `help-${Date.now()}`,
    staffId,
    staff: staff || DEMO_STAFF[0],
    sessionId,
    requestedAt: new Date().toISOString(),
    status: "pending",
  };

  helpRequests.push(request);

  return success(request);
};

export const mockStartCheckOutSession = async (
  eventId: string,
  adminId: string,
): Promise<ApiResponse<CheckOutSession>> => {
  await delay(600);

  const event = DEMO_EVENTS.find((e) => e.id === eventId);
  if (!event) {
    return error("Event not found");
  }

  currentCheckOutSession = {
    id: `checkout-session-${Date.now()}`,
    eventId,
    event,
    startedAt: new Date().toISOString(),
    startedBy: adminId,
    status: "active",
    totalCheckedOut: 0,
  };

  return success(currentCheckOutSession);
};

export const mockSubmitCheckOut = async (
  sessionId: string,
  staffId: string,
): Promise<ApiResponse<CheckInRecord>> => {
  await delay(500);

  const checkInRecord = checkInRecords.find((r) => r.staffId === staffId);

  if (!checkInRecord) {
    return error("No check-in record found for this staff");
  }

  checkInRecord.checkOutTime = new Date().toISOString();

  if (currentCheckOutSession) {
    currentCheckOutSession.totalCheckedOut += 1;
  }

  return success(checkInRecord);
};

export const mockSendForgotPIN = async (
  phone: string,
): Promise<ApiResponse<{ sent: boolean; maskedPhone: string }>> => {
  await delay(700);

  const cleanPhone = phone.replace(/\D/g, "");
  const staff = DEMO_STAFF.find((s) => s.phone === cleanPhone);

  if (!staff) {
    return error("Phone number not registered");
  }

  return success({
    sent: true,
    maskedPhone: `(***) ***-${cleanPhone.slice(-4)}`,
  });
};

export const mockGetLiveStats = async (
  sessionId: string,
): Promise<ApiResponse<LiveStats>> => {
  await delay(300);

  const event = currentSession?.event || DEMO_EVENTS[0];

  return success({
    totalExpected: event.expectedStaffCount,
    checkedIn: checkInRecords.length,
    pendingHelpRequests: helpRequests.filter((r) => r.status === "pending")
      .length,
    lateArrivals: checkInRecords.filter((r) => r.isLate).length,
    onTimeArrivals: checkInRecords.filter((r) => !r.isLate).length,
    recentCheckIns: checkInRecords.slice(-5),
  });
};

export const DEMO_CREDENTIALS = {
  admin: {
    phone: "(555) 000-1111",
    password: "admin123",
  },
  staff: DEMO_STAFF.map((s) => ({
    name: `${s.firstName} ${s.lastName}`,
    phone: `(${s.phone.slice(0, 3)}) ${s.phone.slice(3, 6)}-${s.phone.slice(6)}`,
    pin: DEMO_PIN,
  })),
  otp: "Any 6 digits (e.g., 123456)",
};
