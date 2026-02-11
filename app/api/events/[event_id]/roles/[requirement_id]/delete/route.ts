import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isSafeOrigin(req: NextRequest): boolean {
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ event_id: string; requirement_id: string }> },
) {
  const { event_id, requirement_id } = await params;

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

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/events/${event_id}/roles/${requirement_id}/delete/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access}`,
      },
      cache: "no-store",
    },
  );

  const text = await upstream.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        message:
          (data as { message?: string })?.message ||
          "Failed to delete role requirement.",
        errors: (data as { errors?: unknown })?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: upstream.status });
}
