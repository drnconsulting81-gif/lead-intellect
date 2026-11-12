import { NextResponse } from "next/server";
import { findUserByEmail, isCeoEmail } from "./db";

export interface AdminAuthResult {
  isAdmin: boolean;
  userEmail?: string;
  userRole?: string;
  errorResponse?: NextResponse;
}

/**
 * Validates whether the incoming HTTP request is authenticated as an Admin or CEO.
 * Checks:
 * 1. x-user-email or x-admin-email header
 * 2. Authorization: Bearer <email>
 * 3. URL search parameter ?userEmail=... or ?adminEmail=...
 * 4. Request body JSON userEmail (if provided)
 */
export async function verifyAdminRequest(
  req: Request,
  bodyEmail?: string
): Promise<AdminAuthResult> {
  let email = (bodyEmail || "").trim();

  if (!email) {
    email = (req.headers.get("x-admin-email") || req.headers.get("x-user-email") || "").trim();
  }

  if (!email) {
    const authHeader = req.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      email = authHeader.replace("Bearer ", "").trim();
    }
  }

  if (!email) {
    try {
      const url = new URL(req.url);
      email = (url.searchParams.get("adminEmail") || url.searchParams.get("userEmail") || "").trim();
    } catch {
      // ignore URL parsing error
    }
  }

  const cleanEmail = email.toLowerCase();

  if (!cleanEmail) {
    return {
      isAdmin: false,
      errorResponse: NextResponse.json(
        {
          error: "Unauthorized: Administrative privileges required. Admin credentials missing.",
          code: "ADMIN_AUTH_REQUIRED",
        },
        { status: 403 }
      ),
    };
  }

  // Check CEO email list
  if (isCeoEmail(cleanEmail)) {
    return {
      isAdmin: true,
      userEmail: cleanEmail,
      userRole: "admin",
    };
  }

  // Check user database record
  try {
    const user = await findUserByEmail(cleanEmail);
    if (user && (user.role === "admin" || isCeoEmail(user.email))) {
      return {
        isAdmin: true,
        userEmail: cleanEmail,
        userRole: "admin",
      };
    }

    return {
      isAdmin: false,
      userEmail: cleanEmail,
      userRole: user?.role || "customer",
      errorResponse: NextResponse.json(
        {
          error: `Forbidden: User role '${user?.role || "customer"}' does not have administrative permissions for this resource.`,
          code: "ADMIN_FORBIDDEN",
        },
        { status: 403 }
      ),
    };
  } catch (err) {
    console.error("Error verifying admin request:", err);
    return {
      isAdmin: false,
      errorResponse: NextResponse.json(
        { error: "Internal server error during authorization check." },
        { status: 500 }
      ),
    };
  }
}
