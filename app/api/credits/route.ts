import { NextResponse } from "next/server";
import { findUserByEmail, getCreditHistoryByUser, addOrAdjustUserCredit, isCeoEmail } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail") || "guest@leadintellect.ai";
    const cleanEmail = userEmail.toLowerCase().trim();

    const isCeo = isCeoEmail(cleanEmail);
    const user = await findUserByEmail(cleanEmail);
    const history = await getCreditHistoryByUser(cleanEmail);

    const balance = user ? (typeof user.credits === "number" ? user.credits : 99) : 99;

    return NextResponse.json({
      success: true,
      credits: balance,
      userEmail: cleanEmail,
      isCeo,
      history,
    });
  } catch (err) {
    console.error("Error in GET /api/credits:", err);
    return NextResponse.json({ error: "Failed to fetch credit information." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, amount, action = "bonus", description = "Onboarding task credit" } = body;

    const cleanEmail = (userEmail || "guest@leadintellect.ai").toLowerCase().trim();
    const creditDelta = Number(amount) || 0;

    const result = await addOrAdjustUserCredit(cleanEmail, creditDelta, action, description);

    return NextResponse.json({
      success: true,
      remainingCredits: result.remainingCredits,
      userEmail: cleanEmail,
      delta: creditDelta,
    });
  } catch (err) {
    console.error("Error in POST /api/credits:", err);
    return NextResponse.json({ error: "Failed to update credits." }, { status: 500 });
  }
}
