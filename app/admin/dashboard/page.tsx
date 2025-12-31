"use client";

import ActivityItem from "@/component/admin/Activityitem";
import QuickActionCard from "@/component/admin/Quickactioncard";
import StatCard from "@/component/admin/Statcard";
import { quickActions, recentActivity, stats, upcomingEvents } from "@/data";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-primary font-bold text-gray-900">
          Overview
        </h1>
        <p className="text-sm font-secondary text-gray-600 mt-1">
          Track upcoming events, manage staff assignments, and stay on top of
          operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-primary font-semibold text-primary">
                Upcoming Events
              </h2>
              <button className="text-sm text-primary hover:text-[#e0c580] font-secondary font-medium">
                View All
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
                >
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-secondary font-semibold text-gray-900 mb-1">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 font-secondary">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
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
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="flex items-center gap-1 text-sm text-gray-600 font-secondary">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        {event.staffCount} staff
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold font-secondary ${
                          event.status === "ready"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {event.status === "ready" ? "Ready" : "Understaffed"}
                      </span>
                    </div>
                  </div>

                  <button className="text-gray-400 hover:text-primary transition-colors">
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-primary font-semibold text-gray-900">
                Recent Activity
              </h2>
              <button className="text-sm text-primary hover:text-[#e0c580] font-secondary font-medium">
                View All
              </button>
            </div>
            <div className="max-h-[500px] overflow-y-auto space-y-4">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
