import { NextResponse } from "next/server";
import { deductUserCredit } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, prospectId } = body;

    if (!prospectId) {
      return NextResponse.json({ error: "Prospect ID required." }, { status: 400 });
    }

    const emailToCharge = userEmail || "demo.user@leadintellect.ai";
    const deduction = await deductUserCredit(emailToCharge, 1);

    if (!deduction.success) {
      return NextResponse.json(
        {
          error: "Insufficient credits. Please upgrade your plan to unlock more contacts.",
          remainingCredits: deduction.remainingCredits,
        },
        { status: 402 }
      );
    }

    // Lookup full prospect contact from dataset
    const filePath = path.join(process.cwd(), "data", "prospects.json");
    if (fs.existsSync(filePath)) {
      const all = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const found = all.find((p: any) => p.id === prospectId);
      if (found) {
        return NextResponse.json({
          success: true,
          email: found.email,
          phone: found.phone || "+1 (415) 890-4100",
          linkedin: found.linkedin,
          remainingCredits: deduction.remainingCredits,
        });
      }
    }

    return NextResponse.json({
      success: true,
      email: "verified.lead@company.com",
      phone: "+1 (415) 890-4100",
      linkedin: "https://linkedin.com",
      remainingCredits: deduction.remainingCredits,
    });
  } catch (err) {
    console.error("Error in /api/prospects/reveal:", err);
    return NextResponse.json(
      { error: "Failed to reveal prospect details." },
      { status: 500 }
    );
  }
}
