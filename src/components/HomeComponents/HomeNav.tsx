"use client";

import { useState } from "react";
import Link from "next/link";
import { poppins } from "@/app/fonts/fonts";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ProfileDropdown } from "@/components/HomeComponents/ProfileDropdown";
import { useAuthUser } from "@/helpers/getDataFromToken";
import { Skeleton } from "@/components/ui/skeleton"; // Make sure to import Skeleton

const HomeNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuthUser();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#", label: "About" },
    { href: "#", label: "Services" },
    { href: "#", label: "Contact" },
  ];

  return (
    <div className="container mx-auto px-4">
      <nav
        className="flex items-center justify-between h-16 w-full"
        role="navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-curex flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span
            className={`${poppins.className} text-curex text-2xl font-bold`}
          >
            Curex
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="px-4 py-2 text-gray-700 hover:text-curex transition-colors rounded-md"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons or Profile */}

        {/* Desktop Buttons or Profile */}
        <div className="hidden md:flex items-center space-x-2 justify-end min-w-[320px] outline-none">
          {loading ? (
            <div className="flex space-x-2">
              {/* Adjust skeleton widths to roughly match buttons */}
              <Skeleton className="w-20 h-8 rounded" />
              <Skeleton className="w-20 h-8 rounded" />
              <Skeleton className="w-36 h-8 rounded" />
            </div>
          ) : !user ? (
            <>
              <Button
                variant="outline"
                className="border-curex text-curex hover:bg-curex/10 min-w-[80px]"
                onClick={() => (window.location.href = "/Register")}
              >
                Register
              </Button>

              <Button
                variant="outline"
                className="border-gray-400 text-gray-700 hover:bg-gray-100 min-w-[80px]"
                onClick={() => (window.location.href = "/Login")}
              >
                Login
              </Button>

              <Button
                className="bg-curex hover:bg-curex-dark text-white min-w-[140px]"
                onClick={() => (window.location.href = "/doctor/Register")}
              >
                Become a Doctor
              </Button>
            </>
          ) : (
            <ProfileDropdown />
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Toggle menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between py-4 border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-curex flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <span
                    className={`${poppins.className} text-curex text-xl font-bold`}
                  >
                    Curex
                  </span>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close menu">
                    <X className="h-6 w-6" />
                  </Button>
                </SheetClose>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col space-y-4 py-6">
                {navLinks.map((link, index) => (
                  <SheetClose asChild key={index}>
                    <Link
                      href={link.href}
                      className="px-4 py-2 text-gray-700 hover:text-curex transition-colors rounded-md"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>

              {/* Mobile Footer Actions */}
              <div className="mt-auto space-y-4 py-6 border-t">
                {loading ? (
                  <>
                    <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                  </>
                ) : !user ? (
                  <>
                    <Button
                      className="w-full border-curex text-curex hover:bg-curex/10"
                      variant="outline"
                      onClick={() => {
                        setIsOpen(false);
                        window.location.href = "/Register";
                      }}
                    >
                      Register
                    </Button>

                    <Button
                      className="w-full border-gray-400 text-gray-700 hover:bg-gray-100"
                      variant="outline"
                      onClick={() => {
                        setIsOpen(false);
                        window.location.href = "/Login";
                      }}
                    >
                      Login
                    </Button>

                    <Button
                      className="w-full bg-curex hover:bg-curex-dark text-white"
                      onClick={() => {
                        setIsOpen(false);
                        window.location.href = "/doctor/Register";
                      }}
                    >
                      Become a Doctor
                    </Button>
                  </>
                ) : (
                  <ProfileDropdown />
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default HomeNav;
