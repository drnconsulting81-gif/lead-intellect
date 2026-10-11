import { NextResponse } from "next/server";
import { logExport, deductUserCredit } from "@/lib/db";
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

    const email = userEmail || "guest@leadintellect.ai";

    if (!Array.isArray(prospectIds) || prospectIds.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one record to export." },
        { status: 400 }
      );
    }

    // Server-side credit deduction (1 credit per export batch)
    const deduction = await deductUserCredit(
      email,
      1,
      "export",
      `Exported ${prospectIds.length} records to CSV`,
      prospectIds.slice(0, 5).join(",")
    );

    if (!deduction.success) {
      return NextResponse.json(
        {
          error: "Insufficient credits to perform CSV export. Please upgrade your plan.",
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

    const selected = all.filter((p) => prospectIds.includes(p.id));

    // Construct CSV
    const headers = [
      "ID",
      "Full Name",
      "First Name",
      "Last Name",
      "Job Title",
      "Seniority",
      "Department",
      "Company",
      "Website",
      "Industry",
      "Employees",
      "Revenue Range",
      "Location",
      "City",
      "State",
      "Country",
      "Work Email",
      "Email Verification Status",
      "Phone",
      "Phone Type",
      "LinkedIn URL",
      "ICP Fit Score",
      "ICP Tier",
      "Data Provenance",
    ];

    const lines = [headers.join(",")];

    for (const p of selected) {
      const row = [
        escapeCsvValue(p.id),
        escapeCsvValue(p.name),
        escapeCsvValue(p.firstName),
        escapeCsvValue(p.lastName),
        escapeCsvValue(p.title),
        escapeCsvValue(p.seniority),
        escapeCsvValue(p.department),
        escapeCsvValue(p.company),
        escapeCsvValue(p.website),
        escapeCsvValue(p.industry),
        escapeCsvValue(p.employees),
        escapeCsvValue(p.revenueRange),
        escapeCsvValue(p.location),
        escapeCsvValue(p.city),
        escapeCsvValue(p.state),
        escapeCsvValue(p.country),
        escapeCsvValue(p.email),
        escapeCsvValue(p.emailStatus),
        escapeCsvValue(p.phone),
        escapeCsvValue(p.phoneType),
        escapeCsvValue(p.linkedin),
        escapeCsvValue(p.icpScore),
        escapeCsvValue(p.icpTier),
        escapeCsvValue(p.verificationSource || p.source),
      ];
      lines.push(row.join(","));
    }

    const csvOutput = lines.join("\r\n");

    // Log the export
    await logExport({
      userEmail: email,
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
