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

    const response = await fetch(
      `${DJANGO_API_URL}/api/vendors/categories/list/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("List vendor categories error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch vendor categories",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
