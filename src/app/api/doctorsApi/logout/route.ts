import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Create a response that redirects to /Home
  const response = NextResponse.redirect(new URL('/Home', request.url));

  // Clear authentication-related cookies
  response.cookies.set('token', '', { maxAge: 0, path: '/' });
  response.cookies.set('user', '', { maxAge: 0, path: '/' });
  response.cookies.set('role', '', { maxAge: 0, path: '/' });

  return response;
}
