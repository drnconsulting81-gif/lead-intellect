import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface Prospect {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  seniority: string;
  company: string;
  industry: string;
  employees: number;
  employeeRange: string;
  location: string;
  city: string;
  state: string;
  country: string;
  email: string;
  emailStatus: string;
  emailConfidence: number;
  phone: string;
  phoneType: string;
  linkedin: string;
  technologies: string[];
  icpScore: number;
  icpTier: string;
}

let cachedProspects: Prospect[] | null = null;

function loadProspects(): Prospect[] {
  if (cachedProspects) return cachedProspects;
  try {
    const filePath = path.join(process.cwd(), "data", "prospects.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      cachedProspects = JSON.parse(raw);
      return cachedProspects || [];
    }
  } catch (err) {
    console.error("Error loading prospects.json:", err);
  }
  return [];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = loadProspects();

    const query = (searchParams.get("query") || "").toLowerCase().trim();
    const seniority = searchParams.get("seniority") || "";
    const icpTier = searchParams.get("icpTier") || "";
    const industry = (searchParams.get("industry") || "").toLowerCase().trim();
    const hasEmail = searchParams.get("hasEmail") === "true";
    const hasPhone = searchParams.get("hasPhone") === "true";
    const employeeRange = searchParams.get("employeeRange") || "";
    const location = (searchParams.get("location") || "").toLowerCase().trim();
    const minScore = Number(searchParams.get("minScore")) || 0;

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(5, Number(searchParams.get("limit")) || 25));
    const sortBy = searchParams.get("sortBy") || "icpScore";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    let filtered = all.filter((p) => {
      if (query) {
        const match =
          p.name.toLowerCase().includes(query) ||
          p.company.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          (p.industry && p.industry.toLowerCase().includes(query)) ||
          (p.city && p.city.toLowerCase().includes(query)) ||
          (p.state && p.state.toLowerCase().includes(query));
        if (!match) return false;
      }

      if (seniority && seniority !== "all") {
        const seniors = seniority.split(",").map((s) => s.trim().toLowerCase());
        const pSeniority = (p.seniority || "").toLowerCase();
        const matches = seniors.some((s) => pSeniority.includes(s));
        if (!matches) return false;
      }

      if (icpTier && icpTier !== "all") {
        if (icpTier === "Tier 1" && p.icpScore < 85) return false;
        if (icpTier === "Tier 2" && (p.icpScore < 75 || p.icpScore >= 85)) return false;
        if (icpTier === "Tier 3" && p.icpScore >= 75) return false;
      }

      if (minScore > 0 && p.icpScore < minScore) return false;

      if (industry && industry !== "all") {
        if (!p.industry || !p.industry.toLowerCase().includes(industry)) return false;
      }

      if (hasEmail && (!p.email || !p.email.includes("@"))) return false;

      if (hasPhone && (!p.phone || p.phone.trim().length === 0)) return false;

      if (location) {
        const locStr = `${p.city || ""} ${p.state || ""} ${p.country || ""} ${p.location || ""}`.toLowerCase();
        if (!locStr.includes(location)) return false;
      }

      if (employeeRange && employeeRange !== "all") {
        const emp = p.employees || 0;
        if (employeeRange === "1-50" && (emp < 1 || emp > 50)) return false;
        if (employeeRange === "51-200" && (emp < 51 || emp > 200)) return false;
        if (employeeRange === "201-500" && (emp < 201 || emp > 500)) return false;
        if (employeeRange === "501-1000" && (emp < 501 || emp > 1000)) return false;
        if (employeeRange === "1000+" && emp < 1001) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let valA: any = a.icpScore;
      let valB: any = b.icpScore;

      if (sortBy === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === "company") {
        valA = a.company.toLowerCase();
        valB = b.company.toLowerCase();
      } else if (sortBy === "employees") {
        valA = a.employees || 0;
        valB = b.employees || 0;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Dynamic aggregated facets & stats
    const totalTier1 = filtered.filter((p) => p.icpScore >= 85).length;
    const totalVerifiedEmails = filtered.filter((p) => p.email && p.email.includes("@")).length;
    const totalDirectPhones = filtered.filter((p) => p.phone && p.phone.trim().length > 0).length;
    const avgScore = total > 0 ? Math.round(filtered.reduce((sum, p) => sum + p.icpScore, 0) / total) : 0;

    // Industries list from full dataset ranked by frequency
    const industryCounts: Record<string, number> = {};
    all.forEach((p) => {
      if (p.industry && p.industry.length > 2) {
        const ind = p.industry.trim();
        industryCounts[ind] = (industryCounts[ind] || 0) + 1;
      }
    });
    const topIndustries = Object.keys(industryCounts)
      .sort((a, b) => industryCounts[b] - industryCounts[a])
      .slice(0, 30);

    return NextResponse.json({
      success: true,
      prospects: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      stats: {
        totalMatches: total,
        totalTier1,
        totalVerifiedEmails,
        totalDirectPhones,
        avgIcpScore: avgScore,
      },
      facets: {
        industries: topIndustries,
        seniorities: ["C-Suite", "VP", "Director", "Manager", "Professional / IC"],
      },
    });
  } catch (error) {
    console.error("Error in /api/prospects:", error);
    return NextResponse.json(
      { error: "Failed to fetch prospects." },
      { status: 500 }
    );
  }
}
