"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Diamond,
  X,
  Plus,
  Minus,
  CreditCard,
  Building,
  Mail,
  User,
  Phone,
  Layers,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PlanConfig {
  id: "free" | "basic" | "professional" | "organization";
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
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
    name: "Free",
    tagline: "Ideal for individuals getting started with outbound prospecting",
    monthlyPrice: 0,
    annualPrice: 0,
    creditsAnnual: "100 credits per seat per month",
    creditsMonthly: "100 credits per seat per month",
    features: [
      { text: "100 credits per seat per month, granted upfront" },
      { text: "AI Assistant (5 chat limit)" },
      { text: "AI Research & Account Insights" },
      { text: "2 Active Outreach Sequences" },
      { text: "Prospecting & Chrome Extension" },
      { text: "Basic ICP Filters (Industry, Title)" },
      { text: "CSV Export (Up to 50 rows)" },
    ],
  },
  {
    id: "basic",
    name: "Basic",
    tagline: "Ideal for small teams that want high-converting email outreach",
    monthlyPrice: 59,
    annualPrice: 49,
    creditsAnnual: "30,000 credits per seat per year, granted upfront",
    creditsMonthly: "2,500 credits per seat per month",
    popular: true,
    features: [
      { text: "30,000 credits per seat per year, granted upfront" },
      { text: "AI Assistant", badge: "Introductory Free" },
      { text: "AI Research & AI Lead Scoring" },
      { text: "Unlimited Outbound Sequences" },
      { text: "Prospecting, Gmail & CRM Extensions" },
      { text: "Deliverability Suite & Email Warmup" },
      { text: "Advanced ICP Filters (Seniority, Headcount, Location)", highlight: true },
      { text: "5-Question Context Synthesis (Who, Why, Pain point)", highlight: true },
      { text: "Verified Work Email Guarantees (98%+ Confidence)" },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "For teams that want multi-channel email and direct phone outreach",
    monthlyPrice: 99,
    annualPrice: 79,
    creditsAnnual: "48,000 credits per seat per year, granted upfront",
    creditsMonthly: "4,000 credits per seat per month",
    features: [
      { text: "48,000 credits per seat per year, granted upfront" },
      { text: "AI Assistant", badge: "Introductory Free" },
      { text: "AI Research & AI Lead Scoring" },
      { text: "Autonomous Prospecting AI Agents", badge: "New" },
      { text: "Direct Dial Mobile & Desk Phone Unlocks", highlight: true },
      { text: "Unlimited Sequences & A/B/Z Testing" },
      { text: "Deliverability Suite & Multi-Inbox Warmup" },
      { text: "Salesforce & HubSpot Bi-directional Sync" },
      { text: "1:1 Multi-Channel Pitch Studio (Email + LinkedIn + Battlecard)", highlight: true },
    ],
  },
  {
    id: "organization",
    name: "Organization",
    tagline: "For scaling enterprises with custom intelligence & dedicated data requirements",
    monthlyPrice: 149,
    annualPrice: 119,
    creditsAnnual: "72,000 credits per seat per year, granted upfront",
    creditsMonthly: "6,000 credits per seat per month",
    minSeats: 3,
    features: [
      { text: "72,000 credits per seat per year, granted upfront" },
      { text: "Everything in Professional +" },
      { text: "Custom ICP Machine Learning Weights & Deep Scoring", highlight: true },
      { text: "Deep Database Ingestion (Access to 1M+ Records)", highlight: true },
      { text: "Custom Bi-directional Webhooks & REST API Access" },
      { text: "Dedicated Customer Success Manager & SLA" },
      { text: "Enterprise SSO, SAML & Advanced Security Governance" },
    ],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [selectedPlanId, setSelectedPlanId] = useState<"free" | "basic" | "professional" | "organization">("basic");
  const [seats, setSeats] = useState<number>(1);

  // Checkout modal
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    paymentMethod: "Credit Card (Stripe)",
  });

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[1];
  const effectiveSeats = Math.max(selectedPlan.minSeats || 1, seats);

  const pricePerSeat =
    billingCycle === "annual" ? selectedPlan.annualPrice : selectedPlan.monthlyPrice;

  const totalDueToday =
    billingCycle === "annual"
      ? pricePerSeat * 12 * effectiveSeats
      : pricePerSeat * effectiveSeats;

  const annualContractValue = pricePerSeat * 12 * effectiveSeats;

  const handleSelectPlan = (planId: "free" | "basic" | "professional" | "organization") => {
    setSelectedPlanId(planId);
    const plan = plans.find((p) => p.id === planId);
    if (plan && plan.minSeats && seats < plan.minSeats) {
      setSeats(plan.minSeats);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);

    try {
      const orderPayload = {
        customerName: customerForm.name.trim(),
        customerEmail: customerForm.email.trim(),
        companyName: customerForm.company.trim(),
        phone: customerForm.phone.trim(),
        itemType: "subscription",
        planName: `${selectedPlan.name} Plan (${billingCycle === "annual" ? "Annual" : "Monthly"} - ${effectiveSeats} Seat${effectiveSeats > 1 ? "s" : ""})`,
        amount: totalDueToday,
        currency: "USD",
        paymentStatus: selectedPlan.id === "free" ? "paid" : "paid",
        paymentMethod: customerForm.paymentMethod,
        transactionId: `TXN_${Date.now().toString().slice(-6)}`,
        notes: `Customer upgrade order from pricing page: ${billingCycle} subscription for ${effectiveSeats} seat(s).`,
      };

      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        setCheckoutSuccess(true);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        alert("Unable to record order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Connection error during checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-slate-800 font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-36">
        <div className="container-page">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/15 text-teal-dark font-extrabold text-xs mb-3 border border-teal/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent, Predictable Sales Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0b1220] leading-tight">
              Unlock Verified B2B Contacts &amp; AI ICP Scoring
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Every plan includes verified work emails, phone numbers, and LeadIntellect’s proprietary 5-question context synthesis. Upgrade anytime.
            </p>

            {/* Annual / Monthly Toggle matching Apollo screenshot */}
            <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-2xs">
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
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
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#0b1220] text-teal shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Billed Monthly
              </button>
            </div>
          </div>

          {/* ================= 4 TIER PRICING COLUMNS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {plans.map((p) => {
              const isSelected = selectedPlanId === p.id;
              const price = billingCycle === "annual" ? p.annualPrice : p.monthlyPrice;

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPlan(p.id)}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all cursor-pointer ${
                    p.popular
                      ? "bg-[#fcfdec] border-2 border-[#e2f300] shadow-[0_12px_35px_-10px_rgba(226,243,0,0.35)]"
                      : isSelected
                      ? "bg-white border-2 border-[#0b1220] shadow-md"
                      : "bg-white border border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  {/* Badge */}
                  {p.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0b1220] text-teal font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-teal/40 shadow-xs">
                      ★ Most Popular Choice
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
                        <span className="text-4xl font-black text-[#0b1220]">${price}</span>
                        {price > 0 && (
                          <span className="text-xs text-slate-500 font-semibold">
                            / seat / month
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">
                        {price === 0
                          ? "Free forever &middot; No card required"
                          : billingCycle === "annual"
                          ? `Billed annually ($${price * 12}/yr)`
                          : "Billed month-to-month"}
                        {p.minSeats ? ` &middot; Min ${p.minSeats} seats` : ""}
                      </p>
                    </div>

                    {/* Primary Button */}
                    <div className="mt-5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan(p.id);
                          setCheckoutOpen(true);
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                          p.id === "free"
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                            : p.popular
                            ? "bg-[#e2f300] hover:bg-[#d0df00] text-[#0b1220]"
                            : isSelected
                            ? "bg-[#0b1220] text-teal"
                            : "bg-[#0b1220] hover:bg-slate-800 text-white"
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : null}
                        <span>
                          {p.id === "free" ? "Start Free Now" : isSelected ? "Plan Selected" : "Select Plan"}
                        </span>
                      </button>

                      {p.id !== "free" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = "/signup";
                          }}
                          className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-slate-800 mt-2 cursor-pointer"
                        >
                          Try for free
                        </button>
                      )}
                    </div>

                    {/* Credits Callout matching screenshot */}
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
                            <span className="bg-slate-200/80 text-slate-700 text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0">
                              {feat.badge}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                    <span className="text-[11px] text-teal-dark font-bold hover:underline">
                      See full feature breakdown &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= UNIQUE LEADINTELLECT VALUE COMPARISON ================= */}
          <div className="mt-20 max-w-4xl mx-auto rounded-3xl bg-[#0b1220] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/20 text-teal text-xs font-bold border border-teal/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The LeadIntellect Advantage</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                Why Sales Teams Win with LeadIntellect over Standard Scrapers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-extrabold text-teal text-sm mb-1">5-Question Context</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Standard platforms give you names and emails. LeadIntellect synthesizes Who, Why now, What pain, and How you solve it.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-extrabold text-teal text-sm mb-1">Pre-Verified Datasets</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Over 450+ curated decision-maker records in our seed network, with 98% verified deliverability and zero phantom bounces.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-extrabold text-teal text-sm mb-1">1:1 Battlecard Studio</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instantly output cold emails, LinkedIn connection requests, and call scripts tailored to the buyer’s seniority level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= 5. FLOATING BOTTOM SUMMARY / UPGRADE BAR (MATCHING APOLLO SCREENSHOT) ================= */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-4 sm:px-8 z-40 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Summary Details */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Summary
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {selectedPlan.name} Plan
              </span>
            </div>

            {selectedPlan.id !== "free" && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Seats:
                </span>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setSeats((s) => Math.max(selectedPlan.minSeats || 1, s - 1))}
                    className="p-1 rounded bg-white hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-black px-2 text-xs">{effectiveSeats}</span>
                  <button
                    onClick={() => setSeats((s) => s + 1)}
                    className="p-1 rounded bg-white hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {selectedPlan.id !== "free" && billingCycle === "annual" && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Billed Annually
                </span>
                <span className="text-xs font-bold text-slate-700">
                  ${annualContractValue}/yr*
                </span>
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Due Today
              </span>
              <span className="text-base font-black text-slate-900">
                ${totalDueToday}*
              </span>
            </div>
          </div>

          {/* Action Upgrade Button matching screenshot */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-[10px] text-slate-400 hidden lg:inline">
              *Sales taxes calculated at checkout
            </span>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#e2f300] hover:bg-[#d0df00] text-[#0b1220] font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Diamond className="w-4 h-4 fill-[#0b1220]" />
              <span>Upgrade to {selectedPlan.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= CHECKOUT / ORDER MODAL ================= */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#0b1220]">
                  Confirm {selectedPlan.name} Subscription
                </h3>
                <p className="text-xs text-slate-500">
                  {billingCycle === "annual" ? "Annual agreement (20% discount)" : "Monthly billing"} &middot; {effectiveSeats} seat(s)
                </p>
              </div>
              <button
                onClick={() => setCheckoutOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-extrabold text-slate-900">Payment &amp; Order Recorded!</h4>
                <p className="text-xs text-slate-600">
                  Your {selectedPlan.name} plan has been activated. Credits and features have been applied to your account.
                </p>
                <p className="text-[11px] text-teal-dark font-bold">Redirecting to your workspace...</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Adams"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Billing Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="rachel@company.com"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Company</label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={customerForm.company}
                      onChange={(e) => setCustomerForm({ ...customerForm, company: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={customerForm.phone}
                      onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Payment Method</label>
                  <select
                    value={customerForm.paymentMethod}
                    onChange={(e) => setCustomerForm({ ...customerForm, paymentMethod: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  >
                    <option value="Credit Card (Stripe)">Credit Card (Instant Activation)</option>
                    <option value="Bank Wire / ACH">Bank Wire Transfer / ACH</option>
                    <option value="Corporate Invoice (Net 30)">Corporate Invoice (Net 30)</option>
                  </select>
                </div>

                {/* Pricing Calculation Summary */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Plan:</span>
                    <span className="font-bold text-slate-900">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Seats:</span>
                    <span className="font-bold text-slate-900">{effectiveSeats}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-200">
                    <span>Total Due Today:</span>
                    <span className="text-teal-dark font-black">${totalDueToday}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="w-full py-3 rounded-xl bg-[#e2f300] hover:bg-[#d0df00] text-[#0b1220] font-black text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? "Processing Upgrade..." : `Complete & Activate ($${totalDueToday}) →`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
