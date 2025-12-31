"use client";
import { EventTypeBreakdown } from "@/type";

interface EventTypeBreakdownChartProps {
  data: EventTypeBreakdown[];
}

export default function EventTypeBreakdownChart({ data }: EventTypeBreakdownChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  // Calculate stroke-dasharray for donut chart segments
  const circumference = 2 * Math.PI * 40; // radius = 40
  let cumulativePercentage = 0;

  const segments = data.map((item) => {
    const percentage = item.percentage;
    const dashArray = (percentage / 100) * circumference;
    const dashOffset = -(cumulativePercentage / 100) * circumference;
    cumulativePercentage += percentage;

    return {
      ...item,
      dashArray,
      dashOffset,
    };
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="font-primary font-semibold text-gray-900">Event Types</h3>
        <p className="text-sm text-gray-500">Breakdown by category</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Donut Chart */}
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="12"
            />
            {/* Segments */}
            {segments.map((segment, index) => (
              <circle
                key={segment.type}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={segment.color}
                strokeWidth="12"
                strokeDasharray={`${segment.dashArray} ${circumference}`}
                strokeDashoffset={segment.dashOffset}
                transform="rotate(-90 50 50)"
                className="transition-all duration-500"
              />
            ))}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-primary font-bold text-gray-900">{total}</span>
            <span className="text-xs font-secondary text-gray-500">Events</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-secondary text-gray-700">
                  {item.type}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-secondary font-medium text-gray-900">
                  {item.count}
                </span>
                <span className="text-xs font-secondary text-gray-500 w-10 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
