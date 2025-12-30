"use client";
import { ProfileActivityLog } from "@/type";

interface ProfileActivityLogCardProps {
  logs: ProfileActivityLog[];
}

export default function ProfileActivityLogCard({
  logs,
}: ProfileActivityLogCardProps) {
  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("logged in")) return "bg-blue-100 text-blue-700";
    if (actionLower.includes("created")) return "bg-green-100 text-green-700";
    if (actionLower.includes("updated") || actionLower.includes("changed"))
      return "bg-yellow-100 text-yellow-700";
    if (actionLower.includes("deleted")) return "bg-red-100 text-red-700";
    if (actionLower.includes("enabled") || actionLower.includes("disabled"))
      return "bg-purple-100 text-purple-700";
    if (actionLower.includes("suspended"))
      return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Your Activity
        </h3>
      </div>

      <div className="divide-y divide-gray-100 max-h-94 overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary font-medium ${getActionColor(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                  <span className="text-sm font-secondary text-gray-900 truncate">
                    {log.target}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  {log.device && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {log.device}
                    </span>
                  )}
                  {log.ipAddress && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      {log.ipAddress}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-secondary text-gray-400 shrink-0">
                {formatTimestamp(log.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="p-8 text-center">
          <svg
            className="w-10 h-10 text-gray-300 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-gray-500 font-secondary">
            No activity recorded yet
          </p>
        </div>
      )}
    </div>
  );
}
