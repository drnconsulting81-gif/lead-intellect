import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CEO_EMAILS = [
  "drnconsulting81@gmail.com",
  "raghu96666@gmail.com",
  "raghud.smartcheck@gmail.com",
  "raghud2483@gmail.com",
  "ceo@leadintellect.ai",
  "ceo@lead-intellect.com",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin portal from non-admin users
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const userCookie = request.cookies.get("leadintellect_user")?.value;
    const roleCookie = request.cookies.get("leadintellect_role")?.value;
    const emailCookie = request.cookies.get("leadintellect_email")?.value;

    const role = (roleCookie || "").toLowerCase().trim();
    const email = (emailCookie || "").toLowerCase().trim();

    if (userCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userCookie));
        const userEmail = (parsed.email || email).toLowerCase().trim();
        const userRole = (parsed.role || role).toLowerCase().trim();

        // If authenticated user is a Customer or non-admin, redirect to customer dashboard
        if (userRole && userRole !== "admin" && !CEO_EMAILS.includes(userEmail)) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch {
        // invalid cookie json, continue
      }
    }

    if (role && role !== "admin" && !CEO_EMAILS.includes(email)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
