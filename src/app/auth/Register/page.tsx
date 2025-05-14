'use client';

import React  from "react";
import { Button } from "@/components/ui/button";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import {useState} from "react";

const page = () => {


  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async()=>{
    try {
      
    } catch (error : any) {
      console.log("Signup Failed!");
      console.log(error);

      
    }
  }
  


  return (
    <div className="grid">
    <div className="main flex flex-col items-center justify-center">
 

    <div className="AuthPopup RegisterPopup absolute  shadow-2xl bg-white m-0 p-10 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="flex flex-col gap-4 bg-white m-0 p-10 rounded-md  max-w-sm mx-auto">
      <h1 className="font-sans font-extrabold text-2xl text-center">User Register</h1>
      <p className="font-thin text-center text-gray-600">
        Hey, Enter your details to create an account
      </p>

      <form className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Username"
          className="border-2 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="email"
          placeholder="Email"
          className="border-2 border-gray-300 p-2 w-full mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="border-2 border-gray-300 p-2 w-full mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border-2 border-gray-300 p-2 w-full mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <Button className="bg-teal-500 hover:bg-teal-700 text-white w-full rounded-md mt-4">
          Register
        </Button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-4">
        Already have an account?{" "}
        <span
          className="underline text-teal-600 hover:text-teal-800 cursor-pointer"
          onClick={() => (window.location.href = "/auth/Login")}
        >
          Login
        </span>
      </p>

      <div className="relative flex items-center my-4">
        <hr className="w-full border-gray-300" />
        <span className="px-3 text-sm text-gray-500 bg-white">or continue with</span>
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
