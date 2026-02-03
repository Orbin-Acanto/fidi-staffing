"use client";
import { useState } from "react";

import { settingsData } from "@/data";
import {
  Settings,
  GeneralSettings,
  EmailSettings,
  SystemPreferences,
} from "@/type";
import SettingsHeader from "@/component/settings/SettingsHeader";
import GeneralSettingsTab from "@/component/settings/GeneralSettingsTab";
import EmailSettingsTab from "@/component/settings/EmailSettingsTab";
import SystemSettingsTab from "@/component/settings/SystemSettingsTab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<Settings>(settingsData);

  const handleSaveEmailSettings = (emailSettings: EmailSettings) => {
    setSettings((prev) => ({ ...prev, email: emailSettings }));
    console.log("Email settings saved:", emailSettings);
  };

  const handleSaveSystemSettings = (systemSettings: SystemPreferences) => {
    setSettings((prev) => ({ ...prev, system: systemSettings }));
    console.log("System settings saved:", systemSettings);
  };

  const handleExportData = () => {
    console.log("Exporting data...");
    alert("Data export started. Your download will begin shortly.");
  };

  const handleBackupNow = () => {
    console.log("Creating backup...");
    alert("Backup created successfully!");
  };

  return (
    <div className="space-y-6">
      <SettingsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div>
        {activeTab === "general" && <GeneralSettingsTab />}

        {activeTab === "email" && (
          <EmailSettingsTab
            settings={settings.email}
            onSave={handleSaveEmailSettings}
          />
        )}

        {activeTab === "system" && (
          <SystemSettingsTab
            settings={settings.system}
            onSave={handleSaveSystemSettings}
            onExportData={handleExportData}
            onBackupNow={handleBackupNow}
          />
        )}
      </div>
    </div>
  );
}
