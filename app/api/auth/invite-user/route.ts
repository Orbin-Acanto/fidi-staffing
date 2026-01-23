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

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  if (!isSafeOrigin(req)) {
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

  const required = ["email", "role"];
  for (const k of required) {
    if (!body?.[k] || String(body[k]).trim().length === 0) {
      return NextResponse.json(
        {
          message: "Validation error.",
          errors: { [k]: ["This field is required."] },
        },
        { status: 400 },
      );
    }
  }

  const email = normalizeEmail(String(body.email));
  const role = String(body.role).trim();
  const message = body?.message != null ? String(body.message) : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      {
        message: "Validation error.",
        errors: { email: ["Enter a valid email address."] },
      },
      { status: 400 },
    );
  }

  if (!["admin", "moderator"].includes(role)) {
    return NextResponse.json(
      {
        message: "Validation error.",
        errors: { role: ["Role must be admin or moderator."] },
      },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${DJANGO_API_URL}/api/auth/invite-user/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({ email, role, message }),
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
        message: data?.message || data?.detail || "Upstream error",
        errors: data?.errors ?? data ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: data?.message ?? "Invitation sent successfully.",
      invitation: data?.invitation ?? null,
    },
    { status: 201 },
  );
}
