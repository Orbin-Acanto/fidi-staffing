export interface StaffRole {
  id: string;
  name: string;
}

export interface StaffGroup {
  id: string;
  name: string;
}

export interface StaffMemberBackend {
  id: string;
  employee_id: string;
  company: string;
  company_name: string;
  user: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  secondary_phone: string | null;
  avatar: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  address_country: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relation: string | null;
  primary_role: StaffRole | null;
  secondary_roles: StaffRole[];
  experience_level: string;
  employment_type: string;
  uniform_size: string | null;
  groups: StaffGroup[];
  status: string;
  availability_status: string;
  hire_date: string | null;
  termination_date: string | null;
  rating: string;
  total_reviews: number;
  total_events_worked: number;
  total_hours_worked: string;
  reliability_score: string;
  created_at: string;
  updated_at: string;
  pay_type: string;
  hourly_rate: number | null;
  fixed_rate: number | null;
  overtime_multiplier: number;
  tax_withholding_rate: number;
  effective_hourly_rate: number | null;
  effective_fixed_rate: number | null;
  notes: string | null;
}

export interface StaffListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StaffMemberBackend[];
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  secondaryPhone: string;
  dateOfBirth: string;
  gender: string;
  profilePicture: File | null;
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
  emergencyContactRelation: string;
  username: string;
  password: string;
  confirmPassword: string;
  status: string;
  wage: number;
  payType: "hourly" | "fixed";
  fixedRate: number;
  uniformSize: string;
  overtimeMultiplier: number;
  taxWithholdingRate: number;
  notes: string;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  groups: string[];
  status: string;
  lastActive: string;
  wage: string;
}

export interface StaffNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  type: "general" | "warning" | "praise" | "incident";
}

export interface StaffReview {
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
}

export interface StaffPerformance {
  averageRating: number;
  totalReviews: number;
  attendance: {
    totalShifts: number;
    attendanceRate: number;
    lateArrivals: number;
    noShows: number;
  };
  reviews: StaffReview[];
  notes: StaffNote[];
}
