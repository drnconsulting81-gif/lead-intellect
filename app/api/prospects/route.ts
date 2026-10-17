import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProspectIntentSignal, type IntentSignal } from "@/lib/intent";

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
  intentSignal?: IntentSignal;
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

function parseFilterList(param: string | null): string[] {
  if (!param) return [];
  return param
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0 && s !== "all");
}

function matchesOr(val: string | undefined | null, filterList: string[]): boolean {
  if (filterList.length === 0) return true;
  if (!val) return false;
  const lower = val.toLowerCase();
  return filterList.some((item) => lower === item || lower.includes(item));
}

function maskEmail(em: string | undefined | null): string {
  if (!em || !em.includes("@") || em === "not_available") return "";
  const [user, domain] = em.split("@");
  const visible = user.length > 0 ? user[0] : "";
  return `${visible}••••••••@${domain}`;
}

function maskPhone(ph: string | undefined | null): string {
  if (!ph || ph === "None" || ph === "not_available") return "";
  return "+1 (•••) •••-••••";
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
    const industry = searchParams.get("industry") || interpretedCriteria?.industry || "";
    const country = searchParams.get("country") || interpretedCriteria?.country || "";
    const emailStatus = searchParams.get("emailStatus") || "all";
    const hasEmail = searchParams.get("hasEmail") === "true";
    const hasPhone = searchParams.get("hasPhone") === "true";
    const employeeRange = searchParams.get("employeeRange") || interpretedCriteria?.employeeRange || "";
    const location = (searchParams.get("location") || "").toLowerCase().trim();
    const minScore = Number(searchParams.get("minScore")) || 0;

    const title = (searchParams.get("title") || "").toLowerCase().trim();
    const firstName = (searchParams.get("firstName") || "").toLowerCase().trim();
    const lastName = (searchParams.get("lastName") || "").toLowerCase().trim();
    const city = (searchParams.get("city") || "").toLowerCase().trim();
    const state = searchParams.get("state") || "";
    const companyName = (searchParams.get("companyName") || "").toLowerCase().trim();
    const domain = (searchParams.get("domain") || "").toLowerCase().trim();
    const hasLinkedin = searchParams.get("hasLinkedin") === "true";
    const revenueRange = searchParams.get("revenueRange") || "";
    const ownership = searchParams.get("ownership") || "";
    const department = searchParams.get("department") || "";
    const jobFunctions = (searchParams.get("jobFunctions") || "").toLowerCase().trim();
    const phoneType = searchParams.get("phoneType") || "";
    const intentCategory = searchParams.get("intentCategory") || "";
    const intentRecency = searchParams.get("intentRecency") || "";

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 25));
    const sortBy = searchParams.get("sortBy") || "icpScore";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Prepare multi-select lists for OR evaluation within categories
    const seniorityList = parseFilterList(seniority);
    const industryList = parseFilterList(industry);
    const countryList = parseFilterList(country);
    const stateList = parseFilterList(state);
    const departmentList = parseFilterList(department);
    const employeeRangeList = parseFilterList(employeeRange);
    const revenueRangeList = parseFilterList(revenueRange);
    const ownershipList = parseFilterList(ownership);
    const phoneTypeList = parseFilterList(phoneType);

    const filtered = all.filter((p) => {
      // 1. General search query (searches across name, company, title, industry, city, state, country)
      if (query && !interpretedCriteria) {
        const match =
          p.name.toLowerCase().includes(query) ||
          p.company.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          (p.industry && p.industry.toLowerCase().includes(query)) ||
          (p.city && p.city.toLowerCase().includes(query)) ||
          (p.state && p.state.toLowerCase().includes(query)) ||
          (p.country && p.country.toLowerCase().includes(query)) ||
          (p.jobFunctions && p.jobFunctions.toLowerCase().includes(query));
        if (!match) return false;
      }

      // 2. Specific individual fields
      if (title && (!p.title || !p.title.toLowerCase().includes(title))) return false;
      if (firstName && (!p.firstName || !p.firstName.toLowerCase().includes(firstName))) return false;
      if (lastName && (!p.lastName || !p.lastName.toLowerCase().includes(lastName))) return false;
      if (companyName && (!p.company || !p.company.toLowerCase().includes(companyName))) return false;
      if (domain && (!p.domain || !p.domain.toLowerCase().includes(domain)) && (!p.website || !p.website.toLowerCase().includes(domain))) return false;
      if (jobFunctions && (!p.jobFunctions || !p.jobFunctions.toLowerCase().includes(jobFunctions))) return false;

      // 3. City filter (case-insensitive substring)
      if (city && city !== "all") {
        if (!p.city || !p.city.toLowerCase().includes(city)) return false;
      }

      // 4. Multi-select categories (OR within category, AND between categories)
      if (!matchesOr(p.seniority, seniorityList)) return false;
      if (!matchesOr(p.industry, industryList)) return false;
      if (!matchesOr(p.country, countryList)) return false;
      if (!matchesOr(p.state, stateList)) return false;
      if (!matchesOr(p.department, departmentList)) return false;
      if (!matchesOr(p.employeeRange, employeeRangeList)) return false;
      if (!matchesOr(p.revenueRange, revenueRangeList)) return false;
      if (!matchesOr(p.ownership, ownershipList)) return false;
      if (!matchesOr(p.phoneType, phoneTypeList)) return false;

      // 5. ICP Tier and Minimum Score
      if (icpTier && icpTier !== "all") {
        if (p.icpTier !== icpTier) return false;
      }
      if (minScore > 0 && p.icpScore < minScore) return false;

      // 6. Reachability: Email & Phone Availability & Statuses
      if (emailStatus && emailStatus !== "all") {
        if (emailStatus === "verified" && p.emailStatus !== "verified") return false;
        if (emailStatus === "deliverable" && p.emailStatus !== "verified" && p.emailStatus !== "deliverable") {
          return false;
        }
        if (emailStatus === "not_available" && p.emailStatus !== "not_available") return false;
      }

      if (hasEmail && (!p.hasEmail || !p.email || p.email === "not_available" || !p.email.includes("@"))) {
        return false;
      }
      if (hasPhone && (!p.hasPhone || !p.phone || p.phone.trim().length === 0 || p.phone === "None")) {
        return false;
      }
      if (hasLinkedin && (!p.linkedin || !p.linkedin.includes("linkedin.com"))) {
        return false;
      }

      // 7. Generic location search string
      if (location) {
        const locStr = `${p.city || ""} ${p.state || ""} ${p.country || ""} ${p.location || ""}`.toLowerCase();
        if (!locStr.includes(location)) return false;
      }

      // 8. Intent & Buying Signal Filters
      if (intentCategory && intentCategory !== "all") {
        const signal = getProspectIntentSignal(p);
        if (signal.category !== intentCategory) return false;
      }
      if (intentRecency && intentRecency !== "all") {
        const maxDays = Number(intentRecency);
        if (!isNaN(maxDays)) {
          const signal = getProspectIntentSignal(p);
          if (signal.recencyDays > maxDays) return false;
        }
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
      } else if (sortBy === "intentRecency") {
        valA = getProspectIntentSignal(a).recencyDays;
        valB = getProspectIntentSignal(b).recencyDays;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Attach verified intent signal to each prospect
    const prospectsWithIntent = paginated.map((p) => ({
      ...p,
      intentSignal: getProspectIntentSignal(p),
    }));

    // Mask direct email and phone numbers in list view to protect data and prevent unauthorized scraping
    const maskedProspects = paginated.map((p) => ({
      ...p,
      email: maskEmail(p.email),
      phone: maskPhone(p.phone),
      isRevealed: false,
    }));

    // Aggregations
    const totalTier1 = filtered.filter((p) => p.icpScore >= 85).length;
    const totalVerifiedEmails = filtered.filter((p) => p.emailStatus === "verified").length;
    const totalDirectPhones = filtered.filter((p) => p.phoneType === "Direct Dial" || p.phoneType === "Mobile").length;
    const avgScore = total > 0 ? Math.round(filtered.reduce((sum, p) => sum + p.icpScore, 0) / total) : 0;

    // Facets ranking
    const industryCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};
    const revenueCounts: Record<string, number> = {};

    all.forEach((p) => {
      if (p.industry) industryCounts[p.industry] = (industryCounts[p.industry] || 0) + 1;
      if (p.country) countryCounts[p.country] = (countryCounts[p.country] || 0) + 1;
      if (p.state) stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
      if (p.revenueRange) revenueCounts[p.revenueRange] = (revenueCounts[p.revenueRange] || 0) + 1;
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

    const topRevenues = Object.keys(revenueCounts)
      .sort((a, b) => revenueCounts[b] - revenueCounts[a]);

    return NextResponse.json({
      success: true,
      prospects: prospectsWithIntent,
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
        states: topStates,
        revenues: topRevenues,
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
