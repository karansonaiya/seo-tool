import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/set-remember
 * Sets the `seo_rm` httpOnly cookie before Google OAuth redirect.
 * The auth.ts jwt callback reads this cookie to decide session duration:
 *   seo_rm = "1" → 30-day persistent session
 *   seo_rm = "0" → 1-day session-only
 */
export async function POST(req: NextRequest) {
  const { remember } = await req.json();
  const value = remember ? "1" : "0";

  const res = NextResponse.json({ ok: true });

  res.cookies.set("seo_rm", value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    // Short TTL: only needed during the OAuth redirect flow
    maxAge: 60 * 5, // 5 minutes
  });

  return res;
}
