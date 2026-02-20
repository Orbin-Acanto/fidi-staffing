// "use client";

// import { AttendanceSettings } from "@/type";
// import { useState } from "react";

// interface AttendanceSettingsModalProps {
//   settings: AttendanceSettings;
//   onSave: (settings: AttendanceSettings) => void;
//   onClose: () => void;
// }

// export default function AttendanceSettingsModal({
//   settings,
//   onSave,
//   onClose,
// }: AttendanceSettingsModalProps) {
//   const [formData, setFormData] = useState<AttendanceSettings>(settings);

//   const handleChange = (
//     field: keyof AttendanceSettings,
//     value: number | boolean
//   ) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = () => {
//     onSave(formData);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
//           <div>
//             <h2 className="text-xl font-primary font-bold text-gray-900">
//               Time & Attendance Settings
//             </h2>
//             <p className="text-sm text-gray-500 font-secondary mt-1">
//               Configure clock-in rules, GPS restrictions, and approval settings
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
//           {/* Clock In/Out Rules */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-primary font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <svg
//                 className="w-5 h-5 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               Clock In/Out Rules
//             </h3>
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
//                     Clock In Grace Period (minutes)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.clockInGracePeriod}
//                     onChange={(e) =>
//                       handleChange(
//                         "clockInGracePeriod",
//                         parseInt(e.target.value)
//                       )
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     How early staff can clock in before shift
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
//                     Clock Out Grace Period (minutes)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.clockOutGracePeriod}
//                     onChange={(e) =>
//                       handleChange(
//                         "clockOutGracePeriod",
//                         parseInt(e.target.value)
//                       )
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Grace period after shift ends
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-secondary font-medium text-gray-900">
//                     Auto Clock Out
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Automatically clock out after set hours
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     handleChange(
//                       "autoClockOutEnabled",
//                       !formData.autoClockOutEnabled
//                     )
//                   }
//                   className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
//                     formData.autoClockOutEnabled ? "bg-primary" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
//                       formData.autoClockOutEnabled
//                         ? "translate-x-5"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>

//               {formData.autoClockOutEnabled && (
//                 <div>
//                   <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
//                     Auto Clock Out After (hours)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.autoClockOutAfter}
//                     onChange={(e) =>
//                       handleChange(
//                         "autoClockOutAfter",
//                         parseInt(e.target.value)
//                       )
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* GPS/Location Settings */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-primary font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <svg
//                 className="w-5 h-5 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                 />
//               </svg>
//               GPS/Location Restrictions
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-secondary font-medium text-gray-900">
//                     GPS Restriction
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Require staff to be within location to clock in
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     handleChange(
//                       "gpsRestrictionEnabled",
//                       !formData.gpsRestrictionEnabled
//                     )
//                   }
//                   className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
//                     formData.gpsRestrictionEnabled
//                       ? "bg-primary"
//                       : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
//                       formData.gpsRestrictionEnabled
//                         ? "translate-x-5"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>

//               {formData.gpsRestrictionEnabled && (
//                 <div>
//                   <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
//                     Geofence Radius (meters)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.geofenceRadius}
//                     onChange={(e) =>
//                       handleChange("geofenceRadius", parseInt(e.target.value))
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Distance from venue where clock-in is allowed
//                   </p>
//                 </div>
//               )}

//               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-secondary font-medium text-gray-900">
//                     Photo Verification
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Require selfie when clocking in
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     handleChange(
//                       "requirePhotoVerification",
//                       !formData.requirePhotoVerification
//                     )
//                   }
//                   className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
//                     formData.requirePhotoVerification
//                       ? "bg-primary"
//                       : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
//                       formData.requirePhotoVerification
//                         ? "translate-x-5"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Late/Early/Missed Punch Rules */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-primary font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <svg
//                 className="w-5 h-5 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                 />
//               </svg>
//               Late/Early/Missed Punch Rules
//             </h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
//                   Late Threshold (minutes)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.lateThresholdMinutes}
//                   onChange={(e) =>
//                     handleChange(
//                       "lateThresholdMinutes",
//                       parseInt(e.target.value)
//                     )
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Minutes after shift start to be marked late
//                 </p>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-secondary font-medium text-gray-900">
//                     Allow Early Clock In
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Let staff clock in before scheduled time
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     handleChange(
//                       "earlyClockInAllowed",
//                       !formData.earlyClockInAllowed
//                     )
//                   }
//                   className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
//                     formData.earlyClockInAllowed ? "bg-primary" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
//                       formData.earlyClockInAllowed
//                         ? "translate-x-5"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>

//               {formData.earlyClockInAllowed && (
//                 <div>
//                   <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
//                     Early Clock In Allowed (minutes)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.earlyClockInMinutes}
//                     onChange={(e) =>
//                       handleChange(
//                         "earlyClockInMinutes",
//                         parseInt(e.target.value)
//                       )
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
//                   />
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
//                   No Show After (minutes)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.noShowAfterMinutes}
//                   onChange={(e) =>
//                     handleChange("noShowAfterMinutes", parseInt(e.target.value))
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Minutes after shift start to mark as no-show
//                 </p>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-secondary font-medium text-gray-900">
//                     Auto Flag No Shows
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Automatically mark as no-show after threshold
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     handleChange("autoFlagNoShow", !formData.autoFlagNoShow)
//                   }
//                   className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
//                     formData.autoFlagNoShow ? "bg-primary" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
//                       formData.autoFlagNoShow
//                         ? "translate-x-5"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-secondary font-medium text-gray-900">
//                     Auto Flag Missed Punches
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Automatically flag entries with missing clock in/out
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     handleChange(
//                       "missedPunchAutoFlag",
//                       !formData.missedPunchAutoFlag
//                     )
//                   }
//                   className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
//                     formData.missedPunchAutoFlag ? "bg-primary" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
//                       formData.missedPunchAutoFlag
//                         ? "translate-x-5"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Approval Rules */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-primary font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <svg
//                 className="w-5 h-5 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               Approval Rules
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-secondary font-medium text-gray-900">
//                     Manual Time Edit Approval
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Require approval for time corrections
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     handleChange(
//                       "manualTimeEditRequiresApproval",
//                       !formData.manualTimeEditRequiresApproval
//                     )
//                   }
//                   className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
//                     formData.manualTimeEditRequiresApproval
//                       ? "bg-primary"
//                       : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
//                       formData.manualTimeEditRequiresApproval
//                         ? "translate-x-5"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-secondary font-medium text-gray-900">
//                     Overtime Approval
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Require approval for overtime hours
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     handleChange(
//                       "overtimeRequiresApproval",
//                       !formData.overtimeRequiresApproval
//                     )
//                   }
//                   className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
//                     formData.overtimeRequiresApproval
//                       ? "bg-primary"
//                       : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
//                       formData.overtimeRequiresApproval
//                         ? "translate-x-5"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>

//               {formData.overtimeRequiresApproval && (
//                 <div>
//                   <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
//                     Overtime Threshold (hours/week)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.overtimeThresholdHours}
//                     onChange={(e) =>
//                       handleChange(
//                         "overtimeThresholdHours",
//                         parseInt(e.target.value)
//                       )
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary text-black"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 font-secondary font-medium transition-colors"
//           >
//             Save Settings
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
