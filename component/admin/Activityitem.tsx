import { defaultIcons } from "@/data";

interface ActivityItemProps {
  type: "event" | "staff" | "system" | "alert";
  title: string;
  description: string;
  time: string;
  icon?: React.ReactNode;
}

export default function ActivityItem({
  type,
  title,
  description,
  time,
  icon,
}: ActivityItemProps) {
  const typeStyles = {
    event: "bg-blue-100 text-blue-600",
    staff: "bg-green-100 text-green-600",
    system: "bg-gray-100 text-gray-600",
    alert: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex gap-4 py-4 hover:bg-gray-50 transition-colors rounded-lg px-2">
      <div
        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${typeStyles[type]}`}
      >
        {icon || defaultIcons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-secondary font-medium text-gray-900 mb-0.5">
          {title}
        </p>
        <p className="text-sm text-gray-600 font-secondary">{description}</p>
        <p className="text-xs text-gray-400 mt-1 font-secondary">{time}</p>
      </div>
    </div>
  );
}
