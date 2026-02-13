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

type UpdateBody = {
  service_type?: string | null;
  contract_amount?: number | null;
  notes?: string | null;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ event_id: string; assignment_id: string }> },
) {
  const { event_id, assignment_id } = await params;

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

  let body: UpdateBody;
  try {
    body = (await req.json()) as UpdateBody;
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body.", errors: { body: ["Malformed JSON."] } },
      { status: 400 },
    );
  }

  if (
    body.contract_amount !== undefined &&
    body.contract_amount !== null &&
    (typeof body.contract_amount !== "number" ||
      Number.isNaN(body.contract_amount))
  ) {
    return NextResponse.json(
      {
        message: "Validation error.",
        errors: { contract_amount: ["contract_amount must be a number."] },
      },
      { status: 400 },
    );
  }

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/events/${event_id}/vendors/${assignment_id}/update/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
          "Failed to update vendor assignment.",
        errors: (data as { errors?: unknown })?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: upstream.status });
}
