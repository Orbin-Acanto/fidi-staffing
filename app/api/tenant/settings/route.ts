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

  const upstream = await fetch(`${DJANGO_API_URL}/api/tenant/settings/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
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

  if (!upstream.ok) {
    return NextResponse.json(
      {
        message:
          data?.message || data?.detail || "Failed to fetch tenant settings",
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(req: NextRequest) {
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

  if (body.billing_email !== undefined && body.billing_email) {
    const billingEmailTrimmed = body.billing_email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmailTrimmed)) {
      return NextResponse.json(
        {
          message: "Validation error.",
          errors: { billing_email: ["Enter a valid email address."] },
        },
        { status: 400 },
      );
    }
  }

  if (body.currency !== undefined && body.currency) {
    if (body.currency.length !== 3) {
      return NextResponse.json(
        {
          message: "Validation error.",
          errors: {
            currency: ["Currency must be a 3-letter code (e.g., USD)."],
          },
        },
        { status: 400 },
      );
    }
  }

  if (body.retention_period !== undefined) {
    const retention = parseInt(body.retention_period);
    if (isNaN(retention) || retention < 1 || retention > 365) {
      return NextResponse.json(
        {
          message: "Validation error.",
          errors: {
            retention_period: [
              "Retention period must be between 1 and 365 days.",
            ],
          },
        },
        { status: 400 },
      );
    }
  }

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/tenant/settings/update/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(body),
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

  if (data?.tenant) {
    return NextResponse.json(data.tenant, { status: 200 });
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        message:
          data?.message || data?.detail || "Failed to update tenant settings",
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: 200 });
}
