import { NextResponse } from "next/server";
import { getLeads, updateLeadStatus, LeadStatus } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin) {
      return auth.errorResponse || NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const leads = await getLeads();
    return NextResponse.json({ leads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin) {
      return auth.errorResponse || NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Lead id and status are required." },
        { status: 400 }
      );
    }

    const updated = await updateLeadStatus(id, status as LeadStatus);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Lead status updated to ${status}.` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
