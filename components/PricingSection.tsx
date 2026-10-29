"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Database,
  Globe,
  Lock,
  CheckCircle2,
  X,
  CreditCard,
  Building,
  Mail,
  Zap,
  Sparkles,
  Layers,
  Phone,
  Crown,
} from "lucide-react";
import { launchRazorpayCheckout } from "@/lib/razorpay-client";

interface PlanFeature {
  text: string;
  highlight?: boolean;
}

interface Plan {
  id: "basic" | "starter" | "growth" | "enterprise";
  name: string;
  tagline: string;
  subtext?: string;
  priceUSD: number | "Custom";
  priceINR: number | "Custom";
  priceFormattedUSD: string;
  priceFormattedINR: string;
  credits: number;
  popular?: boolean;
  ctaText: string;
  features: PlanFeature[];
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic (Pilot)",
    tagline: "Get started with the essentials",
    subtext: "Resume access — same features as your trial",
    priceUSD: 10,
    priceINR: 849,
    priceFormattedUSD: "$10",
    priceFormattedINR: "₹849",
    credits: 50,
    ctaText: "Choose Basic (Pilot)",
    features: [
      { text: "50 credits (one-time)" },
      { text: "250K Dottie AI tokens / month" },
      { text: "2,000 contacts" },
      { text: "Unlimited Company upload" },
      { text: "1 MyConvo mailboxes (1,500 sends)" },
      { text: "1 NextGen domains (1,000 sends (Shared IP))" },
      { text: "Basic analytics" },
      { text: "Community support" },
      { text: "30 min support / month" },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    tagline: "For small teams starting out",
    priceUSD: 29,
    priceINR: 2499,
    priceFormattedUSD: "$29",
    priceFormattedINR: "₹2,499",
    credits: 100,
    ctaText: "Choose Starter",
    features: [
      { text: "100 credits / month" },
      { text: "500K Dottie AI tokens / month" },
      { text: "5,000 contacts" },
      { text: "Unlimited Company upload" },
      { text: "2 MyConvo mailboxes (3,000 sends)" },
      { text: "2 NextGen domains (25,000 sends (Shared IP))" },
      { text: "Basic analytics" },
      { text: "Standard support" },
      { text: "1 hour support / month" },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For growing go-to-market teams",
    priceUSD: 85,
    priceINR: 7199,
    priceFormattedUSD: "$85",
    priceFormattedINR: "₹7,199",
    credits: 200,
    popular: true,
    ctaText: "Choose Growth",
    features: [
      { text: "200 credits / month" },
      { text: "1.0M Dottie AI tokens / month" },
      { text: "20,000 contacts" },
      { text: "Unlimited Company upload" },
      { text: "5 MyConvo mailboxes (7,500 sends)" },
      { text: "5 NextGen domains (50,000 sends (Shared IP))" },
      { text: "Standard analytics" },
      { text: "Standard support" },
      { text: "2 hours support / month" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For high-volume and complex orgs",
    subtext: "Volume pricing",
    priceUSD: "Custom",
    priceINR: "Custom",
    priceFormattedUSD: "Custom",
    priceFormattedINR: "Custom",
    credits: 10000,
    ctaText: "Contact Sales",
    features: [
      { text: "High Volume Credit" },
      { text: "High Contact Limits" },
      { text: "Custom Sending Volume" },
      { text: "Multiple Mailboxes & Domains" },
      { text: "Dedicated IP" },
      { text: "Dedicated Support" },
      { text: "Expert Audit and strategy for Email marketing" },
    ],
  },
];

export default function PricingSection() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<Plan | null>(null);

  // Email prompt modal for guests before initiating payment
  const [guestEmailModalPlan, setGuestEmailModalPlan] = useState<Plan | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem("leadintellect_currency");
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const isIndia =
        tz.includes("Calcutta") ||
        tz.includes("Kolkata") ||
        tz.toLowerCase().includes("india") ||
        (navigator.language || "").toLowerCase().includes("in");

      if (savedCurrency === "INR" || savedCurrency === "USD") {
        setCurrency(savedCurrency);
      } else if (isIndia) {
        setCurrency("INR");
      } else {
        setCurrency("USD");
      }

      const stored = localStorage.getItem("leadintellect_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.email) {
          setCurrentUser(u);
          setGuestEmail(u.email);
          setGuestName(u.name || "");
        }
      }
    } catch {
      setCurrency("USD");
    }
  }, []);

  const handleCurrencyChange = (curr: "INR" | "USD") => {
    setCurrency(curr);
    try {
      localStorage.setItem("leadintellect_currency", curr);
    } catch { }
  };

  const handleSelectPlan = (plan: Plan) => {
    setErrorMessage(null);

    // Enterprise links to contact sales
    if (plan.id === "enterprise") {
      window.location.href = "/contact?plan=enterprise";
      return;
    }

    // If user is authenticated, launch Razorpay directly
    if (currentUser && currentUser.email) {
      triggerPaymentGateway(plan, currentUser.email, currentUser.name);
    } else {
      // Prompt for email before launching Razorpay
      setGuestEmailModalPlan(plan);
    }
  };

  const triggerPaymentGateway = async (
    plan: Plan,
    emailToUse: string,
    nameToUse?: string
  ) => {
    setCheckoutLoading(true);
    setErrorMessage(null);

    await launchRazorpayCheckout({
      planId: plan.id,
      currency,
      userEmail: emailToUse,
      userName: nameToUse || emailToUse.split("@")[0],
      onSuccess: (verifiedUser) => {
        setCheckoutLoading(false);
        setGuestEmailModalPlan(null);
        setCurrentUser(verifiedUser);
        setSuccessPlan(plan);
      },
      onError: (err) => {
        setCheckoutLoading(false);
        setErrorMessage(err);
      },
      onDismiss: () => {
        setCheckoutLoading(false);
      },
    });
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmailModalPlan) return;
    if (!guestEmail || !guestEmail.includes("@")) {
      setErrorMessage("Please enter a valid business email address.");
      return;
    }
    triggerPaymentGateway(guestEmailModalPlan, guestEmail, guestName);
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#0D1117] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-page max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Pricing &amp; Instant Activation
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Predictable Pricing. Truthful Credits.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Choose the plan engineered for your outbound scale. All transactions are securely processed via Razorpay Live Gateway.
          </p>

          {/* Currency Switcher */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
              <button
                type="button"
                onClick={() => handleCurrencyChange("USD")}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${currency === "USD"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                USD ($) &ndash; Global
              </button>
              <button
                type="button"
                onClick={() => handleCurrencyChange("INR")}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${currency === "INR"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                INR (₹) &ndash; India (UPI / Cards)
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 max-w-md mx-auto p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Pricing Cards Grid matching user screenshot design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isPopular = plan.popular;
            const isUserCurrentPlan =
              currentUser &&
              currentUser.plan === plan.id &&
              currentUser.planStatus === "active";

            const priceLabel =
              currency === "INR" ? plan.priceFormattedINR : plan.priceFormattedUSD;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${isPopular
                  ? "bg-[#161F30] border-2 border-blue-500 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-400/30"
                  : "bg-[#161B26] border border-slate-800/90 hover:border-slate-700 shadow-xl"
                  }`}
              >
                {/* Popular Pill at Top */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    {isUserCurrentPlan && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                        Active Plan
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1 min-h-[36px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Price Section */}
                  <div className="mt-5 pb-5 border-b border-slate-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white">
                        {priceLabel}
                      </span>
                      {plan.priceUSD !== "Custom" && (
                        <span className="text-xs text-slate-400 font-medium">/mo</span>
                      )}
                    </div>
                    {plan.subtext && (
                      <p className="mt-1 text-[11px] text-amber-400/90 font-medium">
                        {plan.subtext}
                      </p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    disabled={checkoutLoading}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${isPopular
                      ? "bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : plan.id === "enterprise"
                        ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                        : "bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80"
                      }`}
                  >
                    {plan.id === "enterprise" ? (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>{plan.ctaText}</span>
                      </>
                    ) : (
                      <>
                        <span>{checkoutLoading ? "Connecting to Gateway..." : plan.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Partner Transparency Note */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Razorpay Live Payment Security &bull; XMagnet Global Partner Network</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Strict Anti-Scraping Protection &amp; Verified Credit Accounting
            </h4>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Database downloads and verified contact reveals are locked until an active paid subscription is verified. Free tier accounts can preview masked firmographics and test search filters. All transactions are cryptographically signed.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Live Gateway</span>
              <strong className="text-xs text-emerald-400">Razorpay Active</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Email Modal Before Payment */}
      {guestEmailModalPlan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[#161B26] border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setGuestEmailModalPlan(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Subscribe to {guestEmailModalPlan.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your work details to proceed to the secure Razorpay payment terminal.
              </p>
            </div>

            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Work Email (Account ID)
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total payable:</span>
                <strong className="text-white text-sm">
                  {currency === "INR"
                    ? guestEmailModalPlan.priceFormattedINR
                    : guestEmailModalPlan.priceFormattedUSD}
                  <span className="text-[10px] text-slate-400 font-normal"> / mo</span>
                </strong>
              </div>

              <button
                type="submit"
                disabled={checkoutLoading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {checkoutLoading ? (
                  <span>Connecting to Razorpay...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Proceed to Secure Payment &rarr;</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Plan Activated Success Confirmation Modal */}
      {successPlan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-[#161B26] border border-emerald-500/40 rounded-3xl max-w-lg w-full p-8 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Payment Verified &amp; Plan Active!</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Congratulations! Your account is now active on the <strong className="text-white">{successPlan.name}</strong>.
            </p>
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
              <Zap className="w-4 h-4 inline mr-1" />
              {successPlan.credits} verified contact reveal credits and full database access have been unlocked!
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setSuccessPlan(null);
                  window.location.href = "/dashboard";
                }}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
              >
                Open Workspace Dashboard &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
