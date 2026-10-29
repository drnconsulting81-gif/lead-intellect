import { NextResponse } from "next/server";
import { verifyOtpCode } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, purpose = "signup" } = body;

    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanCode = (code || "").trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!cleanCode) {
      return NextResponse.json(
        { error: "Verification code is required." },
        { status: 400 }
      );
    }

    const result = await verifyOtpCode(cleanEmail, cleanCode, purpose);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code successfully confirmed.",
    });
  } catch (error) {
    console.error("Error in /api/auth/verify-code:", error);
    return NextResponse.json(
      { error: "Failed to verify code." },
      { status: 500 }
    );
  }
}

