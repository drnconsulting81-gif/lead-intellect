"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const breakdown = [
  { label: "Company Fit", value: 95 },
  { label: "Industry Fit", value: 100 },
  { label: "Company Size", value: 90 },
  { label: "Role Fit", value: 95 },
  { label: "Buyer Persona", value: 90 },
  { label: "Business Signal", value: 85 },
  { label: "Data Confidence", value: 94 },
];

function Bar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-text-muted">{label}</span>
        <span className="font-semibold text-navy">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal to-violet transition-all ease-out"
          style={{
            width: visible ? `${value}%` : "0%",
            transitionDuration: "900ms",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function ICPScore() {
  return (
    <section className="py-24 bg-white">
      <div className="container-page">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">
              Stop Treating Every Lead the Same.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-[0.6fr_1.4fr] gap-8 items-center">
          <Reveal delay={60}>
            <div className="rounded-2xl border border-border bg-surface p-8 text-center">
              <p className="text-xs font-semibold text-text-muted tracking-wide">ICP SCORE</p>
              <p className="mt-3 text-6xl font-extrabold text-navy leading-none">
                92<span className="text-xl text-text-muted font-semibold">/100</span>
              </p>
              <span className="mt-4 inline-block text-xs font-bold text-teal-dark bg-teal/10 border border-teal/20 rounded-full px-3 py-1">
                Tier 1
              </span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-border p-7">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                {breakdown.map((b, i) => (
                  <Bar key={b.label} label={b.label} value={b.value} delay={i * 90} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <p className="mt-8 text-sm text-text-muted max-w-xl">
            Prioritize the prospects most likely to deserve your team&apos;s attention. ICP
            scoring reflects fit against your criteria — it does not predict revenue or
            guarantee conversion.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
