import { Layers } from "lucide-react";
import Reveal from "./Reveal";

const providers = [
  { name: "Apollo", status: "Integration Ready", tone: "teal" },
  { name: "SalesTarget", status: "Future Integration", tone: "violet" },
  { name: "Additional Providers", status: "Coming Soon", tone: "muted" },
];

const toneClass: Record<string, string> = {
  teal: "text-teal-dark bg-teal/10 border-teal/20",
  violet: "text-violet bg-violet/10 border-violet/20",
  muted: "text-text-muted bg-surface border-border",
};

export default function EnrichmentSection() {
  return (
    <section className="py-24 bg-surface border-y border-border">
      <div className="container-page">
        <Reveal>
          <div className="max-w-xl">
            <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center mb-5">
              <Layers className="w-5 h-5 text-teal" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">
              One Intelligence Layer. Multiple Data Sources.
            </h2>
            <p className="mt-4 text-text-muted">
              LeadIntellect is designed to work with approved data providers rather than
              depending on a single database.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {providers.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <div className="rounded-xl bg-white border border-border p-6">
                <p className="text-base font-bold text-navy">{p.name}</p>
                <span
                  className={`mt-3 inline-block text-xs font-semibold border rounded-full px-3 py-1 ${toneClass[p.tone]}`}
                >
                  {p.status}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
