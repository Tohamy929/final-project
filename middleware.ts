import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

 
  console.log("Middleware check:", {
    pathname: req.nextUrl.pathname,
    hasToken: !!token,
    tokenPayload: token,
  });

 
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

 
  return NextResponse.next();
}


export const config = {
  matcher: ["/cart"],
};