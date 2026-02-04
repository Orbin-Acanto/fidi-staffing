"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import { cn } from "@/lib/utils";

interface PINInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  masked?: boolean;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
  label?: string;
}

export default function PINInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  masked = true,
  disabled = false,
  error = false,
  autoFocus = true,
  className,
  label,
}: PINInputProps) {
  const [internalValue, setInternalValue] = useState<string[]>(
    value.split("").slice(0, length),
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setInternalValue(value.split("").slice(0, length));
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const focusInput = useCallback(
    (index: number) => {
      const targetIndex = Math.max(0, Math.min(index, length - 1));
      inputRefs.current[targetIndex]?.focus();
    },
    [length],
  );

  const updateValue = useCallback(
    (newValue: string[]) => {
      setInternalValue(newValue);
      const joinedValue = newValue.join("");
      onChange?.(joinedValue);

      if (newValue.every((v) => v !== "") && newValue.length === length) {
        onComplete?.(joinedValue);
      }
    },
    [onChange, onComplete, length],
  );

  const handleChange = useCallback(
    (index: number, digit: string) => {
      if (!/^\d*$/.test(digit)) return;

      const newValue = [...internalValue];

      if (digit === "") {
        newValue[index] = "";
        updateValue(newValue);
        return;
      }

      if (digit.length === 1) {
        newValue[index] = digit;
        updateValue(newValue);

        if (index < length - 1) {
          focusInput(index + 1);
        }
      }
    },
    [internalValue, length, updateValue, focusInput],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (internalValue[index] === "" && index > 0) {
          focusInput(index - 1);
          const newValue = [...internalValue];
          newValue[index - 1] = "";
          updateValue(newValue);
        } else {
          const newValue = [...internalValue];
          newValue[index] = "";
          updateValue(newValue);
        }
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && index > 0) {
        focusInput(index - 1);
        e.preventDefault();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        focusInput(index + 1);
        e.preventDefault();
      }
    },
    [internalValue, length, focusInput, updateValue],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);

      if (pastedData) {
        const newValue = pastedData.split("");
        while (newValue.length < length) {
          newValue.push("");
        }
        updateValue(newValue);
        focusInput(Math.min(pastedData.length, length - 1));
      }
    },
    [length, updateValue, focusInput],
  );

  const handleFocus = useCallback((index: number) => {
    inputRefs.current[index]?.select();
  }, []);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-secondary font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div className="flex justify-center gap-2 sm:gap-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type={masked ? "password" : "text"}
            inputMode="numeric"
            maxLength={1}
            value={internalValue[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={cn(
              "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-primary font-bold text-black",
              "bg-white border-2 rounded-lg",
              "transition-all duration-200",
              "focus:outline-none focus:ring-0",
              disabled && "bg-gray-100 cursor-not-allowed opacity-60",
              error
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-primary",
            )}
            aria-label={`PIN digit ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
