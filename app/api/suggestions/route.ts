import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface LookupIndices {
  industries: string[];
  countries: string[];
  titles: string[];
}

let cachedIndices: LookupIndices | null = null;

function getLookupIndices(): LookupIndices {
  if (cachedIndices) return cachedIndices;

  const lookupFile = path.join(process.cwd(), "data", "lookup-indices.json");
  if (fs.existsSync(lookupFile)) {
    try {
      const raw = fs.readFileSync(lookupFile, "utf-8");
      cachedIndices = JSON.parse(raw);
      if (cachedIndices) return cachedIndices;
    } catch (e) {
      console.error("Error reading lookup-indices.json:", e);
    }
  }

  // Fallback to prospects.json if lookup-indices not yet created
  const prospectsFile = path.join(process.cwd(), "data", "prospects.json");
  const indSet = new Set<string>();
  const countrySet = new Set<string>();
  const titleSet = new Set<string>();

  if (fs.existsSync(prospectsFile)) {
    try {
      const prospects = JSON.parse(fs.readFileSync(prospectsFile, "utf-8"));
      for (const p of prospects) {
        if (p.industry) indSet.add(p.industry.trim());
        if (p.country) countrySet.add(p.country.trim());
        if (p.title && p.title.length > 2) titleSet.add(p.title.trim());
      }
    } catch (err) {
      console.error("Error loading prospects for suggestions:", err);
    }
  }

  cachedIndices = {
    industries: Array.from(indSet).sort((a, b) => a.localeCompare(b)),
    countries: Array.from(countrySet).sort((a, b) => a.localeCompare(b)),
    titles: Array.from(titleSet).sort((a, b) => a.localeCompare(b)),
  };

  return cachedIndices;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all"; // "titles" | "industries" | "countries" | "companies"
    const query = (searchParams.get("q") || "").trim().toLowerCase();
    const limitParam = searchParams.get("limit");
    const limit = limitParam === "all" ? 500 : Math.min(Math.max(parseInt(limitParam || "25", 10), 1), 500);

    const indices = getLookupIndices();

    if (type === "industries") {
      const filtered = indices.industries
        .filter((item) => (query ? item.toLowerCase().includes(query) : true))
        .sort((a, b) => {
          // Exact prefix matches first, then alphabetical
          const aStarts = a.toLowerCase().startsWith(query);
          const bStarts = b.toLowerCase().startsWith(query);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localeCompare(b);
        })
        .slice(0, limit);

      return NextResponse.json({
        type: "industries",
        total: indices.industries.length,
        suggestions: filtered,
      });
    }

    if (type === "countries") {
      const filtered = indices.countries
        .filter((item) => (query ? item.toLowerCase().includes(query) : true))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(query);
          const bStarts = b.toLowerCase().startsWith(query);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localeCompare(b);
        })
        .slice(0, limit);

      return NextResponse.json({
        type: "countries",
        total: indices.countries.length,
        suggestions: filtered,
      });
    }

    if (type === "titles") {
      const filtered = indices.titles
        .filter((item) => (query ? item.toLowerCase().includes(query) : true))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(query);
          const bStarts = b.toLowerCase().startsWith(query);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localeCompare(b);
        })
        .slice(0, limit);

      return NextResponse.json({
        type: "titles",
        total: indices.titles.length,
        suggestions: filtered,
      });
    }

    // Default: General multi-type lookup for top search bar
    const titleMatches = indices.titles
      .filter((item) => item.toLowerCase().includes(query))
      .slice(0, 5)
      .map((text) => ({ text, category: "Job Title" }));

    const industryMatches = indices.industries
      .filter((item) => item.toLowerCase().includes(query))
      .slice(0, 5)
      .map((text) => ({ text, category: "Industry" }));

    const countryMatches = indices.countries
      .filter((item) => item.toLowerCase().includes(query))
      .slice(0, 3)
      .map((text) => ({ text, category: "Country" }));

    const combined = [...titleMatches, ...industryMatches, ...countryMatches]
      .sort((a, b) => {
        const aStarts = a.text.toLowerCase().startsWith(query);
        const bStarts = b.text.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.text.localeCompare(b.text);
      })
      .slice(0, limit);

    return NextResponse.json({
      query,
      suggestions: combined,
    });
  } catch (error: any) {
    console.error("Suggestions API error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions", suggestions: [] }, { status: 500 });
  }
}

