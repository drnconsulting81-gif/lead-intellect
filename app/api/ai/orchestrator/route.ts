import { NextResponse } from "next/server";
import { executeIntelligenceOrchestrator, buildExplainableOpportunityBrief, runQualificationAgent, runVerificationAgent } from "@/lib/orchestrator";
import { buildDeterministicSignalForProspect } from "@/lib/intent-store";
import fs from "fs";
import path from "path";

let cachedProspects: any[] | null = null;
function getProspectById(id: string) {
  if (!cachedProspects) {
    try {
      const filePath = path.join(process.cwd(), "data", "prospects.json");
      if (fs.existsSync(filePath)) {
        cachedProspects = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      }
    } catch (err) {
      console.error("Error reading prospects.json:", err);
    }
  }
  return (cachedProspects || []).find((p: any) => p.id === id);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { query = "", filters = {}, prospectId, action = "orchestrate", limit = 20 } = body;

    // Single Prospect Opportunity Brief Analysis
    if (action === "brief" && prospectId) {
      const prospect = getProspectById(prospectId);
      if (!prospect) {
        return NextResponse.json({ error: "Prospect not found." }, { status: 404 });
      }

      const signal = buildDeterministicSignalForProspect(prospect);
      const qualification = runQualificationAgent(prospect);
      const verification = runVerificationAgent(prospect);
      const brief = buildExplainableOpportunityBrief(prospect, signal, qualification, verification);

      return NextResponse.json({
        success: true,
        prospectId,
        brief,
        signal,
        scores: {
          icpScore: qualification.icpScore,
          intentScore: signal.confidence,
          contactConfidence: verification.contactConfidence,
          signalFreshnessDays: signal.freshnessDays,
          compositeScore: Math.round(
            qualification.icpScore * 0.45 + signal.confidence * 0.35 + verification.contactConfidence * 0.2
          ),
        },
      });
    }

    // Full Intelligence Orchestration across database and specialist agents
    const result = await executeIntelligenceOrchestrator(query, filters, limit);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/orchestrator:", error);
    return NextResponse.json(
      { error: "Internal server error executing Intelligence Orchestrator.", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const prospectId = searchParams.get("prospectId");
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));

    if (prospectId) {
      const prospect = getProspectById(prospectId);
      if (!prospect) {
        return NextResponse.json({ error: "Prospect not found." }, { status: 404 });
      }

      const signal = buildDeterministicSignalForProspect(prospect);
      const qualification = runQualificationAgent(prospect);
      const verification = runVerificationAgent(prospect);
      const brief = buildExplainableOpportunityBrief(prospect, signal, qualification, verification);

      return NextResponse.json({
        success: true,
        prospectId,
        brief,
        signal,
      });
    }

    const result = await executeIntelligenceOrchestrator(query, {}, limit);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error in GET /api/ai/orchestrator:", error);
    return NextResponse.json(
      { error: "Internal server error executing Intelligence Orchestrator." },
      { status: 500 }
    );
  }
}
