import { upcomingEvents } from "@/data";
import { Group } from "@/type";
import { useState } from "react";

export default function BulkAssignModal({
  selectedGroups,
  groups,
  onClose,
}: {
  selectedGroups: string[];
  groups: Group[];
  onClose: () => void;
}) {
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

  const selectedGroupsData = groups.filter((g) =>
    selectedGroups.includes(g.id)
  );

  const totalStaffCount = selectedGroupsData.reduce(
    (acc, g) => acc + g.memberIds.length,
    0
  );

  const handleToggleEvent = (eventId: number) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleAssign = () => {
    alert(
      `Successfully assigned ${selectedGroups.length} group(s) with ${totalStaffCount} total staff to ${selectedEvents.length} event(s)!`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-primary font-bold text-gray-900">
            Bulk Assign Groups to Events
          </h2>
          <p className="text-sm text-gray-600 font-secondary mt-1">
            Assign {selectedGroups.length} group(s) with {totalStaffCount} total
            staff to events
          </p>
        </div>

        {/* Selected Groups Summary */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-secondary font-semibold text-gray-700 mb-2">
            Selected Groups:
          </h3>
          <div className="flex flex-wrap gap-2 ">
            {selectedGroupsData.map((group) => (
              <span
                key={group.id}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-dark-black text-sm font-secondary bg-white border border-gray-200 "
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                {group.name} ({group.memberIds.length})
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-secondary font-semibold text-gray-700 mb-3">
            Select Events:
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleToggleEvent(event.id)}
                className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                  selectedEvents.includes(event.id)
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedEvents.includes(event.id)
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {selectedEvents.includes(event.id) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-secondary font-semibold text-gray-900">
                      {event.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 font-secondary">
                      <span>{event.date}</span>
                      <span>•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 font-secondary">
            {selectedEvents.length} event
            {selectedEvents.length !== 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={selectedEvents.length === 0}
              className={`px-4 py-2 rounded-lg font-secondary font-medium transition-colors ${
                selectedEvents.length > 0
                  ? "bg-primary text-white hover:bg-[#e0c580] cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Assign to {selectedEvents.length} Event
              {selectedEvents.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
