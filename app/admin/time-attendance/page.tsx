"use client";

import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
import { toastError } from "@/lib/toast";
import TimeAttendanceHeader from "@/component/time/TimeAttendanceHeader";
import OverviewTab from "@/component/time/OverviewTab";
import LiveStatusTab from "@/component/time/LiveStatusTab";
import ApprovalsTab from "@/component/time/ApprovalsTab";
import DateRangeFilter from "@/component/time/DateRangeFilter";
import EditTimeModal from "@/component/time/EditTimeModal";
import { ClockEntry } from "@/type/attendance";
import {
  getClockEntries,
  getCompanies,
  getEvents,
} from "@/services/dashboard-api";
import { AppSelect } from "@/component/ui/Select";

interface Company {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  name: string;
  event_date: string;
}

export default function TimeAttendancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [clockEntries, setClockEntries] = useState<ClockEntry[]>([]);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    return {
      preset: "today" as "today" | "week" | "month" | "custom",
      date_from: todayStr,
      date_to: todayStr,
    };
  });
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  const [showEditTimeModal, setShowEditTimeModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ClockEntry | null>(null);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    if (dateRange.date_from && dateRange.date_to) {
      loadEvents();
    }
  }, [dateRange]);

  const loadFilterOptions = async () => {
    setIsLoadingFilters(true);
    try {
      const companiesResponse = await getCompanies();
      if (companiesResponse.success && companiesResponse.data) {
        setCompanies(companiesResponse.data.companies);
      }

      await loadEvents();
    } catch (err) {
      toastError(err, "Failed to load filter options");
    } finally {
      setIsLoadingFilters(false);
    }
  };

  const loadEvents = async () => {
    try {
      const eventsResponse = await getEvents({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
      });

      if (eventsResponse.success && eventsResponse.data) {
        setEvents(eventsResponse.data.results);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };

  const handleEditTime = (entry: ClockEntry) => {
    setSelectedEntry(entry);
    setShowEditTimeModal(true);
  };

  const fetchClockEntries = async () => {
    setIsLoading(true);
    try {
      const response = await getClockEntries({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
        company_id: selectedCompany,
        event_id: selectedEvent,
        page_size: 1000,
      });

      if (response.success && response.data) {
        const entries = response.data || [];
        setClockEntries(entries);
      } else {
        setClockEntries([]);
        toastError(response.error, "Failed to load attendance data");
      }
    } catch (err) {
      setClockEntries([]);
      toastError(err, "Failed to load attendance data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (newRange: {
    preset: "today" | "week" | "month" | "custom";
    date_from: string;
    date_to: string;
  }) => {
    setDateRange(newRange);
    setSelectedEvent("");
  };

  return (
    <div className="space-y-6">
      <TimeAttendanceHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => {}}
      />

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <DateRangeFilter
              value={dateRange}
              onChange={handleDateRangeChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <AppSelect
                label="Filter by Company"
                value={selectedCompany || "all"}
                onValueChange={(val) =>
                  setSelectedCompany(val === "all" ? "" : val)
                }
                disabled={isLoadingFilters}
                options={[
                  { label: "All Companies", value: "all" },
                  ...companies.map((company) => ({
                    label: company.name,
                    value: company.id,
                  })),
                ]}
              />
            </div>

            <div>
              <AppSelect
                label="Filter by Event"
                value={selectedEvent || "all"}
                onValueChange={(val) =>
                  setSelectedEvent(val === "all" ? "" : val)
                }
                disabled={isLoadingFilters || events.length === 0}
                options={[
                  { label: "All Events", value: "all" },
                  ...events.map((event) => ({
                    label: `${event.name} (${new Date(
                      event.event_date + "T00:00:00",
                    ).toLocaleDateString()})`,
                    value: event.id,
                  })),
                ]}
              />

              {events.length === 0 && !isLoadingFilters && (
                <p className="text-xs text-gray-500 mt-1 font-secondary">
                  No events found for selected date range
                </p>
              )}
            </div>
          </div>

          {(selectedCompany ||
            selectedEvent ||
            dateRange.preset !== "today") && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm font-secondary text-gray-600">
                Active filters:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {dateRange.preset !== "today" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-secondary rounded">
                    {dateRange.preset === "custom"
                      ? `${dateRange.date_from} to ${dateRange.date_to}`
                      : dateRange.preset === "week"
                        ? "Last 7 Days"
                        : "Last 30 Days"}
                  </span>
                )}
                {selectedCompany && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-secondary rounded">
                    {companies.find((c) => c.id === selectedCompany)?.name}
                    <button
                      onClick={() => setSelectedCompany("")}
                      className="hover:text-primary/70"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedEvent && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-secondary rounded">
                    {events.find((e) => e.id === selectedEvent)?.name}
                    <button
                      onClick={() => setSelectedEvent("")}
                      className="hover:text-primary/70"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split("T")[0];
                    setDateRange({
                      preset: "today",
                      date_from: today,
                      date_to: today,
                    });
                    setSelectedCompany("");
                    setSelectedEvent("");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 font-secondary underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeTab === "overview" && (
        <OverviewTab
          dateRange={dateRange}
          selectedCompany={selectedCompany}
          selectedEvent={selectedEvent}
        />
      )}

      {activeTab === "live" && (
        <LiveStatusTab
          onEditTime={handleEditTime}
          dateRange={dateRange}
          selectedCompany={selectedCompany}
          selectedEvent={selectedEvent}
        />
      )}

      {activeTab === "approvals" && <ApprovalsTab dateRange={dateRange} />}

      {showEditTimeModal && selectedEntry && (
        <EditTimeModal
          entry={selectedEntry}
          isAdmin={true}
          onSave={() => {
            fetchClockEntries();
          }}
          onClose={() => {
            setShowEditTimeModal(false);
            setSelectedEntry(null);
          }}
        />
      )}
    </div>
  );
}
