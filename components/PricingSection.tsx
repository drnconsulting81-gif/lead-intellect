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
  Search,
} from "lucide-react";
import { launchRazorpayCheckout } from "@/lib/razorpay-client";

interface PlanFeature {
  text: string;
  checkColor?: "blue" | "green";
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
    priceUSD: 5,
    priceINR: 449,
    priceFormattedUSD: "$5",
    priceFormattedINR: "₹449",
    credits: 50,
    ctaText: "Choose Basic (Pilot)",
    features: [
      { text: "50 credits (one-time)", checkColor: "blue" },
      { text: "250K Dottie AI tokens / month", checkColor: "blue" },
      { text: "2,000 contacts", checkColor: "green" },
      { text: "Unlimited Company upload", checkColor: "green" },
      { text: "1 MyConvo mailboxes (1,500 sends)", checkColor: "green" },
      { text: "1 NextGen domains (1,000 sends (Shared IP))", checkColor: "green" },
      { text: "Basic analytics", checkColor: "green" },
      { text: "Community support", checkColor: "green" },
      { text: "30 min support / month", checkColor: "green" },
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
      { text: "100 credits / month", checkColor: "blue" },
      { text: "500K Dottie AI tokens / month", checkColor: "blue" },
      { text: "5,000 contacts", checkColor: "green" },
      { text: "Unlimited Company upload", checkColor: "green" },
      { text: "2 MyConvo mailboxes (3,000 sends)", checkColor: "green" },
      { text: "2 NextGen domains (25,000 sends (Shared IP))", checkColor: "green" },
      { text: "Basic analytics", checkColor: "green" },
      { text: "Standard support", checkColor: "green" },
      { text: "1 hour support / month", checkColor: "green" },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For growing go-to-market teams",
    priceUSD: 79,
    priceINR: 6799,
    priceFormattedUSD: "$79",
    priceFormattedINR: "₹6,799",
    credits: 200,
    popular: true,
    ctaText: "Choose Growth",
    features: [
      { text: "200 credits / month", checkColor: "blue" },
      { text: "1.0M Dottie AI tokens / month", checkColor: "blue" },
      { text: "20,000 contacts", checkColor: "green" },
      { text: "Unlimited Company upload", checkColor: "green" },
      { text: "5 MyConvo mailboxes (7,500 sends)", checkColor: "green" },
      { text: "5 NextGen domains (50,000 sends (Shared IP))", checkColor: "green" },
      { text: "Standard analytics", checkColor: "green" },
      { text: "Standard support", checkColor: "green" },
      { text: "2 hours support / month", checkColor: "green" },
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
      { text: "High Volume Credit", checkColor: "blue" },
      { text: "High Contact Limits", checkColor: "green" },
      { text: "Custom Sending Volume", checkColor: "green" },
      { text: "Multiple Mailboxes & Domains", checkColor: "green" },
      { text: "Dedicated IP", checkColor: "green" },
      { text: "Dedicated Support", checkColor: "green" },
      { text: "Expert Audit and strategy for Email marketing", checkColor: "green" },
    ],
  },
];

export default function PricingSection() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<Plan | null>(null);

  // Plan Upgrade & Email Verification modal state
  const [upgradeModalPlan, setUpgradeModalPlan] = useState<Plan | null>(null);
  const [upgradeStep, setUpgradeStep] = useState<"details" | "verify">("details");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [modalSuccessMsg, setModalSuccessMsg] = useState<string | null>(null);

  // Preferred payment method & search for options
  const [selectedMethod, setSelectedMethod] = useState<"card" | "netbanking" | "upi" | "wallet">("card");
  const [paymentSearchQuery, setPaymentSearchQuery] = useState("");

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
          setUserEmail(u.email);
          setUserName(u.name || "");
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
    setModalSuccessMsg(null);
    setVerificationCode("");

    // Enterprise links to contact sales
    if (plan.id === "enterprise") {
      window.location.href = "/contact?plan=enterprise";
      return;
    }

    setUpgradeModalPlan(plan);
    const emailToUse = (currentUser && currentUser.email) ? currentUser.email : userEmail;
    const nameToUse = (currentUser && currentUser.name) ? currentUser.name : userName;
    setUserEmail(emailToUse);
    setUserName(nameToUse);

    if (currentUser && currentUser.email) {
      // User is logged in -> dispatch verification code right away
      sendUpgradeVerificationCode(plan, currentUser.email, currentUser.name);
    } else {
      setUpgradeStep("details");
    }
  };

  const sendUpgradeVerificationCode = async (plan: Plan, email: string, name?: string) => {
    setIsSendingCode(true);
    setErrorMessage(null);
    setModalSuccessMsg(null);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          name: name || email.split("@")[0],
          purpose: "upgrade",
          planName: plan.name,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUpgradeStep("verify");
        setModalSuccessMsg(`✓ 6-digit verification code dispatched to ${email}. Check your inbox.`);
      } else {
        setErrorMessage(data.error || "Failed to dispatch verification code.");
      }
    } catch {
      setErrorMessage("Error contacting verification service.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleGuestDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upgradeModalPlan) return;
    if (!userEmail || !userEmail.includes("@")) {
      setErrorMessage("Please enter a valid business email address.");
      return;
    }
    sendUpgradeVerificationCode(upgradeModalPlan, userEmail, userName);
  };

  const handleVerifyAndProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upgradeModalPlan) return;
    if (!verificationCode || verificationCode.trim().length < 4) {
      setErrorMessage("Please enter the 6-digit verification code from your email.");
      return;
    }

    setCheckoutLoading(true);
    setErrorMessage(null);

    try {
      // 1. Verify code
      const verifyRes = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail.toLowerCase().trim(),
          code: verificationCode.trim(),
          purpose: "upgrade",
        }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setErrorMessage(verifyData.error || "Invalid verification code.");
        setCheckoutLoading(false);
        return;
      }

      // 2. Launch Razorpay with chosen preferredMethod (card prioritized for global)
      await launchRazorpayCheckout({
        planId: upgradeModalPlan.id,
        currency,
        userEmail: userEmail.toLowerCase().trim(),
        userName: userName || userEmail.split("@")[0],
        preferredMethod: selectedMethod,
        onSuccess: (verifiedUser) => {
          setCheckoutLoading(false);
          setUpgradeModalPlan(null);
          setCurrentUser(verifiedUser);
          setSuccessPlan(upgradeModalPlan);
        },
        onError: (err) => {
          setCheckoutLoading(false);
          setErrorMessage(err);
        },
        onDismiss: () => {
          setCheckoutLoading(false);
        },
      });
    } catch {
      setErrorMessage("Connection error while communicating with gateway.");
      setCheckoutLoading(false);
    }
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
                  ? "bg-[#131926] border-2 border-blue-500 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/30"
                  : "bg-[#131926] border border-slate-800/90 hover:border-slate-700 shadow-xl"
                  }`}
              >
                {/* Popular Pill at Top */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white text-[11px] font-bold tracking-wider px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {plan.id === "enterprise" && (
                        <svg className="w-4 h-4 text-blue-400 shrink-0 inline-block" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        </svg>
                      )}
                      <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                    </div>
                    {isUserCurrentPlan && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                        Active Plan
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1 min-h-[32px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Price Section */}
                  <div className="mt-4 pb-2">
                    {plan.priceUSD === "Custom" ? (
                      <div>
                        <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                          Custom
                        </span>
                        {plan.subtext && (
                          <p className="mt-1 text-xs text-slate-400 font-normal">
                            {plan.subtext}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            {priceLabel}
                          </span>
                          <span className="text-xs text-slate-400 font-normal">/mo</span>
                        </div>
                        {plan.subtext && (
                          <p className="mt-1 text-xs text-[#EAB308] font-semibold leading-relaxed">
                            {plan.subtext}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${f.checkColor === "blue" ? "text-[#3B82F6]" : "text-[#10B981]"
                            }`}
                        />
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
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 bg-[#1A2232] hover:bg-[#232D42] text-slate-200 hover:text-white border border-slate-700/70 shadow-sm"
                  >
                    {plan.id === "enterprise" ? (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>{plan.ctaText}</span>
                      </>
                    ) : (
                      <>
                        <span>{checkoutLoading ? "Connecting..." : `${plan.ctaText} \u2192`}</span>
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

      {/* Plan Upgrade & Email Verification Modal */}
      {upgradeModalPlan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-[#161B26] border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 my-8">
            <button
              type="button"
              onClick={() => {
                setUpgradeModalPlan(null);
                setErrorMessage(null);
                setModalSuccessMsg(null);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Upgrade to {upgradeModalPlan.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {currency === "INR" ? upgradeModalPlan.priceFormattedINR : upgradeModalPlan.priceFormattedUSD} / month &bull; Instant plan activation &amp; credit allocation
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
                <span>{errorMessage}</span>
                <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {modalSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold text-center">
                {modalSuccessMsg}
              </div>
            )}

            {upgradeStep === "details" ? (
              /* Step 1: Work Details for guest */
              <form onSubmit={handleGuestDetailsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Work Email (Account to Upgrade)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total payable:</span>
                  <strong className="text-white text-sm">
                    {currency === "INR"
                      ? upgradeModalPlan.priceFormattedINR
                      : upgradeModalPlan.priceFormattedUSD}
                    <span className="text-[10px] text-slate-400 font-normal"> / mo</span>
                  </strong>
                </div>

                <button
                  type="submit"
                  disabled={isSendingCode}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSendingCode ? "Sending Security Code..." : "Send Verification Code to Email →"}
                </button>
              </form>
            ) : (
              /* Step 2: Verification Code & Payment Option Selector with Search */
              <form onSubmit={handleVerifyAndProceedToPayment} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-xs text-slate-300 block mb-1">
                    Enter the 6-digit verification code sent to <strong className="text-white">{userEmail}</strong>
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full py-3 text-center text-3xl font-mono tracking-[8px] font-extrabold rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex items-center justify-between mt-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => sendUpgradeVerificationCode(upgradeModalPlan, userEmail, userName)}
                      disabled={isSendingCode}
                      className="text-blue-400 hover:underline cursor-pointer"
                    >
                      {isSendingCode ? "Resending..." : "Resend 6-Digit Code"}
                    </button>
                    {!currentUser && (
                      <button
                        type="button"
                        onClick={() => setUpgradeStep("details")}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        Change Email
                      </button>
                    )}
                  </div>
                </div>

                {/* Global Card Option & Payment Option Search */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-200">
                      Payment Options (Cards &amp; Alternative Methods)
                    </label>
                    <span className="text-[10px] text-emerald-400 font-semibold">100% Secure via Razorpay</span>
                  </div>

                  {/* Payment Method Search Bar */}
                  <div className="relative mb-3">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search payment options (Cards, UPI, Netbanking, Wallets...)"
                      value={paymentSearchQuery}
                      onChange={(e) => setPaymentSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {/* Global Cards Option */}
                    {(!paymentSearchQuery || "cards visa mastercard amex global credit debit".includes(paymentSearchQuery.toLowerCase())) && (
                      <div
                        onClick={() => setSelectedMethod("card")}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedMethod === "card"
                            ? "bg-blue-600/15 border-blue-500 text-white"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className={`w-4 h-4 ${selectedMethod === "card" ? "text-blue-400" : "text-slate-400"}`} />
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>Cards (Global Visa, MasterCard, Amex)</span>
                              <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-extrabold uppercase">
                                Recommended for Global
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Accepted worldwide from 130+ countries &bull; Instant activation
                            </span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedMethod === "card"}
                          onChange={() => setSelectedMethod("card")}
                          className="text-blue-600"
                        />
                      </div>
                    )}

                    {/* UPI Option */}
                    {(!paymentSearchQuery || "upi gpay phonepe paytm bhim qr".includes(paymentSearchQuery.toLowerCase())) && (
                      <div
                        onClick={() => setSelectedMethod("upi")}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedMethod === "upi"
                            ? "bg-blue-600/15 border-blue-500 text-white"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Zap className={`w-4 h-4 ${selectedMethod === "upi" ? "text-teal" : "text-slate-400"}`} />
                          <div>
                            <div className="text-xs font-bold text-white">
                              UPI &amp; QR Code (Instant)
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Google Pay, PhonePe, Paytm, BHIM &amp; UPI ID
                            </span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedMethod === "upi"}
                          onChange={() => setSelectedMethod("upi")}
                          className="text-blue-600"
                        />
                      </div>
                    )}

                    {/* NetBanking Option */}
                    {(!paymentSearchQuery || "netbanking bank hdfc icici sbi wire".includes(paymentSearchQuery.toLowerCase())) && (
                      <div
                        onClick={() => setSelectedMethod("netbanking")}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedMethod === "netbanking"
                            ? "bg-blue-600/15 border-blue-500 text-white"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Building className={`w-4 h-4 ${selectedMethod === "netbanking" ? "text-blue-400" : "text-slate-400"}`} />
                          <div>
                            <div className="text-xs font-bold text-white">
                              NetBanking (50+ Banks)
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              HDFC, ICICI, SBI, Axis, Kotak, and international banking gateways
                            </span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedMethod === "netbanking"}
                          onChange={() => setSelectedMethod("netbanking")}
                          className="text-blue-600"
                        />
                      </div>
                    )}

                    {/* Wallets Option */}
                    {(!paymentSearchQuery || "wallets mobikwik airtel paylater".includes(paymentSearchQuery.toLowerCase())) && (
                      <div
                        onClick={() => setSelectedMethod("wallet")}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedMethod === "wallet"
                            ? "bg-blue-600/15 border-blue-500 text-white"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Layers className={`w-4 h-4 ${selectedMethod === "wallet" ? "text-purple-400" : "text-slate-400"}`} />
                          <div>
                            <div className="text-xs font-bold text-white">
                              Wallets &amp; PayLater
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Mobikwik, Airtel Money, and partner wallets
                            </span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedMethod === "wallet"}
                          onChange={() => setSelectedMethod("wallet")}
                          className="text-blue-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total payable:</span>
                  <strong className="text-white text-sm">
                    {currency === "INR"
                      ? upgradeModalPlan.priceFormattedINR
                      : upgradeModalPlan.priceFormattedUSD}
                    <span className="text-[10px] text-slate-400 font-normal"> / mo</span>
                  </strong>
                </div>

                <button
                  type="submit"
                  disabled={checkoutLoading || verificationCode.length < 4}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {checkoutLoading ? (
                    <span>Verifying Code &amp; Opening Razorpay...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Verify Code &amp; Launch Payment &rarr;</span>
                    </>
                  )}
                </button>
              </form>
            )}
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
