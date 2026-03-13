import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Edge-safe: uses authConfig which has NO Node.js-only imports (no Mongoose)
const { auth } = NextAuth(authConfig);

/**
 * Middleware: protect all app routes behind authentication.
 * Runs in Edge runtime — uses JWT only, no DB calls.
 */
export default auth((req) => {
  const { nextUrl, auth: session } = req;

  if (!session) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/audit/:path*",
    "/reports/:path*",
    "/monitoring/:path*",
    "/competitors/:path*",
    "/settings/:path*",
  ],
};
