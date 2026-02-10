// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { notifications } from "@/data";
// import { AppSelect } from "../ui/Select";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/apiFetch";
// import { toastError, toastSuccess } from "@/lib/toast";

// import { useMe } from "@/component/auth/AuthProvider";
// import Link from "next/link";
// import { toMediaProxyUrl } from "@/lib/mediaUrl";

// export default function AdminTopbar() {
//   const router = useRouter();
//   const me = useMe();

//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const companies = [
//     { id: "c1", name: "Fidi Hospitality" },
//     { id: "c2", name: "Tardis Catering" },
//     { id: "c3", name: "MME Worldwide" },
//     { id: "c4", name: "MME Creative Partners" },
//   ];

//   const [selectedCompany, setSelectedCompany] = useState(companies[0].id);

//   const unreadCount = notifications.filter((n) => n.unread).length;

//   const firstName = me?.first_name ?? "";
//   const lastName = me?.last_name ?? "";
//   const fullName = `${firstName} ${lastName}`.trim() || "User";

//   const email = me?.email ?? "—";

//   const role = me?.tenant_role ?? "Admin";

//   const handleLogout = async () => {
//     if (isLoading) return;
//     setIsLoading(true);

//     try {
//       await apiFetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });

//       toastSuccess("Logged out successfully!");
//       router.push("/login");
//       router.refresh();
//     } catch (err) {
//       toastError(err, "Logout failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
//       <div className="flex-1 max-w-xl">
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <svg
//               className="h-5 w-5 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>
//           <input
//             type="text"
//             placeholder="Search staff, events, locations..."
//             className="w-full pl-10 pr-4 py-2 border text-dark-black border-gray-300 rounded-lg font-secondary text-sm
//                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
//                      transition-all duration-200"
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-4 ml-4">
//         <div>
//           <AppSelect
//             value={selectedCompany}
//             onValueChange={(value) => setSelectedCompany(value)}
//             placeholder="Select a company"
//             options={companies.map((company) => ({
//               label: company.name,
//               value: company.id,
//             }))}
//           />
//         </div>

//         <div className="relative">
//           <button
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100
//                      rounded-lg transition-colors cursor-pointer"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//               />
//             </svg>
//             {unreadCount > 0 && (
//               <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           {showNotifications && (
//             <>
//               <div
//                 className="fixed inset-0 z-10"
//                 onClick={() => setShowNotifications(false)}
//               />
//               <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
//                 <div className="p-4 border-b border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-secondary font-semibold text-gray-900">
//                       Notifications
//                     </h3>
//                     <button className="text-xs text-primary hover:text-[#e0c580] font-medium cursor-pointer">
//                       Mark all read
//                     </button>
//                   </div>
//                 </div>
//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.map((notification) => (
//                     <div
//                       key={notification.id}
//                       className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
//                         notification.unread ? "bg-blue-50" : ""
//                       }`}
//                     >
//                       <div className="flex gap-3">
//                         <div
//                           className={`shrink-0 w-2 h-2 rounded-full mt-2 ${
//                             notification.unread ? "bg-primary" : "bg-gray-300"
//                           }`}
//                         />
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-secondary text-gray-900">
//                             {notification.message}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {notification.time}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="p-3 text-center border-t border-gray-200">
//                   <button className="text-sm text-primary hover:text-[#e0c580] font-medium font-secondary cursor-pointer">
//                     View all notifications
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         <div className="relative">
//           <button
//             onClick={() => setShowUserMenu(!showUserMenu)}
//             className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
//           >
//             <div className="text-right hidden sm:block">
//               <p className="text-sm font-secondary font-medium text-gray-900">
//                 {fullName}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {typeof role === "string" ? role.replace(/_/g, " ") : "—"}
//               </p>
//             </div>

//             <div className="relative">
//               <img
//                 src={toMediaProxyUrl(me?.avatar) || "/male.png"}
//                 alt="User"
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
//             </div>
//           </button>

//           {showUserMenu && (
//             <>
//               <div
//                 className="fixed inset-0 z-10"
//                 onClick={() => setShowUserMenu(false)}
//               />
//               <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
//                 <div className="p-3 border-b border-gray-200">
//                   <p className="text-sm font-secondary font-medium text-gray-900">
//                     {fullName}
//                   </p>
//                   <p className="text-xs text-gray-500">{email}</p>
//                 </div>

//                 <div className="py-2">
//                   <Link href="/admin/profile">
//                     <button className="w-full px-4 py-2 text-left text-sm font-secondary text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                         />
//                       </svg>
//                       Profile
//                     </button>
//                   </Link>

//                   <button className="w-full px-4 py-2 text-left text-sm font-secondary text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                     </svg>
//                     Settings
//                   </button>

//                   <button className="w-full px-4 py-2 text-left text-sm font-secondary text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     Help & Support
//                   </button>
//                 </div>

//                 <div className="p-2 border-t border-gray-200">
//                   <button
//                     onClick={handleLogout}
//                     disabled={isLoading}
//                     className="w-full px-4 py-2 text-left text-sm font-secondary text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                       />
//                     </svg>
//                     {isLoading ? "Signing Out..." : "Sign Out"}
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { notifications } from "@/data";
import { AppSelect } from "../ui/Select";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { useMe } from "@/component/auth/AuthProvider";
import Link from "next/link";
import { toMediaProxyUrl } from "@/lib/mediaUrl";

interface Company {
  id: string;
  name: string;
  slug: string;
}

export default function AdminTopbar() {
  const router = useRouter();
  const me = useMe();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingCompany, setIsSwitchingCompany] = useState(false);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const firstName = me?.first_name ?? "";
  const lastName = me?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || "User";

  const email = me?.email ?? "—";
  const role = me?.tenant_role ?? "Admin";

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await apiFetch("/api/companies/list-company");
        setCompanies(response.companies || []);

        if (me?.current_company?.id) {
          setSelectedCompany(me.current_company.id);
        } else if (response.companies && response.companies.length > 0) {
          setSelectedCompany(response.companies[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        toastError("Failed to load companies");
      } finally {
        setIsLoadingCompanies(false);
      }
    }

    if (me) {
      fetchCompanies();
    }
  }, [me]);

  const handleCompanySwitch = async (companyId: string) => {
    if (isSwitchingCompany || companyId === selectedCompany) return;

    setIsSwitchingCompany(true);

    try {
      const response = await apiFetch("/api/companies/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: companyId }),
      });

      setSelectedCompany(companyId);
      toastSuccess(response.message || "Company switched successfully!");

      router.refresh();
    } catch (err) {
      toastError(err, "Failed to switch company. Please try again.");
      if (me?.current_company?.id) {
        setSelectedCompany(me.current_company.id);
      }
    } finally {
      setIsSwitchingCompany(false);
    }
  };

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      toastSuccess("Logged out successfully!");
      router.push("/login");
      router.refresh();
    } catch (err) {
      toastError(err, "Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search staff, events, locations..."
            className="w-full pl-10 pr-4 py-2 border text-dark-black border-gray-300 rounded-lg font-secondary text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="relative">
          <AppSelect
            value={selectedCompany}
            onValueChange={handleCompanySwitch}
            placeholder={
              isLoadingCompanies ? "Loading companies..." : "Select a company"
            }
            disabled={
              isLoadingCompanies || isSwitchingCompany || companies.length === 0
            }
            options={companies.map((company) => ({
              label: company.name,
              value: company.id,
            }))}
          />
          {isSwitchingCompany && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="animate-spin h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 
                     rounded-lg transition-colors cursor-pointer"
          >
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-secondary font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <button className="text-xs text-primary hover:text-[#e0c580] font-medium cursor-pointer">
                      Mark all read
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notification.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`shrink-0 w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? "bg-primary" : "bg-gray-300"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-secondary text-gray-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button className="text-sm text-primary hover:text-[#e0c580] font-medium font-secondary cursor-pointer">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-secondary font-medium text-gray-900">
                {fullName}
              </p>
              <p className="text-xs text-gray-500">
                {typeof role === "string" ? role.replace(/_/g, " ") : "—"}
              </p>
            </div>

            <div className="relative">
              <img
                src={toMediaProxyUrl(me?.avatar) || "/male.png"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-sm font-secondary font-medium text-gray-900">
                    {fullName}
                  </p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>

                <div className="py-2">
                  <Link href="/admin/profile">
                    <button className="w-full px-4 py-2 text-left text-sm font-secondary text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </button>
                  </Link>

                  <button className="w-full px-4 py-2 text-left text-sm font-secondary text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </button>

                  <button className="w-full px-4 py-2 text-left text-sm font-secondary text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
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
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Help & Support
                  </button>
                </div>

                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full px-4 py-2 text-left text-sm font-secondary text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {isLoading ? "Signing Out..." : "Sign Out"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
