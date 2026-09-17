import Link from "next/link";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section id="cta" className="py-24 bg-navy text-white relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-[0.15] blur-3xl"
        style={{ background: "linear-gradient(90deg, var(--color-teal), var(--color-violet))" }}
      />
      <div className="container-page text-center relative">
        <Reveal>
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight max-w-2xl mx-auto">
            Stop Chasing Lists. Start Finding Opportunities.
          </h2>
          <p className="mt-5 text-white/60 max-w-xl mx-auto">
            Give your sales team an AI agent that understands who to target, why they matter
            and what to do next.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/start-trial"
              className="inline-flex items-center justify-center rounded-lg bg-teal px-7 py-3.5 text-sm font-semibold text-navy hover:bg-teal-dark hover:text-white transition-colors shadow-lg shadow-teal/10"
            >
              Start Free Trial
            </Link>
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-7 py-3.5 text-sm font-semibold text-white hover:border-white/50 hover:bg-white/5 transition-colors"
            >
              Book a Demo
            </Link>
          </div>

          <p className="mt-10 text-xs text-white/40 tracking-wide">
            LeadIntellect &mdash; Turning Sales Research into Sales Intelligence.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
