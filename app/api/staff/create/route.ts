import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isSafeOrigin(req: NextRequest) {
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

export async function POST(req: NextRequest) {
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

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { message: "Invalid form data." },
      { status: 400 },
    );
  }

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const pay_type = formData.get("pay_type") as string;
  const hourly_rate = formData.get("hourly_rate") as string;
  const fixed_rate = formData.get("fixed_rate") as string;

  const errors: Record<string, string[]> = {};

  if (!first_name || !first_name.trim()) {
    errors.first_name = ["First name is required."];
  }

  if (!last_name || !last_name.trim()) {
    errors.last_name = ["Last name is required."];
  }

  if (!email || !email.trim()) {
    errors.email = ["Email is required."];
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = ["Invalid email format."];
    }
  }

  if (!phone || !phone.trim()) {
    errors.phone = ["Phone number is required."];
  }

  if (!pay_type) {
    errors.pay_type = ["Pay type is required."];
  } else {
    if (pay_type === "hourly") {
      if (
        !hourly_rate ||
        isNaN(parseFloat(hourly_rate)) ||
        parseFloat(hourly_rate) <= 0
      ) {
        errors.hourly_rate = [
          "Valid hourly rate is required when pay type is hourly.",
        ];
      }
    } else if (pay_type === "fixed") {
      if (
        !fixed_rate ||
        isNaN(parseFloat(fixed_rate)) ||
        parseFloat(fixed_rate) <= 0
      ) {
        errors.fixed_rate = [
          "Valid fixed rate is required when pay type is fixed.",
        ];
      }
    } else if (pay_type !== "hourly" && pay_type !== "fixed") {
      errors.pay_type = ["Pay type must be either 'hourly' or 'fixed'."];
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        message: "Validation error.",
        errors,
      },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${DJANGO_API_URL}/api/staff/create/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
    },
    body: formData,
    cache: "no-store",
  });

  const text = await upstream.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        message:
          data?.message || data?.detail || "Failed to create staff member.",
        errors: data?.errors ?? null,
        ...(process.env.NODE_ENV !== "production" ? { _raw: data } : {}),
      },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data, { status: upstream.status });
}
