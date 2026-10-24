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
  Search,
  BookmarkPlus,
  ShieldCheck,
  Layers,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDemoVideoModal from "@/components/ProductDemoVideoModal";
import { YouTubeIcon } from "@/components/SocialIcons";

const officialDemo = {
  id: "official-product-demo",
  title: "LeadIntellect End-to-End Product Walkthrough & Masterclass",
  tagline: "How to Search Leads, Create Custom Lists, Verify Emails, and Launch AI Cadences",
  duration: "4:45",
  level: "Complete Platform Tour",
  category: "Official Product Walkthrough",
  youtubeChannelUrl: "https://www.youtube.com/@Leadintellect",
  summary:
    "A comprehensive, step-by-step masterclass demonstrating every core workflow in LeadIntellect. Learn how to search 50,000+ verified decision-makers, apply granular ICP filters, create and segment target lists, reveal verified emails using your 99 free evaluation credits, and generate high-converting 1:1 outbound cadences in seconds.",
  chapters: [
    {
      time: "0:00 - 1:15",
      title: "1. How to Search Leads with Natural Language & Filters",
      desc: "Translating plain English prompts into structured Boolean chips (Seniority, Industry, Location, Headcount) with 0-100 ICP fit scoring.",
      icon: Search,
    },
    {
      time: "1:15 - 2:10",
      title: "2. How to Create, Segment & Manage Custom Lists",
      desc: "1-Click prospect selection, creating categorized lists ('Q4 Enterprise IT Targets'), tagging accounts, and exporting cleanly to CSV.",
      icon: BookmarkPlus,
    },
    {
      time: "2:10 - 3:05",
      title: "3. Contact Verification & 99 Free Credit Accounting",
      desc: "Revealing verified work emails and direct dials with real-time SMTP handshake and transparent 1-credit per lookup deduction.",
      icon: ShieldCheck,
    },
    {
      time: "3:05 - 4:00",
      title: "4. AI Outreach Studio & 4-Touch Cadences",
      desc: "Generating personalized 1:1 cold email icebreakers referencing buyer intent, follow-up touchpoints, and LinkedIn notes.",
      icon: Sparkles,
    },
    {
      time: "4:00 - 4:45",
      title: "5. People View, Company View & Deal Pipeline Stages",
      desc: "Seamless dual-view navigation and converting warm replies directly into Stage 6 revenue opportunities.",
      icon: Layers,
    },
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
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-3">
              <Video className="w-3.5 h-3.5" />
              PRODUCT WALKTHROUGH &amp; VIDEO MASTERCLASS
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              LeadIntellect Product Demo Walkthrough
            </h1>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              Master how to search verified leads, create custom lists, inspect deliverability, and launch AI cadences in under 5 minutes.
            </p>
          </div>

          {/* Single Featured Official Product Demo Card */}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-border shadow-xl overflow-hidden">
            {/* Top Video Player Stage */}
            <div
              className="relative aspect-video bg-navy overflow-hidden group cursor-pointer"
              onClick={() => setDemoModalOpen(true)}
            >
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
                  Click to Play Official Product Demo Walkthrough
                </p>
                <p className="text-xs text-teal mt-1 font-semibold">
                  Interactive 5-Chapter Demonstration &bull; {officialDemo.duration}
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
                    <span>Watch Interactive Walkthrough</span>
                  </button>

                  <a
                    href={officialDemo.youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-5 rounded-xl bg-[#ff0000] text-white hover:bg-[#cc0000] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <YouTubeIcon className="w-4 h-4" />
                    <span>YouTube Channel (@Leadintellect)</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-80" />
                  </a>

                  <a
                    href="/demo/index.html"
                    target="_blank"
                    className="w-full py-2.5 px-4 rounded-xl border border-border hover:border-navy text-navy font-semibold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-dark" />
                    <span>Download / View Video File</span>
                  </a>
                </div>
              </div>

              {/* Video Chapters & Capabilities */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy mb-4">
                  Walkthrough Chapters &amp; Demonstrated Workflows
                </h3>
                <div className="space-y-3">
                  {officialDemo.chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      onClick={() => setDemoModalOpen(true)}
                      className="p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-teal/50 hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-lg bg-navy text-teal flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal group-hover:text-navy transition-colors">
                          <ch.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy group-hover:text-teal-dark transition-colors">
                            {ch.title}
                          </p>
                          <p className="text-xs text-text-muted leading-relaxed mt-0.5">
                            {ch.desc}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 sm:pl-4">
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-md">
                          {ch.time}
                        </span>
                        <Play className="w-3.5 h-3.5 text-teal-dark opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live Demo CTA */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-navy text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-teal/30">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Need a live personalized walkthrough for your sales team?</h3>
              <p className="text-xs text-white/70">
                Book a confidential 15-minute product session with Raghu to configure your custom ICP queries.
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
