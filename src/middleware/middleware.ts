import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/doctors",
    "/user",
    "/profile",
    "/Interview",
  ];
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const userCookie = req.cookies.get("user")?.value;

  let role: string | undefined;
  let userId: string | undefined;

  if (userCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(userCookie));
      role = parsed.role;
      userId = parsed._id;
    } catch (err) {
      console.error("Failed to parse user cookie:", err);
    }
  }

  // 🛡️ Admin Protected Route
  if (pathname.startsWith("/admin")) {
    if (!token || !userId || role !== "admin") {
      return NextResponse.redirect(new URL("/adminLogin", req.url));
    }
  }

  // 🛡️ Doctor Protected Route
  if (pathname.startsWith("/doctors")) {
    if (!token || !userId || role !== "doctor") {
      return NextResponse.redirect(new URL("/doctor/login", req.url));
    }
  }

  // ✅ Already logged in redirects
  if (pathname === "/adminLogin" && token && userId && role === "admin") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (pathname === "/doctor/login" && token && userId && role === "doctor") {
    return NextResponse.redirect(new URL("/doctors", req.url));
  }

  if (pathname === "/Login" && token && userId) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else if (role === "doctor") {
      return NextResponse.redirect(new URL("/doctors", req.url));
    } else {
      return NextResponse.redirect(
        new URL(`/user/${userId}/dashboard`, req.url)
      );
    }
  }

  // 🛡️ Interview Protected Route — only for logged-in users with role "user"
  if (pathname.startsWith("/Interview")) {
    // Only allow access if token, userId, and role === "user"
    if (!token || !userId) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }
    // Check role in user cookie
    if (role !== "user") {
      // If not a user, redirect to their respective dashboard
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (role === "doctor") {
        return NextResponse.redirect(new URL("/doctors", req.url));
      } else {
        return NextResponse.redirect(new URL("/Login", req.url));
      }
    }
  }

  // General Protected Routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && (!token || !userId)) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/adminLogin",
    "/Login",
    "/doctor/login",
    "/doctors/:path*",
    "/user/:path*",
    "/profile/:path*",
    "/Interview/:path*",
  ],
};
