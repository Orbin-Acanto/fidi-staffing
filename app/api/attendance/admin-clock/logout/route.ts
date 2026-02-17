import { NextRequest, NextResponse } from "next/server";
import {
  isSafeOrigin,
  getClockHeaders,
  getDjangoApiUrl,
} from "@/lib/attendance-utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && !isSafeOrigin(req)) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }

  const DJANGO_API_URL = getDjangoApiUrl();
  if (!DJANGO_API_URL) {
    return NextResponse.json(
      { message: "Server misconfiguration: DJANGO_API_URL missing." },
      { status: 500 },
    );
  }

  const auth = getClockHeaders(req);
  if (auth.ok) {
    await fetch(`${DJANGO_API_URL}/api/attendance/admin-clock/logout/`, {
      method: "POST",
      headers: { ...auth.headers, "Content-Type": "application/json" },
      cache: "no-store",
    });
  }

  const res = NextResponse.json(
    { message: "Logged out successfully." },
    { status: 200 },
  );

  const clearCookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };

  res.cookies.set("clock_token", "", clearCookie);
  res.cookies.set("clock_admin_name", "", clearCookie);
  res.cookies.set("clock_tenant_name", "", clearCookie);
  res.cookies.set("clock_tenant_id", "", clearCookie);
  res.cookies.set("clock_session_id", "", clearCookie);

  return res;
}
