import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define your role-based access rules
const roleBasedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
  "/manager": ["manager", "admin"],
  "/reviewer": ["reviewer", "admin"],
  "/applicant": ["applicant", "admin"],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Check if the current path is protected
  const protectedPaths = Object.keys(roleBasedRoutes);
  const matchedPath = protectedPaths.find((path) => pathname.startsWith(path));
  const isProtected = Boolean(matchedPath);

  // If not logged in and accessing protected route, redirect to signin
  if (!token && isProtected) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If logged in but role is not allowed, redirect to unauthorized page
  if (token && isProtected) {
    const allowedRoles = roleBasedRoutes[matchedPath!];
    if (!allowedRoles.includes(token.role as string)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/reviewer/:path*",
    "/applicant/:path*",
  ],
};
