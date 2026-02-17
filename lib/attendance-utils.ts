import { NextRequest } from "next/server";

export function isSafeOrigin(req: NextRequest): boolean {
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

export function getClockHeaders(req: NextRequest) {
  const token = req.cookies.get("clock_token")?.value;
  const adminName = req.cookies.get("clock_admin_name")?.value;
  const tenantName = req.cookies.get("clock_tenant_name")?.value;

  if (!token || !adminName || !tenantName) {
    return {
      ok: false as const,
      error: "Missing clock portal auth cookies.",
    };
  }

  return {
    ok: true as const,
    headers: {
      "X-Clock-Token": token,
      "X-Admin-Name": adminName,
      "X-Tenant-Name": tenantName,
    },
  };
}

export function getAuthHeaders(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return {
      ok: false as const,
      error: "Missing authentication token.",
    };
  }

  return {
    ok: true as const,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getDjangoApiUrl(): string | null {
  return process.env.DJANGO_API_URL || null;
}
