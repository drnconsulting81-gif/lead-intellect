import { NextResponse } from "next/server";
import { getEmailLogs } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin) {
      return auth.errorResponse || NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const emailLogs = await getEmailLogs();
    return NextResponse.json({
      success: true,
      emailLogs,
      count: emailLogs.length,
    });
  } catch (error) {
    console.error("Error fetching email logs:", error);
    return NextResponse.json(
      { error: "Failed to retrieve email logs." },
      { status: 500 }
    );
  }
}
