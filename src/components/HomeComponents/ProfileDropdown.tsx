// components/ProfileDropdown.tsx
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthUser } from "@/helpers/getDataFromToken";
import { LogOut, User } from "lucide-react";

type Usertype = {
  firstName: string;
  role: "user" | "doctor";
  email: string;
};

export const ProfileDropdown = () => {
  const { user } = useAuthUser();
  // const uemail = user?.email as string;
  // const firstChar: string = uemail.charAt[0];

  if (!user) return null;

  const handleLogout = () => {
    // Clear token in localStorage
    localStorage.removeItem("token");

    // Clear token cookie (if you use cookies for auth)
    document.cookie = "token=; Max-Age=0; path=/;";

    // Optionally dispatch a storage event so hooks listening to it update
    window.dispatchEvent(new Event("storage"));

    // Redirect user to home or login
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-end h-full outline-none">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer shadow-lg bg-zinc-400">
            <AvatarFallback>{ <User size={32} />}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>
            <strong className="ml-1">{user.email}</strong>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex hover:bg-none flex-col items-center">
            <DropdownMenuItem
              onClick={() =>
                (window.location.href =
                  user.role === "doctor" ? "/doctors" : `/user/${user}/dashboard`)
              }
              className="hover:cursor-pointer "
            >
              Dashboard
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout} 
              className="hover:cursor-pointer  text-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
