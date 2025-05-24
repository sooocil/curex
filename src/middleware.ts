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
  ];
  const { pathname } = req.nextUrl;

  // Check if the current path starts with any of the protected routes
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

// Apply middleware to the specified routes and their subpaths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/doctors/:path*",
    "/user/:path*",
    "/profile/:path*",
    "/Interview/:path*",
  ],
};
