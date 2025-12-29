"use client";

import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

type AppCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function AppCheckbox({ checked, onCheckedChange }: AppCheckboxProps) {
  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={(v) => onCheckedChange(!!v)}
      className="
        h-4 w-4
        bg-white
        border border-gray-400
        flex items-center justify-center
        cursor-pointer
        transition-colors
        data-[state=checked]:bg-primary
        data-[state=checked]:border-transparent
        focus:outline-none focus:ring-2 focus:ring-primary/40
      "
    >
      <Checkbox.Indicator>
        <Check className="h-3 w-3 text-white" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
