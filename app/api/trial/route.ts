import { NextResponse } from "next/server";
import { saveLead, getLeads } from "@/lib/db";
import { sendLeadNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, title, companyName, email, phone, comments } = body;

    if (!fullName || !companyName || !email) {
      return NextResponse.json(
        { error: "Full Name, Company Name, and Work Email are required." },
        { status: 400 }
      );
    }

    const saved = await saveLead({
      type: "trial",
      fullName,
      title: title || "",
      companyName,
      email,
      phone: phone || "",
      comments: comments || "",
      status: "new",
    });

    // Asynchronously dispatch notification / CRM webhook
    sendLeadNotification({
      type: "trial",
      fullName,
      email,
      companyName,
      title: title || "",
      phone: phone || "",
      comments: comments || "",
    }).catch((err) => console.error("Notification dispatch failed:", err));

    return NextResponse.json({
      success: true,
      message: "14-day free trial activated! Check your email for login access.",
      lead: saved,
    });
  } catch (error) {
    console.error("Error in /api/trial:", error);
    return NextResponse.json(
      { error: "Internal server error activating trial." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const leads = await getLeads();
  const trialLeads = leads.filter((l) => l.type === "trial");
  return NextResponse.json({ leads: trialLeads });
}
