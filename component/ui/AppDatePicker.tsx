"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  addMonths,
  subMonths,
  startOfMonth,
  getYear,
  getMonth,
  setMonth,
  setYear,
  isValid,
} from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";

import "react-day-picker/dist/style.css";
import { AppSelect } from "./Select";

type AppDatePickerProps = {
  label?: React.ReactNode;
  value?: string;
  onChange: (value: string) => void;
  fromYear?: number;
  toYear?: number;
};

function parseYmdToLocalDate(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function AppDatePicker({
  label,
  value,
  onChange,
  fromYear,
  toYear,
}: AppDatePickerProps) {
  const selectedDate = value ? parseYmdToLocalDate(value) : undefined;

  const currentYear = new Date().getFullYear();
  const startYear = fromYear ?? currentYear - 80;
  const endYear = toYear ?? currentYear + 10;

  const minMonth = React.useMemo(
    () => startOfMonth(new Date(startYear, 0, 1)),
    [startYear],
  );
  const maxMonth = React.useMemo(
    () => startOfMonth(new Date(endYear, 11, 1)),
    [endYear],
  );

  const [open, setOpen] = React.useState(false);

  const [month, setMonthState] = React.useState<Date>(() => {
    const base =
      selectedDate && isValid(selectedDate) ? selectedDate : new Date();
    const m = startOfMonth(base);
    if (m < minMonth) return minMonth;
    if (m > maxMonth) return maxMonth;
    return m;
  });

  React.useEffect(() => {
    if (selectedDate && isValid(selectedDate)) {
      const m = startOfMonth(selectedDate);
      if (m < minMonth) setMonthState(minMonth);
      else if (m > maxMonth) setMonthState(maxMonth);
      else setMonthState(m);
    }
  }, [value, minMonth, maxMonth]);

  const years = React.useMemo(() => {
    const out: number[] = [];
    for (let y = startYear; y <= endYear; y++) out.push(y);
    return out;
  }, [startYear, endYear]);

  const shownYear = getYear(month);
  const shownMonth = getMonth(month);

  const canPrev = subMonths(month, 1) >= minMonth;
  const canNext = addMonths(month, 1) <= maxMonth;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <Popover.Root open={open} onOpenChange={setOpen}>
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
            {selectedDate ? format(selectedDate, "PPP") : "Select date"}
            <CalendarIcon className="h-4 w-4 text-primary" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            className="z-50 w-[320px] rounded-xl border border-gray-200 bg-white text-dark-black p-3 shadow-lg"
          >
            <div className="flex items-center justify-between gap-2 pb-3">
              <button
                type="button"
                onClick={() =>
                  canPrev && setMonthState(startOfMonth(subMonths(month, 1)))
                }
                disabled={!canPrev}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button
                      type="button"
                      className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-secondary text-gray-900 hover:bg-gray-50"
                    >
                      {MONTHS[shownMonth]}
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      align="center"
                      sideOffset={8}
                      className="z-50 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                    >
                      <div className="grid grid-cols-3 gap-1">
                        {MONTHS.map((name, idx) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              const next = startOfMonth(setMonth(month, idx));
                              if (next < minMonth) setMonthState(minMonth);
                              else if (next > maxMonth) setMonthState(maxMonth);
                              else setMonthState(next);
                            }}
                            className={[
                              "rounded-lg px-2 py-2 text-xs font-secondary text-gray-800 hover:bg-gray-50",
                              idx === shownMonth
                                ? "bg-primary/15 text-gray-900"
                                : "",
                            ].join(" ")}
                          >
                            {name.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

                <AppSelect
                  value={String(shownYear)}
                  onValueChange={(v) => {
                    const yr = Number(v);
                    const next = startOfMonth(setYear(month, yr));

                    if (next < minMonth) setMonthState(minMonth);
                    else if (next > maxMonth) setMonthState(maxMonth);
                    else setMonthState(next);
                  }}
                  placeholder="Year"
                  options={years.map((yr) => ({
                    label: String(yr),
                    value: String(yr),
                  }))}
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  canNext && setMonthState(startOfMonth(addMonths(month, 1)))
                }
                disabled={!canNext}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <DayPicker
              mode="single"
              month={month}
              onMonthChange={(m) => setMonthState(startOfMonth(m))}
              selected={selectedDate}
              onSelect={(date) => {
                onChange(date ? format(date, "yyyy-MM-dd") : "");
                if (date) setOpen(false);
              }}
              classNames={{
                caption: "hidden",
                nav: "hidden",

                months: "flex flex-col",
                month: "space-y-2 flex flex-col",

                table: "w-full border-collapse",
                head_row: "flex",
                head_cell:
                  "w-9 text-center text-xs font-secondary text-gray-500",

                row: "flex w-full mt-1",
                cell: "w-9 h-9 text-center",

                day: "h-9 w-9 rounded-lg font-secondary text-sm text-gray-900",
                day_button: "h-9 w-9 rounded-lg hover:bg-primary/15",
                day_selected:
                  "bg-primary text-white hover:bg-primary hover:text-white",
                day_today: "text-primary font-semibold",
                day_outside: "text-gray-300",
              }}
              modifiersClassNames={{
                selected: "bg-primary text-white",
                today: "text-primary font-semibold",
              }}
              fromDate={new Date(startYear, 0, 1)}
              toDate={new Date(endYear, 11, 31)}
              showOutsideDays
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
