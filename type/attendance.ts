export interface ClockEntry {
  id: string;
  staff: string;
  staff_name: string;
  staff_phone: string;
  staff_avatar: string | null;
  event: string;
  event_name: string;
  company_name: string;
  date: string;
  scheduled_start: string;
  scheduled_end: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  status: "checked_in" | "clocked_out" | "no_show";
  punctuality: "on_time" | "early" | "late" | null;
  actual_hours: string;
  overtime_hours: string;
  requires_approval: boolean;
  is_flagged: boolean;
  created_at: string;
  approved_by?: string | null;
  approved_at?: string | null;
}

export interface ClockEntryDetail extends ClockEntry {
  staff_email: string;
  event_number: string;
  role_name: string;
  approved_by_name: string | null;
  approved_at: string | null;
  break_start: string | null;
  break_end: string | null;
  break_duration_minutes: number;
  flagged_at: string | null;
  auto_clocked_out_at: string | null;
  clock_in_location: string | null;
  clock_in_latitude: string | null;
  clock_in_longitude: string | null;
  clock_in_photo: string | null;
  clock_in_verification_photo: string | null;
  clock_in_face_verified: boolean;
  clock_in_verification_status: "verified" | "failed" | "pending" | null;
  clock_in_verification_score: string | null;
  clock_in_notes: string;
  clock_in_by_admin: string | null;
  clock_out_location: string | null;
  clock_out_latitude: string | null;
  clock_out_longitude: string | null;
  clock_out_photo: string | null;
  clock_out_notes: string;
  clock_out_by_admin: string | null;
  flag_reason: string | null;
  approval_reason: string | null;
  auto_clocked_out: boolean;
  notes: string | null;
  updated_at: string;
  tenant: string;
  company: string;
  assignment: string;
  clock_session: string;
  flagged_by: string | null;
  approved_by: string | null;
}

export interface AttendanceStatistics {
  overview: {
    total_entries: number;
    checked_in: number;
    checked_out: number;
    no_show: number;
    flagged: number;
    pending_approval: number;
  };
  punctuality: {
    on_time: number;
    early: number;
    late: number;
    on_time_percentage: number;
  };
  hours: {
    total_regular_hours: number;
    total_overtime_hours: number;
    average_hours_per_shift: number;
  };
  verification: {
    face_verified: number;
    face_failed: number;
    manual_override: number;
    verification_rate: number;
  };
  automation: {
    auto_clocked_out: number;
  };
}

export interface TimeEditRequest {
  id: string;
  clock_entry: string;
  staff: string;
  staff_name: string;
  staff_phone: string;
  event_name: string;
  request_type:
    | "missed_check_in"
    | "missed_check_out"
    | "both_missed"
    | "time_correction";
  requested_clock_in: string | null;
  requested_clock_out: string | null;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string;
  created_at: string;
  updated_at: string;
}

export interface EventSummary {
  summary: {
    event_id: string;
    event_name: string;
    event_date: string;
    total_assigned: number;
    total_checked_in: number;
    total_checked_out: number;
    total_no_show: number;
    total_flagged: number;
    pending_approval: number;
    punctuality: {
      on_time: number;
      early: number;
      late: number;
    };
    hours: {
      total_regular_hours: number;
      total_overtime_hours: number;
    };
  };
  companies: Array<{
    company_id: string;
    company_name: string;
    total_staff: number;
    checked_in: number;
    checked_out: number;
    no_show: number;
  }>;
  entries: ClockEntry[];
}

export interface Event {
  id: string;
  event_number: string;
  name: string;
  event_type: string;
  event_type_display: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  status: string;
  status_display: string;
  created_by_company_name: string;
  location_name: string;
  location_address: string;
  total_staff_needed: number;
  total_staff_filled: number;
  total_estimated_hours: string;
  estimated_cost: string;
  created_at: string;
  updated_at: string;
  client_name: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface StaffSummary {
  staff_id: string;
  staff_name: string;
  staff_avatar: string | null;
  total_shifts: number;
  attended_shifts: number;
  no_shows: number;
  late_arrivals: number;
  total_hours: number;
  reliability_score: number;
}
