"use client";

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { boolean } from "zod";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<boolean| undefined | null>(null);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      const message = error.response?.data?.message || "Verification failed.";
      setError(message);
    }
  };

  useEffect(() => {
    setError(false);
    const urlToken = window.location.search.split("=")[1];
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div>
      {verified ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <h1 className="text-2xl font-semibold text-teal-600 mb-3">Email Verified Successfully</h1>
          <p className="text-gray-600">You can now log in to your account.</p>
          <button
            onClick={() => router.push("/Login")}
            className="mt-6 px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <h1 className="text-2xl font-semibold text-teal-600 mb-3">Verifying Email...</h1>
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin my-4"></div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Page;
