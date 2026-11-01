"use client";

import { useState } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function NewsletterSubscribeForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid work email address.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "LinkedIn Flagship Article Newsletter CTA",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>✓ Subscribed! You will receive the weekly LeadIntellect B2B Sales Intelligence editorial.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
        <div className="relative flex-1">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your work email address"
            required
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>{loading ? "Subscribing..." : "Subscribe"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {errorMsg && (
        <p className="text-[11px] text-amber-300 text-center font-medium">{errorMsg}</p>
      )}
    </form>
  );
}
