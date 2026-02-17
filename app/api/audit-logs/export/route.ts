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

const ALLOWED_PARAMS = [
  "format",
  "action",
  "action__in",
  "severity",
  "severity__in",
  "user",
  "user_email",
  "company",
  "object_type",
  "object_type__in",
  "object_id",
  "date_from",
  "date_to",
  "search",
];

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

  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();

  for (const key of ALLOWED_PARAMS) {
    const value = searchParams.get(key);
    if (value) params.append(key, value);
  }

  if (!params.has("format")) {
    params.append("format", "csv");
  }

  const queryString = params.toString();
  const url = `${DJANGO_API_URL}/api/audit-logs/export/${queryString ? `?${queryString}` : ""}`;

  const upstream = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    return NextResponse.json(
      {
        message:
          data?.message || data?.detail || "Failed to export audit logs.",
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  const contentType =
    upstream.headers.get("content-type") || "application/octet-stream";
  const contentDisposition =
    upstream.headers.get("content-disposition") || "attachment";

  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    },
  });
}
