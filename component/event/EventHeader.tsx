import Link from "next/link";

export default function EventHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-primary font-bold text-gray-900">
          Event Management
        </h1>
      </div>
      <Link
        href="/admin/events/create"
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                   font-secondary font-semibold rounded-lg
                   hover:bg-primary/80 transition-all duration-200
                   transform hover:scale-105 shadow-sm"
      >
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Event
      </Link>
    </div>
  );
}
