import { NextResponse } from "next/server";
import { findUserByEmail, getCreditHistoryByUser } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail") || "guest@leadintellect.ai";

    const user = await findUserByEmail(userEmail);
    const history = await getCreditHistoryByUser(userEmail);

    const balance = user ? (user.credits ?? (user.role === "admin" ? 999999 : 100)) : 100;

    return NextResponse.json({
      success: true,
      credits: balance,
      userEmail,
      history,
    });
  } catch (err) {
    console.error("Error in GET /api/credits:", err);
    return NextResponse.json({ error: "Failed to fetch credit information." }, { status: 500 });
  }
}
