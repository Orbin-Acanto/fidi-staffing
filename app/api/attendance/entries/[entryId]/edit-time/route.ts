import {
  getAuthHeaders,
  getDjangoApiUrl,
  isSafeOrigin,
} from "@/lib/attendance-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
  const origin = request.headers.get("origin");
  if (origin && !isSafeOrigin(request)) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }

  const DJANGO_API_URL = getDjangoApiUrl();
  if (!DJANGO_API_URL) {
    return NextResponse.json(
      { message: "Server misconfiguration: DJANGO_API_URL missing." },
      { status: 500 },
    );
  }

  const auth = getAuthHeaders(request);
  if (!auth.ok) {
    return NextResponse.json(
      { message: "Not authenticated.", errors: { auth: [auth.error] } },
      { status: 401 },
    );
  }

  try {
    const { entryId } = await params;
    const body = await request.json();

    if (!body.clock_in_time && !body.clock_out_time) {
      return NextResponse.json(
        {
          success: false,
          message:
            "At least one time field (clock_in_time or clock_out_time) must be provided",
        },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${DJANGO_API_URL}/api/attendance/entries/${entryId}/edit-time/`,
      {
        method: "POST",
        headers: { ...auth.headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error editing time entry:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to edit time entry",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
