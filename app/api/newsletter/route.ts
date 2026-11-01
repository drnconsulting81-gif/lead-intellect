import { NextResponse } from "next/server";
import { isMongoConfigured, getMongoDb } from "@/lib/mongodb";
import { sendLeadNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, fullName, company, interest } = body;

    const cleanEmail = (email || "").toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid corporate or work email address is required." },
        { status: 400 }
      );
    }

    const subscriber = {
      id: "sub_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      email: cleanEmail,
      fullName: (fullName || "").trim(),
      company: (company || "").trim(),
      interest: interest || "Weekly B2B Sales Intelligence & Intent Playbooks",
      source: "LeadIntellect Weekly Editorial Newsletter",
      createdAt: new Date().toISOString(),
      active: true,
    };

    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          await db.collection("newsletter_subscribers").updateOne(
            { email: cleanEmail },
            { $set: subscriber },
            { upsert: true }
          );
        }
      } catch (err) {
        console.warn("MongoDB newsletter insert failed, continuing:", err);
      }
    }

    // Dispatch lead notification
    sendLeadNotification({
      type: "contact",
      fullName: fullName || cleanEmail.split("@")[0],
      email: cleanEmail,
      companyName: company || "N/A",
      comments: `📬 New Newsletter Subscriber! Joined weekly B2B intent editorial dispatch. Interest: ${interest || "Sales Intelligence"}`,
    }).catch((err) => console.error("Newsletter notification error:", err));

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing! You are now enrolled in our weekly executive dispatch.",
      subscriber,
    });
  } catch (error) {
    console.error("Error in /api/newsletter:", error);
    return NextResponse.json(
      { error: "Failed to process newsletter subscription." },
      { status: 500 }
    );
  }
}
