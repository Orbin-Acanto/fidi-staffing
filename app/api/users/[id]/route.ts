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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
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

  const params = await context.params;
  const { id } = params;

  if (body.first_name !== undefined && !body.first_name.trim()) {
    return NextResponse.json(
      {
        message: "Validation error.",
        errors: { first_name: ["First name cannot be empty."] },
      },
      { status: 400 },
    );
  }

  if (body.last_name !== undefined && !body.last_name.trim()) {
    return NextResponse.json(
      {
        message: "Validation error.",
        errors: { last_name: ["Last name cannot be empty."] },
      },
      { status: 400 },
    );
  }

  if (body.email !== undefined) {
    const emailTrimmed = body.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      return NextResponse.json(
        {
          message: "Validation error.",
          errors: { email: ["Enter a valid email address."] },
        },
        { status: 400 },
      );
    }
  }

  if (body.role !== undefined) {
    const validRoles = ["admin", "moderator"];
    if (!validRoles.includes(body.role.toLowerCase())) {
      return NextResponse.json(
        {
          message: "Validation error.",
          errors: { role: ["Role must be admin or moderator."] },
        },
        { status: 400 },
      );
    }
  }

  const upstream = await fetch(`${DJANGO_API_URL}/api/users/${id}/`, {
    method: "PATCH",
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
        message: data?.message || data?.detail || "Upstream error",
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: 200 });
}
