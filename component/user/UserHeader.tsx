"use client";

interface UserHeaderProps {
  onAddUser: () => void;
}

export default function UserHeader({ onAddUser }: UserHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-primary font-bold text-gray-900">
          User Management
        </h1>
        <p className="text-sm font-secondary text-gray-600 mt-1">
          Manage system access, roles, and permissions
        </p>
      </div>
      <button
        onClick={onAddUser}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-secondary font-medium rounded-lg hover:bg-primary/90 transition-colors"
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
        </svg>{" "}
      </button>
    </div>
  );
}
