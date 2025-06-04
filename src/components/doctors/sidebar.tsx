"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { Button } from "../ui/button";

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/doctors",
    icon: LayoutDashboard,
  },
  {
    name: "Appointments",
    href: "/doctors/appointments",
    icon: Calendar,
  },
  {
    name: "Patients",
    href: "/doctors/patients",
    icon: Users,
  },
  {
    name: "Consultations",
    href: "/doctors/consultations",
    icon: MessageSquare,
  },
];

export function DoctorSidebar() {
  const pathname = usePathname();
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get("/api/doctorsApi/doctors/fetchsingledocs");
        setDoctorName(res.data.doctor.name);
      } catch (err) {
        console.error("Failed to fetch doctor:", err);
      }
    };
    fetchDoctor();
  }, [doctorName]);

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/doctorsApi/logout");
      if (res.status === 200) window.location.href = "/Home";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r">
  <div className="flex flex-col flex-1 justify-between">
    {/* Top Section */}
    <div>
      {/* Branding */}
      <div className="flex items-center h-16 px-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-curex flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-xl font-bold text-curex">Curex</span>
          <span className="text-sm text-gray-500 ml-2">Doctor</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-5 px-2 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (pathname.startsWith(`${link.href}/`) &&
              link.href !== "/doctors");

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
                  "mr-3 h-5 w-5",
                  isActive
                    ? "text-curex"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>

    {/* Bottom Section (Doctor Info + Signout) */}
    <div className="border-t p-4">
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-medium text-gray-700 transition-opacity duration-300">
          {doctorName  + " 👋"}
        </p>
        <Button
          onClick={handleLogout}
          className="w-full flex items-center justify-center text-xs text-white bg-curex hover:bg-curex/90 transition-colors duration-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  </div>
</aside>

  );
}
