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
  Mail,
  CheckCircle2,
  Calendar,
  Clock,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDemoVideoModal from "@/components/ProductDemoVideoModal";
import { WEB_INTENT_PLATFORMS } from "@/lib/intent";

export default function ResourcesPage() {
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterCompany, setNewsletterCompany] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setNewsletterSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail,
          fullName: newsletterName,
          company: newsletterCompany,
          interest: "Weekly B2B Sales Intelligence & Intent Playbooks",
        }),
      });
      if (res.ok) {
        setNewsletterSuccess(true);
        setTimeout(() => {
          setNewsletterModalOpen(false);
          setNewsletterSuccess(false);
          setNewsletterEmail("");
          setNewsletterName("");
          setNewsletterCompany("");
        }, 2200);
      } else {
        alert("Unable to process subscription. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setNewsletterSubmitting(false);
    }
  };

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
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setNewsletterModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal text-navy font-bold text-xs hover:bg-teal-dark hover:text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Subscribe to Weekly Newsletter</span>
              </button>
            </div>
          </div>

          {/* FEATURED: Weekly Flagship Industry Article (LinkedIn Verbatim Publication) */}
          <div className="mb-14 rounded-3xl bg-white border border-teal/30 p-8 sm:p-10 shadow-lg relative overflow-hidden group">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="max-w-3xl space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-teal text-navy tracking-wider">
                    Weekly Featured Article &bull; Editorial Series
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> October 31, 2026
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 7 min read
                  </span>
                </div>

                <Link
                  href="/blog/future-b2b-prospecting-isnt-finding-more-leads-its-why"
                  className="block group-hover:text-teal-dark transition-colors"
                >
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight leading-tight">
                    The Future of B2B Prospecting Isn&apos;t Finding More Leads. It&apos;s Knowing Why Now.
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-normal">
                  An industry perspective on why the next generation of B2B sales intelligence must go beyond contact databases. Sales teams don&apos;t have a shortage of leads—they have a shortage of context. Discover the five core capabilities shaping modern pipeline creation and the WHO, WHY, PAIN, FIT, and NEXT framework.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/blog/future-b2b-prospecting-isnt-finding-more-leads-its-why"
                    className="px-5 py-2.5 rounded-xl bg-navy text-teal hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Read Complete Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href="https://www.linkedin.com/pulse/future-b2b-prospecting-isnt-finding-more-leads-its-why-drn-consulting-gthvf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-text-muted hover:text-navy flex items-center gap-1"
                  >
                    <span>View on LinkedIn Pulse</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Author badge */}
              <div className="shrink-0 p-5 rounded-2xl bg-surface border border-border text-center space-y-2 min-w-[200px]">
                <div className="w-12 h-12 rounded-full bg-navy text-teal font-extrabold flex items-center justify-center text-sm mx-auto shadow-2xs border border-teal/20">
                  DRN
                </div>
                <div className="font-bold text-xs text-navy">D RN</div>
                <div className="text-[11px] text-text-muted leading-tight">
                  Founder &amp; CEO<br />DRN Consulting / LeadIntellect
                </div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-teal/15 text-teal-dark">
                  15+ Yrs B2B Sales
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Product Demo Video Banner */}
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
                    <strong className="text-navy">Live Web Indexing</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Newsletter Subscription CTA Box */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl mb-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" />
                <span>Executive Editorial Newsletter</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                One Actionable B2B Sales Intelligence Guide Every Week
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Written by seasoned revenue practitioners. Get breakdown teardowns on buyer intent detection, zero-decay deliverability hygiene, and ICP qualification math.
              </p>
            </div>
            <div className="w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setNewsletterModalOpen(true)}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Subscribe Free &rarr;</span>
              </button>
            </div>
          </div>

          {/* Section 3: XMagnet 1-Million Global Partner Intelligence */}
          <div className="p-8 rounded-3xl bg-white border border-border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-dark uppercase tracking-wider">
                <Database className="w-3.5 h-3.5 text-teal-dark" />
                <span>1,000,000+ Record Partner Intelligence Network</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy">
                Powered by XMagnet Global Data Partnership
              </h3>
              <p className="text-xs text-text-muted max-w-xl leading-relaxed">
                LeadIntellect is integrated with XMagnet&apos;s 1-million record global B2B database. Sourced with real-time SMTP handshakes, multi-tier deliverability checking, and anti-scraping safeguards. Access is securely gated to verified subscribers.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/pricing"
                className="px-5 py-2.5 rounded-xl bg-navy text-teal hover:bg-slate-800 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>View Plans &amp; Activate Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
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

      {/* Newsletter Subscription Modal */}
      {newsletterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setNewsletterModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal/15 text-teal-dark flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-navy">
                Subscribe to LeadIntellect Dispatch
              </h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                One in-depth B2B prospecting &amp; buyer intent article every week. Delivered straight to your inbox without fail.
              </p>
            </div>

            {newsletterSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p>You&apos;re subscribed! Look out for our weekly executive edition.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Work Email <span className="text-teal">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs text-navy focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Sarah Connor"
                    value={newsletterName}
                    onChange={(e) => setNewsletterName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs text-navy focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Inc."
                    value={newsletterCompany}
                    onChange={(e) => setNewsletterCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs text-navy focus:outline-none focus:border-teal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={newsletterSubmitting}
                  className="w-full py-3 rounded-xl bg-teal hover:bg-teal-dark text-navy hover:text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {newsletterSubmitting ? "Subscribing..." : "Subscribe to Weekly Insights →"}
                </button>

                <p className="text-[11px] text-text-muted text-center pt-1">
                  Zero spam. Unsubscribe at any time with one click.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
