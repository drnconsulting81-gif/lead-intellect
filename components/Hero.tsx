import Link from "next/link";
import { CheckCircle2, Sparkles, Search, Filter } from "lucide-react";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section id="top" className="relative pt-36 pb-20 overflow-hidden bg-white">
      <div
        aria-hidden
        className="absolute -top-32 right-0 w-[560px] h-[560px] rounded-full opacity-[0.14] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-teal), var(--color-violet))" }}
      />
      <div className="container-page grid lg:grid-cols-[1.05fr_0.95fr] gap-12 xl:gap-16 items-center relative">
        <Reveal>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            B2B PROSPECT &amp; ACCOUNT INTELLIGENCE
          </div>

          <h1 className="mt-6 text-[2.6rem] leading-[1.08] sm:text-5xl font-extrabold text-navy max-w-xl tracking-tight">
            Find the companies.{" "}
            <span className="bg-gradient-to-r from-teal-dark to-violet bg-clip-text text-transparent">
              Find the people.
            </span>{" "}
            Know who matters.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-text-muted max-w-lg leading-relaxed">
            Discover B2B companies and decision-makers, refine your target audience, enrich business data,
            and identify the prospects worth pursuing.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-navy px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition-all shadow-md shadow-navy/10"
            >
              START FREE
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy hover:border-navy hover:bg-surface transition-colors"
            >
              EXPLORE THE PLATFORM
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 50,000+ Cleaned Master Contacts
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Provider-Neutral Architecture
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Transparent Provenance
            </span>
          </div>
        </Reveal>

        {/* Distinctive Product Preview: Natural Language Query -> Structured Editable Filters */}
        <Reveal delay={120}>
          <div className="relative rounded-2xl border border-border bg-surface p-5 shadow-[0_20px_60px_-24px_rgba(11,18,32,0.18)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold tracking-wider text-navy uppercase">
                  Natural Query Translation
                </span>
              </div>
              <span className="text-[10px] font-semibold text-violet bg-violet/10 border border-violet/20 rounded-full px-2.5 py-0.5">
                Illustrative example
              </span>
            </div>

            {/* Input prompt preview */}
            <div className="rounded-xl bg-white border border-border p-3 flex items-center gap-2.5 shadow-2xs mb-3">
              <Search className="w-4 h-4 text-teal-dark shrink-0" />
              <p className="text-xs font-medium text-navy truncate">
                Find operations leaders at US manufacturing companies with 500–5,000 employees.
              </p>
            </div>

            {/* Structured editable filter chips */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted mb-2">
                <Filter className="w-3.5 h-3.5 text-teal-dark" />
                <span>Interpreted Structured Filters:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 bg-white border border-border text-[11px] font-medium text-navy px-2.5 py-1 rounded-lg">
                  <span className="text-text-muted">Country:</span> United States
                </span>
                <span className="inline-flex items-center gap-1 bg-white border border-border text-[11px] font-medium text-navy px-2.5 py-1 rounded-lg">
                  <span className="text-text-muted">Industry:</span> Manufacturing
                </span>
                <span className="inline-flex items-center gap-1 bg-white border border-border text-[11px] font-medium text-navy px-2.5 py-1 rounded-lg">
                  <span className="text-text-muted">Role:</span> Operations VP / Director
                </span>
                <span className="inline-flex items-center gap-1 bg-white border border-border text-[11px] font-medium text-navy px-2.5 py-1 rounded-lg">
                  <span className="text-text-muted">Employees:</span> 500–5,000
                </span>
              </div>
            </div>

            {/* Matching Result Preview */}
            <div className="rounded-xl bg-white border border-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-navy">Sarah Jenkins</p>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                      Deliverable Email
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    VP, Global Plant Operations &middot; Apex Precision Manufacturing
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-extrabold text-navy leading-none">94</p>
                  <p className="text-[10px] text-teal-dark font-semibold">ICP Fit &middot; Tier 1</p>
                </div>
              </div>

              {/* 5-Question Prospect Intelligence Box */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg bg-surface border border-border p-2">
                  <p className="font-bold text-navy text-[10px] mb-0.5">WHO</p>
                  <p className="text-text-muted text-[11px] leading-tight">Head of 6 manufacturing facilities.</p>
                </div>
                <div className="rounded-lg bg-surface border border-border p-2">
                  <p className="font-bold text-navy text-[10px] mb-0.5">WHY</p>
                  <p className="text-text-muted text-[11px] leading-tight">Direct fit for operations intelligence.</p>
                </div>
                <div className="rounded-lg bg-surface border border-border p-2">
                  <p className="font-bold text-navy text-[10px] mb-0.5">DATA QUALITY</p>
                  <p className="text-text-muted text-[11px] leading-tight">Corporate MX pattern verified.</p>
                </div>
                <div className="rounded-lg bg-surface border border-border p-2">
                  <p className="font-bold text-navy text-[10px] mb-0.5">NEXT ACTION</p>
                  <p className="text-text-muted text-[11px] leading-tight">Draft tailored operations introduction.</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-text-muted border-t border-border pt-2.5">
                <span>Location: <b className="text-navy">Chicago, IL, US</b></span>
                <span>Provenance: <b className="text-navy">Master B2B Index</b></span>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="mt-3.5 w-full block text-center text-xs font-bold text-navy bg-teal/20 hover:bg-teal/30 border border-teal/40 rounded-xl py-2.5 transition-colors"
            >
              Run This Search in Discover
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
