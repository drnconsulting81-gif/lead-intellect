import { NextResponse } from "next/server";
import { saveContact, getContacts } from "@/lib/db";
import { sendLeadNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, company, phone, subject, message } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full Name, Email, and Message are required." },
        { status: 400 }
      );
    }

    const saved = await saveContact({
      fullName,
      email,
      company: company || "",
      phone: phone || "",
      subject: subject || "General Inquiry",
      message,
    });

    // Asynchronously dispatch notification
    sendLeadNotification({
      type: "contact",
      fullName,
      email,
      companyName: company || "",
      comments: `[${subject || "General Inquiry"}] ${message}`,
      phone: phone || "",
    }).catch((err) => console.error("Notification dispatch failed:", err));

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully. We will reply within 2 hours.",
      contact: saved,
    });
  } catch (error) {
    console.error("Error in /api/contact:", error);
    return NextResponse.json(
      { error: "Internal server error sending message." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const contacts = await getContacts();
  return NextResponse.json({ contacts });
}
