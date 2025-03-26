import React from "react";
import { lusitana, poppins } from "../../../fonts/fonts.jsx";
import { Button } from "@/components/ui/button";

const UserRegisterNav = () => {
  return (
    <div className="m-0 p-0 bg-gradient-to-b from-blue-50 to-teal-50 w-full h-screen overflow-hidden">
      <nav
        className="sticky mt-2 flex items-center h-16 justify-evenly   text-black   font-sans"
        role="navigation"
      >
        <a
          href="/"
          className={`${poppins.className} text-tealish text-6xl mr-20`}
        >
          Curex
        </a>
        
          <Button
            className="bg-tealish hover:bg-teal-700 text-white transition-all font-bold rounded"
            size={"lg"}
            // onClick={() => { window.location.href = "/Login"; }}
          >
            Login
          </Button>
      </nav>
    </div>
  );
};

export default UserRegisterNav;

