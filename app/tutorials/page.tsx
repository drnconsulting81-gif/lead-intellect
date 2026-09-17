"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video,
  Play,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Sliders,
  Database,
  Bot,
  Layers,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tutorials = [
  {
    id: "tut-1",
    title: "Quickstart: Configuring Your First 0-100 ICP Scoring Model",
    duration: "4:15",
    level: "Beginner",
    category: "ICP Framework",
    summary:
      "A step-by-step walkthrough of setting company size, revenue, tech stack, and role weights to compute automated composite scores.",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ", // safe sample
    steps: [
      "Define target industry verticals and excluded segments",
      "Assign weight factors to seniority and job titles",
      "Preview Tier 1 threshold scoring before launching live searches",
    ],
  },
  {
    id: "tut-2",
    title: "Prompting the AI Prospecting Agent: From Plain English to 87 Qualified Leads",
    duration: "6:30",
    level: "Intermediate",
    category: "AI Agent",
    summary:
      "Learn how to structure natural language prompts to pinpoint specific buying committees in healthcare, fintech, and enterprise SaaS.",
    steps: [
      "Translating target customer personas into agent parameters",
      "Reviewing illustrative output stats across Tiers 1-3",
      "Refining search geography and employee count ranges",
    ],
  },
  {
    id: "tut-3",
    title: "Multi-Source Enrichment: Activating Apollo & Business Email Verification",
    duration: "5:45",
    level: "Intermediate",
    category: "Data Enrichment",
    summary:
      "How LeadIntellect connects with approved data partners like Apollo to retrieve verified corporate emails without unauthorized scraping.",
    steps: [
      "Connecting your API keys or using native LeadIntellect credits",
      "Checking data verification flags (Verified, Deliverable, High Confidence)",
      "Understanding compliance and bounce-rate mitigation",
    ],
  },
  {
    id: "tut-4",
    title: "Reviewing Prospect Context & Executing Next Best Actions",
    duration: "3:50",
    level: "Advanced",
    category: "Outreach Strategy",
    summary:
      "How to use the AI-generated pain point intelligence and context summary to tailor discovery call conversation angles.",
    steps: [
      "Reviewing the WHO, WHY, PAIN, and FIT prospect cards",
      "Generating authentic, human-reviewed email icebreakers",
      "Logging recommended next steps into your CRM workflow",
    ],
  },
];

export default function TutorialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<typeof tutorials[0] | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container-page">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-3">
              <Video className="w-3.5 h-3.5" />
              PRODUCT ACADEMY &amp; VIDEO TUTORIALS
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              Master B2B Sales Intelligence in Minutes
            </h1>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              Watch interactive walkthroughs showing how to configure your ICP, command the AI prospecting agent, and unlock verified pipeline.
            </p>
          </div>

          {/* Video Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {tutorials.map((tut) => (
              <div
                key={tut.id}
                className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-teal/50 transition-all flex flex-col"
              >
                {/* Video Mock Player Thumbnail */}
                <div
                  onClick={() => setSelectedVideo(tut)}
                  className="relative aspect-video bg-navy flex items-center justify-center cursor-pointer group overflow-hidden"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-20 bg-gradient-to-tr from-teal via-navy to-violet group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="relative z-10 w-14 h-14 rounded-full bg-teal text-navy flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                  <div className="absolute bottom-3 right-3 z-10 bg-navy/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/10">
                    <Clock className="w-3 h-3 text-teal" />
                    {tut.duration}
                  </div>
                  <div className="absolute top-3 left-3 z-10 bg-teal text-navy text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {tut.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold text-navy leading-snug">
                      {tut.title}
                    </h2>
                    <p className="mt-2 text-xs text-text-muted leading-relaxed">
                      {tut.summary}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/80">
                      <p className="text-[11px] font-semibold text-navy mb-2">Key skills learned:</p>
                      <ul className="space-y-1.5">
                        {tut.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-text-muted">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-dark shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-muted">
                      Level: <strong className="text-navy">{tut.level}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedVideo(tut)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-dark hover:text-navy cursor-pointer"
                    >
                      Watch Tutorial
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-white border border-border p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-navy">Need a custom training session for your SDR team?</h2>
              <p className="text-xs text-text-muted mt-1">
                Our sales engineering team provides complimentary onboarding workshops for all trial teams.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/book-demo"
                className="text-xs font-semibold px-5 py-2.5 rounded-xl border border-border hover:border-navy text-navy transition-colors"
              >
                Book Team Demo
              </Link>
              <Link
                href="/start-trial"
                className="text-xs font-semibold px-5 py-2.5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-navy rounded-2xl max-w-3xl w-full border border-white/20 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 flex items-center justify-between border-b border-white/10 text-white">
              <div>
                <span className="text-[10px] text-teal font-bold uppercase tracking-wider">
                  {selectedVideo.category}
                </span>
                <h3 className="text-sm font-bold text-white leading-tight">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive player area */}
            <div className="relative aspect-video bg-black flex items-center justify-center text-center p-6">
              <div className="max-w-md text-white">
                <div className="w-16 h-16 rounded-full bg-teal text-navy flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h4 className="text-lg font-bold">Interactive Video Simulation</h4>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">
                  Demonstrating live walkthrough of &ldquo;{selectedVideo.title}&rdquo; (Duration {selectedVideo.duration}).
                  In this module, you see the real LeadIntellect workspace scoring prospects in real time.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link
                    href="/start-trial"
                    onClick={() => setSelectedVideo(null)}
                    className="inline-flex items-center gap-1 text-xs font-bold bg-teal text-navy px-4 py-2 rounded-lg hover:bg-teal-dark hover:text-white transition-colors"
                  >
                    Try It in Live Sandbox
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-4 bg-navy-dark text-xs text-white/60 flex items-center justify-between">
              <span>LeadIntellect Product Learning Center</span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-teal hover:underline cursor-pointer"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
