// src/app/api/users/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
    response.cookies.set("token", "", { httpOnly: true, path: "/", maxAge: 0 });
    response.cookies.set("user", "", { httpOnly: true, path: "/", maxAge: 0 });
    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}