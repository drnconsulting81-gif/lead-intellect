import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface Company {
  id: string;
  name: string;
  domain: string;
  website: string;
  industry: string;
  subIndustry?: string;
  employees: number;
  employeeRange: string;
  revenueRange: string;
  revenueMil: number;
  headquarters: string;
  city: string;
  state: string;
  country: string;
  ownership: string;
  decisionMakerCount: number;
  verifiedContactsCount: number;
  icpScore: number;
}

let cachedCompanies: Company[] | null = null;

function loadCompanies(): Company[] {
  if (cachedCompanies) return cachedCompanies;
  try {
    const filePath = path.join(process.cwd(), "data", "companies.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      cachedCompanies = JSON.parse(raw);
      return cachedCompanies || [];
    }
  } catch (err) {
    console.error("Error loading companies.json:", err);
  }
  return [];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = loadCompanies();

    const query = (searchParams.get("query") || "").toLowerCase().trim();
    const industry = (searchParams.get("industry") || "").toLowerCase().trim();
    const country = (searchParams.get("country") || "").toLowerCase().trim();
    const employeeRange = searchParams.get("employeeRange") || "";
    const minScore = Number(searchParams.get("minScore")) || 0;

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(5, Number(searchParams.get("limit")) || 25));
    const sortBy = searchParams.get("sortBy") || "decisionMakerCount";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const filtered = all.filter((c) => {
      if (query) {
        const match =
          c.name.toLowerCase().includes(query) ||
          (c.domain && c.domain.toLowerCase().includes(query)) ||
          (c.industry && c.industry.toLowerCase().includes(query)) ||
          (c.headquarters && c.headquarters.toLowerCase().includes(query));
        if (!match) return false;
      }

      if (industry && industry !== "all") {
        if (!c.industry || !c.industry.toLowerCase().includes(industry)) return false;
      }

      if (country && country !== "all") {
        if (!c.country || !c.country.toLowerCase().includes(country)) return false;
      }

      if (employeeRange && employeeRange !== "all") {
        if (c.employeeRange !== employeeRange) return false;
      }

      if (minScore > 0 && c.icpScore < minScore) return false;

      return true;
    });

    filtered.sort((a, b) => {
      let valA: string | number = a.decisionMakerCount;
      let valB: string | number = b.decisionMakerCount;

      if (sortBy === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === "employees") {
        valA = a.employees;
        valB = b.employees;
      } else if (sortBy === "icpScore") {
        valA = a.icpScore;
        valB = b.icpScore;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Dynamic Facets
    const industryCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    all.forEach((c) => {
      if (c.industry) industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1;
      if (c.country) countryCounts[c.country] = (countryCounts[c.country] || 0) + 1;
    });

    const topIndustries = Object.keys(industryCounts)
      .sort((a, b) => industryCounts[b] - industryCounts[a])
      .slice(0, 25);

    const topCountries = Object.keys(countryCounts)
      .sort((a, b) => countryCounts[b] - countryCounts[a])
      .slice(0, 15);

    return NextResponse.json({
      success: true,
      companies: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      stats: {
        totalMatches: total,
        totalDecisionMakers: filtered.reduce((sum, c) => sum + c.decisionMakerCount, 0),
        avgIcpScore:
          total > 0 ? Math.round(filtered.reduce((sum, c) => sum + c.icpScore, 0) / total) : 0,
      },
      facets: {
        industries: topIndustries,
        countries: topCountries,
        employeeRanges: ["11-50", "51-200", "201-500", "501-1000", "1000+"],
      },
    });
  } catch (error) {
    console.error("Error in /api/companies:", error);
    return NextResponse.json({ error: "Failed to fetch companies." }, { status: 500 });
  }
}
