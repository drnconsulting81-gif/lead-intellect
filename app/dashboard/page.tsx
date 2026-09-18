"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Users,
  Building2,
  Mail,
  Phone,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  BookmarkPlus,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Compass,
  ListFilter,
  Send,
  Calendar,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Diamond,
  HelpCircle,
  LogOut,
  Copy,
  Check,
  X,
  Target,
  Layers,
  ArrowUpRight,
  Clock,
  Briefcase,
  Bot,
  UserCheck,
} from "lucide-react";
import Logo from "@/components/Logo";
import { LinkedInIcon } from "@/components/SocialIcons";

interface Prospect {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  seniority: string;
  company: string;
  industry: string;
  employees: number;
  employeeRange: string;
  location: string;
  city: string;
  state: string;
  country: string;
  email: string;
  emailStatus: string;
  emailConfidence: number;
  phone: string;
  phoneType: string;
  linkedin: string;
  technologies: string[];
  icpScore: number;
  icpTier: string;
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  company?: string;
  title?: string;
  provider: string;
  role?: "admin" | "user";
  credits?: number;
}

export default function ApolloDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [credits, setCredits] = useState<number>(100);
  const [loading, setLoading] = useState(true);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Stats
  const [stats, setStats] = useState({
    totalTier1: 0,
    totalVerifiedEmails: 0,
    totalDirectPhones: 0,
    avgIcpScore: 0,
  });

  // Filters State (Apollo-style)
  const [query, setQuery] = useState("");
  const [icpTier, setIcpTier] = useState("all");
  const [seniority, setSeniority] = useState<string[]>([]);
  const [industry, setIndustry] = useState("all");
  const [employeeRange, setEmployeeRange] = useState("all");
  const [hasEmail, setHasEmail] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");

  // UI States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [revealedData, setRevealedData] = useState<Record<string, { email?: string; phone?: string }>>({});
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<"home" | "people" | "companies" | "lists" | "enrichment">("people");
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(true);

  // Pitch Generator Modal State
  const [pitchModalProspect, setPitchModalProspect] = useState<Prospect | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Saved user profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);

  // Load user session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("leadintellect_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
          setCredits(parsed.credits ?? (parsed.role === "admin" ? 999999 : 100));
        }
      } else {
        // Fallback guest session for immediate demonstration
        const guest: UserSession = {
          id: "guest_" + Date.now().toString().slice(-4),
          name: "Guest Prospector",
          email: "guest@leadintellect.ai",
          company: "Growth Partner",
          provider: "email",
          role: "user",
          credits: 100,
        };
        setCurrentUser(guest);
        setCredits(100);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch prospects from API with debounce / filter dependencies
  const fetchProspects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (icpTier !== "all") params.set("icpTier", icpTier);
      if (seniority.length > 0) params.set("seniority", seniority.join(","));
      if (industry !== "all") params.set("industry", industry);
      if (employeeRange !== "all") params.set("employeeRange", employeeRange);
      if (hasEmail) params.set("hasEmail", "true");
      if (hasPhone) params.set("hasPhone", "true");
      if (locationQuery) params.set("location", locationQuery);
      params.set("page", page.toString());
      params.set("limit", "25");

      const res = await fetch(`/api/prospects?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProspects(data.prospects || []);
        setTotalCount(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load prospects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, [page, icpTier, seniority, industry, employeeRange, hasEmail, hasPhone]);

  // Handle manual search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProspects();
  };

  // Toggle seniority filter
  const toggleSeniority = (level: string) => {
    setPage(1);
    setSeniority((prev) =>
      prev.includes(level) ? prev.filter((s) => s !== level) : [...prev, level]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setQuery("");
    setIcpTier("all");
    setSeniority([]);
    setIndustry("all");
    setEmployeeRange("all");
    setHasEmail(false);
    setHasPhone(false);
    setLocationQuery("");
    setPage(1);
  };

  // Reveal contact details using 1 credit
  const handleRevealContact = async (prospect: Prospect) => {
    if (revealedData[prospect.id]) return;
    if (credits <= 0 && currentUser?.role !== "admin") {
      alert("You have run out of credits! Please upgrade your plan to unlock more contact emails and direct dials.");
      return;
    }

    setRevealingId(prospect.id);
    try {
      const res = await fetch("/api/prospects/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser?.email || "guest@leadintellect.ai",
          prospectId: prospect.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRevealedData((prev) => ({
          ...prev,
          [prospect.id]: {
            email: data.email || prospect.email,
            phone: data.phone || prospect.phone,
          },
        }));
        if (typeof data.remainingCredits === "number") {
          setCredits(data.remainingCredits);
          if (currentUser) {
            const updated = { ...currentUser, credits: data.remainingCredits };
            setCurrentUser(updated);
            localStorage.setItem("leadintellect_user", JSON.stringify(updated));
          }
        }
      } else {
        alert(data.error || "Failed to reveal contact.");
      }
    } catch {
      alert("Error unlocking prospect details.");
    } finally {
      setRevealingId(null);
    }
  };

  // Checkbox selection
  const toggleSelectAll = () => {
    if (selectedIds.length === prospects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(prospects.map((p) => p.id));
    }
  };

  const toggleSelectProspect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Export selected to CSV
  const handleExportCsv = () => {
    const listToExport =
      selectedIds.length > 0
        ? prospects.filter((p) => selectedIds.includes(p.id))
        : prospects;

    const rows: string[][] = [
      [
        "Full Name",
        "Title",
        "Seniority",
        "Company",
        "Industry",
        "Employees",
        "Location",
        "Work Email",
        "Direct Phone",
        "ICP Fit Score",
        "ICP Tier",
      ],
    ];

    listToExport.forEach((p) => {
      const email = revealedData[p.id]?.email || p.email || "Confidential";
      const phone = revealedData[p.id]?.phone || p.phone || "Confidential";
      rows.push([
        p.name,
        `"${p.title.replace(/"/g, '""')}"`,
        p.seniority,
        `"${p.company.replace(/"/g, '""')}"`,
        p.industry || "",
        String(p.employees || ""),
        `"${(p.location || "").replace(/"/g, '""')}"`,
        email,
        phone,
        String(p.icpScore),
        p.icpTier,
      ]);
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `leadintellect_prospects_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy helper
  const copyToClipboard = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedEmail(id);
      setTimeout(() => setCopiedEmail(null), 2000);
    } else {
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2000);
    }
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (query) count++;
    if (icpTier !== "all") count++;
    if (seniority.length > 0) count += seniority.length;
    if (industry !== "all") count++;
    if (employeeRange !== "all") count++;
    if (hasEmail) count++;
    if (hasPhone) count++;
    if (locationQuery) count++;
    return count;
  }, [query, icpTier, seniority, industry, employeeRange, hasEmail, hasPhone, locationQuery]);

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col text-slate-800 font-sans">
      {/* ================= 1. APOLLO-STYLE TOPBAR ================= */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Left: Brand & Search bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#0b1220] flex items-center justify-center font-black text-teal text-sm shadow-xs">
              LI
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#0b1220] hidden md:inline">
              LeadIntellect
            </span>
          </Link>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search people, companies, titles or ask LeadIntellect AI... (⌘K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-xs text-slate-800 pl-9 pr-8 py-2 rounded-lg border border-transparent focus:border-teal transition-all focus:outline-none placeholder:text-slate-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Right: Credits, AI assistant, and User Profile */}
        <div className="flex items-center gap-3">
          {/* Credits Counter pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>
              {currentUser?.role === "admin" ? "Unlimited" : `${credits} credits`}
            </span>
          </div>

          {/* Upgrade Plan link (vibrant yellow matching Apollo screenshot) */}
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e2f300] hover:bg-[#d0df00] text-[#0b1220] text-xs font-extrabold shadow-xs transition-transform active:scale-95"
          >
            <Diamond className="w-3.5 h-3.5 fill-[#0b1220]" />
            <span>Upgrade</span>
          </Link>

          {/* AI Assistant shortcut */}
          <button
            onClick={() => {
              if (prospects.length > 0) setPitchModalProspect(prospects[0]);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-teal hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>

          {/* User Profile / CEO Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-teal text-[#0b1220] font-black flex items-center justify-center text-xs shadow-xs">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "DC"}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                <div className="p-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900 truncate">{currentUser?.name || "Drn Consulting"}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || "drnconsulting81@gmail.com"}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-teal/15 text-teal-dark font-extrabold text-[10px] uppercase">
                      {currentUser?.role === "admin" ? "CEO / Executive" : "Pro Workspace"}
                    </span>
                    <span className="text-[10px] text-slate-400">&bull; {credits} credits</span>
                  </div>
                </div>

                <div className="py-1">
                  {currentUser?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg bg-teal/10 text-teal-dark hover:bg-teal/20 font-bold mb-1"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>CEO Admin Operations Portal</span>
                    </Link>
                  )}

                  <Link
                    href="/pricing"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    <Diamond className="w-3.5 h-3.5 text-amber-500" />
                    <span>Manage Subscription / Upgrade</span>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Live Website</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      localStorage.removeItem("leadintellect_user");
                      window.location.href = "/login";
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN LAYOUT: SIDEBAR + CONTENT ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= APOLLO-STYLE LEFT SIDEBAR ================= */}
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex text-xs">
          <div className="p-3 space-y-4 overflow-y-auto">
            {/* Nav Group 1: General */}
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveNav("home")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeNav === "home" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Compass className="w-4 h-4 text-slate-500" />
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  if (prospects.length > 0) setPitchModalProspect(prospects[0]);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4 text-teal-dark" />
                <span>AI Assistant</span>
              </button>
            </div>

            {/* Nav Group 2: Prospect and enrich */}
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Prospect and enrich</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveNav("people")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeNav === "people"
                      ? "bg-teal/15 text-teal-dark font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-dark" />
                  <span>People</span>
                  <span className="ml-auto bg-slate-200/80 text-[10px] font-bold px-1.5 py-0.2 rounded-full text-slate-600">
                    {totalCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveNav("companies")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeNav === "companies"
                      ? "bg-teal/15 text-teal-dark font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>Companies</span>
                </button>

                <button
                  onClick={() => setActiveNav("lists")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeNav === "lists"
                      ? "bg-teal/15 text-teal-dark font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <BookmarkPlus className="w-4 h-4 text-slate-500" />
                  <span>Lists</span>
                </button>

                <button
                  onClick={() => setActiveNav("enrichment")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeNav === "enrichment"
                      ? "bg-teal/15 text-teal-dark font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-slate-500" />
                  <span>Data enrichment</span>
                </button>
              </div>
            </div>

            {/* Nav Group 3: Engage */}
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Engage</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                  <span>Sequences</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Emails</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Calls</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sticky Sidebar Modules (matching Apollo screenshot) */}
          <div className="p-3 border-t border-slate-200 bg-slate-50/50 space-y-2.5">
            {/* Vibrant Yellow Upgrade Card */}
            <Link
              href="/pricing"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#e2f300] hover:bg-[#d0df00] text-[#0b1220] font-black shadow-xs transition-all text-xs"
            >
              <Diamond className="w-4 h-4 fill-[#0b1220]" />
              <span>Upgrade Plan</span>
            </Link>

            {/* Onboarding hub progress */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span>Onboarding hub</span>
                <span className="text-teal-dark font-extrabold">25%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-teal h-full rounded-full w-1/4" />
              </div>
            </div>

            {/* CEO Admin settings link (restricted to CEO) */}
            {currentUser?.role === "admin" && (
              <Link
                href="/admin"
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0b1220] text-teal hover:bg-slate-800 font-bold text-[11px] transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-teal" />
                <span>CEO Admin Portal &rarr;</span>
              </Link>
            )}
          </div>
        </aside>

        {/* ================= MAIN CONTENT WORKSPACE ================= */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Welcome Banner matching screenshot */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Welcome, {currentUser?.name ? currentUser.name.split(" ")[0] : "Drn"}</span>
                  <span className="text-lg">👋</span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filter target decision-makers based on active ICP signals, headcount, and verified contact data.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFiltersDrawer((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    showFiltersDrawer
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{showFiltersDrawer ? "Hide Filters" : "Show ICP Filters"}</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-teal text-[#0b1220] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:border-slate-400 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-teal-dark" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Recommendations Bar matching Apollo screenshot */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/15 text-teal-dark flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    LeadIntellect ICP Synthesis Engine
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Showing <span className="font-bold text-slate-800">{stats.totalTier1}</span> High-Fit Tier 1 accounts with verified C-Suite / VP contacts.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIcpTier("Tier 1");
                    setPage(1);
                  }}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  Filter Tier 1 Leads
                </button>
                <button
                  onClick={() => {
                    if (prospects.length > 0) setPitchModalProspect(prospects[0]);
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal font-bold text-xs transition-colors cursor-pointer"
                >
                  Generate 1:1 Pitch
                </button>
              </div>
            </div>
          </div>

          {/* ================= 3. SPLIT PANE: ICP FILTERS DRAWER + PROSPECTS TABLE ================= */}
          <div className="flex-1 flex overflow-hidden">
            {/* ICP FILTERS DRAWER */}
            {showFiltersDrawer && (
              <div className="w-72 bg-white border-r border-slate-200 p-4 overflow-y-auto shrink-0 text-xs space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ListFilter className="w-3.5 h-3.5 text-teal-dark" />
                    ICP Filter Matrix
                  </span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="text-[11px] font-bold text-teal-dark hover:underline cursor-pointer"
                    >
                      Clear All ({activeFilterCount})
                    </button>
                  )}
                </div>

                {/* Filter 1: ICP Fit Tier */}
                <div>
                  <label className="font-bold text-slate-700 block mb-2">ICP Fit Tier</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "all", label: "All Fits" },
                      { id: "Tier 1", label: "Tier 1 (90+)" },
                      { id: "Tier 2", label: "Tier 2 (80-89)" },
                      { id: "Tier 3", label: "Tier 3 (<80)" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setIcpTier(t.id);
                          setPage(1);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer text-center ${
                          icpTier === t.id
                            ? "bg-slate-900 text-teal border-slate-900 font-bold"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter 2: Seniority Levels */}
                <div>
                  <label className="font-bold text-slate-700 block mb-2">Job Seniority</label>
                  <div className="space-y-1.5">
                    {["C-Suite", "VP", "Director", "Manager", "Professional / IC"].map((lvl) => {
                      const active = seniority.includes(lvl);
                      return (
                        <label
                          key={lvl}
                          className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleSeniority(lvl)}
                            className="rounded border-slate-300 text-teal focus:ring-teal cursor-pointer"
                          />
                          <span>{lvl}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Filter 3: Industry */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Industry Segment</label>
                  <select
                    value={industry}
                    onChange={(e) => {
                      setIndustry(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal"
                  >
                    <option value="all">All Industries</option>
                    <option value="information technology">Information Technology &amp; Services</option>
                    <option value="computer">Computer Software / SaaS</option>
                    <option value="telecommunications">Telecommunications</option>
                    <option value="security">Cybersecurity &amp; Network</option>
                    <option value="internet">Internet &amp; Digital</option>
                  </select>
                </div>

                {/* Filter 4: Company Headcount */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Company Size (Employees)</label>
                  <select
                    value={employeeRange}
                    onChange={(e) => {
                      setEmployeeRange(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal"
                  >
                    <option value="all">Any Headcount</option>
                    <option value="1-50">1 - 50 employees</option>
                    <option value="51-200">51 - 200 employees</option>
                    <option value="201-500">201 - 500 employees (Sweetspot)</option>
                    <option value="501-1000">501 - 1,000 employees</option>
                    <option value="1000+">1,000+ Enterprise</option>
                  </select>
                </div>

                {/* Filter 5: Contact Data Requirements */}
                <div>
                  <label className="font-bold text-slate-700 block mb-2">Verified Requirements</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={hasEmail}
                        onChange={(e) => {
                          setHasEmail(e.target.checked);
                          setPage(1);
                        }}
                        className="rounded border-slate-300 text-teal focus:ring-teal"
                      />
                      <span>Verified Work Email Only</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={hasPhone}
                        onChange={(e) => {
                          setHasPhone(e.target.checked);
                          setPage(1);
                        }}
                        className="rounded border-slate-300 text-teal focus:ring-teal"
                      />
                      <span>Direct Dial Phone Available</span>
                    </label>
                  </div>
                </div>

                {/* Filter 6: Location */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Location Search</label>
                  <input
                    type="text"
                    placeholder="City, State or Country..."
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>
            )}

            {/* RESULTS TABLE WORKSPACE */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Table Action Bar */}
              <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">
                    {totalCount} Total Decision-Makers
                  </span>
                  {selectedIds.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-teal/15 text-teal-dark font-bold">
                      {selectedIds.length} Selected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchProspects}
                    title="Refresh data"
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>

                  <span className="text-slate-500">
                    Page {page} of {totalPages}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-2 py-1 rounded border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 font-bold"
                    >
                      &larr;
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-2 py-1 rounded border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 font-bold"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Content */}
              <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left text-xs text-slate-800 border-collapse">
                  <thead className="bg-[#f8fafc] border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 sticky top-0 z-20">
                    <tr>
                      <th className="p-3.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.length > 0 && selectedIds.length === prospects.length}
                          onChange={toggleSelectAll}
                          className="rounded border-slate-300 text-teal"
                        />
                      </th>
                      <th className="p-3.5 min-w-[200px]">Decision Maker</th>
                      <th className="p-3.5 min-w-[180px]">Company &amp; Size</th>
                      <th className="p-3.5 min-w-[120px]">ICP Fit Score</th>
                      <th className="p-3.5 min-w-[170px]">Work Email</th>
                      <th className="p-3.5 min-w-[140px]">Direct Phone</th>
                      <th className="p-3.5 min-w-[140px] text-right">Outreach Intelligence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-16 text-slate-400">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal mb-2" />
                          <span>Searching &amp; scoring decision-makers matching your ICP...</span>
                        </td>
                      </tr>
                    ) : prospects.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-16 text-slate-500">
                          <div className="max-w-xs mx-auto">
                            <p className="font-bold text-sm text-slate-800">No prospects match this filter combination</p>
                            <p className="text-xs text-slate-400 mt-1">Try widening your headcount range or clearing custom keywords.</p>
                            <button
                              onClick={handleResetFilters}
                              className="mt-3 px-3 py-1.5 rounded-lg bg-teal text-[#0b1220] font-bold text-xs"
                            >
                              Reset All Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      prospects.map((p) => {
                        const isSelected = selectedIds.includes(p.id);
                        const isRevealed = Boolean(revealedData[p.id]);
                        const activeEmail = revealedData[p.id]?.email || p.email;
                        const activePhone = revealedData[p.id]?.phone || p.phone;

                        return (
                          <tr
                            key={p.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isSelected ? "bg-teal/5" : ""
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectProspect(p.id)}
                                className="rounded border-slate-300 text-teal"
                              />
                            </td>

                            {/* Name & Title */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                                  {p.firstName ? p.firstName[0] : "P"}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900 truncate">{p.name}</span>
                                    {p.linkedin && (
                                      <a
                                        href={p.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#0077b5] hover:opacity-80"
                                      >
                                        <LinkedInIcon className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                                    <span className="truncate">{p.title}</span>
                                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium text-[10px] shrink-0">
                                      {p.seniority}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Company & Size */}
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900 truncate">{p.company}</div>
                              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                                <span>{p.employees ? `${p.employees} emp` : p.employeeRange}</span>
                                <span>&bull;</span>
                                <span className="truncate">{p.city || p.location}</span>
                              </div>
                            </td>

                            {/* ICP Score */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center ${
                                    p.icpScore >= 85
                                      ? "bg-emerald-100 text-emerald-800"
                                      : p.icpScore >= 75
                                      ? "bg-teal/20 text-teal-dark"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {p.icpScore}
                                </div>
                                <div>
                                  <div className="font-bold text-xs text-slate-800">{p.icpTier}</div>
                                  <div className="text-[10px] text-slate-400">
                                    {p.icpScore >= 85 ? "High Fit" : "Medium Fit"}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="p-3.5">
                              {isRevealed ? (
                                <div className="flex items-center gap-1.5 font-medium text-teal-dark">
                                  <Mail className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate font-mono text-[11px]">{activeEmail}</span>
                                  <button
                                    onClick={() => copyToClipboard(activeEmail, p.id)}
                                    title="Copy Email"
                                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                                  >
                                    {copiedEmail === p.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleRevealContact(p)}
                                  disabled={revealingId === p.id}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal/10 hover:bg-teal text-teal-dark hover:text-[#0b1220] font-bold text-[11px] transition-colors cursor-pointer"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>{revealingId === p.id ? "Unlocking..." : "Access Email (1 credit)"}</span>
                                </button>
                              )}
                            </td>

                            {/* Phone */}
                            <td className="p-3.5">
                              {isRevealed && activePhone ? (
                                <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px]">
                                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{activePhone}</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleRevealContact(p)}
                                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer font-medium"
                                >
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>View Direct Dial</span>
                                </button>
                              )}
                            </td>

                            {/* Actions: AI 1:1 Pitch */}
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => setPitchModalProspect(p)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal font-bold text-xs transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>1:1 Pitch</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ================= 4. AI 1:1 OUTREACH SYNTHESIS MODAL ================= */}
      {pitchModalProspect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="bg-[#0b1220] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal text-[#0b1220] flex items-center justify-center font-black">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">
                    AI 1:1 Outreach Battlecard &middot; {pitchModalProspect.name}
                  </h3>
                  <p className="text-[11px] text-teal">
                    {pitchModalProspect.title} at {pitchModalProspect.company} ({pitchModalProspect.icpTier} - Fit Score {pitchModalProspect.icpScore})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPitchModalProspect(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* 5-Question Framework Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Who are they?</p>
                  <p className="font-bold text-slate-800 mt-1">
                    {pitchModalProspect.seniority} decision-maker leading {pitchModalProspect.industry} operations at {pitchModalProspect.company}.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. What pain do they have?</p>
                  <p className="font-bold text-slate-800 mt-1">
                    Managing fragmented B2B prospecting data, unverified contact lists, and low response rates across outbound campaigns.
                  </p>
                </div>
              </div>

              {/* Generated Pitch Copy */}
              <div className="rounded-xl border border-teal/30 bg-teal/5 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-dark" />
                    Recommended Personalized Cold Email (1-Click Copy)
                  </span>
                  <button
                    onClick={() => {
                      const copyText = `Subject: Quick question regarding ${pitchModalProspect.company}'s outbound prospecting pipeline\n\nHi ${pitchModalProspect.firstName},\n\nI noticed you're leading ${pitchModalProspect.title} initiatives at ${pitchModalProspect.company}. Many teams in ${pitchModalProspect.industry} face high bounce rates and reps wasting 25+ minutes researching accounts before every cold call.\n\nAt LeadIntellect, we synthesize verified decision-maker contact data with real-time business context (Who, Why, Pain point, Solution map) so your team can open conversations that actually convert.\n\nAre you open to a brief 5-minute walkthrough this Thursday?\n\nBest,\n${currentUser?.name || "Your Name"}\n${currentUser?.company || "LeadIntellect Partner"}`;
                      copyToClipboard(copyText);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-teal text-[#0b1220] font-extrabold text-xs cursor-pointer hover:bg-teal-dark hover:text-white transition-colors"
                  >
                    {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPitch ? "Copied!" : "Copy Pitch"}</span>
                  </button>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap">
{`Subject: Quick question regarding ${pitchModalProspect.company}'s outbound prospecting pipeline

Hi ${pitchModalProspect.firstName},

I noticed you're leading ${pitchModalProspect.title} initiatives at ${pitchModalProspect.company}. Many teams in ${pitchModalProspect.industry} face high bounce rates and reps wasting 25+ minutes researching accounts before every cold call.

At LeadIntellect, we synthesize verified decision-maker contact data with real-time business context (Who, Why, Pain point, Solution map) so your team can open conversations that actually convert.

Are you open to a brief 5-minute walkthrough this Thursday?

Best,
${currentUser?.name || "Your Name"}
${currentUser?.company || "LeadIntellect Partner"}`}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Powered by LeadIntellect Context Intelligence &middot; 5-Question Framework
              </span>
              <button
                onClick={() => setPitchModalProspect(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
