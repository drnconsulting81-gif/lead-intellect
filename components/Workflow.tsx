import { Search, DatabaseZap, BrainCircuit, Gauge, Rocket } from "lucide-react";
import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    icon: Search,
    title: "DISCOVER",
    text: "Find accounts and decision-makers matching your ICP.",
  },
  {
    n: "02",
    icon: DatabaseZap,
    title: "ENRICH",
    text: "Connect available prospect information with approved data providers.",
  },
  {
    n: "03",
    icon: BrainCircuit,
    title: "UNDERSTAND",
    text: "Turn company, role and business context into actionable intelligence.",
  },
  {
    n: "04",
    icon: Gauge,
    title: "SCORE",
    text: "Evaluate ICP fit and prioritize the highest-value prospects.",
  },
  {
    n: "05",
    icon: Rocket,
    title: "ACT",
    text: "Recommend the next best sales action and outreach angle.",
  },
];

export default function Workflow() {
  return (
    <section id="how-it-works" className="py-24 bg-surface border-y border-border">
      <div className="container-page">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">
              From Prospect Search to Sales Intelligence
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-5 gap-6 md:gap-4 relative">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="relative h-full">
                {i < steps.length - 1 && (
                  <span className="hidden md:block absolute top-6 left-[calc(100%-8px)] w-[calc(100%-16px)] h-px bg-gradient-to-r from-teal/40 to-transparent z-0" />
                )}
                <div className="relative z-10 h-full rounded-xl bg-white border border-border p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted">{s.n}</span>
                    <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center">
                      <s.icon className="w-4.5 h-4.5 text-teal" strokeWidth={2} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-bold text-navy tracking-wide">{s.title}</p>
                  <p className="mt-2 text-[13px] text-text-muted leading-relaxed">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
