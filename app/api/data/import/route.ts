import { NextResponse } from "next/server";
import { saveList, isEmailSuppressed } from "@/lib/db";
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, csvContent, mapping, listName, userEmail } = body;

    if (!csvContent) {
      return NextResponse.json({ error: "CSV content is required." }, { status: 400 });
    }

    const rows = parseCsv(csvContent);
    if (rows.length < 2) {
      return NextResponse.json(
        { error: "CSV must contain at least a header row and one data row." },
        { status: 400 }
      );
    }

    const headers = rows[0];

    // Action 1: Preview and auto-detect column mapping
    if (action === "preview") {
      const sampleRows = rows.slice(1, 6);
      const suggestedMapping: Record<string, string> = {};

      headers.forEach((h) => {
        const lower = h.toLowerCase().trim();
        if (lower.includes("email")) suggestedMapping[h] = "email";
        else if (lower.includes("first") && lower.includes("name")) suggestedMapping[h] = "firstName";
        else if (lower.includes("last") && lower.includes("name")) suggestedMapping[h] = "lastName";
        else if (lower === "name" || lower.includes("full name")) suggestedMapping[h] = "name";
        else if (lower.includes("company") || lower.includes("organization") || lower.includes("account"))
          suggestedMapping[h] = "company";
        else if (lower.includes("title") || lower.includes("position") || lower.includes("role"))
          suggestedMapping[h] = "title";
        else if (lower.includes("phone") || lower.includes("mobile") || lower.includes("direct"))
          suggestedMapping[h] = "phone";
        else if (lower.includes("linkedin")) suggestedMapping[h] = "linkedin";
        else if (lower.includes("industry")) suggestedMapping[h] = "industry";
        else if (lower.includes("city")) suggestedMapping[h] = "city";
        else if (lower.includes("state")) suggestedMapping[h] = "state";
        else if (lower.includes("country")) suggestedMapping[h] = "country";
      });

      return NextResponse.json({
        success: true,
        headers,
        totalRows: rows.length - 1,
        sampleRows,
        suggestedMapping,
      });
    }

    // Action 2: Confirm and process import
    if (action === "confirm") {
      if (!mapping || typeof mapping !== "object") {
        return NextResponse.json({ error: "Field mapping is required to import." }, { status: 400 });
      }

      const email = userEmail || "guest@leadintellect.ai";
      const dataRows = rows.slice(1);

      // Map columns
      const colMap: Record<string, number> = {};
      Object.entries(mapping).forEach(([sourceCol, targetField]) => {
        const idx = headers.indexOf(sourceCol);
        if (idx !== -1 && targetField) colMap[targetField as string] = idx;
      });

      const importedIds: string[] = [];
      let skippedCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Load existing prospects
      const prospectsFilePath = path.join(process.cwd(), "data", "prospects.json");
      let existingProspects: Array<Record<string, unknown> & { id: string; email?: string }> = [];
      if (fs.existsSync(prospectsFilePath)) {
        existingProspects = JSON.parse(fs.readFileSync(prospectsFilePath, "utf-8"));
      }

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const rowNum = i + 2;

        const nameVal = colMap.name !== undefined ? row[colMap.name] : "";
        const firstVal = colMap.firstName !== undefined ? row[colMap.firstName] : "";
        const lastVal = colMap.lastName !== undefined ? row[colMap.lastName] : "";
        const fullName = nameVal || `${firstVal} ${lastVal}`.trim();

        const company = colMap.company !== undefined ? row[colMap.company] : "";
        const emailVal = colMap.email !== undefined ? (row[colMap.email] || "").toLowerCase().trim() : "";
        const phone = colMap.phone !== undefined ? row[colMap.phone] : "";
        const title = colMap.title !== undefined ? row[colMap.title] : "Professional";
        const industry = colMap.industry !== undefined ? row[colMap.industry] : "General Business";
        const linkedin = colMap.linkedin !== undefined ? row[colMap.linkedin] : "";
        const city = colMap.city !== undefined ? row[colMap.city] : "";
        const state = colMap.state !== undefined ? row[colMap.state] : "";
        const country = colMap.country !== undefined ? row[colMap.country] : "Global";

        if (!fullName || !company) {
          errorCount++;
          if (errors.length < 5) errors.push(`Row ${rowNum}: Missing required Name or Company.`);
          continue;
        }

        // Suppression list check
        if (emailVal && (await isEmailSuppressed(emailVal))) {
          skippedCount++;
          continue;
        }

        const newId = `pros_imp_${Date.now()}_${i}`;
        const newRecord = {
          id: newId,
          name: fullName,
          firstName: firstVal || fullName.split(" ")[0],
          lastName: lastVal || fullName.split(" ").slice(1).join(" "),
          title,
          seniority: "Professional / IC",
          department: "Imported",
          company,
          domain: company.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com",
          website: "",
          industry,
          employees: 100,
          employeeRange: "51-200",
          revenueMil: 0,
          revenueRange: "Privately Held",
          location: [city, state, country].filter(Boolean).join(", ") || "Global",
          city,
          state,
          country,
          email: emailVal,
          emailStatus: emailVal ? "deliverable" : "not_available",
          emailConfidence: emailVal ? 80 : 0,
          verificationSource: "User CSV Import",
          verificationDate: new Date().toISOString().split("T")[0],
          phone,
          phoneType: phone ? "Direct Dial" : "None",
          hasPhone: Boolean(phone && phone.length > 5),
          hasEmail: Boolean(emailVal && emailVal.includes("@")),
          linkedin,
          ownership: "Private",
          icpScore: 78,
          icpTier: "Tier 2",
          source: `User Import (${new Date().toLocaleDateString()})`,
        };

        existingProspects.push(newRecord);
        importedIds.push(newId);
      }

      // Persist updated prospects
      fs.writeFileSync(prospectsFilePath, JSON.stringify(existingProspects), "utf-8");

      // Create list if requested
      let createdListId: string | undefined;
      if (listName && listName.trim().length > 0 && importedIds.length > 0) {
        const created = await saveList({
          userEmail: email,
          name: listName.trim(),
          description: `Imported from CSV on ${new Date().toLocaleDateString()}`,
          prospectIds: importedIds,
        });
        createdListId = created.id;
      }

      return NextResponse.json({
        success: true,
        importedCount: importedIds.length,
        skippedCount,
        errorCount,
        errors,
        createdListId,
      });
    }

    return NextResponse.json({ error: "Invalid action. Use 'preview' or 'confirm'." }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Import failed.";
    console.error("Error in /api/data/import:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
