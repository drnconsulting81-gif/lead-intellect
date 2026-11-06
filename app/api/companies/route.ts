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
    const city = (searchParams.get("city") || "").toLowerCase().trim();
    const state = (searchParams.get("state") || "").toLowerCase().trim();
    const employeeRange = searchParams.get("employeeRange") || "";
    const revenueRange = searchParams.get("revenueRange") || "";
    const ownership = searchParams.get("ownership") || "";
    const minContacts = Number(searchParams.get("minContacts")) || 0;
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
          (c.headquarters && c.headquarters.toLowerCase().includes(query)) ||
          (c.city && c.city.toLowerCase().includes(query)) ||
          (c.state && c.state.toLowerCase().includes(query));
        if (!match) return false;
      }

      if (industry && industry !== "all") {
        if (!c.industry || !c.industry.toLowerCase().includes(industry)) return false;
      }

      if (country && country !== "all") {
        const cLower = (c.country || "").toLowerCase();
        const target = country.toLowerCase().trim();
        const match =
          cLower === target ||
          cLower.includes(target) ||
          target.includes(cLower) ||
          ((target === "united states" || target === "usa" || target === "us") && (cLower === "united states" || cLower === "usa" || cLower === "us")) ||
          ((target === "united kingdom" || target === "uk") && (cLower === "united kingdom" || cLower === "uk")) ||
          ((target === "united arab emirates" || target === "uae") && (cLower === "united arab emirates" || cLower === "uae"));
        if (!match) return false;
      }

      if (city && city !== "all") {
        if (!c.city || !c.city.toLowerCase().includes(city)) return false;
      }

      if (state && state !== "all") {
        if (!c.state || !c.state.toLowerCase().includes(state)) return false;
      }

      if (employeeRange && employeeRange !== "all") {
        const eLower = (c.employeeRange || "").toLowerCase();
        const tLower = employeeRange.toLowerCase();
        const match =
          eLower === tLower ||
          eLower.includes(tLower) ||
          (tLower.includes("1000+") && (eLower.includes("1000+") || eLower.includes("1000") || eLower.includes("5000"))) ||
          (tLower.includes("501-1000") && eLower.includes("501-1000")) ||
          (tLower.includes("201-500") && eLower.includes("201-500")) ||
          (tLower.includes("51-200") && eLower.includes("51-200")) ||
          (tLower.includes("11-50") && eLower.includes("11-50")) ||
          (tLower.includes("1-10") && eLower.includes("1-10"));
        if (!match) return false;
      }

      if (revenueRange && revenueRange !== "all") {
        const rLower = (c.revenueRange || "").toLowerCase();
        const tLower = revenueRange.toLowerCase();
        const match =
          rLower === tLower ||
          rLower.includes(tLower) ||
          (tLower.includes("100m+") && (rLower.includes("100m+") || rLower.includes("100m"))) ||
          (tLower.includes("20m - 100m") && (rLower.includes("20m - 100m") || rLower.includes("20m - 50m") || rLower.includes("50m - 100m"))) ||
          (tLower.includes("1m - 20m") && (rLower.includes("1m - 20m") || rLower.includes("5m - 20m") || rLower.includes("1m"))) ||
          (tLower.includes("10m - 50m") && (rLower.includes("10m - 50m") || rLower.includes("20m - 50m")));
        if (!match) return false;
      }

      if (ownership && ownership !== "all") {
        if (c.ownership !== ownership) return false;
      }

      if (minContacts > 0 && c.verifiedContactsCount < minContacts) return false;

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
    const stateCounts: Record<string, number> = {};
    all.forEach((c) => {
      if (c.industry) industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1;
      if (c.country) countryCounts[c.country] = (countryCounts[c.country] || 0) + 1;
      if (c.state) stateCounts[c.state] = (stateCounts[c.state] || 0) + 1;
    });

    const topIndustries = Object.keys(industryCounts)
      .sort((a, b) => industryCounts[b] - industryCounts[a])
      .slice(0, 25);

    const topCountries = Object.keys(countryCounts)
      .sort((a, b) => countryCounts[b] - countryCounts[a])
      .slice(0, 15);

    const topStates = Object.keys(stateCounts)
      .sort((a, b) => stateCounts[b] - stateCounts[a])
      .slice(0, 20);

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
        states: topStates,
        employeeRanges: ["11-50", "51-200", "201-500", "501-1000", "1000+"],
        revenueRanges: ["$1M - $20M", "$20M - $100M", "$100M+"],
      },
    });
  } catch (error) {
    console.error("Error in /api/companies:", error);
    return NextResponse.json({ error: "Failed to fetch companies." }, { status: 500 });
  }
}
