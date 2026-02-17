import { actionIcon, staffNotes, staffReviews } from "@/data";
import { Event, StaffPerformance } from "@/type";
import { EventItem } from "@/type/dashboard";
import { BackendGroup, UiGroup } from "@/type/group";
import { StaffMemberBackend, UiStaff } from "@/type/staff";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Upcoming":
      return "bg-blue-100 text-blue-700";
    case "In Progress":
      return "bg-green-100 text-green-700";
    case "Completed":
      return "bg-gray-100 text-gray-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const isUnderstaffed = (event: Event) => {
  return event.assignedStaff.length < event.requiredStaff;
};

export const getStaffPerformance = (staffId: string): StaffPerformance => {
  const reviews = staffReviews;
  const notes = staffNotes;

  const reviewsWithRating = reviews.filter((r) => r.rating > 0);
  const averageRating =
    reviewsWithRating.length > 0
      ? reviewsWithRating.reduce((sum, r) => sum + r.rating, 0) /
        reviewsWithRating.length
      : 0;

  const totalShifts = reviews.length;
  const noShows = reviews.filter((r) => r.punctuality === "no-show").length;
  const lateArrivals = reviews.filter((r) => r.punctuality === "late").length;
  const attendedShifts = totalShifts - noShows;
  const onTimeArrivals = reviews.filter(
    (r) => r.punctuality === "on-time",
  ).length;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviewsWithRating.length,
    attendance: {
      totalShifts,
      attendedShifts,
      lateArrivals,
      noShows,
      attendanceRate:
        totalShifts > 0
          ? Math.round((attendedShifts / totalShifts) * 100)
          : 100,
      punctualityRate:
        attendedShifts > 0
          ? Math.round((onTimeArrivals / attendedShifts) * 100)
          : 100,
    },
    reviews,
    notes,
  };
};

export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Owner":
      return "bg-amber-100 text-amber-800";
    case "Admin":
      return "bg-purple-100 text-purple-700";
    case "Manager":
      return "bg-blue-100 text-blue-700";
    case "Staff":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Deactivated":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function toNumber(v: unknown, fallback = 0) {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function mapBackendGroup(g: BackendGroup): UiGroup {
  return {
    id: g.id,
    name: g.name ?? "",
    description: g.description ?? "",
    color: g.color ?? "#6B7280",
    isActive: !!g.is_active,
    memberCount: toNumber(g.member_count, 0),
    createdAt: g.created_at,
    updatedAt: g.updated_at,
    companyId: g.company,
    companyName: g.company_name,
    members:
      (g as any).members?.map((m: any) => ({
        id: m.id,
        fullName: m.full_name,
        primaryRole: m.primary_role
          ? { id: m.primary_role.id, name: m.primary_role.name }
          : null,
      })) ?? [],
  };
}

export function mapStaffToUi(s: StaffMemberBackend): UiStaff {
  const profession =
    s.primary_role?.name ||
    (s.secondary_roles?.[0]?.name ?? "") ||
    s.employment_type ||
    "";

  return {
    id: s.id,
    firstName: s.first_name ?? "",
    lastName: s.last_name ?? "",
    profession,
    avatar: s.avatar ?? null,
  };
}

export function mapGroupFormToPayload(data: any) {
  return {
    name: (data?.name ?? "").trim(),
    description: (data?.description ?? "").trim(),
    color: data?.color || "#6B7280",
    is_active: !!data?.isActive,
    member_ids: data?.memberIds ?? [],
  };
}

export const PencilIcon = () => (
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
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

export const ToggleIcon = ({ active }: { active: boolean }) =>
  active ? (
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
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  ) : (
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

export const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (time: string) => {
  if (!time) return "";
  const t = time.slice(0, 5);
  const [hh, mm] = t.split(":");
  const h = parseInt(hh, 10);
  if (!Number.isFinite(h)) return t;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${mm} ${ampm}`;
};

export const readinessLabel = (e: EventItem) => {
  const needed = Number(e.total_staff_needed || 0);
  const filled = Number(e.total_staff_filled || 0);
  if (needed <= 0) return { label: "Ready", ok: true };
  if (filled >= needed) return { label: "Ready", ok: true };
  return { label: "Understaffed", ok: false };
};

export const timeAgo = (dateStr: string) => {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return dateStr;
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

export const getActionIconPath = (action: string) => {
  return (
    actionIcon[action] ||
    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  );
};
