"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Bell, Menu, Search, X } from "lucide-react"
import { LayoutDashboard, ClipboardCheck, Users, Settings, LogOut } from "lucide-react"

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Doctor Applications",
    href: "/dashboard/admin/doctor-applications",
    icon: ClipboardCheck,
  },
  {
    name: "Doctors",
    href: "/dashboard/admin/doctors",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/dashboard /admin/settings",
    icon: Settings,
  },
]

export function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="max-w-lg w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                type="search"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    isActive
                      ? "bg-curex bg-opacity-10 text-curex"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
                    isActive ? "border-curex" : "border-transparent"
                  }`}
                >
                  <div className="flex items-center">
                    <link.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? "text-curex" : "text-gray-400"}`}
                      aria-hidden="true"
                    />
                    {link.name}
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-300" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Admin User</div>
                <div className="text-sm font-medium text-gray-500">admin@curex.com</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Sign out
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
