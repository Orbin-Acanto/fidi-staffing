"use client";

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check, ChevronUp } from "lucide-react";

type Option = { label: string; value: string; disabled?: boolean };

export function AppSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  disabled = false,
}: {
  label?: React.ReactNode;
  value: string | undefined;
  onValueChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="w-full">
      {label ? (
        <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
          {label}
        </label>
      ) : null}

      <Select.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <Select.Trigger
          className="w-full inline-flex items-center justify-between gap-3
          pl-4 pr-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-dark-black
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200
          disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="text-gray-500">
            <ChevronDown className="h-4 w-4" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white text-dark-black shadow-lg"
          >
            <Select.ScrollUpButton className="flex items-center justify-center py-1 text-gray-500">
              <ChevronUp className="h-4 w-4" />
            </Select.ScrollUpButton>

            <Select.Viewport className="max-h-56 overflow-y-auto">
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className="relative flex cursor-pointer select-none items-center py-2 pl-9 pr-3 text-sm
                   text-dark-black outline-none
                   data-highlighted:bg-primary/15 data-highlighted:text-dark-black
                   data-[state=checked]:bg-primary/10
                   data-disabled:opacity-50 data-disabled:cursor-not-allowed"
                >
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check className="h-4 w-4 text-primary" />
                  </Select.ItemIndicator>
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center py-1 text-gray-500">
              <ChevronDown className="h-4 w-4" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
