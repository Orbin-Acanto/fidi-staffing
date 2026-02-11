export interface EventBackend {
  id: string;
  event_number: string;
  name: string;
  event_type: string;
  event_type_display: string;
  description: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  setup_time: string | null;
  breakdown_time: string | null;
  clock_code: string | null;
  use_custom_location: boolean;
  location: string | null;
  location_name: string | null;
  location_address: string | null;
  venue_name: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  address_country: string | null;
  location_notes: string | null;
  dress_code: string | null;
  special_instructions: string | null;
  budget: string | null;
  estimated_cost: string;
  actual_cost: string | null;
  total_staff_needed: number;
  total_staff_filled: number;
  total_estimated_hours: string;
  auto_assign: boolean;
  status: string;
  status_display: string;
  published_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_by_company_name: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  role_requirements: EventRoleRequirementBackend[];
  staff_assignments: EventStaffAssignmentBackend[];
  vendor_assignments: EventVendorAssignmentBackend[];
}

export interface EventRoleRequirementBackend {
  id: string;
  role: string;
  role_name: string;
  role_color: string;
  start_time: string;
  end_time: string;
  pay_type: string;
  event_rate: string;
  staff_count: number;
  filled_count: number;
  estimated_hours: string;
  estimated_cost: string;
  notes: string | null;
}

export interface EventStaffAssignmentBackend {
  id: string;
  staff: string;
  staff_name: string;
  staff_email: string;
  staff_phone: string;
  staff_avatar: string | null;
  staff_company_name: string;
  role: string;
  role_name: string;
  start_time: string;
  end_time: string;
  pay_type: string;
  pay_rate: string;
  status: string;
  confirmation_status: string;
  confirmed_at: string | null;
  declined_at: string | null;
  decline_reason: string | null;
  notes: string | null;
  assigned_at: string;
}

export interface EventVendorAssignmentBackend {
  id: string;
  vendor: string;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  vendor_service_type: string;
  service_type: string | null;
  contract_amount: string | null;
  status: string;
  confirmed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  notes: string | null;
  assigned_at: string;
}

export interface EventFormData {
  eventName: string;
  eventType: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  setupTime: string;
  breakdownTime: string;
  clockCode: string;
  useCustomLocation: boolean;
  savedLocationId: string;
  venueName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  locationNotes: string;
  assignedGroups: string[];
  autoAssign: boolean;
  dressCode: string;
  specialInstructions: string;
  budget: string;
}

export interface EventRoleRequirement {
  id: string;
  roleId: string;
  roleName: string;
  roleColor?: string;
  startTime: string;
  endTime: string;
  payType: "hourly" | "fixed";
  eventRate: number;
  defaultRate: number;
  staffCount: number;
  estimatedHours: number;
  estimatedCost: number;
  notes: string;
}
