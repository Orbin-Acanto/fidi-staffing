import AdminLayout from "@/component/admin/AdminLayout";
import { AuthProvider } from "@/component/auth/AuthProvider";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getMe(cookieHeader: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/auth/me`, {
    method: "GET",
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const cookieHeader = hdrs.get("cookie") ?? "";

  const me = await getMe(cookieHeader);

  if (!me) redirect("/login");

  return (
    <AuthProvider me={me}>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}
