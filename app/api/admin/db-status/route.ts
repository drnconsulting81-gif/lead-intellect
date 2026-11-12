import { NextResponse } from "next/server";
import { getDatabaseDiagnostics } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin) {
      return auth.errorResponse || NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const diagnostics = await getDatabaseDiagnostics();
    return NextResponse.json(diagnostics);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
