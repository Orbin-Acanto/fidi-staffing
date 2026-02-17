import { AUDIT_FILTERS } from "@/data";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type StaffItem = {
  id: string;
  status?: string;
  availability_status?: string;
};

export type VendorItem = {
  id: string;
  status?: string;
};

export type EventItem = {
  id: string;
  name?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  status_display?: string;
  location_name?: string;
  location_address?: string;
  total_staff_needed?: number;
  total_staff_filled?: number;
};

export type PendingContractsResponse = {
  contracts: any[];
  page: number;
  page_size: number;
  total: number;
};

export type AuditLogItem = {
  id: string;
  action: string;
  action_display: string;
  severity: string;
  severity_display: string;
  user_email: string | null;
  user_full_name: string | null;
  user_role: string | null;
  company_name: string | null;
  object_type: string | null;
  object_repr: string | null;
  description: string;
  created_at: string;
};

export type AuditFilterValue = (typeof AUDIT_FILTERS)[number]["value"];
