import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const protectedRoutes = [
    "/membership",
    "/profiles",
    "/notifications",
    "/settings",
    "/messages",
  ];

  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/membership/:path*",
    "/profiles/:username/collections/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/messages/:path*",
  ],
};
