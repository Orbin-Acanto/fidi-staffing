export interface VendorCategory {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorBackend {
  id: string;
  company_name: string;
  display_name: string | null;
  effective_name: string;
  vendor_type: string | null;
  vendor_type_name: string | null;
  status: "active" | "inactive" | "on_hold" | "archived";
  website: string | null;
  primary_contact_name: string | null;
  primary_contact_title: string | null;
  work_phone: string | null;
  cell_phone: string | null;
  email: string | null;
  business_address_street: string | null;
  business_address_city: string | null;
  business_address_state: string | null;
  business_address_zip: string | null;
  business_address_country: string;
  full_business_address: string | null;
  services_provided: string | null;
  fees_rates: string | null;
  rating: string;
  total_reviews: number;
  is_preferred: boolean;
  tax_id: string | null;
  insurance_expiry_date: string | null;
  contract_expiry_date: string | null;
  logo: string | null;
  logo_url: string | null;
  created_by_company: string | null;
  created_by_company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorDocument {
  id: string;
  document_type: "agreement" | "invoice" | "insurance" | "form" | "other";
  name: string;
  file: string;
  file_url: string | null;
  expiry_date: string | null;
  is_verified: boolean;
  verified_by: string | null;
  verified_by_name: string | null;
  verified_at: string | null;
  notes: string | null;
  uploaded_by: string | null;
  uploaded_by_name: string | null;
  uploaded_at: string;
}

export interface VendorMedia {
  id: string;
  media_type: "image" | "video";
  title: string | null;
  file: string;
  file_url: string | null;
  is_featured: boolean;
  notes: string | null;
  uploaded_by: string | null;
  uploaded_by_name: string | null;
  uploaded_at: string;
}

export interface VendorReview {
  id: string;
  rating: string;
  notes: string | null;
  event: string | null;
  event_name: string | null;
  created_by: string | null;
  created_by_name: string | null;
  created_at: string;
}

export interface VendorDetail extends VendorBackend {
  internal_feedback_notes: string | null;
  created_by: string | null;
  created_by_name: string | null;
  documents: VendorDocument[];
  media: VendorMedia[];
  reviews: VendorReview[];
}

export interface VendorFormData {
  companyName: string;
  displayName: string;
  vendorType: string;
  status: "active" | "inactive" | "on_hold" | "archived";
  website: string;
  primaryContactName: string;
  primaryContactTitle: string;
  workPhone: string;
  cellPhone: string;
  email: string;
  businessAddressStreet: string;
  businessAddressCity: string;
  businessAddressState: string;
  businessAddressZip: string;
  businessAddressCountry: string;
  servicesProvided: string;
  feesRates: string;
  isPreferred: boolean;
  taxId: string;
  insuranceExpiryDate: string;
  contractExpiryDate: string;
  internalFeedbackNotes: string;
}
