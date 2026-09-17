"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "What is LeadIntellect?",
    a: "LeadIntellect is an AI-powered B2B prospecting and sales intelligence agent. It helps sales teams discover accounts and decision-makers, enrich available business data, understand prospect context, score ICP fit and get a recommended next action.",
  },
  {
    q: "How is LeadIntellect different from a traditional lead database?",
    a: "A traditional database gives you a large set of contacts and a search bar. LeadIntellect starts from your requirement, and an AI agent does the searching, enriching and qualifying — adding context like why a prospect matters, not just their contact details.",
  },
  {
    q: "Can LeadIntellect find decision-makers?",
    a: "Yes. LeadIntellect is designed to discover accounts and identify decision-makers matching the roles and seniority you describe, subject to the data available through connected providers.",
  },
  {
    q: "Can LeadIntellect enrich email addresses?",
    a: "LeadIntellect is designed to retrieve available business contact information through approved enrichment providers. Coverage and accuracy depend on what each connected provider has available.",
  },
  {
    q: "Which data providers can LeadIntellect connect with?",
    a: "LeadIntellect is built to work with approved third-party data providers rather than a single fixed source, so coverage can expand over time as new providers are connected.",
  },
  {
    q: "Does LeadIntellect integrate with Apollo?",
    a: "Apollo is an integration-ready data source for LeadIntellect. Additional providers, including SalesTarget, are planned as future integrations.",
  },
  {
    q: "Does LeadIntellect work with LinkedIn?",
    a: "Any LinkedIn-related discovery depends on available, approved data integrations. LeadIntellect does not perform unauthorized LinkedIn scraping.",
  },
  {
    q: "Can I define my own ICP?",
    a: "Yes. ICP scoring is built around the criteria you define — such as industry, company size, role and business signals — so prioritization reflects your definition of a good-fit account.",
  },
  {
    q: "How does ICP scoring work?",
    a: "Each prospect is evaluated against the criteria in your ICP — including company fit, industry fit, size, role and available business signals — and given a composite score and tier to help you prioritize.",
  },
  {
    q: "Does LeadIntellect automatically send outreach?",
    a: "LeadIntellect is designed to help you prepare and personalize outreach and recommend a next action. Sending is intended to remain a decision your team makes, not an automatic action taken on your behalf.",
  },
  {
    q: "Is the information verified?",
    a: "Verification status depends on the underlying data provider for each field. LeadIntellect surfaces the verification status it receives — it does not claim data is verified unless the source provider confirms it.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-surface border-y border-border">
      <div className="container-page">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">
              Frequently Asked Questions
            </h2>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 max-w-2xl divide-y divide-border rounded-2xl border border-border bg-white overflow-hidden">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="text-sm font-semibold text-navy">{f.q}</span>
                    <ChevronDown
                      className={`w-4.5 h-4.5 text-text-muted shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-52 pb-4" : "max-h-0"
                    }`}
                  >
                    <p className="px-5 text-sm text-text-muted leading-relaxed">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
