import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

type User = {
  firstName: string;
  role: "user" | "doctor";
  email: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ user: null, message: "No token provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ user: null, message: "JWT secret not configured" });
    }

    const decoded = jwt.verify(token, secret) as { id: string; firstName: string; role: string; email: string };

    // For demonstration, you can just return the decoded payload
    // In real app, you might fetch user from DB using decoded.id
    const user: User = {
      firstName: decoded.firstName,
      role: decoded.role as "user" | "doctor",
      email: decoded.email,
    };

    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(401).json({ user: null, message: error.message || "Unauthorized" });
  }
}
