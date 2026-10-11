import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Building2,
  ShieldCheck,
  Sparkles,
  FileSpreadsheet,
  Send,
  Kanban,
  Brain,
  Sliders,
  Check,
  Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Product Architecture & Capabilities | LeadIntellect",
  description:
    "Explore LeadIntellect's core prospecting workspace: People search, company discovery, truthful email verification, fit scoring, lists, and lightweight sales pipeline.",
  alternates: {
    canonical: "https://lead-intellect.com/product",
  },
};

const implementedFeatures = [
  {
    icon: Users,
    title: "People Discovery",
    status: "Available Now",
    description:
      "Search across 50,000+ cleaned master decision-makers. Filter by normalized seniority (C-Suite, VP, Director, Manager), job titles, functions, and verified email status.",
  },
  {
    icon: Building2,
    title: "Company Search",
    status: "Available Now",
    description:
      "Query 8,630+ indexed B2B organizations by domain, industry, geographic headquarters, employee headcount tier, and decision-maker coverage density.",
  },
  {
    icon: Sliders,
    title: "Natural-Language Search Translation",
    status: "Available Now",
    description:
      "Type queries like 'Operations VPs at US manufacturing firms with 500+ employees' and watch our engine translate your intent into editable structured filter chips.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Verification & Provenance",
    status: "Available Now",
    description:
      "We never slap a generic 'verified' badge on unverified data. Every record displays honest provenance: verified original, company MX pattern, or unverified.",
  },
  {
    icon: Brain,
    title: "Prospect Fit Scoring (WHO, WHY, FIT)",
    status: "Available Now",
    description:
      "Objective 1-100 ICP fit scoring calculated from seniority, company scale, location alignment, and verified reachability factors.",
  },
  {
    icon: FileSpreadsheet,
    title: "CSV Import & Export Engine",
    status: "Available Now",
    description:
      "Import your own prospecting lists with smart auto-column mapping and duplicate protection. Export selected records with server-enforced quotas.",
  },
  {
    icon: Send,
    title: "Factual Outreach Studio",
    status: "Available Now",
    description:
      "Generate cold email introductions, follow-up messages, LinkedIn notes, and phone call openers grounded strictly in known facts without fictitious hallucinations.",
  },
  {
    icon: Kanban,
    title: "Lightweight Sales Pipeline",
    status: "Available Now",
    description:
      "A fast, distraction-free Kanban board with 6 standard stages (Lead Identified, Contacted, Demo Booked, Proposal, Closed Won, Closed Lost) to track prospect progress.",
  },
];

const roadmapFeatures = [
  {
    title: "Multi-Provider Automated Waterfall",
    phase: "Q1 Roadmap",
    description:
      "Automated cascading across live XMagnet, ZeroBounce, and Hunter endpoints when local master cache is incomplete.",
  },
  {
    title: "Native Email Sending & Sequences",
    phase: "Q2 Roadmap",
    description:
      "Direct SMTP inbox connection with unsubscribe handling and bounce protection.",
  },
  {
    title: "Bi-Directional CRM Synchronization",
    phase: "Q2 Roadmap",
    description:
      "Two-way synchronization webhooks for HubSpot and Salesforce pipeline syncing.",
  },
];

export default function ProductPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <section className="container-page text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            CORE WORKSPACE ARCHITECTURE
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy tracking-tight leading-tight">
            Built for Discovery.{" "}
            <span className="bg-gradient-to-r from-teal-dark to-violet bg-clip-text text-transparent">
              Engineered for Action.
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-text-muted leading-relaxed">
            LeadIntellect connects high-integrity B2B data with structured prospecting workflows.
            Here is an honest breakdown of what is available today and what is on our engineering roadmap.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md shadow-navy/10"
            >
              START FREE
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl border border-border text-navy text-xs font-bold uppercase tracking-wider hover:bg-surface transition-all"
            >
              EXPLORE DISCOVER WORKSPACE
            </Link>
          </div>
        </section>

        {/* Implemented Features Grid */}
        <section className="container-page mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-navy">Live Platform Capabilities</h2>
                <p className="text-xs text-text-muted mt-1">
                  Fully operational features ready for production prospecting sessions
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                8 Modules Operational
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {implementedFeatures.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-navy flex items-center justify-center">
                        <f.icon className="w-5 h-5 text-teal-dark" />
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {f.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-navy">{f.title}</h3>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Future Roadmap Section */}
        <section className="container-page mt-20">
          <div className="max-w-6xl mx-auto rounded-2xl bg-slate-50 border border-slate-200 p-8 sm:p-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-navy">Engineering Roadmap &amp; Planned Releases</h2>
                <p className="text-xs text-text-muted mt-1">
                  We believe in transparency: these capabilities are currently under active development.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-200/80 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                In Development
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {roadmapFeatures.map((r, i) => (
                <div key={i} className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-dark bg-teal/10 px-2 py-0.5 rounded">
                    {r.phase}
                  </span>
                  <h4 className="text-sm font-bold text-navy mt-3">{r.title}</h4>
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
