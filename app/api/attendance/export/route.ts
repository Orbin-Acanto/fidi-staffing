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
  const queryString = searchParams.toString();

  const upstream = await fetch(
    `${DJANGO_API_URL}/api/attendance/export/${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      headers: auth.headers,
      cache: "no-store",
    },
  );

  if (upstream.headers.get("content-type")?.includes("text/csv")) {
    const blob = await upstream.blob();
    const filename =
      upstream.headers
        .get("content-disposition")
        ?.split("filename=")[1]
        ?.replace(/"/g, "") || "attendance_report.csv";

    return new NextResponse(blob, {
      status: upstream.status,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  const text = await upstream.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  return NextResponse.json(data, { status: upstream.status });
}
