import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

type User = {
  _id: string;
  firstName: string;
  role: "user" | "doctor";
  email: string;
};

export const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwt.decode(token) as User | null;
      if (decoded && typeof decoded === "object") {
        setUser({
          _id: decoded._id,
          firstName: decoded.firstName,
          role: decoded.role,
          email: decoded.email,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateUserFromToken();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        updateUserFromToken();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { user, loading };
};
