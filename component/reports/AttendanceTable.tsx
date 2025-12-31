"use client";
import { AttendanceRecord } from "@/type";

interface AttendanceTableProps {
  data: AttendanceRecord[];
}

export default function AttendanceTable({ data }: AttendanceTableProps) {
  const getAttendanceColor = (rate: number) => {
    if (rate >= 98) return "bg-green-100 text-green-700";
    if (rate >= 95) return "bg-yellow-100 text-yellow-700";
    if (rate >= 90) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-primary font-semibold text-gray-900">Attendance Tracking</h3>
        <p className="text-sm text-gray-500 mt-1">Shift attendance and punctuality metrics</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-secondary font-semibold text-gray-600 uppercase">
                Staff Member
              </th>
              <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                Scheduled
              </th>
              <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                Attended
              </th>
              <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                Late
              </th>
              <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                No Shows
              </th>
              <th className="px-4 py-3 text-center text-xs font-secondary font-semibold text-gray-600 uppercase">
                Attendance Rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((record) => (
              <tr key={record.staffId} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        record.avatar ||
                        `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                          record.staffName
                        )}`
                      }
                      alt={record.staffName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-secondary font-medium text-gray-900">
                      {record.staffName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-secondary text-gray-900">
                    {record.scheduledShifts}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-secondary text-green-600 font-medium">
                    {record.attendedShifts}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`font-secondary ${
                      record.lateArrivals > 0 ? "text-yellow-600" : "text-gray-400"
                    }`}
                  >
                    {record.lateArrivals}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`font-secondary ${
                      record.noShows > 0 ? "text-red-600 font-medium" : "text-gray-400"
                    }`}
                  >
                    {record.noShows}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-secondary font-medium rounded-full ${getAttendanceColor(
                      record.attendanceRate
                    )}`}
                  >
                    {record.attendanceRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <span className="font-secondary text-gray-500">
            Average Attendance Rate
          </span>
          <span className="font-secondary font-semibold text-gray-900">
            {(
              data.reduce((sum, r) => sum + r.attendanceRate, 0) / data.length
            ).toFixed(1)}
            %
          </span>
        </div>
      </div>
    </div>
  );
}
