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

async function fetchMe(DJANGO_API_URL: string, access: string) {
  const upstream = await fetch(`${DJANGO_API_URL}/api/auth/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const text = await upstream.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  return { upstream, data };
}

async function refreshAccess(DJANGO_API_URL: string, refresh: string) {
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

  return { upstream, data };
}

export async function GET(req: NextRequest) {
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

  const isProd = process.env.NODE_ENV === "production";
  const access = req.cookies.get("access_token")?.value || "";
  const refresh = req.cookies.get("refresh_token")?.value || "";

  if (!access && !refresh) {
    return NextResponse.json(
      { message: "Not authenticated.", errors: { auth: ["Missing tokens."] } },
      { status: 401 },
    );
  }

  if (access) {
    const { upstream, data } = await fetchMe(DJANGO_API_URL, access);

    if (upstream.ok) {
      return NextResponse.json(data, { status: 200 });
    }

    if (upstream.status !== 401) {
      return NextResponse.json(
        {
          message: data?.message || data?.detail || "Upstream error",
          errors: data?.errors ?? null,
          ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
        },
        { status: upstream.status },
      );
    }
  }

  if (!refresh) {
    const res = NextResponse.json(
      {
        message: "Not authenticated.",
        errors: { auth: ["Missing refresh token."] },
      },
      { status: 401 },
    );
    res.cookies.set("access_token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  }

  const refreshed = await refreshAccess(DJANGO_API_URL, refresh);

  if (!refreshed.upstream.ok) {
    const res = NextResponse.json(
      {
        message:
          refreshed.data?.message || refreshed.data?.detail || "Upstream error",
        errors: refreshed.data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production"
          ? { _raw: refreshed.data }
          : {}),
      },
      { status: refreshed.upstream.status },
    );

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

  const newAccess = refreshed.data?.access;
  if (!newAccess) {
    return NextResponse.json(
      { message: "Access token missing from server response." },
      { status: 500 },
    );
  }

  const meRetry = await fetchMe(DJANGO_API_URL, newAccess);

  if (!meRetry.upstream.ok) {
    return NextResponse.json(
      {
        message:
          meRetry.data?.message || meRetry.data?.detail || "Upstream error",
        errors: meRetry.data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production"
          ? { _raw: meRetry.data }
          : {}),
      },
      { status: meRetry.upstream.status },
    );
  }

  const res = NextResponse.json(meRetry.data, { status: 200 });

  res.cookies.set("access_token", newAccess, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30,
  });

  return res;
}
