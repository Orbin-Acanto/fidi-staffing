"use client";

import { SavedLocation } from "@/type";
import { useState, useEffect } from "react";
import { AppCheckbox } from "../ui/Checkbox";

interface AddEditLocationModalProps {
  location?: SavedLocation | null;
  onClose: () => void;
  onSave: (data: Partial<SavedLocation>) => void;
}

export default function AddEditLocationModal({
  location,
  onClose,
  onSave,
}: AddEditLocationModalProps) {
  const isEditing = !!location;

  const [formData, setFormData] = useState({
    locationName: "",
    venueName: "",

    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    latitude: "" as string,
    longitude: "" as string,
    geofenceRadius: "100" as string,

    contactPerson: "",
    phoneNumber: "",
    contactEmail: "",

    locationNotes: "",
    isFavorite: false,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!location) return;

    setFormData({
      locationName: (location as any).locationName || location.venueName || "",
      venueName: location.venueName || "",

      street: location.street || "",
      city: location.city || "",
      state: location.state || "",
      zipCode: location.zipCode || "",
      country: location.country || "United States",

      latitude:
        (location as any).latitude !== null &&
        (location as any).latitude !== undefined
          ? String((location as any).latitude)
          : "",
      longitude:
        (location as any).longitude !== null &&
        (location as any).longitude !== undefined
          ? String((location as any).longitude)
          : "",
      geofenceRadius: String((location as any).geofenceRadius ?? 100),

      contactPerson: location.contactPerson || "",
      phoneNumber: location.phoneNumber || "",
      contactEmail: (location as any).contactEmail || "",

      locationNotes: location.locationNotes || "",
      isFavorite: location.isFavorite || false,
      isActive: location.isActive ?? true,
    });
  }, [location]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.locationName.trim())
      newErrors.locationName = "Location name is required";
    if (!formData.street.trim())
      newErrors.street = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    const lat = formData.latitude.trim();
    const lng = formData.longitude.trim();

    if ((lat && !lng) || (!lat && lng)) {
      newErrors.latitude = "Latitude and longitude must be set together";
      newErrors.longitude = "Latitude and longitude must be set together";
    }

    if (lat) {
      const n = Number(lat);
      if (!Number.isFinite(n) || n < -90 || n > 90)
        newErrors.latitude = "Latitude must be between -90 and 90";
    }

    if (lng) {
      const n = Number(lng);
      if (!Number.isFinite(n) || n < -180 || n > 180)
        newErrors.longitude = "Longitude must be between -180 and 180";
    }

    const r = Number(formData.geofenceRadius);
    if (!Number.isFinite(r) || r < 10 || r > 10000) {
      newErrors.geofenceRadius = "Geofence radius must be 10 to 10,000 meters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const title = formData.venueName.trim() || formData.locationName.trim();
    const label = `${title}, ${formData.city}${formData.state ? `, ${formData.state}` : ""}`;

    onSave({
      id: location?.id,
      label,

      locationName: formData.locationName.trim(),
      venueName: formData.venueName.trim(),

      street: formData.street.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zipCode: formData.zipCode.trim(),
      country: formData.country || "United States",

      latitude: formData.latitude.trim()
        ? Number(formData.latitude.trim())
        : undefined,
      longitude: formData.longitude.trim()
        ? Number(formData.longitude.trim())
        : undefined,
      geofenceRadius: Number(formData.geofenceRadius),

      contactPerson: formData.contactPerson.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      contactEmail: formData.contactEmail.trim(),

      locationNotes: formData.locationNotes.trim(),

      isFavorite: !!formData.isFavorite,
      isActive: !!formData.isActive,
    });
  };

  const fullAddress = `${formData.street}, ${formData.city}${formData.state ? `, ${formData.state}` : ""}${formData.zipCode ? ` ${formData.zipCode}` : ""}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-700/70 transition-opacity" />

        <div className="relative inline-block w-full max-w-2xl my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-primary font-bold text-gray-900">
                  {isEditing ? "Edit Location" : "Add New Location"}
                </h2>
                <p className="text-sm font-secondary text-gray-500">
                  {isEditing
                    ? "Update the location details"
                    : "Enter the venue information below"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    Location Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleChange}
                    placeholder="e.g., Midtown Warehouse"
                    className={`w-full px-4 py-2 border rounded-lg font-secondary text-sm text-gray-900
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-200 ${
                      errors.locationName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.locationName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.locationName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    Venue Name <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleChange}
                    placeholder="e.g., The Plaza Hotel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-primary font-semibold text-gray-900">
                  Address
                </h3>

                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g., 768 5th Ave"
                    className={`w-full px-4 py-2 border rounded-lg font-secondary text-sm text-gray-900
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-200 ${errors.street ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-500">{errors.street}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                      className={`w-full px-4 py-2 border rounded-lg font-secondary text-sm text-gray-900
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200 ${errors.city ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      State <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="NY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      ZIP Code <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="10019"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value="United States"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-700
                    bg-gray-100 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              {formData.street && formData.city && (
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <div className="relative h-32">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Map Preview"
                      allowFullScreen
                    />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-secondary text-gray-700 hover:bg-white shadow-sm transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Open in Maps
                    </a>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-primary font-semibold text-gray-900">
                  Geofence{" "}
                  <span className="text-gray-400 text-sm font-secondary">
                    (optional)
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="40.7614"
                      className={`w-full px-4 py-2 border rounded-lg font-secondary text-sm text-gray-900
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200 ${errors.latitude ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.latitude && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.latitude}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="-73.9776"
                      className={`w-full px-4 py-2 border rounded-lg font-secondary text-sm text-gray-900
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200 ${errors.longitude ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.longitude && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.longitude}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Radius (meters)
                    </label>
                    <input
                      type="number"
                      name="geofenceRadius"
                      value={formData.geofenceRadius}
                      onChange={handleChange}
                      min={10}
                      max={10000}
                      className={`w-full px-4 py-2 border rounded-lg font-secondary text-sm text-gray-900
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200 ${errors.geofenceRadius ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.geofenceRadius && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.geofenceRadius}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-primary font-semibold text-gray-900">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="e.g., John Smith"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g., +1 (212) 555-0123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="e.g., venue@company.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  name="locationNotes"
                  value={formData.locationNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., Parking instructions, security requirements, loading dock access..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <AppCheckbox
                    checked={formData.isFavorite}
                    onCheckedChange={(checked) =>
                      setFormData((p) => ({ ...p, isFavorite: !!checked }))
                    }
                  />
                  <label className="text-sm font-secondary text-gray-700">
                    Mark as favorite venue
                  </label>
                </div>

                {isEditing && (
                  <div className="flex items-center gap-3">
                    <AppCheckbox
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData((p) => ({ ...p, isActive: !!checked }))
                      }
                    />
                    <label className="text-sm font-secondary text-gray-700">
                      Active location
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 cursor-pointer font-secondary font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary cursor-pointer text-white font-secondary font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {isEditing ? "Save Changes" : "Add Location"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
