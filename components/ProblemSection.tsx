import { ArrowDown } from "lucide-react";
import Reveal from "./Reveal";

const painPoints = [
  "Searching for the right companies",
  "Finding the right decision-makers",
  "Cleaning contact data",
  "Switching between multiple tools",
  "Researching prospects one by one",
  "Figuring out why a prospect is relevant",
  "Writing generic outreach",
  "Updating CRM records by hand",
];

const without = ["Search", "Copy", "Verify", "Research", "Spreadsheet", "Guess", "Outreach"];
const withLI = ["Discover", "Enrich", "Understand", "Score", "Personalize", "Act"];

function WorkflowColumn({
  title,
  steps,
  variant,
}: {
  title: string;
  steps: string[];
  variant: "muted" | "strong";
}) {
  const strong = variant === "strong";
  return (
    <div
      className={`rounded-2xl p-6 border ${
        strong ? "border-teal/30 bg-navy" : "border-border bg-surface"
      }`}
    >
      <p
        className={`text-xs font-bold tracking-wide mb-5 ${
          strong ? "text-teal" : "text-text-muted"
        }`}
      >
        {title}
      </p>
      <div className="flex flex-col items-start gap-1.5">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-start">
            <span
              className={`text-sm font-semibold px-3.5 py-2 rounded-lg ${
                strong
                  ? "bg-white/10 text-white border border-white/10"
                  : "bg-white text-text-muted border border-border"
              }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <ArrowDown
                className={`w-3.5 h-3.5 my-1 ml-3.5 ${strong ? "text-teal/50" : "text-border"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProblemSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container-page">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy max-w-2xl leading-tight">
            Your Sales Team Doesn&apos;t Need More Leads. It Needs Better Intelligence.
          </h2>
          <p className="mt-5 text-text-muted max-w-xl">
            Most sales teams lose their week to the work around selling, not selling itself:
          </p>
        </Reveal>

        <Reveal delay={80}>
          <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-2.5 max-w-2xl">
            {painPoints.map((p) => (
              <li key={p} className="text-sm text-text-muted flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-violet shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            <WorkflowColumn title="WITHOUT LEADINTELLECT" steps={without} variant="muted" />
            <WorkflowColumn title="WITH LEADINTELLECT" steps={withLI} variant="strong" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
