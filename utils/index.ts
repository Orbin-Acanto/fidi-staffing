import { staffNotes, staffReviews } from "@/data";
import { Event, StaffPerformance } from "@/type";

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
    (r) => r.punctuality === "on-time"
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
