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
        escapeCsvValue(email),
        escapeCsvValue(p.facebookUrl || ""),
        escapeCsvValue(p.twitterUrl || ""),
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
