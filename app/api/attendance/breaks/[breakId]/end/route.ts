import { NextRequest, NextResponse } from "next/server";
import {
  isSafeOrigin,
  getAuthHeaders,
  getDjangoApiUrl,
} from "@/lib/attendance-utils";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ breakId: string }> },
) {
  const origin = req.headers.get("origin");
  if (origin && !isSafeOrigin(req)) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }

  const DJANGO_API_URL = getDjangoApiUrl();
  if (!DJANGO_API_URL) {
    return NextResponse.json(
      { message: "Server misconfiguration: DJANGO_API_URL missing." },
      { status: 500 },
    );
  }

  const auth = getAuthHeaders(req);
  if (!auth.ok) {
    return NextResponse.json(
      { message: "Not authenticated.", errors: { auth: [auth.error] } },
      { status: 401 },
    );
  }

  const { breakId } = await params;

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/attendance/breaks/${breakId}/end/`,
    {
      method: "POST",
      headers: { ...auth.headers, "Content-Type": "application/json" },
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

  return NextResponse.json(data, { status: upstream.status });
}
