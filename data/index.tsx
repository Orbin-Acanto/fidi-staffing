import {
  ActivityLog,
  AdminProfile,
  AttendanceSettings,
  ClockEntry,
  DailyOverview,
  Event,
  JobWithdrawal,
  NavSection,
  OvertimeAlert,
  ProfileActivityLog,
  ReportSummary,
  SavedLocation,
  Settings,
  Staff,
  StaffAttendanceSummary,
  StaffNote,
  StaffReview,
  TimeEditRequest,
  User,
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
    title: "Management",
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

export const staffList: Staff[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    profession: "Waiter",
    groups: ["Wedding Team A", "Corporate Events"],
    status: "Active",
    lastActive: "2 hours ago",
    wage: 22.5,
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    profession: "Bartender",
    groups: ["Bar Squad"],
    status: "Active",
    lastActive: "5 minutes ago",
    wage: 29.5,
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 345-6789",
    profession: "Chef",
    groups: ["Kitchen Team"],
    status: "Active",
    lastActive: "1 day ago",
    wage: 25.5,
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.r@example.com",
    phone: "+1 (555) 456-7890",
    profession: "Server",
    groups: ["Wedding Team B"],
    status: "Inactive",
    lastActive: "1 week ago",
    wage: 19,
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Williams",
    email: "david.w@example.com",
    phone: "+1 (555) 567-8901",
    profession: "Manager",
    groups: ["Management", "Corporate Events"],
    status: "Active",
    lastActive: "30 minutes ago",
    wage: 23,
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
  "Party",
  "Festival",
  "Conference",
  "Other",
];

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

export const savedLocations: SavedLocation[] = [
  {
    id: "48wall",
    label: "48 Wall Street — Financial District, NYC",
    venueName: "48 Wall Street",
    street: "48 Wall St, Lobby 1",
    city: "New York",
    state: "NY",
    zipCode: "10005",
    country: "United States",
    contactPerson: "Michael Chen",
    phoneNumber: "+1 (212) 555-0123",
    locationNotes: "Security desk at lobby; elevators require check-in.",
    isFavorite: true,
    eventsCount: 12,
    createdAt: "2024-01-15",
  },
  {
    id: "plazahotel",
    label: "The Plaza Hotel — Midtown Manhattan",
    venueName: "The Plaza Hotel",
    street: "768 5th Ave",
    city: "New York",
    state: "NY",
    zipCode: "10019",
    country: "United States",
    contactPerson: "Sarah Williams",
    phoneNumber: "+1 (212) 555-0456",
    locationNotes:
      "Valet parking available; enter through Fifth Avenue entrance.",
    isFavorite: true,
    eventsCount: 8,
    createdAt: "2024-02-20",
  },
  {
    id: "brooklynwinery",
    label: "Brooklyn Winery — Williamsburg",
    venueName: "Brooklyn Winery",
    street: "213 N 8th St",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11211",
    country: "United States",
    contactPerson: "James Rodriguez",
    phoneNumber: "+1 (718) 555-0789",
    locationNotes: "Loading access via rear alley; limited street parking.",
    isFavorite: false,
    eventsCount: 5,
    createdAt: "2024-03-10",
  },
  {
    id: "pier60",
    label: "Pier Sixty — Chelsea Piers",
    venueName: "Pier Sixty",
    street: "Chelsea Piers, Pier 60",
    city: "New York",
    state: "NY",
    zipCode: "10011",
    country: "United States",
    contactPerson: "Emily Thompson",
    phoneNumber: "+1 (212) 555-0321",
    locationNotes:
      "Large freight elevator available; check dock schedule in advance.",
    isFavorite: false,
    eventsCount: 3,
    createdAt: "2024-04-05",
  },
  {
    id: "metmuseum",
    label: "The Metropolitan Museum of Art — Upper East Side",
    venueName: "The Metropolitan Museum of Art",
    street: "1000 5th Ave",
    city: "New York",
    state: "NY",
    zipCode: "10028",
    country: "United States",
    contactPerson: "David Park",
    phoneNumber: "+1 (212) 555-0654",
    locationNotes:
      "After-hours events only; security clearance required for staff.",
    isFavorite: true,
    eventsCount: 2,
    createdAt: "2024-05-12",
  },
];

export const users: User[] = [
  {
    id: "user_1",
    name: "John Mitchell",
    email: "john.mitchell@company.com",
    phone: "+1 (212) 555-0101",
    role: "Admin",
    status: "Active",
    permissions: {
      canCreateEditDeleteEvents: true,
      canCreateEditDeleteStaff: true,
      canViewReports: true,
      canManageLocations: true,
      canManageGroups: true,
      canAccessSettings: true,
    },
    createdAt: "2023-01-15",
    lastActive: "2025-01-02T14:30:00",
    department: "Operations",
  },
  {
    id: "user_2",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    phone: "+1 (212) 555-0102",
    role: "Admin",
    status: "Active",
    permissions: {
      canCreateEditDeleteEvents: true,
      canCreateEditDeleteStaff: true,
      canViewReports: true,
      canManageLocations: true,
      canManageGroups: true,
      canAccessSettings: true,
    },
    createdAt: "2023-03-20",
    lastActive: "2025-01-02T10:15:00",
    department: "Management",
  },
  {
    id: "user_3",
    name: "Michael Rodriguez",
    email: "michael.r@company.com",
    phone: "+1 (212) 555-0103",
    role: "Manager",
    status: "Active",
    permissions: {
      canCreateEditDeleteEvents: true,
      canCreateEditDeleteStaff: true,
      canViewReports: true,
      canManageLocations: true,
      canManageGroups: true,
      canAccessSettings: false,
    },
    createdAt: "2023-06-10",
    lastActive: "2025-01-01T16:45:00",
    department: "Events",
  },
  {
    id: "user_4",
    name: "Emily Thompson",
    email: "emily.t@company.com",
    phone: "+1 (212) 555-0104",
    role: "Manager",
    status: "Active",
    permissions: {
      canCreateEditDeleteEvents: true,
      canCreateEditDeleteStaff: true,
      canViewReports: true,
      canManageLocations: false,
      canManageGroups: true,
      canAccessSettings: false,
    },
    createdAt: "2023-08-05",
    lastActive: "2024-12-30T09:20:00",
    department: "HR",
  },
  {
    id: "user_5",
    name: "David Park",
    email: "david.park@company.com",
    phone: "+1 (212) 555-0105",
    role: "Staff",
    status: "Active",
    permissions: {
      canCreateEditDeleteEvents: false,
      canCreateEditDeleteStaff: false,
      canViewReports: false,
      canManageLocations: false,
      canManageGroups: false,
      canAccessSettings: false,
    },
    createdAt: "2024-01-12",
    lastActive: "2025-01-02T11:00:00",
    department: "Events",
  },
  {
    id: "user_6",
    name: "Jessica Williams",
    email: "jessica.w@company.com",
    phone: "+1 (212) 555-0106",
    role: "Staff",
    status: "Suspended",
    permissions: {
      canCreateEditDeleteEvents: false,
      canCreateEditDeleteStaff: false,
      canViewReports: false,
      canManageLocations: false,
      canManageGroups: false,
      canAccessSettings: false,
    },
    createdAt: "2024-02-28",
    lastActive: "2024-12-15T14:30:00",
    department: "Operations",
  },
  {
    id: "user_7",
    name: "Robert Kim",
    email: "robert.kim@company.com",
    phone: "+1 (212) 555-0107",
    role: "Staff",
    status: "Deactivated",
    permissions: {
      canCreateEditDeleteEvents: false,
      canCreateEditDeleteStaff: false,
      canViewReports: false,
      canManageLocations: false,
      canManageGroups: false,
      canAccessSettings: false,
    },
    createdAt: "2024-03-15",
    lastActive: "2024-11-20T10:00:00",
    department: "Events",
  },
  {
    id: "user_8",
    name: "Amanda Foster",
    email: "amanda.f@company.com",
    phone: "+1 (212) 555-0108",
    role: "Manager",
    status: "Active",
    permissions: {
      canCreateEditDeleteEvents: true,
      canCreateEditDeleteStaff: false,
      canViewReports: true,
      canManageLocations: true,
      canManageGroups: false,
      canAccessSettings: false,
    },
    createdAt: "2024-05-01",
    lastActive: "2025-01-02T08:45:00",
    department: "Logistics",
  },
];

export const activityLogs: ActivityLog[] = [
  {
    id: "log_1",
    userId: "user_1",
    userName: "John Mitchell",
    action: "Created",
    target: "Event: Annual Corporate Gala",
    timestamp: "2025-01-02T14:30:00",
    details: "Created new event scheduled for Jan 15, 2025",
  },
  {
    id: "log_2",
    userId: "user_3",
    userName: "Michael Rodriguez",
    action: "Updated",
    target: "Staff: David Park",
    timestamp: "2025-01-02T13:15:00",
    details: "Updated contact information",
  },
  {
    id: "log_3",
    userId: "user_2",
    userName: "Sarah Chen",
    action: "Suspended",
    target: "User: Jessica Williams",
    timestamp: "2025-01-02T11:00:00",
    details: "Account suspended due to policy violation",
  },
  {
    id: "log_4",
    userId: "user_4",
    userName: "Emily Thompson",
    action: "Created",
    target: "Staff Group: Weekend Team",
    timestamp: "2025-01-01T16:45:00",
    details: "Created new staff group with 8 members",
  },
  {
    id: "log_5",
    userId: "user_1",
    userName: "John Mitchell",
    action: "Deleted",
    target: "Location: Old Warehouse",
    timestamp: "2025-01-01T10:30:00",
    details: "Removed unused location from system",
  },
  {
    id: "log_6",
    userId: "user_8",
    userName: "Amanda Foster",
    action: "Updated",
    target: "Event: Product Launch",
    timestamp: "2024-12-31T15:20:00",
    details: "Changed venue to The Plaza Hotel",
  },
  {
    id: "log_7",
    userId: "user_3",
    userName: "Michael Rodriguez",
    action: "Reset Password",
    target: "User: David Park",
    timestamp: "2024-12-31T09:00:00",
    details: "Password reset link sent to user email",
  },
  {
    id: "log_8",
    userId: "user_2",
    userName: "Sarah Chen",
    action: "Deactivated",
    target: "User: Robert Kim",
    timestamp: "2024-12-30T14:00:00",
    details: "Account deactivated - employee resigned",
  },
];

export const adminProfile: AdminProfile = {
  id: "admin_1",
  name: "John Mitchell",
  email: "john.mitchell@company.com",
  phone: "+1 (212) 555-0101",
  avatar: "",
  role: "Admin",
  department: "Operations",
  joinedAt: "2023-01-15",
  lastPasswordChange: "2024-11-20",
  notificationPreferences: {
    emailNewStaff: true,
    emailEventReminders: true,
    emailWeeklyReport: false,
    smsNotifications: true,
    smsUrgentAlerts: true,
    voiceCallNotifications: false,
    inAppNotifications: true,
    inAppSound: true,
  },
  twoFactorAuth: {
    enabled: true,
    method: "authenticator",
    lastUpdated: "2024-10-15",
    backupCodesRemaining: 7,
  },
};

export const profileActivityLogs: ProfileActivityLog[] = [
  {
    id: "plog_1",
    action: "Logged in",
    target: "Dashboard",
    timestamp: "2025-01-02T14:30:00",
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
  },
  {
    id: "plog_2",
    action: "Created",
    target: "Event: Annual Corporate Gala",
    timestamp: "2025-01-02T14:15:00",
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
  },
  {
    id: "plog_3",
    action: "Updated",
    target: "Staff: David Park",
    timestamp: "2025-01-02T13:45:00",
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
  },
  {
    id: "plog_4",
    action: "Changed password",
    target: "Account Security",
    timestamp: "2024-11-20T10:00:00",
    ipAddress: "192.168.1.105",
    device: "Safari on MacOS",
  },
  {
    id: "plog_5",
    action: "Enabled 2FA",
    target: "Account Security",
    timestamp: "2024-10-15T09:30:00",
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
  },
  {
    id: "plog_6",
    action: "Deleted",
    target: "Location: Old Warehouse",
    timestamp: "2025-01-01T10:30:00",
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
  },
  {
    id: "plog_7",
    action: "Suspended",
    target: "User: Jessica Williams",
    timestamp: "2024-12-28T16:20:00",
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
  },
  {
    id: "plog_8",
    action: "Updated",
    target: "Notification Preferences",
    timestamp: "2024-12-15T11:00:00",
    ipAddress: "192.168.1.100",
    device: "Mobile App on iOS",
  },
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
