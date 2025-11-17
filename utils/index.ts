import { Event } from "@/type";

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
