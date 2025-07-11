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

  const corsHeaders = new Headers({
    "Access-Control-Allow-Origin": "https://curex.soocil.tech",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (pathname.startsWith("/admin")) {
    if (!token || !userId || role !== "admin") {
      return NextResponse.redirect(new URL("/adminLogin", req.url));
    }
  }

  if (pathname.startsWith("/doctors")) {
    if (!token || !userId || role !== "doctor") {
      return NextResponse.redirect(new URL("/doctor/login", req.url));
    }
  }

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

  if (pathname.startsWith("/Interview")) {
    if (!token || !userId) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }
    if (role !== "user") {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (role === "doctor") {
        return NextResponse.redirect(new URL("/doctors", req.url));
      } else {
        return NextResponse.redirect(new URL("/Login", req.url));
      }
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && (!token || !userId)) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  const response = NextResponse.next();
  if (pathname.startsWith("/api/")) {
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }

  return response;
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
    "/api/:path*",  
  ],
};
