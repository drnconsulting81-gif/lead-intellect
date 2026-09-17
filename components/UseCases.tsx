import {
  ListChecks,
  UserSearch,
  DatabaseZap,
  Target,
  Search,
  MessageSquareText,
  ClipboardCheck,
  TimerReset,
} from "lucide-react";
import Reveal from "./Reveal";

const cases = [
  { icon: ListChecks, text: "Build a Target Account List" },
  { icon: UserSearch, text: "Find Decision-Makers" },
  { icon: DatabaseZap, text: "Enrich Business Contacts" },
  { icon: Target, text: "Prioritize ICP-Fit Prospects" },
  { icon: Search, text: "Research Accounts Before Outreach" },
  { icon: MessageSquareText, text: "Prepare Personalized Sales Conversations" },
  { icon: ClipboardCheck, text: "Create Qualified Prospect Lists" },
  { icon: TimerReset, text: "Reduce Manual Prospect Research" },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 bg-white">
      <div className="container-page">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">Use Cases</h2>
          </div>
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cases.map((c, i) => (
            <Reveal key={c.text} delay={(i % 4) * 80}>
              <div className="h-full rounded-xl border border-border p-5 hover:border-teal/40 transition-colors">
                <c.icon className="w-5 h-5 text-teal-dark" strokeWidth={2} />
                <p className="mt-3.5 text-sm font-semibold text-navy leading-snug">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
