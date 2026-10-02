"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Zap, Sparkles, Diamond, ArrowRight, Globe } from "lucide-react";

interface PlanConfig {
  id: "free" | "basic" | "professional" | "organization";
  name: string;
  tagline: string;
  usdMonthly: number;
  usdAnnual: number;
  inrMonthly: number;
  inrAnnual: number;
  creditsAnnual: string;
  creditsMonthly: string;
  popular?: boolean;
  minSeats?: number;
  features: {
    text: string;
    badge?: string;
    highlight?: boolean;
  }[];
}

const plans: PlanConfig[] = [
  {
    id: "free",
    name: "Free Starter",
    tagline: "Ideal for founders & solo reps getting started with outbound prospecting",
    usdMonthly: 0,
    usdAnnual: 0,
    inrMonthly: 0,
    inrAnnual: 0,
    creditsAnnual: "100 credits per seat / month",
    creditsMonthly: "100 credits per seat / month",
    features: [
      { text: "100 verified credits / seat / month" },
      { text: "Access to 11,000+ Decision-Maker Database", highlight: true },
      { text: "Built-in Visual CRM (Up to 50 active deals)", badge: "New CRM", highlight: true },
      { text: "Basic ICP Filters (Seniority, Title, Industry)" },
      { text: "1 Active Outreach Playbook" },
      { text: "CSV Export (Up to 50 rows)" },
    ],
  },
  {
    id: "basic",
    name: "Growth Outbound",
    tagline: "For sales teams that need verified emails, deliverability, and deal pipeline",
    usdMonthly: 49,
    usdAnnual: 39,
    inrMonthly: 2499,
    inrAnnual: 1999,
    creditsAnnual: "30,000 credits per seat per year",
    creditsMonthly: "2,500 credits per seat per month",
    popular: true,
    features: [
      { text: "30,000 credits / seat / yr (or 2,500 / mo)" },
      { text: "Built-in Visual CRM Pipeline (Kanban Deals)", badge: "Included", highlight: true },
      { text: "Verified Work Email Guarantees (98%+ Confidence)" },
      { text: "5-Question Context Synthesis (Who, Why, Pain point)", highlight: true },
      { text: "Unlimited Outbound Playbooks & Cold Emails" },
      { text: "Advanced ICP Filters (Headcount, Tech Stack, Country)" },
      { text: "Real-time Email Deliverability & Warmup Verification" },
      { text: "Instant CSV & CRM Export (No extra tool needed)" },
    ],
  },
  {
    id: "professional",
    name: "Multi-Channel Scale",
    tagline: "Multi-channel phone, WhatsApp & email outreach with full pipeline management",
    usdMonthly: 89,
    usdAnnual: 69,
    inrMonthly: 5499,
    inrAnnual: 4499,
    creditsAnnual: "60,000 credits per seat per year",
    creditsMonthly: "5,000 credits per seat per month",
    features: [
      { text: "60,000 credits / seat / yr (or 5,000 / mo)" },
      { text: "Direct Mobile & WhatsApp Verified Numbers", badge: "Direct Dial", highlight: true },
      { text: "Advanced Visual CRM with Custom Stages & Revenue Forecasting", highlight: true },
      { text: "1:1 Multi-Channel Pitch Studio (Email + LinkedIn + WhatsApp + Battlecard)", highlight: true },
      { text: "Autonomous AI Lead Scoring & Intent Signals" },
      { text: "Bi-directional CRM Webhooks & Zapier/Make Sync" },
      { text: "Multi-Inbox Deliverability Suite & DNS Health Monitor" },
      { text: "Priority Live Support via WhatsApp & Slack" },
    ],
  },
  {
    id: "organization",
    name: "Enterprise Engine",
    tagline: "For scaling enterprises with custom CRM workflows & dedicated 3rd-party waterfall data",
    usdMonthly: 149,
    usdAnnual: 119,
    inrMonthly: 12999,
    inrAnnual: 9999,
    creditsAnnual: "120,000 credits per seat per year",
    creditsMonthly: "10,000 credits per seat per month",
    minSeats: 3,
    features: [
      { text: "120,000 credits per year (pooled across seats)" },
      { text: "Custom Tailored CRM Schema & Pipeline Customization", badge: "Custom CRM", highlight: true },
      { text: "Multi-Provider Waterfall Enrichment API Access", highlight: true },
      { text: "Deep Ingestion of Custom Enterprise Databases" },
      { text: "18% Indian GST Compliant Invoicing & Tax Input Credit" },
      { text: "Dedicated Customer Success Manager & SLA Guarantee" },
      { text: "Enterprise SSO, SAML & Advanced Team Permissions" },
    ],
  },
];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const locale = navigator.language || "";
      if (
        tz.includes("Calcutta") ||
        tz.includes("Kolkata") ||
        locale.includes("en-IN") ||
        locale.includes("hi")
      ) {
        setCurrency("INR");
      } else {
        setCurrency("USD");
      }
    } catch {
      setCurrency("USD");
    }
  }, []);

  const currencySymbol = currency === "INR" ? "₹" : "$";

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#fdfdfd] border-t border-slate-200">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/15 text-teal-dark font-extrabold text-xs mb-3 border border-teal/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent, Value-Justified Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0b1220] leading-tight">
            Predictable Pricing. Zero Tech-Stack Bloat.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Replace your $500/mo fragmented stack (Apollo + HubSpot + warmups + Zapier) with LeadIntellect: Verified Contacts, Built-in CRM Pipeline, and AI Outreach Playbooks in one roof.
          </p>

          {/* Region / Currency Switcher + Billing Toggle */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Currency Selector */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-2xs">
              <button
                onClick={() => setCurrency("INR")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currency === "INR"
                    ? "bg-[#0b1220] text-teal shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🇮🇳 India (INR ₹)</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-teal/20 text-teal-dark">
                  GST Ready
                </span>
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currency === "USD"
                    ? "bg-[#0b1220] text-teal shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🌍 Global (USD $)</span>
              </button>
            </div>

            {/* Annual / Monthly Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-2xs">
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  billingCycle === "annual"
                    ? "bg-[#0b1220] text-teal shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Billed Annually</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#e2f300] text-[#0b1220] font-black text-[10px]">
                  SAVE 20%
                </span>
              </button>
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#0b1220] text-teal shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Billed Monthly
              </button>
            </div>
          </div>

          {currency === "INR" && (
            <p className="mt-3 text-xs text-slate-500 font-medium">
              *Indian pricing tailored for Indian enterprises &amp; startups. 18% GST invoice provided for full Input Tax Credit (ITC).
            </p>
          )}
        </div>

        {/* 4 Tier Pricing Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {plans.map((p) => {
            const price =
              currency === "INR"
                ? billingCycle === "annual"
                  ? p.inrAnnual
                  : p.inrMonthly
                : billingCycle === "annual"
                ? p.usdAnnual
                : p.usdMonthly;

            return (
              <div
                key={p.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  p.popular
                    ? "bg-[#fcfdec] border-2 border-[#e2f300] shadow-[0_12px_35px_-10px_rgba(226,243,0,0.35)]"
                    : "bg-white border border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                {/* Badge */}
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0b1220] text-teal font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-teal/40 shadow-xs">
                    ★ Best Value for Outbound
                  </div>
                )}

                <div>
                  {/* Title & Tagline */}
                  <h3 className="text-xl font-black text-[#0b1220]">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px] leading-relaxed">
                    {p.tagline}
                  </p>

                  {/* Price Display */}
                  <div className="mt-5 pb-5 border-b border-slate-200/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3.5xl sm:text-4xl font-black text-[#0b1220]">
                        {currencySymbol}
                        {price.toLocaleString(currency === "INR" ? "en-IN" : "en-US")}
                      </span>
                      {price > 0 && (
                        <span className="text-xs text-slate-500 font-semibold">
                          / seat / mo
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      {price === 0
                        ? "Free forever · No credit card required"
                        : billingCycle === "annual"
                        ? `Billed annually (${currencySymbol}${(price * 12).toLocaleString(currency === "INR" ? "en-IN" : "en-US")}/yr)`
                        : "Billed month-to-month"}
                      {p.minSeats ? ` · Min ${p.minSeats} seats` : ""}
                    </p>
                  </div>

                  {/* Primary CTA */}
                  <div className="mt-5">
                    <Link
                      href="/pricing"
                      className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        p.id === "free"
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                          : p.popular
                          ? "bg-[#e2f300] hover:bg-[#d0df00] text-[#0b1220]"
                          : "bg-[#0b1220] hover:bg-slate-800 text-white"
                      }`}
                    >
                      <span>{p.id === "free" ? "Start Free Forever" : "Get Started Now"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Credits Callout */}
                  <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      <span>{billingCycle === "annual" ? p.creditsAnnual : p.creditsMonthly}</span>
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="mt-6 space-y-2.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Included Features
                    </p>
                    {p.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-teal-dark shrink-0 mt-0.5" />
                        <span className={feat.highlight ? "font-bold text-slate-900" : ""}>
                          {feat.text}
                        </span>
                        {feat.badge && (
                          <span className="bg-teal/15 text-teal-dark text-[9px] font-black px-1.5 py-0.2 rounded shrink-0">
                            {feat.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                  <Link href="/pricing" className="text-[11px] text-teal-dark font-bold hover:underline">
                    View detailed comparison &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
