import { NextResponse } from "next/server";
import { getUserUnlockedProspects, isCeoEmail } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = (searchParams.get("userEmail") || "").toLowerCase().trim();

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email parameter is required." },
        { status: 400 }
      );
    }

    const prospects = await getUserUnlockedProspects(userEmail);

    const formatted = prospects.map((p) => ({
      ...p,
      isRevealed: true,
      isUnlocked: true,
      isLocked: false,
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      prospects: formatted,
    });
  } catch (err) {
    console.error("Error in /api/prospects/unlocked:", err);
    return NextResponse.json(
      { error: "Failed to fetch unlocked leads." },
      { status: 500 }
    );
  }
}

