"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Clock } from "lucide-react";

type AppTimePickerProps = {
  label?: React.ReactNode;
  value?: string;
  onChange: (time: string) => void;
  stepMinutes?: number;
};

function generateTimes(step: number) {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += step) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
}

export function AppTimePicker({
  label,
  value,
  onChange,
  stepMinutes = 15,
}: AppTimePickerProps) {
  const times = React.useMemo(() => generateTimes(stepMinutes), [stepMinutes]);

  return (
    <div className="w-full">
      {label && (
        <div className="block text-sm font-secondary font-medium text-gray-700 mb-2">
          {label}
        </div>
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
            {value || "Select time"}
            <Clock className="h-4 w-4 text-primary" />
          </button>
        </Popover.Trigger>

        <Popover.Content
          align="start"
          className="z-50 mt-2 w-40 rounded-lg border border-gray-200 bg-white text-dark-black shadow-lg"
        >
          <div className="max-h-56 overflow-y-auto">
            {times.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onChange(time)}
                className={`
                  w-full text-left px-3 py-2 text-sm
                  ${
                    value === time
                      ? "bg-primary text-white hover:bg-primary"
                      : "hover:bg-primary/15"
                  }
                `}
              >
                {time}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
