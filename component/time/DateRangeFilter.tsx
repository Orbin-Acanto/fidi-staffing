"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AppDatePicker } from "../ui/AppDatePicker";

interface DateRangeFilterProps {
  value: {
    preset: "today" | "week" | "month" | "custom";
    date_from: string;
    date_to: string;
  };
  onChange: (value: {
    preset: "today" | "week" | "month" | "custom";
    date_from: string;
    date_to: string;
  }) => void;
}

export default function DateRangeFilter({
  value,
  onChange,
}: DateRangeFilterProps) {
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetChange = (preset: "today" | "week" | "month") => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    let date_from = todayStr;
    let date_to = todayStr;

    if (preset === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      date_from = weekAgo.toISOString().split("T")[0];
    } else if (preset === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      date_from = monthAgo.toISOString().split("T")[0];
    }

    onChange({ preset, date_from, date_to });
    setShowCustom(false);
  };

  const handleCustomChange = (field: "date_from" | "date_to", val: string) => {
    onChange({
      preset: "custom",
      date_from: field === "date_from" ? val : value.date_from,
      date_to: field === "date_to" ? val : value.date_to,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => handlePresetChange("today")}
          className={cn(
            "px-3 py-1.5 text-sm font-secondary font-medium rounded-lg transition-colors",
            value.preset === "today"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => handlePresetChange("week")}
          className={cn(
            "px-3 py-1.5 text-sm font-secondary font-medium rounded-lg transition-colors",
            value.preset === "week"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          Last 7 Days
        </button>
        <button
          type="button"
          onClick={() => handlePresetChange("month")}
          className={cn(
            "px-3 py-1.5 text-sm font-secondary font-medium rounded-lg transition-colors",
            value.preset === "month"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          Last 30 Days
        </button>
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className={cn(
            "px-3 py-1.5 text-sm font-secondary font-medium rounded-lg transition-colors",
            value.preset === "custom"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          Custom Range
        </button>
      </div>

      {(showCustom || value.preset === "custom") && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <AppDatePicker
              label="From"
              value={value.date_from}
              onChange={(val) => handleCustomChange("date_from", val)}
            />
          </div>

          <div className="flex-1">
            <AppDatePicker
              label="To"
              value={value.date_to}
              onChange={(val) => handleCustomChange("date_to", val)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
