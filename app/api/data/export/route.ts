import { NextResponse } from "next/server";
import { logExport, deductUserCredit, findUserByEmail, isUserOnPaidPlan, isCeoEmail, getUserUnlockedProspectIds } from "@/lib/db";
import fs from "fs";
import path from "path";

function escapeCsvValue(val: unknown): string {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, prospectIds, exportType = "people" } = body;

    const cleanEmail = (userEmail || "").toLowerCase().trim();
    if (!cleanEmail || cleanEmail === "guest@leadintellect.ai") {
      return NextResponse.json(
        {
          error: "Authentication and an active subscription are required to download database records. Please sign in and upgrade your plan.",
          paymentRequired: true,
        },
        { status: 401 }
      );
    }

    // 1. Verify user's role and authorization
    const user = await findUserByEmail(cleanEmail);
    const isPaid = isUserOnPaidPlan(user);
    const isCeo = isCeoEmail(cleanEmail);
    const isAdmin = isCeo || user?.role === "admin";

    // Non-admin customers must have unlocked leads to export
    let targetExportIds: string[] = Array.isArray(prospectIds) ? prospectIds.map(String) : [];

    if (!isAdmin) {
      const unlockedList = await getUserUnlockedProspectIds(cleanEmail);
      const unlockedSet = new Set(unlockedList.map(String));

      // Strictly restrict non-admin export to unlocked leads only
      if (targetExportIds.length === 0) {
        targetExportIds = Array.from(unlockedSet);
      } else {
        targetExportIds = targetExportIds.filter((id) => unlockedSet.has(id));
      }

      if (targetExportIds.length === 0) {
        return NextResponse.json(
          {
            error: "Access denied. Non-admin customers can only export leads they have unlocked. Please unlock contacts with your credits before downloading.",
            unlockedCount: unlockedSet.size,
          },
          { status: 403 }
        );
      }
    } else {
      if (targetExportIds.length === 0) {
        return NextResponse.json(
          { error: "Please select at least one record to export." },
          { status: 400 }
        );
      }
    }

    // Server-side credit deduction (1 credit per export batch for non-admin if balance permits)
    const deduction = await deductUserCredit(
      cleanEmail,
      isAdmin ? 0 : 1,
      "export",
      `Exported ${targetExportIds.length} unlocked records to CSV`,
      targetExportIds.slice(0, 5).join(",")
    );

    if (!deduction.success && !isAdmin && !isPaid) {
      return NextResponse.json(
        {
          error: "You're out of credits. Upgrade your plan to export more leads.",
          remainingCredits: deduction.remainingCredits,
        },
        { status: 402 }
      );
    }

    // Load prospects
    const filePath = path.join(process.cwd(), "data", "prospects.json");
    let all: Array<Record<string, unknown> & { id: string }> = [];
    if (fs.existsSync(filePath)) {
      all = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    const selected = all.filter((p) => targetExportIds.includes(String(p.id)));

    // Construct CSV with all 36 columns matching Database Template.xlsx
    const headers = [
      "Company Name",
      "Full Name",
      "First Name",
      "Last Name",
      "Title",
      "Seniority",
      "Departments",
      "Job Functions",
      "Reports To",
      "Official Email ID",
      "Personal Email ID",
      "Corporate Phone",
      "Direct Phone",
      "Mobile Phone",
      "Address 1",
      "Address 2",
      "City",
      "State",
      "Postal Code",
      "Country",
      "LinkedIn URL",
      "Website",
      "Corp HQ Phone",
      "Industry",
      "Revenue (Mil)",
      "HQ Address 1",
      "HQ Address 2",
      "HQ City",
      "HQ State",
      "HQ Postal Code",
      "HQ Country",
      "Ownership",
      "Company Linkedin URL",
      "Contact Owner",
      "Facebook URL",
      "Twitter URL",
    ];

    const lines = [headers.join(",")];

    for (const p of selected) {
      const row = [
        escapeCsvValue(p.company),
        escapeCsvValue(p.name),
        escapeCsvValue(p.firstName),
        escapeCsvValue(p.lastName),
        escapeCsvValue(p.title),
        escapeCsvValue(p.seniority),
        escapeCsvValue(p.department || p.departments),
        escapeCsvValue(p.jobFunctions || p.title),
        escapeCsvValue(p.reportsTo || ""),
        escapeCsvValue(p.email),
        escapeCsvValue(p.personalEmail || ""),
        escapeCsvValue(p.corpPhone || p.phone),
        escapeCsvValue(p.directPhone || p.phone),
        escapeCsvValue(p.mobilePhone || p.phone),
        escapeCsvValue(p.address1 || p.location || ""),
        escapeCsvValue(p.address2 || ""),
        escapeCsvValue(p.city),
        escapeCsvValue(p.state),
        escapeCsvValue(p.postalCode || ""),
        escapeCsvValue(p.country),
        escapeCsvValue(p.linkedin),
        escapeCsvValue(p.website),
        escapeCsvValue(p.corpHqPhone || p.phone),
        escapeCsvValue(p.industry),
        escapeCsvValue(p.revenueMil || p.revenueRange || ""),
        escapeCsvValue(p.hqAddress1 || ""),
        escapeCsvValue(p.hqAddress2 || ""),
        escapeCsvValue(p.hqCity || p.city),
        escapeCsvValue(p.hqState || p.state),
        escapeCsvValue(p.hqPostalCode || ""),
        escapeCsvValue(p.hqCountry || p.country),
        escapeCsvValue(p.ownership || "Private"),
        escapeCsvValue(p.companyLinkedin || p.linkedin || ""),
        escapeCsvValue(cleanEmail),
        escapeCsvValue(p.facebookUrl || ""),
        escapeCsvValue(p.twitterUrl || ""),
      ];
      lines.push(row.join(","));
    }

    const csvOutput = lines.join("\r\n");

    // Log the export
    await logExport({
      userEmail: cleanEmail,
      recordCount: selected.length,
      exportType,
      format: "csv",
    });

    return NextResponse.json({
      success: true,
      recordCount: selected.length,
      csvContent: csvOutput,
      filename: `leadintellect_export_${new Date().toISOString().split("T")[0]}.csv`,
      remainingCredits: deduction.remainingCredits,
    });
  } catch (err) {
    console.error("Error in /api/data/export:", err);
    return NextResponse.json({ error: "Failed to generate CSV export." }, { status: 500 });
  }
}
