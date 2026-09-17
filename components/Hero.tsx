import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section id="top" className="relative pt-36 pb-20 overflow-hidden bg-white">
      <div
        aria-hidden
        className="absolute -top-32 right-0 w-[560px] h-[560px] rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-teal), var(--color-violet))" }}
      />
      <div className="container-page grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center relative">
        <Reveal>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            AI-POWERED B2B SALES INTELLIGENCE
          </div>

          <h1 className="mt-6 text-[2.6rem] leading-[1.08] sm:text-5xl font-extrabold text-navy max-w-xl">
            Find the Right Buyers.{" "}
            <span className="bg-gradient-to-r from-teal-dark to-violet bg-clip-text text-transparent">
              Understand Why They Matter.
            </span>
          </h1>

          <p className="mt-6 text-lg text-text-muted max-w-md leading-relaxed">
            LeadIntellect helps sales teams discover the right accounts and decision-makers,
            enrich business data, understand prospect context, score ICP fit and know exactly
            who to contact next.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/start-trial"
              className="inline-flex items-center justify-center rounded-lg bg-teal px-6 py-3.5 text-sm font-semibold text-navy hover:bg-teal-dark hover:text-white transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3.5 text-sm font-semibold text-navy hover:border-navy hover:bg-surface transition-colors"
            >
              Book a Demo
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-dark" /> Built for B2B sales teams
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-dark" /> Human-approved intelligence
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-dark" /> No black-box lead lists
            </span>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative rounded-2xl border border-border bg-surface p-5 shadow-[0_20px_60px_-24px_rgba(11,18,32,0.25)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold tracking-wide text-text-muted">
                LEAD INTELLIGENCE
              </span>
              <span className="text-[10px] font-semibold text-violet bg-violet/10 border border-violet/20 rounded-full px-2.5 py-1">
                Illustrative Example
              </span>
            </div>

            <div className="rounded-xl bg-white border border-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-navy">MedCore Healthcare</p>
                  <p className="text-xs text-text-muted mt-0.5">Arjun Mehta &middot; VP, Business Development</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-extrabold text-navy leading-none">92</p>
                  <p className="text-[10px] text-text-muted">/100 &middot; Tier 1</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
                <div className="rounded-lg bg-surface border border-border p-2.5">
                  <p className="font-semibold text-navy mb-0.5">WHO</p>
                  <p className="text-text-muted">VP responsible for growth partnerships and expansion.</p>
                </div>
                <div className="rounded-lg bg-surface border border-border p-2.5">
                  <p className="font-semibold text-navy mb-0.5">WHY</p>
                  <p className="text-text-muted">Matches healthcare ICP and target company size.</p>
                </div>
                <div className="rounded-lg bg-surface border border-border p-2.5">
                  <p className="font-semibold text-navy mb-0.5">PAIN</p>
                  <p className="text-text-muted">Possible gaps in facility &amp; vendor visibility.</p>
                </div>
                <div className="rounded-lg bg-surface border border-border p-2.5">
                  <p className="font-semibold text-navy mb-0.5">FIT</p>
                  <p className="text-text-muted">Strong match on profile, role and context.</p>
                </div>
              </div>

              <div className="mt-3 rounded-lg bg-navy p-2.5">
                <p className="text-[11px] font-semibold text-teal mb-0.5">NEXT</p>
                <p className="text-[11px] text-white/80">
                  Recommend a discovery conversation on operational efficiency.
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-text-muted border-t border-border pt-3">
                <span>Business email: <b className="text-navy">Verified</b></span>
                <span>LinkedIn: <b className="text-navy">Available</b></span>
                <span>Source: <b className="text-navy">Apollo</b></span>
              </div>
            </div>

            <Link
              href="/book-demo"
              className="mt-4 w-full block text-center text-xs font-semibold text-navy bg-teal/90 rounded-lg py-2.5 hover:bg-teal transition-colors"
            >
              Request Discovery Call
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
