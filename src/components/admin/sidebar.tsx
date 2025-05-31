"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Doctor Applications",
    href: "/admin/doctor-applications",
    icon: ClipboardCheck,
  },
  {
    name: "Doctors",
    href: "/admin/doctors",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.href = "/admin/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <aside className="hidden  md:flex md:w-64 md:flex-col sticky">
      <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-curex flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span
              onClick={() => (window.location.href = "/admin")}
              className="text-xl font-bold text-curex hover:cursor-pointer"
            >
              Curex Admin
            </span>
          </div>
        </div>
        <div className="flex-0  flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-curex bg-opacity-10 text-curex"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <link.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive
                        ? "text-curex"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                    aria-hidden="true"
                  />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 px-4 py-4 border-t">
          <div className="absolute flex items-center bottom-10 left-0">
            <div className="flex items-center text-xs font-medium text-gray-500 group-hover:text-gray-700">
              <Button
                variant="default"
                size={"sm"}
                onClick={handleLogout}
                className=" text-white shadow-lg bg-teal-500  "
              >
                <LogOut className="mr-1 h-4 w-4" />
                <span className="text-white "> Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
