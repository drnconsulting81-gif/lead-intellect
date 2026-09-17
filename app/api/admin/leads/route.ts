import { NextResponse } from "next/server";
import { getLeads, updateLeadStatus, LeadStatus } from "@/lib/db";

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json({ leads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
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
