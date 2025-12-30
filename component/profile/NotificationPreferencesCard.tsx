"use client";
import { NotificationPreferences } from "@/type";

interface NotificationPreferencesCardProps {
  preferences: NotificationPreferences;
  onUpdate: (preferences: NotificationPreferences) => void;
}

export default function NotificationPreferencesCard({
  preferences,
  onUpdate,
}: NotificationPreferencesCardProps) {
  const handleToggle = (key: keyof NotificationPreferences) => {
    onUpdate({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const notificationGroups = [
    {
      title: "Email Notifications",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      items: [
        {
          key: "emailNewStaff" as const,
          label: "New staff registrations",
          description: "Get notified when new staff members are added",
        },
        {
          key: "emailEventReminders" as const,
          label: "Event reminders",
          description: "Receive reminders before scheduled events",
        },
        {
          key: "emailWeeklyReport" as const,
          label: "Weekly reports",
          description: "Get weekly summary of activities",
        },
      ],
    },
    {
      title: "SMS Notifications",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      items: [
        {
          key: "smsNotifications" as const,
          label: "SMS notifications",
          description: "Receive text messages for important updates",
        },
        {
          key: "smsUrgentAlerts" as const,
          label: "Urgent alerts only",
          description: "Only receive SMS for critical issues",
        },
      ],
    },
    {
      title: "Voice Call Notifications",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      items: [
        {
          key: "voiceCallNotifications" as const,
          label: "AI voice call alerts",
          description: "Receive automated voice calls for critical alerts",
        },
      ],
    },
    {
      title: "In-App Notifications",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
      items: [
        {
          key: "inAppNotifications" as const,
          label: "In-app notifications",
          description: "Show notifications within the application",
        },
        {
          key: "inAppSound" as const,
          label: "Notification sounds",
          description: "Play sound for new notifications",
        },
      ],
    },
  ];

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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          Notification Preferences
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {notificationGroups.map((group) => (
          <div key={group.title} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400">{group.icon}</span>
              <h4 className="font-secondary font-medium text-gray-900">
                {group.title}
              </h4>
            </div>
            <div className="space-y-3 ml-7">
              {group.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-secondary text-gray-900">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences[item.key] ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences[item.key]
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
