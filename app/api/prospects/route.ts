import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProspectIntentSignal, type IntentSignal } from "@/lib/intent";
import { buildDeterministicSignalForProspect } from "@/lib/intent-store";
import { interpretProspectingGoal } from "@/lib/orchestrator";
import { findUserByEmail, isUserOnPaidPlan, isCeoEmail, getUserUnlockedProspectIds } from "@/lib/db";

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
  dataset?: string;
  datasetCategory?: string;
  directPhone?: string;
  mobilePhone?: string;
  corpPhone?: string;
  faxNumber?: string;
  streetAddress?: string;
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
  const lower = val.toLowerCase().trim();
  return filterList.some((item) => lower === item.toLowerCase().trim() || lower.includes(item.toLowerCase().trim()));
}

function matchesCountry(val: string | undefined | null, filterList: string[]): boolean {
  if (filterList.length === 0) return true;
  if (!val) return false;
  const lower = val.toLowerCase().trim();
  return filterList.some((item) => {
    const it = item.toLowerCase().trim();
    if (lower === it || lower.includes(it) || it.includes(lower)) return true;
    if ((it === "united states" || it === "usa" || it === "us") && (lower === "united states" || lower === "usa" || lower === "us")) return true;
    if ((it === "united kingdom" || it === "uk") && (lower === "united kingdom" || lower === "uk" || lower.includes("kingdom"))) return true;
    if ((it === "united arab emirates" || it === "uae") && (lower === "united arab emirates" || lower === "uae")) return true;
    return false;
  });
}

function matchesRevenue(val: string | undefined | null, filterList: string[]): boolean {
  if (filterList.length === 0) return true;
  if (!val) return false;
  const lower = val.toLowerCase().trim();
  return filterList.some((item) => {
    const it = item.toLowerCase().trim();
    if (lower === it || lower.includes(it)) return true;
    if (it.includes("100m+") && (lower.includes("100m+") || lower.includes("100m"))) return true;
    if (it.includes("20m - 100m") && (lower.includes("20m - 100m") || lower.includes("20m - 50m") || lower.includes("50m - 100m"))) return true;
    if (it.includes("1m - 20m") && (lower.includes("1m - 20m") || lower.includes("5m - 20m") || lower.includes("1m"))) return true;
    if (it.includes("10m - 50m") && (lower.includes("10m - 50m") || lower.includes("20m - 50m"))) return true;
    if ((it.includes("< 1m") || it.includes("0 - 1m")) && (lower.includes("1m") || lower.includes("early"))) return true;
    return false;
  });
}

function matchesEmployee(val: string | undefined | null, filterList: string[]): boolean {
  if (filterList.length === 0) return true;
  if (!val) return false;
  const lower = val.toLowerCase().trim();
  return filterList.some((item) => {
    const it = item.toLowerCase().trim();
    if (lower === it || lower.includes(it)) return true;
    if (it.includes("1000+") && (lower.includes("1000+") || lower.includes("1000") || lower.includes("5000") || lower.includes("1001"))) return true;
    if (it.includes("501-1000") && lower.includes("501-1000")) return true;
    if (it.includes("201-500") && lower.includes("201-500")) return true;
    if (it.includes("51-200") && lower.includes("51-200")) return true;
    if (it.includes("11-50") && lower.includes("11-50")) return true;
    if (it.includes("1-10") && lower.includes("1-10")) return true;
    return false;
  });
}

function maskEmail(em: string | undefined | null): string {
  if (!em || !em.includes("@") || em === "not_available") return "j***@company.com";
  const [user, domain] = em.split("@");
  const visible = user.length > 0 ? user[0] : "j";
  return `${visible}***@${domain}`;
}

function maskPhone(ph: string | undefined | null): string {
  if (!ph || ph === "None" || ph === "not_available") return "+91 987*****";
  const clean = ph.trim();
  if (clean.startsWith("+91")) {
    return clean.slice(0, 7) + "*****";
  }
  if (clean.length > 6) {
    return clean.slice(0, 6) + "-***-****";
  }
  return "+1 555-***-****";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = loadProspects();

    const rawQuery = (searchParams.get("query") || "").trim();
    const isNaturalLang = searchParams.get("parseNatural") === "true";
    let interpretedCriteria: Record<string, string> | null = null;
    let nlExplanation: string = "";

    if (isNaturalLang && rawQuery.length > 5) {
      const parsed = interpretProspectingGoal(rawQuery);
      nlExplanation = parsed.explanation;
      interpretedCriteria = {};
      if (parsed.targetSeniority) interpretedCriteria.seniority = parsed.targetSeniority;
      if (parsed.targetIndustries && parsed.targetIndustries.length > 0) {
        interpretedCriteria.industry = parsed.targetIndustries.join(",");
      }
      if (parsed.targetLocations && parsed.targetLocations.length > 0) {
        interpretedCriteria.country = parsed.targetLocations[0];
      }
      if (parsed.employeeRanges && parsed.employeeRanges.length > 0) {
        interpretedCriteria.employeeRange = parsed.employeeRanges.join(",");
      }
      if (parsed.intentCategories && parsed.intentCategories.length > 0) {
        interpretedCriteria.intentCategory = parsed.intentCategories[0];
      }
      if (parsed.maxRecencyDays) {
        interpretedCriteria.intentRecency = String(parsed.maxRecencyDays);
      }
      if (parsed.targetRoles && parsed.targetRoles.length > 0) {
        interpretedCriteria.title = parsed.targetRoles[0];
      }
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

    const title = (searchParams.get("title") || interpretedCriteria?.title || "").toLowerCase().trim();
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
    const dataset = searchParams.get("dataset") || "";
    const datasetCategory = searchParams.get("datasetCategory") || "";
    const intentCategory = searchParams.get("intentCategory") || interpretedCriteria?.intentCategory || "";
    const intentRecency = searchParams.get("intentRecency") || interpretedCriteria?.intentRecency || "";
    const webPlatform = searchParams.get("webPlatform") || "";

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
    const datasetList = parseFilterList(dataset);
    const intentCategoryList = parseFilterList(intentCategory);
    const webPlatformList = parseFilterList(webPlatform);

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
      if (!matchesCountry(p.country, countryList)) return false;
      if (!matchesOr(p.state, stateList)) return false;
      if (!matchesOr(p.department, departmentList)) return false;
      if (!matchesEmployee(p.employeeRange, employeeRangeList)) return false;
      if (!matchesRevenue(p.revenueRange, revenueRangeList)) return false;
      if (!matchesOr(p.ownership, ownershipList)) return false;
      if (!matchesOr(p.phoneType, phoneTypeList)) return false;
      if (!matchesOr(p.dataset || "", datasetList)) return false;
      if (datasetCategory && datasetCategory !== "all" && p.datasetCategory !== datasetCategory) return false;

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
      if (intentCategoryList.length > 0) {
        const signal = getProspectIntentSignal(p);
        if (!intentCategoryList.includes(signal.category.toLowerCase())) return false;
      }
      if (webPlatformList.length > 0) {
        const signal = getProspectIntentSignal(p);
        if (!webPlatformList.includes(signal.webPlatform.toLowerCase())) return false;
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

    // Check user and unlocked status
    const userEmail = (searchParams.get("userEmail") || "").toLowerCase().trim();
    const user = userEmail ? await findUserByEmail(userEmail) : null;
    const isCeo = isCeoEmail(userEmail);
    const isAdmin = isCeo || user?.role === "admin";
    const isPaidUser = Boolean(isAdmin || user?.planStatus === "active" || user?.plan === "starter" || user?.plan === "growth" || user?.plan === "enterprise");

    let userUnlockedIds = new Set<string>();
    if (userEmail) {
      try {
        const unlockedList = await getUserUnlockedProspectIds(userEmail);
        userUnlockedIds = new Set(unlockedList.map(String));
      } catch (err) {
        console.warn("Failed to fetch user unlocked prospects:", err);
      }
    }

    const total = filtered.length;
    // Allow users to browse 25, 50, or 100 records per page as selected in table controls
    const effectiveLimit = limit;
    const totalPages = Math.ceil(total / effectiveLimit) || 1;
    const startIndex = (page - 1) * effectiveLimit;
    const paginated = filtered.slice(startIndex, startIndex + effectiveLimit);

    // If unlocked by this user or user is Admin/CEO, return unmasked contact details
    // Otherwise, mask email and phone with an Unlock Contact action
    const returnedProspects = paginated.map((p) => {
      const intent = getProspectIntentSignal(p);
      const isUnlocked = isAdmin || userUnlockedIds.has(String(p.id));

      if (isUnlocked) {
        return {
          ...p,
          intentSignal: intent,
          isRevealed: true,
          isUnlocked: true,
          isLocked: false,
        };
      }

      return {
        ...p,
        email: maskEmail(p.email),
        phone: maskPhone(p.phone),
        directPhone: p.directPhone ? maskPhone(p.directPhone) : undefined,
        mobilePhone: p.mobilePhone ? maskPhone(p.mobilePhone) : undefined,
        intentSignal: intent,
        isRevealed: false,
        isUnlocked: false,
        isLocked: true,
      };
    });

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

    const datasetCounts: Record<string, number> = {};
    all.forEach((p) => {
      const ds = p.dataset || "General Master Database";
      datasetCounts[ds] = (datasetCounts[ds] || 0) + 1;
    });
    const datasetsFacet = Object.keys(datasetCounts)
      .sort((a, b) => datasetCounts[b] - datasetCounts[a])
      .map((name) => ({ name, count: datasetCounts[name] }));

    return NextResponse.json({
      success: true,
      prospects: returnedProspects,
      isPaidSubscriber: isPaidUser,
      databaseLocked: !isPaidUser,
      securityMessage: isPaidUser
        ? "Active verified subscription: full database access granted."
        : "Preview mode: emails & direct dials are masked. Upgrade plan to unlock verified contacts and exports.",
      interpretedCriteria,
      nlExplanation,
      pagination: {
        total,
        page,
        limit: effectiveLimit,
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
        datasets: datasetsFacet,
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
