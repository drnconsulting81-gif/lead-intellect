"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Users,
  Building2,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  BookmarkPlus,
  RefreshCw,
  ExternalLink,
  Sliders,
  Compass,
  ListFilter,
  Send,
  Calendar,
  BarChart3,
  LogOut,
  Copy,
  Check,
  X,
  Menu,
  Target,
  Layers,
  ArrowUpRight,
  Clock,
  Briefcase,
  Bot,
  UserCheck,
  ShieldCheck,
  FileSpreadsheet,
  Coins,
  Kanban,
  Upload,
  AlertCircle,
  Settings as SettingsIcon,
  HelpCircle,
  Eye,
  Trash2,
  Plus,
  CheckSquare,
  Square,
  Info,
} from "lucide-react";
import Logo from "@/components/Logo";
import { LinkedInIcon } from "@/components/SocialIcons";

export interface Prospect {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  seniority: string;
  department: string;
  jobFunctions?: string;
  reportsTo?: string;
  company: string;
  domain: string;
  website: string;
  industry: string;
  subIndustry?: string;
  employees: number;
  employeeRange: string;
  revenueMil: number;
  revenueRange: string;
  location: string;
  city: string;
  state: string;
  country: string;
  email: string;
  emailStatus: "verified" | "deliverable" | "unverified" | "not_available";
  emailConfidence: number;
  verificationSource: string;
  verificationDate: string;
  phone: string;
  phoneType: string;
  hasPhone: boolean;
  hasEmail: boolean;
  linkedin: string;
  ownership?: string;
  icpScore: number;
  icpTier: "Tier 1" | "Tier 2" | "Tier 3";
  source: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  website: string;
  industry: string;
  subIndustry?: string;
  employees: number;
  employeeRange: string;
  revenueRange: string;
  headquarters: string;
  city: string;
  state: string;
  country: string;
  ownership?: string;
  decisionMakerCount: number;
  verifiedContactsCount: number;
  icpScore: number;
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

interface UserList {
  id: string;
  name: string;
  description?: string;
  prospectIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreditLedgerEntry {
  id: string;
  action: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

interface Deal {
  id: string;
  contactName: string;
  companyName: string;
  title: string;
  email: string;
  phone?: string;
  dealValue: number;
  currency: string;
  stage: "identified" | "contacted" | "demo_booked" | "proposal" | "won" | "lost";
  priority: "low" | "medium" | "high";
  lastActivity: string;
  createdAt: string;
}

const PIPELINE_STAGES = [
  { id: "identified", label: "New (Identified)", color: "border-slate-300 bg-slate-50" },
  { id: "contacted", label: "Outreach Sent", color: "border-sky-300 bg-sky-50/40" },
  { id: "demo_booked", label: "Meeting / Demo", color: "border-indigo-300 bg-indigo-50/40" },
  { id: "proposal", label: "Opportunity", color: "border-amber-300 bg-amber-50/40" },
  { id: "won", label: "Closed Won", color: "border-emerald-300 bg-emerald-50/40" },
  { id: "lost", label: "Closed Lost", color: "border-rose-200 bg-rose-50/30" },
];

type NavItem =
  | "home"
  | "discover"
  | "lists"
  | "intelligence"
  | "outreach"
  | "pipeline"
  | "data"
  | "integrations"
  | "settings";

export default function LeadIntellectWorkspace() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession>({
    id: "usr_guest",
    name: "Guest Prospector",
    email: "guest@leadintellect.ai",
    company: "Revenue Operations",
    provider: "email",
    role: "user",
    credits: 100,
  });
  const [credits, setCredits] = useState<number>(100);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Hydrate user session safely after client mount to prevent React 19 hydration mismatches
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem("leadintellect_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email) {
            setCurrentUser(parsed);
            setCredits(parsed.credits ?? (parsed.role === "admin" ? 999999 : 100));
          }
        }
      } catch {
        // ignore
      }
    });
  }, []);

  const [activeNav, setActiveNav] = useState<NavItem>("discover");

  // Discover Search Mode: People vs Companies
  const [discoverMode, setDiscoverMode] = useState<"people" | "companies">("people");

  // People Query & Filters State
  const [query, setQuery] = useState("");
  const [seniority, setSeniority] = useState<string[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [industry, setIndustry] = useState("all");
  const [country, setCountry] = useState("all");
  const [employeeRange, setEmployeeRange] = useState("all");
  const [revenueFilter, setRevenueFilter] = useState("all");
  const [ownershipFilter, setOwnershipFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [emailStatus, setEmailStatus] = useState("all");
  const [hasPhone, setHasPhone] = useState(false);
  const [hasEmailFilter, setHasEmailFilter] = useState(false);
  const [hasLinkedinFilter, setHasLinkedinFilter] = useState(false);
  const [minContactsFilter, setMinContactsFilter] = useState("all");
  const [minScore, setMinScore] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Natural Language Parsed Criteria
  const [interpretedCriteria, setInterpretedCriteria] = useState<Record<string, string> | null>(null);

  // People & Company Data
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    totalTier1: 0,
    totalVerifiedEmails: 0,
    totalDirectPhones: 0,
    avgIcpScore: 0,
  });
  const [facets, setFacets] = useState<{
    industries: string[];
    countries: string[];
    seniorities: string[];
    states?: string[];
    revenues?: string[];
  }>({
    industries: [],
    countries: [],
    seniorities: [],
    states: [],
    revenues: [],
  });

  // Selection & Detail Panel State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeProfile, setActiveProfile] = useState<Prospect | null>(null);
  const [activeCompanyProfile, setActiveCompanyProfile] = useState<Company | null>(null);
  const [revealedContacts, setRevealedContacts] = useState<Record<string, { email: string; phone: string; linkedin: string }>>({});
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Lists & Saved Searches
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [savingList, setSavingList] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Outreach Draft State
  const [outreachProspect, setOutreachProspect] = useState<Prospect | null>(null);
  const [outreachDrafts, setOutreachDrafts] = useState<{
    coldEmail?: { subject: string; body: string };
    followUpEmail?: { subject: string; body: string };
    linkedInMessage?: string;
    phoneOpener?: string;
  } | null>(null);
  const [outreachLoading, setOutreachLoading] = useState(false);
  const [copiedDraftKey, setCopiedDraftKey] = useState<string | null>(null);

  // Pipeline Deals State
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealModalOpen, setDealModalOpen] = useState(false);

  // Data & Credits Hub State
  const [creditLedger, setCreditLedger] = useState<CreditLedgerEntry[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFileContent, setImportFileContent] = useState("");
  const [importPreview, setImportPreview] = useState<{
    headers: string[];
    sampleRows: string[][];
    suggestedMapping: Record<string, string>;
    totalRows: number;
  } | null>(null);
  const [importMapping, setImportMapping] = useState<Record<string, string>>({});
  const [importListName, setImportListName] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ importedCount: number; skippedCount: number; errorCount: number } | null>(null);

interface IntegrationHealthItem {
  id: string;
  name: string;
  description: string;
  status: string;
  capabilities: string[];
}

  // Integrations Health
  const [integrationsHealth, setIntegrationsHealth] = useState<IntegrationHealthItem[]>([]);

  // Feedback Notification Banner
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch prospects
  // Fetch Lists
  const fetchLists = useCallback(async () => {
    try {
      const email = currentUser?.email || "guest@leadintellect.ai";
      const res = await fetch(`/api/lists?userEmail=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setUserLists(data.lists || []);
      }
    } catch (err) {
      console.error("Failed to load lists:", err);
    }
  }, [currentUser]);

  // Execute Search
  useEffect(() => {
    let ignore = false;
    if (activeNav === "discover") {
      queueMicrotask(() => {
        if (!ignore) setLoading(true);
      });
      if (discoverMode === "people") {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (seniority.length > 0) params.set("seniority", seniority.join(","));
        if (titleFilter) params.set("title", titleFilter);
        if (cityFilter) params.set("city", cityFilter);
        if (stateFilter) params.set("state", stateFilter);
        if (companyFilter) params.set("companyName", companyFilter);
        if (industry !== "all") params.set("industry", industry);
        if (country !== "all") params.set("country", country);
        if (employeeRange !== "all") params.set("employeeRange", employeeRange);
        if (revenueFilter !== "all") params.set("revenueRange", revenueFilter);
        if (ownershipFilter !== "all") params.set("ownership", ownershipFilter);
        if (departmentFilter !== "all") params.set("department", departmentFilter);
        if (emailStatus !== "all") params.set("emailStatus", emailStatus);
        if (hasPhone) params.set("hasPhone", "true");
        if (hasEmailFilter) params.set("hasEmail", "true");
        if (hasLinkedinFilter) params.set("hasLinkedin", "true");
        if (minScore > 0) params.set("minScore", minScore.toString());
        params.set("page", page.toString());
        params.set("limit", "25");

        if (query.split(" ").length >= 4) {
          params.set("parseNatural", "true");
        }

        fetch(`/api/prospects?${params.toString()}`)
          .then((res) => res.json())
          .then((data) => {
            if (!ignore) {
              setProspects(data.prospects || []);
              setTotalCount(data.pagination?.total || 0);
              setTotalPages(data.pagination?.totalPages || 1);
              if (data.stats) setStats(data.stats);
              if (data.facets) setFacets(data.facets);
              if (data.interpretedCriteria) setInterpretedCriteria(data.interpretedCriteria);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error("Failed to fetch prospects:", err);
            if (!ignore) setLoading(false);
          });
      } else {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (industry !== "all") params.set("industry", industry);
        if (country !== "all") params.set("country", country);
        if (stateFilter) params.set("state", stateFilter);
        if (cityFilter) params.set("city", cityFilter);
        if (employeeRange !== "all") params.set("employeeRange", employeeRange);
        if (revenueFilter !== "all") params.set("revenueRange", revenueFilter);
        if (ownershipFilter !== "all") params.set("ownership", ownershipFilter);
        if (minContactsFilter !== "all") params.set("minContacts", minContactsFilter);
        params.set("page", page.toString());
        params.set("limit", "25");

        fetch(`/api/companies?${params.toString()}`)
          .then((res) => res.json())
          .then((data) => {
            if (!ignore) {
              setCompanies(data.companies || []);
              setTotalCount(data.pagination?.total || 0);
              setTotalPages(data.pagination?.totalPages || 1);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error("Failed to fetch companies:", err);
            if (!ignore) setLoading(false);
          });
      }
    }
    return () => {
      ignore = true;
    };
  }, [
    activeNav,
    discoverMode,
    query,
    seniority,
    titleFilter,
    cityFilter,
    stateFilter,
    companyFilter,
    industry,
    country,
    employeeRange,
    revenueFilter,
    ownershipFilter,
    departmentFilter,
    emailStatus,
    hasPhone,
    hasEmailFilter,
    hasLinkedinFilter,
    minContactsFilter,
    minScore,
    page,
  ]);

  // Load secondary data on navigation
  useEffect(() => {
    let ignore = false;
    if (activeNav === "lists") {
      const email = currentUser?.email || "guest@leadintellect.ai";
      fetch(`/api/lists?userEmail=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (!ignore && data.lists) setUserLists(data.lists);
        })
        .catch(() => {});
    }
    if (activeNav === "data") {
      const email = currentUser?.email || "guest@leadintellect.ai";
      fetch(`/api/credits?userEmail=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (!ignore) {
            if (data.history) setCreditLedger(data.history);
            if (data.credits !== undefined) setCredits(data.credits);
          }
        })
        .catch(() => {});
    }
    if (activeNav === "integrations") {
      fetch("/api/integrations")
        .then((res) => res.json())
        .then((data) => {
          if (!ignore && data.integrations) setIntegrationsHealth(data.integrations);
        })
        .catch(() => {});
    }
    if (activeNav === "pipeline") {
      fetch("/api/crm/deals")
        .then((res) => res.json())
        .then((data) => {
          if (!ignore && data.deals) setDeals(data.deals);
        })
        .catch(() => {});
    }
    return () => {
      ignore = true;
    };
  }, [activeNav, currentUser]);

  // Contact Reveal Action
  const handleRevealContact = async (p: Prospect) => {
    if (revealedContacts[p.id]) return;
    setRevealingId(p.id);

    try {
      const res = await fetch("/api/prospects/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser?.email || "guest@leadintellect.ai",
          prospectId: p.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRevealedContacts((prev) => ({
          ...prev,
          [p.id]: {
            email: data.email,
            phone: data.phone,
            linkedin: data.linkedin,
          },
        }));
        if (data.remainingCredits !== undefined) setCredits(data.remainingCredits);
        showToast(`Contact revealed: ${data.email || p.name}`);
      } else {
        showToast(data.error || "Failed to reveal contact.", "error");
      }
    } catch {
      showToast("Network error revealing contact.", "error");
    } finally {
      setRevealingId(null);
    }
  };

  // Add selected to list
  const handleAddSelectedToList = async (listId: string) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch("/api/lists", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId,
          action: "add",
          prospectIds: selectedIds,
        }),
      });
      if (res.ok) {
        showToast(`Added ${selectedIds.length} prospects to list.`);
        setSelectedIds([]);
        fetchLists();
      }
    } catch {
      showToast("Failed to add prospects to list.", "error");
    }
  };

  // Create new list
  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) {
      showToast("Please enter a name for your list.", "error");
      return;
    }
    setSavingList(true);

    try {
      const email = currentUser?.email || "guest@leadintellect.ai";
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          name: newListName.trim(),
          description: newListDescription.trim(),
          prospectIds: selectedIds,
        }),
      });
      const data = await res.json();
      if (res.ok && data.list) {
        showToast(`Created list "${newListName}" with ${selectedIds.length} prospects!`);
        setUserLists((prev) => [data.list, ...prev.filter((l) => l.id !== data.list.id)]);
        setNewListName("");
        setNewListDescription("");
        setListModalOpen(false);
        setSelectedIds([]);
        fetchLists();
      } else {
        showToast(data.error || "Failed to create list.", "error");
      }
    } catch (err) {
      console.error("List creation network error:", err);
      showToast("Network error creating list. Please try again.", "error");
    } finally {
      setSavingList(false);
    }
  };

  // CSV Export
  const handleExportSelected = async () => {
    const idsToExport = selectedIds.length > 0 ? selectedIds : prospects.slice(0, 25).map((p) => p.id);
    if (idsToExport.length === 0) {
      showToast("No records available to export.", "info");
      return;
    }

    try {
      const res = await fetch("/api/data/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser?.email || "guest@leadintellect.ai",
          prospectIds: idsToExport,
        }),
      });
      const data = await res.json();
      if (res.ok && data.csvContent) {
        const blob = new Blob([data.csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", data.filename || "leadintellect_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (data.remainingCredits !== undefined) setCredits(data.remainingCredits);
        showToast(`Successfully exported ${data.recordCount} records.`);
      } else {
        showToast(data.error || "Export failed.", "error");
      }
    } catch {
      showToast("Network error during CSV export.", "error");
    }
  };

  // Generate Outreach for prospect
  const handleGenerateOutreach = async (p: Prospect) => {
    setOutreachProspect(p);
    setActiveNav("outreach");
    setOutreachLoading(true);
    setOutreachDrafts(null);

    try {
      const res = await fetch("/api/ai/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectName: p.name,
          title: p.title,
          company: p.company,
          industry: p.industry,
          location: p.location,
          senderName: currentUser?.name || "Your Name",
          senderCompany: currentUser?.company || "Our Company",
        }),
      });
      const data = await res.json();
      if (res.ok && data.drafts) {
        setOutreachDrafts(data.drafts);
      }
    } catch {
      showToast("Failed to generate outreach drafts.", "error");
    } finally {
      setOutreachLoading(false);
    }
  };

  // Add prospect to sales pipeline
  const handleAddToPipeline = async (p: Prospect) => {
    try {
      const res = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId: p.id,
          contactName: p.name,
          companyName: p.company,
          title: p.title,
          email: revealedContacts[p.id]?.email || p.email,
          phone: revealedContacts[p.id]?.phone || p.phone,
          dealValue: p.icpScore >= 85 ? 50000 : 25000,
          currency: "USD",
          stage: "identified",
          priority: p.icpScore >= 85 ? "high" : "medium",
          notes: `Added from LeadIntellect Search (${p.seniority} - ${p.industry}). Fit Score: ${p.icpScore}.`,
        }),
      });
      if (res.ok) {
        showToast(`Added ${p.name} to sales pipeline.`);
        fetch("/api/crm/deals")
          .then((r) => r.json())
          .then((d) => {
            if (d.deals) setDeals(d.deals);
          })
          .catch(() => {});
      }
    } catch {
      showToast("Failed to add deal to pipeline.", "error");
    }
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === prospects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(prospects.map((p) => p.id));
    }
  };

  const renderFilterBody = () => (
    <div className="space-y-5 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-teal-dark" />
          Filter Criteria
        </span>
        <button
          type="button"
          onClick={() => {
            setSeniority([]);
            setTitleFilter("");
            setCityFilter("");
            setStateFilter("");
            setCompanyFilter("");
            setIndustry("all");
            setCountry("all");
            setEmployeeRange("all");
            setRevenueFilter("all");
            setOwnershipFilter("all");
            setDepartmentFilter("all");
            setEmailStatus("all");
            setHasPhone(false);
            setHasEmailFilter(false);
            setHasLinkedinFilter(false);
            setMinContactsFilter("all");
            setMinScore(0);
            setQuery("");
            setPage(1);
          }}
          className="text-[11px] font-semibold text-text-muted hover:text-rose-600 transition-colors cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* PEOPLE MODE FILTERS */}
      {discoverMode === "people" ? (
        <>
          {/* Job Title & Role Search */}
          <div>
            <label className="block text-[11px] font-bold text-navy mb-1">Job Title / Role</label>
            <input
              type="text"
              value={titleFilter}
              onChange={(e) => {
                setTitleFilter(e.target.value);
                setPage(1);
              }}
              placeholder="e.g. VP Sales, CTO, Director"
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
            />
          </div>

          {/* Seniority Tier Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-navy">Seniority Level</label>
              {seniority.length > 0 && (
                <span className="text-[10px] text-teal-dark font-bold">{seniority.length} active</span>
              )}
            </div>
            <div className="space-y-1">
              {["C-Suite", "VP", "Director", "Manager", "Founder / Owner", "Professional / IC"].map(
                (lvl) => {
                  const active = seniority.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setSeniority((prev) =>
                          prev.includes(lvl) ? prev.filter((s) => s !== lvl) : [...prev, lvl]
                        );
                        setPage(1);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        active
                          ? "bg-navy text-white font-semibold shadow-xs"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>{lvl}</span>
                      {active && <Check className="w-3 h-3 text-teal" />}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Department / Function */}
          <div>
            <label className="block text-[11px] font-bold text-navy mb-1">Department / Function</label>
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering &amp; Technical</option>
              <option value="Sales">Sales &amp; Business Development</option>
              <option value="Marketing">Marketing &amp; Growth</option>
              <option value="Product">Product Management</option>
              <option value="Operations">Operations &amp; Delivery</option>
              <option value="Finance">Finance &amp; Accounting</option>
              <option value="Human Resources">Human Resources &amp; Talent</option>
              <option value="Legal">Legal &amp; Compliance</option>
              <option value="Information Technology">Information Technology (IT)</option>
              <option value="Executive">Executive Leadership</option>
            </select>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-[11px] font-bold text-navy mb-1">Company Name</label>
            <input
              type="text"
              value={companyFilter}
              onChange={(e) => {
                setCompanyFilter(e.target.value);
                setPage(1);
              }}
              placeholder="e.g. Acme, Stripe, Datadog"
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
            />
          </div>

          {/* Location: Country, State, City */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-[11px] font-bold text-navy">Location (City, State, Country)</label>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
            >
              <option value="all">All Countries (Global)</option>
              {facets.countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                value={stateFilter}
                onChange={(e) => {
                  setStateFilter(e.target.value);
                  setPage(1);
                }}
                placeholder="State / Region"
                className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
              />
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setPage(1);
                }}
                placeholder="City"
                className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
              />
            </div>
          </div>

          {/* Industry Sector */}
          <div>
            <label className="block text-[11px] font-bold text-navy mb-1">Industry Sector</label>
            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
            >
              <option value="all">All Industries ({facets.industries.length})</option>
              {facets.industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Company Scale: Headcount & Revenue */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <label className="block text-[11px] font-bold text-navy">Company Scale</label>
            <div>
              <span className="text-[10px] text-slate-500 mb-1 block">Employee Headcount</span>
              <select
                value={employeeRange}
                onChange={(e) => {
                  setEmployeeRange(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
              >
                <option value="all">All Headcounts</option>
                <option value="1-10">1 - 10 Employees (Seed)</option>
                <option value="11-50">11 - 50 Employees (Early)</option>
                <option value="51-200">51 - 200 Employees (Growth)</option>
                <option value="201-500">201 - 500 Employees (Mid-Market)</option>
                <option value="501-1000">501 - 1,000 Employees</option>
                <option value="1000+">1,000+ Enterprise</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 mb-1 block">Annual Revenue</span>
              <select
                value={revenueFilter}
                onChange={(e) => {
                  setRevenueFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
              >
                <option value="all">All Revenue Ranges</option>
                <option value="< $1M">&lt; $1M ARR</option>
                <option value="$1M - $10M">$1M - $10M ARR</option>
                <option value="$10M - $50M">$10M - $50M ARR</option>
                <option value="$50M - $250M">$50M - $250M ARR</option>
                <option value="$250M - $1B">$250M - $1B ARR</option>
                <option value="$1B+">$1B+ Enterprise ARR</option>
              </select>
            </div>
          </div>

          {/* Contact Reachability & Verification */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-[11px] font-bold text-navy">Contact Reachability</label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-navy">
                <input
                  type="checkbox"
                  checked={emailStatus === "verified"}
                  onChange={(e) => {
                    setEmailStatus(e.target.checked ? "verified" : "all");
                    setPage(1);
                  }}
                  className="rounded text-teal-dark focus:ring-teal-dark cursor-pointer"
                />
                <span>Verified Deliverable Email Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-navy">
                <input
                  type="checkbox"
                  checked={hasEmailFilter}
                  onChange={(e) => {
                    setHasEmailFilter(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded text-teal-dark focus:ring-teal-dark cursor-pointer"
                />
                <span>Work Email Available</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-navy">
                <input
                  type="checkbox"
                  checked={hasPhone}
                  onChange={(e) => {
                    setHasPhone(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded text-teal-dark focus:ring-teal-dark cursor-pointer"
                />
                <span>Direct Dial Available</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-navy">
                <input
                  type="checkbox"
                  checked={hasLinkedinFilter}
                  onChange={(e) => {
                    setHasLinkedinFilter(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded text-teal-dark focus:ring-teal-dark cursor-pointer"
                />
                <span>LinkedIn Profile URL Available</span>
              </label>
            </div>
          </div>
        </>
      ) : (
        /* COMPANIES MODE FILTERS */
        <>
          {/* Industry Filter */}
          <div>
            <label className="block text-[11px] font-bold text-navy mb-1">Industry Sector</label>
            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
            >
              <option value="all">All Industries ({facets.industries.length})</option>
              {facets.industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Location: Country, State, City */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-navy">Headquarters Location</label>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
            >
              <option value="all">Global (All Locations)</option>
              {facets.countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                value={stateFilter}
                onChange={(e) => {
                  setStateFilter(e.target.value);
                  setPage(1);
                }}
                placeholder="State / Region"
                className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
              />
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setPage(1);
                }}
                placeholder="City"
                className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
              />
            </div>
          </div>

          {/* Company Scale: Headcount & Revenue */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <label className="block text-[11px] font-bold text-navy">Scale &amp; Revenue</label>
            <div>
              <span className="text-[10px] text-slate-500 mb-1 block">Headcount Range</span>
              <select
                value={employeeRange}
                onChange={(e) => {
                  setEmployeeRange(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
              >
                <option value="all">All Sizes</option>
                <option value="1-10">1 - 10 Employees</option>
                <option value="11-50">11 - 50 Employees</option>
                <option value="51-200">51 - 200 Employees (Growth)</option>
                <option value="201-500">201 - 500 Employees</option>
                <option value="501-1000">501 - 1,000 Employees</option>
                <option value="1000+">1,000+ Enterprise</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 mb-1 block">Annual Revenue</span>
              <select
                value={revenueFilter}
                onChange={(e) => {
                  setRevenueFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
              >
                <option value="all">All Revenue Ranges</option>
                <option value="< $1M">&lt; $1M ARR</option>
                <option value="$1M - $10M">$1M - $10M ARR</option>
                <option value="$10M - $50M">$10M - $50M ARR</option>
                <option value="$50M - $250M">$50M - $250M ARR</option>
                <option value="$250M - $1B">$250M - $1B ARR</option>
                <option value="$1B+">$1B+ Enterprise ARR</option>
              </select>
            </div>
          </div>

          {/* Minimum Decision-Makers */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-navy mb-1">Decision-Makers in Account</label>
            <select
              value={minContactsFilter}
              onChange={(e) => {
                setMinContactsFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
            >
              <option value="all">Any Decision-Makers</option>
              <option value="1">At least 1+ Contact</option>
              <option value="5">At least 5+ Contacts</option>
              <option value="10">At least 10+ Contacts</option>
              <option value="20">At least 20+ Contacts</option>
            </select>
          </div>

          {/* Ownership */}
          <div>
            <label className="block text-[11px] font-bold text-navy mb-1">Ownership Type</label>
            <select
              value={ownershipFilter}
              onChange={(e) => {
                setOwnershipFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
            >
              <option value="all">All Ownership Types</option>
              <option value="Privately Held">Privately Held</option>
              <option value="Public Company">Public Company</option>
              <option value="Venture Backed">Venture Backed</option>
              <option value="Bootstrapped">Bootstrapped</option>
            </select>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="h-screen max-h-screen bg-[#f8fafc] flex flex-col font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 transition-all ${
            toastMessage.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : toastMessage.type === "info"
              ? "bg-sky-50 text-sky-800 border-sky-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          {toastMessage.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Global Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link href="/" className="shrink-0 flex items-center gap-2">
            <Logo size="sm" />
          </Link>

          {/* Primary Workspace Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: "home" as NavItem, label: "Home" },
              { id: "discover" as NavItem, label: "Discover" },
              { id: "lists" as NavItem, label: "Lists" },
              { id: "intelligence" as NavItem, label: "Intelligence" },
              { id: "outreach" as NavItem, label: "Outreach" },
              { id: "pipeline" as NavItem, label: "Pipeline" },
              { id: "data" as NavItem, label: "Data & Credits" },
              { id: "integrations" as NavItem, label: "Integrations" },
              { id: "settings" as NavItem, label: "Settings" },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveNav(nav.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeNav === nav.id
                    ? "bg-navy text-white shadow-2xs"
                    : "text-slate-600 hover:text-navy hover:bg-slate-100"
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Account & Credit Balance Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <Coins className="w-3.5 h-3.5 text-teal-dark shrink-0" />
            <span className="font-bold text-navy">{credits.toLocaleString()}</span>
            <span className="text-text-muted hidden sm:inline">Credits</span>
          </div>

          <Link
            href="/docs"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-navy"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Docs</span>
          </Link>

          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-navy leading-none">
                {currentUser?.name || "Guest Prospector"}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">
                {currentUser?.role === "admin" ? "Admin (Unlimited)" : "Free Plan"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 z-30 shadow-md animate-in fade-in duration-100">
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "home" as NavItem, label: "Home" },
              { id: "discover" as NavItem, label: "Discover" },
              { id: "lists" as NavItem, label: "Lists" },
              { id: "intelligence" as NavItem, label: "Intelligence" },
              { id: "outreach" as NavItem, label: "Outreach" },
              { id: "pipeline" as NavItem, label: "Pipeline" },
              { id: "data" as NavItem, label: "Data & Credits" },
              { id: "integrations" as NavItem, label: "Integrations" },
              { id: "settings" as NavItem, label: "Settings" },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => {
                  setActiveNav(nav.id);
                  setMobileNavOpen(false);
                }}
                className={`px-2 py-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
                  activeNav === nav.id
                    ? "bg-navy text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {nav.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col">
        {/* ================= SECTION: HOME ================= */}
        {activeNav === "home" && (
          <div className="max-w-5xl mx-auto w-full p-6 sm:p-10 space-y-8 animate-in fade-in duration-150">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                START YOUR WORKFLOW
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
                What are you looking for today?
              </h1>
              <p className="text-xs sm:text-sm text-text-muted mt-1.5">
                Describe your target criteria in plain English or execute saved prospect filters.
              </p>
            </div>

            {/* Natural Language Search Prompt */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setActiveNav("discover");
              }}
              className="relative rounded-2xl bg-white border border-slate-300 p-2 shadow-sm focus-within:ring-2 focus-within:ring-teal/30 focus-within:border-teal-dark transition-all"
            >
              <div className="flex items-center gap-3 px-3 py-1.5">
                <Search className="w-5 h-5 text-teal-dark shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Find CFOs and Finance Directors at US healthcare organizations with 500-5000 employees"
                  className="w-full text-xs sm:text-sm text-navy placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shrink-0 cursor-pointer"
                >
                  DISCOVER
                </button>
              </div>
            </form>

            {/* Suggested Search Prompts */}
            <div>
              <p className="text-xs font-bold text-navy uppercase tracking-wider mb-3">
                Suggested Queries:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Operations leaders at US manufacturing companies with 500+ employees",
                  "C-Suite executives at UK software and telecom firms",
                  "Procurement and Supply Chain directors in Canada",
                  "Healthcare leaders in Midwest hospital systems",
                  "Chief Revenue Officers at enterprise B2B accounts",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQuery(s);
                      setActiveNav("discover");
                    }}
                    className="text-xs bg-white border border-slate-200 text-slate-700 hover:text-navy hover:border-slate-300 px-3 py-2 rounded-xl text-left transition-all"
                  >
                    &ldquo;{s}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                <p className="text-[11px] font-bold text-text-muted uppercase">Cleaned Database</p>
                <p className="text-xl font-extrabold text-navy mt-1">49,976</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Verified B2B Decision-Makers</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                <p className="text-[11px] font-bold text-text-muted uppercase">Indexed Companies</p>
                <p className="text-xl font-extrabold text-navy mt-1">8,631</p>
                <p className="text-[10px] text-teal-dark mt-0.5">Across Global Markets</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                <p className="text-[11px] font-bold text-text-muted uppercase">Available Credits</p>
                <p className="text-xl font-extrabold text-navy mt-1">{credits}</p>
                <p className="text-[10px] text-text-muted mt-0.5">Server-Enforced</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                <p className="text-[11px] font-bold text-text-muted uppercase">Data Provenance</p>
                <p className="text-xl font-extrabold text-navy mt-1">100%</p>
                <p className="text-[10px] text-text-muted mt-0.5">No Fabricated Contacts</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: DISCOVER ================= */}
        {activeNav === "discover" && (
          <div className="flex-1 flex flex-col">
            {/* Top Discovery Controls Bar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Search Mode Switcher: People vs Companies */}
                <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => {
                      setDiscoverMode("people");
                      setPage(1);
                    }}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                      discoverMode === "people"
                        ? "bg-white text-navy shadow-xs"
                        : "text-slate-600 hover:text-navy"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-teal-dark" />
                    <span>PEOPLE</span>
                    <span className="text-[10px] text-slate-400">({(49976).toLocaleString()})</span>
                  </button>
                  <button
                    onClick={() => {
                      setDiscoverMode("companies");
                      setPage(1);
                    }}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                      discoverMode === "companies"
                        ? "bg-white text-navy shadow-xs"
                        : "text-slate-600 hover:text-navy"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>COMPANIES</span>
                    <span className="text-[10px] text-slate-400">({(8631).toLocaleString()})</span>
                  </button>
                </div>

                {/* Search Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPage(1);
                  }}
                  className="relative min-w-[280px] sm:min-w-[340px]"
                >
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      discoverMode === "people"
                        ? "Search people by name, title, or company..."
                        : "Search companies by name, domain, or industry..."
                    }
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal-dark"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>
              </div>

              {/* Action Buttons: Export, Add to List */}
              <div className="flex items-center gap-2.5">
                {/* Mobile Filters Toggle Button */}
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen((prev) => !prev)}
                  className="lg:hidden px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-navy text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Filter className="w-3.5 h-3.5 text-teal-dark" />
                  <span>
                    Filters
                    {seniority.length > 0 ||
                    industry !== "all" ||
                    country !== "all" ||
                    employeeRange !== "all" ||
                    emailStatus !== "all" ||
                    hasPhone
                      ? " (Active)"
                      : ""}
                  </span>
                </button>

                {selectedIds.length > 0 && (
                  <span className="text-xs font-bold text-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                    {selectedIds.length} Selected
                  </span>
                )}

                <button
                  onClick={() => setListModalOpen(true)}
                  disabled={selectedIds.length === 0}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-navy hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Add to List</span>
                </button>

                <button
                  onClick={handleExportSelected}
                  className="px-3.5 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Interpreted Natural Language Notification Bar */}
            {interpretedCriteria && (
              <div className="bg-teal/5 border-b border-teal/20 px-6 py-2.5 flex items-center justify-between text-xs text-navy">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-dark shrink-0" />
                  <span className="font-semibold text-teal-dark">Interpreted Query Criteria:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(interpretedCriteria).map(([k, v]) => (
                      <span
                        key={k}
                        className="bg-white border border-teal/30 px-2 py-0.5 rounded text-[11px] font-medium"
                      >
                        <span className="text-text-muted capitalize">{k}:</span> {v}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setInterpretedCriteria(null)}
                  className="text-[11px] text-text-muted hover:text-navy underline"
                >
                  Clear Interpretation
                </button>
              </div>
            )}

            {/* Discovery Workspace Layout: Sidebar Filters + Results Table */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Filters Sidebar (Desktop) */}
              <aside className="w-64 border-r border-slate-200 bg-white p-5 overflow-y-auto hidden lg:block shrink-0 z-10 space-y-6">
                {renderFilterBody()}
              </aside>

              {/* Mobile Slide-Over Filters Drawer */}
              {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                  <div
                    className="fixed inset-0 bg-navy/40 backdrop-blur-xs transition-opacity"
                    onClick={() => setMobileFiltersOpen(false)}
                  />
                  <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <h3 className="text-sm font-extrabold text-navy flex items-center gap-2">
                          <Filter className="w-4 h-4 text-teal-dark" />
                          Prospect Filters
                        </h3>
                        <button
                          type="button"
                          onClick={() => setMobileFiltersOpen(false)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-navy cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {renderFilterBody()}
                    </div>
                    <div className="pt-6 border-t border-slate-100 mt-6">
                      <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="w-full py-2.5 bg-navy text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-800 transition-colors"
                      >
                        Apply Filters ({totalCount.toLocaleString()} Found)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Center Results Table Area */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
                <div>
                  {/* Results Count & Meta Summary */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span>
                        Showing <b className="text-navy">{totalCount.toLocaleString()}</b> {discoverMode}{" "}
                        found
                      </span>
                      {discoverMode === "people" && (
                        <>
                          <span>&middot;</span>
                          <span className="text-emerald-700 font-medium">
                            {stats.totalVerifiedEmails.toLocaleString()} Verified Emails
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {selectedIds.length > 0 && userLists.length > 0 && (
                        <div className="flex items-center gap-2 bg-teal/10 px-2 py-1 rounded-lg border border-teal/20 text-xs">
                          <span className="font-bold text-navy">{selectedIds.length} selected</span>
                          <select
                            onChange={(e) => {
                              if (e.target.value) handleAddSelectedToList(e.target.value);
                              e.target.value = "";
                            }}
                            className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-navy font-semibold text-[11px]"
                          >
                            <option value="">Add to List...</option>
                            {userLists.map((l) => (
                              <option key={l.id} value={l.id}>
                                {l.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <span className="text-xs text-text-muted">
                        Page {page} of {totalPages}
                      </span>
                    </div>
                  </div>

                  {/* Active Filter Pills Bar (Apollo / B2B Experience) */}
                  {(titleFilter ||
                    cityFilter ||
                    stateFilter ||
                    companyFilter ||
                    seniority.length > 0 ||
                    industry !== "all" ||
                    country !== "all" ||
                    employeeRange !== "all" ||
                    revenueFilter !== "all" ||
                    ownershipFilter !== "all" ||
                    departmentFilter !== "all" ||
                    emailStatus !== "all" ||
                    hasPhone ||
                    hasEmailFilter ||
                    hasLinkedinFilter ||
                    minContactsFilter !== "all") && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-[11px] font-bold text-navy mr-1 flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-teal-dark" />
                        Active Filters:
                      </span>

                      {titleFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          Role: <b>{titleFilter}</b>
                          <button
                            type="button"
                            onClick={() => {
                              setTitleFilter("");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {seniority.map((lvl) => (
                        <span
                          key={lvl}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-navy text-white text-[11px] shadow-2xs font-medium"
                        >
                          {lvl}
                          <button
                            type="button"
                            onClick={() => {
                              setSeniority((prev) => prev.filter((s) => s !== lvl));
                              setPage(1);
                            }}
                            className="hover:text-teal text-slate-300 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}

                      {departmentFilter !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          Dept: <b>{departmentFilter}</b>
                          <button
                            type="button"
                            onClick={() => {
                              setDepartmentFilter("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {companyFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          Company: <b>{companyFilter}</b>
                          <button
                            type="button"
                            onClick={() => {
                              setCompanyFilter("");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {country !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          Country: <b>{country}</b>
                          <button
                            type="button"
                            onClick={() => {
                              setCountry("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {stateFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          State: <b>{stateFilter}</b>
                          <button
                            type="button"
                            onClick={() => {
                              setStateFilter("");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {cityFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          City: <b>{cityFilter}</b>
                          <button
                            type="button"
                            onClick={() => {
                              setCityFilter("");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {industry !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          Industry: <b>{industry}</b>
                          <button
                            type="button"
                            onClick={() => {
                              setIndustry("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {employeeRange !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          Emps: <b>{employeeRange}</b>
                          <button
                            type="button"
                            onClick={() => {
                              setEmployeeRange("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {revenueFilter !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          Rev: <b>{revenueFilter}</b>
                          <button
                            type="button"
                            onClick={() => {
                              setRevenueFilter("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {ownershipFilter !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          Ownership: <b>{ownershipFilter}</b>
                          <button
                            type="button"
                            onClick={() => {
                              setOwnershipFilter("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {emailStatus === "verified" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] shadow-2xs font-semibold">
                          Verified Email
                          <button
                            type="button"
                            onClick={() => {
                              setEmailStatus("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-emerald-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {hasEmailFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal/10 border border-teal/30 text-teal-dark text-[11px] shadow-2xs font-semibold">
                          Has Email
                          <button
                            type="button"
                            onClick={() => {
                              setHasEmailFilter(false);
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-teal-dark cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {hasPhone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal/10 border border-teal/30 text-teal-dark text-[11px] shadow-2xs font-semibold">
                          Has Direct Dial
                          <button
                            type="button"
                            onClick={() => {
                              setHasPhone(false);
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-teal-dark cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {hasLinkedinFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50 border border-sky-300 text-sky-800 text-[11px] shadow-2xs font-semibold">
                          LinkedIn Profile
                          <button
                            type="button"
                            onClick={() => {
                              setHasLinkedinFilter(false);
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-sky-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {minContactsFilter !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-navy text-[11px] shadow-2xs font-medium">
                          Min Contacts: <b>{minContactsFilter}+</b>
                          <button
                            type="button"
                            onClick={() => {
                              setMinContactsFilter("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSeniority([]);
                          setTitleFilter("");
                          setCityFilter("");
                          setStateFilter("");
                          setCompanyFilter("");
                          setIndustry("all");
                          setCountry("all");
                          setEmployeeRange("all");
                          setRevenueFilter("all");
                          setOwnershipFilter("all");
                          setDepartmentFilter("all");
                          setEmailStatus("all");
                          setHasPhone(false);
                          setHasEmailFilter(false);
                          setHasLinkedinFilter(false);
                          setMinContactsFilter("all");
                          setPage(1);
                        }}
                        className="ml-auto text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  {/* Results Table */}
                  {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs">
                      <RefreshCw className="w-8 h-8 text-teal-dark animate-spin mx-auto mb-3" />
                      <p className="text-sm font-bold text-navy">Querying LeadIntellect Master Dataset...</p>
                      <p className="text-xs text-text-muted mt-1">Filtering verified B2B decision-makers</p>
                    </div>
                  ) : totalCount === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-navy">No prospects match your criteria</h3>
                      <p className="text-xs text-text-muted mt-1.5 max-w-sm mx-auto">
                        Try broadening your seniority, location, or industry filters to uncover relevant
                        accounts.
                      </p>
                      <button
                        onClick={() => {
                          setSeniority([]);
                          setIndustry("all");
                          setCountry("all");
                          setEmployeeRange("all");
                          setEmailStatus("all");
                          setHasPhone(false);
                          setQuery("");
                        }}
                        className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy text-xs font-semibold rounded-xl"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : discoverMode === "people" ? (
                    /* PEOPLE TABLE */
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-text-muted font-bold tracking-wider text-[11px] uppercase">
                              <th className="p-3.5 w-10 text-center">
                                <button
                                  type="button"
                                  onClick={toggleSelectAll}
                                  className="text-slate-400 hover:text-navy cursor-pointer"
                                >
                                  {selectedIds.length === prospects.length ? (
                                    <CheckSquare className="w-4 h-4 text-teal-dark" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                              </th>
                              <th className="p-3.5">Decision Maker</th>
                              <th className="p-3.5">Company &amp; Domain</th>
                              <th className="p-3.5">Location</th>
                              <th className="p-3.5">Fit Score</th>
                              <th className="p-3.5">Reachability</th>
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {prospects.map((p) => {
                              const isSelected = selectedIds.includes(p.id);
                              const isRevealed = Boolean(revealedContacts[p.id]);
                              const activeEmail = revealedContacts[p.id]?.email || p.email;
                              const activePhone = revealedContacts[p.id]?.phone || p.phone;

                              return (
                                <tr
                                  key={p.id}
                                  className={`hover:bg-slate-50/70 transition-colors ${
                                    isSelected ? "bg-teal/5" : ""
                                  }`}
                                >
                                  <td className="p-3.5 text-center">
                                    <button
                                      type="button"
                                      onClick={() => toggleSelect(p.id)}
                                      className="text-slate-400 hover:text-navy cursor-pointer"
                                    >
                                      {isSelected ? (
                                        <CheckSquare className="w-4 h-4 text-teal-dark" />
                                      ) : (
                                        <Square className="w-4 h-4" />
                                      )}
                                    </button>
                                  </td>

                                  {/* Person Name & Title */}
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => setActiveProfile(p)}
                                        className="font-bold text-navy hover:text-teal-dark text-left cursor-pointer group"
                                      >
                                        <span>{p.name}</span>
                                      </button>
                                      {p.linkedin && (
                                        <a
                                          href={p.linkedin}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-slate-400 hover:text-[#0a66c2] p-0.5 inline-flex items-center"
                                          title="View LinkedIn Profile"
                                        >
                                          <LinkedInIcon className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-text-muted mt-0.5 truncate max-w-xs">
                                      {p.title}
                                    </p>
                                    <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                      {p.seniority}
                                    </span>
                                  </td>

                                  {/* Company */}
                                  <td className="p-3.5">
                                    <p className="font-semibold text-navy">{p.company}</p>
                                    <p className="text-[11px] text-text-muted">{p.industry}</p>
                                    <span className="text-[10px] text-slate-400">
                                      {p.employeeRange} emps &middot; {p.revenueRange}
                                    </span>
                                  </td>

                                  {/* Location */}
                                  <td className="p-3.5 text-text-muted">
                                    <p>{p.city ? `${p.city}, ${p.state}` : p.location}</p>
                                    <p className="text-[10px] text-slate-400">{p.country}</p>
                                  </td>

                                  {/* ICP Score */}
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className={`font-extrabold text-sm ${
                                          p.icpScore >= 85
                                            ? "text-emerald-700"
                                            : p.icpScore >= 75
                                            ? "text-teal-dark"
                                            : "text-slate-600"
                                        }`}
                                      >
                                        {p.icpScore}
                                      </span>
                                      <span className="text-[10px] text-text-muted">/100</span>
                                    </div>
                                    <span
                                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                        p.icpTier === "Tier 1"
                                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                          : "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      {p.icpTier}
                                    </span>
                                  </td>

                                  {/* Reachability: Email & Phone Status */}
                                  <td className="p-3.5">
                                    {isRevealed ? (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-navy font-semibold">
                                          <Mail className="w-3 h-3 text-emerald-600" />
                                          <span className="truncate max-w-[140px]">{activeEmail}</span>
                                        </div>
                                        {activePhone && (
                                          <div className="flex items-center gap-1 text-slate-600">
                                            <Phone className="w-3 h-3 text-teal-dark" />
                                            <span>{activePhone}</span>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1.5">
                                          <span
                                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                              p.emailStatus === "verified"
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-sky-50 text-sky-700 border border-sky-200"
                                            }`}
                                          >
                                            <ShieldCheck className="w-3 h-3" />
                                            {p.emailStatus === "verified"
                                              ? "Verified Email"
                                              : "Deliverable MX"}
                                          </span>
                                        </div>
                                        {p.hasPhone && (
                                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <Phone className="w-3 h-3 text-teal-dark" />
                                            {p.phoneType}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </td>

                                  {/* Actions */}
                                  <td className="p-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {!isRevealed ? (
                                        <button
                                          onClick={() => handleRevealContact(p)}
                                          disabled={revealingId === p.id}
                                          className="px-2.5 py-1.5 rounded-lg bg-teal/15 hover:bg-teal/25 text-teal-dark text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                        >
                                          {revealingId === p.id ? (
                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                          ) : (
                                            <Eye className="w-3 h-3" />
                                          )}
                                          <span>Reveal (1 Cr)</span>
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleGenerateOutreach(p)}
                                          className="px-2.5 py-1.5 rounded-lg bg-navy hover:bg-slate-800 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                          <Send className="w-3 h-3" />
                                          <span>Outreach</span>
                                        </button>
                                      )}

                                      <button
                                        onClick={() => handleAddToPipeline(p)}
                                        title="Add to sales pipeline"
                                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-navy cursor-pointer"
                                      >
                                        <Kanban className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* COMPANIES TABLE */
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-text-muted font-bold tracking-wider text-[11px] uppercase">
                              <th className="p-3.5">Company Name</th>
                              <th className="p-3.5">Industry Sector</th>
                              <th className="p-3.5">Headquarters</th>
                              <th className="p-3.5">Scale &amp; Headcount</th>
                              <th className="p-3.5">Decision-Makers</th>
                              <th className="p-3.5">Fit Score</th>
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {companies.map((c) => (
                              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="p-3.5">
                                  <p className="font-bold text-navy">{c.name}</p>
                                  {c.website && (
                                    <a
                                      href={c.website}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[11px] text-teal-dark hover:underline flex items-center gap-1 mt-0.5"
                                    >
                                      <span>{c.domain}</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <p className="font-semibold text-slate-700">{c.industry}</p>
                                  {c.subIndustry && (
                                    <p className="text-[10px] text-text-muted">{c.subIndustry}</p>
                                  )}
                                </td>
                                <td className="p-3.5 text-text-muted">
                                  <p>{c.headquarters}</p>
                                </td>
                                <td className="p-3.5">
                                  <p className="font-semibold text-navy">{c.employeeRange} emps</p>
                                  <p className="text-[10px] text-text-muted">{c.revenueRange}</p>
                                </td>
                                <td className="p-3.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-navy text-sm">
                                      {c.decisionMakerCount}
                                    </span>
                                    <span className="text-[10px] text-text-muted">Contacts</span>
                                  </div>
                                  <span className="text-[10px] text-emerald-700">
                                    {c.verifiedContactsCount} Verified
                                  </span>
                                </td>
                                <td className="p-3.5">
                                  <span className="font-extrabold text-navy text-sm">{c.icpScore}</span>
                                  <span className="text-[10px] text-text-muted">/100</span>
                                </td>
                                <td className="p-3.5 text-right">
                                  <button
                                    onClick={() => {
                                      setQuery(c.name);
                                      setDiscoverMode("people");
                                    }}
                                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-navy hover:bg-slate-50 cursor-pointer"
                                  >
                                    View People ({c.decisionMakerCount})
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                  <p className="text-xs text-text-muted">
                    Page <b className="text-navy">{page}</b> of <b className="text-navy">{totalPages}</b>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-navy hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-navy hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: LISTS ================= */}
        {activeNav === "lists" && (
          <div className="max-w-6xl mx-auto w-full p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-navy">Prospect Lists</h1>
                <p className="text-xs text-text-muted mt-1">
                  Organize target accounts and decision-makers into focused prospecting campaigns.
                </p>
              </div>
              <button
                onClick={() => setListModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New List</span>
              </button>
            </div>

            {userLists.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs">
                <ListFilter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-navy">No lists created yet</h3>
                <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                  Create a list to group high-fit accounts from your Discover searches or CSV imports.
                </p>
                <button
                  onClick={() => setListModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold cursor-pointer"
                >
                  Create First List
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {userLists.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-navy text-base">{l.name}</h3>
                        <span className="text-xs font-extrabold text-teal-dark bg-teal/10 px-2 py-0.5 rounded-full">
                          {l.prospectIds.length} leads
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-2 min-h-[32px] leading-relaxed">
                        {l.description || "Prospect group created from Discover"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-3">
                        Updated: {new Date(l.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={async () => {
                          if (l.prospectIds.length === 0) {
                            showToast("This list has no prospects yet.", "info");
                            return;
                          }
                          // Load prospects and set filter
                          setSelectedIds(l.prospectIds);
                          setActiveNav("discover");
                          showToast(`Selected ${l.prospectIds.length} prospects from "${l.name}"`);
                        }}
                        className="text-xs font-bold text-navy hover:text-teal-dark cursor-pointer flex items-center gap-1"
                      >
                        <span>View in Discover</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={async () => {
                          const res = await fetch(
                            `/api/lists?listId=${l.id}&userEmail=${encodeURIComponent(
                              currentUser?.email || ""
                            )}`,
                            { method: "DELETE" }
                          );
                          if (res.ok) {
                            showToast(`Deleted list "${l.name}"`);
                            fetchLists();
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION: OUTREACH STUDIO ================= */}
        {activeNav === "outreach" && (
          <div className="max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                OUTREACH PREPARATION
              </div>
              <h1 className="text-2xl font-extrabold text-navy">
                Factual Outreach Preparation Studio
              </h1>
              <p className="text-xs text-text-muted mt-1">
                Generate tailored, professional cold outreach drafts grounded strictly in prospect facts
                without artificial hallucinations.
              </p>
            </div>

            {outreachProspect ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase">Target Prospect:</p>
                  <p className="text-base font-extrabold text-navy mt-0.5">
                    {outreachProspect.name} &middot; {outreachProspect.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    {outreachProspect.company} ({outreachProspect.industry}) &middot; {outreachProspect.location}
                  </p>
                </div>
                <button
                  onClick={() => handleGenerateOutreach(outreachProspect)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-navy flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Drafts</span>
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-xs text-text-muted">
                  Select any prospect in Discover and click &quot;Outreach&quot; to generate personalized messages.
                </p>
              </div>
            )}

            {outreachLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-6 h-6 text-teal-dark animate-spin mx-auto mb-2" />
                <p className="text-xs font-semibold text-navy">Synthesizing prospect context drafts...</p>
              </div>
            ) : outreachDrafts ? (
              <div className="space-y-6">
                {/* Cold Email Draft */}
                {outreachDrafts.coldEmail && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-teal-dark" />
                        1. Cold Introduction Email
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `Subject: ${outreachDrafts.coldEmail?.subject}\n\n${outreachDrafts.coldEmail?.body}`
                          );
                          setCopiedDraftKey("cold");
                          setTimeout(() => setCopiedDraftKey(null), 2500);
                        }}
                        className="text-xs font-bold text-teal-dark hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedDraftKey === "cold" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Subject &amp; Body</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-navy mb-2">
                      Subject:{" "}
                      <span className="font-normal text-slate-700">
                        {outreachDrafts.coldEmail.subject}
                      </span>
                    </p>
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {outreachDrafts.coldEmail.body}
                    </div>
                  </div>
                )}

                {/* Follow-Up Draft */}
                {outreachDrafts.followUpEmail && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        2. Follow-Up Draft (Day +3)
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `Subject: ${outreachDrafts.followUpEmail?.subject}\n\n${outreachDrafts.followUpEmail?.body}`
                          );
                          setCopiedDraftKey("follow");
                          setTimeout(() => setCopiedDraftKey(null), 2500);
                        }}
                        className="text-xs font-bold text-teal-dark hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedDraftKey === "follow" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Draft</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {outreachDrafts.followUpEmail.body}
                    </div>
                  </div>
                )}

                {/* Phone Call Opener */}
                {outreachDrafts.phoneOpener && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        3. Phone Opener
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(outreachDrafts.phoneOpener || "");
                          setCopiedDraftKey("phone");
                          setTimeout(() => setCopiedDraftKey(null), 2500);
                        }}
                        className="text-xs font-bold text-teal-dark hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedDraftKey === "phone" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Opener</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 italic leading-relaxed">
                      {outreachDrafts.phoneOpener}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* ================= SECTION: PIPELINE ================= */}
        {activeNav === "pipeline" && (
          <div className="max-w-7xl mx-auto w-full p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-navy">Sales Pipeline</h1>
                <p className="text-xs text-text-muted mt-1">
                  Track deal progression from identified prospects to closed revenue without CRM clutter.
                </p>
              </div>
              <span className="text-xs font-bold text-navy bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                {deals.length} Active Deals
              </span>
            </div>

            {/* Kanban Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
              {PIPELINE_STAGES.map((stg) => {
                const stageDeals = deals.filter((d) => d.stage === stg.id);
                const stageValue = stageDeals.reduce((sum, d) => sum + (Number(d.dealValue) || 0), 0);

                return (
                  <div
                    key={stg.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs min-h-[400px] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
                        <span className="text-xs font-bold text-navy truncate">{stg.label}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {stageDeals.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {stageDeals.map((d) => (
                          <div
                            key={d.id}
                            className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-2xs hover:border-slate-300 transition-all text-xs"
                          >
                            <p className="font-bold text-navy truncate">{d.contactName}</p>
                            <p className="text-[11px] text-text-muted truncate mt-0.5">{d.companyName}</p>
                            <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px]">
                              <span className="font-bold text-navy">
                                ${d.dealValue?.toLocaleString()}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded font-semibold ${
                                  d.priority === "high"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {d.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-text-muted text-right">
                      Total: ${stageValue.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SECTION: DATA & CREDITS ================= */}
        {activeNav === "data" && (
          <div className="max-w-6xl mx-auto w-full p-6 sm:p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-navy">Data &amp; Credits Hub</h1>
                <p className="text-xs text-text-muted mt-1">
                  Server-enforced usage accounting, CSV import tools, and credit transaction ledger.
                </p>
              </div>
              <button
                onClick={() => setImportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Prospects CSV</span>
              </button>
            </div>

            {/* Credit Ledger Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-teal-dark" />
                  <h3 className="text-sm font-bold text-navy">Audit Credit Ledger</h3>
                </div>
                <span className="text-xs text-text-muted">
                  Balance: <b className="text-navy">{credits.toLocaleString()} Credits</b>
                </span>
              </div>

              {creditLedger.length === 0 ? (
                <p className="text-xs text-text-muted py-6 text-center">
                  No credit transactions recorded yet. Credits are logged whenever contact details are revealed or verified.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-text-muted uppercase text-[10px] font-bold">
                        <th className="py-2.5">Date &amp; Time</th>
                        <th className="py-2.5">Action</th>
                        <th className="py-2.5">Description</th>
                        <th className="py-2.5 text-right">Deduction</th>
                        <th className="py-2.5 text-right">Balance After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {creditLedger.map((c) => (
                        <tr key={c.id}>
                          <td className="py-2 text-slate-500">
                            {new Date(c.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2 font-bold text-navy uppercase text-[10px]">
                            {c.action}
                          </td>
                          <td className="py-2 text-slate-700">{c.description}</td>
                          <td className="py-2 text-right font-bold text-rose-600">
                            -{c.amount}
                          </td>
                          <td className="py-2 text-right font-bold text-navy">{c.balanceAfter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SECTION: INTEGRATIONS ================= */}
        {activeNav === "integrations" && (
          <div className="max-w-5xl mx-auto w-full p-6 sm:p-10 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-navy">Provider Integrations</h1>
              <p className="text-xs text-text-muted mt-1">
                Honest connection statuses for external data providers and deliverability gateways.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {integrationsHealth.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-navy text-base">{item.name}</h3>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          item.status === "connected"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "error"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <p className="text-[10px] font-bold uppercase text-navy mb-1.5">
                        Supported Capabilities:
                      </p>
                      <ul className="space-y-1">
                        {item.capabilities?.map((c: string, idx: number) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                            <span className="text-teal-dark font-bold">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: SETTINGS ================= */}
        {activeNav === "settings" && (
          <div className="max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-navy">Account Settings</h1>
              <p className="text-xs text-text-muted mt-1">
                Manage your profile, security credentials, and data rights preferences.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-navy">Profile Details</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-text-muted block mb-1">Full Name</span>
                  <p className="font-semibold text-navy">{currentUser?.name}</p>
                </div>
                <div>
                  <span className="text-text-muted block mb-1">Email Address</span>
                  <p className="font-semibold text-navy">{currentUser?.email}</p>
                </div>
                <div>
                  <span className="text-text-muted block mb-1">Company / Team</span>
                  <p className="font-semibold text-navy">{currentUser?.company || "Self"}</p>
                </div>
                <div>
                  <span className="text-text-muted block mb-1">Account Role</span>
                  <p className="font-semibold text-navy capitalize">{currentUser?.role || "user"}</p>
                </div>
              </div>
            </div>

            {/* Account Deletion Safeguard */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 space-y-3">
              <h3 className="text-sm font-bold text-rose-800">Delete Account &amp; Stored Lists</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Permanently purge your account, saved lists, and custom searches from the database.
              </p>
              <button
                onClick={async () => {
                  if (confirm("Are you sure? This will permanently delete your account.")) {
                    const res = await fetch("/api/auth/delete-account", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: currentUser?.email,
                        confirmation: "DELETE",
                      }),
                    });
                    if (res.ok) {
                      localStorage.removeItem("leadintellect_user");
                      router.push("/");
                    }
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Delete Account Permanently
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-Over Drawer: Complete Prospect Intelligence Dossier */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-navy/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-dark flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-teal-dark" />
                  Full Contact Intelligence Dossier
                </span>
                <button
                  onClick={() => setActiveProfile(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-navy cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Identity Card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200">
                <div className="w-13 h-13 rounded-2xl bg-navy text-teal font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs border-2 border-teal/30">
                  {activeProfile.firstName?.[0] || activeProfile.name?.[0] || "U"}
                  {activeProfile.lastName?.[0] || activeProfile.name?.split(" ")?.[1]?.[0] || ""}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-extrabold text-navy truncate">{activeProfile.name}</h2>
                    {activeProfile.linkedin && (
                      <a
                        href={activeProfile.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-[#0a66c2] p-1 inline-flex items-center transition-colors"
                        title="Open LinkedIn Profile"
                      >
                        <LinkedInIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{activeProfile.title}</p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] font-bold bg-navy text-white px-2 py-0.5 rounded-md">
                      {activeProfile.seniority}
                    </span>
                    <span className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                      {activeProfile.department}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        activeProfile.icpTier === "Tier 1"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {activeProfile.icpTier} &middot; Score {activeProfile.icpScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Reachability (Email & Phone) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-dark" />
                  Direct Reachability &amp; Channels
                </h3>

                {/* Work Email Card */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Work Email
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeProfile.emailStatus === "verified"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}
                    >
                      {activeProfile.emailStatus === "verified" ? "Verified Deliverable" : "Deliverable MX"}
                      {" "}({activeProfile.emailConfidence}% confidence)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {revealedContacts[activeProfile.id] ? (
                      <span className="text-sm font-bold text-navy select-all font-mono">
                        {revealedContacts[activeProfile.id].email || activeProfile.email}
                      </span>
                    ) : (
                      <span className="text-sm font-mono text-slate-500">
                        {activeProfile.email
                          ? activeProfile.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
                          : "Verified mailbox available"}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5">
                      {revealedContacts[activeProfile.id] ? (
                        <button
                          type="button"
                          onClick={() => {
                            const val = revealedContacts[activeProfile.id].email || activeProfile.email;
                            navigator.clipboard.writeText(val);
                            setCopiedItem("email");
                            setTimeout(() => setCopiedItem(null), 2500);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedItem === "email" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRevealContact(activeProfile)}
                          disabled={revealingId === activeProfile.id}
                          className="px-2.5 py-1 rounded-lg bg-teal/15 hover:bg-teal/25 text-teal-dark text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {revealingId === activeProfile.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                          <span>Reveal Email (1 Cr)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-text-muted pt-1 border-t border-slate-100">
                    Provenance: {activeProfile.verificationSource} &middot; Verified on {activeProfile.verificationDate}
                  </p>
                </div>

                {/* Direct Dial Phone Card */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Direct Phone / Dial
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {activeProfile.phoneType || (activeProfile.hasPhone ? "Direct Mobile" : "HQ Line")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {revealedContacts[activeProfile.id] ? (
                      <span className="text-sm font-bold text-navy select-all font-mono">
                        {revealedContacts[activeProfile.id].phone || activeProfile.phone || "+1 (Direct Mobile)"}
                      </span>
                    ) : (
                      <span className="text-sm font-mono text-slate-500">
                        {activeProfile.hasPhone ? "+1 (***) ***-**" + (activeProfile.phone ? activeProfile.phone.slice(-2) : "88") : "Available upon reveal"}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5">
                      {revealedContacts[activeProfile.id] ? (
                        <button
                          type="button"
                          onClick={() => {
                            const val = revealedContacts[activeProfile.id].phone || activeProfile.phone;
                            if (val) navigator.clipboard.writeText(val);
                            setCopiedItem("phone");
                            setTimeout(() => setCopiedItem(null), 2500);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedItem === "phone" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRevealContact(activeProfile)}
                          disabled={revealingId === activeProfile.id}
                          className="px-2.5 py-1 rounded-lg bg-teal/15 hover:bg-teal/25 text-teal-dark text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {revealingId === activeProfile.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                          <span>Reveal Phone (1 Cr)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Reporting Structure */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-dark" />
                  Role &amp; Reporting Scope
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Reports To</span>
                    <p className="font-semibold text-navy mt-0.5">
                      {activeProfile.reportsTo || "Executive Leadership / C-Suite"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                    <p className="font-semibold text-navy mt-0.5">{activeProfile.department}</p>
                  </div>
                </div>
                {activeProfile.jobFunctions && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Functional Responsibilities
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">{activeProfile.jobFunctions}</p>
                  </div>
                )}
              </div>

              {/* Company & Firmographics Intel */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-dark" />
                    Account &amp; Firmographics
                  </h3>
                  {activeProfile.website && (
                    <a
                      href={activeProfile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-teal-dark hover:underline flex items-center gap-1"
                    >
                      <span>{activeProfile.domain || "Website"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Company Name</span>
                    <p className="font-bold text-navy mt-0.5">{activeProfile.company}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Industry</span>
                    <p className="font-semibold text-navy mt-0.5">{activeProfile.industry}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Headcount Scale</span>
                    <p className="font-semibold text-navy mt-0.5">
                      {activeProfile.employees?.toLocaleString()} emps ({activeProfile.employeeRange})
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Revenue</span>
                    <p className="font-semibold text-navy mt-0.5">
                      {activeProfile.revenueRange} (${activeProfile.revenueMil}M ARR)
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Location / HQ</span>
                    <p className="font-semibold text-navy mt-0.5">
                      {activeProfile.city ? `${activeProfile.city}, ${activeProfile.state}` : activeProfile.location},{" "}
                      {activeProfile.country}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Ownership</span>
                    <p className="font-semibold text-navy mt-0.5">
                      {activeProfile.ownership || "Privately Held"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ICP Fit Analysis Score Bar */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-teal-dark" />
                    ICP Fit Analysis:
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    {activeProfile.icpScore}/100 ({activeProfile.icpTier})
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${activeProfile.icpScore}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>
                    • Role Match: <b className="text-navy">{activeProfile.icpScore >= 80 ? "High Alignment" : "Moderate"}</b>
                  </div>
                  <div>
                    • Firmographic Fit: <b className="text-navy">{activeProfile.employeeRange} Target</b>
                  </div>
                  <div>
                    • Geo Proximity: <b className="text-navy">{activeProfile.country}</b>
                  </div>
                  <div>
                    • Data Source: <b className="text-navy">{activeProfile.source || "B2B Master"}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Drawer Footer Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2.5 mt-6">
              {!revealedContacts[activeProfile.id] ? (
                <button
                  type="button"
                  onClick={() => handleRevealContact(activeProfile)}
                  disabled={revealingId === activeProfile.id}
                  className="flex-1 py-2.5 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Contact (1 Credit)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleGenerateOutreach(activeProfile);
                    setActiveProfile(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Generate Outreach</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleAddToPipeline(activeProfile)}
                title="Add to sales pipeline"
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Kanban className="w-3.5 h-3.5 text-teal-dark" />
                <span>Add to CRM</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New List */}
      {listModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4 text-teal-dark" />
              Create New Prospect List
            </h3>
            <p className="text-xs text-text-muted mt-1">
              {selectedIds.length > 0
                ? `Organize ${selectedIds.length} selected decision-makers into a targeted list.`
                : "Create a list to organize prospective accounts and contacts."}
            </p>

            <form onSubmit={handleCreateList} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">List Name *</label>
                <input
                  type="text"
                  required
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Q4 Growth Leaders"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="e.g. Verified target accounts for outbound sequence"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal-dark resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={savingList}
                  onClick={() => setListModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingList || !newListName.trim()}
                  className="px-5 py-2 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  {savingList ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal" />
                      <span>Creating List...</span>
                    </>
                  ) : (
                    <span>Save List</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: CSV Import */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <Upload className="w-4 h-4 text-teal-dark" />
                Import Prospects CSV
              </h3>
              <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!importPreview ? (
              <div className="space-y-4">
                <p className="text-xs text-text-muted">
                  Paste your raw CSV rows or upload a file. The first row must be the header.
                </p>
                <textarea
                  rows={8}
                  value={importFileContent}
                  onChange={(e) => setImportFileContent(e.target.value)}
                  placeholder={`Name,Company,Email,Title,Phone\nJohn Doe,Acme Corp,john@acme.com,Director,+1415890000`}
                  className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/30"
                />

                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      if (!importFileContent.trim()) return;
                      const res = await fetch("/api/data/import", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "preview", csvContent: importFileContent }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setImportPreview(data);
                        setImportMapping(data.suggestedMapping || {});
                      } else {
                        showToast(data.error || "Failed to preview CSV.", "error");
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 cursor-pointer"
                  >
                    Preview &amp; Map Columns
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between">
                  <span>Detected {importPreview.totalRows} data rows</span>
                  <button
                    onClick={() => setImportPreview(null)}
                    className="text-teal-dark font-bold underline"
                  >
                    Change File
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-navy mb-2">Column Mapping:</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {importPreview.headers.map((h) => (
                      <div key={h} className="p-2 border border-slate-200 rounded-lg flex items-center justify-between">
                        <span className="font-semibold text-slate-700 truncate max-w-[120px]">{h}</span>
                        <select
                          value={importMapping[h] || ""}
                          onChange={(e) =>
                            setImportMapping((prev) => ({ ...prev, [h]: e.target.value }))
                          }
                          className="text-xs border rounded p-1 bg-white"
                        >
                          <option value="">Ignore</option>
                          <option value="name">Full Name</option>
                          <option value="firstName">First Name</option>
                          <option value="lastName">Last Name</option>
                          <option value="company">Company</option>
                          <option value="email">Email</option>
                          <option value="title">Job Title</option>
                          <option value="phone">Phone</option>
                          <option value="industry">Industry</option>
                          <option value="city">City</option>
                          <option value="state">State</option>
                          <option value="country">Country</option>
                          <option value="linkedin">LinkedIn</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Save imported records into list: (Optional)
                  </label>
                  <input
                    type="text"
                    value={importListName}
                    onChange={(e) => setImportListName(e.target.value)}
                    placeholder="e.g. Imported Outreach Batch"
                    className="w-full text-xs p-2 border rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setImportPreview(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    Back
                  </button>
                  <button
                    disabled={importing}
                    onClick={async () => {
                      setImporting(true);
                      try {
                        const res = await fetch("/api/data/import", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            action: "confirm",
                            csvContent: importFileContent,
                            mapping: importMapping,
                            listName: importListName,
                            userEmail: currentUser?.email || "guest@leadintellect.ai",
                          }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          showToast(`Successfully imported ${data.importedCount} records!`);
                          setImportModalOpen(false);
                          setImportPreview(null);
                          setImportFileContent("");
                          fetchLists();
                        } else {
                          showToast(data.error || "Import failed.", "error");
                        }
                      } catch {
                        showToast("Network error during import.", "error");
                      } finally {
                        setImporting(false);
                      }
                    }}
                    className="px-5 py-2.5 bg-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                  >
                    {importing ? "Importing..." : "Confirm & Import"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
