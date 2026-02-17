import { NextRequest, NextResponse } from "next/server";
import {
  isSafeOrigin,
  getAuthHeaders,
  getDjangoApiUrl,
} from "@/lib/attendance-utils";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
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

  const searchParams = req.nextUrl.searchParams;
  const company_id = searchParams.get("company_id");
  const date_from = searchParams.get("date_from");
  const date_to = searchParams.get("date_to");

  const errors: Record<string, string[]> = {};
  if (!company_id) errors.company_id = ["company_id is required."];
  if (!date_from) errors.date_from = ["date_from is required."];
  if (!date_to) errors.date_to = ["date_to is required."];

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: "Validation error.", errors },
      { status: 400 },
    );
  }

  const queryString = searchParams.toString();

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/attendance/payroll/attendance/?${queryString}`,
    {
      method: "GET",
      headers: auth.headers,
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
