"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video,
  Play,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Download,
  Share2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDemoVideoModal from "@/components/ProductDemoVideoModal";
import { YouTubeIcon } from "@/components/SocialIcons";

const officialDemo = {
  id: "official-product-demo",
  title: "LeadIntellect End-to-End Product Demo & Walkthrough",
  tagline: "From Whole-Web Buyer Intent to Verified Decision-Makers & Outbound Cadences",
  duration: "4:30",
  level: "Full Product Tour",
  category: "Official Product Masterclass",
  youtubeChannelUrl: "https://www.youtube.com/@Leadintellect",
  summary:
    "An end-to-end walkthrough showing how high-growth B2B sales teams identify verified prospects across SaaS, Healthcare, and Enterprise IT. Discover how to leverage 7-channel intent data, filter by granular ICP parameters, verify emails with transparent credit deduction, and draft personalized outreach sequences in seconds.",
  keyCapabilities: [
    "Whole-Web Buyer Intent: Monitor G2 review spikes, Reddit technical discussions, Quora inquiries, and SEC capital filings in real time.",
    "ICP Discovery & Granular Filters: Query 50,000+ verified decision-makers across US, India, and global markets with 0-100 fit scoring.",
    "Zero-Decay Deliverability Verification: Multi-tier SMTP and MX verification with transparent credit accounting (only 99 credits for free accounts).",
    "4-Step AI Outreach Studio: Generate context-tailored cold emails, follow-up icebreakers, and objection-handling battlecards with 1 click.",
  ],
};

export default function TutorialsPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container-page">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-3">
              <Video className="w-3.5 h-3.5" />
              PRODUCT DEMO &amp; MASTERCLASS
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              LeadIntellect Product Demo
            </h1>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              Explore our official product tour demonstrating how to search, qualify, verify, and engage high-value B2B decision-makers.
            </p>
          </div>

          {/* Single Featured Official Product Demo Card */}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-border shadow-xl overflow-hidden">
            {/* Top Video Player Stage */}
            <div className="relative aspect-video bg-navy overflow-hidden group cursor-pointer" onClick={() => setDemoModalOpen(true)}>
              {/* Background Glow */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-[#0B132B] via-[#0E2044] to-[#12315E] group-hover:scale-105 transition-transform duration-700"
              />

              {/* Decorative Animated Tech Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

              {/* Center Play Button */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-teal text-navy flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <p className="mt-4 text-base sm:text-lg font-bold text-white drop-shadow-sm">
                  Click to Watch Official Product Walkthrough
                </p>
                <p className="text-xs text-teal mt-1 font-semibold">
                  Interactive 4-Scene Demonstration &bull; {officialDemo.duration}
                </p>
              </div>

              {/* Duration & Badge */}
              <div className="absolute top-4 left-4 z-10 bg-teal text-navy text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Official Product Demo
              </div>
              <div className="absolute bottom-4 right-4 z-10 bg-navy/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 shadow-md">
                <Clock className="w-3.5 h-3.5 text-teal" />
                {officialDemo.duration}
              </div>
            </div>

            {/* Video Details & Actions */}
            <div className="p-6 sm:p-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-border pb-8">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-dark bg-teal/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> {officialDemo.level}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
                    {officialDemo.title}
                  </h2>
                  <p className="text-sm font-medium text-teal-dark">
                    {officialDemo.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed pt-2">
                    {officialDemo.summary}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col gap-3 shrink-0 sm:w-64">
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(true)}
                    className="w-full py-3 px-5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Watch Interactive Demo</span>
                  </button>

                  <a
                    href={officialDemo.youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-5 rounded-xl bg-[#ff0000] text-white hover:bg-[#cc0000] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <YouTubeIcon className="w-4 h-4" />
                    <span>Visit YouTube Channel</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-80" />
                  </a>

                  <Link
                    href="/dashboard"
                    className="w-full py-2.5 px-4 rounded-xl border border-border hover:border-navy text-navy font-semibold text-xs text-center transition-colors"
                  >
                    Open Live Platform
                  </Link>
                </div>
              </div>

              {/* Key Features Breakdown */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy mb-4">
                  What You Will See in This Demo
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {officialDemo.keyCapabilities.map((cap, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-border bg-surface flex items-start gap-3 hover:border-teal/40 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-dark shrink-0 mt-0.5" />
                      <p className="text-xs text-text-muted leading-relaxed font-normal">
                        {cap}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live Demo CTA */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-navy text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-teal/30">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Want a 1-on-1 Personalized Walkthrough?</h3>
              <p className="text-xs text-white/70">
                Book a confidential 15-minute product session with our leadership team for custom query setup.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a
                href="mailto:raghu@lead-intellect.com?subject=Personalized%20LeadIntellect%20Demo%20Request"
                className="text-xs font-semibold px-5 py-2.5 rounded-xl border border-white/20 hover:border-teal text-white transition-colors"
              >
                Email Raghu
              </a>
              <Link
                href="/book-demo"
                className="text-xs font-bold px-5 py-2.5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white transition-colors"
              >
                Book VIP Demo
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Product Demo Walkthrough Modal */}
      <ProductDemoVideoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
