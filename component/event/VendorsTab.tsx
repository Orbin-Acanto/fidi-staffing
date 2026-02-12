// import { useEffect, useMemo, useState } from "react";
// import { apiFetch } from "@/lib/apiFetch";
// import { toastError, toastSuccess } from "@/lib/toast";

// type VendorAssignment = {
//   id: string;
//   vendor: string;
//   vendor_name: string;
//   vendor_phone?: string | null;
//   vendor_service_type?: string | null;
//   service_type?: string | null;
//   contract_amount?: string | number | null;
//   status?: string | null;
//   notes?: string | null;
// };

// type VendorListItem = {
//   id: string;
//   company_name: string;
//   contact_name?: string | null;
//   email?: string | null;
//   phone?: string | null;
//   service_type?: string | null;
//   service_type_display?: string | null;
//   rating?: string | number | null;
//   is_preferred?: boolean | null;
// };

// function PlusIcon() {
//   return (
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M12 5v14M5 12h14"
//       />
//     </svg>
//   );
// }

// function XIcon() {
//   return (
//     <svg
//       className="w-4 h-4"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M6 18L18 6M6 6l12 12"
//       />
//     </svg>
//   );
// }

// type VendorsTabProps = {
//   eventId: string;
//   vendorAssignments: VendorAssignment[];
//   onChanged: () => void;
//   formatCurrency: (amount: string | number) => string;
// };

// export function VendorsTab({
//   eventId,
//   vendorAssignments,
//   onChanged,
//   formatCurrency,
// }: VendorsTabProps) {
//   const [isPickerOpen, setIsPickerOpen] = useState(false);
//   const [isBusy, setIsBusy] = useState(false);

//   const [search, setSearch] = useState("");
//   const [vendors, setVendors] = useState<VendorListItem[]>([]);
//   const [vendorsLoading, setVendorsLoading] = useState(false);

//   const [draft, setDraft] = useState<{
//     vendorId: string;
//     service_type: string;
//     contract_amount: string;
//     notes: string;
//   }>({ vendorId: "", service_type: "", contract_amount: "", notes: "" });

//   const assignedVendorIdSet = useMemo(() => {
//     const s = new Set<string>();
//     for (const a of vendorAssignments) {
//       if (a.vendor) s.add(String(a.vendor));
//     }
//     return s;
//   }, [vendorAssignments]);

//   const fetchVendors = async (q: string) => {
//     setVendorsLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.set("status", "active");
//       params.set("page", "1");
//       params.set("page_size", "30");
//       if (q.trim()) params.set("search", q.trim());

//       const res = await apiFetch(`/api/vendors/list?${params.toString()}`);
//       setVendors((res?.results ?? []) as VendorListItem[]);
//     } catch (e) {
//       console.error(e);
//       toastError("Failed to load vendors");
//     } finally {
//       setVendorsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!isPickerOpen) return;
//     const t = window.setTimeout(() => fetchVendors(search), 250);
//     return () => window.clearTimeout(t);
//   }, [search, isPickerOpen]);

//   //   useEffect(() => {
//   //     if (isPickerOpen) fetchVendors("");
//   //   }, [isPickerOpen]);

//   const openAdd = () => {
//     setDraft({
//       vendorId: "",
//       service_type: "",
//       contract_amount: "",
//       notes: "",
//     });
//     setIsPickerOpen(true);
//   };

//   const closeAdd = () => {
//     setIsPickerOpen(false);
//     setSearch("");
//     setDraft({
//       vendorId: "",
//       service_type: "",
//       contract_amount: "",
//       notes: "",
//     });
//   };

//   const assignVendor = async () => {
//     if (!draft.vendorId) {
//       toastError("Please select a vendor");
//       return;
//     }

//     const vendorObj = vendors.find(
//       (v) => String(v.id) === String(draft.vendorId),
//     );
//     const defaultService =
//       vendorObj?.service_type_display || vendorObj?.service_type || "Service";

//     const serviceType = draft.service_type.trim() || String(defaultService);
//     const amountStr = draft.contract_amount.trim();
//     const amountNum = amountStr ? Number(amountStr) : 0;

//     if (amountStr && !Number.isFinite(amountNum)) {
//       toastError("Contract amount must be a number");
//       return;
//     }

//     if (assignedVendorIdSet.has(String(draft.vendorId))) {
//       toastError("This vendor is already assigned to the event");
//       return;
//     }

//     setIsBusy(true);
//     try {
//       const body = {
//         vendor: draft.vendorId,
//         service_type: serviceType,
//         contract_amount: amountStr ? amountNum : 0,
//         notes: draft.notes || "",
//       };

//       const res = await apiFetch(`/api/events/${eventId}/vendors/assign/`, {
//         method: "POST",
//         body: JSON.stringify(body),
//       });

//       toastSuccess(res?.message || "Vendor assigned successfully");
//       await onChanged();
//       closeAdd();
//     } catch (e: any) {
//       console.error(e);
//       toastError(e?.message || "Failed to assign vendor");
//     } finally {
//       setIsBusy(false);
//     }
//   };

//   const removeVendor = async (assignmentId: string) => {
//     setIsBusy(true);
//     try {
//       const res = await apiFetch(
//         `/api/events/${eventId}/vendors/${assignmentId}/remove/`,
//         { method: "DELETE" },
//       );

//       toastSuccess(res?.message || "Vendor removed successfully");
//       await onChanged();
//     } catch (e: any) {
//       console.error(e);
//       toastError(e?.message || "Failed to remove vendor");
//     } finally {
//       setIsBusy(false);
//     }
//   };

//   const statusBadgeClass = (status?: string | null) => {
//     if (status === "confirmed") return "bg-green-100 text-green-700";
//     if (status === "cancelled") return "bg-red-100 text-red-700";
//     if (status === "completed") return "bg-purple-100 text-purple-700";
//     return "bg-gray-100 text-gray-700";
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h4 className="text-sm font-secondary font-semibold text-gray-700">
//           Vendors ({vendorAssignments.length})
//         </h4>

//         <button
//           onClick={openAdd}
//           disabled={isBusy}
//           className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
//           aria-label="Add vendor"
//           title="Add vendor"
//         >
//           <PlusIcon />
//         </button>
//       </div>

//       {vendorAssignments.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-lg">
//           <p className="text-gray-900 font-secondary font-medium mb-1">
//             No vendors assigned
//           </p>
//           <p className="text-gray-500 font-secondary text-sm mb-4">
//             Add vendors using the plus icon
//           </p>
//           <button
//             onClick={openAdd}
//             className="px-3 py-2 bg-gray-900 text-white rounded-lg font-secondary font-semibold hover:bg-gray-800"
//           >
//             Add vendor
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {vendorAssignments.map((vendor) => (
//             <div
//               key={vendor.id}
//               className="p-4 border border-gray-200 rounded-lg"
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex-1 min-w-0">
//                   <h5 className="font-secondary font-semibold text-gray-900 truncate">
//                     {vendor.vendor_name}
//                   </h5>
//                   <p className="text-sm text-gray-600 font-secondary">
//                     {vendor.service_type ||
//                       vendor.vendor_service_type ||
//                       "Service"}
//                   </p>
//                   {vendor.vendor_phone && (
//                     <p className="text-xs text-gray-500 mt-1">
//                       {vendor.vendor_phone}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex items-end gap-3">
//                   <div className="flex flex-col items-end gap-1">
//                     {vendor.contract_amount !== null &&
//                       vendor.contract_amount !== undefined && (
//                         <p className="font-semibold text-gray-900">
//                           {formatCurrency(Number(vendor.contract_amount))}
//                         </p>
//                       )}

//                     <span
//                       className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-secondary font-medium ${statusBadgeClass(
//                         vendor.status,
//                       )}`}
//                     >
//                       {String(vendor.status || "assigned")}
//                     </span>
//                   </div>

//                   <button
//                     onClick={() => removeVendor(vendor.id)}
//                     disabled={isBusy}
//                     className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-red-50 hover:text-red-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
//                     aria-label="Remove vendor"
//                     title="Remove vendor"
//                   >
//                     <XIcon />
//                   </button>
//                 </div>
//               </div>

//               {vendor.notes && (
//                 <p className="mt-2 text-sm text-gray-600 font-secondary">
//                   {vendor.notes}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {isPickerOpen && (
//         <div className="fixed inset-0 z-60 bg-gray-700/70 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
//             <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-secondary font-semibold text-gray-900">
//                   Assign a vendor
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   Search and select a vendor, then enter contract details
//                 </p>
//               </div>

//               <button
//                 onClick={closeAdd}
//                 className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
//                 aria-label="Close"
//               >
//                 <XIcon />
//               </button>
//             </div>

//             <div className="p-4 border-b border-gray-200 space-y-3">
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search vendors by name, email, phone"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
//               />

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 <div className="md:col-span-1">
//                   <label className="block text-xs text-gray-700 font-secondary font-medium mb-1">
//                     Select vendor
//                   </label>
//                   <select
//                     value={draft.vendorId}
//                     onChange={(e) =>
//                       setDraft((p) => ({ ...p, vendorId: e.target.value }))
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                   >
//                     <option value="">Choose vendor</option>
//                     {vendors.map((v) => (
//                       <option key={v.id} value={v.id}>
//                         {v.company_name}
//                         {assignedVendorIdSet.has(String(v.id))
//                           ? " (assigned)"
//                           : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="md:col-span-1">
//                   <label className="block text-xs text-gray-700 font-secondary font-medium mb-1">
//                     Service type
//                   </label>
//                   <input
//                     value={draft.service_type}
//                     onChange={(e) =>
//                       setDraft((p) => ({ ...p, service_type: e.target.value }))
//                     }
//                     placeholder="For example Full service catering"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                   />
//                 </div>

//                 <div className="md:col-span-1">
//                   <label className="block text-xs text-gray-700 font-secondary font-medium mb-1">
//                     Contract amount
//                   </label>
//                   <input
//                     value={draft.contract_amount}
//                     onChange={(e) =>
//                       setDraft((p) => ({
//                         ...p,
//                         contract_amount: e.target.value,
//                       }))
//                     }
//                     placeholder="5000"
//                     inputMode="decimal"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                   />
//                 </div>

//                 <div className="md:col-span-3">
//                   <label className="block text-xs text-gray-700 font-secondary font-medium mb-1">
//                     Notes
//                   </label>
//                   <textarea
//                     rows={3}
//                     value={draft.notes}
//                     onChange={(e) =>
//                       setDraft((p) => ({ ...p, notes: e.target.value }))
//                     }
//                     placeholder="Optional notes"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {vendorsLoading ? (
//                 <div className="p-6 text-sm text-gray-700 font-secondary">
//                   Loading vendors...
//                 </div>
//               ) : vendors.length === 0 ? (
//                 <div className="p-6 text-sm text-gray-700 font-secondary">
//                   No vendors found
//                 </div>
//               ) : (
//                 <div className="p-4">
//                   <p className="text-xs text-gray-600 font-secondary mb-3">
//                     Tip: pick a vendor from the dropdown above. Search updates
//                     the list.
//                   </p>

//                   <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
//                     {vendors.map((v) => {
//                       const assigned = assignedVendorIdSet.has(String(v.id));
//                       return (
//                         <li
//                           key={v.id}
//                           className="p-3 flex items-center justify-between gap-3"
//                         >
//                           <div className="min-w-0">
//                             <p className="text-sm font-secondary font-semibold text-gray-900 truncate">
//                               {v.company_name}
//                               {v.is_preferred ? " • Preferred" : ""}
//                             </p>
//                             <p className="text-xs text-gray-600 truncate">
//                               {v.service_type_display ||
//                                 v.service_type ||
//                                 "Service"}
//                               {v.phone ? ` • ${v.phone}` : ""}
//                             </p>
//                           </div>

//                           <button
//                             onClick={() =>
//                               setDraft((p) => ({
//                                 ...p,
//                                 vendorId: String(v.id),
//                               }))
//                             }
//                             className={`px-3 py-2 rounded-lg font-secondary font-semibold border transition-colors ${
//                               assigned
//                                 ? "bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed"
//                                 : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
//                             }`}
//                             disabled={assigned}
//                           >
//                             {assigned ? "Assigned" : "Select"}
//                           </button>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
//               <button
//                 onClick={closeAdd}
//                 className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-secondary font-medium"
//                 disabled={isBusy}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={assignVendor}
//                 className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-secondary font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
//                 disabled={isBusy}
//               >
//                 Assign vendor
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { PencilIcon } from "@/utils";

type VendorAssignment = {
  id: string;
  vendor: string;
  vendor_name: string;
  vendor_phone?: string | null;
  vendor_service_type?: string | null;
  service_type?: string | null;
  contract_amount?: string | number | null;
  status?: string | null;
  notes?: string | null;
};

type VendorListItem = {
  id: string;
  company_name: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  service_type?: string | null;
  service_type_display?: string | null;
  rating?: string | number | null;
  is_preferred?: boolean | null;
};

function PlusIcon() {
  return (
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
        d="M12 5v14M5 12h14"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

const statusBadgeClass = (status?: string | null) => {
  if (status === "confirmed") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-700";
};

type VendorsTabProps = {
  eventId: string;
  vendorAssignments: VendorAssignment[];
  onChanged: () => void;
  formatCurrency: (amount: string | number) => string;
};

export function VendorsTab({
  eventId,
  vendorAssignments,
  onChanged,
  formatCurrency,
}: VendorsTabProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorList, setVendorList] = useState<VendorListItem[]>([]);
  const [vendorLoading, setVendorLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<{
    service_type: string;
    contract_amount: number;
    notes: string;
  } | null>(null);

  const assignedVendorIdSet = useMemo(() => {
    const s = new Set<string>();
    for (const a of vendorAssignments) {
      if (a.vendor) s.add(String(a.vendor));
    }
    return s;
  }, [vendorAssignments]);

  const fetchVendors = async (q: string) => {
    setVendorLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", "active");
      params.set("page", "1");
      params.set("page_size", "30");
      if (q.trim()) params.set("search", q.trim());

      const res = await apiFetch(`/api/vendors/list?${params.toString()}`);
      const results = (res?.results ?? []) as VendorListItem[];
      setVendorList(results);
    } catch (e) {
      console.error(e);
      toastError("Failed to load vendors");
    } finally {
      setVendorLoading(false);
    }
  };

  useEffect(() => {
    if (!isPickerOpen) return;
    const t = window.setTimeout(() => fetchVendors(vendorSearch), 250);
    return () => window.clearTimeout(t);
  }, [vendorSearch, isPickerOpen]);

  const openEdit = (va: VendorAssignment) => {
    setEditingId(va.id);
    setEdit({
      service_type: String(va.service_type || va.vendor_service_type || ""),
      contract_amount: Number(va.contract_amount || 0),
      notes: String(va.notes || ""),
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setEdit(null);
  };

  const assignVendor = async (vendor: VendorListItem) => {
    if (assignedVendorIdSet.has(String(vendor.id))) {
      toastError("This vendor is already assigned to the event");
      return;
    }

    setIsBusy(true);
    try {
      const body = {
        vendor: vendor.id,
        service_type:
          vendor.service_type_display || vendor.service_type || "Service",
        contract_amount: 0,
        notes: "",
      };

      const res = await apiFetch(`/api/events/${eventId}/vendors/assign/`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      toastSuccess(res?.message || "Vendor assigned");
      await onChanged();
      setIsPickerOpen(false);
      setVendorSearch("");
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to assign vendor");
    } finally {
      setIsBusy(false);
    }
  };

  const removeVendor = async (assignmentId: string) => {
    setIsBusy(true);
    try {
      const res = await apiFetch(
        `/api/events/${eventId}/vendors/${assignmentId}/remove/`,
        { method: "DELETE" },
      );
      toastSuccess(res?.message || "Vendor removed");
      await onChanged();
    } catch (e: any) {
      console.error(e);
      toastError(e?.message || "Failed to remove vendor");
    } finally {
      setIsBusy(false);
    }
  };

  // You did not share an update endpoint for vendors.
  // If you already have one, swap this call to your real route.
  // If you do not, you can keep editing UI but disable Save.
  const saveEdit = async (va: VendorAssignment) => {
    if (!edit) return;

    // If you have an endpoint like:
    // PATCH /api/events/[event_id]/vendors/[assignment_id]/update/
    // then uncomment and use it.
    toastError("No vendor update endpoint wired yet");
    return;

    // setIsBusy(true);
    // try {
    //   const body = {
    //     service_type: edit.service_type,
    //     contract_amount: Number(edit.contract_amount),
    //     notes: edit.notes,
    //   };
    //
    //   const res = await apiFetch(
    //     `/api/events/${eventId}/vendors/${va.id}/update/`,
    //     { method: "PATCH", body: JSON.stringify(body) },
    //   );
    //
    //   toastSuccess(res?.message || "Vendor updated");
    //   await onChanged();
    //   closeEdit();
    // } catch (e: any) {
    //   console.error(e);
    //   toastError(e?.message || "Failed to update vendor");
    // } finally {
    //   setIsBusy(false);
    // }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-secondary font-semibold text-gray-700">
          Vendors ({vendorAssignments.length})
        </h4>

        <button
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Add vendor"
          title="Add vendor"
          disabled={isBusy}
        >
          <PlusIcon />
        </button>
      </div>

      {vendorAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-900 font-secondary font-medium mb-1">
            No vendors assigned
          </p>
          <p className="text-gray-500 font-secondary text-sm mb-4">
            Add vendors using the plus icon
          </p>
          <button
            onClick={() => setIsPickerOpen(true)}
            className="px-3 py-2 bg-primary text-white rounded-lg font-secondary font-semibold hover:bg-primary/80"
          >
            Add vendor
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {vendorAssignments.map((vendor) => {
            const isEditing = editingId === vendor.id;

            return (
              <div
                key={vendor.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h5 className="font-secondary font-semibold text-gray-900 truncate">
                        {vendor.vendor_name}
                      </h5>
                      <p className="text-xs text-gray-500">
                        {vendor.service_type ||
                          vendor.vendor_service_type ||
                          "Service"}
                      </p>
                      {vendor.vendor_phone && (
                        <p className="text-xs text-gray-500 mt-1">
                          {vendor.vendor_phone}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-secondary font-medium ${statusBadgeClass(
                          vendor.status,
                        )}`}
                      >
                        {String(vendor.status || "assigned")}
                      </span>

                      <button
                        onClick={() => openEdit(vendor)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isBusy}
                        aria-label="Edit vendor assignment"
                        title="Edit vendor assignment"
                      >
                        <PencilIcon />
                      </button>

                      <button
                        onClick={() => removeVendor(vendor.id)}
                        disabled={isBusy}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        aria-label="Remove vendor assignment"
                        title="Remove vendor assignment"
                      >
                        <XIcon />
                      </button>
                    </div>
                  </div>

                  {!isEditing ? (
                    <>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 font-secondary">
                            Service:
                          </span>
                          <p className="font-medium text-gray-900">
                            {vendor.service_type ||
                              vendor.vendor_service_type ||
                              "Service"}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-600 font-secondary">
                            Contract:
                          </span>
                          <p className="font-medium text-gray-900">
                            {vendor.contract_amount !== null &&
                            vendor.contract_amount !== undefined
                              ? formatCurrency(Number(vendor.contract_amount))
                              : formatCurrency(0)}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-600 font-secondary">
                            Notes:
                          </span>
                          <p className="font-medium text-gray-900">
                            {vendor.notes ? "Added" : "None"}
                          </p>
                        </div>
                      </div>

                      {vendor.notes && (
                        <p className="mt-3 text-sm text-gray-600 font-secondary">
                          {vendor.notes}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 font-secondary mb-1">
                            Service type
                          </label>
                          <input
                            value={edit?.service_type || ""}
                            onChange={(e) =>
                              setEdit((p) =>
                                p ? { ...p, service_type: e.target.value } : p,
                              )
                            }
                            placeholder="For example Full service catering"
                            className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg font-secondary text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 font-secondary mb-1">
                            Contract amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={edit?.contract_amount ?? 0}
                            onChange={(e) =>
                              setEdit((p) =>
                                p
                                  ? {
                                      ...p,
                                      contract_amount: Number(
                                        e.target.value || 0,
                                      ),
                                    }
                                  : p,
                              )
                            }
                            className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg font-secondary text-sm"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 font-secondary mb-1">
                            Notes
                          </label>
                          <textarea
                            rows={3}
                            value={edit?.notes || ""}
                            onChange={(e) =>
                              setEdit((p) =>
                                p ? { ...p, notes: e.target.value } : p,
                              )
                            }
                            placeholder="Add vendor notes"
                            className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg font-secondary text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                          onClick={closeEdit}
                          className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-secondary font-medium"
                          disabled={isBusy}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(vendor)}
                          className="px-3 py-2 bg-primary text-white rounded-lg font-secondary font-semibold hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={isBusy}
                          title="Wire an update endpoint to enable save"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isPickerOpen && (
        <div className="fixed inset-0 z-60 bg-gray-700/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex pb-4 px-2 flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-secondary font-semibold text-gray-900">
                  Add a vendor
                </p>
                <p className="text-xs text-gray-500">
                  Search vendors and select one to assign
                </p>
              </div>

              <button
                onClick={() => setIsPickerOpen(false)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
                aria-label="Close"
              >
                <XIcon />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <input
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                placeholder="Search vendors by name, email, phone"
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {vendorLoading ? (
                <div className="p-6 text-sm text-gray-600 font-secondary">
                  Loading vendors...
                </div>
              ) : vendorList.length === 0 ? (
                <div className="p-6 text-sm text-gray-600 font-secondary">
                  No vendors found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {vendorList.map((v) => {
                    const disabled = assignedVendorIdSet.has(String(v.id));
                    return (
                      <li
                        key={v.id}
                        className="p-4 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-secondary font-semibold text-gray-900 truncate">
                            {v.company_name}
                            {v.is_preferred ? " • Preferred" : ""}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {v.service_type_display ||
                              v.service_type ||
                              "Service"}
                            {v.phone ? ` • ${v.phone}` : ""}
                          </p>
                        </div>

                        <button
                          onClick={() => assignVendor(v)}
                          disabled={isBusy || disabled}
                          className="px-3 py-2 bg-primary text-white rounded-lg font-secondary font-semibold hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed"
                          title={
                            disabled ? "Already assigned" : "Assign vendor"
                          }
                        >
                          {disabled ? "Assigned" : "Add"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
