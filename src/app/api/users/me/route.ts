import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type User = {
  firstName: string;
  role: "user" | "doctor";
  email: string;
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null, message: "No token provided" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ user: null, message: "JWT secret not configured" }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret) as {
      id: string;
      firstName: string;
      role: string;
      email: string;
    };

    const user: User = {
      firstName: decoded.firstName,
      role: decoded.role as "user" | "doctor",
      email: decoded.email,
    };

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ user: null, message: error.message || "Unauthorized" }, { status: 401 });
  }
}
