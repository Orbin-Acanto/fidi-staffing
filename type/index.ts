export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  groups: string[];
  status: "Active" | "Inactive";
  profilePicture?: string;
  lastActive: string;
  wage: number;
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profilePicture?: File | null;

  profession: string;
  experienceLevel: string;

  employeeId: string;
  startDate: string;
  employmentType: string;
  groups: string[];

  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  emergencyContactName: string;
  emergencyContactPhone: string;

  username: string;
  password: string;
  confirmPassword: string;
  status: string;

  payType: "hourly" | "fixed";
  wage?: number;
  fixedRate?: number;

  uniformSize?: string;
}

export interface Event {
  id: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: {
    venueName: string;
    city: string;
    state: string;
  };
  assignedStaff: string[];
  requiredStaff: number;
  status: "Upcoming" | "In Progress" | "Completed" | "Cancelled";
  clientName: string;
  description?: string;
  dressCode?: string;
  specialInstructions?: string;
}

type Company = {
  id: string;
  tenant: string;
  tenant_name: string;
  name: string;
  slug: string;
  logo: string | null;
  primary_color: string;
  email: string;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  address_country: string;
  company_type: string | null;
  description: string | null;
  is_active: boolean;
  is_tenant: boolean;
  created_at: string;
  updated_at: string;
};

export type CompaniesResponse = {
  count: number;
  companies: Company[];
};

export type SavedLocation = {
  id: string;
  label: string;
  venueName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contactPerson?: string;
  phoneNumber?: string;
  locationNotes?: string;
  isFavorite?: boolean;
  eventsCount?: number;
  createdAt?: string;
};

export type LocationFormData = {
  venueName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contactPerson: string;
  phoneNumber: string;
  locationNotes: string;
};

export interface EventFormData {
  eventName: string;
  eventType: string;
  description: string;
  clientName: string;
  clientContact: string;

  eventDate: string;
  startTime: string;
  endTime: string;
  setupTime: string;
  breakdownTime: string;
  clockCode: string;

  venueName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  locationNotes: string;

  staffingRequirements: {
    [key: string]: number;
  };
  assignedGroups: string[];
  autoAssign: boolean;

  dressCode: string;
  specialInstructions: string;
  budget: string;
  status: string;
}

export type Group = {
  id: string;
  name: string;
  description: string;
  color: string;
  memberIds: string[];
  createdAt: string;
  archived: boolean;
};

export type UserRole = "Owner" | "Admin" | "Manager" | "Staff";

export type UserStatus = "Active" | "Suspended" | "Deactivated";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastUpdated?: string;
  company?: string;
  companyId?: string;
};

type UsersResponse = {
  count: number;
  users: User[];
};

export type ActivityLog = {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
};

export type NotificationPreferences = {
  emailNewStaff: boolean;
  emailEventReminders: boolean;
  emailWeeklyReport: boolean;
  smsNotifications: boolean;
  smsUrgentAlerts: boolean;
  voiceCallNotifications: boolean;
  inAppNotifications: boolean;
  inAppSound: boolean;
};

export type TwoFactorAuth = {
  enabled: boolean;
  method: "authenticator" | "sms" | "email" | null;
  lastUpdated?: string;
  backupCodesRemaining?: number;
};

export type AdminProfileRole =
  | "owner"
  | "admin"
  | "moderator"
  | "SaaS Admin"
  | "Staff"
  | "User";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string | null;
  role: AdminProfileRole;
  company?: string | null;
  joinedAt: string;
  lastPasswordChange?: string;
  notificationPreferences: NotificationPreferences;
  twoFactorAuth: TwoFactorAuth;
};

export type ProfileActivityLog = {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress?: string;
  device?: string;
};

export type GeneralSettings = {
  companyName: string;
  logo?: string;
  timeZone: string;
  dateFormat: string;
  currency: string;
  overtimeMultiplier: number;
  taxRate: number;
  taxId?: string;
  complianceNotes?: string;
};

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  lastUpdated?: string;
};

export type EmailSettings = {
  senderName: string;
  senderEmail: string;
  templates: EmailTemplate[];
};

export type SystemPreferences = {
  autoBackup: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  lastBackup?: string;
  retentionDays: number;
};

export type Settings = {
  general: GeneralSettings;
  email: EmailSettings;
  system: SystemPreferences;
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type StaffUtilization = {
  staffId: string;
  staffName: string;
  avatar?: string;
  totalHours: number;
  eventsWorked: number;
  utilizationRate: number;
  overtimeHours: number;
  rating: number;
};

export type EventStatistics = {
  totalEvents: number;
  completedEvents: number;
  upcomingEvents: number;
  cancelledEvents: number;
  averageStaffPerEvent: number;
  totalRevenue: number;
};

export type AttendanceRecord = {
  staffId: string;
  staffName: string;
  avatar?: string;
  scheduledShifts: number;
  attendedShifts: number;
  lateArrivals: number;
  noShows: number;
  attendanceRate: number;
};

export type MonthlyTrend = {
  month: string;
  events: number;
  staffHours: number;
  revenue: number;
};

export type EventTypeBreakdown = {
  type: string;
  count: number;
  percentage: number;
  color: string;
};

export type TopPerformer = {
  staffId: string;
  staffName: string;
  avatar?: string;
  eventsWorked: number;
  hoursWorked: number;
  rating: number;
  onTimeRate: number;
};

export type ReportSummary = {
  staffUtilization: StaffUtilization[];
  eventStatistics: EventStatistics;
  attendanceRecords: AttendanceRecord[];
  monthlyTrends: MonthlyTrend[];
  eventTypeBreakdown: EventTypeBreakdown[];
  topPerformers: TopPerformer[];
};

export type StaffReview = {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  rating: number;
  punctuality: "on-time" | "late" | "no-show";
  performance: "excellent" | "good" | "average" | "poor";
  reviewedBy: string;
  reviewedAt: string;
  notes?: string;
};

export type StaffAttendance = {
  totalShifts: number;
  attendedShifts: number;
  lateArrivals: number;
  noShows: number;
  attendanceRate: number;
  punctualityRate: number;
};

export type StaffNote = {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  type: "general" | "warning" | "praise" | "incident";
};

export type StaffPerformance = {
  averageRating: number;
  totalReviews: number;
  attendance: StaffAttendance;
  reviews: StaffReview[];
  notes: StaffNote[];
};

export type ClockEntry = {
  id: string;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  eventId?: string;
  eventName?: string;
  date: string;
  scheduledStart: string;
  scheduledEnd: string;
  clockIn?: string;
  clockOut?: string;
  status: "clocked-in" | "clocked-out" | "not-started" | "no-show" | "pending";
  punctuality: "on-time" | "early" | "late" | "no-show";
  lateMinutes?: number;
  earlyMinutes?: number;
  totalHours?: number;
  overtimeHours?: number;
  location?: {
    clockInLocation?: string;
    clockOutLocation?: string;
    isWithinGeofence: boolean;
  };
  notes?: string;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
};

export type TimeEditRequest = {
  id: string;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  clockEntryId: string;
  eventName: string;
  date: string;
  originalClockIn?: string;
  originalClockOut?: string;
  requestedClockIn?: string;
  requestedClockOut?: string;
  reason: string;
  requestType: "missed-punch" | "time-correction" | "forgot-clock-out";
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
};

export type JobWithdrawal = {
  id: string;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  withdrawnAt: string;
  reason: string;
  status: "pending-review" | "acknowledged" | "penalized";
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  penalty?: string;
};

export type OvertimeAlert = {
  id: string;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  weekStartDate: string;
  regularHours: number;
  overtimeHours: number;
  projectedOvertime: number;
  alertType: "approaching" | "exceeded" | "critical";
  isAcknowledged: boolean;
};

export type AttendanceSettings = {
  clockInGracePeriod: number;
  clockOutGracePeriod: number;
  autoClockOutEnabled: boolean;
  autoClockOutAfter: number;

  gpsRestrictionEnabled: boolean;
  geofenceRadius: number;
  requirePhotoVerification: boolean;

  lateThresholdMinutes: number;
  earlyClockInAllowed: boolean;
  earlyClockInMinutes: number;
  missedPunchAutoFlag: boolean;

  manualTimeEditRequiresApproval: boolean;
  overtimeRequiresApproval: boolean;
  overtimeThresholdHours: number;

  noShowAfterMinutes: number;
  autoFlagNoShow: boolean;
};

export type StaffAttendanceSummary = {
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  period: "day" | "week" | "month";
  totalShifts: number;
  attendedShifts: number;
  noShows: number;
  lateArrivals: number;
  earlyDepartures: number;
  totalHoursWorked: number;
  overtimeHours: number;
  attendanceRate: number;
  reliabilityScore: number;
  pendingRequests: number;
};

export type DailyOverview = {
  date: string;
  totalScheduled: number;
  clockedIn: number;
  clockedOut: number;
  notStarted: number;
  late: number;
  noShows: number;
  pendingApprovals: number;
  overtimeAlerts: number;
};

export type PayType = "hourly" | "fixed";

export type PayrollPeriod = "daily" | "weekly" | "bi-weekly" | "monthly";

export type PayrollStatus =
  | "draft"
  | "pending"
  | "approved"
  | "processing"
  | "paid"
  | "rejected";

export type DeductionType =
  | "late-attendance"
  | "no-show"
  | "advance-repayment"
  | "equipment-damage"
  | "other";

export type BonusType =
  | "performance"
  | "overtime"
  | "holiday"
  | "referral"
  | "other";

export type StaffPayInfo = {
  staffId: string;
  staffName: string;
  staffPhone: string;
  staffEmail: string;
  staffAvatar?: string;
  payType: PayType;
  hourlyRate?: number;
  fixedRate?: number;
  overtimeMultiplier: number; // e.g., 1.5x
  taxWithholdingRate: number; // percentage
};

export type PayrollDeduction = {
  id: string;
  type: DeductionType;
  description: string;
  amount: number;
  eventId?: string;
  eventName?: string;
  date: string;
};

export type PayrollBonus = {
  id: string;
  type: BonusType;
  description: string;
  amount: number;
  eventId?: string;
  eventName?: string;
  date: string;
};

export type PayrollEntry = {
  id: string;
  staffId: string;
  staffName: string;
  staffPhone: string;
  staffAvatar?: string;
  payType: PayType;

  // Period info
  periodType: PayrollPeriod;
  periodStart: string;
  periodEnd: string;

  // Work details
  events: {
    eventId: string;
    eventName: string;
    eventDate: string;
    hoursWorked: number;
    overtimeHours: number;
    isFixedRate: boolean;
  }[];

  // Calculations
  totalHours: number;
  regularHours: number;
  overtimeHours: number;

  // Pay calculations
  hourlyRate: number;
  fixedRate: number;
  regularPay: number;
  overtimePay: number;
  grossPay: number;

  // Adjustments
  deductions: PayrollDeduction[];
  bonuses: PayrollBonus[];
  totalDeductions: number;
  totalBonuses: number;

  // Tax
  taxWithholding: number;

  // Final
  netPay: number;

  // Status
  status: PayrollStatus;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
};

export type PaymentHistory = {
  id: string;
  staffId: string;
  staffName: string;
  periodType: PayrollPeriod;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  netPay: number;
  status: PayrollStatus;
  paidAt?: string;
  payrollEntryId: string;
};

export type EventCostBreakdown = {
  eventId: string;
  eventName: string;
  eventDate: string;
  totalStaff: number;
  totalHours: number;
  regularCost: number;
  overtimeCost: number;
  totalCost: number;
  costPerHour: number;
};

export type OvertimeCostBreakdown = {
  eventId: string;
  eventName: string;
  eventDate: string;
  staffCount: number;
  overtimeHours: number;
  overtimeCost: number;
  staffDetails: {
    staffId: string;
    staffName: string;
    hours: number;
    cost: number;
  }[];
};

export type CostForecast = {
  periodStart: string;
  periodEnd: string;
  events: {
    eventId: string;
    eventName: string;
    eventDate: string;
    estimatedStaff: number;
    estimatedHours: number;
    estimatedCost: number;
    estimatedOvertimeCost: number;
  }[];
  totalEstimatedCost: number;
  totalEstimatedOvertimeCost: number;
};

export type PayrollSummary = {
  period: string;
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  totalBonuses: number;
  totalTaxWithholding: number;
  totalOvertimePay: number;
  staffCount: number;
  eventsCount: number;
  totalHours: number;
  averageHourlyRate: number;
};

export type CostMetrics = {
  daily: { date: string; cost: number; overtime: number }[];
  weekly: { week: string; cost: number; overtime: number }[];
  monthly: { month: string; cost: number; overtime: number }[];
  yearly: { year: string; cost: number; overtime: number }[];
};

export type StaffPayslip = {
  staffId: string;
  staffName: string;
  staffPhone: string;
  staffEmail: string;
  staffAvatar?: string;

  periodType: PayrollPeriod;
  periodStart: string;
  periodEnd: string;

  payType: PayType;
  hourlyRate: number;
  fixedRate: number;

  earnings: {
    description: string;
    hours?: number;
    rate?: number;
    amount: number;
  }[];

  deductions: {
    description: string;
    amount: number;
  }[];

  bonuses: {
    description: string;
    amount: number;
  }[];

  grossEarnings: number;
  totalDeductions: number;
  totalBonuses: number;
  taxWithholding: number;
  netPay: number;

  ytdGross: number;
  ytdNet: number;
  ytdTax: number;

  payslipNumber: string;
  generatedAt: string;
  status: PayrollStatus;
};

export type PayrollSettings = {
  defaultOvertimeMultiplier: number;
  overtimeThresholdDaily: number;
  overtimeThresholdWeekly: number;
  defaultTaxRate: number;
  payPeriod: PayrollPeriod;
  payDayOfWeek?: number;
  payDayOfMonth?: number;
  autoApproveThreshold?: number;
  requireApprovalForOvertime: boolean;
  requireApprovalForBonuses: boolean;
};

export type RoleStatus = "active" | "inactive";

export type Role = {
  id: string;
  name: string;
  description?: string;
  payType: PayType;
  defaultRate: number;
  overtimeMultiplier: number;
  color: string;
  icon?: string;
  status: RoleStatus;
  staffCount: number;
  createdAt: string;
  updatedAt: string;
};

export type RoleFormData = {
  name: string;
  description: string;
  payType: PayType;
  defaultRate: number;
  overtimeMultiplier: number;
  color: string;
  status: RoleStatus;
};

export type UUID = string;

export type TenantRole = "owner" | "admin" | "moderator";

export type UserMe = {
  id: UUID;
  email: string;

  first_name: string;
  last_name: string;
  full_name: string;

  phone: string | null;
  avatar: string | null;

  is_saas_admin: boolean;
  is_staff: boolean;
  is_active: boolean;

  current_tenant: EntityRef | null;
  current_company: EntityRef | null;

  tenant_role: TenantRole | null;

  created_at: string;
  updated_at: string;
};

type EntityRef = {
  id: string;
  name: string;
};

export const timeFormats = [
  { value: "12h", label: "12-hour (2:30 PM)" },
  { value: "24h", label: "24-hour (14:30)" },
];

export interface TenantSettings {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  logo_url: string | null;

  email: string;
  phone: string;
  address: string;

  currency: string;
  timezone: string;
  date_format: string;
  time_format: string;

  billing_email: string | null;
  billing_address: string;

  notification_settings: Record<string, any>;
  require_2fa: boolean;

  backup_frequency: string;
  retention_period: number;
  last_backup_at: string | null;
  automatic_backup_enabled: boolean;

  owner_email: string;
  owner_name: string;

  subscription_plan: string;
  subscription_status: string;
  trial_ends_at: string | null;
  subscription_expires: string | null;

  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventType {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  expectedStaffCount: number;
  checkedInCount: number;
  status: "upcoming" | "active" | "completed";
}

export interface StaffType {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photoUrl: string;
  position: string;
  notes?: string;
}

export interface CheckInSession {
  id: string;
  eventId: string;
  event: EventType;
  startedAt: string;
  endedAt?: string;
  startedBy: string;
  endedBy?: string;
  status: "active" | "ended";
  totalCheckedIn: number;
  autoCloseAt: string;
}

export interface CheckOutSession {
  id: string;
  eventId: string;
  event: EventType;
  startedAt: string;
  endedAt?: string;
  startedBy: string;
  endedBy?: string;
  status: "active" | "ended";
  totalCheckedOut: number;
}

export interface CheckInRecord {
  id: string;
  staffId: string;
  staff: StaffType;
  sessionId: string;
  checkInTime: string;
  checkOutTime?: string;
  verifiedBy?: string;
  verificationMethod: "face" | "admin" | "pin";
  isLate: boolean;
  minutesLate?: number;
  capturedPhotoUrl?: string;
}

export interface AdminHelpRequest {
  id: string;
  staffId: string;
  staff: StaffType;
  sessionId: string;
  requestedAt: string;
  status: "pending" | "resolved" | "timeout";
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface LiveStats {
  totalExpected: number;
  checkedIn: number;
  pendingHelpRequests: number;
  lateArrivals: number;
  onTimeArrivals: number;
  recentCheckIns: CheckInRecord[];
}

export interface OfflineCheckIn {
  id: string;
  staffPhone: string;
  staffPin: string;
  capturedPhoto?: string;
  timestamp: string;
  synced: boolean;
}

export type ErrorType =
  | "wrongCredentials"
  | "faceVerificationFailed"
  | "alreadyCheckedIn"
  | "lateArrival"
  | "notScheduled"
  | "sessionEnded"
  | "networkError"
  | "cameraError"
  | "unknown";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorType?: ErrorType;
}

export type SessionMode = "checkin" | "checkout";
export type SessionStatus = "idle" | "active" | "ended";

export interface AppState {
  mode: SessionMode;
  status: SessionStatus;
  currentSession: CheckInSession | CheckOutSession | null;
  currentEvent: Event | null;
  isOnline: boolean;
  offlineQueue: OfflineCheckIn[];
}
