import { EventBackend } from "@/type/events";

type DeleteEventModalProps = {
  event: EventBackend;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteEventModal({
  event,
  onCancel,
  onConfirm,
}: DeleteEventModalProps) {
  const staffAssignedCount = event.staff_assignments?.length || 0;

  return (
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-red-600"
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
          </div>
          <h3 className="text-lg font-primary font-semibold text-gray-900 text-center mb-2">
            Delete Event
          </h3>
          <p className="text-sm text-gray-600 font-secondary text-center mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">{event.name}</span>?
            This action cannot be undone.
          </p>
          {staffAssignedCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800 font-secondary">
                <strong>Warning:</strong> This event has {staffAssignedCount}{" "}
                staff member{staffAssignedCount !== 1 ? "s" : ""} assigned.
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-secondary font-medium transition-colors cursor-pointer"
            >
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
