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
