"use client";
import { EventStatistics } from "@/type";

interface EventStatisticsCardsProps {
  stats: EventStatistics;
}

export default function EventStatisticsCards({ stats }: EventStatisticsCardsProps) {
  const cards = [
    {
      label: "Total Events",
      value: stats.totalEvents,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Completed",
      value: stats.completedEvents,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-50 text-green-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Upcoming",
      value: stats.upcomingEvents,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelledEvents,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-red-50 text-red-600",
      trend: "-50%",
      trendUp: false,
    },
    {
      label: "Avg Staff/Event",
      value: stats.averageStaffPerEvent.toFixed(1),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Total Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-emerald-50 text-emerald-600",
      trend: "+24%",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${card.color}`}>{card.icon}</div>
            {card.trend && (
              <span
                className={`text-xs font-secondary font-medium ${
                  card.trendUp ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.trend}
              </span>
            )}
          </div>
          <p className="text-2xl font-primary font-bold text-gray-900">
            {card.value}
          </p>
          <p className="text-sm font-secondary text-gray-500">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
