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

  const searchParams = req.nextUrl.searchParams.toString();

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/contracts/?${searchParams}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
      },
      cache: "no-store",
    },
  );

  const data = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(
      {
        message: data?.message || "Failed to fetch contracts.",
        errors: data?.errors ?? null,
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: upstream.status });
}
