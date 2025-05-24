import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const protectedRoutes = [
    "/interview/questions",
    "/interview/results",
  ];

  const isUserRoute = request.nextUrl.pathname.startsWith("/user");
  const isProtectedInterviewRoute = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  const isProtected = isUserRoute || isProtectedInterviewRoute;

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/interview/:path*"],
};
