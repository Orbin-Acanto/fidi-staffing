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

  const refresh = req.cookies.get("refresh_token")?.value;
  if (!refresh) {
    return NextResponse.json(
      {
        message: "Not authenticated.",
        errors: { auth: ["Missing refresh token."] },
      },
      { status: 401 },
    );
  }

  const upstream = await fetch(`${DJANGO_API_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
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
    const res = NextResponse.json(
      {
        message: data?.message || data?.detail || "Upstream error",
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("access_token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    res.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  }

  const newAccess = data?.access;
  const newRefresh = data?.refresh;

  if (!newAccess) {
    return NextResponse.json(
      { message: "Access token missing from server response." },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ ok: true }, { status: 200 });
  const isProd = process.env.NODE_ENV === "production";

  res.cookies.set("access_token", newAccess, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30,
  });

  if (newRefresh) {
    res.cookies.set("refresh_token", newRefresh, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } else {
    console.log("No new refresh token from Server.");
  }

  return res;
}
