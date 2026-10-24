"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Database,
  Globe,
  Lock,
  CheckCircle2,
  X,
  CreditCard,
  Building,
  User,
  Mail,
  Zap,
} from "lucide-react";

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
  credits: number;
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
    credits: 99,
    creditsLabel: "99 credits / month",
    ctaText: "Start Free",
    ctaHref: "/signup",
    features: [
      { text: "99 monthly verified prospect reveals" },
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
    credits: 2000,
    creditsLabel: "2,000 credits / month",
    popular: true,
    ctaText: "Get Started with Pro",
    ctaHref: "/signup?plan=pro",
    features: [
      { text: "2,000 verified contact credits / month", highlight: true },
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
    credits: 3500,
    creditsLabel: "3,500 credits / month",
    ctaText: "Get Business Plan",
    ctaHref: "/signup?plan=business",
    features: [
      { text: "3,500 verified credits / month (poolable across team seats)", highlight: true },
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
  const [currency, setCurrency] = useState<"INR" | "USD">("USD");
  const [detectedRegion, setDetectedRegion] = useState<string>("Detecting region...");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Upgrade Checkout Modal State
  const [upgradePlan, setUpgradePlan] = useState<Plan | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Auto-detect region on mount: Default to INR for India, USD for rest of the world
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem("leadintellect_currency");
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const locale = (navigator.language || "").toLowerCase();
      const languages = (navigator.languages || []).map((l) => l.toLowerCase());

      const isIndia =
        tz.includes("Calcutta") ||
        tz.includes("Kolkata") ||
        tz.includes("Colombo") ||
        tz.toLowerCase().includes("india") ||
        locale.includes("in") ||
        locale.includes("hi") ||
        locale.includes("ta") ||
        locale.includes("te") ||
        languages.some((l) => l.includes("en-in") || l.includes("hi") || l.includes("ta"));

      if (savedCurrency === "INR" || savedCurrency === "USD") {
        setCurrency(savedCurrency);
        setDetectedRegion(savedCurrency === "INR" ? "India (INR ₹)" : "International (USD $)");
      } else if (isIndia) {
        setCurrency("INR");
        setDetectedRegion("India (Default ₹ INR)");
      } else {
        setCurrency("USD");
        setDetectedRegion("International (Default $ USD)");
      }

      // Check current user session
      const stored = localStorage.getItem("leadintellect_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.email) setCurrentUser(u);
      }
    } catch {
      setCurrency("USD");
      setDetectedRegion("International ($ USD)");
    }
  }, []);

  const handleCurrencyChange = (curr: "INR" | "USD") => {
    setCurrency(curr);
    try {
      localStorage.setItem("leadintellect_currency", curr);
    } catch {}
    setDetectedRegion(curr === "INR" ? "India (Manual ₹ INR)" : "International (Manual $ USD)");
  };

  const handlePlanClick = (plan: Plan, e: React.MouseEvent) => {
    // If free plan and logged in, take straight to workspace
    if (plan.id === "free") {
      if (currentUser) {
        e.preventDefault();
        window.location.href = currentUser.role === "admin" ? "/admin" : "/dashboard";
      }
      return;
    }

    // If user is already logged in, DO NOT ask to sign up or login! Open instant upgrade modal!
    if (currentUser) {
      e.preventDefault();
      setUpgradePlan(plan);
      setUpgradeSuccess(false);
    }
  };

  const executeUpgrade = async () => {
    if (!upgradePlan || !currentUser) return;
    setUpgradeLoading(true);

    try {
      const price =
        currency === "INR"
          ? billingCycle === "annual"
            ? upgradePlan.annualPriceINR
            : upgradePlan.monthlyPriceINR
          : billingCycle === "annual"
          ? upgradePlan.annualPriceUSD
          : upgradePlan.monthlyPriceUSD;

      // 1. Record subscription order in database
      await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: currentUser.name || "Subscriber",
          customerEmail: currentUser.email,
          companyName: currentUser.company || "Direct Account",
          itemType: "subscription",
          planName: `${upgradePlan.name} Plan (${billingCycle})`,
          amount: price,
          currency,
          paymentStatus: "paid",
          paymentMethod: currency === "INR" ? "UPI / Direct Bank" : "Corporate Card",
          notes: `Instant upgrade to ${upgradePlan.name} (${upgradePlan.credits} credits).`,
        }),
      }).catch(() => {});

      // 2. Adjust user credit balance to new plan credits
      await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser.email,
          amount: upgradePlan.credits,
          action: "plan_allocation",
          description: `Subscription upgrade to ${upgradePlan.name} Plan`,
        }),
      }).catch(() => {});

      // 3. Update local user record
      const updatedUser = {
        ...currentUser,
        plan: upgradePlan.id,
        credits: upgradePlan.credits,
        subscriptionStatus: "active",
      };
      localStorage.setItem("leadintellect_user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      setUpgradeSuccess(true);
    } catch {
      alert("Upgrade initialized. Redirecting to your workspace...");
      window.location.href = "/dashboard";
    } finally {
      setUpgradeLoading(false);
    }
  };

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

          {/* Region and Currency Auto-Detection Indicator */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-teal-dark" />
            <span>Region: <strong className="text-navy">{detectedRegion}</strong></span>
          </div>

          {/* Controls: Billing Cycle + Currency Switcher */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-white text-navy shadow-xs"
                    : "text-slate-600 hover:text-navy"
                }`}
              >
                Annual <span className="text-teal-dark font-bold">(Save 20%)</span>
              </button>
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
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
                onClick={() => handleCurrencyChange("INR")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currency === "INR"
                    ? "bg-white text-navy shadow-xs"
                    : "text-slate-600 hover:text-navy"
                }`}
              >
                INR (₹) &ndash; India
              </button>
              <button
                onClick={() => handleCurrencyChange("USD")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-white text-navy shadow-xs"
                    : "text-slate-600 hover:text-navy"
                }`}
              >
                USD ($) &ndash; Global
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

            const isCurrentUsersPlan = currentUser && currentUser.plan === plan.id;

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
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-navy">{plan.name}</h3>
                    {isCurrentUsersPlan && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal/20 text-teal-dark uppercase tracking-wider">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-2 min-h-[32px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  <div className="mt-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-navy">
                        {price === 0 ? "Free" : `${currencySymbol}${price.toLocaleString()}`}
                      </span>
                      {price > 0 && (
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
                  {currentUser && plan.id !== "free" ? (
                    <button
                      type="button"
                      onClick={(e) => handlePlanClick(plan, e)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                        plan.popular
                          ? "bg-navy text-white hover:bg-slate-800 shadow-md shadow-navy/10"
                          : "bg-teal text-navy hover:bg-teal-dark hover:text-white"
                      }`}
                    >
                      <span>Upgrade to {plan.name} Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link
                      href={currentUser ? (currentUser.role === "admin" ? "/admin" : "/dashboard") : plan.ctaHref}
                      onClick={(e) => handlePlanClick(plan, e)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
                        plan.popular
                          ? "bg-navy text-white hover:bg-slate-800 shadow-md shadow-navy/10"
                          : "bg-slate-100 text-navy hover:bg-slate-200"
                      }`}
                    >
                      <span>{currentUser && plan.id === "free" ? "Open My Workspace" : plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
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
                charged for searching, applying filters, or viewing company profiles. Every free signup starts with
                99 credits, and upgraded plans include 2,000 to 3,500 monthly credits with automatic rollover.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Plan Upgrade Checkout Modal for Logged-In Users */}
      {upgradePlan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {upgradeSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-navy">Plan Activated!</h3>
                <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                  Congratulations, <strong className="text-navy">{currentUser?.name}</strong>! Your account has been upgraded to the <strong className="text-navy">{upgradePlan.name} Plan</strong>.
                </p>
                <div className="p-4 rounded-2xl bg-teal/10 border border-teal/20 text-xs text-navy font-semibold">
                  <Zap className="w-4 h-4 text-teal-dark inline mr-1" />
                  {upgradePlan.credits.toLocaleString()} verified credits are now active in your workspace!
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUpgradePlan(null);
                      window.location.href = "/dashboard";
                    }}
                    className="w-full py-3 rounded-xl bg-navy text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Go to Workspace Dashboard &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Modal Header */}
                <div className="p-6 bg-surface border-b border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-dark bg-teal/15 px-2.5 py-0.5 rounded-full">
                      Direct Workspace Upgrade
                    </span>
                    <h3 className="text-lg font-extrabold text-navy mt-1">
                      Upgrade to {upgradePlan.name} Plan
                    </h3>
                  </div>
                  <button
                    onClick={() => setUpgradePlan(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5 text-xs">
                  {/* Account verification summary */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy">{currentUser?.name}</p>
                      <p className="text-[11px] text-text-muted">{currentUser?.email}</p>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      Authenticated Session
                    </span>
                  </div>

                  {/* Plan Price & Credits Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-surface border border-border">
                      <p className="text-text-muted text-[11px]">Monthly Quota</p>
                      <p className="text-base font-extrabold text-navy mt-0.5">
                        {upgradePlan.credits.toLocaleString()} Credits
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border">
                      <p className="text-text-muted text-[11px]">Amount Payable</p>
                      <p className="text-base font-extrabold text-teal-dark mt-0.5">
                        {currencySymbol}
                        {(currency === "INR"
                          ? billingCycle === "annual"
                            ? upgradePlan.annualPriceINR
                            : upgradePlan.monthlyPriceINR
                          : billingCycle === "annual"
                          ? upgradePlan.annualPriceUSD
                          : upgradePlan.monthlyPriceUSD
                        ).toLocaleString()}
                        <span className="text-[10px] text-text-muted font-normal"> / mo</span>
                      </p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-2">
                    <label className="font-bold text-navy block">Select Preferred Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl border border-teal bg-teal/5 flex items-center gap-2 cursor-pointer font-semibold text-navy">
                        <CreditCard className="w-4 h-4 text-teal-dark" />
                        <span>{currency === "INR" ? "UPI / Card / Netbanking" : "Stripe / Card"}</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-border bg-white flex items-center gap-2 cursor-pointer text-slate-600">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span>Corporate Invoice</span>
                      </div>
                    </div>
                  </div>

                  {/* Upgrade Actions */}
                  <div className="pt-3">
                    <button
                      type="button"
                      disabled={upgradeLoading}
                      onClick={executeUpgrade}
                      className="w-full py-3.5 rounded-xl bg-navy text-white hover:bg-slate-800 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-50"
                    >
                      {upgradeLoading ? (
                        <span>Activating Subscription...</span>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-teal" />
                          <span>Confirm &amp; Activate {upgradePlan.name} Plan</span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-text-muted mt-2">
                      Instant activation &bull; Zero downtime &bull; 99 free evaluation credits rolled into paid balance
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
