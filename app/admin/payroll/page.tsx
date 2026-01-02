"use client";

import EventCostsTab from "@/component/payroll/EventCostsTab";
import ForecastTab from "@/component/payroll/ForecastTab";
import OvertimeCostsTab from "@/component/payroll/OvertimeCostsTab";
import PaymentHistoryTab from "@/component/payroll/PaymentHistoryTab";
import PayrollHeader from "@/component/payroll/PayrollHeader";
import PayrollListTab from "@/component/payroll/PayrollListTab";
import PayrollOverviewTab from "@/component/payroll/PayrollOverviewTab";
import PayslipModal from "@/component/payroll/PayslipModal";
import {
  costForecast,
  costMetrics,
  currentPayrollEntries,
  eventCostBreakdown,
  overtimeCostBreakdown,
  paymentHistory,
  payrollSummary,
  staffPayInfo,
} from "@/data";
import { PayrollEntry, PayrollPeriod } from "@/type";
import { useState } from "react";

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] =
    useState<PayrollPeriod>("bi-weekly");
  const [payrollEntries, setPayrollEntries] = useState(currentPayrollEntries);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);

  const handleGeneratePayroll = () => {
    alert(
      "Generate Payroll modal would open here to select date range and staff."
    );
  };

  const handleApprovePayroll = (entryId: string) => {
    setPayrollEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              status: "approved" as const,
              approvedBy: "Current User",
              approvedAt: new Date().toISOString(),
            }
          : e
      )
    );
    alert("Payroll approved!");
  };

  const handleRejectPayroll = (entryId: string, reason: string) => {
    setPayrollEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              status: "rejected" as const,
              notes: reason,
            }
          : e
      )
    );
    alert("Payroll rejected!");
  };

  const handleViewPayslip = (entry: PayrollEntry) => {
    setSelectedEntry(entry);
    setShowPayslipModal(true);
  };

  const handleViewPayslipFromHistory = (
    staffId: string,
    periodStart: string,
    periodEnd: string
  ) => {
    const entry = payrollEntries.find(
      (e) => e.staffId === staffId && e.periodStart === periodStart
    );
    if (entry) {
      setSelectedEntry(entry);
      setShowPayslipModal(true);
    } else {
      alert("Payslip not found for this period.");
    }
  };

  const handleExportPayroll = (entries: PayrollEntry[]) => {
    const csvContent = entries
      .map(
        (e) =>
          `${e.staffName},${e.staffPhone},${e.totalHours},${e.grossPay},${e.netPay}`
      )
      .join("\n");
    console.log("Exporting:", csvContent);
    alert(`Exporting ${entries.length} payroll entries...`);
  };

  const handleExportPayslip = (format: "pdf" | "print") => {
    if (format === "print") {
      window.print();
    } else {
      alert("Downloading PDF...");
    }
  };

  return (
    <div className="space-y-6">
      <PayrollHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        onGeneratePayroll={handleGeneratePayroll}
      />

      {activeTab === "overview" && (
        <PayrollOverviewTab
          summary={payrollSummary}
          metrics={costMetrics}
          forecast={costForecast}
        />
      )}

      {activeTab === "payroll" && (
        <PayrollListTab
          entries={payrollEntries}
          onApprove={handleApprovePayroll}
          onReject={handleRejectPayroll}
          onViewPayslip={handleViewPayslip}
          onExport={handleExportPayroll}
        />
      )}

      {activeTab === "event-costs" && (
        <EventCostsTab events={eventCostBreakdown} />
      )}

      {activeTab === "overtime" && (
        <OvertimeCostsTab breakdowns={overtimeCostBreakdown} />
      )}

      {activeTab === "forecast" && <ForecastTab forecast={costForecast} />}

      {activeTab === "history" && (
        <PaymentHistoryTab
          history={paymentHistory}
          staffList={staffPayInfo}
          onViewPayslip={handleViewPayslipFromHistory}
        />
      )}

      {/* Payslip Modal */}
      {showPayslipModal && selectedEntry && (
        <PayslipModal
          entry={selectedEntry}
          onClose={() => {
            setShowPayslipModal(false);
            setSelectedEntry(null);
          }}
          onExport={handleExportPayslip}
        />
      )}
    </div>
  );
}
