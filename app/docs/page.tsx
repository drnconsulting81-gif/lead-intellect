import type { Metadata } from "next";
import {
  BookOpen,
  Search,
  ListPlus,
  ShieldCheck,
  Coins,
  FileSpreadsheet,
  Plug,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Documentation & User Guide | LeadIntellect",
  description:
    "Official documentation for LeadIntellect: Getting started, search and filtering, lists, verification, credits, CSV imports, and integrations.",
  alternates: {
    canonical: "https://lead-intellect.com/docs",
  },
};

const docSections = [
  {
    id: "getting-started",
    icon: BookOpen,
    title: "1. Getting Started",
    description:
      "Creating your account, navigating the global menu, understanding your starting 100-credit evaluation balance, and running your initial B2B search.",
    tips: [
      "Every new user receives 100 free evaluation credits on signup.",
      "Browse the Discover workspace without consuming any credits until you choose to reveal contact details.",
      "The global navigation provides instant access to Discover, Lists, Outreach, Pipeline, and Data.",
    ],
  },
  {
    id: "search-filters",
    icon: Search,
    title: "2. Search & Structured Filters",
    description:
      "How to search people and companies, use natural-language query translation, and refine by seniority, industry, location, and headcount.",
    tips: [
      "Type conversational queries like 'CFOs at Indian manufacturing firms' — the engine translates them into editable filter chips.",
      "Seniority tiers are normalized into C-Suite, VP, Director, Manager, Founder, and Professional / IC.",
      "Use the 'Verified Only' toggle to restrict search results to records with pre-verified corporate email addresses.",
    ],
  },
  {
    id: "lists",
    icon: ListPlus,
    title: "3. Prospect Lists & Saved Searches",
    description:
      "Organizing high-priority target accounts into custom lists, saving complex structured filter combinations, and tracking team research.",
    tips: [
      "Select multiple prospects from the results table and click 'Add to List' to group candidates.",
      "Click 'Save Search' on any filtered view to store the exact criteria for one-click re-execution later.",
      "Lists can be exported directly to CSV or moved into your sales pipeline.",
    ],
  },
  {
    id: "verification-enrichment",
    icon: ShieldCheck,
    title: "4. Verification & Enrichment",
    description:
      "Understanding LeadIntellect's honest provenance badges, deliverability statuses, and provider adapter capabilities.",
    tips: [
      "Statuses include: Verified Original (direct sourced), Company MX Pattern (format confirmed), and Unverified.",
      "Revealing or enriching a contact checks the internal master database and available external adapters (e.g. XMagnet).",
      "We never return synthetic or randomly generated phone numbers if direct lines are unavailable.",
    ],
  },
  {
    id: "credits",
    icon: Coins,
    title: "5. Credits & Usage System",
    description:
      "How credits are charged, server-side balance enforcement, and inspecting your complete transaction audit ledger.",
    tips: [
      "1 credit is consumed per contact detail reveal or standalone verification check.",
      "Searching, filtering, and previewing company metrics never consume credits.",
      "Failed lookups or unverified records are never charged against your balance.",
    ],
  },
  {
    id: "csv-import-export",
    icon: FileSpreadsheet,
    title: "6. CSV Import & Export Workflows",
    description:
      "Uploading custom prospect sheets with automatic column mapping, duplicate detection, suppression filtering, and downloading data.",
    tips: [
      "The CSV importer inspects your header row and suggests auto-mappings for Name, Company, Email, Phone, and Title.",
      "Contacts on the suppression registry are automatically skipped during import.",
      "Exports produce standard RFC-compliant CSV files with comprehensive metadata.",
    ],
  },
  {
    id: "integrations",
    icon: Plug,
    title: "7. Integrations & Provider Adapters",
    description:
      "Connecting external providers like XMagnet, ZeroBounce, and Hunter through server-side environment configurations.",
    tips: [
      "Live adapters are activated securely by providing API keys in production environment settings.",
      "The Integrations page provides honest health checks showing whether an adapter is connected, awaiting credentials, or offline.",
    ],
  },
  {
    id: "troubleshooting",
    icon: HelpCircle,
    title: "8. Troubleshooting & Common Questions",
    description:
      "Resolving common filter broadness issues, credit balance questions, and password recovery procedures.",
    tips: [
      "If a search returns 0 matches, broaden your location or employee range filter.",
      "To request suppression of your business email address, use the Data Use & Privacy opt-out form.",
      "For commercial plan upgrades or dedicated assistance, reach out via the Contact page.",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <section className="container-page text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            PLATFORM USER GUIDE
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy tracking-tight leading-tight">
            LeadIntellect Documentation
          </h1>
          <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
            Everything you need to discover accounts, verify contact information, manage lists, and
            navigate the platform effectively.
          </p>
        </section>

        {/* Documentation Sections */}
        <section className="container-page mt-16 max-w-5xl mx-auto">
          <div className="space-y-8">
            {docSections.map((sec) => (
              <div
                key={sec.id}
                id={sec.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal-dark flex items-center justify-center shrink-0 mt-0.5">
                    <sec.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-navy">{sec.title}</h2>
                    <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                      {sec.description}
                    </p>

                    <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-navy mb-2">
                        Key Points &amp; Best Practices:
                      </h4>
                      <ul className="space-y-1.5">
                        {sec.tips.map((tip, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed"
                          >
                            <span className="text-teal-dark font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
