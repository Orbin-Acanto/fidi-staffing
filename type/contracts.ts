export type ContractListItem = {
  id: string;
  contract_number?: string | null;
  status: string;

  event?: string | null;
  event_name?: string | null;
  event_date?: string | null;

  staff?: string | null;
  staff_name?: string | null;
  staff_email?: string | null;

  vendor?: string | null;
  vendor_name?: string | null;
  vendor_email?: string | null;

  role_name?: string | null;

  pay_type?: "hourly" | "fixed" | string | null;
  pay_rate?: string | number | null;

  created_at?: string | null;
  updated_at?: string | null;
};

export type ContractDetail = {
  id: string;
  contract_number?: string | null;
  status: string;

  event?: string | null;
  event_name?: string | null;
  event_date?: string | null;
  event_start_time?: string | null;
  event_end_time?: string | null;
  event_location?: string | null;
  event_location_address?: string | null;

  staff?: string | null;
  staff_name?: string | null;
  staff_email?: string | null;
  staff_phone?: string | null;
  staff_address?: string | null;

  vendor?: string | null;
  vendor_name?: string | null;
  vendor_email?: string | null;
  vendor_phone?: string | null;
  vendor_address?: string | null;

  role_name?: string | null;

  pay_type?: "hourly" | "fixed" | string | null;
  pay_rate?: string | number | null;

  dress_code?: string | null;
  job_description?: string | null;
  additional_details?: string | null;

  terms_and_conditions?: string | null;
  contract_file?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
};

export type OptionItem = { label: string; value: string };

export type PreviewForm = {
  contractId: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  eventName: string;
  eventDate: string;
  eventTimes: string;

  location: string;
  locationAddress: string;

  payType: "hourly" | "fixed";
  rate: number;

  dressCode: string;
  jobDescription: string;
  additionalDetails: string;
};
