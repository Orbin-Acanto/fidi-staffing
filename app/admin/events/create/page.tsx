"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EventFormData } from "@/type";
import {
  availableGroups,
  dressCodes,
  eventTypes,
  roles,
  savedLocations,
} from "@/data";
import { AppSelect } from "@/component/ui/Select";
import { AppDatePicker } from "@/component/ui/AppDatePicker";
import { AppTimePicker } from "@/component/ui/AppTimePicker";
import EventStaffingSection, {
  EventRoleRequirement,
} from "@/component/event/Eventstaffingsection";

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocationId, setSelectedLocationId] =
    useState<string>("custom");

  const [formData, setFormData] = useState<EventFormData>({
    eventName: "",
    eventType: "",
    description: "",
    clientName: "",
    clientContact: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    setupTime: "",
    breakdownTime: "",
    clockCode: "",
    venueName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    locationNotes: "",
    staffingRequirements: {},
    assignedGroups: [],
    autoAssign: false,
    dressCode: "",
    specialInstructions: "",
    budget: "",
    status: "Draft",
  });

  const [staffingRequirements, setStaffingRequirements] = useState<
    EventRoleRequirement[]
  >([]);

  const applySavedLocation = (locationId: string) => {
    setSelectedLocationId(locationId);

    if (locationId === "custom") return;

    const loc = savedLocations.find((l) => l.id === locationId);
    if (!loc) return;

    setFormData((prev) => ({
      ...prev,
      venueName: loc.venueName,
      street: loc.street,
      city: loc.city,
      state: loc.state,
      zipCode: loc.zipCode,
      country: loc.country,
      locationNotes: loc.locationNotes ?? prev.locationNotes,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
    }

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleGroup = (group: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedGroups: prev.assignedGroups.includes(group)
        ? prev.assignedGroups.filter((g) => g !== group)
        : [...prev.assignedGroups, group],
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    saveAs: "Draft" | "Published"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        ...formData,
        status: saveAs,
      };

      console.log("Submitting event:", dataToSubmit);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(
        `Event ${
          saveAs === "Draft" ? "saved as draft" : "published"
        } successfully!`
      );
      router.push("/admin/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-primary font-semibold text-gray-900">
            Add Event
          </h1>
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

      <form className="space-y-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="Johnson Wedding Reception"
              />
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
                  value: type,
                }))}
              />
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
                placeholder="Client name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Client Contact (Email or Phone)
              </label>
              <input
                type="text"
                name="clientContact"
                value={formData.clientContact}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="client@example.com or +1 (555) 000-0000"
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
                value={formData.clockCode || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clockCode: e.target.value,
                  }))
                }
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
                  ...savedLocations.map((l) => ({
                    label: l.label,
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="123 Main Street"
              />
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
                placeholder="New York"
              />
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
                disabled
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

        {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900">
            Staffing Requirements
          </h2>
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600 font-secondary mt-1">
                  Total staff needed:{" "}
                  <span className="font-semibold text-gray-900">
                    {totalStaffRequired}
                  </span>
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <AppCheckbox
                  checked={formData.autoAssign}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      autoAssign: Boolean(checked),
                    }))
                  }
                />

                <span className="text-sm font-secondary text-gray-700">
                  Auto-assign available staff
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professions.map((profession) => (
                <div key={profession}>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                    {profession}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.staffingRequirements[profession] || ""}
                    onChange={(e) =>
                      handleStaffingChange(profession, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                           placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           transition-all duration-200"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-3">
                Assign Groups (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableGroups.map((group) => (
                  <label
                    key={group}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <AppCheckbox
                      checked={formData.assignedGroups.includes(group)}
                      onCheckedChange={() => handleToggleGroup(group)}
                    />

                    <span className="text-sm font-secondary text-gray-700">
                      {group}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div> */}

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
          availableGroups={availableGroups}
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
                  value: code,
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
              className="w-full sm:w-auto inline-flex justify-center px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
            >
              Cancel
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "Draft")}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex justify-center px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, "Published")}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex justify-center px-6 py-2.5 bg-primary text-dark-black font-secondary font-semibold rounded-lg
                   hover:bg-[#e0c580] transition-all duration-200
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
                    Publishing...
                  </span>
                ) : (
                  "Publish Event"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
