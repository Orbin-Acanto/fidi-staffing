import {
  ActivityLog,
  AttendanceSettings,
  ClockEntry,
  CostForecast,
  CostMetrics,
  DailyOverview,
  Event,
  EventCostBreakdown,
  JobWithdrawal,
  NavSection,
  OvertimeAlert,
  OvertimeCostBreakdown,
  PaymentHistory,
  PayrollEntry,
  PayrollSettings,
  PayrollSummary,
  ProfileActivityLog,
  ReportSummary,
  Settings,
  StaffAttendanceSummary,
  StaffNote,
  StaffPayInfo,
  StaffReview,
  TimeEditRequest,
} from "@/type";

export const navigation: NavSection[] = [
  {
    items: [
      {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: (
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        ),
      },
    ],
  },

  {
    title: "Operations",
    items: [
      {
        name: "Events",
        href: "/admin/events",
        icon: (
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        name: "Locations",
        href: "/admin/locations",
        icon: (
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
      {
        name: "Vendors",
        href: "/admin/vendors",
        icon: (
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
              d="M3 7h18M5 7v14a2 2 0 002 2h10a2 2 0 002-2V7M9 11h6M9 15h6"
            />
          </svg>
        ),
      },
      {
        name: "Contract",
        href: "/admin/contract",
        icon: (
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
              d="M9 12h6m-6 4h6M12 2a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h6zm5 2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2M17 4v16"
            />
          </svg>
        ),
      },
    ],
  },

  {
    title: "Team",
    items: [
      {
        name: "Staff",
        href: "/admin/staff",
        icon: (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
      },
      {
        name: "Roles",
        href: "/admin/roles",
        icon: (
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        ),
      },
      {
        name: "Groups",
        href: "/admin/groups",
        icon: (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
      },
    ],
  },

  {
    title: "Finance",
    items: [
      {
        name: "Time & Attendance",
        href: "/admin/time-attendance",
        icon: (
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        name: "Payroll",
        href: "/admin/payroll",
        icon: (
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
    ],
  },

  {
    title: "System",
    items: [
      {
        name: "User Management",
        href: "/admin/users",
        icon: (
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
      },
      {
        name: "Profile",
        href: "/admin/profile",
        icon: (
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      },
      {
        name: "Settings",
        href: "/admin/settings",
        icon: (
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
    ],
  },
];

export const notifications = [
  {
    id: 1,
    type: "event",
    message: 'New event "Summer Gala" requires 5 staff members',
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "staff",
    message: "John Doe updated availability",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "alert",
    message: 'Event "Corporate Mixer" is understaffed',
    time: "3 hours ago",
    unread: false,
  },
];

export const defaultIcons = {
  event: (
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
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  staff: (
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
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  system: (
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
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  alert: (
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
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
};

export const stats = [
  {
    title: "Total Staff",
    value: "142",
    trend: { value: 12, isPositive: true },
    subtitle: "18 active today",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: "Active Events",
    value: "23",
    trend: { value: 8, isPositive: true },
    subtitle: "5 happening today",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Pending Assignments",
    value: "8",
    subtitle: "Require attention",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Staff Availability",
    value: "89%",
    trend: { value: 3, isPositive: true },
    subtitle: "126 available this week",
    icon: (
      <svg
        className="w-6 h-6"
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
    ),
  },
];

export const upcomingEvents = [
  {
    id: 1,
    name: "Johnson Wedding",
    date: "Today, 6:00 PM",
    location: "Grand Ballroom, NYC",
    staffCount: 8,
    status: "ready" as const,
  },
  {
    id: 2,
    name: "Corporate Mixer",
    date: "Tomorrow, 2:00 PM",
    location: "Tech Hub Convention",
    staffCount: 5,
    status: "understaffed" as const,
  },
  {
    id: 3,
    name: "Birthday Party",
    date: "Nov 19, 4:00 PM",
    location: "Riverside Manor",
    staffCount: 3,
    status: "ready" as const,
  },
  {
    id: 4,
    name: "Corporate",
    date: "Nov 19, 4:00 PM",
    location: "Riverside Manor",
    staffCount: 3,
    status: "ready" as const,
  },
  {
    id: 5,
    name: "Social",
    date: "Nov 19, 4:00 PM",
    location: "Riverside Manor",
    staffCount: 3,
    status: "ready" as const,
  },
];

export const recentActivity = [
  {
    type: "staff" as const,
    title: "New Staff Member",
    description: "Sarah Johnson has been added to the system",
    time: "5 minutes ago",
  },
  {
    type: "event" as const,
    title: "Event Updated",
    description: "Summer Gala schedule changed to 7:00 PM",
    time: "1 hour ago",
  },
  {
    type: "alert" as const,
    title: "Staffing Alert",
    description: "Corporate Mixer needs 2 more bartenders",
    time: "2 hours ago",
  },
  {
    type: "staff" as const,
    title: "Availability Update",
    description: "John Doe marked unavailable for Nov 20-22",
    time: "3 hours ago",
  },
  {
    type: "system" as const,
    title: "System Update",
    description: "Weekly report generated successfully",
    time: "5 hours ago",
  },
];

export const quickActions = [
  {
    title: "Add New Staff",
    description: "Create a new staff member profile",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
    href: "/admin/staff/add",
  },
  {
    title: "Create Event",
    description: "Schedule a new event and assign staff",
    icon: (
      <svg
        className="w-6 h-6"
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
    ),
    href: "/admin/events/create",
  },
  {
    title: "Manage Groups",
    description: "Organize staff into teams",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    href: "/admin/groups",
  },
  {
    title: "View Reports",
    description: "Access analytics and insights",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    href: "/admin/reports",
  },
];

export const professions = [
  "Waiter",
  "Bartender",
  "Chef",
  "Server",
  "Manager",
  "Security",
  "Event Coordinator",
];

export const experienceLevels = ["Junior", "Mid", "Senior"];

export const employmentTypes = ["Full-time", "Part-time", "Contract", "Casual"];

export const availableGroups = [
  "Wedding Team A",
  "Wedding Team B",
  "Bar Squad",
  "Kitchen Team",
  "Corporate Events",
  "Management",
];

export const eventsList: Event[] = [
  {
    id: "1",
    eventName: "Johnson Wedding",
    eventType: "Wedding",
    eventDate: "2024-11-20",
    startTime: "18:00",
    endTime: "23:00",
    location: {
      venueName: "Grand Ballroom",
      city: "New York",
      state: "NY",
    },
    assignedStaff: ["1", "2", "3", "4", "5", "6", "7", "8"],
    requiredStaff: 8,
    status: "Upcoming",
    clientName: "Michael Johnson",
    description: "Elegant wedding reception for 150 guests",
    dressCode: "Black tie",
    specialInstructions: "Vegetarian options required, no nuts",
  },
  {
    id: "2",
    eventName: "Tech Corp Annual Gala",
    eventType: "Corporate",
    eventDate: "2024-11-19",
    startTime: "19:00",
    endTime: "00:00",
    location: {
      venueName: "Tech Hub Convention Center",
      city: "San Francisco",
      state: "CA",
    },
    assignedStaff: ["1", "2", "3"],
    requiredStaff: 5,
    status: "Upcoming",
    clientName: "Tech Corp Inc",
    description: "Annual company celebration",
    dressCode: "Business formal",
  },
  {
    id: "3",
    eventName: "Birthday Celebration",
    eventType: "Party",
    eventDate: "2024-11-22",
    startTime: "16:00",
    endTime: "21:00",
    location: {
      venueName: "Riverside Manor",
      city: "Austin",
      state: "TX",
    },
    assignedStaff: ["1", "2", "3"],
    requiredStaff: 3,
    status: "Upcoming",
    clientName: "Sarah Williams",
    description: "50th birthday party",
  },
  {
    id: "4",
    eventName: "Summer Music Festival",
    eventType: "Festival",
    eventDate: "2024-11-15",
    startTime: "12:00",
    endTime: "22:00",
    location: {
      venueName: "Central Park",
      city: "Los Angeles",
      state: "CA",
    },
    assignedStaff: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    requiredStaff: 10,
    status: "Completed",
    clientName: "City Events LLC",
    description: "Outdoor music festival with multiple stages",
  },
  {
    id: "5",
    eventName: "Smith Anniversary",
    eventType: "Wedding",
    eventDate: "2024-11-10",
    startTime: "17:00",
    endTime: "22:00",
    location: {
      venueName: "Garden Terrace",
      city: "Miami",
      state: "FL",
    },
    assignedStaff: ["1", "2", "3", "4", "5"],
    requiredStaff: 5,
    status: "Completed",
    clientName: "Robert Smith",
    description: "25th wedding anniversary celebration",
  },
];

export const eventTypes = [
  "Wedding",
  "Corporate",
  "Gala",
  "Birthday Party",
  "Conference",
  "Fundraiser",
  "Cocktail Party",
  "Dinner Party",
  "Holiday Party",
  "Other",
];

export const EVENT_TYPE_VALUE_MAP: Record<string, string> = {
  Wedding: "wedding",
  Corporate: "corporate",
  Gala: "gala",
  "Birthday Party": "birthday",
  Conference: "conference",
  Fundraiser: "fundraiser",
  "Cocktail Party": "cocktail",
  "Dinner Party": "dinner",
  "Holiday Party": "holiday",
  Other: "other",
};

export const dressCodes = [
  "Casual",
  "Business Casual",
  "Business Formal",
  "Black Tie",
  "White Tie",
  "Uniform",
];

export const jobHistory = [
  {
    id: 1,
    eventName: "Corporate Gala 2024",
    date: "2024-11-15",
    role: "Lead Server",
    hours: 8,
    status: "Completed",
  },
  {
    id: 2,
    eventName: "Wedding Reception",
    date: "2024-11-10",
    role: "Server",
    hours: 6,
    status: "Completed",
  },
  {
    id: 3,
    eventName: "Holiday Party",
    date: "2024-11-05",
    role: "Bartender",
    hours: 5,
    status: "Completed",
  },
];

export const colorOptions = [
  { name: "Gold", value: "#d2b371" },
  { name: "Brown", value: "#8B4513" },
  { name: "Gray", value: "#4A5568" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Red", value: "#EF4444" },
  { name: "Pink", value: "#EC4899" },
];

export const settingsData: Settings = {
  general: {
    companyName: "EventStaff Pro",
    logo: "",
    timeZone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    overtimeMultiplier: 1.5,
    taxRate: 8.875,
    taxId: "12-3456789",
    complianceNotes:
      "All staff must complete I-9 verification within 3 days of hire.",
  },
  email: {
    senderName: "EventStaff Pro",
    senderEmail: "notifications@eventstaffpro.com",
    templates: [
      {
        id: "welcome",
        name: "Welcome Email",
        subject: "Welcome to {{company_name}}!",
        body: `Dear {{staff_name}},

Welcome to {{company_name}}! We're excited to have you join our team.

Your account has been created. Please use the following link to set up your password and complete your profile:

{{setup_link}}

If you have any questions, please don't hesitate to reach out.

Best regards,
The {{company_name}} Team`,
        variables: ["staff_name", "company_name", "setup_link"],
        lastUpdated: "2024-12-15",
      },
      {
        id: "event_assignment",
        name: "Event Assignment",
        subject: "New Event Assignment: {{event_name}}",
        body: `Hi {{staff_name}},

You have been assigned to a new event:

Event: {{event_name}}
Date: {{event_date}}
Time: {{event_time}}
Location: {{event_location}}
Role: {{staff_role}}

Please confirm your availability by clicking the link below:

{{confirmation_link}}

Best regards,
The {{company_name}} Team`,
        variables: [
          "staff_name",
          "event_name",
          "event_date",
          "event_time",
          "event_location",
          "staff_role",
          "confirmation_link",
          "company_name",
        ],
        lastUpdated: "2024-12-20",
      },
      {
        id: "event_reminder",
        name: "Event Reminder",
        subject: "Reminder: {{event_name}} is coming up!",
        body: `Hi {{staff_name}},

This is a friendly reminder that you have an upcoming event:

Event: {{event_name}}
Date: {{event_date}}
Time: {{event_time}}
Location: {{event_location}}

Please arrive at least 15 minutes before your scheduled start time.

Best regards,
The {{company_name}} Team`,
        variables: [
          "staff_name",
          "event_name",
          "event_date",
          "event_time",
          "event_location",
          "company_name",
        ],
        lastUpdated: "2024-12-18",
      },
      {
        id: "password_reset",
        name: "Password Reset",
        subject: "Password Reset Request",
        body: `Hi {{staff_name}},

We received a request to reset your password. Click the link below to create a new password:

{{reset_link}}

This link will expire in 24 hours.

If you didn't request this, please ignore this email or contact support if you have concerns.

Best regards,
The {{company_name}} Team`,
        variables: ["staff_name", "reset_link", "company_name"],
        lastUpdated: "2024-11-10",
      },
    ],
  },
  system: {
    autoBackup: true,
    backupFrequency: "weekly",
    lastBackup: "2025-01-01T03:00:00",
    retentionDays: 30,
  },
};

export const timeZones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
];

export const dateFormats = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2024)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2024)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-12-31)" },
  { value: "MMM DD, YYYY", label: "MMM DD, YYYY (Dec 31, 2024)" },
  { value: "DD MMM YYYY", label: "DD MMM YYYY (31 Dec 2024)" },
];

export const currencies = [
  { value: "USD", label: "USD ($) - US Dollar" },
  { value: "EUR", label: "EUR (€) - Euro" },
  { value: "GBP", label: "GBP (£) - British Pound" },
  { value: "CAD", label: "CAD ($) - Canadian Dollar" },
  { value: "AUD", label: "AUD ($) - Australian Dollar" },
  { value: "AED", label: "AED (د.إ) - UAE Dirham" },
  { value: "JPY", label: "JPY (¥) - Japanese Yen" },
];

export const reportData: ReportSummary = {
  eventStatistics: {
    totalEvents: 156,
    completedEvents: 142,
    upcomingEvents: 12,
    cancelledEvents: 2,
    averageStaffPerEvent: 8.5,
    totalRevenue: 485000,
  },
  staffUtilization: [
    {
      staffId: "staff_1",
      staffName: "Michael Rodriguez",
      totalHours: 186,
      eventsWorked: 24,
      utilizationRate: 92,
      overtimeHours: 18,
      rating: 4.9,
    },
    {
      staffId: "staff_2",
      staffName: "Sarah Chen",
      totalHours: 172,
      eventsWorked: 22,
      utilizationRate: 88,
      overtimeHours: 12,
      rating: 4.8,
    },
    {
      staffId: "staff_3",
      staffName: "David Park",
      totalHours: 165,
      eventsWorked: 21,
      utilizationRate: 85,
      overtimeHours: 8,
      rating: 4.7,
    },
    {
      staffId: "staff_4",
      staffName: "Emily Thompson",
      totalHours: 158,
      eventsWorked: 20,
      utilizationRate: 82,
      overtimeHours: 6,
      rating: 4.8,
    },
    {
      staffId: "staff_5",
      staffName: "James Wilson",
      totalHours: 145,
      eventsWorked: 18,
      utilizationRate: 78,
      overtimeHours: 4,
      rating: 4.6,
    },
    {
      staffId: "staff_6",
      staffName: "Amanda Foster",
      totalHours: 138,
      eventsWorked: 17,
      utilizationRate: 75,
      overtimeHours: 2,
      rating: 4.5,
    },
    {
      staffId: "staff_7",
      staffName: "Robert Kim",
      totalHours: 125,
      eventsWorked: 15,
      utilizationRate: 68,
      overtimeHours: 0,
      rating: 4.4,
    },
    {
      staffId: "staff_8",
      staffName: "Jessica Williams",
      totalHours: 112,
      eventsWorked: 14,
      utilizationRate: 62,
      overtimeHours: 0,
      rating: 4.3,
    },
  ],
  attendanceRecords: [
    {
      staffId: "staff_1",
      staffName: "Michael Rodriguez",
      scheduledShifts: 24,
      attendedShifts: 24,
      lateArrivals: 1,
      noShows: 0,
      attendanceRate: 100,
    },
    {
      staffId: "staff_2",
      staffName: "Sarah Chen",
      scheduledShifts: 22,
      attendedShifts: 22,
      lateArrivals: 0,
      noShows: 0,
      attendanceRate: 100,
    },
    {
      staffId: "staff_3",
      staffName: "David Park",
      scheduledShifts: 21,
      attendedShifts: 20,
      lateArrivals: 2,
      noShows: 1,
      attendanceRate: 95,
    },
    {
      staffId: "staff_4",
      staffName: "Emily Thompson",
      scheduledShifts: 20,
      attendedShifts: 19,
      lateArrivals: 1,
      noShows: 1,
      attendanceRate: 95,
    },
    {
      staffId: "staff_5",
      staffName: "James Wilson",
      scheduledShifts: 18,
      attendedShifts: 17,
      lateArrivals: 3,
      noShows: 1,
      attendanceRate: 94,
    },
    {
      staffId: "staff_6",
      staffName: "Amanda Foster",
      scheduledShifts: 17,
      attendedShifts: 16,
      lateArrivals: 2,
      noShows: 1,
      attendanceRate: 94,
    },
  ],
  monthlyTrends: [
    { month: "Jul", events: 12, staffHours: 420, revenue: 38000 },
    { month: "Aug", events: 15, staffHours: 520, revenue: 45000 },
    { month: "Sep", events: 18, staffHours: 610, revenue: 52000 },
    { month: "Oct", events: 22, staffHours: 750, revenue: 68000 },
    { month: "Nov", events: 25, staffHours: 880, revenue: 78000 },
    { month: "Dec", events: 32, staffHours: 1100, revenue: 95000 },
  ],
  eventTypeBreakdown: [
    { type: "Corporate Events", count: 45, percentage: 29, color: "#6366f1" },
    { type: "Weddings", count: 38, percentage: 24, color: "#ec4899" },
    { type: "Conferences", count: 32, percentage: 21, color: "#14b8a6" },
    { type: "Private Parties", count: 25, percentage: 16, color: "#f59e0b" },
    { type: "Other", count: 16, percentage: 10, color: "#6b7280" },
  ],
  topPerformers: [
    {
      staffId: "staff_1",
      staffName: "Michael Rodriguez",
      eventsWorked: 24,
      hoursWorked: 186,
      rating: 4.9,
      onTimeRate: 98,
    },
    {
      staffId: "staff_2",
      staffName: "Sarah Chen",
      eventsWorked: 22,
      hoursWorked: 172,
      rating: 4.8,
      onTimeRate: 100,
    },
    {
      staffId: "staff_4",
      staffName: "Emily Thompson",
      eventsWorked: 20,
      hoursWorked: 158,
      rating: 4.8,
      onTimeRate: 97,
    },
    {
      staffId: "staff_3",
      staffName: "David Park",
      eventsWorked: 21,
      hoursWorked: 165,
      rating: 4.7,
      onTimeRate: 92,
    },
    {
      staffId: "staff_5",
      staffName: "James Wilson",
      eventsWorked: 18,
      hoursWorked: 145,
      rating: 4.6,
      onTimeRate: 89,
    },
  ],
};

export const staffReviews: StaffReview[] = [
  {
    id: "review_1",
    eventId: "evt_1",
    eventName: "Annual Corporate Gala",
    eventDate: "2024-12-15",
    rating: 5,
    punctuality: "on-time",
    performance: "excellent",
    reviewedBy: "John Mitchell",
    reviewedAt: "2024-12-16",
    notes:
      "Outstanding performance. Went above and beyond to help with last-minute setup changes.",
  },
  {
    id: "review_2",
    eventId: "evt_2",
    eventName: "Tech Conference 2024",
    eventDate: "2024-12-10",
    rating: 4,
    punctuality: "on-time",
    performance: "good",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2024-12-11",
    notes: "Good work overall. Handled registration desk efficiently.",
  },
  {
    id: "review_3",
    eventId: "evt_3",
    eventName: "Wedding Reception - Smith",
    eventDate: "2024-12-05",
    rating: 5,
    punctuality: "on-time",
    performance: "excellent",
    reviewedBy: "Emily Thompson",
    reviewedAt: "2024-12-06",
  },
  {
    id: "review_4",
    eventId: "evt_4",
    eventName: "Product Launch Party",
    eventDate: "2024-11-28",
    rating: 3,
    punctuality: "late",
    performance: "average",
    reviewedBy: "Michael Rodriguez",
    reviewedAt: "2024-11-29",
    notes: "Arrived 15 minutes late. Performance was acceptable once on-site.",
  },
  {
    id: "review_5",
    eventId: "evt_5",
    eventName: "Holiday Charity Dinner",
    eventDate: "2024-11-20",
    rating: 4,
    punctuality: "on-time",
    performance: "good",
    reviewedBy: "John Mitchell",
    reviewedAt: "2024-11-21",
  },
  {
    id: "review_6",
    eventId: "evt_6",
    eventName: "Networking Mixer",
    eventDate: "2024-11-15",
    rating: 0,
    punctuality: "no-show",
    performance: "poor",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2024-11-16",
    notes: "Did not show up. No prior notice given. First incident.",
  },
];

export const staffNotes: StaffNote[] = [
  {
    id: "note_1",
    content:
      "Excellent communication skills. Recommended for client-facing roles.",
    createdBy: "John Mitchell",
    createdAt: "2024-12-16",
    type: "praise",
  },
  {
    id: "note_2",
    content: "Has food handler certification. Expires March 2025.",
    createdBy: "Sarah Chen",
    createdAt: "2024-11-01",
    type: "general",
  },
  {
    id: "note_3",
    content:
      "No-show on Nov 15. Verbal warning issued. Staff acknowledged and apologized.",
    createdBy: "Sarah Chen",
    createdAt: "2024-11-16",
    type: "warning",
  },
  {
    id: "note_4",
    content:
      "Prefers weekend shifts. Available for overtime during holiday season.",
    createdBy: "Emily Thompson",
    createdAt: "2024-10-20",
    type: "general",
  },
];

const today = new Date().toISOString().split("T")[0];

export const attendanceSettings: AttendanceSettings = {
  clockInGracePeriod: 15,
  clockOutGracePeriod: 15,
  autoClockOutEnabled: true,
  autoClockOutAfter: 6,
  gpsRestrictionEnabled: true,
  geofenceRadius: 250,
  requirePhotoVerification: false,
  lateThresholdMinutes: 15,
  earlyClockInAllowed: true,
  earlyClockInMinutes: 45,
  missedPunchAutoFlag: true,
  manualTimeEditRequiresApproval: true,
  overtimeRequiresApproval: true,
  overtimeThresholdHours: 40,
  noShowAfterMinutes: 45,
  autoFlagNoShow: true,
};

export const todayClockEntries: ClockEntry[] = [
  {
    id: "clock_1",
    staffId: "staff_1",
    staffName: "Michael Rodriguez",
    eventId: "evt_1",
    eventName: "Corporate Gala",
    date: today,
    scheduledStart: "09:00",
    scheduledEnd: "17:00",
    clockIn: "08:55",
    status: "clocked-in",
    punctuality: "on-time",
    totalHours: 5.5,
    location: {
      clockInLocation: "48 Wall St, New York",
      isWithinGeofence: true,
    },
    isApproved: true,
  },
  {
    id: "clock_2",
    staffId: "staff_2",
    staffName: "Sarah Chen",
    eventId: "evt_1",
    eventName: "Corporate Gala",
    date: today,
    scheduledStart: "09:00",
    scheduledEnd: "17:00",
    clockIn: "09:12",
    status: "clocked-in",
    punctuality: "late",
    lateMinutes: 12,
    totalHours: 5.2,
    location: {
      clockInLocation: "48 Wall St, New York",
      isWithinGeofence: true,
    },
    isApproved: false,
  },
  {
    id: "clock_3",
    staffId: "staff_3",
    staffName: "David Park",
    eventId: "evt_2",
    eventName: "Wedding Reception",
    date: today,
    scheduledStart: "10:00",
    scheduledEnd: "18:00",
    clockIn: "09:45",
    clockOut: "14:30",
    status: "clocked-out",
    punctuality: "early",
    earlyMinutes: 15,
    totalHours: 4.75,
    location: {
      clockInLocation: "The Plaza Hotel",
      clockOutLocation: "The Plaza Hotel",
      isWithinGeofence: true,
    },
    isApproved: true,
  },
  {
    id: "clock_4",
    staffId: "staff_4",
    staffName: "Emily Thompson",
    eventId: "evt_1",
    eventName: "Corporate Gala",
    date: today,
    scheduledStart: "09:00",
    scheduledEnd: "17:00",
    status: "not-started",
    punctuality: "on-time",
    isApproved: false,
  },
  {
    id: "clock_5",
    staffId: "staff_5",
    staffName: "James Wilson",
    eventId: "evt_2",
    eventName: "Wedding Reception",
    date: today,
    scheduledStart: "10:00",
    scheduledEnd: "18:00",
    status: "no-show",
    punctuality: "no-show",
    isApproved: false,
    notes: "No contact received. First no-show incident.",
  },
  {
    id: "clock_6",
    staffId: "staff_6",
    staffName: "Amanda Foster",
    eventId: "evt_3",
    eventName: "Tech Conference",
    date: today,
    scheduledStart: "08:00",
    scheduledEnd: "16:00",
    clockIn: "07:50",
    clockOut: "16:15",
    status: "clocked-out",
    punctuality: "on-time",
    totalHours: 8.42,
    overtimeHours: 0.42,
    location: {
      clockInLocation: "Javits Center",
      clockOutLocation: "Javits Center",
      isWithinGeofence: true,
    },
    isApproved: true,
  },
  {
    id: "clock_7",
    staffId: "staff_7",
    staffName: "Robert Kim",
    eventId: "evt_3",
    eventName: "Tech Conference",
    date: today,
    scheduledStart: "08:00",
    scheduledEnd: "16:00",
    clockIn: "08:25",
    status: "clocked-in",
    punctuality: "late",
    lateMinutes: 25,
    totalHours: 6.1,
    location: {
      clockInLocation: "Unknown Location",
      isWithinGeofence: false,
    },
    isApproved: false,
    notes: "Clocked in outside geofence. Needs verification.",
  },
  {
    id: "clock_8",
    staffId: "staff_8",
    staffName: "Jessica Williams",
    eventId: "evt_4",
    eventName: "Private Party",
    date: today,
    scheduledStart: "18:00",
    scheduledEnd: "23:00",
    status: "not-started",
    punctuality: "on-time",
    isApproved: false,
  },
];

export const timeEditRequests: TimeEditRequest[] = [
  {
    id: "req_1",
    staffId: "staff_2",
    staffName: "Sarah Chen",
    clockEntryId: "clock_2",
    eventName: "Corporate Gala",
    date: today,
    originalClockIn: "09:12",
    requestedClockIn: "08:58",
    reason:
      "Traffic delay caused late scan, but I arrived at 8:58 AM. Security can verify.",
    requestType: "time-correction",
    status: "pending",
    requestedAt: "2025-01-02T09:30:00",
  },
  {
    id: "req_2",
    staffId: "staff_9",
    staffName: "Daniel Brown",
    clockEntryId: "clock_prev_1",
    eventName: "Holiday Party",
    date: "2025-01-01",
    originalClockOut: undefined,
    requestedClockOut: "22:30",
    reason: "Forgot to clock out. Left at 10:30 PM with supervisor Maria.",
    requestType: "forgot-clock-out",
    status: "pending",
    requestedAt: "2025-01-02T08:00:00",
  },
  {
    id: "req_3",
    staffId: "staff_10",
    staffName: "Lisa Martinez",
    clockEntryId: "clock_prev_2",
    eventName: "New Year Gala",
    date: "2024-12-31",
    originalClockIn: undefined,
    originalClockOut: undefined,
    requestedClockIn: "19:00",
    requestedClockOut: "02:00",
    reason: "Phone died, couldn't clock in/out. Worked full shift.",
    requestType: "missed-punch",
    status: "pending",
    requestedAt: "2025-01-01T10:00:00",
  },
  {
    id: "req_4",
    staffId: "staff_3",
    staffName: "David Park",
    clockEntryId: "clock_prev_3",
    eventName: "Corporate Lunch",
    date: "2024-12-30",
    originalClockIn: "11:45",
    requestedClockIn: "11:30",
    reason: "App crashed during clock-in. Arrived at 11:30.",
    requestType: "time-correction",
    status: "approved",
    requestedAt: "2024-12-30T12:00:00",
    reviewedBy: "John Mitchell",
    reviewedAt: "2024-12-30T14:00:00",
  },
  {
    id: "req_5",
    staffId: "staff_11",
    staffName: "Kevin O'Brien",
    clockEntryId: "clock_prev_4",
    eventName: "Charity Dinner",
    date: "2024-12-28",
    originalClockIn: "17:15",
    requestedClockIn: "17:00",
    reason: "Was helping with setup before clocking in.",
    requestType: "time-correction",
    status: "rejected",
    requestedAt: "2024-12-28T22:00:00",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2024-12-29T09:00:00",
    rejectionReason: "No supervisor verification of early arrival.",
  },
];

export const jobWithdrawals: JobWithdrawal[] = [
  {
    id: "withdraw_1",
    staffId: "staff_12",
    staffName: "Nicole Adams",
    eventId: "evt_5",
    eventName: "Wedding Reception - Johnson",
    eventDate: "2025-01-05",
    withdrawnAt: "2025-01-02T10:00:00",
    reason: "Family emergency - need to travel out of state.",
    status: "acknowledged",
    acknowledgedBy: "John Mitchell",
    acknowledgedAt: "2025-01-02T11:30:00",
  },
  {
    id: "withdraw_2",
    staffId: "staff_13",
    staffName: "Chris Taylor",
    eventId: "evt_6",
    eventName: "Corporate Conference",
    eventDate: "2025-01-04",
    withdrawnAt: "2025-01-02T08:30:00",
    reason: "Double booked with another commitment.",
    status: "pending-review",
  },
  {
    id: "withdraw_3",
    staffId: "staff_5",
    staffName: "James Wilson",
    eventId: "evt_7",
    eventName: "Private Dinner",
    eventDate: "2025-01-03",
    withdrawnAt: "2025-01-02T07:00:00",
    reason: "Not feeling well, might be coming down with something.",
    status: "pending-review",
  },
  {
    id: "withdraw_4",
    staffId: "staff_14",
    staffName: "Rachel Green",
    eventId: "evt_8",
    eventName: "Birthday Party",
    eventDate: "2024-12-29",
    withdrawnAt: "2024-12-28T20:00:00",
    reason: "Car broke down, no transportation.",
    status: "penalized",
    acknowledgedBy: "Sarah Chen",
    acknowledgedAt: "2024-12-29T08:00:00",
    penalty: "Late withdrawal - 1 point added to record",
  },
];

export const overtimeAlerts: OvertimeAlert[] = [
  {
    id: "ot_1",
    staffId: "staff_1",
    staffName: "Michael Rodriguez",
    weekStartDate: "2024-12-30",
    regularHours: 40,
    overtimeHours: 6.5,
    projectedOvertime: 10,
    alertType: "exceeded",
    isAcknowledged: false,
  },
  {
    id: "ot_2",
    staffId: "staff_6",
    staffName: "Amanda Foster",
    weekStartDate: "2024-12-30",
    regularHours: 38,
    overtimeHours: 0,
    projectedOvertime: 4,
    alertType: "approaching",
    isAcknowledged: false,
  },
  {
    id: "ot_3",
    staffId: "staff_3",
    staffName: "David Park",
    weekStartDate: "2024-12-30",
    regularHours: 40,
    overtimeHours: 12,
    projectedOvertime: 18,
    alertType: "critical",
    isAcknowledged: true,
  },
];

export const staffAttendanceSummaries: StaffAttendanceSummary[] = [
  {
    staffId: "staff_1",
    staffName: "Michael Rodriguez",
    period: "month",
    totalShifts: 22,
    attendedShifts: 22,
    noShows: 0,
    lateArrivals: 1,
    earlyDepartures: 0,
    totalHoursWorked: 186,
    overtimeHours: 18,
    attendanceRate: 100,
    reliabilityScore: 98,
    pendingRequests: 0,
  },
  {
    staffId: "staff_2",
    staffName: "Sarah Chen",
    period: "month",
    totalShifts: 20,
    attendedShifts: 20,
    noShows: 0,
    lateArrivals: 3,
    earlyDepartures: 1,
    totalHoursWorked: 165,
    overtimeHours: 8,
    attendanceRate: 100,
    reliabilityScore: 92,
    pendingRequests: 1,
  },
  {
    staffId: "staff_3",
    staffName: "David Park",
    period: "month",
    totalShifts: 18,
    attendedShifts: 17,
    noShows: 1,
    lateArrivals: 2,
    earlyDepartures: 2,
    totalHoursWorked: 142,
    overtimeHours: 12,
    attendanceRate: 94,
    reliabilityScore: 85,
    pendingRequests: 0,
  },
  {
    staffId: "staff_5",
    staffName: "James Wilson",
    period: "month",
    totalShifts: 15,
    attendedShifts: 12,
    noShows: 3,
    lateArrivals: 4,
    earlyDepartures: 1,
    totalHoursWorked: 95,
    overtimeHours: 0,
    attendanceRate: 80,
    reliabilityScore: 65,
    pendingRequests: 0,
  },
  {
    staffId: "staff_6",
    staffName: "Amanda Foster",
    period: "month",
    totalShifts: 19,
    attendedShifts: 19,
    noShows: 0,
    lateArrivals: 0,
    earlyDepartures: 0,
    totalHoursWorked: 158,
    overtimeHours: 6,
    attendanceRate: 100,
    reliabilityScore: 100,
    pendingRequests: 0,
  },
];

export const dailyOverview: DailyOverview = {
  date: today,
  totalScheduled: 8,
  clockedIn: 4,
  clockedOut: 2,
  notStarted: 2,
  late: 2,
  noShows: 1,
  pendingApprovals: 5,
  overtimeAlerts: 3,
};

export const payrollSettings: PayrollSettings = {
  defaultOvertimeMultiplier: 1.5,
  overtimeThresholdDaily: 8,
  overtimeThresholdWeekly: 40,
  defaultTaxRate: 15,
  payPeriod: "bi-weekly",
  payDayOfWeek: 5, // Friday
  payDayOfMonth: 15,
  autoApproveThreshold: 500,
  requireApprovalForOvertime: true,
  requireApprovalForBonuses: true,
};

export const staffPayInfo: StaffPayInfo[] = [
  {
    staffId: "staff_1",
    staffName: "Michael Rodriguez",
    staffPhone: "(555) 123-4567",
    staffEmail: "michael.r@email.com",
    payType: "hourly",
    hourlyRate: 25,
    overtimeMultiplier: 1.5,
    taxWithholdingRate: 15,
  },
  {
    staffId: "staff_2",
    staffName: "Sarah Chen",
    staffPhone: "(555) 234-5678",
    staffEmail: "sarah.c@email.com",
    payType: "hourly",
    hourlyRate: 28,
    overtimeMultiplier: 1.5,
    taxWithholdingRate: 15,
  },
  {
    staffId: "staff_3",
    staffName: "David Park",
    staffPhone: "(555) 345-6789",
    staffEmail: "david.p@email.com",
    payType: "fixed",
    fixedRate: 200,
    overtimeMultiplier: 1.5,
    taxWithholdingRate: 12,
  },
  {
    staffId: "staff_4",
    staffName: "Emily Thompson",
    staffPhone: "(555) 456-7890",
    staffEmail: "emily.t@email.com",
    payType: "hourly",
    hourlyRate: 22,
    overtimeMultiplier: 1.5,
    taxWithholdingRate: 15,
  },
  {
    staffId: "staff_5",
    staffName: "James Wilson",
    staffPhone: "(555) 567-8901",
    staffEmail: "james.w@email.com",
    payType: "fixed",
    fixedRate: 175,
    overtimeMultiplier: 1.5,
    taxWithholdingRate: 12,
  },
  {
    staffId: "staff_6",
    staffName: "Amanda Foster",
    staffPhone: "(555) 678-9012",
    staffEmail: "amanda.f@email.com",
    payType: "hourly",
    hourlyRate: 30,
    overtimeMultiplier: 1.5,
    taxWithholdingRate: 18,
  },
];

export const currentPayrollEntries: PayrollEntry[] = [
  {
    id: "payroll_1",
    staffId: "staff_1",
    staffName: "Michael Rodriguez",
    staffPhone: "(555) 123-4567",
    payType: "hourly",
    periodType: "bi-weekly",
    periodStart: "2024-12-16",
    periodEnd: "2024-12-29",
    events: [
      {
        eventId: "evt_1",
        eventName: "Corporate Gala",
        eventDate: "2024-12-18",
        hoursWorked: 10,
        overtimeHours: 2,
        isFixedRate: false,
      },
      {
        eventId: "evt_2",
        eventName: "Wedding Reception",
        eventDate: "2024-12-20",
        hoursWorked: 8,
        overtimeHours: 0,
        isFixedRate: false,
      },
      {
        eventId: "evt_3",
        eventName: "Tech Conference",
        eventDate: "2024-12-22",
        hoursWorked: 12,
        overtimeHours: 4,
        isFixedRate: false,
      },
      {
        eventId: "evt_4",
        eventName: "Holiday Party",
        eventDate: "2024-12-24",
        hoursWorked: 6,
        overtimeHours: 0,
        isFixedRate: false,
      },
    ],
    totalHours: 36,
    regularHours: 30,
    overtimeHours: 6,
    hourlyRate: 25,
    fixedRate: 0,
    regularPay: 750,
    overtimePay: 225,
    grossPay: 975,
    deductions: [
      {
        id: "ded_1",
        type: "late-attendance",
        description: "Late arrival - Corporate Gala",
        amount: 25,
        eventId: "evt_1",
        eventName: "Corporate Gala",
        date: "2024-12-18",
      },
    ],
    bonuses: [
      {
        id: "bon_1",
        type: "performance",
        description: "Excellent client feedback",
        amount: 50,
        date: "2024-12-22",
      },
    ],
    totalDeductions: 25,
    totalBonuses: 50,
    taxWithholding: 150,
    netPay: 850,
    status: "pending",
    createdAt: "2024-12-30T10:00:00",
    notes: "Strong performance this period",
  },
  {
    id: "payroll_2",
    staffId: "staff_2",
    staffName: "Sarah Chen",
    staffPhone: "(555) 234-5678",
    payType: "hourly",
    periodType: "bi-weekly",
    periodStart: "2024-12-16",
    periodEnd: "2024-12-29",
    events: [
      {
        eventId: "evt_1",
        eventName: "Corporate Gala",
        eventDate: "2024-12-18",
        hoursWorked: 10,
        overtimeHours: 2,
        isFixedRate: false,
      },
      {
        eventId: "evt_5",
        eventName: "Private Dinner",
        eventDate: "2024-12-21",
        hoursWorked: 5,
        overtimeHours: 0,
        isFixedRate: false,
      },
      {
        eventId: "evt_3",
        eventName: "Tech Conference",
        eventDate: "2024-12-22",
        hoursWorked: 10,
        overtimeHours: 2,
        isFixedRate: false,
      },
    ],
    totalHours: 25,
    regularHours: 21,
    overtimeHours: 4,
    hourlyRate: 28,
    fixedRate: 0,
    regularPay: 588,
    overtimePay: 168,
    grossPay: 756,
    deductions: [],
    bonuses: [],
    totalDeductions: 0,
    totalBonuses: 0,
    taxWithholding: 113.4,
    netPay: 642.6,
    status: "approved",
    createdAt: "2024-12-30T10:00:00",
    approvedBy: "John Mitchell",
    approvedAt: "2024-12-30T14:00:00",
  },
  {
    id: "payroll_3",
    staffId: "staff_3",
    staffName: "David Park",
    staffPhone: "(555) 345-6789",
    payType: "fixed",
    periodType: "bi-weekly",
    periodStart: "2024-12-16",
    periodEnd: "2024-12-29",
    events: [
      {
        eventId: "evt_2",
        eventName: "Wedding Reception",
        eventDate: "2024-12-20",
        hoursWorked: 8,
        overtimeHours: 0,
        isFixedRate: true,
      },
      {
        eventId: "evt_6",
        eventName: "Birthday Party",
        eventDate: "2024-12-23",
        hoursWorked: 6,
        overtimeHours: 0,
        isFixedRate: true,
      },
      {
        eventId: "evt_7",
        eventName: "New Year Prep",
        eventDate: "2024-12-28",
        hoursWorked: 10,
        overtimeHours: 2,
        isFixedRate: true,
      },
    ],
    totalHours: 24,
    regularHours: 22,
    overtimeHours: 2,
    hourlyRate: 0,
    fixedRate: 200,
    regularPay: 600,
    overtimePay: 60,
    grossPay: 660,
    deductions: [
      {
        id: "ded_2",
        type: "advance-repayment",
        description: "Advance repayment (2/4)",
        amount: 100,
        date: "2024-12-29",
      },
    ],
    bonuses: [],
    totalDeductions: 100,
    totalBonuses: 0,
    taxWithholding: 67.2,
    netPay: 492.8,
    status: "pending",
    createdAt: "2024-12-30T10:00:00",
  },
  {
    id: "payroll_4",
    staffId: "staff_4",
    staffName: "Emily Thompson",
    staffPhone: "(555) 456-7890",
    payType: "hourly",
    periodType: "bi-weekly",
    periodStart: "2024-12-16",
    periodEnd: "2024-12-29",
    events: [
      {
        eventId: "evt_1",
        eventName: "Corporate Gala",
        eventDate: "2024-12-18",
        hoursWorked: 8,
        overtimeHours: 0,
        isFixedRate: false,
      },
      {
        eventId: "evt_4",
        eventName: "Holiday Party",
        eventDate: "2024-12-24",
        hoursWorked: 8,
        overtimeHours: 0,
        isFixedRate: false,
      },
    ],
    totalHours: 16,
    regularHours: 16,
    overtimeHours: 0,
    hourlyRate: 22,
    fixedRate: 0,
    regularPay: 352,
    overtimePay: 0,
    grossPay: 352,
    deductions: [],
    bonuses: [
      {
        id: "bon_2",
        type: "holiday",
        description: "Holiday bonus",
        amount: 50,
        date: "2024-12-24",
      },
    ],
    totalDeductions: 0,
    totalBonuses: 50,
    taxWithholding: 60.3,
    netPay: 341.7,
    status: "draft",
    createdAt: "2024-12-30T10:00:00",
  },
  {
    id: "payroll_5",
    staffId: "staff_6",
    staffName: "Amanda Foster",
    staffPhone: "(555) 678-9012",
    payType: "hourly",
    periodType: "bi-weekly",
    periodStart: "2024-12-16",
    periodEnd: "2024-12-29",
    events: [
      {
        eventId: "evt_3",
        eventName: "Tech Conference",
        eventDate: "2024-12-22",
        hoursWorked: 12,
        overtimeHours: 4,
        isFixedRate: false,
      },
      {
        eventId: "evt_8",
        eventName: "Award Ceremony",
        eventDate: "2024-12-26",
        hoursWorked: 10,
        overtimeHours: 2,
        isFixedRate: false,
      },
      {
        eventId: "evt_7",
        eventName: "New Year Prep",
        eventDate: "2024-12-28",
        hoursWorked: 14,
        overtimeHours: 6,
        isFixedRate: false,
      },
    ],
    totalHours: 36,
    regularHours: 24,
    overtimeHours: 12,
    hourlyRate: 30,
    fixedRate: 0,
    regularPay: 720,
    overtimePay: 540,
    grossPay: 1260,
    deductions: [],
    bonuses: [
      {
        id: "bon_3",
        type: "overtime",
        description: "Overtime appreciation bonus",
        amount: 100,
        date: "2024-12-28",
      },
    ],
    totalDeductions: 0,
    totalBonuses: 100,
    taxWithholding: 244.8,
    netPay: 1115.2,
    status: "pending",
    createdAt: "2024-12-30T10:00:00",
  },
];

export const paymentHistory: PaymentHistory[] = [
  {
    id: "hist_1",
    staffId: "staff_1",
    staffName: "Michael Rodriguez",
    periodType: "bi-weekly",
    periodStart: "2024-12-02",
    periodEnd: "2024-12-15",
    grossPay: 920,
    netPay: 782,
    status: "paid",
    paidAt: "2024-12-20",
    payrollEntryId: "payroll_prev_1",
  },
  {
    id: "hist_2",
    staffId: "staff_1",
    staffName: "Michael Rodriguez",
    periodType: "bi-weekly",
    periodStart: "2024-11-18",
    periodEnd: "2024-12-01",
    grossPay: 850,
    netPay: 722.5,
    status: "paid",
    paidAt: "2024-12-06",
    payrollEntryId: "payroll_prev_2",
  },
  {
    id: "hist_3",
    staffId: "staff_2",
    staffName: "Sarah Chen",
    periodType: "bi-weekly",
    periodStart: "2024-12-02",
    periodEnd: "2024-12-15",
    grossPay: 700,
    netPay: 595,
    status: "paid",
    paidAt: "2024-12-20",
    payrollEntryId: "payroll_prev_3",
  },
  {
    id: "hist_4",
    staffId: "staff_6",
    staffName: "Amanda Foster",
    periodType: "bi-weekly",
    periodStart: "2024-12-02",
    periodEnd: "2024-12-15",
    grossPay: 1100,
    netPay: 902,
    status: "paid",
    paidAt: "2024-12-20",
    payrollEntryId: "payroll_prev_4",
  },
];

export const eventCostBreakdown: EventCostBreakdown[] = [
  {
    eventId: "evt_1",
    eventName: "Corporate Gala",
    eventDate: "2024-12-18",
    totalStaff: 8,
    totalHours: 72,
    regularCost: 1680,
    overtimeCost: 252,
    totalCost: 1932,
    costPerHour: 26.83,
  },
  {
    eventId: "evt_2",
    eventName: "Wedding Reception",
    eventDate: "2024-12-20",
    totalStaff: 6,
    totalHours: 48,
    regularCost: 1200,
    overtimeCost: 0,
    totalCost: 1200,
    costPerHour: 25,
  },
  {
    eventId: "evt_3",
    eventName: "Tech Conference",
    eventDate: "2024-12-22",
    totalStaff: 10,
    totalHours: 95,
    regularCost: 2280,
    overtimeCost: 570,
    totalCost: 2850,
    costPerHour: 30,
  },
  {
    eventId: "evt_4",
    eventName: "Holiday Party",
    eventDate: "2024-12-24",
    totalStaff: 5,
    totalHours: 30,
    regularCost: 660,
    overtimeCost: 0,
    totalCost: 660,
    costPerHour: 22,
  },
  {
    eventId: "evt_7",
    eventName: "New Year Prep",
    eventDate: "2024-12-28",
    totalStaff: 12,
    totalHours: 108,
    regularCost: 2520,
    overtimeCost: 756,
    totalCost: 3276,
    costPerHour: 30.33,
  },
];

export const overtimeCostBreakdown: OvertimeCostBreakdown[] = [
  {
    eventId: "evt_1",
    eventName: "Corporate Gala",
    eventDate: "2024-12-18",
    staffCount: 3,
    overtimeHours: 6,
    overtimeCost: 252,
    staffDetails: [
      {
        staffId: "staff_1",
        staffName: "Michael Rodriguez",
        hours: 2,
        cost: 75,
      },
      { staffId: "staff_2", staffName: "Sarah Chen", hours: 2, cost: 84 },
      { staffId: "staff_6", staffName: "Amanda Foster", hours: 2, cost: 90 },
    ],
  },
  {
    eventId: "evt_3",
    eventName: "Tech Conference",
    eventDate: "2024-12-22",
    staffCount: 4,
    overtimeHours: 12,
    overtimeCost: 570,
    staffDetails: [
      {
        staffId: "staff_1",
        staffName: "Michael Rodriguez",
        hours: 4,
        cost: 150,
      },
      { staffId: "staff_2", staffName: "Sarah Chen", hours: 2, cost: 84 },
      { staffId: "staff_6", staffName: "Amanda Foster", hours: 4, cost: 180 },
      { staffId: "staff_3", staffName: "David Park", hours: 2, cost: 60 },
    ],
  },
  {
    eventId: "evt_7",
    eventName: "New Year Prep",
    eventDate: "2024-12-28",
    staffCount: 5,
    overtimeHours: 18,
    overtimeCost: 756,
    staffDetails: [
      { staffId: "staff_6", staffName: "Amanda Foster", hours: 6, cost: 270 },
      {
        staffId: "staff_1",
        staffName: "Michael Rodriguez",
        hours: 4,
        cost: 150,
      },
      { staffId: "staff_3", staffName: "David Park", hours: 2, cost: 60 },
      { staffId: "staff_2", staffName: "Sarah Chen", hours: 4, cost: 168 },
      { staffId: "staff_4", staffName: "Emily Thompson", hours: 2, cost: 66 },
    ],
  },
];

export const costForecast: CostForecast = {
  periodStart: "2025-01-01",
  periodEnd: "2025-01-31",
  events: [
    {
      eventId: "evt_f1",
      eventName: "New Year Gala",
      eventDate: "2025-01-01",
      estimatedStaff: 15,
      estimatedHours: 120,
      estimatedCost: 3200,
      estimatedOvertimeCost: 480,
    },
    {
      eventId: "evt_f2",
      eventName: "Corporate Kickoff",
      eventDate: "2025-01-08",
      estimatedStaff: 8,
      estimatedHours: 64,
      estimatedCost: 1600,
      estimatedOvertimeCost: 0,
    },
    {
      eventId: "evt_f3",
      eventName: "Wedding - Johnson",
      eventDate: "2025-01-12",
      estimatedStaff: 10,
      estimatedHours: 80,
      estimatedCost: 2000,
      estimatedOvertimeCost: 300,
    },
    {
      eventId: "evt_f4",
      eventName: "Tech Summit",
      eventDate: "2025-01-18",
      estimatedStaff: 12,
      estimatedHours: 108,
      estimatedCost: 2880,
      estimatedOvertimeCost: 540,
    },
    {
      eventId: "evt_f5",
      eventName: "Birthday Bash",
      eventDate: "2025-01-22",
      estimatedStaff: 5,
      estimatedHours: 30,
      estimatedCost: 750,
      estimatedOvertimeCost: 0,
    },
    {
      eventId: "evt_f6",
      eventName: "Award Night",
      eventDate: "2025-01-28",
      estimatedStaff: 10,
      estimatedHours: 90,
      estimatedCost: 2400,
      estimatedOvertimeCost: 360,
    },
  ],
  totalEstimatedCost: 12830,
  totalEstimatedOvertimeCost: 1680,
};

export const payrollSummary: PayrollSummary = {
  period: "December 2024",
  totalGrossPay: 15420,
  totalNetPay: 12987,
  totalDeductions: 425,
  totalBonuses: 680,
  totalTaxWithholding: 2108,
  totalOvertimePay: 2340,
  staffCount: 18,
  eventsCount: 12,
  totalHours: 456,
  averageHourlyRate: 26.5,
};

export const costMetrics: CostMetrics = {
  daily: [
    { date: "2024-12-23", cost: 1200, overtime: 180 },
    { date: "2024-12-24", cost: 660, overtime: 0 },
    { date: "2024-12-25", cost: 0, overtime: 0 },
    { date: "2024-12-26", cost: 1400, overtime: 210 },
    { date: "2024-12-27", cost: 800, overtime: 0 },
    { date: "2024-12-28", cost: 3276, overtime: 756 },
    { date: "2024-12-29", cost: 1800, overtime: 270 },
  ],
  weekly: [
    { week: "Dec 2-8", cost: 4200, overtime: 420 },
    { week: "Dec 9-15", cost: 5800, overtime: 680 },
    { week: "Dec 16-22", cost: 6932, overtime: 822 },
    { week: "Dec 23-29", cost: 9136, overtime: 1416 },
  ],
  monthly: [
    { month: "Sep 2024", cost: 18500, overtime: 1850 },
    { month: "Oct 2024", cost: 22400, overtime: 2680 },
    { month: "Nov 2024", cost: 19800, overtime: 2180 },
    { month: "Dec 2024", cost: 26068, overtime: 3338 },
  ],
  yearly: [
    { year: "2022", cost: 185000, overtime: 22000 },
    { year: "2023", cost: 245000, overtime: 31200 },
    { year: "2024", cost: 268000, overtime: 35800 },
  ],
};

export const roleColors = [
  "#3B82F6",
  "#8B5CF6",
  "#F59E0B",
  "#10B981",
  "#EC4899",
  "#6366F1",
  "#EF4444",
  "#14B8A6",
  "#F97316",
  "#84CC16",
];

export const AUDIT_FILTERS = [
  {
    value: "all",
    label: "All",
    params: {},
  },
  {
    value: "staff",
    label: "Staff",
    params: { object_type: "Staff" },
  },
  {
    value: "events",
    label: "Events",
    params: { object_type: "Event" },
  },
  {
    value: "vendors",
    label: "Vendors",
    params: { object_type: "Vendor" },
  },
  {
    value: "companies",
    label: "Companies",
    params: {
      action__in: "company_created,company_updated,company_disabled",
    },
  },
  {
    value: "security",
    label: "Security",
    params: { severity__in: "warning,error,critical" },
  },
] as const;

export const severityColor: Record<string, string> = {
  info: "bg-blue-100 text-blue-600",
  warning: "bg-amber-100 text-amber-600",
  error: "bg-red-100 text-red-600",
  critical: "bg-red-200 text-red-800",
};

export const actionIcon: Record<string, string> = {
  create: "M12 4v16m8-8H4",
  update:
    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  delete:
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  staff_assigned:
    "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  staff_unassigned:
    "M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6",
  event_published: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  event_cancelled:
    "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  company_created:
    "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  clock_in:
    "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
  clock_out:
    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  contract_created:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  payroll_created:
    "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
};
