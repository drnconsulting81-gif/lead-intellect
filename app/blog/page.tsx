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
    title: "The Modern B2B Prospecting Dilemma: Why 73% of Outbound Fails in SaaS, IT & FinTech—And How Structured Lead Intelligence Restores Pipeline Efficiency",
    category: "Industry Analysis",
    date: "October 22, 2026",
    readTime: "8 min read",
    summary:
      "Static lead sheets decay quickly. Deep industry analysis examining cold outreach decay across SaaS, IT Managed Services, and FinTech—and how LeadIntellect's structured data verification and search criteria deliver higher qualified pipeline efficiency.",
    isFeatured: true,
  },
  {
    id: "1",
    slug: "/blog/ai-b2b-lead-intelligence-industry-playbook",
    title: "The Shift Away from Cold List Dumping: Why Context-First Prospecting Improves Response Quality",
    category: "AI Prospecting",
    date: "October 15, 2026",
    readTime: "5 min read",
    summary:
      "B2B buyers are fatigued by generic email blasts. Discover why account context, business criteria, and relevant positioning lead to significantly higher response quality and engagement.",
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
                    <Calendar className="w-3.5 h-3.5" /> {featured.date}
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
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Sparkles className="w-4 h-4 text-teal" />
                    <span className="font-semibold text-white">LeadIntellect Intelligence Desk</span>
                    <span className="text-white/40">&bull;</span>
                    <span className="text-white/70">{featured.date}</span>
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
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Calendar className="w-3.5 h-3.5 text-teal-dark" />
                    <span>{art.date}</span>
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
