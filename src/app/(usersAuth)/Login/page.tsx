"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { startTransition } from "react";
import { Button } from "@/components/ui/button";
import { GoHomeFill } from "react-icons/go";

const Page = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIfLoggedIn = () => {
      try {
        const token = localStorage.getItem("token") || getCookie("token");
        const userData = localStorage.getItem("user") || decodeURIComponent(getCookie("user") || "");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser?.id || parsedUser?._id) {
            const userId = parsedUser.id || parsedUser._id;
            router.replace(`/user/${userId}/dashboard`);
          }
        }
      } catch (err) {
        console.error("Silent auth check failed", err);
      }
    };

    checkIfLoggedIn();
  }, [router]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");
    if (savedEmail && savedPassword) {
      setUser({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
    setButtonDisabled(!user.email || !user.password);
  }, [user.email, user.password]);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  };

  const setCookie = (name: string, value: string, days = 1) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post("/api/users/login", user, {
        withCredentials: true,
      });

      const { userId, token, user: userData } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        setCookie("token", token);
      }

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setCookie("user", encodeURIComponent(JSON.stringify(userData)));
      }

      if (rememberMe) {
        localStorage.setItem("rememberEmail", user.email);
        localStorage.setItem("rememberPassword", user.password);
      } else {
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
      }

      toast.success("Login successful!");

      setTimeout(() => {
        startTransition(() => {
          router.push(`/user/${userId}/dashboard`);
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainlogin flex flex-col items-center justify-center min-h-screen">
      <div className="AuthPopup RegisterPopup flex flex-col align-middle justify-between items-center absolute shadow-2xl bg-white rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 w-full max-w-sm">
        <GoHomeFill
          onClick={() => router.push("/Home")}
          size={35}
          className="text-teal-600 hover:cursor-pointer hover:scale-[1.1] active:scale-[1] ease-in-out transition-all duration-300 mb-4"
        />

        <h1 className="font-sans font-extrabold text-2xl text-center">
          User Login
        </h1>
        <p className="font-thin text-center text-gray-600 mb-4">
          Hey, Enter your details to log in to your account
        </p>

        <form className="flex flex-col items-start" onSubmit={onLogin}>
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            className="border-2 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
            className="border-2 border-gray-300 p-2 w-full mt-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <label className="flex items-center mt-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            Remember Me
          </label>

          <Button
            type="submit"
            disabled={loading || buttonDisabled}
            className="bg-teal-500 hover:bg-teal-700 text-white w-full rounded-md mt-4"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Don't have an account?{" "}
          <span
            className="underline text-teal-600 hover:text-teal-800 cursor-pointer"
            onClick={() => router.push("/Register")}
          >
            Register
          </span>
        </p>
      </div>

      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
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

export default Page;
