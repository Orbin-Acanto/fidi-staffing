export type BackendLocation = {
  id: string;

  name: string;
  venue_name: string | null;

  street: string;
  city: string;
  state: string | null;
  zip_code: string | null;
  country: string;

  full_address: string;

  latitude: string | number | null;
  longitude: string | number | null;
  geofence_radius: number;

  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;

  notes: string | null;

  is_active: boolean;
  is_favorite: boolean;

  created_at: string;
  updated_at: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ListLocationsResponse = PaginatedResponse<BackendLocation>;

export type CitiesResponse = {
  cities: string[];
};

export type UiLocation = {
  id: string;

  locationName: string;
  venueName: string;

  label: string;

  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  latitude: number | null;
  longitude: number | null;
  geofenceRadius: number;

  contactPerson: string;
  phoneNumber: string;
  contactEmail: string;

  locationNotes: string;

  isFavorite: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  eventsCount: number;
};

function toNumberOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function toTrimmedOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function toTrimmedOrEmpty(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

export function mapBackendLocationToUi(b: BackendLocation): UiLocation {
  const locationName = toTrimmedOrEmpty(b.name);
  const venueName = toTrimmedOrEmpty(b.venue_name);

  const title = venueName.length ? venueName : locationName;
  const statePart = b.state ? `, ${b.state}` : "";
  const label = `${title}, ${b.city}${statePart}`;

  return {
    id: b.id,

    locationName,
    venueName,

    label,

    street: toTrimmedOrEmpty(b.street),
    city: toTrimmedOrEmpty(b.city),
    state: toTrimmedOrEmpty(b.state),
    zipCode: toTrimmedOrEmpty(b.zip_code),
    country: toTrimmedOrEmpty(b.country) || "United States",

    latitude: toNumberOrNull(b.latitude),
    longitude: toNumberOrNull(b.longitude),
    geofenceRadius:
      typeof b.geofence_radius === "number" &&
      Number.isFinite(b.geofence_radius)
        ? b.geofence_radius
        : 100,

    contactPerson: toTrimmedOrEmpty(b.contact_name),
    phoneNumber: toTrimmedOrEmpty(b.contact_phone),
    contactEmail: toTrimmedOrEmpty(b.contact_email),

    locationNotes: toTrimmedOrEmpty(b.notes),

    isFavorite: !!b.is_favorite,
    isActive: !!b.is_active,

    createdAt: b.created_at,
    updatedAt: b.updated_at,

    eventsCount: 0,
  };
}

export type CreateLocationPayload = {
  name: string;
  venue_name: string | null;

  street: string;
  city: string;
  state: string | null;
  zip_code: string | null;
  country: string;

  latitude: number | null;
  longitude: number | null;
  geofence_radius: number;

  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;

  notes: string | null;

  is_favorite: boolean;
};

export type UpdateLocationPayload = CreateLocationPayload & {
  is_active: boolean;
};

export function mapUiToCreateLocationPayload(
  ui: UiLocation,
): CreateLocationPayload {
  const name = toTrimmedOrEmpty(ui.locationName || ui.venueName);
  const venue_name = toTrimmedOrNull(ui.venueName);

  return {
    name,
    venue_name,

    street: toTrimmedOrEmpty(ui.street),
    city: toTrimmedOrEmpty(ui.city),
    state: toTrimmedOrNull(ui.state),
    zip_code: toTrimmedOrNull(ui.zipCode),
    country: toTrimmedOrEmpty(ui.country) || "United States",

    latitude: toNumberOrNull(ui.latitude),
    longitude: toNumberOrNull(ui.longitude),
    geofence_radius:
      typeof ui.geofenceRadius === "number" &&
      Number.isFinite(ui.geofenceRadius)
        ? ui.geofenceRadius
        : 100,

    contact_name: toTrimmedOrNull(ui.contactPerson),
    contact_phone: toTrimmedOrNull(ui.phoneNumber),
    contact_email: toTrimmedOrNull(ui.contactEmail),

    notes: toTrimmedOrNull(ui.locationNotes),

    is_favorite: !!ui.isFavorite,
  };
}

export function mapUiToUpdateLocationPayload(
  ui: UiLocation,
): UpdateLocationPayload {
  return {
    ...mapUiToCreateLocationPayload(ui),
    is_active: !!ui.isActive,
  };
}
