import { cookies } from "next/headers";

export async function getMe() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const cookieHeader = cookies().toString();

  const res = await fetch(`${base}/api/auth/me`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}
