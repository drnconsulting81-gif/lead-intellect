"use client";

import { Search, ShieldCheck, BrainCircuit, ArrowRightCircle, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "DISCOVER",
    subtitle: "Precision Account Search",
    text: "Find verified accounts and key decision-makers across 50,000+ records matching your exact ICP criteria.",
    badge: "Multi-Filter Engine",
  },
  {
    step: "02",
    icon: ShieldCheck,
    title: "VERIFY",
    subtitle: "Deliverability Handshake",
    text: "Real-time MX checks, direct dial validation, and multi-source verification protect your domain reputation.",
    badge: "98% Deliverable",
  },
  {
    step: "03",
    icon: BrainCircuit,
    title: "UNDERSTAND",
    subtitle: "Algorithmic ICP Fit",
    text: "Convert raw firmographic data into deep prospect intelligence with automated 0-100 fit scoring.",
    badge: "Predictive Tiers",
  },
  {
    step: "04",
    icon: ArrowRightCircle,
    title: "ACT",
    subtitle: "Contextual Outreach",
    text: "Engage decision-makers with AI-crafted icebreakers, pain point angles, and pipeline stage automation.",
    badge: "Next Best Action",
  },
];

export default function TrustStrip() {
  return (
    <section className="relative py-14 sm:py-18 bg-gradient-to-b from-[#f8fafc] via-white to-[#f8fafc] border-y border-slate-200 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-32 bg-teal/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container-page relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-teal-dark bg-teal/10 border border-teal/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal" />
              End-to-End Prospect Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              From Raw Discovery to Confident Outreach
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative">
            {/* Animated connecting beam line behind cards on desktop */}
            <div className="hidden lg:block absolute top-[4.5rem] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-teal/30 via-navy/30 to-teal/30 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal to-transparent animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {steps.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-teal/50 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Step Number Badge */}
                    <div className="absolute -top-3.5 bg-navy text-teal font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full border border-teal/30 shadow-xs">
                      STEP {item.step}
                    </div>

                    {/* Step Icon Container with glowing aura */}
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center mt-2 group-hover:scale-110 group-hover:border-teal/40 group-hover:bg-teal/5 transition-all duration-300">
                      <IconComponent
                        className="w-6 h-6 text-navy group-hover:text-teal-dark transition-colors"
                        strokeWidth={2}
                      />
                      <span className="absolute -inset-1 rounded-2xl bg-teal/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="mt-4 text-sm font-extrabold tracking-wider text-navy uppercase">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-bold text-teal-dark mt-0.5">
                      {item.subtitle}
                    </p>

                    {/* Description */}
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {item.text}
                    </p>

                    {/* Micro Tag */}
                    <span className="mt-4 inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-teal/10 group-hover:text-teal-dark transition-colors">
                      {item.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
