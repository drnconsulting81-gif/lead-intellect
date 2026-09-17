"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  User,
  Briefcase,
  Building,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Database,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StartTrialPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    companyName: "",
    email: "",
    phone: "",
    comments: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Failed to activate trial.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container-page">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
            {/* Left side: Trial Highlights */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                14-DAY FULL ACCESS TRIAL &middot; NO CREDIT CARD REQUIRED
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight leading-tight">
                Start Finding &amp; Qualifying Verified B2B Buyers in Minutes
              </h1>
              <p className="mt-4 text-base text-text-muted leading-relaxed">
                Experience the power of AI sales intelligence. Activate your 14-day trial to search
                custom accounts, score ICP fit from 0 to 100, and unlock verified decision-maker emails.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-border">
                  <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal-dark shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-navy">AI Prospecting Agent</h2>
                    <p className="text-xs text-text-muted mt-0.5">
                      Describe your ideal buyers in plain English and generate precision lists instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-border">
                  <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center text-violet shrink-0 mt-0.5">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-navy">Instant ICP Scoring (0-100)</h2>
                    <p className="text-xs text-text-muted mt-0.5">
                      Classify prospects into Tier 1, Tier 2, and Tier 3 based on custom signals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-border">
                  <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-teal shrink-0 mt-0.5">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-navy">50 Free Verified Contact Credits</h2>
                    <p className="text-xs text-text-muted mt-0.5">
                      Enrich verified business emails and direct dials powered by compliant data partners.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-6 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-dark" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-dark" /> Cancel anytime
                </span>
              </div>
            </div>

            {/* Right side: Interactive Form */}
            <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(11,18,32,0.12)]">
              {submitted ? (
                <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-teal/15 text-teal-dark flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-navy">Your Free Trial is Active!</h2>
                  <p className="mt-3 text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                    Welcome aboard, <strong className="text-navy">{formData.fullName}</strong>. Your 14-day access pass for <strong className="text-navy">{formData.companyName}</strong> has been provisioned. We sent your login credentials and API keys to <strong className="text-navy">{formData.email}</strong>.
                  </p>

                  <div className="mt-8 p-4 rounded-xl bg-surface border border-border text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Account Holder:</span>
                      <span className="font-semibold text-navy">{formData.fullName} ({formData.title})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Workspace:</span>
                      <span className="font-semibold text-navy">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Trial Duration:</span>
                      <span className="font-semibold text-teal-dark">14 Days Unlimited</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Credits:</span>
                      <span className="font-semibold text-navy">50 Free Verified Leads</span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3 justify-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-6 py-3 rounded-lg bg-navy text-teal hover:bg-teal hover:text-navy transition-colors shadow-md"
                    >
                      Log In to Workspace
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-navy">Create Your Free Trial Account</h2>
                    <p className="text-xs text-text-muted mt-1">
                      Start your 14-day trial. Instant access, zero risk.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-1">
                        Full Name <span className="text-teal">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="text"
                          required
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Jordan Miller"
                          className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1">
                          Title / Role <span className="text-teal">*</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Head of Growth"
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1">
                          Company Name <span className="text-teal">*</span>
                        </label>
                        <div className="relative">
                          <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            required
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="e.g. CloudMatrix Inc."
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1">
                          Work Email <span className="text-teal">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="email"
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="jordan@company.com"
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1">
                          Phone Number <span className="text-teal">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="tel"
                            required
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy mb-1">
                        Comments / Target Segment Requirements
                      </label>
                      <div className="relative">
                        <MessageSquare className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                        <textarea
                          rows={3}
                          name="comments"
                          value={formData.comments}
                          onChange={handleChange}
                          placeholder="What accounts or geography are you looking to test during your 14-day trial?"
                          className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 bg-teal text-navy hover:bg-teal-dark hover:text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Activating Account...</span>
                      ) : (
                        <>
                          <span>Activate My 14-Day Free Trial</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-text-muted text-center pt-1">
                      Instant setup &middot; 50 free enriched contacts included &middot; No credit card required.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
