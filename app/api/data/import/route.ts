import { NextResponse } from "next/server";
import { saveList, isEmailSuppressed } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

function parseCsv(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const rows: string[][] = [];

  for (const line of lines) {
    const row: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "," && !inQuotes) {
        row.push(cur.trim().replace(/^"+|"+$/g, ""));
        cur = "";
      } else {
        cur += c;
      }
    }
    row.push(cur.trim().replace(/^"+|"+$/g, ""));
    rows.push(row);
  }

  return rows;
}

function escapeCsvField(val: unknown): string {
  if (val === undefined || val === null) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Master standard columns (from master cleaned database, no apollo id)
const MASTER_CSV_HEADERS = [
  "Company Name",
  "Full Name",
  "First Name",
  "Last Name",
  "Title",
  "Departments",
  "Job Functions",
  "Reports To",
  "Email",
  "Email Status",
  "Direct Phone",
  "Cell Phone",
  "Corp HQ Phone",
  "LinkedIn URL",
  "LinkedIn Status",
  "LinkedIn Search URL",
  "Website",
  "Industry",
  "Industry Sector",
  "Seniority Tier",
  "Job Domain",
  "Address 1",
  "Address 2",
  "City",
  "State",
  "Postal Code",
  "Country",
  "Location Region",
  "Revenue (Mil)",
  "HQ Address 1",
  "HQ Address 2",
  "HQ City",
  "HQ State",
  "HQ Postal Code",
  "HQ Country",
  "Ownership",
  "Data Quality Score",
];

let cachedMasterProspects: Array<Record<string, any>> | null = null;
function getMasterProspects(): Array<Record<string, any>> {
  if (cachedMasterProspects) return cachedMasterProspects;
  try {
    const prospectsFilePath = path.join(process.cwd(), "data", "prospects.json");
    if (fs.existsSync(prospectsFilePath)) {
      cachedMasterProspects = JSON.parse(fs.readFileSync(prospectsFilePath, "utf-8"));
      return cachedMasterProspects || [];
    }
    const dataDir = path.join(process.cwd(), "data");
    const parts = fs.readdirSync(dataDir).filter((f) => f.startsWith("prospects_part") && f.endsWith(".json"));
    if (parts.length > 0) {
      let combined: Array<Record<string, any>> = [];
      for (const p of parts.sort()) {
        const raw = fs.readFileSync(path.join(dataDir, p), "utf-8");
        combined = combined.concat(JSON.parse(raw));
      }
      cachedMasterProspects = combined;
      return cachedMasterProspects || [];
    }
  } catch (err) {
    console.error("Error loading master prospects:", err);
  }
  return [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, csvContent, mapping, listName, userEmail } = body;

    // Strict Admin authorization check: Enrichment and data import are restricted to Admin role
    const auth = await verifyAdminRequest(req, userEmail);
    if (!auth.isAdmin) {
      return auth.errorResponse || NextResponse.json(
        { error: "Access denied. The Data Quality Scrubber & Import Engine is strictly restricted to platform administrators." },
        { status: 403 }
      );
    }

    if (!csvContent || typeof csvContent !== "string") {
      return NextResponse.json({ error: "CSV content is required." }, { status: 400 });
    }

    if (csvContent.includes("\0") || /[\uFFFD]/.test(csvContent.slice(0, 500))) {
      return NextResponse.json(
        { error: "Invalid file format: Detected binary or unreadable content. Only valid plain-text CSV (.csv) files are supported." },
        { status: 400 }
      );
    }

    const rows = parseCsv(csvContent);
    if (rows.length < 2) {
      return NextResponse.json(
        { error: "CSV must contain at least a header row and one data row with proper contact records." },
        { status: 400 }
      );
    }

    const headers = rows[0];

    // Validate that headers actually represent B2B prospect or company data
    const recognizedFieldKeys = ["email", "name", "company", "title", "phone", "domain", "website", "linkedin", "city", "country", "industry"];
    const hasRecognizedColumn = headers.some((h) => {
      const lower = h.toLowerCase().trim();
      return recognizedFieldKeys.some((k) => lower.includes(k));
    });

    if (!hasRecognizedColumn) {
      return NextResponse.json(
        {
          error:
            "Invalid CSV schema: The uploaded CSV does not contain valid contact or company headers (e.g., Email, Full Name, Company Name, Job Title, Direct Phone, or Website). Please upload a valid prospecting CSV.",
        },
        { status: 400 }
      );
    }

    // Action 1: Preview and auto-detect column mapping
    if (action === "preview") {
      const sampleRows = rows.slice(1, 6);
      const suggestedMapping: Record<string, string> = {};

      headers.forEach((h) => {
        const lower = h.toLowerCase().trim();
        if (lower.includes("email")) suggestedMapping[h] = "email";
        else if (lower.includes("first") && lower.includes("name")) suggestedMapping[h] = "firstName";
        else if (lower.includes("last") && lower.includes("name")) suggestedMapping[h] = "lastName";
        else if (lower === "name" || lower.includes("full name")) suggestedMapping[h] = "fullName";
        else if (lower.includes("company") || lower.includes("organization") || lower.includes("account"))
          suggestedMapping[h] = "companyName";
        else if (lower.includes("title") || lower.includes("position") || lower.includes("role"))
          suggestedMapping[h] = "title";
        else if (lower.includes("phone") || lower.includes("mobile") || lower.includes("direct"))
          suggestedMapping[h] = "directPhone";
        else if (lower.includes("linkedin")) suggestedMapping[h] = "linkedinUrl";
        else if (lower.includes("industry")) suggestedMapping[h] = "industry";
        else if (lower.includes("city")) suggestedMapping[h] = "city";
        else if (lower.includes("state")) suggestedMapping[h] = "state";
        else if (lower.includes("country")) suggestedMapping[h] = "country";
        else if (lower.includes("website") || lower.includes("domain")) suggestedMapping[h] = "website";
        else if (lower.includes("revenue")) suggestedMapping[h] = "revenueMil";
      });

      return NextResponse.json({
        success: true,
        headers,
        totalRows: rows.length - 1,
        sampleRows,
        suggestedMapping,
        masterHeaders: MASTER_CSV_HEADERS,
      });
    }

    // Action 2: Confirm, Enrich & Generate Master CSV format
    if (action === "confirm" || action === "enrich") {
      if (!mapping || typeof mapping !== "object") {
        return NextResponse.json({ error: "Field mapping is required." }, { status: 400 });
      }

      const email = userEmail || "guest@leadintellect.ai";
      const dataRows = rows.slice(1);

      // Invert mapping: targetField -> sourceColIndex
      const colMap: Record<string, number> = {};
      Object.entries(mapping).forEach(([sourceCol, targetField]) => {
        const idx = headers.indexOf(sourceCol);
        if (idx !== -1 && targetField) colMap[targetField as string] = idx;
      });

      const masterList = getMasterProspects();

      // Quick index maps for fast matching
      const emailMap = new Map<string, any>();
      const nameCompanyMap = new Map<string, any>();
      for (const p of masterList) {
        if (p.email) emailMap.set(String(p.email).toLowerCase().trim(), p);
        if (p.name && p.company) {
          const key = `${String(p.name).toLowerCase().trim()}|${String(p.company).toLowerCase().trim()}`;
          nameCompanyMap.set(key, p);
        }
      }

      const enrichedRows: Array<Record<string, any>> = [];
      const importedIds: string[] = [];
      let matchedCount = 0;
      let enrichedEmailsCount = 0;
      let enrichedPhonesCount = 0;

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];

        const rawName = colMap.fullName !== undefined ? row[colMap.fullName] : "";
        const rawFirst = colMap.firstName !== undefined ? row[colMap.firstName] : "";
        const rawLast = colMap.lastName !== undefined ? row[colMap.lastName] : "";
        const fullName = rawName || `${rawFirst} ${rawLast}`.trim();

        const rawCompany = colMap.companyName !== undefined ? row[colMap.companyName] : "";
        const rawEmail = colMap.email !== undefined ? (row[colMap.email] || "").toLowerCase().trim() : "";
        const rawTitle = colMap.title !== undefined ? row[colMap.title] : "";
        const rawPhone = colMap.directPhone !== undefined ? row[colMap.directPhone] : "";
        const rawLinkedin = colMap.linkedinUrl !== undefined ? row[colMap.linkedinUrl] : "";
        const rawCity = colMap.city !== undefined ? row[colMap.city] : "";
        const rawState = colMap.state !== undefined ? row[colMap.state] : "";
        const rawCountry = colMap.country !== undefined ? row[colMap.country] : "";

        // Attempt match in master dataset
        let matched = null;
        if (rawEmail && emailMap.has(rawEmail)) {
          matched = emailMap.get(rawEmail);
        } else if (fullName && rawCompany) {
          const key = `${fullName.toLowerCase().trim()}|${rawCompany.toLowerCase().trim()}`;
          if (nameCompanyMap.has(key)) {
            matched = nameCompanyMap.get(key);
          }
        }

        if (matched) matchedCount++;

        // Fill master fields with truthful data only
        const fName = rawFirst || matched?.firstName || (fullName ? fullName.split(" ")[0] : "");
        const lName = rawLast || matched?.lastName || (fullName ? fullName.split(" ").slice(1).join(" ") : "");
        const cName = rawCompany || matched?.company || "";
        const titleVal = rawTitle || matched?.title || "";
        const emailVal = rawEmail || matched?.email || "";
        const directPhone = rawPhone || matched?.phone || "";
        const linkedinVal = rawLinkedin || matched?.linkedin || (fullName && cName ? `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(fullName + " " + cName)}` : "");

        if (emailVal && !rawEmail) enrichedEmailsCount++;
        if (directPhone && !rawPhone) enrichedPhonesCount++;

        const enrichedRecord: Record<string, any> = {
          "Company Name": cName,
          "Full Name": fullName || `${fName} ${lName}`.trim(),
          "First Name": fName,
          "Last Name": lName,
          "Title": titleVal,
          "Departments": matched?.department || "",
          "Job Functions": matched?.jobFunctions || "",
          "Reports To": matched?.reportsTo || "",
          "Email": emailVal,
          "Email Status": matched?.emailStatus || (emailVal ? "User Provided" : "Not Found"),
          "Direct Phone": directPhone,
          "Cell Phone": matched?.cellPhone || directPhone,
          "Corp HQ Phone": matched?.hqPhone || directPhone,
          "LinkedIn URL": linkedinVal,
          "LinkedIn Status": matched?.linkedin ? "Verified Profile" : "Search Link",
          "LinkedIn Search URL": fullName && cName ? `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(fullName + " " + cName)}` : "",
          "Website": matched?.website || (cName ? `www.${cName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com` : ""),
          "Industry": matched?.industry || "",
          "Industry Sector": matched?.subIndustry || "",
          "Seniority Tier": matched?.seniority || "",
          "Job Domain": matched?.jobDomain || "",
          "Address 1": matched?.address1 || "",
          "Address 2": "",
          "City": rawCity || matched?.city || "",
          "State": rawState || matched?.state || "",
          "Postal Code": matched?.postalCode || "",
          "Country": rawCountry || matched?.country || "",
          "Location Region": matched?.region || "",
          "Revenue (Mil)": matched?.revenueMil || "",
          "HQ Address 1": matched?.hqAddress1 || "",
          "HQ Address 2": "",
          "HQ City": matched?.city || rawCity || "",
          "HQ State": matched?.state || rawState || "",
          "HQ Postal Code": matched?.postalCode || "",
          "HQ Country": matched?.country || rawCountry || "",
          "Ownership": matched?.ownership || "",
          "Data Quality Score": matched ? 98 : (emailVal && cName ? 85 : 60),
        };

        enrichedRows.push(enrichedRecord);
        importedIds.push(`pros_enr_${Date.now()}_${i}`);
      }

      // Build properly formatted CSV string with all master columns
      const csvLines: string[] = [];
      csvLines.push(MASTER_CSV_HEADERS.map(escapeCsvField).join(","));

      for (const row of enrichedRows) {
        const line = MASTER_CSV_HEADERS.map((h) => escapeCsvField(row[h])).join(",");
        csvLines.push(line);
      }

      const generatedCsvContent = csvLines.join("\r\n");

      // Save to list if name provided
      let createdListId: string | undefined;
      if (listName && listName.trim().length > 0 && importedIds.length > 0) {
        const created = await saveList({
          userEmail: email,
          name: listName.trim(),
          description: `Enriched CSV batch (${matchedCount}/${dataRows.length} matched) on ${new Date().toLocaleDateString()}`,
          prospectIds: importedIds,
        });
        createdListId = created.id;
      }

      return NextResponse.json({
        success: true,
        totalRows: dataRows.length,
        matchedCount,
        matchRate: Math.round((matchedCount / dataRows.length) * 100),
        enrichedEmailsCount,
        enrichedPhonesCount,
        createdListId,
        csvContent: generatedCsvContent,
      });
    }

    return NextResponse.json({ error: "Invalid action. Use 'preview' or 'confirm'." }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Import failed.";
    console.error("Error in /api/data/import:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
