import { NextResponse } from "next/server";
import { addSuppression, isEmailSuppressed } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, reason } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required for suppression request." },
        { status: 400 }
      );
    }

    const record = await addSuppression(email, reason || "Individual opt-out request");
    return NextResponse.json({
      success: true,
      message: `Email ${email} has been added to the global suppression registry. It will be excluded from all future discovery and export operations.`,
      record,
    });
  } catch (err) {
    console.error("Error in /api/privacy/suppress:", err);
    return NextResponse.json({ error: "Failed to process suppression request." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email query param required." }, { status: 400 });
    }

    const suppressed = await isEmailSuppressed(email);
    return NextResponse.json({
      success: true,
      email,
      isSuppressed: suppressed,
    });
  } catch (err) {
    console.error("Error in GET /api/privacy/suppress:", err);
    return NextResponse.json({ error: "Failed to query suppression." }, { status: 500 });
  }
}
