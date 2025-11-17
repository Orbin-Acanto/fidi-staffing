"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { navigation } from "@/data";

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <>
      <aside
        className={`${
          isCollapsed ? "w-15" : "w-54"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div
          className="h-16 flex items-center justify-between px-4 border-b border-gray-200"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <span className="font-primary text-2xl italic font-semibold text-dark-black">
                FiDi Staffing
              </span>
            </div>
          ) : (
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain mx-auto"
            />
          )}
        </div>

        <nav className="flex-1 overflow-y-clip py-4 px-2">
          {navigation.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-6">
              {section.title && !isCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-secondary font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg font-secondary text-sm
                        transition-all duration-200 group relative
                        ${
                          active
                            ? "bg-primary text-white font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      <span
                        className={`
                        ${
                          active
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-700"
                        }
                      `}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <span className="bg-primary text-dark-black text-xs font-semibold px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}

                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                          {item.name}
                          {item.badge && ` (${item.badge})`}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
