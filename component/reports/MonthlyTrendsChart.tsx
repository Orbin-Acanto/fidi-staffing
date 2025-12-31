"use client";
import { MonthlyTrend } from "@/type";

interface MonthlyTrendsChartProps {
  data: MonthlyTrend[];
}

export default function MonthlyTrendsChart({ data }: MonthlyTrendsChartProps) {
  const maxEvents = Math.max(...data.map((d) => d.events));
  const maxHours = Math.max(...data.map((d) => d.staffHours));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-primary font-semibold text-gray-900">Monthly Trends</h3>
          <p className="text-sm text-gray-500">Events and staff hours over time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-xs font-secondary text-gray-500">Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-secondary text-gray-500">Staff Hours</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-400 font-secondary">
          <span>{maxEvents}</span>
          <span>{Math.round(maxEvents * 0.75)}</span>
          <span>{Math.round(maxEvents * 0.5)}</span>
          <span>{Math.round(maxEvents * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full flex items-end gap-4">
          {data.map((item, index) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              {/* Bars */}
              <div className="w-full flex items-end justify-center gap-1 h-52">
                {/* Events bar */}
                <div
                  className="w-5 bg-primary rounded-t-sm transition-all duration-500 hover:bg-primary/80"
                  style={{ height: `${(item.events / maxEvents) * 100}%` }}
                  title={`${item.events} events`}
                ></div>
                {/* Hours bar (scaled) */}
                <div
                  className="w-5 bg-emerald-500 rounded-t-sm transition-all duration-500 hover:bg-emerald-400"
                  style={{ height: `${(item.staffHours / maxHours) * 100}%` }}
                  title={`${item.staffHours} hours`}
                ></div>
              </div>
              {/* Month label */}
              <span className="text-xs font-secondary text-gray-500">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-lg font-primary font-bold text-gray-900">
            {data.reduce((sum, d) => sum + d.events, 0)}
          </p>
          <p className="text-xs font-secondary text-gray-500">Total Events</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-primary font-bold text-gray-900">
            {data.reduce((sum, d) => sum + d.staffHours, 0).toLocaleString()}
          </p>
          <p className="text-xs font-secondary text-gray-500">Total Hours</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-primary font-bold text-gray-900">
            ${(data.reduce((sum, d) => sum + d.revenue, 0) / 1000).toFixed(0)}K
          </p>
          <p className="text-xs font-secondary text-gray-500">Total Revenue</p>
        </div>
      </div>
    </div>
  );
}
