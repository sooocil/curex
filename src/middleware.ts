// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/doctors",
    "/user",
    "/profile",
    "/Interview",
    "/admin",
  ];
  const { pathname } = req.nextUrl;

  // Check if the current path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  //protected route for /admin
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;
    const role = req.cookies.get("role")?.value;
    if (!token || !user || role !== "admin") {
      return NextResponse.redirect(new URL("/adminLogin", req.url));
    }
  }

  // Check if admin is already logged in when visiting adminLogin page
  if (pathname === "/adminLogin") {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;
    const role = req.cookies.get("role")?.value;

    if (token && user && role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }
  // Check if user is already logged in when visiting Login page
  if (pathname === "/Login") {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;
    const role = req.cookies.get("role")?.value;

    if (token && user) {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        return NextResponse.redirect(
          new URL(`/user/${user}/dashboard`, req.url)
        );
      }
    }
  }

  if (isProtectedRoute) {
    const token = req.cookies.get("token")?.value;
    const user = req.cookies.get("user")?.value;

    if (!token || !user) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to the specified routes and their subpaths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/doctors/:path*",
    "/user/:path*",
    "/profile/:path*",
    "/Interview/:path*",
    "/admin/:path*",
  ],
};
