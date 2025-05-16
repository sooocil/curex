"use client";

import Image from "next/image";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { inter, lusitana } from "@/app/fonts/fonts";
import { Button } from "@/components/ui/button";
import HomeNav from "@/components/HomeComponents/HomeNav";
import HomeContent from "@/components/HomeComponents/HomeContent";
import BetaTop from "@/components/HomeComponents/BetaTop";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 flex flex-col items-center">
      <BetaTop/>
      {/* Centered Navigation */}
      <div className="homenavcontroller w-full flex justify-center py-4">
        <HomeNav />
        
      </div>

      {/* Main Content */}
      <div className="MainContentContainer mt-40 ">
        <HomeContent />
      </div>
    </div>
  );
}