"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DEMO_CREDENTIALS } from "@/data/mockData";

export default function DemoCredentials() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "absolute -top-2 -right-2 w-8 h-8 rounded-full",
          "bg-amber-500 text-white text-xs font-bold",
          "flex items-center justify-center",
          "shadow-lg hover:bg-amber-600 transition-colors",
          "z-10",
        )}
      >
        {isExpanded ? "×" : "?"}
      </button>

      {isExpanded && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg shadow-xl p-4 animate-slideUp">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🔑</span>
            <h3 className="font-primary font-bold text-amber-800">
              Demo Credentials
            </h3>
          </div>

          <div className="mb-3">
            <p className="text-xs font-secondary font-semibold text-amber-700 uppercase tracking-wide mb-1">
              Admin Login
            </p>
            <div className="bg-white rounded p-2 text-sm font-mono">
              <p>
                <span className="text-gray-500">Phone:</span>{" "}
                <span className="text-dark-black font-semibold">
                  {DEMO_CREDENTIALS.admin.phone}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Password:</span>{" "}
                <span className="text-dark-black font-semibold">
                  {DEMO_CREDENTIALS.admin.password}
                </span>
              </p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs font-secondary font-semibold text-amber-700 uppercase tracking-wide mb-1">
              Staff Login (any of these)
            </p>
            <div className="bg-white rounded p-2 text-sm max-h-32 overflow-y-auto">
              {DEMO_CREDENTIALS.staff.slice(0, 3).map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "font-mono",
                    i > 0 && "mt-1 pt-1 border-t border-gray-100",
                  )}
                >
                  <p className="text-xs text-gray-600">{s.name}</p>
                  <p>
                    <span className="text-gray-500">Phone:</span>{" "}
                    <span className="text-dark-black">{s.phone}</span>
                  </p>
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-1">
                +{DEMO_CREDENTIALS.staff.length - 3} more...
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded p-2">
              <p className="text-xs text-gray-500">All Staff PIN</p>
              <p className="font-mono font-bold text-primary">123456</p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-xs text-gray-500">OTP Code</p>
              <p className="font-mono font-bold text-primary">Any 6 digits</p>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-amber-300">
            <p className="text-xs text-amber-600 text-center font-secondary">
              🚧 Running in Demo Mode - No backend required
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
