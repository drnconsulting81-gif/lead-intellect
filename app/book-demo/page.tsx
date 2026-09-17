"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Briefcase,
  Building,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  Shield,
  Sparkles,
  Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BookDemoPage() {
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
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Failed to submit demo request.");
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
            {/* Left side: Context & Demo Details */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                TAILORED 30-MINUTE WALKTHROUGH
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight leading-tight">
                See How LeadIntellect Uncovers Your Next High-Value Accounts
              </h1>
              <p className="mt-4 text-base text-text-muted leading-relaxed">
                Join our B2B sales intelligence specialist for a 1-on-1 walkthrough tailored
                directly to your ideal customer profile (ICP), target industries, and growth goals.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-border">
                  <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal-dark shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-navy">Live ICP Scoring on Your Target Market</h2>
                    <p className="text-xs text-text-muted mt-0.5">
                      Watch us configure your criteria and score 100 sample accounts in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-border">
                  <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center text-violet shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-navy">Decision-Maker Mapping</h2>
                    <p className="text-xs text-text-muted mt-0.5">
                      See how our AI agent identifies verified VPs, CXOs, and buying committee members.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-border">
                  <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-teal shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-navy">Context &amp; Next Best Action</h2>
                    <p className="text-xs text-text-muted mt-0.5">
                      Discover the exact reasons why each prospect is ready for outreach today.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-6 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-dark" /> No spam guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-dark" /> Flexible scheduling
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
                  <h2 className="text-2xl font-extrabold text-navy">Demo Request Confirmed!</h2>
                  <p className="mt-3 text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-navy">{formData.fullName}</strong>. A dedicated product specialist has received your requirements for <strong className="text-navy">{formData.companyName}</strong> and will reach out to <strong className="text-navy">{formData.email}</strong> shortly with your calendar invite.
                  </p>

                  <div className="mt-8 p-4 rounded-xl bg-surface border border-border text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Requested by:</span>
                      <span className="font-semibold text-navy">{formData.fullName} ({formData.title})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Company:</span>
                      <span className="font-semibold text-navy">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Phone:</span>
                      <span className="font-semibold text-navy">{formData.phone || "Provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Status:</span>
                      <span className="font-semibold text-teal-dark">Meeting Invitation Dispatched</span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3 justify-center">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-lg border border-border hover:border-navy text-navy transition-colors"
                    >
                      Return to Home
                    </Link>
                    <Link
                      href="/start-trial"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-lg bg-teal text-navy hover:bg-teal-dark hover:text-white transition-colors"
                    >
                      Start Free Trial While You Wait
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-navy">Book Your Personalized Demo</h2>
                    <p className="text-xs text-text-muted mt-1">
                      Fill out your details below and our team will get in touch to coordinate a time.
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
                          placeholder="e.g. Alex Henderson"
                          className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1">
                          Job Title <span className="text-teal">*</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. VP of Sales / CRO"
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
                            placeholder="e.g. Enterprise Global"
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
                            placeholder="alex@company.com"
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
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy mb-1">
                        Comments / Specific Prospecting Goals
                      </label>
                      <div className="relative">
                        <MessageSquare className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                        <textarea
                          rows={3}
                          name="comments"
                          value={formData.comments}
                          onChange={handleChange}
                          placeholder="Tell us about your target accounts, current prospecting bottlenecks, or tech stack..."
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
                        <span>Scheduling Demo...</span>
                      ) : (
                        <>
                          <span>Schedule My VIP Demo</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-text-muted text-center pt-1">
                      By submitting, you agree to our Terms of Service &middot; Zero sales pressure.
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
