import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isSafeOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    const o = new URL(origin);
    return o.host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && !isSafeOrigin(req)) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }

  const DJANGO_API_URL = process.env.DJANGO_API_URL;
  if (!DJANGO_API_URL) {
    return NextResponse.json(
      { message: "Server misconfiguration: DJANGO_API_URL missing." },
      { status: 500 },
    );
  }

  const access = req.cookies.get("access_token")?.value;
  if (!access) {
    return NextResponse.json(
      {
        message: "Not authenticated.",
        errors: { auth: ["Missing access token."] },
      },
      { status: 401 },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  const { name, pay_type, default_rate } = body;

  const errors: Record<string, string[]> = {};

  if (!name || !name.trim()) {
    errors.name = ["Role name is required."];
  }

  if (!pay_type) {
    errors.pay_type = ["Pay type is required."];
  } else if (pay_type !== "hourly" && pay_type !== "fixed") {
    errors.pay_type = ["Pay type must be either 'hourly' or 'fixed'."];
  }

  if (
    !default_rate ||
    isNaN(parseFloat(default_rate)) ||
    parseFloat(default_rate) <= 0
  ) {
    errors.default_rate = [
      "Valid default rate is required and must be greater than 0.",
    ];
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        message: "Validation error.",
        errors,
      },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${DJANGO_API_URL}/api/roles/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

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
        message: data?.message || data?.detail || "Failed to create role.",
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: upstream.status });
}
