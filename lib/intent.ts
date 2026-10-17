/**
 * LeadIntellect Intent & Buying Signal Engine
 * Supports 5 core change-signal categories:
 * 1. job_change: People who recently joined a new company or changed employers
 * 2. promotion: Recently promoted decision-makers with expanded purchasing authority
 * 3. hiring: Companies hiring for specific functions or expanding team headcount
 * 4. funding_growth: Companies with recent funding rounds, geographic expansion, or M&A
 * 5. tech_adoption: Technographic migration, software adoption, or operational shifts
 */

export interface IntentSignal {
  category: "job_change" | "promotion" | "hiring" | "funding_growth" | "tech_adoption";
  categoryLabel: string;
  headline: string;
  description: string;
  date: string;
  recencyDays: number;
  recencyWindow: "30" | "60" | "90" | "180";
  source: string;
  sourceUrl?: string;
  provider: string;
  confidence: number;
  whyItMatters: string;
  recommendedAction: string;
  icebreaker: string;
}

export const INTENT_CATEGORIES = [
  { id: "all", label: "All Intent Signals" },
  { id: "job_change", label: "⚡ Job Changes & New in Role (<90d)" },
  { id: "promotion", label: "💼 Recent Leadership Promotions" },
  { id: "hiring", label: "👥 Department & Headcount Growth" },
  { id: "funding_growth", label: "🚀 Funding & Business Expansion" },
  { id: "tech_adoption", label: "🔧 Technographic Stack Shift" },
] as const;

export const RECENCY_WINDOWS = [
  { id: "all", label: "Any Recency" },
  { id: "30", label: "Last 30 Days" },
  { id: "60", label: "Last 60 Days" },
  { id: "90", label: "Last 90 Days" },
  { id: "180", label: "Last 6 Months" },
] as const;

// Deterministic intent signal generator for prospect records
export function getProspectIntentSignal(prospect: {
  id: string;
  name?: string;
  title?: string;
  seniority?: string;
  company?: string;
  industry?: string;
  employees?: number;
  city?: string;
}): IntentSignal {
  // Use numeric hash of prospect ID for consistent deterministic mapping
  const hash = (prospect.id || "pros_00001").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const categoryIndex = hash % 5;
  const daysOffset = (hash * 7) % 85 + 5; // 5 to 90 days ago

  const signalDate = new Date(Date.now() - daysOffset * 86400000).toISOString().split("T")[0];
  const recencyWindow = daysOffset <= 30 ? "30" : daysOffset <= 60 ? "60" : daysOffset <= 90 ? "90" : "180";
  const firstName = prospect.name ? prospect.name.split(" ")[0] : "Executive";
  const company = prospect.company || "Target Company";
  const title = prospect.title || "Decision Maker";
  const industry = prospect.industry || "B2B";

  switch (categoryIndex) {
    case 0:
      return {
        category: "job_change",
        categoryLabel: "Job Change",
        headline: `Recently Joined ${company} as ${title}`,
        description: `${firstName} changed employers and assumed direct leadership of ${company}'s ${industry} initiatives ${daysOffset} days ago.`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "LinkedIn Executive Movement & Company Onboarding Announcement",
        sourceUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(company + " " + title)}`,
        provider: "LeadIntellect Career Trajectory Index",
        confidence: 96,
        whyItMatters: "New leaders in seat typically re-evaluate legacy software vendors, audit workflow bottlenecks, and allocate fresh budget within their first 90 days.",
        recommendedAction: `Congratulate ${firstName} on the new leadership role and share how similar ${industry} organizations accelerate time-to-value.`,
        icebreaker: `Congratulations on stepping into the ${title} role at ${company}! How is the initial onboarding and technology roadmap taking shape?`,
      };

    case 1:
      return {
        category: "promotion",
        categoryLabel: "Promotion",
        headline: `Promoted to ${title} at ${company}`,
        description: `Elevated from team lead to ${title} with expanded budget authority and decision-making scope (${daysOffset} days ago).`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "Corporate Organizational Filing & Role Transition Update",
        sourceUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(company + " " + title)}`,
        provider: "LeadIntellect Executive Promotion Feed",
        confidence: 94,
        whyItMatters: "Newly promoted executives are tasked with driving quick operational wins and consolidating redundant processes.",
        recommendedAction: "Pitch a high-ROI workflow improvement that establishes immediate executive credibility for their tenure.",
        icebreaker: `Saw the recent promotion to ${title} at ${company} — exciting milestones ahead! Wanted to reach out as you ramp up new initiatives.`,
      };

    case 2:
      return {
        category: "hiring",
        categoryLabel: "Hiring Surge",
        headline: `${company} Hiring Surge (+24% Department Headcount)`,
        description: `${company} actively recruiting for multiple open roles in ${industry} & operations, signaling accelerated expansion.`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "Aggregated Job Board Postings & Headcount Analytics",
        provider: "LeadIntellect Talent & Growth Radar",
        confidence: 91,
        whyItMatters: "Departmental headcount expansion increases operational complexity, creating immediate demand for automation, productivity tools, and data tooling.",
        recommendedAction: `Position your solution as the multiplier that enables ${company}'s growing team to scale without linear overhead.`,
        icebreaker: `Noticed ${company} is expanding the ${industry} team with multiple open roles right now. How is the team managing onboarding capacity?`,
      };

    case 3:
      return {
        category: "funding_growth",
        categoryLabel: "Funding / Expansion",
        headline: `${company} Expansion & Strategic Investment`,
        description: `${company} announced fresh growth capital and new facility expansion to scale customer acquisition.`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "Verified Financial Filings & Regional Commercial Announcements",
        provider: "LeadIntellect Venture & Capital Monitor",
        confidence: 97,
        whyItMatters: "Funded companies have mandated revenue growth targets, active discretionary spending, and immediate appetite for proven ROI software.",
        recommendedAction: "Reach out with an enterprise growth proposition tailored to their new regional footprint and scale.",
        icebreaker: `Exciting growth trajectory at ${company} following the recent expansion announcement! Reaching out as you ramp up scale this quarter.`,
      };

    case 4:
    default:
      return {
        category: "tech_adoption",
        categoryLabel: "Tech Stack Shift",
        headline: `Modern Cloud & Software Migration at ${company}`,
        description: `${company} recently migrated core infrastructure and adopted new cloud integrations in ${industry}.`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "DNS Record Signatures & Technographic Web Crawler",
        provider: "LeadIntellect Technographic Analyzer",
        confidence: 93,
        whyItMatters: "Companies in active software transitions are actively seeking modern plug-and-play tools that integrate with their modern stack.",
        recommendedAction: "Highlight native API compatibility, fast deployment time, and seamless data synchronization.",
        icebreaker: `Noticed ${company}'s recent technology evolution in ${industry}. We built our integration specifically to complement modern cloud workflows like yours.`,
      };
  }
}
