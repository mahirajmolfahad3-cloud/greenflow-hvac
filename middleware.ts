import { NextResponse, type NextRequest } from "next/server";
import { updateSession as refreshSession } from "@/lib/supabase/middleware";
import { ROUTE_ROLE_MAP, ROLE_HOME_ROUTE, type Role } from "@/lib/permissions";

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/accept-invite"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await refreshSession(request);

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  // Not authenticated -> only public routes allowed.
  if (!user) {
    if (isPublicRoute || pathname === "/") {
      return response;
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Authenticated user hitting a public auth page -> send home.
  if (isPublicRoute) {
    const url = request.nextUrl.clone();
    // Role is read from user_metadata as a fast path; the authoritative
    // value always lives in gf_profiles and is re-checked server-side.
    const role = (user.user_metadata?.role as Role) ?? "technician";
    url.pathname = ROLE_HOME_ROUTE[role];
    return NextResponse.redirect(url);
  }

  // Role-based section guard.
  const role = (user.user_metadata?.role as Role) ?? "technician";
  const matchedSection = ROUTE_ROLE_MAP.find((section) => pathname.startsWith(section.prefix));
  if (matchedSection && !matchedSection.roles.includes(role)) {
    const url = request.nextUrl.clone();
    url.pathname = "/forbidden";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};