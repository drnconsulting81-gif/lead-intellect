import { NextResponse } from "next/server";
import { deductUserCredit } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, prospectId } = body;

    if (!prospectId) {
      return NextResponse.json({ error: "Prospect ID is required." }, { status: 400 });
    }

    const emailToCharge = userEmail || "guest@leadintellect.ai";

    // Lookup prospect first to verify existence
    const filePath = path.join(process.cwd(), "data", "prospects.json");
    let foundProspect: Record<string, unknown> | null = null;
    if (fs.existsSync(filePath)) {
      const all: Record<string, unknown>[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      foundProspect = all.find((p) => p.id === prospectId) || null;
    }

    if (!foundProspect) {
      return NextResponse.json(
        { error: "Prospect record not found in database." },
        { status: 404 }
      );
    }

    // Deduct credit server-side
    const deduction = await deductUserCredit(
      emailToCharge,
      1,
      "reveal",
      `Revealed contact details for ${foundProspect.name} (${foundProspect.company})`,
      prospectId
    );

    if (!deduction.success) {
      return NextResponse.json(
        {
          error: "Insufficient credits. Your account has reached its credit allowance limit.",
          remainingCredits: deduction.remainingCredits,
        },
        { status: 402 }
      );
    }

    // Return truthful contact information
    return NextResponse.json({
      success: true,
      email: foundProspect.email || "",
      emailStatus: foundProspect.emailStatus || "unknown",
      emailConfidence: foundProspect.emailConfidence || 0,
      verificationSource: foundProspect.verificationSource || "Sourced Record",
      phone: foundProspect.phone || "",
      phoneType: foundProspect.phoneType || "Not Available",
      linkedin: foundProspect.linkedin || "",
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
