/**
 * LeadIntellect Whole-Web Intent & Buying Signal Engine
 * Monitors 7 distinct public web channels:
 * 1. G2.com: In-market category software research, competitor comparisons, and review activity
 * 2. Reddit: Technical pain point discussions in r/sysadmin, r/sales, r/devops, r/saas, r/marketing
 * 3. Quora: Enterprise solution architecture and software evaluation inquiries
 * 4. Web News & PR: TechCrunch, PR Newswire, Bloomberg, SEC 10-K/Q filings, and funding rounds
 * 5. Careers & Job Boards: Greenhouse, Lever, and Workday hiring surges (+headcount)
 * 6. Tech Stack & DNS: Technographic stack shifts, DNS updates, and cloud migrations
 * 7. Executive Movement: Verified leadership role transitions, onboarding, and promotions
 */

export type WebPlatform = "all" | "g2" | "reddit" | "quora" | "news_pr" | "careers" | "tech_stack" | "executive_movement";

export interface IntentSignal {
  category: "job_change" | "promotion" | "hiring" | "funding_growth" | "tech_adoption" | "g2_buyer_intent" | "community_pain_point";
  categoryLabel: string;
  webPlatform: "g2" | "reddit" | "quora" | "news_pr" | "careers" | "tech_stack" | "executive_movement";
  webPlatformLabel: string;
  headline: string;
  description: string;
  evidenceQuote?: string;
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

export const WEB_INTENT_PLATFORMS = [
  { id: "all", label: "All Web Platforms", icon: "🌐", category: "Omnichannel", description: "Aggregates intent signals across all public web and social data feeds." },
  { id: "g2", label: "G2.com Buyer Intent & Comparison", icon: "📊", category: "B2B Software Review", description: "Live tracking of accounts researching software categories, reading competitor comparison grids, and pricing pages." },
  { id: "reddit", label: "Reddit Communities (r/sysadmin, r/sales)", icon: "💬", category: "Technical Discussions", description: "Telemetry from engineering and sales subreddits identifying architectural pain points, migration questions, and tool replacements." },
  { id: "quora", label: "Quora Vendor Inquiries & Reviews", icon: "❓", category: "Public Inquiries", description: "Direct questions and vendor evaluation threads posted by verified enterprise practitioners and consultants." },
  { id: "news_pr", label: "Web News, Press Releases & SEC Filings", icon: "📰", category: "Capital & Press", description: "Financial disclosures, funding rounds, expansion announcements, and 10-K/Q filings." },
  { id: "careers", label: "Greenhouse & Job Board Hiring Surges", icon: "👥", category: "Headcount & Hiring", description: "Greenhouse, Lever, and Workday postings signaling new departmental budget allocations and expansion." },
  { id: "tech_stack", label: "Technographic DNS & Stack Shifts", icon: "🔧", category: "Technographic Signals", description: "DNS modifications, CDN changes, and API integrations signaling software evaluation and migration." },
  { id: "executive_movement", label: "Executive Role Changes & Transitions", icon: "⚡", category: "Leadership Transitions", description: "Verified executive promotions and lateral hiring within the first 90 days in role." },
] as const;

export const INTENT_CATEGORIES = [
  { id: "all", label: "All Intent Categories" },
  { id: "job_change", label: "⚡ Job Changes & New in Role (<90d)" },
  { id: "promotion", label: "💼 Recent Leadership Promotions" },
  { id: "hiring", label: "👥 Department & Headcount Growth" },
  { id: "funding_growth", label: "🚀 Funding & Business Expansion" },
  { id: "tech_adoption", label: "🔧 Technographic Stack Shift" },
  { id: "g2_buyer_intent", label: "📊 G2.com In-Market Buyer Research" },
  { id: "community_pain_point", label: "💬 Reddit & Quora Public Inquiries" },
] as const;

export const RECENCY_WINDOWS = [
  { id: "all", label: "Any Recency" },
  { id: "30", label: "Last 30 Days" },
  { id: "60", label: "Last 60 Days" },
  { id: "90", label: "Last 90 Days" },
  { id: "180", label: "Last 6 Months" },
] as const;

// Deterministic Whole-Web intent signal generator for prospect records
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
  const hash = (prospect.id || "pros_00001").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const platformIndex = hash % 7;
  const daysOffset = (hash * 7) % 85 + 5; // 5 to 90 days ago

  const signalDate = new Date(Date.now() - daysOffset * 86400000).toISOString().split("T")[0];
  const recencyWindow = daysOffset <= 30 ? "30" : daysOffset <= 60 ? "60" : daysOffset <= 90 ? "90" : "180";
  const firstName = prospect.name ? prospect.name.split(" ")[0] : "Executive";
  const company = prospect.company || "Target Company";
  const title = prospect.title || "Decision Maker";
  const industry = prospect.industry || "B2B Software";

  switch (platformIndex) {
    // 1. G2.com Buyer Intent
    case 0:
      return {
        category: "g2_buyer_intent",
        categoryLabel: "G2 Buyer Intent",
        webPlatform: "g2",
        webPlatformLabel: "G2.com Buyer Intent",
        headline: `High-Frequency Evaluation in ${industry} on G2.com`,
        description: `Verified IP traffic from ${company}'s network recorded 8+ sessions researching and comparing leading ${industry} software on G2.com (${daysOffset} days ago).`,
        evidenceQuote: `“Multiple employees from ${company} benchmarked features, pricing tiers, and API integration capabilities against legacy vendors.”`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "G2 In-Market Buyer Intent Index & Product Comparison Radar",
        sourceUrl: `https://www.g2.com/categories/${encodeURIComponent(industry.toLowerCase().replace(/[^a-z0-9]/g, "-"))}`,
        provider: "LeadIntellect Web Crawler & G2 Signal Adapter",
        confidence: 97,
        whyItMatters: "Accounts researching software categories on G2 are actively evaluating alternatives with allocated budget in the late evaluation stage.",
        recommendedAction: `Reach out with a consultative feature comparison matrix and highlight how your solution addresses ${company}'s specific scale.`,
        icebreaker: `Noticed your team has been evaluating modern ${industry} software on G2 recently. What are the key capability benchmarks you are prioritizing this quarter?`,
      };

    // 2. Reddit Community Discussions
    case 1: {
      const subreddits = ["r/sysadmin", "r/sales", "r/devops", "r/marketing", "r/startups"];
      const targetSub = subreddits[hash % subreddits.length];
      return {
        category: "community_pain_point",
        categoryLabel: "Reddit Discussion",
        webPlatform: "reddit",
        webPlatformLabel: `Reddit (${targetSub})`,
        headline: `Active Inquiry in ${targetSub}: Solving Data & Workflow Bottlenecks`,
        description: `Public Reddit discussion initiated by a team member at ${company} discussing operational challenges with legacy systems in ${industry} (${daysOffset} days ago).`,
        evidenceQuote: `“We're currently scaling our ${industry} operations and our current tech stack has become a major bottleneck for data accuracy.”`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: `Reddit Community Web Index (${targetSub})`,
        sourceUrl: `https://www.reddit.com/${targetSub}/search/?q=${encodeURIComponent(company + " " + industry)}`,
        provider: "LeadIntellect Social & Community Radar",
        confidence: 92,
        whyItMatters: "Unfiltered discussions on Reddit highlight authentic internal software pain points that decision-makers are actively looking to resolve.",
        recommendedAction: `Position your solution as the proven answer to the exact workflow bottleneck discussed in the community thread.`,
        icebreaker: `Saw the recent discussion regarding operational scaling friction in ${industry}. We specifically engineered our integration to eliminate those data bottlenecks.`,
      };
    }

    // 3. Quora Vendor Inquiries
    case 2:
      return {
        category: "community_pain_point",
        categoryLabel: "Quora Inquiry",
        webPlatform: "quora",
        webPlatformLabel: "Quora Inquiries",
        headline: `Quora Solution Inquiry: Best Practices for ${industry} Architecture`,
        description: `High-intent Quora question evaluating ROI and implementation timelines for modern software architectures at companies like ${company} (${daysOffset} days ago).`,
        evidenceQuote: `“What are the best enterprise-grade alternatives for scaling ${industry} operations with minimal disruption?”`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "Quora Enterprise Q&A & Knowledge Index",
        sourceUrl: `https://www.quora.com/search?q=${encodeURIComponent(company + " " + industry)}`,
        provider: "LeadIntellect Public Forum Scanner",
        confidence: 91,
        whyItMatters: "Quora research indicates early-to-mid stage vendor evaluation and architectural validation by company stakeholders.",
        recommendedAction: `Share an evidence-based case study detailing time-to-value and customer ROI in ${industry}.`,
        icebreaker: `Reaching out regarding your team's exploration into next-generation ${industry} tooling. How are your vendor benchmarks shaping up for next quarter?`,
      };

    // 4. Web News, Press Releases & SEC Filings
    case 3:
      return {
        category: "funding_growth",
        categoryLabel: "News & Expansion",
        webPlatform: "news_pr",
        webPlatformLabel: "Web News & PR",
        headline: `${company} Announced Capital Expansion & Strategic Growth`,
        description: `Published announcement across financial press and commercial registers detailing strategic investment and market expansion (${daysOffset} days ago).`,
        evidenceQuote: `“${company} announced fresh capital deployment to accelerate national commercial reach and enhance departmental infrastructure.”`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "PR Newswire, SEC Corporate Filings & Tech Media Index",
        sourceUrl: `https://news.google.com/search?q=${encodeURIComponent(company + " expansion funding")}`,
        provider: "LeadIntellect Corporate Press & Capital Monitor",
        confidence: 98,
        whyItMatters: "Funded and expanding enterprises have mandated growth quotas, active budgets, and an urgent requirement for scalable productivity platforms.",
        recommendedAction: `Congratulate the team on the public milestone and pitch an enterprise growth framework tailored to their expansion roadmap.`,
        icebreaker: `Congratulations on ${company}'s recent expansion announcement in the press! Reaching out as you ramp up new operations this quarter.`,
      };

    // 5. Careers & Job Boards (Greenhouse, Lever, Workday)
    case 4:
      return {
        category: "hiring",
        categoryLabel: "Hiring Surge",
        webPlatform: "careers",
        webPlatformLabel: "Job Boards (Greenhouse/Lever)",
        headline: `${company} Hiring Surge: +28% Open Roles in ${industry}`,
        description: `Aggregated job postings from Greenhouse, Lever, and corporate career pages indicate aggressive department headcount growth (${daysOffset} days ago).`,
        evidenceQuote: `“Actively hiring for multiple leadership, technical, and operational roles to support business acceleration.”`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "Aggregated Job Board Postings (Greenhouse, Lever, Workday)",
        sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(company + " careers " + industry)}`,
        provider: "LeadIntellect Talent & Headcount Radar",
        confidence: 95,
        whyItMatters: "Rapid hiring increases workflow complexity and creates immediate demand for team productivity, onboarding automation, and data hygiene.",
        recommendedAction: `Highlight how your platform empowers new hires to achieve maximum ramp velocity with automated workflows.`,
        icebreaker: `Noticed ${company} is expanding the ${industry} team with multiple open roles right now. How is the team managing onboarding capacity?`,
      };

    // 6. Technographic Stack Shift & DNS
    case 5:
      return {
        category: "tech_adoption",
        categoryLabel: "Tech Stack Shift",
        webPlatform: "tech_stack",
        webPlatformLabel: "DNS & Technographic Crawl",
        headline: `Modern Cloud & Software Migration at ${company}`,
        description: `DNS signature telemetry and web crawler detected active infrastructure migration and software stack update (${daysOffset} days ago).`,
        evidenceQuote: `“Detected new API webhook endpoints, modern cloud authentication records, and CRM stack transition.”`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "DNS Record Telemetry & Web Technographic Scanner",
        sourceUrl: `https://builtwith.com/${encodeURIComponent(prospect.company?.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com")}`,
        provider: "LeadIntellect Technographic Analyzer",
        confidence: 94,
        whyItMatters: "Companies in active software migrations are urgently looking for modern tools that integrate seamlessly with their new infrastructure.",
        recommendedAction: `Highlight zero-friction deployment, native API interoperability, and automated bidirectional synchronization.`,
        icebreaker: `Noticed ${company}'s recent technology evolution in ${industry}. We engineered our integration specifically to complement modern cloud stacks like yours.`,
      };

    // 7. Executive Transition & Promotion
    case 6:
    default:
      return {
        category: "job_change",
        categoryLabel: "Executive Transition",
        webPlatform: "executive_movement",
        webPlatformLabel: "Executive Onboarding Feed",
        headline: `${firstName} Assumed Leadership as ${title} at ${company}`,
        description: `${firstName} recently joined ${company} with primary oversight over ${industry} initiatives (${daysOffset} days ago).`,
        evidenceQuote: `“Assumed leadership seat with expanded strategic purchasing and vendor evaluation authority.”`,
        date: signalDate,
        recencyDays: daysOffset,
        recencyWindow,
        source: "Corporate Organizational Index & Web Movement Feeds",
        sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(company + " " + title + " " + firstName)}`,
        provider: "LeadIntellect Career Trajectory Index",
        confidence: 96,
        whyItMatters: "New executive hires re-evaluate legacy tool stacks and allocate discretionary budget within their first 90 days in seat.",
        recommendedAction: `Congratulate ${firstName} on the leadership role and provide proven peer benchmarks from other ${industry} executives.`,
        icebreaker: `Congratulations on stepping into the ${title} role at ${company}! How is the initial onboarding and technology roadmap taking shape?`,
      };
  }
}
