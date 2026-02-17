"use client";

interface AuditLogItem {
  id: string;
  action: string;
  action_display: string;
  severity: string;
  description: string;
  object_repr: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface ProfileActivityLogCardProps {
  logs: AuditLogItem[];
  loading?: boolean;
}

export default function ProfileActivityLogCard({
  logs,
  loading = false,
}: ProfileActivityLogCardProps) {
  const getActionColor = (action: string) => {
    if (["login", "clock_in", "invite_accepted"].includes(action))
      return "bg-blue-100 text-blue-700";
    if (["create", "company_created", "contract_created"].includes(action))
      return "bg-green-100 text-green-700";
    if (["update", "password_change", "role_change"].includes(action))
      return "bg-yellow-100 text-yellow-700";
    if (["delete", "event_cancelled", "company_disabled"].includes(action))
      return "bg-red-100 text-red-700";
    if (["permission_grant", "permission_revoke"].includes(action))
      return "bg-purple-100 text-purple-700";
    if (["logout", "clock_out"].includes(action))
      return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

  const parseDevice = (userAgent: string | null) => {
    if (!userAgent) return null;
    if (userAgent.includes("Mobile")) return "Mobile";
    if (userAgent.includes("Tablet")) return "Tablet";
    return "Desktop";
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
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="h-5 w-16 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-50 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          logs.map((log) => {
            const device = parseDevice(log.user_agent);

            return (
              <div
                key={log.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-secondary font-medium ${getActionColor(log.action)}`}
                      >
                        {log.action_display}
                      </span>
                      {log.object_repr && (
                        <span className="text-sm font-secondary text-gray-900 truncate">
                          {log.object_repr}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      {device && (
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
                          {device}
                        </span>
                      )}
                      {log.ip_address && (
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
                          {log.ip_address}
                        </span>
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
