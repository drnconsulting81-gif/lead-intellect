import { User, Bot } from "lucide-react";
import Reveal from "./Reveal";

const stats = [
  { label: "Accounts", value: "42" },
  { label: "Decision-makers", value: "87" },
  { label: "Tier 1", value: "31" },
  { label: "Tier 2", value: "36" },
  { label: "Tier 3", value: "20" },
];

export default function AgentDemo() {
  return (
    <section className="py-24 bg-white">
      <div className="container-page">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">
              Meet Your AI Prospecting Agent
            </h2>
            <p className="mt-4 text-text-muted">
              Describe who you&apos;re looking for in plain language. The agent translates it
              into a structured search across connected data sources.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 max-w-2xl rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-surface border-b border-border">
              <span className="text-xs font-semibold text-text-muted">AI PROSPECTING AGENT</span>
              <span className="text-[10px] font-semibold text-violet bg-violet/10 border border-violet/20 rounded-full px-2.5 py-1">
                Illustrative product experience
              </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="rounded-xl bg-surface px-4 py-3 text-sm text-text max-w-md">
                  Find decision-makers in Indian healthcare companies with 500–5,000 employees.
                  Target CEOs, CROs, VPs of Sales and Business Development leaders.
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-teal-dark" />
                </div>
                <div className="rounded-xl bg-navy px-4 py-3 text-sm text-white/90 max-w-md">
                  Understood. I found 42 matching accounts and identified 87 potential
                  decision-makers.
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-1 ml-11">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-lg bg-surface border border-border p-3 text-center">
                    <p className="text-lg font-extrabold text-navy leading-none">{s.value}</p>
                    <p className="mt-1 text-[10px] text-text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 text-xs text-text-muted max-w-xl">
            Results shown are an illustrative product experience, not live output. Discovery
            depends on available, approved data integrations — LeadIntellect does not perform
            unauthorized LinkedIn scraping.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
