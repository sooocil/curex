"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
  const register = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User registered");
  };

  return (
    <div>
      <div className="mainlogin flex flex-col items-center justify-center ">
        <div className="AuthPopup  RegisterPopup absolute shadow-2xl  bg-white m-0  rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-4 absolute left-1/2  -translate-x-1/2 top-1/2 -translate-y-1/2">
            <div className="flex flex-col gap-4  bg-white m-0  rounded-md items-center justify-center max-w-sm mx-auto">
              <h1 className="font-sans font-extrabold text-2xl text-center">
                User Login
              </h1>
              <p className="font-thin text-center text-gray-600">
                Hey, Enter your details to log in to your account
              </p>

              <form className="flex flex-col items-start" onSubmit={register}>
                <input
                  type="email"
                  placeholder="Email"
                  className="border-2 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="border-2 border-gray-300 p-2 w-full mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <Button className="bg-teal-500 hover:bg-teal-700 text-white w-full rounded-md mt-4">
                  Login
                </Button>
              </form>

              <p className="text-sm text-gray-600 text-center mt-4">
                Don't have an account?{" "}
                <span
                  className="underline text-teal-600 hover:text-teal-800 cursor-pointer"
                  onClick={() => (window.location.href = "/users/Register")}
                >
                  Register
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
