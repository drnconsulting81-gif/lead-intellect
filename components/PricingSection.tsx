"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck, Database } from "lucide-react";

interface PlanFeature {
  text: string;
  highlight?: boolean;
  badge?: string;
}

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthlyPriceUSD: number;
  annualPriceUSD: number;
  monthlyPriceINR: number;
  annualPriceINR: number;
  creditsLabel: string;
  popular?: boolean;
  ctaText: string;
  ctaHref: string;
  features: PlanFeature[];
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "For exploration, testing filters, and initial prospect evaluation",
    monthlyPriceUSD: 0,
    annualPriceUSD: 0,
    monthlyPriceINR: 0,
    annualPriceINR: 0,
    creditsLabel: "50 credits / month",
    ctaText: "Start Free",
    ctaHref: "/signup",
    features: [
      { text: "50 monthly verified prospect reveals" },
      { text: "Search 50,000+ Cleaned Decision-Maker Database", highlight: true },
      { text: "People & Company Search Modes" },
      { text: "Structured Filters (Seniority, Industry, Location, Size)" },
      { text: "Natural-Language Search Query Translation" },
      { text: "Saved Lists & Search History" },
      { text: "CSV Import with Column Auto-Mapping" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For sales professionals, founders, and consultants generating active pipeline",
    monthlyPriceUSD: 49,
    annualPriceUSD: 39,
    monthlyPriceINR: 3499,
    annualPriceINR: 2799,
    creditsLabel: "3,500 credits / month",
    popular: true,
    ctaText: "Get Started with Pro",
    ctaHref: "/signup?plan=pro",
    features: [
      { text: "3,500 verified contact credits / month (₹1 / $0.01 per lead)", highlight: true },
      { text: "Unlimited Searches & Filters (0 credits charged for browsing)" },
      { text: "Complete Prospect Profiles (WHO, WHY, FIT, SIGNALS)" },
      { text: "Transparent Email Verification & Provenance Statuses" },
      { text: "AI Outreach Studio (Personalized Cold & Follow-Up Drafts)" },
      { text: "Lightweight Sales Pipeline (Kanban & Deal Stages)" },
      { text: "Standard CSV Export of Filtered Records" },
      { text: "Direct Dial & Corporate Line Visibility" },
      { text: "Server-Enforced Credit Ledger & Activity Audit" },
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For revenue teams requiring high-volume exports, collaboration, and custom quota limits",
    monthlyPriceUSD: 129,
    annualPriceUSD: 99,
    monthlyPriceINR: 8999,
    annualPriceINR: 6999,
    creditsLabel: "5,000 credits / month",
    ctaText: "Talk to Sales",
    ctaHref: "/contact?reason=business_plan",
    features: [
      { text: "5,000 verified credits / month (poolable across team seats)", highlight: true },
      { text: "Unlimited Searches, Filters & Account Intelligence" },
      { text: "Everything in Pro included", highlight: true },
      { text: "High-Volume CSV Imports & Bulk Exports" },
      { text: "Provider-Neutral Webhook & Custom API Adapter Configuration" },
      { text: "Custom ICP Fit Scoring Criteria Configuration" },
      { text: "Global Suppression Registry Enforcement" },
      { text: "Priority Support & Technical Onboarding" },
    ],
  },
];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [currency, setCurrency] = useState<"INR" | "USD">(() => {
    if (typeof window !== "undefined") {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        const locale = navigator.language || "";
        if (
          tz.includes("Calcutta") ||
          tz.includes("Kolkata") ||
          locale.includes("en-IN") ||
          locale.includes("hi")
        ) {
          return "INR";
        }
      } catch {
        return "USD";
      }
    }
    return "USD";
  });

  const currencySymbol = currency === "INR" ? "₹" : "$";

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#fdfdfd] border-t border-slate-200">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            TRANSPARENT, USAGE-BASED PLANS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
            Predictable Pricing. Truthful Credits.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
            Every plan includes access to our 50,000+ cleaned B2B database. Credits are deducted only
            when contact details are successfully revealed or verified.
          </p>

          {/* Controls: Billing Cycle + Currency Switcher */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  billingCycle === "annual"
                    ? "bg-white text-navy shadow-xs"
                    : "text-slate-600 hover:text-navy"
                }`}
              >
                Annual <span className="text-teal-dark font-bold">(Save 20%)</span>
              </button>
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-navy shadow-xs"
                    : "text-slate-600 hover:text-navy"
                }`}
              >
                Monthly
              </button>
            </div>

            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  currency === "USD"
                    ? "bg-white text-navy shadow-xs"
                    : "text-slate-600 hover:text-navy"
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency("INR")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  currency === "INR"
                    ? "bg-white text-navy shadow-xs"
                    : "text-slate-600 hover:text-navy"
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => {
            const price =
              currency === "INR"
                ? billingCycle === "annual"
                  ? plan.annualPriceINR
                  : plan.monthlyPriceINR
                : billingCycle === "annual"
                ? plan.annualPriceUSD
                : plan.monthlyPriceUSD;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? "border-teal-dark/60 bg-white shadow-xl shadow-teal-dark/5 ring-2 ring-teal-dark/20"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-navy text-teal text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm border border-teal/40">
                    Recommended Plan
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-navy">{plan.name}</h3>
                  <p className="text-xs text-text-muted mt-2 min-h-[32px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  <div className="mt-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-navy">
                        {plan.monthlyPriceUSD === 0 ? "Free" : `${currencySymbol}${price}`}
                      </span>
                      {plan.monthlyPriceUSD > 0 && (
                        <span className="text-xs text-text-muted font-medium">/ seat / month</span>
                      )}
                    </div>
                    <div className="mt-2 text-xs font-semibold text-teal-dark flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{plan.creditsLabel}</span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className={f.highlight ? "font-semibold text-navy" : ""}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={plan.ctaHref}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
                      plan.popular
                        ? "bg-navy text-white hover:bg-slate-800 shadow-md shadow-navy/10"
                        : "bg-slate-100 text-navy hover:bg-slate-200"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Credit System Transparency Explanation */}
        <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal/15 text-teal-dark flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy">How LeadIntellect Credits Work</h4>
              <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                A credit represents a verified information lookup. 1 credit is consumed when you reveal a
                contact&apos;s direct email or phone line, or run a live verification check. You are never
                charged for searching, applying filters, or viewing company profiles. Failed lookups or
                records without contact data are never deducted from your balance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
