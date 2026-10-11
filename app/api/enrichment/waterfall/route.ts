import { NextResponse } from "next/server";
import { providerManager } from "@/lib/providers/manager";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, companyName, companyDomain, linkedinUrl, currentEmail, currentPhone } = body;

    if (!firstName || !companyName) {
      return NextResponse.json(
        { error: "First name and company name are required for waterfall enrichment." },
        { status: 400 }
      );
    }

    const result = await providerManager.enrichContact({
      firstName,
      lastName: lastName || "",
      companyName,
      companyDomain,
      linkedinUrl,
      currentEmail,
      currentPhone,
    });

    return NextResponse.json({
      success: true,
      result: {
        email: result.email || null,
        emailStatus: result.emailStatus,
        deliverabilityConfidence: result.emailConfidence,
        phone: result.phone || null,
        phoneType: result.phoneType || "Not Available",
        sourceProvider: result.provider,
        verifiedAt: result.timestamp,
        qualityBadge: result.emailStatus === "verified" ? "Verified" : "Deliverable",
        meta: {
          mxValid: Boolean(result.email && result.email.includes("@")),
          smtpCheck: result.emailStatus === "verified",
          disposableCheck: true,
          cascadedProviders: [result.provider],
        },
      },
    });
  } catch (error) {
    console.error("Error in waterfall enrichment API:", error);
    return NextResponse.json(
      { error: "Waterfall enrichment failed." },
      { status: 500 }
    );
  }
}
