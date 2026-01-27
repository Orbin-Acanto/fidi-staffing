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

  const required = ["old_password", "new_password", "new_password_confirm"];
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

  const old_password = String(body.old_password);
  const new_password = String(body.new_password);
  const new_password_confirm = String(body.new_password_confirm);

  if (new_password.length < 8) {
    return NextResponse.json(
      {
        message: "Validation error.",
        errors: {
          new_password: ["Password must be at least 8 characters long."],
        },
      },
      { status: 400 },
    );
  }

  if (new_password !== new_password_confirm) {
    return NextResponse.json(
      {
        message: "Validation error.",
        errors: {
          new_password_confirm: ["Passwords do not match."],
        },
      },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${DJANGO_API_URL}/api/auth/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({ old_password, new_password, new_password_confirm }),
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
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: 200 });
}
