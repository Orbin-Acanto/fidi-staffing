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
  if (!auth.ok) {
    return NextResponse.json(
      { message: "Not authenticated.", errors: { auth: [auth.error] } },
      { status: 401 },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  const { clock_entry_id, admin_password, admin_phone, override_reason } =
    body ?? {};
  const errors: Record<string, string[]> = {};

  if (!clock_entry_id) errors.clock_entry_id = ["clock_entry_id is required."];
  if (!admin_password) errors.admin_password = ["admin_password is required."];
  if (!admin_phone) errors.admin_phone = ["admin_phone is required."];

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: "Validation error.", errors },
      { status: 400 },
    );
  }

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/attendance/admin-clock/manual-check-in/`,
    {
      method: "POST",
      headers: { ...auth.headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        clock_entry_id,
        admin_password,
        admin_phone,
        override_reason,
      }),
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

  return NextResponse.json(data, { status: upstream.status });
}
