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
}
