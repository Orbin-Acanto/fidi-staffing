type EventSummaryPanelProps = {
  totalEvents: number;
  upcomingEvents: number;
  inProgressEvents: number;
  completedEvents: number;
  totalStaffNeeded: number;
  totalStaffAssigned: number;
  eventTypeDistribution: { type: string; count: number }[];
};

export default function EventSummaryPanel({
  totalEvents,
  upcomingEvents,
  inProgressEvents,
  completedEvents,
  totalStaffNeeded,
  totalStaffAssigned,
  eventTypeDistribution,
}: EventSummaryPanelProps) {
  const staffUtilization =
    totalStaffNeeded > 0
      ? Math.round((totalStaffAssigned / totalStaffNeeded) * 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryStat
              label="Upcoming"
              value={upcomingEvents}
              badgeColor="bg-blue-50 text-blue-700"
            />
            <SummaryStat
              label="In Progress"
              value={inProgressEvents}
              badgeColor="bg-emerald-50 text-emerald-700"
            />
            <SummaryStat
              label="Completed"
              value={completedEvents}
              badgeColor="bg-gray-50 text-gray-700"
            />
            <SummaryStat
              label="Total"
              value={totalEvents}
              badgeColor="bg-amber-50 text-amber-700"
            />
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-secondary font-semibold text-gray-700 uppercase tracking-wide">
                  Staff Utilization
                </p>
                <p className="text-xs text-gray-500 font-secondary">
                  Upcoming events
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-secondary text-gray-500">
                  Assigned / Needed
                </span>
                <span className="text-sm font-primary font-semibold text-gray-900">
                  {totalStaffAssigned} / {totalStaffNeeded}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${staffUtilization}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-secondary text-gray-500">
              <span>Utilization</span>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-800">
                  {staffUtilization}%
                </span>
                <span>
                  Still needed:{" "}
                  <span className="font-semibold text-red-600">
                    {totalStaffNeeded - totalStaffAssigned}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl p-4 bg-linear-to-b from-white to-gray-50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-secondary font-semibold text-gray-700 uppercase tracking-wide">
              Events by Type
            </p>
            <span className="text-[11px] font-secondary text-gray-500">
              Mix overview
            </span>
          </div>

          <div className="space-y-3 max-h-38 overflow-y-auto pr-1 scrollbar-hide">
            {eventTypeDistribution.map((item) => {
              const percentage =
                totalEvents > 0
                  ? Math.round((item.count / totalEvents) * 100)
                  : 0;

              return (
                <div
                  key={item.type}
                  className="flex items-center gap-3 text-sm font-secondary"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-gray-800">{item.type}</p>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-14 text-right text-xs text-gray-500">
                    {item.count}
                    <span className="block text-[11px] text-gray-400">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

type SummaryStatProps = {
  label: string;
  value: number;
  badgeColor: string;
};

function SummaryStat({ label, value, badgeColor }: SummaryStatProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-xs font-secondary text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-secondary ${badgeColor}`}
        >
          {label === "Total" ? "All" : "Live"}
        </span>
      </div>
      <p className="mt-2 text-2xl font-primary font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
