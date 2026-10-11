import { NextResponse } from "next/server";
import { providerManager } from "@/lib/providers/manager";
import { deductUserCredit } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, prospectIds, preferredProvider } = body;

    if (!Array.isArray(prospectIds) || prospectIds.length === 0) {
      return NextResponse.json(
        { error: "At least one prospect ID is required for enrichment." },
        { status: 400 }
      );
    }

    const emailToCharge = userEmail || "guest@leadintellect.ai";
    const totalCost = prospectIds.length;

    // Check credit allowance
    const deduction = await deductUserCredit(
      emailToCharge,
      totalCost,
      "enrichment",
      `Bulk enrichment of ${totalCost} prospect(s)`,
      prospectIds.join(",")
    );

    if (!deduction.success) {
      return NextResponse.json(
        {
          error: `Insufficient credits. This enrichment operation requires ${totalCost} credit(s), but your balance is ${deduction.remainingCredits}.`,
          remainingCredits: deduction.remainingCredits,
        },
        { status: 402 }
      );
    }

    // Load prospects to enrich
    const filePath = path.join(process.cwd(), "data", "prospects.json");
    let allProspects: Array<Record<string, string> & { id: string }> = [];
    if (fs.existsSync(filePath)) {
      allProspects = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    const enrichedResults = [];

    for (const id of prospectIds) {
      const prospect = allProspects.find((p) => p.id === id);
      if (!prospect) continue;

      const enrichmentResult = await providerManager.enrichContact(
        {
          firstName: prospect.firstName,
          lastName: prospect.lastName,
          companyName: prospect.company,
          companyDomain: prospect.domain,
          title: prospect.title,
          currentEmail: prospect.email,
          currentPhone: prospect.phone,
          linkedinUrl: prospect.linkedin,
        },
        preferredProvider
      );

      enrichedResults.push({
        id: prospect.id,
        name: prospect.name,
        company: prospect.company,
        email: enrichmentResult.email || prospect.email,
        emailStatus: enrichmentResult.emailStatus || prospect.emailStatus,
        emailConfidence: enrichmentResult.emailConfidence || prospect.emailConfidence,
        phone: enrichmentResult.phone || prospect.phone,
        phoneType: enrichmentResult.phoneType || prospect.phoneType,
        provider: enrichmentResult.provider,
        verifiedAt: enrichmentResult.timestamp,
        updatedFields: enrichmentResult.updatedFields,
      });
    }

    return NextResponse.json({
      success: true,
      enrichedCount: enrichedResults.length,
      results: enrichedResults,
      remainingCredits: deduction.remainingCredits,
    });
  } catch (err) {
    console.error("Error in /api/enrichment:", err);
    return NextResponse.json({ error: "Enrichment operation failed." }, { status: 500 });
  }
}
