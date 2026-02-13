import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const DJANGO_API_URL = process.env.DJANGO_API_URL;

function isSafeOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin) return true;

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSafeOrigin(request)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    if (!DJANGO_API_URL) {
      console.error("DJANGO_API_URL is not configured");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 },
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const response = await fetch(`${DJANGO_API_URL}/api/vendors/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create vendor error:", error);
    return NextResponse.json(
      {
        error: "Failed to create vendor",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
