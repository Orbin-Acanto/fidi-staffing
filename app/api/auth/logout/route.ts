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

  const refresh = req.cookies.get("refresh_token")?.value || "";
  const access = req.cookies.get("access_token")?.value || "";

  const res = NextResponse.json({ ok: true }, { status: 200 });
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

  if (!refresh) return res;

  try {
    const upstream = await fetch(`${DJANGO_API_URL}/api/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
      },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json(
          {
            ok: true,
            message: "Logged out locally; upstream logout failed.",
            upstream_status: upstream.status,
            upstream: data,
          },
          { status: 200, headers: res.headers },
        );
      }

      return res;
    }

    return res;
  } catch {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        {
          ok: true,
          message: "Logged out locally; upstream logout unreachable.",
        },
        { status: 200, headers: res.headers },
      );
    }
    return res;
  }
}
