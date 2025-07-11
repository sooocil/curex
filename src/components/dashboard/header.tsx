"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search, X } from "lucide-react";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Calendar,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    isDone: true,
  },
  {
    name: "Test History",
    href: "/dashboard/tests",
    icon: ClipboardList,
    isDone: false,
  },
  {
    name: "Find Doctors",
    href: "/dashboard/doctors",
    icon: Users,
    isDone: true,


  },
  {
    name: "Appointments",
    href: "/dashboard/appointments",
    icon: Calendar,
    isDone: false,

  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
    isDone: true,

  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    isDone: false,

  },
];

export function UserHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/users/logout", )
      if (res.status === 200) {
        localStorage.removeItem("userId");
        window.location.href = "/";
      }
      console.log("Logout response:", res.data);
      toast.success("Logout successful!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return res;
      
    } catch (error) {
      
    }

  }

  


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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <div className="ml-3 relative">
            <Avatar className="h-8 w-8">
              <AvatarImage
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
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
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? "text-curex" : "text-gray-400"
                      }`}
                      aria-hidden="true"
                    />
                    {link.name}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  
                </div>
                <div className="text-sm font-medium text-gray-500">
                  john.doe@example.com
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button onClick={()=>{handleLogout()}} className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                <div className="flex items-center">
                    <LogOut
                      className="mr-3 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Sign out
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* toaster */}
      <Toaster/>
    </header>
  );
}
