"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EventFormData } from "@/type";
import { availableGroups, dressCodes, eventTypes, professions } from "@/data";

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStaffingChange = (profession: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({
      ...prev,
      staffingRequirements: {
        ...prev.staffingRequirements,
        [profession]: numValue,
      },
    }));
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

      // Simulate API call
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

  const totalStaffRequired = Object.values(
    formData.staffingRequirements
  ).reduce((sum, count) => sum + count, 0);

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
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Setup Time (Optional)
              </label>
              <input
                type="time"
                name="setupTime"
                value={formData.setupTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Breakdown Time (Optional)
              </label>
              <input
                type="time"
                name="breakdownTime"
                value={formData.breakdownTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
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

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-primary font-semibold text-gray-900">
                Staffing Requirements
              </h2>
              <p className="text-sm text-gray-600 font-secondary mt-1">
                Total staff needed:{" "}
                <span className="font-semibold text-gray-900">
                  {totalStaffRequired}
                </span>
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="autoAssign"
                checked={formData.autoAssign}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
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
                  <input
                    type="checkbox"
                    checked={formData.assignedGroups.includes(group)}
                    onChange={() => handleToggleGroup(group)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm font-secondary text-gray-700">
                    {group}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-primary font-semibold text-gray-900 mb-6">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
                Dress Code
              </label>
              <select
                name="dressCode"
                value={formData.dressCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-secondary text-dark-black
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              >
                <option value="">Select dress code</option>
                {dressCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
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

        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-6">
          <Link
            href="/admin/events"
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
          >
            Cancel
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "Draft")}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "Published")}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-dark-black font-secondary font-semibold rounded-lg
                       hover:bg-[#e0c580] transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:scale-105 active:scale-95"
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
      </form>
    </div>
  );
}
