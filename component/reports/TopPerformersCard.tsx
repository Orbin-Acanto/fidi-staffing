"use client";
import { TopPerformer } from "@/type";

interface TopPerformersCardProps {
  performers: TopPerformer[];
}

export default function TopPerformersCard({ performers }: TopPerformersCardProps) {
  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case 1:
        return "bg-gray-100 text-gray-600 border-gray-200";
      case 2:
        return "bg-orange-100 text-orange-600 border-orange-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${
              i < fullStars
                ? "text-yellow-400"
                : i === fullStars && hasHalfStar
                ? "text-yellow-400"
                : "text-gray-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs font-secondary text-gray-500">{rating}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-primary font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
              clipRule="evenodd"
            />
          </svg>
          Top Performers
        </h3>
        <p className="text-sm text-gray-500 mt-1">Most active staff members this period</p>
      </div>

      <div className="divide-y divide-gray-100">
        {performers.map((performer, index) => (
          <div
            key={performer.staffId}
            className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            {/* Rank */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-primary font-bold border ${getMedalColor(
                index
              )}`}
            >
              {index + 1}
            </div>

            {/* Avatar */}
            <img
              src={
                performer.avatar ||
                `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                  performer.staffName
                )}`
              }
              alt={performer.staffName}
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-secondary font-medium text-gray-900 truncate">
                {performer.staffName}
              </p>
              {renderStars(performer.rating)}
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-6 text-right">
              <div>
                <p className="text-sm font-secondary font-medium text-gray-900">
                  {performer.eventsWorked}
                </p>
                <p className="text-xs text-gray-500">Events</p>
              </div>
              <div>
                <p className="text-sm font-secondary font-medium text-gray-900">
                  {performer.hoursWorked}h
                </p>
                <p className="text-xs text-gray-500">Hours</p>
              </div>
              <div>
                <p className="text-sm font-secondary font-medium text-gray-900">
                  {performer.onTimeRate}%
                </p>
                <p className="text-xs text-gray-500">On-time</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
