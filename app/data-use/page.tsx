"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, CheckCircle2, AlertCircle, Send, Database, Lock } from "lucide-react";

export default function DataUsePage() {
  const [emailToSuppress, setEmailToSuppress] = useState("");
  const [reason, setReason] = useState("Individual opt-out request");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSuppress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToSuppress || !emailToSuppress.includes("@")) {
      setErrorMsg("Please enter a valid business email address.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/privacy/suppress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToSuppress, reason }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || "Your email address has been permanently added to the global suppression list.");
        setEmailToSuppress("");
      } else {
        setErrorMsg(data.error || "Failed to process opt-out request.");
      }
    } catch {
      setErrorMsg("Network error. Please try again or email privacy@leadintellect.ai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container-page max-w-4xl mx-auto">
          <div className="mb-10 pb-6 border-b border-slate-200">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              DATA PROVENANCE &amp; RESPONSIBLE USE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              Data Use &amp; Suppression Registry
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-2">
              How we source B2B information, verify deliverability, and respect individual data rights.
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-base font-bold text-navy flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-teal-dark" />
                Data Provenance Standards
              </h2>
              <p>
                LeadIntellect aggregates and cleans professional business data sourced from public corporate
                filings, business directories, company websites, and corporate social networks. We maintain
                field-level provenance to distinguish between:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1.5">
                <li>
                  <b className="text-navy">Verified Original:</b> Directly verified through corporate domain MX checks and syntax validation.
                </li>
                <li>
                  <b className="text-navy">Company MX Pattern:</b> Sourced via established corporate email syntax (e.g. first.last@company.com).
                </li>
                <li>
                  <b className="text-navy">Unverified / Stale:</b> Information requiring on-demand provider enrichment before contact.
                </li>
              </ul>
            </section>

            {/* Interactive Opt-Out & Suppression Form */}
            <section className="rounded-2xl border border-slate-300 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-navy flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                Global Opt-Out &amp; Suppression Registry
              </h2>
              <p className="text-text-muted text-xs leading-relaxed mb-6">
                If you are a business professional and wish to have your contact details permanently suppressed from
                LeadIntellect search, lists, and exports, submit your business email address below. Suppressed records
                are immediately excluded from all future discovery queries.
              </p>

              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Opt-Out Confirmed</p>
                    <p className="mt-0.5">{successMsg}</p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSuppress} className="space-y-4 max-w-lg">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-navy mb-1.5">
                    Business Email to Suppress *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={emailToSuppress}
                    onChange={(e) => setEmailToSuppress(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal-dark"
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-xs font-bold text-navy mb-1.5">
                    Reason for Request
                  </label>
                  <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal-dark bg-white"
                  >
                    <option value="Individual opt-out request">I prefer not to be contacted for B2B outreach</option>
                    <option value="Left company / Changed role">I have left this company or role</option>
                    <option value="Inaccurate contact details">The listed contact information is inaccurate</option>
                    <option value="General privacy preference">General privacy preference</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Submit Suppression Request"}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
