import { NextResponse } from "next/server";
import { executeWaterfallEnrichment } from "@/lib/enrichment-waterfall";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, companyName, companyDomain, linkedinUrl } = body;

    if (!firstName || !companyName) {
      return NextResponse.json(
        { error: "First name and company name are required for waterfall enrichment." },
        { status: 400 }
      );
    }

    const result = await executeWaterfallEnrichment({
      firstName,
      lastName: lastName || "",
      companyName,
      companyDomain,
      linkedinUrl,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Error in waterfall enrichment API:", error);
    return NextResponse.json(
      { error: "Waterfall enrichment failed." },
      { status: 500 }
    );
  }
}
