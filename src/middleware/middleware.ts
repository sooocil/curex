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

  // 🛡️ Admin Protected Route
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;
    const role = req.cookies.get("role")?.value;

    if (!token || !user || role !== "admin") {
      return NextResponse.redirect(new URL("/adminLogin", req.url));
    }
  }

  // 🛡️ Doctor Protected Route
  if (pathname.startsWith("/doctors")) {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;
    const role = req.cookies.get("role")?.value;

    if (!token || !user || role !== "doctor") {
      return NextResponse.redirect(new URL("/doctor/login", req.url));
    }
  }

  // ✅ If admin is already logged in and goes to /adminLogin
  if (pathname === "/adminLogin") {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;
    const role = req.cookies.get("role")?.value;

    if (token && user && role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // ✅ If doctor is already logged in and goes to /doctor/login
  if (pathname === "/doctor/login") {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;
    const role = req.cookies.get("role")?.value;

    if (token && user && role === "doctor") {
      return NextResponse.redirect(new URL("/doctors", req.url));
    }
  }

  // ✅ If user is already logged in and goes to /Login
  if (pathname === "/Login") {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;
    const role = req.cookies.get("role")?.value;

    if (token && user) {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (role === "doctor") {
        return NextResponse.redirect(new URL("/doctors", req.url));
      } else {
        return NextResponse.redirect(new URL(`/user/${user}/dashboard`, req.url));
      }
    }
  }

  // General protected route fallback
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;

    if (!token || !user) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }
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
