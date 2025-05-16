"use client";

import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import React from "react";


const page = () => {
  const register = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("User registered");
  };


  return (
    <div className="grid">
    <div className="main flex flex-col items-center justify-center">


    <div className="AuthPopup RegisterPopup absolute shadow-2xl bg-white m-0 p-10 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="flex flex-col gap-4 bg-white m-0 p-10 rounded-md  max-w-sm mx-auto">
      <h1 className="font-sans font-extrabold text-2xl text-center">User Login</h1>
      <p className="font-thin text-center text-gray-600">
        Hey, Enter your details to log in to your account
      </p>
      
      <form className="flex flex-col items-center" onSubmit={register}>
        <input
          type="email"
          placeholder="Email"
          className="border-2 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="border-2 border-gray-300 p-2 w-full rounded-md mt-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        
        <Button className="bg-teal-500 hover:bg-teal-700 text-white w-full rounded-md mt-4">
          Login
        </Button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-4">
        Don't have an account?{" "}
        <span
          className="underline text-teal-600 hover:text-teal-800 cursor-pointer"
          onClick={() => (window.location.href = "/auth/Register")}
        >
          Register
        </span>
      </p>

      <div className="relative flex items-center my-4">
        <hr className="w-full border-gray-300" />
        <span className="px-3 text-center text-sm text-gray-500 bg-white">or continue with</span>
        <hr className="w-full border-gray-300" />
      </div>

      <div className="flex justify-center gap-4">
        <Button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-md">
          <FaGoogle size={30} className="text-red-500" />
        </Button>
        <Button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-md">
          <FaApple size={30} className="text-black" />
        </Button>
        <Button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-md">
          <FaFacebook size={30} className="text-blue-600" />
        </Button>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default page;
