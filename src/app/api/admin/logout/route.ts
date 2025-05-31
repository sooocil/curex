// /app/api/admin/signout/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  // Clear each cookie by setting maxAge to 0
  (await cookieStore).set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  (await cookieStore).set("user", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  (await cookieStore).set("role", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({ success: true, message: "Admin signed out successfully" });
}
