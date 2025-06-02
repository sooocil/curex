import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import { randomBytes } from "crypto";

// Admin credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin123";
const JWT_SECRET = process.env.JWT_SECRET || "admin-secret-key";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "2d" });
    const cookieStore = cookies();

    // 🔥 Set cookies the middleware expects
    const userPayload = {
      _id: "admin-id-1234", // Can be anything for admin
      name: "Admin",
      email,
    };

    (await cookieStore).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    (await cookieStore).set("user", encodeURIComponent(JSON.stringify(userPayload)), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    (await cookieStore).set("role", "admin", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Admin login successful" });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
