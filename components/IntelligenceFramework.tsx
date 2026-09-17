import Reveal from "./Reveal";

const rows = [
  { label: "WHO", q: "Who is the person?", a: "VP of Operations" },
  { label: "WHY", q: "Why does this account matter?", a: "Company matches target industry and company size." },
  { label: "PAIN", q: "What problem might they be experiencing?", a: "Potential operational efficiency challenge." },
  { label: "FIT", q: "How closely does this prospect match the ICP?", a: "94% ICP match" },
  { label: "NEXT", q: "What should the salesperson do next?", a: "Lead with an efficiency-focused discovery conversation." },
];

export default function IntelligenceFramework() {
  return (
    <section className="py-24 bg-navy text-white overflow-hidden relative">
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-violet), transparent)" }}
      />
      <div className="container-page relative">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Don&apos;t Just Find a Lead. Understand the Lead.
            </h2>
            <p className="mt-4 text-white/60">
              Every prospect LeadIntellect surfaces comes with a short, structured brief built
              around the questions your reps actually ask.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <Reveal delay={80}>
            <dl className="grid gap-3">
              {rows.map((r) => (
                <div key={r.label} className="flex gap-4 items-start border-b border-white/10 pb-3">
                  <dt className="w-16 shrink-0 text-xs font-bold text-teal pt-0.5">{r.label}</dt>
                  <dd className="text-sm text-white/70">{r.q}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={160}>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 glow-ring">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-semibold text-white/50 tracking-wide">
                  EXAMPLE INTELLIGENCE CARD
                </span>
                <span className="text-[10px] font-semibold text-violet bg-violet/15 border border-violet/30 rounded-full px-2.5 py-1">
                  AI-generated
                </span>
              </div>
              <div className="grid gap-4">
                {rows.map((r) => (
                  <div key={r.label}>
                    <p className="text-[11px] font-bold text-teal">{r.label}</p>
                    <p className="mt-1 text-sm text-white/85">{r.a}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[11px] text-white/40 leading-relaxed">
                AI-generated intelligence should always be distinguished from verified source
                data.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
