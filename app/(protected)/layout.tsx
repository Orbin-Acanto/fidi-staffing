import { redirect } from "next/navigation";
import { getMe } from "@/lib/server/getMe";
import { AuthProvider } from "@/component/auth/AuthProvider";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();

  if (!me) redirect("/login");

  return <AuthProvider me={me}>{children}</AuthProvider>;
}
