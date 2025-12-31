"use client";

import ApprovalsTab from "@/component/time/ApprovalsTab";
import AttendanceSettingsModal from "@/component/time/AttendanceSettingsModal";
import EditTimeModal from "@/component/time/EditTimeModal";
import LiveStatusTab from "@/component/time/LiveStatusTab";
import OvertimeTab from "@/component/time/OvertimeTab";
import OverviewTab from "@/component/time/OverviewTab";
import ReportsTab from "@/component/time/ReportsTab";
import TimeAttendanceHeader from "@/component/time/TimeAttendanceHeader";
import WithdrawalsTab from "@/component/time/WithdrawalsTab";
import {
  attendanceSettings,
  dailyOverview,
  jobWithdrawals,
  overtimeAlerts,
  staffAttendanceSummaries,
  timeEditRequests,
  todayClockEntries,
} from "@/data";
import { AttendanceSettings, ClockEntry } from "@/type";
import { useState } from "react";

export default function TimeAttendancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditTimeModal, setShowEditTimeModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ClockEntry | null>(null);
  const [settings, setSettings] =
    useState<AttendanceSettings>(attendanceSettings);

  const [clockEntries, setClockEntries] = useState(todayClockEntries);
  const [editRequests, setEditRequests] = useState(timeEditRequests);
  const [withdrawals, setWithdrawals] = useState(jobWithdrawals);
  const [otAlerts, setOtAlerts] = useState(overtimeAlerts);

  const handleEditTime = (entry: ClockEntry) => {
    setSelectedEntry(entry);
    setShowEditTimeModal(true);
  };

  const handleSaveTimeEdit = (
    entryId: string,
    clockIn: string,
    clockOut: string,
    reason: string
  ) => {
    console.log("Saving time edit:", { entryId, clockIn, clockOut, reason });
    setClockEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              clockIn: clockIn || e.clockIn,
              clockOut: clockOut || e.clockOut,
            }
          : e
      )
    );
    alert("Time entry updated successfully!");
  };

  const handleApproveEntry = (entryId: string) => {
    setClockEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, isApproved: true } : e))
    );
    alert("Entry approved!");
  };

  const handleApproveRequest = (requestId: string) => {
    setEditRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "approved" as const,
              reviewedBy: "Current User",
              reviewedAt: new Date().toISOString(),
            }
          : r
      )
    );
    alert("Request approved!");
  };

  const handleRejectRequest = (requestId: string, reason: string) => {
    setEditRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "rejected" as const,
              reviewedBy: "Current User",
              reviewedAt: new Date().toISOString(),
              rejectionReason: reason,
            }
          : r
      )
    );
    alert("Request rejected!");
  };

  const handleAcknowledgeWithdrawal = (
    withdrawalId: string,
    penalty?: string
  ) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? {
              ...w,
              status: penalty
                ? ("penalized" as const)
                : ("acknowledged" as const),
              acknowledgedBy: "Current User",
              acknowledgedAt: new Date().toISOString(),
              penalty,
            }
          : w
      )
    );
    alert(
      penalty
        ? "Withdrawal acknowledged with penalty!"
        : "Withdrawal acknowledged!"
    );
  };

  const handleAcknowledgeOvertime = (alertId: string) => {
    setOtAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isAcknowledged: true } : a))
    );
    alert("Overtime alert acknowledged!");
  };

  const handleSaveSettings = (newSettings: AttendanceSettings) => {
    setSettings(newSettings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <TimeAttendanceHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab
          overview={dailyOverview}
          clockEntries={clockEntries}
          staffSummaries={staffAttendanceSummaries}
        />
      )}

      {activeTab === "live" && (
        <LiveStatusTab
          clockEntries={clockEntries}
          onEditTime={handleEditTime}
          onApprove={handleApproveEntry}
        />
      )}

      {activeTab === "approvals" && (
        <ApprovalsTab
          requests={editRequests}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}

      {activeTab === "withdrawals" && (
        <WithdrawalsTab
          withdrawals={withdrawals}
          onAcknowledge={handleAcknowledgeWithdrawal}
        />
      )}

      {activeTab === "overtime" && (
        <OvertimeTab
          alerts={otAlerts}
          onAcknowledge={handleAcknowledgeOvertime}
        />
      )}

      {activeTab === "reports" && (
        <ReportsTab summaries={staffAttendanceSummaries} />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <AttendanceSettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Edit Time Modal */}
      {showEditTimeModal && selectedEntry && (
        <EditTimeModal
          entry={selectedEntry}
          onSave={handleSaveTimeEdit}
          onClose={() => {
            setShowEditTimeModal(false);
            setSelectedEntry(null);
          }}
        />
      )}
    </div>
  );
}
