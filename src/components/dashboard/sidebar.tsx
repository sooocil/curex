"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Calendar,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{ _id: string; name: string } | null>(null);

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      if (typeof document === "undefined") return null;
      const cookies = document.cookie.split(";");

      for (let cookie of cookies) {
        const [cookieName, ...cookieValueParts] = cookie.trim().split("=");
        if (cookieName === name) {
          return cookieValueParts.join("=") || null;
        }
      }
      return null;
    };

    const checkUserAuth = async () => {
      try {
        const token = getCookie("token");
        const userCookieRaw = getCookie("user");

        if (!token || !userCookieRaw) return;

        let decoded = decodeURIComponent(userCookieRaw);
        if (decoded.startsWith("%7B")) decoded = decodeURIComponent(decoded);

        const parsedUser = JSON.parse(decoded);

        if (parsedUser._id) {
          setUser({
            _id: parsedUser._id,
            name: parsedUser.name || parsedUser.email || "User",
          });
        }
      } catch (error) {
        console.error("Auth parse error:", error);
      }
    };

    checkUserAuth();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/api/users/logout");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/Login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  }, [router]);

  const links = [
    { name: "Dashboard", slug: "dashboard", icon: LayoutDashboard },
    { name: "Test History", slug: "dashboard/tests", icon: ClipboardList },
    { name: "Find Doctors", slug: "dashboard/doctors", icon: Users },
    { name: "Appointments", slug: "dashboard/appointments", icon: Calendar },
    { name: "Profile", slug: "dashboard/profile", icon: User },
    { name: "Settings", slug: "dashboard/settings", icon: Settings },
  ];

  const currentPath = pathname?.split("/").slice(3).join("/") || ""; // slice(3) skips ['', 'user', 'userId', ...]

  return (
    <aside className="hidden md:flex md:w-64  ">
      <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
        <div className="flex items-center h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-curex flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-curex">Curex</span>
            <span className="text-lg ml-2 text-secondary-foreground">User</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col  pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {links.map(({ name, slug, icon: Icon }) => {
              const fullHref = `/user/${user?._id || "..."}/${slug}`;
              const isActive = pathname === fullHref;

              return (
                <Link
                  key={name}
                  href={fullHref}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-curex bg-opacity-10 text-curex"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive
                        ? "text-curex"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {user?.name || "Guest"}
            </p>
            <Button
              onClick={handleLogout}
              className="flex items-center text-xs font-medium text-black shadow-none bg-white hover:text-white"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default UserSidebar;
