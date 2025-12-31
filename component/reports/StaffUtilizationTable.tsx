"use client";
import { StaffUtilization } from "@/type";

interface StaffUtilizationTableProps {
  data: StaffUtilization[];
}

export default function StaffUtilizationTable({ data }: StaffUtilizationTableProps) {
  const getUtilizationColor = (rate: number) => {
    if (rate >= 85) return "bg-green-500";
    if (rate >= 70) return "bg-yellow-500";
    if (rate >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  const getUtilizationBadge = (rate: number) => {
    if (rate >= 85) return "bg-green-100 text-green-700";
    if (rate >= 70) return "bg-yellow-100 text-yellow-700";
    if (rate >= 50) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-primary font-semibold text-gray-900">Staff Utilization</h3>
        <p className="text-sm text-gray-500 mt-1">Hours worked and utilization rates</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                Staff Member
              </th>
              <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                Hours
              </th>
              <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                Events
              </th>
              <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                Utilization
              </th>
              <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                Overtime
              </th>
              <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((staff) => (
              <tr key={staff.staffId} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        staff.avatar ||
                        `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                          staff.staffName
                        )}`
                      }
                      alt={staff.staffName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-secondary font-medium text-gray-900">
                      {staff.staffName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-secondary text-gray-900">{staff.totalHours}h</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-secondary text-gray-900">{staff.eventsWorked}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getUtilizationColor(
                          staff.utilizationRate
                        )}`}
                        style={{ width: `${staff.utilizationRate}%` }}
                      ></div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-secondary font-medium rounded-full ${getUtilizationBadge(
                        staff.utilizationRate
                      )}`}
                    >
                      {staff.utilizationRate}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-secondary ${
                      staff.overtimeHours > 0 ? "text-orange-600" : "text-gray-500"
                    }`}
                  >
                    {staff.overtimeHours > 0 ? `+${staff.overtimeHours}h` : "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-secondary text-gray-900">{staff.rating}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
