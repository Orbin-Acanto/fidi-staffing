"use client";

import { useState, useCallback, useEffect, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface PhoneNumberInputProps {
  value?: string;
  onChange?: (value: string, formatted: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  label?: string;
  autoFocus?: boolean;
}

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function unformatPhoneNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

function isValidPhoneNumber(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10;
}

export default function PhoneNumberInput({
  value = "",
  onChange,
  placeholder = "(555) 555-5555",
  disabled = false,
  error = false,
  className,
  label,
  autoFocus = false,
}: PhoneNumberInputProps) {
  const [formatted, setFormatted] = useState(formatPhoneNumber(value));

  useEffect(() => {
    setFormatted(formatPhoneNumber(value));
  }, [value]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const unformatted = unformatPhoneNumber(inputValue);
      const newFormatted = formatPhoneNumber(unformatted);

      setFormatted(newFormatted);
      onChange?.(unformatted, newFormatted);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    setFormatted("");
    onChange?.("", "");
  }, [onChange]);

  const isValid = isValidPhoneNumber(formatted);
  const showClear = formatted.length > 0;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={formatted}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={cn(
            "w-full px-4 py-3 bg-white border rounded-lg",
            "text-dark-black font-secondary text-lg placeholder-gray-400",
            "transition-all duration-200",
            "focus:outline-none focus:ring-0",
            disabled && "bg-gray-100 cursor-not-allowed opacity-60",
            error
              ? "border-red-400 focus:border-red-500"
              : isValid
                ? "border-green-400 focus:border-green-500"
                : "border-gray-300 focus:border-primary",
            showClear && "pr-10",
          )}
        />
        {showClear && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear phone number"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        {isValid && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export { formatPhoneNumber, unformatPhoneNumber, isValidPhoneNumber };
