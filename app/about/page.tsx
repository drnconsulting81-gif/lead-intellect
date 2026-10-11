import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Database,
  Brain,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | Transparent B2B Intelligence | LeadIntellect",
  description:
    "Our mission is to make B2B prospecting more useful, transparent, and actionable through verified business data and contextual intelligence.",
  alternates: {
    canonical: "https://lead-intellect.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Hero Section */}
        <section className="container-page text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            OUR STORY &amp; MISSION
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy tracking-tight leading-tight">
            Transparent Data &middot; Truthful Verification &middot;{" "}
            <span className="bg-gradient-to-r from-teal-dark to-violet bg-clip-text text-transparent">
              Clean B2B Search.
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-text-muted leading-relaxed">
            LeadIntellect helps B2B teams discover companies and decision-makers, organize prospect data,
            and prioritize opportunities using transparent search criteria and data quality information.
          </p>
        </section>

        {/* Mission & Vision Section */}
        <section className="container-page mt-20">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mission Card */}
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal-dark flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-dark">The Problem We Solve</span>
              <h2 className="text-xl font-bold text-navy mt-1">
                Data Decay &amp; Blind Outreach
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-text-muted leading-relaxed">
                Raw contact volume without verification creates wasted effort and damages sender reputation.
                We bridge the gap by combining structured business search with truthful data provenance,
                so you understand why an account matters before taking action.
              </p>
              <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-xs font-semibold text-navy">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Transparent verification &middot; Contextual fit scoring</span>
              </div>
            </div>

            {/* Product Philosophy */}
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-violet/10 text-violet flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet">Our Philosophy</span>
              <h2 className="text-xl font-bold text-navy mt-1">
                Provider-Neutral &amp; Responsible
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-text-muted leading-relaxed">
                We believe in owning the user workspace while keeping data infrastructure modular. We respect
                recipient privacy through our suppression registry and never fabricate confidence scores
                or artificial signals.
              </p>
              <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-xs font-semibold text-navy">
                <CheckCircle2 className="w-4 h-4 text-violet" />
                <span>Server-enforced credits &middot; Respectful communications</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="container-page mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-navy">Our Core Product Principles</h2>
            <p className="text-xs text-text-muted mt-2">
              The foundational standards that guide every feature we build
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border p-6 bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-teal-dark flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-navy">Actionable Intelligence</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                Rather than dumping raw contact lists, we help answer five core questions: Who should I target?
                Why does this company match? How reliable is the data? What is the next step?
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6 bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-teal-dark flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-navy">Truthful Statuses</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                We label every record accurately. If an email is verified, we report it. If it is an unverified
                syntax pattern or unavailable, we state it clearly without simulation.
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6 bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-teal-dark flex items-center justify-center mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-navy">Sustainable Growth</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                As a self-funded startup, we build for long-term customer utility rather than inflated hype.
                Our focus is reliable data, clean workflows, and transparent pricing.
              </p>
            </div>
          </div>
        </section>

        {/* Product Roadmap Section */}
        <section className="container-page mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-navy">Product Roadmap &amp; Milestones</h2>
            <p className="text-xs text-text-muted mt-2">
              Transparent visibility into what we have launched and what is actively in development
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border p-6 bg-white shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-dark bg-teal/10 px-2 py-0.5 rounded-full">Phase 1 &middot; Live</span>
              <h3 className="text-sm font-bold text-navy mt-3">Core Discovery &amp; Provenance</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                Cleaned master database of 50,000+ decision-makers, dual People/Company search modes, granular structured filters, server-enforced credit accounting, and transparent email deliverability statuses.
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6 bg-white shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">Phase 2 &middot; Live</span>
              <h3 className="text-sm font-bold text-navy mt-3">Prospect Intelligence &amp; Workflows</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                Deep profile dossiers (WHO, WHY, FIT, SIGNALS), personalized 1:1 outreach draft generator, lightweight sales pipeline deal tracker, and CSV import/export mapping.
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6 bg-white shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">Phase 3 &middot; In Progress</span>
              <h3 className="text-sm font-bold text-navy mt-3">Provider Connectors &amp; Webhooks</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                Bi-directional webhook notifications for CRM updates, automated batch enrichment queues, team workspace permission roles, and direct API adapters.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-page mt-20">
          <div className="max-w-4xl mx-auto rounded-3xl bg-navy text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Experience the LeadIntellect Workspace
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-white/70 max-w-lg mx-auto">
              Start with 100 free evaluation credits and discover high-fit B2B accounts today.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-white text-navy px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-sm"
              >
                START FREE
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
              >
                CONTACT US
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
