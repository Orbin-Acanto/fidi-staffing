import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ contract_id: string }> },
) {
  const { contract_id } = await params;

  const DJANGO_API_URL = process.env.DJANGO_API_URL;
  const access = req.cookies.get("access_token")?.value;

  if (!DJANGO_API_URL || !access) {
    return NextResponse.json(
      { message: "Not authenticated." },
      { status: 401 },
    );
  }

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/contracts/${contract_id}/mark-sent/`,
    {
      method: "POST",
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
        message: data?.message || "Failed to mark contract as sent.",
        errors: data?.errors ?? null,
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: upstream.status });
}
