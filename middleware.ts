import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  // Only protect routes that truly need server-side auth
  const protectedPaths = ["/wishlist", "/checkout"]; // example
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) {
    // Skip auth check for cart and other client-only pages
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("Middleware check:", {
    pathname: req.nextUrl.pathname,
    hasToken: !!token,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/wishlist/:path*", "/checkout/:path*"], // cart removed
};