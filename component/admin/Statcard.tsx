interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-secondary font-medium text-primary mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-primary font-bold text-gray-900 mb-2">
            {value}
          </h3>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              <span
                className={`text-sm font-secondary font-medium ${
                  trend.isPositive ? "text-primary" : "text-gray-500"
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 font-secondary mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-gray-100 text-gray-600">{icon}</div>
      </div>
    </div>
  );
}
