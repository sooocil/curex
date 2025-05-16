import React from "react";
import { lusitana, poppins } from "@/app/fonts/fonts";
import { Button } from "@/components/ui/button";

const HomeNav = () => {
  return (
    <div>
      <nav
        className="sticky mt-2 flex items-center h-16  bg-gradient-to-b from-blue-50 to-teal-50 text-black   font-sans"
        role="navigation"
      >
        <a
          href="/"
          className={`${poppins.className} text-tealish text-6xl mr-20`}
        >
          Curex
        </a>
        <div className=" font-serif text-2xl flex justify-center items-center align-middle gap-4">
          <a href="/" className="p-4">
            Home
          </a>
          <a href="/about" className="p-4">
            About
          </a>
          <a href="/services" className="p-4">
            Services
          </a>
          <a href="/contact" className="p-4">
            Contact
          </a>
          <Button
            className="bg-teal-500 hover:bg-neutral-700 transition-all text-white shadow-md hover:text-white font-bold rounded"
            size={"lg"}
            variant={"outline"}
            onClick={() => {
              window.location.href = "/users/Register";
            }}
          >
            Register
          </Button>
          <Button
            className="bg-gray-400 hover:bg-gray-700 text-white transition-all shadow-md font-bold rounded"
            size={"lg"}
            onClick={() => { window.location.href = "/users/Login"; }}
            
          >
            Login
          </Button>
          <Button
            className="bg-violet-500 hover:bg-violet-700 text-white transition-all shadow-md font-bold rounded"
            size={"lg"}
            onClick={() => { window.location.href = "/Doctor/Register"; }}
            
          >
            Become a Doctor !
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default HomeNav;
