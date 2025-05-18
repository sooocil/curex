"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ClipboardList, Users, Calendar, User, Settings, LogOut } from "lucide-react"

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/user/${userId}/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Test History",
    href: "//user/${userId}/dashboard/tests",
    icon: ClipboardList,
  },
  {
    name: "Find Doctors",
    href: "/user/${userId}/dashboard/doctors",
    icon: Users,
  },
  {
    name: "Appointments",
    href: "/user/${userId}/dashboard/appointments",
    icon: Calendar,
  },
  {
    name: "Profile",
    href: "/user/${userId}/dashboard/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/user/${userId}/dashboard/settings",
    icon: Settings,
  },
]

export function UserSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-curex flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-curex">Curex</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-curex bg-opacity-10 text-curex"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <link.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-curex" : "text-gray-400 group-hover:text-gray-500",
                    )}
                    aria-hidden="true"
                  />
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t p-4">
          <button className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">John Doe</p>
                <div className="flex items-center text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  <LogOut className="mr-1 h-4 w-4" />
                  Sign out
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </aside>
  )
}
