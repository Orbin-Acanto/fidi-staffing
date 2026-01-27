import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type DjangoAcceptInvitationResponse = {
  tokens?: { access?: string; refresh?: string };
  user?: any;
  tenant?: any;
  company?: any;
  [key: string]: any;
};

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

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  const required = [
    "token",
    "first_name",
    "last_name",
    "password",
    "password_confirm",
    "phone",
  ];
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

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/auth/accept-invitation/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  const text = await upstream.text();
  let data: DjangoAcceptInvitationResponse | any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        message: data?.message || data?.detail || "Upstream error",
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  const access = data?.tokens?.access;
  const refresh = data?.tokens?.refresh;

  if (!access || !refresh) {
    return NextResponse.json(
      { message: "Login tokens missing from server response." },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ ok: true }, { status: 200 });

  const isProd = process.env.NODE_ENV === "production";

  res.cookies.set("access_token", access, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30,
  });

  res.cookies.set("refresh_token", refresh, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
