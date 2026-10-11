import { NextResponse } from "next/server";
import { providerManager } from "@/lib/providers/manager";
import { deductUserCredit } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, userEmail, provider } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required for verification." },
        { status: 400 }
      );
    }

    const emailToCharge = userEmail || "guest@leadintellect.ai";

    const deduction = await deductUserCredit(
      emailToCharge,
      1,
      "verification",
      `Verified email address: ${email}`,
      email
    );

    if (!deduction.success) {
      return NextResponse.json(
        {
          error: "Insufficient credits to perform verification.",
          remainingCredits: deduction.remainingCredits,
        },
        { status: 402 }
      );
    }

    const verification = await providerManager.verifyEmail(email, provider);

    return NextResponse.json({
      success: true,
      verification,
      remainingCredits: deduction.remainingCredits,
    });
  } catch (err) {
    console.error("Error in /api/verification:", err);
    return NextResponse.json({ error: "Email verification failed." }, { status: 500 });
  }
}
