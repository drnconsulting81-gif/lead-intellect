"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, User, ArrowRight, Sparkles, Tag, TrendingUp, ShieldCheck, Database, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["All", "Industry Analysis", "AI Prospecting", "ICP Scoring", "Data Compliance", "Sales Strategy"];

const articles = [
  {
    id: "featured",
    slug: "/blog/ai-b2b-lead-intelligence-industry-playbook",
    title: "The Modern B2B Prospecting Dilemma: Why 73% of Outbound Fails in SaaS, IT & FinTech—And How AI Lead Intelligence Restores 3.8x ROI",
    category: "Industry Analysis",
    date: "September 17, 2026",
    readTime: "8 min read",
    author: "Devon Vance",
    role: "Head of GTM Strategy",
    summary:
      "Static lead sheets are dead. Deep industry analysis examining cold outreach decay across SaaS, IT Managed Services, and FinTech—and how LeadIntellect's dual AI + zero-decay verified database framework delivers 3.8x higher qualified pipeline ROI.",
    isFeatured: true,
  },
  {
    id: "1",
    slug: "/blog/ai-b2b-lead-intelligence-industry-playbook",
    title: "The Death of Cold List Dumping: Why Context-First Prospecting Converts 3.4x Higher",
    category: "AI Prospecting",
    date: "September 10, 2026",
    readTime: "5 min read",
    author: "Devon Vance",
    role: "Head of GTM Strategy",
    summary:
      "B2B buyers are immune to generic email blasts. Discover why account context, recent triggers, and explicit 'why you matter' summaries yield 3.4x higher response rates.",
  },
  {
    id: "2",
    slug: "/blog/ai-b2b-lead-intelligence-industry-playbook",
    title: "How Algorithmic ICP Scoring (0–100) Eliminates Pipeline Bloat for SDRs",
    category: "ICP Scoring",
    date: "September 4, 2026",
    readTime: "7 min read",
    author: "Maya Lin",
    role: "VP of Product Intelligence",
    summary:
      "Learn how to construct a composite ICP score using firmographics, employee headcount brackets, and tech stack telemetry into Tier 1, Tier 2, and Tier 3 priority segments.",
  },
  {
    id: "3",
    slug: "/blog/ai-b2b-lead-intelligence-industry-playbook",
    title: "B2B Sales Compliance in 2026: The Serious Risks of Unauthorized LinkedIn Scraping",
    category: "Data Compliance",
    date: "August 28, 2026",
    readTime: "6 min read",
    author: "Marcus Chen",
    role: "Data Governance Lead",
    summary:
      "Unauthorized scraping tools are causing domain blacklisting and account bans. Here is why approved third-party integrations and compliant APIs protect your pipeline.",
  },
  {
    id: "4",
    slug: "/blog/ai-b2b-lead-intelligence-industry-playbook",
    title: "Human-in-the-Loop AI: How Sales Teams Retain Authenticity While Scaling Outreach",
    category: "Sales Strategy",
    date: "August 19, 2026",
    readTime: "4 min read",
    author: "Devon Vance",
    role: "Head of GTM Strategy",
    summary:
      "Why fully automated autonomous spam bots fail, and how AI-suggested 'Next Best Actions' empower sales reps to personalize at 10x speed without losing the human touch.",
  },
  {
    id: "5",
    slug: "/blog/ai-b2b-lead-intelligence-industry-playbook",
    title: "Enrichment Beyond Email: Why Intent Signals and Buying Committee Mapping Matter",
    category: "AI Prospecting",
    date: "August 12, 2026",
    readTime: "8 min read",
    author: "Arjun Mehta",
    role: "Enterprise Solutions Architect",
    summary:
      "Discover how connecting Apollo and multi-source enrichment providers gives you verified mobile dials, verified corporate emails, and exact reporting structures.",
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const featured = articles[0];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container-page">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet bg-violet/10 border border-violet/20 px-3.5 py-1.5 rounded-full mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              LEADINTELLECT INSIGHTS &amp; RESEARCH
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              B2B Sales Intelligence &amp; Prospecting Blog
            </h1>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              Actionable guides, data compliance analysis, and ICP scoring playbooks written by revenue leaders and AI practitioners.
            </p>
          </div>

          {/* Featured Hero Article Banner */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="rounded-3xl border border-teal/30 bg-gradient-to-br from-navy via-[#0c1e3d] to-navy p-8 sm:p-10 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-teal text-navy tracking-wider">
                    Featured Industry Guide
                  </span>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 8 min read
                  </span>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> September 17, 2026
                  </span>
                </div>

                <Link href={featured.slug} className="block group-hover:text-teal transition-colors">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                    {featured.title}
                  </h2>
                </Link>

                <p className="mt-4 text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl font-normal">
                  {featured.summary}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal text-navy flex items-center justify-center text-xs font-extrabold">
                      DV
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{featured.author}</p>
                      <p className="text-[11px] text-white/60">{featured.role}</p>
                    </div>
                  </div>

                  <Link
                    href={featured.slug}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-navy font-bold text-xs hover:bg-teal-dark hover:text-white transition-all shadow-md group-hover:translate-x-1"
                  >
                    <span>Read Full Industry Playbook</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-navy text-teal shadow-xs"
                    : "bg-white text-text-muted hover:text-navy border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filtered.map((art) => (
              <div
                key={art.id}
                className="rounded-2xl border border-border bg-white p-6 flex flex-col justify-between hover:shadow-md hover:border-teal/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-dark bg-teal/10 px-2.5 py-0.5 rounded-full">
                      <Tag className="w-3 h-3" /> {art.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-text-muted">
                      <Clock className="w-3 h-3" /> {art.readTime}
                    </span>
                  </div>

                  <Link href={art.slug} className="block">
                    <h2 className="text-base font-bold text-navy leading-snug group-hover:text-teal-dark transition-colors">
                      {art.title}
                    </h2>
                  </Link>
                  <p className="mt-3 text-xs text-text-muted leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-navy text-teal flex items-center justify-center text-xs font-bold">
                      {art.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy leading-tight">{art.author}</p>
                      <p className="text-[10px] text-text-muted">{art.role}</p>
                    </div>
                  </div>

                  <Link
                    href={art.slug}
                    className="text-xs font-semibold text-teal-dark group-hover:translate-x-1 transition-transform flex items-center gap-1"
                  >
                    Read
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter / CTA box */}
          <div className="mt-16 max-w-3xl mx-auto rounded-2xl bg-navy text-white p-8 text-center border border-teal/30 shadow-lg">
            <h2 className="text-xl font-bold text-white">Subscribe to The Sales Intelligence Dispatch</h2>
            <p className="mt-2 text-xs text-white/70 max-w-md mx-auto">
              Join 12,000+ CROs and sales development leaders receiving our bi-weekly breakdown of B2B prospecting data.
            </p>
            <div className="mt-5 flex max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="Enter your work email"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-teal"
              />
              <button
                type="button"
                onClick={() => alert("Thank you for subscribing to our research digest!")}
                className="bg-teal text-navy px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-teal-dark hover:text-white transition-colors cursor-pointer shrink-0"
              >
                Subscribe Free
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
