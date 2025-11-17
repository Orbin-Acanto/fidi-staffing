import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function QuickActionCard({
  title,
  description,
  icon,
  href,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group hover:border-primary"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary text-white transition-all duration-200 group-hover:scale-110">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-secondary font-semibold text-primary mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 font-secondary">{description}</p>
        </div>
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all"
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
      </div>
    </Link>
  );
}
