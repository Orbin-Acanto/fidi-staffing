"use client";

interface AuditLogItem {
  id: string;
  action: string;
  action_display: string;
  severity: string;
  user_full_name: string | null;
  user_email: string | null;
  object_repr: string | null;
  description: string;
  created_at: string;
}

interface ActivityLogPanelProps {
  logs: AuditLogItem[];
  loading?: boolean;
}

export default function ActivityLogPanel({
  logs,
  loading = false,
}: ActivityLogPanelProps) {
  const getActionColor = (action: string) => {
    if (["create", "invite_accepted"].includes(action))
      return "bg-green-100 text-green-700";
    if (["update", "role_change"].includes(action))
      return "bg-blue-100 text-blue-700";
    if (["delete"].includes(action)) return "bg-red-100 text-red-700";
    if (["password_change", "password_reset"].includes(action))
      return "bg-orange-100 text-orange-700";
    if (["permission_grant", "permission_revoke"].includes(action))
      return "bg-purple-100 text-purple-700";
    if (["login", "logout"].includes(action))
      return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

  const getInitials = (name: string | null) => {
    if (!name || name === "System") return "SY";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
          Recent Activity
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          logs.slice(0, 5).map((log) => {
            const userName = log.user_full_name || log.user_email || "System";

            return (
              <div
                key={log.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-gray-600 font-secondary font-medium text-xs">
                        {getInitials(log.user_full_name)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-secondary font-medium text-gray-900">
                          {userName}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary font-medium ${getActionColor(log.action)}`}
                        >
                          {log.action_display}
                        </span>
                      </div>
                      {log.object_repr && (
                        <p className="text-sm font-secondary text-gray-600 mt-0.5">
                          {log.object_repr}
                        </p>
                      )}
                      {log.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {log.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-secondary text-gray-400 shrink-0">
                    {formatTimestamp(log.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!loading && logs.length === 0 && (
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
