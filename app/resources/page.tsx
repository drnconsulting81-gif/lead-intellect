"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Video,
  BookOpen,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  FileSpreadsheet,
  ArrowRight,
  Database,
  ExternalLink,
  Kanban,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDemoVideoModal from "@/components/ProductDemoVideoModal";
import { WEB_INTENT_PLATFORMS } from "@/lib/intent";

export default function ResourcesPage() {
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container-page max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              LEADINTELLECT RESOURCE CENTER &amp; ACADEMY
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-navy tracking-tight">
              Master B2B Prospecting &amp; Whole-Web Intent
            </h1>
            <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
              Explore product walkthrough videos, whole-web signal frameworks, outbound cadences, and master data collations.
            </p>
          </div>

          {/* FEATURED: Interactive Product Demo Video Banner */}
          <div className="mb-14 rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-700">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal text-navy text-xs font-extrabold uppercase tracking-wider">
                <Video className="w-3.5 h-3.5" />
                Featured Product Walkthrough
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Watch the Complete LeadIntellect Product Tour (4-Scene Interactive Demo)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Experience our real-time intent radar across G2, Reddit, Quora &amp; Web News, combined with verified multi-source contact discovery and automated 4-step SDR sequence execution.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDemoVideoOpen(true)}
                  className="px-6 py-3 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Interactive Demo Video (4:30)</span>
                </button>
                <Link
                  href="/dashboard"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/15 transition-all"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual Demo Preview Graphic */}
            <div
              onClick={() => setDemoVideoOpen(true)}
              className="absolute -right-8 -bottom-8 w-96 h-64 rounded-2xl bg-white/5 border border-white/10 p-4 hidden lg:block cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="h-full rounded-xl bg-navy/80 border border-teal/30 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Live Intent Radar
                  </span>
                  <span className="text-[10px] bg-teal/20 text-teal px-2 py-0.5 rounded">G2 &middot; Reddit &middot; Quora</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-teal text-navy flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">Click to start video walkthrough</div>
              </div>
            </div>
          </div>

          {/* Section 1: Whole-Web Intent Channels Grid */}
          <div className="mb-14 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-navy">Whole-Web Intent Sources</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Real-time algorithmic signal monitoring across consumer, developer, and B2B software channels.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-teal-dark hover:underline flex items-center gap-1"
              >
                <span>Filter by Platform in App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WEB_INTENT_PLATFORMS.filter((p) => p.id !== "all").map((plat) => (
                <div
                  key={plat.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal/40 transition-all space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl">
                    {plat.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy">{plat.label}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-dark">
                      {plat.category}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {plat.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Signal Recency:</span>
                    <strong className="text-navy">Live Web Scraping / Indexing</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Product Guides & Playbooks */}
          <div className="mb-14 space-y-6">
            <h3 className="text-xl font-bold text-navy">Playbooks &amp; Strategy Guides</h3>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <BookOpen className="w-6 h-6 text-teal-dark" />
                <h4 className="text-sm font-bold text-navy">0-100 Composite ICP Scoring</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  How our mathematical ICP weighting model eliminates SDR time waste by ranking accounts into Tier 1, Tier 2, and Tier 3 fit.
                </p>
                <Link
                  href="/tutorials"
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-dark hover:underline pt-2"
                >
                  <span>Read Framework</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h4 className="text-sm font-bold text-navy">Zero-Decay B2B Verification</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Multi-tier SMTP handshake, MX deliverability, and telephone line status validation before credits are charged.
                </p>
                <Link
                  href="/security"
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-dark hover:underline pt-2"
                >
                  <span>Verification Policy</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <Kanban className="w-6 h-6 text-indigo-600" />
                <h4 className="text-sm font-bold text-navy">4-Step Outbound Cadences</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Sequence blueprints engineered to achieve 28%+ reply rates through intent-grounded icebreakers and timed follow-ups.
                </p>
                <Link
                  href="/tutorials"
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-dark hover:underline pt-2"
                >
                  <span>View Cadence Templates</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Section 3: Master Database Collation & Integration */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 text-xs font-bold text-teal-dark uppercase tracking-wider">
                <Database className="w-3.5 h-3.5" />
                Enterprise Database Architecture
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy">
                Looking for the Unified Master Database Sheet?
              </h3>
              <p className="text-xs text-text-muted max-w-xl leading-relaxed">
                We have collated all 22 segregated spreadsheets and 299,880 rows into a clean, de-duplicated 51,578 record master dataset preserving all 37 metadata columns. Accessible via our CSV import and export modules.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-navy text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Open in Workspace</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Product Demo Video Modal */}
      <ProductDemoVideoModal
        isOpen={demoVideoOpen}
        onClose={() => setDemoVideoOpen(false)}
      />
    </div>
  );
}
