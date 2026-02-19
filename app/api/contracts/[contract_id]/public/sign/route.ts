import { getDjangoApiUrl, isSafeOrigin } from "@/lib/attendance-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ contract_id: string }> },
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

  try {
    const { contract_id: contractId } = await context.params;

    if (!contractId) {
      return NextResponse.json(
        { message: "Contract ID is required" },
        { status: 400 },
      );
    }

    const formData = await request.formData();

    const backendUrl = `${DJANGO_API_URL}/api/contracts/public/${contractId}/sign/`;

    const response = await fetch(backendUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error signing contract:", error);
    return NextResponse.json(
      {
        message: "Failed to sign contract",
        error: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
