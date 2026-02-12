"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import { dressCodes, eventTypes } from "@/data";
import { AppSelect } from "@/component/ui/Select";
import { AppDatePicker } from "@/component/ui/AppDatePicker";
import { AppTimePicker } from "@/component/ui/AppTimePicker";

import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import {
  EventBackend,
  EventFormData,
  EventRoleRequirement,
  Role,
  Location,
} from "@/type/events";
import EventStaffingSection from "@/component/event/Eventstaffingsection";

interface StaffGroup {
  id: string;
  name: string;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.event_id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  const [roles, setRoles] = useState<Role[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [groups, setGroups] = useState<StaffGroup[]>([]);
  const [event, setEvent] = useState<EventBackend | null>(null);

  const [selectedLocationId, setSelectedLocationId] =
    useState<string>("custom");

  const [formData, setFormData] = useState<EventFormData>({
    eventName: "",
    eventType: "",
    description: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    setupTime: "",
    breakdownTime: "",
    clockCode: "",
    useCustomLocation: true,
    savedLocationId: "",
    venueName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    locationNotes: "",
    assignedGroups: [],
    autoAssign: false,
    dressCode: "",
    specialInstructions: "",
    budget: "",
  });

  const [staffingRequirements, setStaffingRequirements] = useState<
    EventRoleRequirement[]
  >([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchInitialData = async () => {
    setIsLoadingData(true);
    try {
      const [rolesResponse, locationsResponse, groupsResponse] =
        await Promise.all([
          apiFetch("/api/roles/list?status=active"),
          apiFetch("/api/locations/list?status=active"),
          apiFetch("/api/groups/list?is_active=true"),
        ]);

      setRoles(rolesResponse.roles || []);
      setLocations(locationsResponse.results || []);
      setGroups(groupsResponse.groups || []);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      toastError("Failed to load form data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchEvent = async () => {
    setIsLoadingEvent(true);
    try {
      const eventData: EventBackend = await apiFetch(`/api/events/${eventId}`);
      setEvent(eventData);

      const useCustomLocation = eventData.use_custom_location;
      const savedLocationId = eventData.location || "";

      setFormData({
        eventName: eventData.name,
        eventType: eventData.event_type,
        description: eventData.description || "",
        clientName: eventData.client_name || "",
        clientEmail: eventData.client_email || "",
        clientPhone: eventData.client_phone || "",
        eventDate: eventData.event_date,
        startTime: eventData.start_time,
        endTime: eventData.end_time,
        setupTime: eventData.setup_time || "",
        breakdownTime: eventData.breakdown_time || "",
        clockCode: eventData.clock_code || "",
        useCustomLocation: useCustomLocation,
        savedLocationId: savedLocationId,
        venueName: eventData.venue_name || "",
        street: eventData.address_street || "",
        city: eventData.address_city || "",
        state: eventData.address_state || "",
        zipCode: eventData.address_zip || "",
        country: eventData.address_country || "United States",
        locationNotes: eventData.location_notes || "",
        assignedGroups: [],
        autoAssign: eventData.auto_assign,
        dressCode: eventData.dress_code || "",
        specialInstructions: eventData.special_instructions || "",
        budget: eventData.budget || "",
      });

      setSelectedLocationId(useCustomLocation ? "custom" : savedLocationId);

      if (
        eventData.role_requirements &&
        eventData.role_requirements.length > 0
      ) {
        const requirements: EventRoleRequirement[] =
          eventData.role_requirements.map((req) => ({
            id: req.id,
            roleId: req.role,
            roleName: req.role_name,
            roleColor: req.role_color,
            startTime: req.start_time,
            endTime: req.end_time,
            payType: req.pay_type as "hourly" | "fixed",
            eventRate: parseFloat(req.event_rate),
            defaultRate: parseFloat(req.event_rate),
            staffCount: req.staff_count,
            estimatedHours: parseFloat(req.estimated_hours),
            estimatedCost: parseFloat(req.estimated_cost),
            notes: req.notes || "",
          }));
        setStaffingRequirements(requirements);
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toastError("Failed to load event data");
      router.push("/admin/events");
    } finally {
      setIsLoadingEvent(false);
    }
  };

  const applySavedLocation = (locationId: string): boolean => {
    setSelectedLocationId(locationId);

    if (locationId === "custom") {
      setFormData((prev) => ({
        ...prev,
        useCustomLocation: true,
        savedLocationId: "",
      }));
      return true;
    }

    const loc = locations.find((l) => String(l.id) === String(locationId));
    if (!loc) return false;

    setFormData((prev) => ({
      ...prev,
      useCustomLocation: false,
      savedLocationId: String(locationId),
      venueName: loc.venue_name ?? "",
      street: loc.street ?? "",
      city: loc.city ?? "",
      state: loc.state ?? "",
      zipCode: loc.zip_code ?? "",
      country: loc.country ?? "United States",
      locationNotes: loc.notes ?? "",
    }));

    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (
      [
        "venueName",
        "street",
        "city",
        "state",
        "zipCode",
        "locationNotes",
      ].includes(name)
    ) {
      setSelectedLocationId("custom");
      setFormData((prev) => ({
        ...prev,
        useCustomLocation: true,
        savedLocationId: "",
      }));
    }

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleToggleGroup = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedGroups: prev.assignedGroups.includes(groupId)
        ? prev.assignedGroups.filter((g) => g !== groupId)
        : [...prev.assignedGroups, groupId],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = "Event name is required";
    }
    if (!formData.eventType) {
      newErrors.eventType = "Event type is required";
    }
    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.useCustomLocation) {
      if (!formData.street.trim()) {
        newErrors.street = "Street address is required";
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
    } else {
      if (!formData.savedLocationId) {
        newErrors.location = "Please select a location or use custom location";
      }
    }

    if (formData.clientEmail && !isValidEmail(formData.clientEmail)) {
      newErrors.clientEmail = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toastError("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const roleRequirements = staffingRequirements.map((req) => ({
        role: req.roleId,
        start_time: req.startTime,
        end_time: req.endTime,
        pay_type: req.payType,
        event_rate: req.eventRate,
        staff_count: req.staffCount,
        notes: req.notes || "",
      }));

      const payload = {
        name: formData.eventName.trim(),
        event_type: formData.eventType,
        description: formData.description.trim() || null,
        client_name: formData.clientName.trim() || null,
        client_email: formData.clientEmail.trim() || null,
        client_phone: formData.clientPhone.trim() || null,
        event_date: formData.eventDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        setup_time: formData.setupTime || null,
        breakdown_time: formData.breakdownTime || null,
        clock_code: formData.clockCode.trim() || null,
        use_custom_location: formData.useCustomLocation,
        location: formData.useCustomLocation ? null : formData.savedLocationId,
        venue_name: formData.useCustomLocation
          ? formData.venueName.trim() || null
          : null,
        address_street: formData.useCustomLocation
          ? formData.street.trim()
          : null,
        address_city: formData.useCustomLocation ? formData.city.trim() : null,
        address_state: formData.useCustomLocation
          ? formData.state.trim() || null
          : null,
        address_zip: formData.useCustomLocation
          ? formData.zipCode.trim() || null
          : null,
        address_country: formData.useCustomLocation ? formData.country : null,
        location_notes: formData.locationNotes.trim() || null,
        dress_code: formData.dressCode || null,
        special_instructions: formData.specialInstructions.trim() || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        auto_assign: formData.autoAssign,
        assigned_groups: formData.assignedGroups,
        role_requirements: roleRequirements,
      };

      await apiFetch(`/api/events/${eventId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toastSuccess("Event updated successfully!");
      router.push("/admin/events");
    } catch (error: unknown) {
      console.error("Error updating event:", error);

      if (error && typeof error === "object" && "errors" in error) {
        const apiErrors = error.errors as Record<string, string[] | string>;
        const formErrors: Record<string, string> = {};

        Object.keys(apiErrors).forEach((key) => {
          const fieldMap: Record<string, string> = {
            name: "eventName",
            event_type: "eventType",
            event_date: "eventDate",
            start_time: "startTime",
            end_time: "endTime",
            address_street: "street",
            address_city: "city",
            client_email: "clientEmail",
            client_phone: "clientPhone",
          };

          const frontendKey = fieldMap[key] || key;
          const errorValue = apiErrors[key];
          formErrors[frontendKey] = Array.isArray(errorValue)
            ? errorValue[0]
            : errorValue;
        });

        setErrors(formErrors);
      }

      if (error && typeof error === "object" && "message" in error) {
        toastError(error.message as string);
      } else {
        toastError("Failed to update event. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData || isLoadingEvent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="animate-spin h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 font-secondary mb-4">Event not found</p>
        <Link
          href="/admin/events"
          className="px-4 py-2 bg-primary text-dark-black font-secondary font-semibold rounded-lg hover:bg-primary/80"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-primary font-semibold text-gray-900">
            Edit Event
          </h1>
          <p className="text-sm font-secondary text-gray-600 mt-1">
            Update event details and staffing requirements
          </p>
        </div>
        <Link
          href="/admin/events"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Events
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Event Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.eventName
                             ? "border-red-500"
                             : "border-gray-300"
                         }`}
                placeholder="Johnson Wedding Reception"
              />
              {errors.eventName && (
                <p className="mt-1 text-sm text-red-500">{errors.eventName}</p>
              )}
            </div>

            <div>
              <AppSelect
                label={
                  <>
                    Event Type <span className="text-red-500">*</span>
                  </>
                }
                value={formData.eventType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    eventType: value,
                  }))
                }
                placeholder="Select event type"
                options={eventTypes.map((type) => ({
                  label: type,
                  value: type.toLowerCase().replace(/ /g, "_"),
                }))}
              />
              {errors.eventType && (
                <p className="mt-1 text-sm text-red-500">{errors.eventType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Client Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.clientEmail
                             ? "border-red-500"
                             : "border-gray-300"
                         }`}
                placeholder="client@example.com"
              />
              {errors.clientEmail && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.clientEmail}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Client Phone
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Description/Notes
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Brief description of the event..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Date & Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <AppDatePicker
                label={
                  <>
                    Event Date <span className="text-red-500">*</span>
                  </>
                }
                value={formData.eventDate}
                onChange={(ymd) =>
                  setFormData((prev) => ({
                    ...prev,
                    eventDate: ymd,
                  }))
                }
              />
              {errors.eventDate && (
                <p className="mt-1 text-sm text-red-500">{errors.eventDate}</p>
              )}
            </div>

            <div>
              <AppTimePicker
                label={
                  <>
                    Start Time <span className="text-red-500">*</span>
                  </>
                }
                value={formData.startTime}
                onChange={(time) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: time,
                  }))
                }
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>

            <div>
              <AppTimePicker
                label={
                  <>
                    End Time <span className="text-red-500">*</span>
                  </>
                }
                value={formData.endTime}
                onChange={(time) =>
                  setFormData((prev) => ({
                    ...prev,
                    endTime: time,
                  }))
                }
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>

            <div>
              <AppTimePicker
                label="Setup Time (Optional)"
                value={formData.setupTime}
                onChange={(time) =>
                  setFormData((prev) => ({
                    ...prev,
                    setupTime: time,
                  }))
                }
              />
            </div>

            <div>
              <AppTimePicker
                label="Breakdown Time (Optional)"
                value={formData.breakdownTime}
                onChange={(time) =>
                  setFormData((prev) => ({
                    ...prev,
                    breakdownTime: time,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Clock Code
              </label>
              <input
                type="text"
                name="clockCode"
                value={formData.clockCode}
                onChange={handleInputChange}
                placeholder="Enter clock code"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg font-secondary text-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AppSelect
                label="Use saved location"
                value={selectedLocationId}
                onValueChange={applySavedLocation}
                placeholder="Choose a saved location (optional)"
                options={[
                  { label: "Custom / New location", value: "custom" },
                  ...locations.map((l) => ({
                    label: l.name,
                    value: l.id,
                  })),
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Venue Name
              </label>
              <input
                type="text"
                name="venueName"
                value={formData.venueName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Grand Ballroom"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.street ? "border-red-500" : "border-gray-300"
                         }`}
                placeholder="123 Main Street"
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-500">{errors.street}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200 ${
                           errors.city ? "border-red-500" : "border-gray-300"
                         }`}
                placeholder="New York"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="NY"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="10001"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Location Notes (Parking, Access, etc.)
              </label>
              <textarea
                name="locationNotes"
                value={formData.locationNotes}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Parking available in rear lot, use side entrance..."
              />
            </div>
          </div>
        </div>

        <EventStaffingSection
          roles={roles}
          requirements={staffingRequirements}
          onRequirementsChange={setStaffingRequirements}
          eventStartTime={formData.startTime}
          eventEndTime={formData.endTime}
          autoAssign={formData.autoAssign}
          onAutoAssignChange={(value) =>
            setFormData((prev) => ({ ...prev, autoAssign: value }))
          }
          assignedGroups={formData.assignedGroups}
          availableGroups={groups}
          onToggleGroup={handleToggleGroup}
        />

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AppSelect
                label="Dress Code"
                value={formData.dressCode}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    dressCode: value,
                  }))
                }
                placeholder="Select dress code"
                options={dressCodes.map((code) => ({
                  label: code,
                  value: code.toLowerCase().replace(/ /g, "_"),
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Budget (Optional)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="5000.00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Dietary restrictions, special requirements, important notes..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/events"
              className="w-full sm:w-auto inline-flex justify-center text-gray-700 bg-gray-200 px-6 py-2.5 cursor-pointer font-secondary font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex justify-center px-6 py-2.5 
                   bg-primary cursor-pointer text-white font-secondary font-medium rounded-lg hover:bg-primary/90  transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transform sm:hover:scale-105 active:scale-95"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating...
                </span>
              ) : (
                <div className="inline-flex items-center gap-2">
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
                  "Update Event"
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
