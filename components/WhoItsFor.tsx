import {
  Cloud,
  Building2,
  HeartPulse,
  Wrench,
  Factory,
  Briefcase,
} from "lucide-react";
import Reveal from "./Reveal";

const industries = [
  { icon: Cloud, label: "B2B SaaS" },
  { icon: Building2, label: "Enterprise Sales" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Wrench, label: "Facilities Management" },
  { icon: Factory, label: "Industrial & Manufacturing" },
  { icon: Briefcase, label: "Professional Services" },
];

const roles = ["Founders", "Sales Leaders", "RevOps", "SDRs / BDRs", "Demand Generation Teams"];

export default function WhoItsFor() {
  return (
    <section className="py-24 bg-surface border-y border-border">
      <div className="container-page">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">Who It&apos;s For</h2>
          </div>
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((ind, i) => (
            <Reveal key={ind.label} delay={i * 70}>
              <div className="flex items-center gap-3 rounded-xl bg-white border border-border p-5">
                <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                  <ind.icon className="w-5 h-5 text-teal-dark" />
                </div>
                <p className="text-sm font-semibold text-navy">{ind.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {roles.map((r) => (
              <span
                key={r}
                className="text-xs font-semibold text-navy bg-white border border-border rounded-full px-3.5 py-2"
              >
                {r}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
