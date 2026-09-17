import { Database, Compass, BrainCircuit, Zap } from "lucide-react";
import Reveal from "./Reveal";

const diffs = [
  { icon: Database, title: "DATA", text: "Don't stop at contact records." },
  { icon: Compass, title: "CONTEXT", text: "Understand the business situation." },
  { icon: BrainCircuit, title: "INTELLIGENCE", text: "Turn information into sales insight." },
  { icon: Zap, title: "ACTION", text: "Recommend what to do next." },
];

export default function Differentiators() {
  return (
    <section className="py-24 bg-white">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-bold tracking-wide text-teal-dark">WHY LEADINTELLECT</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-navy max-w-2xl leading-tight">
            Built Around the Sales Question That Matters Most
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 rounded-2xl bg-surface border border-border p-8 sm:p-10 max-w-3xl">
            <p className="text-lg text-text-muted">Not:</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-navy/50 mt-1">
              &ldquo;Who can I email?&rdquo;
            </p>
            <p className="mt-6 text-lg text-text-muted">But:</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-navy mt-1 leading-snug">
              &ldquo;Who should I talk to, why should I talk to them, and what should I
              say?&rdquo;
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {diffs.map((d, i) => (
            <Reveal key={d.title} delay={140 + i * 80}>
              <div className="rounded-xl border border-border p-6">
                <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
                  <d.icon className="w-5 h-5 text-teal" />
                </div>
                <p className="mt-4 text-sm font-bold tracking-wide text-navy">{d.title}</p>
                <p className="mt-1.5 text-sm text-text-muted">{d.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
