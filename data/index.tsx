import { Event, NavSection, SavedLocation, Staff } from "@/type";

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
    locationNotes: "Security desk at lobby; elevators require check-in.",
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
    locationNotes:
      "Valet parking available; enter through Fifth Avenue entrance.",
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
    locationNotes: "Loading access via rear alley; limited street parking.",
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
    locationNotes:
      "Large freight elevator available; check dock schedule in advance.",
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
    locationNotes:
      "After-hours events only; security clearance required for staff.",
  },
];
