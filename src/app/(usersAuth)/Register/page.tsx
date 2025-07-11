"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { GoHomeFill } from "react-icons/go";

interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const page = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length > 0) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    return strength;
  };

  const validateUsername = (value: string): boolean => {
    return /^[a-zA-Z]{3,}$/.test(value);
  };

  const disposableDomains: string[] = [
    "mailinator.com",
    "10minutemail.com",
    "guerrillamail.com",
    "trashmail.com",
    "tempmail.com",
    "yopmail.com",
    "fakeinbox.com",
    "getnada.com",
  ];

  const validateEmail = (email: string): boolean => {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:(?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,}$/;
    if (!regex.test(email)) return false;

    const [local, domain] = email.split("@");
    if (
      local.startsWith(".") ||
      local.endsWith(".") ||
      local.includes("..") ||
      domain.includes("..")
    )
      return false;

    if (/^\d+$/.test(local) || /^\d+$/.test(domain.split(".")[0])) return false;

    const domainLower = domain.toLowerCase();
    if (disposableDomains.some((d) => domainLower.endsWith(d))) return false;

    return true;
  };

  const validatePassword = (value: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value);
  };

  const validateConfirmPassword = (value: string): boolean => {
    return value === user.password;
  };

  const handleRegister = async () => {
    const isUsernameValid = validateUsername(user.username);
    const isEmailValid = validateEmail(user.email);
    const isPasswordValid = validatePassword(user.password);
    const isConfirmPasswordValid = validateConfirmPassword(
      user.confirmPassword
    );

    setErrors({
      username: isUsernameValid ? "" : "Invalid username",
      email: isEmailValid ? "" : "Invalid email",
      password: "",
      confirmPassword: isConfirmPasswordValid ? "" : "Passwords don't match",
    });

    if (
      !isUsernameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      toast.error("Please fix the errors and ensure a strong password.");
      setButtonDisabled(true);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/users/signup",
        user
      );
      if (response.data.exists) {
        toast.error("Username already exists. Please choose another one.");
        setLoading(false);
        return;
      }

      toast.success("User Registered Successfully!");
      console.log("User Registered Successfully!", response.data);
      router.push("/Login");

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      if (errorMessage.includes("User already exists")) {
        toast.error("Email already exists.");
      } else if (
        errorMessage.includes(
          "User created, but failed to send verification email."
        )
      ) {
        toast.error("User created, but failed to send verification email.");
      } else if (errorMessage.includes("Username exists.")) {
        toast.error("Username already exists.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isUsernameValid = validateUsername(user.username);
    const isEmailValid = validateEmail(user.email);
    const isPasswordValid = validatePassword(user.password);
    const isConfirmPasswordValid = validateConfirmPassword(
      user.confirmPassword
    );

    setButtonDisabled(
      !(
        isUsernameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid
      )
    );
  }, [user]);

  return (
    <div className="grid">
      <div
        rel="preload"
        className="mainRegister flex flex-col items-center justify-center"
      >
        <div className="absolute flex flex-col align-middle justify-between items-center max-h-full shadow-2xl bg-white m-0 p-10 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <GoHomeFill
              onClick={() => {
                router.push("/Home");
              }}
              size={35}
              className=" text-teal-600 hover:cursor-pointer hover:scale-[1.1] active:scale-[1] ease-in-out transition-all duration-300 mb-4"
            />
          <div className=" flex  flex-col gap-4 bg-white m-0 p-10 rounded-md max-w-sm mx-auto">

            <h1 className="font-sans font-extrabold text-2xl text-center">
              User Register
            </h1>
            <p className="font-thin text-center text-gray-600">
              Hey, Enter your details to create an account
            </p>
            <form className="flex flex-col items-center">
              <input
                type="text"
                id="username"
                placeholder="Full name || Username"
                value={user.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUser({ ...user, username: e.target.value })
                }
                onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                  setErrors((prev) => ({
                    ...prev,
                    username: validateUsername(e.target.value)
                      ? ""
                      : "Invalid username",
                  }))
                }
                className="border-2 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.username && (
                <p className="text-red-500 text-xs  mt-1">{errors.username}</p>
              )}
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={user.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUser({ ...user, email: e.target.value })
                }
                onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                  setErrors((prev) => ({
                    ...prev,
                    email: validateEmail(e.target.value) ? "" : "Invalid email",
                  }))
                }
                className="border-2 border-gray-300 p-2 w-full mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
              <div className="w-full relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  value={user.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                    }))
                  }
                  className="border-2 border-gray-300 p-2 w-full mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[35px] -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center"
                >
                  {showPassword ? <FiEye  size={20} /> : <FiEyeOff size={20} />}
                </button>
                <div className="w-full h-1 bg-gray-200 mt-1 rounded">
                  <div
                    className="h-full bg-teal-500 rounded transition-all"
                    style={{ width: `${getPasswordStrength(user.password)}%` }}
                  ></div>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Password must be at least 8 characters, with one uppercase,
                  one lowercase, and one number
                </p>
                
              </div>
              <div className="w-full relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  id="confirmPassword"
                  value={user.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, confirmPassword: e.target.value })
                  }
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateConfirmPassword(e.target.value)
                        ? ""
                        : "Passwords don't match",
                    }))
                  }
                  className=" border-2 border-gray-300 p-2 w-full mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[35px] -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FiEye size={20} />
                  ) : (
                    <FiEyeOff size={20} />
                  )}
                </button>
                <div className="w-full h-1 bg-gray-200 mt-1 rounded">
                  <div
                    className="h-full bg-teal-500 rounded transition-all"
                    style={{
                      width: `${
                        user.confirmPassword &&
                        user.confirmPassword === user.password
                          ? 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <Button
                className={`w-full mt-4 rounded-md bg-teal-500 text-white ${
                  buttonDisabled || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-teal-700"
                }`}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  handleRegister();
                }}
                disabled={buttonDisabled || loading}
              >
                {loading ? "Please Wait..." : "Register"}
              </Button>
            </form>
            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <span
                className="underline text-teal-600 hover:text-teal-800 cursor-pointer"
                onClick={() => (window.location.href = "/Login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: "red",
              secondary: "black",
            },
          },
        }}
      />
    </div>
  );
};

export default page;
