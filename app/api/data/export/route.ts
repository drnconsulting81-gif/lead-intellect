import { NextResponse } from "next/server";
import { logExport, deductUserCredit, findUserByEmail, isUserOnPaidPlan, isCeoEmail, getUserUnlockedProspectIds } from "@/lib/db";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function escapeCsvValue(val: unknown): string {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, prospectIds, exportType = "people", autoUnlock = false } = body;

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

      // If no specific IDs passed, export all user's unlocked leads
      if (targetExportIds.length === 0) {
        targetExportIds = Array.from(unlockedSet);
      }

      if (targetExportIds.length === 0) {
        return NextResponse.json(
          {
            error: "No leads selected or unlocked. Please select contacts or unlock leads with your credits before downloading.",
            unlockedCount: 0,
          },
          { status: 400 }
        );
      }

      // Check for locked leads in the target export list
      const lockedIds = targetExportIds.filter((id) => !unlockedSet.has(id));

      if (lockedIds.length > 0) {
        const availableCredits = user?.credits ?? 0;
        // If user requested autoUnlock or has sufficient credits to unlock these leads:
        if (autoUnlock || availableCredits >= lockedIds.length) {
          for (const lid of lockedIds) {
            await deductUserCredit(
              cleanEmail,
              1,
              "reveal",
              `Unlocked contact during CSV export`,
              lid
            );
            unlockedSet.add(lid);
          }
        } else {
          return NextResponse.json(
            {
              error: `Non-admin customers can only export leads they have unlocked. Please unlock contacts with your credits before downloading. You need ${lockedIds.length} credits, but only have ${availableCredits} credits.`,
              neededCredits: lockedIds.length,
              availableCredits,
            },
            { status: 403 }
          );
        }
      }

      // Restrict export strictly to unlocked contacts
      targetExportIds = targetExportIds.filter((id) => unlockedSet.has(id));
    } else {
      if (targetExportIds.length === 0) {
        return NextResponse.json(
          { error: "Please select at least one record to export." },
          { status: 400 }
        );
      }
    }

    // Load prospects from MongoDB Atlas or local fallback
    let selected: Array<Record<string, unknown> & { id: string }> = [];

    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          const prospectsColl = db.collection("prospects");
          const mongoDocs = await prospectsColl
            .find({
              $or: [
                { id: { $in: targetExportIds } },
                { id: { $in: targetExportIds.map(String) } },
              ],
            } as any)
            .toArray();

          if (mongoDocs && mongoDocs.length > 0) {
            selected = mongoDocs.map((doc) => ({
              ...doc,
              id: String(doc.id || doc._id),
            })) as any;
          }
        }
      } catch (mongoErr) {
        console.warn("MongoDB export fetch failed, falling back to local files:", mongoErr);
      }
    }

    // Local fallback if MongoDB Atlas is not configured or missing some records
    if (selected.length < targetExportIds.length) {
      const foundIds = new Set(selected.map((s) => String(s.id)));
      const missingIds = targetExportIds.filter((id) => !foundIds.has(id));

      const filePath = path.join(process.cwd(), "data", "prospects.json");
      let all: Array<Record<string, unknown> & { id: string }> = [];
      if (fs.existsSync(filePath)) {
        try {
          all = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        } catch (e) {}
      } else {
        const dataDir = path.join(process.cwd(), "data");
        if (fs.existsSync(dataDir)) {
          const parts = fs.readdirSync(dataDir).filter((f) => f.startsWith("prospects_part") && f.endsWith(".json"));
          for (const p of parts.sort()) {
            try {
              const raw = fs.readFileSync(path.join(dataDir, p), "utf-8");
              all = all.concat(JSON.parse(raw));
            } catch (e) {}
          }
        }
      }

      const localFound = all.filter((p) => missingIds.includes(String(p.id)));
      selected = selected.concat(localFound);
    }

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

    const refreshedUser = await findUserByEmail(cleanEmail);

    return NextResponse.json({
      success: true,
      recordCount: selected.length,
      csvContent: csvOutput,
      filename: `leadintellect_export_${new Date().toISOString().split("T")[0]}.csv`,
      remainingCredits: refreshedUser?.credits ?? user?.credits ?? 0,
      unlockedProspects: selected.map((p) => ({
        id: p.id,
        email: p.email,
        phone: p.phone,
        directPhone: p.directPhone,
        linkedin: p.linkedin,
      })),
    });
  } catch (err) {
    console.error("Error in /api/data/export:", err);
    return NextResponse.json({ error: "Failed to generate CSV export." }, { status: 500 });
  }
}
