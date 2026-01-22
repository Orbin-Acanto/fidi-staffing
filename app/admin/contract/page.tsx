"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { AppSelect } from "@/component/ui/Select";

const sampleEvents = [
  {
    id: "evt_1",
    name: "Johnson Wedding Reception",
    eventDate: "2026-01-15",
    startTime: "18:00",
    endTime: "23:00",
    setupTime: "16:00",
    location: "Grand Ballroom",
    address: "123 Main Street, New York, NY 10001",
    dressCode: "Black Tie - Black pants, white shirt, black vest",
    contactPerson: "Sarah Johnson",
    contactPhone: "555-123-4567",
  },
  {
    id: "evt_2",
    name: "Corporate Gala 2026",
    eventDate: "2026-01-20",
    startTime: "19:00",
    endTime: "00:00",
    setupTime: "17:00",
    location: "Nassau County Museum of Art",
    address: "1 Museum Dr, Roslyn Harbor, NY 11576",
    dressCode: "Black Shoes, Black Long Sleeve Shirt, Black Pants, Black Tie",
    contactPerson: "Andrea Palacio",
    contactPhone: "347-480-6144",
  },
];

const sampleAssignedStaff = [
  {
    id: "staff_1",
    firstName: "Leah",
    lastName: "Wells",
    email: "info@example.com",
    phone: "856-600-7037",
    address: "123 Oak Street, Brooklyn, NY 11201",
    role: "DJ",
    payType: "fixed",
    rate: 1000,
  },
  {
    id: "staff_2",
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus.j@email.com",
    phone: "917-555-1234",
    address: "456 Elm Ave, Queens, NY 11375",
    role: "Server",
    payType: "hourly",
    rate: 28,
  },
  {
    id: "staff_3",
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@email.com",
    phone: "646-555-5678",
    address: "789 Pine Road, Manhattan, NY 10021",
    role: "Bartender",
    payType: "hourly",
    rate: 32,
  },
];

type ContractFormData = {
  eventId: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  eventName: string;
  eventDate: string;
  eventTimes: string;
  callTime: string;
  location: string;
  locationAddress: string;
  contactPerson: string;
  contactPhone: string;
  payType: "hourly" | "fixed";
  rate: number;
  dressCode: string;
  jobDescription: string;
  additionalDetails: string;
};

export default function ContractsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<ContractFormData>({
    eventId: "",
    staffId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    eventName: "",
    eventDate: "",
    eventTimes: "",
    callTime: "",
    location: "",
    locationAddress: "",
    contactPerson: "",
    contactPhone: "",
    payType: "hourly",
    rate: 0,
    dressCode: "",
    jobDescription: "",
    additionalDetails: "",
  });

  useEffect(() => {
    if (selectedEvent) {
      const event = sampleEvents.find((e) => e.id === selectedEvent);
      if (event) {
        setFormData((prev) => ({
          ...prev,
          eventId: event.id,
          eventName: event.name,
          eventDate: event.eventDate,
          eventTimes: `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`,
          callTime: formatTime(event.setupTime),
          location: event.location,
          locationAddress: event.address,
          contactPerson: event.contactPerson,
          contactPhone: event.contactPhone,
          dressCode: event.dressCode,
        }));
      }
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedStaff) {
      const staff = sampleAssignedStaff.find((s) => s.id === selectedStaff);
      if (staff) {
        setFormData((prev) => ({
          ...prev,
          staffId: staff.id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          phone: staff.phone,
          address: staff.address,
          payType: staff.payType as "hourly" | "fixed",
          rate: staff.rate,
        }));
      }
    }
  }, [selectedStaff]);

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateContract = async () => {
    if (!selectedEvent || !selectedStaff) {
      alert("Please select both an event and a staff member.");
      return;
    }

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
    setShowPreview(true);
  };

  const handleSendContract = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsGenerating(false);
    alert(`Contract sent to ${formData.email}`);
  };

  const handleDownloadContract = () => {
    alert("Contract downloaded as PDF");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-primary font-bold text-gray-900">
            Generate Contract
          </h1>
          <p className="text-sm font-secondary text-gray-600 mt-1">
            Create performance agreements for staff assigned to events
          </p>
        </div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary transition-colors"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selection Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-primary font-semibold text-gray-900 mb-4">
              Select Event & Staff
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <AppSelect
                  label={
                    <>
                      Event <span className="text-red-500">*</span>
                    </>
                  }
                  value={selectedEvent}
                  onValueChange={setSelectedEvent}
                  placeholder="Select an event"
                  options={sampleEvents.map((event) => ({
                    label: `${event.name} - ${formatDate(event.eventDate)}`,
                    value: event.id,
                  }))}
                />
              </div>
              <div>
                <AppSelect
                  label={
                    <>
                      Staff Member <span className="text-red-500">*</span>
                    </>
                  }
                  value={selectedStaff}
                  onValueChange={setSelectedStaff}
                  placeholder="Select staff"
                  options={sampleAssignedStaff.map((staff) => ({
                    label: `${staff.firstName} ${staff.lastName} - ${staff.role}`,
                    value: staff.id,
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Staff Details Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-primary font-semibold text-gray-900">
                Staff Details
              </h2>
              <span className="text-xs text-gray-400 font-secondary">
                Auto-filled from staff profile
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none focus:ring-2  focus:ring-primary text-gray-900"
                  readOnly
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-primary font-semibold text-gray-900">
                Event Details
              </h2>
              <span className="text-xs text-gray-400 font-secondary">
                Auto-filled from event
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Event Name
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none text-gray-900"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Date of Event
                </label>
                <input
                  type="text"
                  value={formatDate(formData.eventDate)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none text-gray-900"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Event Times
                </label>
                <input
                  type="text"
                  name="eventTimes"
                  value={formData.eventTimes}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none text-gray-900"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Call Time
                </label>
                <input
                  type="text"
                  name="callTime"
                  value={formData.callTime}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none text-gray-900"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={`${formData.contactPerson} ${formData.contactPhone}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none text-gray-900"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none text-gray-900"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Location Address
                </label>
                <input
                  type="text"
                  name="locationAddress"
                  value={formData.locationAddress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm bg-gray-50 focus:outline-none text-gray-900"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Pay & Manual Details Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-primary font-semibold text-gray-900 mb-4">
              Pay & Contract Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Pay Type
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payType"
                      value="hourly"
                      checked={formData.payType === "hourly"}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, payType: "hourly" }))
                      }
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-secondary text-gray-700">
                      Hourly
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payType"
                      value="fixed"
                      checked={formData.payType === "fixed"}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, payType: "fixed" }))
                      }
                      className="w-4 h-4 text-primary focus:ring-primary "
                    />
                    <span className="text-sm font-secondary text-gray-700">
                      Fixed
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Rate
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rate: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-7 pr-16 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {formData.payType === "hourly" ? "/hour" : "/event"}
                  </span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Dress Code
                </label>
                <input
                  type="text"
                  name="dressCode"
                  value={formData.dressCode}
                  onChange={handleInputChange}
                  placeholder="e.g., Black Shoes, Black Long Sleeve Shirt, Black Pants, Black Tie"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Job Description
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="e.g., Photo op display with step & repeat backdrop options..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-secondary font-medium text-gray-700 mb-1.5">
                  Additional Details (Optional)
                </label>
                <textarea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any additional information for the contract..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedEvent("");
                setSelectedStaff("");
                setFormData({
                  eventId: "",
                  staffId: "",
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  address: "",
                  eventName: "",
                  eventDate: "",
                  eventTimes: "",
                  callTime: "",
                  location: "",
                  locationAddress: "",
                  contactPerson: "",
                  contactPhone: "",
                  payType: "hourly",
                  rate: 0,
                  dressCode: "",
                  jobDescription: "",
                  additionalDetails: "",
                });
                setShowPreview(false);
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={handleGenerateContract}
              disabled={!selectedEvent || !selectedStaff || isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-secondary font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
                  Generating...
                </>
              ) : (
                <>
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Generate Contract
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contract Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-primary font-semibold text-gray-900">
                Contract Preview
              </h2>
            </div>

            {showPreview && selectedEvent && selectedStaff ? (
              <>
                <div className="p-4 max-h-[600px] overflow-y-auto">
                  {/* Contract Header */}
                  <div className="text-center mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-primary font-bold text-gray-900">
                      PERFORMANCE AGREEMENT
                    </h3>
                    <p className="text-xs text-gray-500 font-secondary mt-1">
                      140 Florida Street, Farmingdale, NY 11735
                    </p>
                    <p className="text-xs text-gray-500 font-secondary">
                      Ph: (631) 777-2244 | Fax: (646) 612-7447
                    </p>
                  </div>

                  {/* Staff Info */}
                  <div className="mb-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Name:
                      </span>
                      <span className="font-secondary font-medium text-gray-900">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Email:
                      </span>
                      <span className="font-secondary text-gray-900">
                        {formData.email}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Phone:
                      </span>
                      <span className="font-secondary text-gray-900">
                        {formData.phone}
                      </span>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="mb-4 space-y-1.5 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Event:
                      </span>
                      <span className="font-secondary font-medium text-gray-900 text-right max-w-[60%]">
                        {formData.eventName}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Date:
                      </span>
                      <span className="font-secondary text-gray-900">
                        {formatDate(formData.eventDate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Event Times:
                      </span>
                      <span className="font-secondary text-gray-900">
                        {formData.eventTimes}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Call Time:
                      </span>
                      <span className="font-secondary font-medium text-primary">
                        {formData.callTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Location:
                      </span>
                      <span className="font-secondary text-gray-900 text-right max-w-[60%]">
                        {formData.location}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Address:
                      </span>
                      <span className="font-secondary text-gray-900 text-right max-w-[60%]">
                        {formData.locationAddress}
                      </span>
                    </div>
                  </div>

                  {/* Pay & Other Details */}
                  <div className="mb-4 space-y-1.5 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Rate:
                      </span>
                      <span className="font-secondary font-bold text-green-600">
                        {formatCurrency(formData.rate)}
                        {formData.payType === "hourly" && "/hr"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-secondary">
                        Dress Code:
                      </span>
                      <span className="font-secondary text-gray-900 text-right max-w-[60%]">
                        {formData.dressCode || "—"}
                      </span>
                    </div>
                    {formData.jobDescription && (
                      <div className="text-xs">
                        <span className="text-gray-500 font-secondary block mb-1">
                          Job Description:
                        </span>
                        <span className="font-secondary text-gray-900">
                          {formData.jobDescription}
                        </span>
                      </div>
                    )}
                    {formData.additionalDetails && (
                      <div className="text-xs">
                        <span className="text-gray-500 font-secondary block mb-1">
                          Additional Details:
                        </span>
                        <span className="font-secondary text-gray-900">
                          {formData.additionalDetails}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Signature Area */}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-[10px] text-gray-400 font-secondary mb-3">
                      I acknowledge that I have read and agree to all terms &
                      conditions listed in this agreement.
                    </p>
                    <div className="border-b border-dashed border-gray-300 mb-1"></div>
                    <p className="text-[10px] text-gray-400 font-secondary">
                      Signature & Date
                    </p>
                  </div>
                </div>

                {/* Preview Actions */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={handleSendContract}
                    disabled={isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-secondary font-medium transition-colors disabled:opacity-50"
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Send to Staff
                  </button>
                  <button
                    onClick={handleDownloadContract}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <svg
                  className="w-12 h-12 text-gray-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500 font-secondary">
                  Select an event and staff member, then click "Generate
                  Contract" to preview.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
