import { NextRequest, NextResponse } from "next/server";
import { isSafeOrigin, getDjangoApiUrl } from "@/lib/attendance-utils";

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

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  const { phone, password } = body ?? {};
  const errors: Record<string, string[]> = {};

  if (!phone || !String(phone).trim()) {
    errors.phone = ["Phone is required."];
  }
  if (!password || !String(password).trim()) {
    errors.password = ["Password is required."];
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: "Validation error.", errors },
      { status: 400 },
    );
  }

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/attendance/admin-clock/login/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
      cache: "no-store",
    },
  );

  const text = await upstream.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        message: data?.message || "Login failed.",
        errors: data?.errors ?? null,
      },
      { status: upstream.status },
    );
  }

  const res = NextResponse.json(data, { status: 200 });

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  };

  res.cookies.set("clock_token", data.data.token, cookieOptions);
  res.cookies.set("clock_admin_name", data.data.admin_name, cookieOptions);
  res.cookies.set("clock_tenant_name", data.data.tenant_name, cookieOptions);
  res.cookies.set("clock_tenant_id", data.data.tenant_id, cookieOptions);

  return res;
}
