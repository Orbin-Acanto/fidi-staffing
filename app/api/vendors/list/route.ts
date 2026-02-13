import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const DJANGO_API_URL = process.env.DJANGO_API_URL;

export async function GET(request: NextRequest) {
  try {
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

    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const url = queryString
      ? `${DJANGO_API_URL}/api/vendors/list/?${queryString}`
      : `${DJANGO_API_URL}/api/vendors/list/`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("List vendors error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch vendors",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
