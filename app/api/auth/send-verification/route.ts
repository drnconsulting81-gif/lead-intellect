import { NextResponse } from "next/server";
import { saveVerificationCode } from "@/lib/db";
import { sendVerificationCodeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, purpose = "signup", name, planName } = body;

    const cleanEmail = (email || "").toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (purpose !== "signup" && purpose !== "upgrade") {
      return NextResponse.json(
        { error: "Invalid verification purpose. Expected 'signup' or 'upgrade'." },
        { status: 400 }
      );
    }

    // Generate secure 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Persist code with 10-minute validity
    await saveVerificationCode(cleanEmail, code, purpose, planName);

    // Dispatch email
    const emailResult = await sendVerificationCodeEmail({
      email: cleanEmail,
      name,
      code,
      purpose,
      planName,
    });

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please enter it to continue.`,
      email: cleanEmail,
      mode: emailResult.mode,
      // Provide developer hint for local evaluation/testing if SMTP is in simulated mode
      ...(process.env.NODE_ENV !== "production" || emailResult.mode === "simulated"
        ? { testCode: code }
        : {}),
    });
  } catch (error) {
    console.error("Error in /api/auth/send-verification:", error);
    return NextResponse.json(
      { error: "Failed to dispatch verification code." },
      { status: 500 }
    );
  }
}

