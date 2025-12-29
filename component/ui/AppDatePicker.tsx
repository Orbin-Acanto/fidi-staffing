"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";

import "react-day-picker/dist/style.css";

type AppDatePickerProps = {
  label?: React.ReactNode;
  value?: Date;
  onChange: (date?: Date) => void;
};

export function AppDatePicker({ label, value, onChange }: AppDatePickerProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="
              w-full flex items-center justify-between
              px-4 py-2
              border border-gray-300 rounded-lg
              bg-white text-dark-black text-sm font-secondary
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-200
            "
          >
            {value ? format(value, "PPP") : "Select date"}
            <CalendarIcon className="h-4 w-4 text-primary" />
          </button>
        </Popover.Trigger>

        <Popover.Content
          align="start"
          className="z-50 mt-2 rounded-lg border border-gray-200 bg-white text-dark-black p-3 shadow-lg"
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={onChange}
            className="text-sm"
            modifiersClassNames={{
              selected: "bg-primary text-white",
              today: "text-primary font-semibold",
            }}
            classNames={{
              day: "h-9 w-9 rounded-md hover:bg-primary/15",
              nav_button: "hover:bg-primary/15 rounded-md",
              caption_label: "font-secondary font-medium",
            }}
          />
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
