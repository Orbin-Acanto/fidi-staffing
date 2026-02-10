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
  { params }: { params: Promise<{ staff_id: string }> },
) {
  const { staff_id } = await params;

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

  const contentType = req.headers.get("content-type");
  let body: any;
  let requestBody: FormData | string;

  if (contentType?.includes("multipart/form-data")) {
    try {
      body = await req.formData();
      requestBody = body;
    } catch {
      return NextResponse.json(
        { message: "Invalid form data." },
        { status: 400 },
      );
    }
  } else {
    try {
      body = await req.json();
      requestBody = JSON.stringify(body);
    } catch {
      return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
    }
  }

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/staff/${staff_id}/update/`,
    {
      method: "PATCH",
      headers: contentType?.includes("multipart/form-data")
        ? {
            Authorization: `Bearer ${access}`,
          }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
      body: requestBody,
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

  if (!upstream.ok) {
    return NextResponse.json(
      {
        message:
          data?.message || data?.detail || "Failed to update staff member.",
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: upstream.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ staff_id: string }> },
) {
  const { staff_id } = await params;

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

  const contentType = req.headers.get("content-type");
  let body: any;
  let requestBody: FormData | string;

  if (contentType?.includes("multipart/form-data")) {
    try {
      body = await req.formData();
      requestBody = body;
    } catch {
      return NextResponse.json(
        { message: "Invalid form data." },
        { status: 400 },
      );
    }
  } else {
    try {
      body = await req.json();
      requestBody = JSON.stringify(body);
    } catch {
      return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
    }
  }

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/staff/${staff_id}/update/`,
    {
      method: "PUT",
      headers: contentType?.includes("multipart/form-data")
        ? {
            Authorization: `Bearer ${access}`,
          }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
      body: requestBody,
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

  if (!upstream.ok) {
    return NextResponse.json(
      {
        message:
          data?.message || data?.detail || "Failed to update staff member.",
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: upstream.status });
}
