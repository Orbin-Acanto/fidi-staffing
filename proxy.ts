import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const guestOnlyRoutes = ["/login"];
  const publicRoutes = [
    "/accept-invitation",
    "/accept-invitation-1",
    "/forgot-password",
    "/reset-password",
  ];

  const isGuestOnly = guestOnlyRoutes.some((r) => pathname.startsWith(r));
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  if (isGuestOnly && accessToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (isGuestOnly || isPublic) {
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
