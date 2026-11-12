import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow /admin to load so administrators can access the admin login form
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
