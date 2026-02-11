import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
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
  const status = searchParams.get("status");
  const event_type = searchParams.get("event_type");
  const date_from = searchParams.get("date_from");
  const date_to = searchParams.get("date_to");
  const search = searchParams.get("search");
  const company = searchParams.get("company");
  const page = searchParams.get("page");
  const page_size = searchParams.get("page_size");
  const order_by = searchParams.get("order_by");

  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (event_type) params.append("event_type", event_type);
  if (date_from) params.append("date_from", date_from);
  if (date_to) params.append("date_to", date_to);
  if (search) params.append("search", search);
  if (company) params.append("company", company);
  if (page) params.append("page", page);
  if (page_size) params.append("page_size", page_size);
  if (order_by) params.append("order_by", order_by);

  const queryString = params.toString();
  const url = `${DJANGO_API_URL}/api/events/${queryString ? `?${queryString}` : ""}`;

  const upstream = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",
  });

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
          (data as { message?: string })?.message || "Failed to fetch events.",
        errors: (data as { errors?: unknown })?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: upstream.status });
}
