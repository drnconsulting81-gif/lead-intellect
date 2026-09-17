import { Search, ShieldCheck, BrainCircuit, ArrowRightCircle } from "lucide-react";
import Reveal from "./Reveal";

const items = [
  {
    icon: Search,
    title: "DISCOVER",
    text: "Find the right accounts and buyers.",
  },
  {
    icon: ShieldCheck,
    title: "VERIFY",
    text: "Enrich available business information.",
  },
  {
    icon: BrainCircuit,
    title: "UNDERSTAND",
    text: "Turn raw data into business context.",
  },
  {
    icon: ArrowRightCircle,
    title: "ACT",
    text: "Know who to contact and what to say.",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="container-page py-10">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 relative">
            {items.map((item, i) => (
              <div key={item.title} className="relative flex flex-col items-center text-center px-2">
                {i < items.length - 1 && (
                  <span className="hidden lg:block absolute top-6 left-full w-full h-px bg-border -z-0" />
                )}
                <div className="w-11 h-11 rounded-xl bg-white border border-border flex items-center justify-center relative z-10">
                  <item.icon className="w-5 h-5 text-teal-dark" strokeWidth={2} />
                </div>
                <p className="mt-3 text-xs font-bold tracking-wide text-navy">{item.title}</p>
                <p className="mt-1 text-[13px] text-text-muted max-w-[160px]">{item.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
