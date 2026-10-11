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
  department: string;
  jobFunctions?: string;
  reportsTo?: string;
  company: string;
  domain: string;
  website: string;
  industry: string;
  subIndustry?: string;
  employees: number;
  employeeRange: string;
  revenueMil: number;
  revenueRange: string;
  location: string;
  city: string;
  state: string;
  country: string;
  region?: string;
  email: string;
  emailStatus: "verified" | "deliverable" | "unverified" | "not_available";
  emailConfidence: number;
  verificationSource: string;
  verificationDate: string;
  phone: string;
  phoneType: string;
  hasPhone: boolean;
  hasEmail: boolean;
  linkedin: string;
  ownership: string;
  icpScore: number;
  icpTier: "Tier 1" | "Tier 2" | "Tier 3";
  source: string;
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

/**
 * Natural language interpreter: maps plain English search requests into structured query parameters
 */
function parseNaturalLanguageQuery(text: string) {
  const lower = text.toLowerCase().trim();
  const interpreted: Record<string, string> = {};

  // Seniority detection
  if (/\b(c-suite|c-level|ceo|cto|cfo|cro|coo|cmo|cpo|president)\b/.test(lower)) {
    interpreted.seniority = "C-Suite";
  } else if (/\b(vp|vice president|evp|svp)\b/.test(lower)) {
    interpreted.seniority = "VP";
  } else if (/\b(director|head of)\b/.test(lower)) {
    interpreted.seniority = "Director";
  } else if (/\b(manager|lead)\b/.test(lower)) {
    interpreted.seniority = "Manager";
  } else if (/\b(founder|owner|co-founder)\b/.test(lower)) {
    interpreted.seniority = "Founder / Owner";
  }

  // Country detection
  if (/\b(us|usa|united states|america)\b/.test(lower)) {
    interpreted.country = "United States";
  } else if (/\b(india|indian)\b/.test(lower)) {
    interpreted.country = "India";
  } else if (/\b(uk|united kingdom|britain|england)\b/.test(lower)) {
    interpreted.country = "United Kingdom";
  } else if (/\b(canada|canadian)\b/.test(lower)) {
    interpreted.country = "Canada";
  } else if (/\b(australia|australian)\b/.test(lower)) {
    interpreted.country = "Australia";
  }

  // Industry detection
  if (/\b(manufacturing|industrial|factory)\b/.test(lower)) {
    interpreted.industry = "Manufacturing & Industrial";
  } else if (/\b(healthcare|hospital|medical|pharma|life sciences)\b/.test(lower)) {
    interpreted.industry = "Healthcare & Life Sciences";
  } else if (/\b(software|saas|it|tech|technology|telecom)\b/.test(lower)) {
    interpreted.industry = "Technology, Media & Telecom";
  } else if (/\b(banking|finance|financial|insurance)\b/.test(lower)) {
    interpreted.industry = "Financial Services & Banking";
  } else if (/\b(real estate|property|construction)\b/.test(lower)) {
    interpreted.industry = "Professional Services & Real Estate";
  } else if (/\b(retail|ecommerce|consumer goods)\b/.test(lower)) {
    interpreted.industry = "Retail, Wholesale & Consumer";
  }

  // Employee range detection
  if (/\b(500\s*[-–]\s*5000|500\+)\b/.test(lower)) {
    interpreted.employeeRange = "501-1000";
  } else if (/\b(1000\+|enterprise)\b/.test(lower)) {
    interpreted.employeeRange = "1000+";
  } else if (/\b(50\s*[-–]\s*200|mid-market)\b/.test(lower)) {
    interpreted.employeeRange = "51-200";
  }

  return Object.keys(interpreted).length > 0 ? interpreted : null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = loadProspects();

    const rawQuery = (searchParams.get("query") || "").trim();
    const isNaturalLang = searchParams.get("parseNatural") === "true";
    let interpretedCriteria: Record<string, string> | null = null;

    if (isNaturalLang && rawQuery.length > 5) {
      interpretedCriteria = parseNaturalLanguageQuery(rawQuery);
    }

    const query = rawQuery.toLowerCase();
    const seniority = searchParams.get("seniority") || interpretedCriteria?.seniority || "";
    const icpTier = searchParams.get("icpTier") || "";
    const industry = (searchParams.get("industry") || interpretedCriteria?.industry || "").toLowerCase().trim();
    const country = (searchParams.get("country") || interpretedCriteria?.country || "").toLowerCase().trim();
    const emailStatus = searchParams.get("emailStatus") || "all";
    const hasEmail = searchParams.get("hasEmail") === "true";
    const hasPhone = searchParams.get("hasPhone") === "true";
    const employeeRange = searchParams.get("employeeRange") || interpretedCriteria?.employeeRange || "";
    const location = (searchParams.get("location") || "").toLowerCase().trim();
    const minScore = Number(searchParams.get("minScore")) || 0;

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(5, Number(searchParams.get("limit")) || 25));
    const sortBy = searchParams.get("sortBy") || "icpScore";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const filtered = all.filter((p) => {
      // General search query
      if (query && !interpretedCriteria) {
        const match =
          p.name.toLowerCase().includes(query) ||
          p.company.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          (p.industry && p.industry.toLowerCase().includes(query)) ||
          (p.city && p.city.toLowerCase().includes(query)) ||
          (p.state && p.state.toLowerCase().includes(query)) ||
          (p.country && p.country.toLowerCase().includes(query));
        if (!match) return false;
      }

      // Seniority
      if (seniority && seniority !== "all") {
        const seniors = seniority.split(",").map((s) => s.trim().toLowerCase());
        const pSeniority = (p.seniority || "").toLowerCase();
        const matches = seniors.some((s) => pSeniority.includes(s));
        if (!matches) return false;
      }

      // ICP Tier
      if (icpTier && icpTier !== "all") {
        if (p.icpTier !== icpTier) return false;
      }

      // Minimum Fit Score
      if (minScore > 0 && p.icpScore < minScore) return false;

      // Industry
      if (industry && industry !== "all") {
        if (!p.industry || !p.industry.toLowerCase().includes(industry)) return false;
      }

      // Country
      if (country && country !== "all") {
        if (!p.country || !p.country.toLowerCase().includes(country)) return false;
      }

      // Email status
      if (emailStatus && emailStatus !== "all") {
        if (emailStatus === "verified" && p.emailStatus !== "verified") return false;
        if (emailStatus === "deliverable" && p.emailStatus !== "verified" && p.emailStatus !== "deliverable") {
          return false;
        }
      }

      if (hasEmail && (!p.email || !p.email.includes("@"))) return false;
      if (hasPhone && (!p.phone || p.phone.trim().length === 0)) return false;

      // Specific location query
      if (location) {
        const locStr = `${p.city || ""} ${p.state || ""} ${p.country || ""} ${p.location || ""}`.toLowerCase();
        if (!locStr.includes(location)) return false;
      }

      // Employee range
      if (employeeRange && employeeRange !== "all") {
        if (p.employeeRange !== employeeRange) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let valA: string | number = a.icpScore;
      let valB: string | number = b.icpScore;

      if (sortBy === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === "company") {
        valA = a.company.toLowerCase();
        valB = b.company.toLowerCase();
      } else if (sortBy === "title") {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
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

    // Aggregations
    const totalTier1 = filtered.filter((p) => p.icpScore >= 85).length;
    const totalVerifiedEmails = filtered.filter((p) => p.emailStatus === "verified").length;
    const totalDirectPhones = filtered.filter((p) => p.phoneType === "Direct Dial" || p.phoneType === "Mobile").length;
    const avgScore = total > 0 ? Math.round(filtered.reduce((sum, p) => sum + p.icpScore, 0) / total) : 0;

    // Facets ranking
    const industryCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};

    all.forEach((p) => {
      if (p.industry) {
        industryCounts[p.industry] = (industryCounts[p.industry] || 0) + 1;
      }
      if (p.country) {
        countryCounts[p.country] = (countryCounts[p.country] || 0) + 1;
      }
    });

    const topIndustries = Object.keys(industryCounts)
      .sort((a, b) => industryCounts[b] - industryCounts[a])
      .slice(0, 25);

    const topCountries = Object.keys(countryCounts)
      .sort((a, b) => countryCounts[b] - countryCounts[a])
      .slice(0, 15);

    return NextResponse.json({
      success: true,
      prospects: paginated,
      interpretedCriteria,
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
        countries: topCountries,
        seniorities: ["C-Suite", "VP", "Director", "Manager", "Founder / Owner", "Professional / IC"],
        employeeRanges: ["11-50", "51-200", "201-500", "501-1000", "1000+"],
        emailStatuses: ["verified", "deliverable", "all"],
      },
    });
  } catch (error) {
    console.error("Error in /api/prospects:", error);
    return NextResponse.json(
      { error: "Failed to fetch prospects from LeadIntellect database." },
      { status: 500 }
    );
  }
}
