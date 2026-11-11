"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  UserCheck,
  X,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface LeadItem {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  linkedin: string;
  isUnlocked?: boolean;
  isRevealed?: boolean;
}

const FEATURED_INDUSTRIES = [
  "All Industries",
  "Healthcare",
  "Real Estate",
  "Manufacturing",
  "Technology",
  "Financial Services",
  "Software",
  "Retail",
];

export default function SearchableDirectory() {
  const [query, setQuery] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [cityFilter, setCityFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(85500);
  const [unlockedModalLead, setUnlockedModalLead] = useState<LeadItem | null>(null);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  // Load user session if any
  useEffect(() => {
    try {
      const stored = localStorage.getItem("leadintellect_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.email) setCurrentUser(u);
      }
    } catch {}
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("query", query.trim());
      if (titleFilter.trim()) params.set("title", titleFilter.trim());
      if (industryFilter !== "All Industries") params.set("industry", industryFilter);
      if (cityFilter.trim()) params.set("location", cityFilter.trim());
      if (companyFilter.trim()) params.set("company", companyFilter.trim());
      params.set("limit", "15");
      if (currentUser?.email) params.set("userEmail", currentUser.email);

      const res = await fetch(`/api/prospects?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.prospects || []);
        if (data.total) setTotalCount(data.total);
      }
    } catch (err) {
      console.error("Error fetching directory leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 250);
    return () => clearTimeout(timer);
  }, [query, titleFilter, industryFilter, cityFilter, companyFilter, currentUser?.email]);

  const handleUnlockClick = async (lead: LeadItem) => {
    if (!currentUser) {
      setUnlockedModalLead(lead);
      setSignupModalOpen(true);
      return;
    }

    // If logged in, navigate to dashboard to unlock with their free credits
    window.location.href = `/dashboard?unlock=${lead.id}&mode=people`;
  };

  return (
    <section id="directory" className="py-20 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200">
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 border border-teal/20 text-teal-dark font-bold text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Searchable B2B Database Directory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
            Explore 85,000+ Validated B2B Decision-Makers
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Search genuine, verified leads by job title, industry, city, and company. External visitors receive{" "}
            <span className="font-bold text-teal-dark">10 free credits upon signup</span> to immediately unlock direct dials and emails.
          </p>
        </div>

        {/* Directory Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Job Title / Role */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Job Title / Role
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. VP Sales, CTO, Director..."
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value)}
                  className="w-full text-xs py-2.5 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal-dark transition-all"
                />
                {titleFilter && (
                  <button
                    onClick={() => setTitleFilter("")}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Industry
              </label>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal-dark font-medium text-slate-700 cursor-pointer transition-all"
              >
                {FEATURED_INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Location / City */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Location / City
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. New York, London, Mumbai..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full text-xs py-2.5 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal-dark transition-all"
                />
                {cityFilter && (
                  <button
                    onClick={() => setCityFilter("")}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Company Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Stripe, Acme, Pfizer..."
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full text-xs py-2.5 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal-dark transition-all"
                />
                {companyFilter && (
                  <button
                    onClick={() => setCompanyFilter("")}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-semibold text-[11px] mr-1">Popular Roles:</span>
              {["VP Sales", "Chief Technology Officer", "Marketing Director", "Founder / Owner", "Chief Financial Officer"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTitleFilter(role)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    titleFilter === role
                      ? "bg-teal-dark text-white shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {(titleFilter || industryFilter !== "All Industries" || cityFilter || companyFilter) && (
              <button
                type="button"
                onClick={() => {
                  setTitleFilter("");
                  setIndustryFilter("All Industries");
                  setCityFilter("");
                  setCompanyFilter("");
                }}
                className="text-rose-600 hover:text-rose-700 font-bold text-xs cursor-pointer ml-auto"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Directory Results Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-navy">
                Showing {leads.length} of {totalCount.toLocaleString()} Verified Records
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                100% SMTP Checked
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-dark hover:bg-teal-dark/90 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Open Full Workspace ({currentUser.credits || 10} Credits)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-dark to-navy text-white text-xs font-bold transition-all shadow-xs hover:shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal" />
                  <span>Claim 10 Free Credits</span>
                </Link>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-navy font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Decision Maker</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">LinkedIn</th>
                  <th className="py-3 px-4">Official Email</th>
                  <th className="py-3 px-4">Direct Phone</th>
                  <th className="py-3 px-4 text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-teal-dark" />
                        <span className="font-semibold text-xs text-navy">Searching LeadIntellect master directory...</span>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-500">
                      <p className="font-bold text-navy text-sm">No matching records found.</p>
                      <p className="text-xs text-slate-400 mt-1">Try broadening your job title, location, or industry filters.</p>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const isUnlocked = lead.isUnlocked || lead.isRevealed;
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & Title */}
                        <td className="py-3.5 px-4 font-semibold text-navy">
                          <div className="font-bold text-sm text-navy">{lead.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                            {lead.title}
                          </div>
                        </td>

                        {/* Company */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{lead.company}</span>
                          </div>
                        </td>

                        {/* Industry */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {lead.industry || "General B2B"}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[140px]">
                              {lead.city ? `${lead.city}, ` : ""}
                              {lead.country}
                            </span>
                          </div>
                        </td>

                        {/* LinkedIn */}
                        <td className="py-3.5 px-4">
                          {lead.linkedin ? (
                            <a
                              href={lead.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 hover:underline"
                            >
                              <span>Profile</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Masked/Unlocked Email */}
                        <td className="py-3.5 px-4">
                          {isUnlocked ? (
                            <span className="font-bold text-emerald-700 text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="select-all">{lead.email}</span>
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[11px] select-none">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span className="blur-[2px]">{lead.email || "j***@company.com"}</span>
                            </div>
                          )}
                        </td>

                        {/* Masked/Unlocked Phone */}
                        <td className="py-3.5 px-4">
                          {isUnlocked ? (
                            <span className="font-bold text-navy text-xs select-all">
                              {lead.phone}
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[11px] select-none">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span className="blur-[2px]">{lead.phone || "+91 987*****"}</span>
                            </div>
                          )}
                        </td>

                        {/* Action / Unlock Button */}
                        <td className="py-3.5 px-4 text-right">
                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Unlocked</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUnlockClick(lead)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-dark hover:bg-navy text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap"
                            >
                              <Unlock className="w-3 h-3 text-teal" />
                              <span>Unlock Contact</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Directory Footer Banner */}
          <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-dark" />
              <span>Full compliance: GDPR &amp; CAN-SPAM aligned with real-time MX deliverability verification.</span>
            </div>
            <Link
              href="/signup"
              className="font-bold text-teal-dark hover:text-navy flex items-center gap-1"
            >
              <span>Sign up for 10 free credits to unlock contacts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Visitor Unlock Prompt Modal */}
      {signupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSignupModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-navy cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal-dark mb-4">
              <Unlock className="w-6 h-6 text-teal-dark" />
            </div>

            <h3 className="text-xl font-extrabold text-navy">
              Unlock Contact Coordinates
            </h3>

            {unlockedModalLead && (
              <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <p className="font-bold text-navy">{unlockedModalLead.name}</p>
                <p className="text-slate-500">{unlockedModalLead.title} at {unlockedModalLead.company}</p>
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Create your free account on LeadIntellect to unlock verified email addresses, direct dial phone numbers, and full buyer intent radar.
            </p>

            <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-teal/15 to-indigo-50 border border-teal/30">
              <div className="flex items-center gap-2 font-bold text-xs text-navy">
                <Sparkles className="w-4 h-4 text-teal-dark" />
                <span>Special Welcome Offer</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Receive <strong className="text-teal-dark">10 Free Credits</strong> instantly upon registration. No credit card required.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/signup"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-dark to-navy text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Sign Up &amp; Get 10 Free Credits</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center transition-colors"
              >
                <span>Already have an account? Log In</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

