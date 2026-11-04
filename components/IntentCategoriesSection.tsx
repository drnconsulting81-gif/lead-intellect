"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  UserCheck,
  Award,
  Users,
  TrendingUp,
  Layers,
  Search,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Reveal from "./Reveal";

interface IntentCategoryItem {
  id: string;
  name: string;
  shortLabel: string;
  badge: string;
  icon: typeof Zap;
  timingTrigger: string;
  telemetrySources: string[];
  evidenceQuote: string;
  aiIcebreaker: string;
  conversionMetric: string;
  metricLabel: string;
  whyItMatters: string;
}

const INTENT_CATEGORIES: IntentCategoryItem[] = [
  {
    id: "job_change",
    name: "Executive Movement & New Hires",
    shortLabel: "⚡ Executive Moves (<90d)",
    badge: "New Budget Mandate",
    icon: UserCheck,
    timingTrigger: "71% of newly appointed executives re-evaluate incumbent software vendors and sign new contracts within their first 90 days to implement their proven playbook.",
    telemetrySources: ["SEC Form 8-K filings", "Corporate Press Releases", "LinkedIn Executive Telemetry", "Company Leadership pages"],
    evidenceQuote: "“Sarah Jenkins appointed Chief Information Officer at Apex Financial, announcing immediate enterprise tech review.”",
    aiIcebreaker: "“Saw you recently joined Apex Financial as CIO. As you evaluate the existing stack during your first 90 days, how are you ensuring your sales and revenue teams have verified contact data?”",
    conversionMetric: "3.8x",
    metricLabel: "Higher Reply Rate",
    whyItMatters: "Reaching a new VP before their vendor stack is locked eliminates competitive RFPs.",
  },
  {
    id: "promotion",
    name: "Leadership Promotions & Mandate Expansions",
    shortLabel: "💼 Leadership Promotions",
    badge: "Expanded Authority",
    icon: Award,
    timingTrigger: "Internal promotions carry fresh executive trust, approved expansion budgets, and newly appointed leaders eager to demonstrate rapid operational improvements.",
    telemetrySources: ["Internal Promotion Telemetry", "Title Elevation Radar", "Corporate Org Chart Sensors"],
    evidenceQuote: "“Promoted to Vice President of Enterprise Sales from Director after leading team to 140% quota achievement.”",
    aiIcebreaker: "“Congrats on the promotion to VP of Enterprise Sales! With your expanded mandate for 2026, are you looking at automated buyer intent to keep your SDRs focused on closed-won pipeline?”",
    conversionMetric: "2.9x",
    metricLabel: "Faster Sales Cycle",
    whyItMatters: "Promoted executives already know internal pain points and have direct authority to approve budgets.",
  },
  {
    id: "hiring",
    name: "Hiring Surges & Team Expansion",
    shortLabel: "👥 Hiring Surges",
    badge: "Scaling Demand",
    icon: Users,
    timingTrigger: "Sudden spikes in SDR, AE, or engineering job openings signal imminent need for additional software seats, verified prospect data, and workflow automation.",
    telemetrySources: ["Greenhouse & Lever Telemetry", "Workday Career Portals", "Indeed & LinkedIn Job Feeds"],
    evidenceQuote: "“Posted 14 new Senior SDR, Account Executive, and Solutions Architect positions in the past 14 days.”",
    aiIcebreaker: "“Noticed you are ramping 14 new sales roles this month. How are you ensuring your incoming reps have verified mobile dials on Day 1 rather than wasting 20 hours/week manual prospecting?”",
    conversionMetric: "4.2x",
    metricLabel: "Meeting Booking Rate",
    whyItMatters: "New headcount requires immediate tooling to prevent ramp-up delays.",
  },
  {
    id: "funding_growth",
    name: "Growth Capital & Expansion Rounds",
    shortLabel: "🚀 Funding & Expansion",
    badge: "Capital Deployed",
    icon: TrendingUp,
    timingTrigger: "Fresh funding rounds come with mandatory ARR targets from investors and substantial budgets earmarked for go-to-market software.",
    telemetrySources: ["SEC EDGAR Filings", "Crunchbase Venture Radar", "PR Newswire & BusinessWire Feeds"],
    evidenceQuote: "“Closed $38M Series B financing round led by Horizon Ventures to accelerate enterprise GTM and expand into EMEA.”",
    aiIcebreaker: "“Huge congratulations on the $38M Series B! With aggressive board targets ahead, we help funded teams scale verified pipeline without hiring bloated SDR overhead.”",
    conversionMetric: "5.1x",
    metricLabel: "Larger Deal Sizes",
    whyItMatters: "Funded companies have approved budgets that must be deployed quickly.",
  },
  {
    id: "tech_adoption",
    name: "Technographic Stack Shifts & Cloud Migrations",
    shortLabel: "🔧 Technographic Shifts",
    badge: "Infrastructure Change",
    icon: Layers,
    timingTrigger: "Companies transitioning CRMs, cloud providers, or data warehouses are actively purchasing complementary integrations and data migration tools.",
    telemetrySources: ["DNS & MX Record Crawlers", "Web Header Telemetry", "SSL & CDN Infrastructure Telemetry"],
    evidenceQuote: "“DNS and MX records updated from legacy on-premise Exchange to Google Cloud & Salesforce CRM endpoints.”",
    aiIcebreaker: "“Saw that your engineering team recently completed your migration to Salesforce & AWS. Our native CRM bridge was built specifically to keep your new pipeline clean with zero duplicate entries.”",
    conversionMetric: "65%",
    metricLabel: "Higher Win Rate",
    whyItMatters: "Tech transitions create a natural opening to replace legacy point solutions.",
  },
  {
    id: "g2_buyer_intent",
    name: "G2.com In-Market Buyer Research",
    shortLabel: "📊 G2.com Buyer Intent",
    badge: "Active Evaluation",
    icon: Search,
    timingTrigger: "Corporate IP traffic repeatedly researching category grids, competitor comparison charts, and pricing tiers represents the highest intent in B2B sales.",
    telemetrySources: ["G2 Buyer Intent Network", "Peer Review Grid Telemetry", "Vendor Comparison Traffic"],
    evidenceQuote: "“Multiple visits to B2B Sales Intelligence category grids, alternatives pages, and competitor pricing tables in the last 14 days.”",
    aiIcebreaker: "“I noticed your team has been evaluating sales intelligence platforms on G2 recently. Wondering what benchmarks you're prioritizing—data accuracy, mobile coverage, or native CRM automation?”",
    conversionMetric: "7.4x",
    metricLabel: "In-Market Propensity",
    whyItMatters: "In-market buyers have already secured budget and are actively choosing a vendor.",
  },
  {
    id: "community_pain_point",
    name: "Community Pain Points & Forum Inquiries",
    shortLabel: "💬 Community Pain Points",
    badge: "Unmet Need",
    icon: MessageSquare,
    timingTrigger: "Decision makers and practitioners venting about high bounce rates, stale databases, or vendor pricing in forums are looking for immediate alternatives.",
    telemetrySources: ["Reddit r/sales Discussions", "Quora Inquiries", "GitHub & Hacker News Threads"],
    evidenceQuote: "“Looking for an alternative to ZoomInfo that actually has valid direct dials and doesn't lock you into $15,000 multi-year contracts.”",
    aiIcebreaker: "“Came across discussions regarding high bounce rates and predatory multi-year contracts in the sales community. We built LeadIntellect with 98% guaranteed deliverability and transparent pay-as-you-grow pricing.”",
    conversionMetric: "82%",
    metricLabel: "Positive Response Tone",
    whyItMatters: "Directly solves a burning friction point the buyer just publicly discussed.",
  },
];

export default function IntentCategoriesSection() {
  const [selectedId, setSelectedId] = useState<string>("job_change");
  const activeItem = INTENT_CATEGORIES.find((item) => item.id === selectedId) || INTENT_CATEGORIES[0];
  const Icon = activeItem.icon;

  return (
    <section className="py-24 bg-surface-subtle text-navy relative overflow-hidden border-y border-border">
      {/* Background Decorative Glow */}
      <div
        aria-hidden
        className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-teal), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 left-0 w-[450px] h-[450px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-violet), transparent)" }}
      />

      <div className="container-page relative">
        {/* Section Header */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-dark bg-teal/10 border border-teal/25 px-3.5 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5 text-teal-dark" />
              <span>WHOLE-WEB BUYER INTENT TELEMETRY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight">
              7 Buying Intent Categories That Signal In-Market Pipeline
            </h2>
            <p className="text-text-muted text-base sm:text-lg leading-relaxed">
              Timing is 80% of sales conversion. LeadIntellect continuously scans verified public signals, job boards, DNS changes, and peer review grids so you reach decision-makers right when their budget is unlocked.
            </p>
          </div>
        </Reveal>

        {/* Category Pill Switcher */}
        <Reveal delay={60}>
          <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {INTENT_CATEGORIES.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-navy text-white shadow-md scale-102 ring-2 ring-teal/30"
                      : "bg-white text-slate-700 hover:text-navy hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <ItemIcon className={`w-3.5 h-3.5 ${isSelected ? "text-teal" : "text-slate-400"}`} />
                  <span>{item.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Detailed Category Showcase Card */}
        <Reveal delay={120}>
          <div className="mt-8 max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-10 space-y-8">
              {/* Card Top: Title, Badge, Conversion Metric */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal/15 border border-teal/30 flex items-center justify-center shrink-0 text-teal-dark shadow-xs">
                    <Icon className="w-6 h-6 text-teal-dark" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
                      {activeItem.badge}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-navy">
                      {activeItem.name}
                    </h3>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3 text-right self-start sm:self-center shrink-0">
                  <div className="text-2xl sm:text-3xl font-black text-teal-dark tracking-tight">
                    {activeItem.conversionMetric}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {activeItem.metricLabel}
                  </div>
                </div>
              </div>

              {/* Grid: Why It Matters & Telemetry Sources */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Why Contact Now?
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {activeItem.timingTrigger}
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    <strong>Impact:</strong> {activeItem.whyItMatters}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Telemetry &amp; Audit Sources
                  </h4>
                  <ul className="space-y-2">
                    {activeItem.telemetrySources.map((source) => (
                      <li key={source} className="flex items-center gap-2 text-xs text-navy font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal shrink-0" />
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Verifiable Evidence Quote Box */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Detected Signal Evidence
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Verified Signal
                  </span>
                </div>
                <p className="text-sm font-semibold text-navy italic">
                  {activeItem.evidenceQuote}
                </p>
              </div>

              {/* AI Outreach Icebreaker Preview */}
              <div className="rounded-2xl p-5 bg-gradient-to-r from-navy to-slate-900 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-teal">
                    <Sparkles className="w-4 h-4 text-teal" />
                    <span>AI Contextual Icebreaker (Ready for Outreach)</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">Human-Approved</span>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans bg-white/5 p-3.5 rounded-xl border border-white/10">
                  {activeItem.aiIcebreaker}
                </p>
                <p className="text-[11px] text-white/50">
                  LeadIntellect weaves verified signal dates and pain points into personalized 1-to-1 cold emails and LinkedIn messages in 2 seconds.
                </p>
              </div>

              {/* CTA Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-text-muted text-center sm:text-left">
                  Explore thousands of accounts currently surging in this category with verified direct contacts.
                </p>
                <Link
                  href={`/dashboard?intentCategory=${activeItem.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal hover:bg-teal-light text-navy font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
                >
                  <span>Search {activeItem.name} Leads</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
