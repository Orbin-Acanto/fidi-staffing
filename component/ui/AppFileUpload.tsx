"use client";

import * as React from "react";
import { Upload } from "lucide-react";

type AppFileUploadProps = {
  label?: string;
  accept?: string;
  onChange: (file: File | null) => void;
};

export function AppFileUpload({
  label,
  accept = "image/*",
  onChange,
}: AppFileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState<string>("");

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          setFileName(file?.name ?? "");
          onChange(file);
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="
          w-full flex items-center justify-center gap-2
          px-4 py-2
          border border-gray-300 rounded-lg
          bg-white text-dark-black text-sm font-secondary
          hover:border-primary
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-200
        "
      >
        <Upload className="h-4 w-4 text-primary" />
        {fileName || "Upload profile picture"}
      </button>
    </div>
  );
}
