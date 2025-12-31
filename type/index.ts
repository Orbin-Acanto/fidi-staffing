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
  wage: number;

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

export type UserRole = "Admin" | "Manager" | "Staff";

export type UserStatus = "Active" | "Suspended" | "Deactivated";

export type UserPermissions = {
  canCreateEditDeleteEvents: boolean;
  canCreateEditDeleteStaff: boolean;
  canViewReports: boolean;
  canManageLocations: boolean;
  canManageGroups: boolean;
  canAccessSettings: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  permissions: UserPermissions;
  createdAt: string;
  lastActive?: string;
  department?: string;
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

export const defaultPermissionsByRole: Record<UserRole, UserPermissions> = {
  Admin: {
    canCreateEditDeleteEvents: true,
    canCreateEditDeleteStaff: true,
    canViewReports: true,
    canManageLocations: true,
    canManageGroups: true,
    canAccessSettings: true,
  },
  Manager: {
    canCreateEditDeleteEvents: true,
    canCreateEditDeleteStaff: true,
    canViewReports: true,
    canManageLocations: true,
    canManageGroups: true,
    canAccessSettings: false,
  },
  Staff: {
    canCreateEditDeleteEvents: false,
    canCreateEditDeleteStaff: false,
    canViewReports: false,
    canManageLocations: false,
    canManageGroups: false,
    canAccessSettings: false,
  },
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

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "Admin";
  department?: string;
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
