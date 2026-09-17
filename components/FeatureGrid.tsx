import {
  Radar,
  DatabaseZap,
  Target,
  BrainCircuit,
  MessageSquareText,
  KanbanSquare,
  Plug,
  Bot,
} from "lucide-react";
import Reveal from "./Reveal";

const features = [
  {
    icon: Radar,
    title: "AI Prospect Discovery",
    text: "Find companies and decision-makers that match your Ideal Customer Profile.",
  },
  {
    icon: DatabaseZap,
    title: "Business Data Enrichment",
    text: "Connect with approved third-party enrichment providers to retrieve available business contact information.",
  },
  {
    icon: Target,
    title: "ICP Intelligence",
    text: "Score every prospect against your ICP and understand why they qualify.",
  },
  {
    icon: BrainCircuit,
    title: "Lead Intelligence",
    text: "Go beyond contact data with WHO, WHY, PAIN, FIT and NEXT.",
  },
  {
    icon: MessageSquareText,
    title: "Personalized Outreach",
    text: "Generate context-aware outreach recommendations based on the prospect and account.",
  },
  {
    icon: KanbanSquare,
    title: "CRM & Pipeline",
    text: "Keep qualified prospects organized and move them toward action.",
  },
  {
    icon: Plug,
    title: "Multi-Provider Enrichment",
    text: "Start with providers such as Apollo and allow additional providers to be added over time.",
  },
  {
    icon: Bot,
    title: "AI Sales Agent",
    text: "Ask the agent to find, qualify and explain prospects using natural language.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container-page">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">Core Features</h2>
            <p className="mt-4 text-text-muted">
              Everything a sales team needs to go from a target market to a prioritized,
              well-understood pipeline.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 80}>
              <div className="h-full rounded-xl border border-border p-5 hover:border-teal/40 hover:shadow-[0_12px_32px_-16px_rgba(11,18,32,0.18)] transition-all">
                <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-teal-dark" strokeWidth={2} />
                </div>
                <p className="mt-4 text-[15px] font-bold text-navy">{f.title}</p>
                <p className="mt-2 text-[13px] text-text-muted leading-relaxed">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
