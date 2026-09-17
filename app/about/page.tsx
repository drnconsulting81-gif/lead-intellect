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
  Users2,
  Cpu,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | Mission, Vision & B2B Intelligence",
  description:
    "Learn about LeadIntellect's mission to eliminate manual B2B prospecting with AI intelligence, verified decision-maker datasets, and predictive ICP scoring.",
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
            ABOUT LEADINTELLECT
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy tracking-tight leading-tight">
            Turning Sales Research into{" "}
            <span className="bg-gradient-to-r from-teal-dark to-violet bg-clip-text text-transparent">
              Sales Intelligence
            </span>
          </h1>
          <p className="mt-6 text-lg text-text-muted leading-relaxed">
            We started LeadIntellect with a simple conviction: B2B sales teams shouldn&apos;t spend
            70% of their workday wrestling with outdated spreadsheets, generic databases, and cold outreach guesses.
          </p>
        </section>

        {/* Mission & Vision Section */}
        <section className="container-page mt-20">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mission Card */}
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm relative overflow-hidden group hover:border-teal/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal-dark flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-dark">Our Mission</span>
              <h2 className="text-2xl font-extrabold text-navy mt-1">
                Empower Revenue Teams to Focus on Conversations, Not Research
              </h2>
              <p className="mt-4 text-sm text-text-muted leading-relaxed">
                Our mission is to eliminate the manual prospecting burden by replacing static lists with an autonomous, context-aware AI agent. We enable sales professionals to uncover high-conversion accounts, understand exact buyer pain points, and engage with precision.
              </p>
              <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-xs font-semibold text-navy">
                <CheckCircle2 className="w-4 h-4 text-teal-dark" />
                <span>Zero guesswork &middot; Human-first sales execution</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm relative overflow-hidden group hover:border-violet/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-violet/10 text-violet flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet">Our Vision</span>
              <h2 className="text-2xl font-extrabold text-navy mt-1">
                The Global Intelligence Standard for B2B Pipeline Growth
              </h2>
              <p className="mt-4 text-sm text-text-muted leading-relaxed">
                We envision a future where every go-to-market organization is powered by explainable, compliant AI that connects intent signals, multi-source verified data, and custom ICP scoring. No spam, no dead ends—just transparent pipeline velocity.
              </p>
              <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-xs font-semibold text-navy">
                <CheckCircle2 className="w-4 h-4 text-violet" />
                <span>Explainable AI &middot; Industry-wide data compliance</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Lead-Intellect Section */}
        <section className="container-page mt-24">
          <div className="max-w-xl mx-auto text-center mb-16">
            <span className="text-xs font-bold text-teal-dark uppercase tracking-wider">The Difference</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mt-2">
              Why Lead-Intellect?
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              Here is how we contrast against legacy lead vendors and why modern sales leaders choose us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border p-6 bg-white hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-navy text-teal flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy">Context Over Raw Lists</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                Legacy databases dump 1,000 email addresses without explanation. LeadIntellect synthesizes company background, growth triggers, and why each account is worth your time.
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6 bg-white hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal-dark flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy">Algorithmic ICP Scoring (0-100)</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                Define your ideal customer criteria. Our engine scores every prospect dynamically from 0 to 100 into Tier 1 (High Priority), Tier 2, and Tier 3 so reps always target the best leads first.
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6 bg-white hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-violet/10 text-violet flex items-center justify-center mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy">Multi-Source Verified Data</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                Connected with approved third-party enrichment providers (including Apollo and upcoming partners). Verified business emails and direct dials you can trust.
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6 bg-white hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-navy text-teal flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy">Ethical &amp; Compliant</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                We do NOT perform unauthorized LinkedIn scraping. We protect your company&apos;s sender reputation, domain authority, and comply with international data regulations.
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6 bg-white hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal-dark flex items-center justify-center mb-4">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy">Human-in-the-Loop Control</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                We recommend the Next Best Action and generate personalized icebreakers, but your sales reps review and approve outreach before sending, keeping communication authentic.
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6 bg-white hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-violet/10 text-violet flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy">Measurable Pipeline ROI</h3>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                Teams using LeadIntellect report a 3.4x increase in discovery call conversion rates and 60% reduction in prospect research time within 30 days.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="container-page mt-24">
          <div className="max-w-4xl mx-auto rounded-3xl bg-navy text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div
              aria-hidden
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] opacity-20 blur-3xl pointer-events-none"
              style={{ background: "linear-gradient(90deg, var(--color-teal), var(--color-violet))" }}
            />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Ready to Upgrade Your Sales Intelligence?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/70 max-w-xl mx-auto">
              Join leading B2B sales teams who have stopped chasing blind lead lists and started closing qualified pipeline.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/start-trial"
                className="inline-flex items-center justify-center rounded-xl bg-teal px-7 py-3.5 text-sm font-semibold text-navy hover:bg-teal-dark hover:text-white transition-colors shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/book-demo"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white hover:border-white/50 transition-colors"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
