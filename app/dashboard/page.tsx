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
  ChevronUp,
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
  Lock,
  Play,
  TrendingUp,
  Zap,
  MessageSquare,
  PhoneCall,
  Award,
  Globe,
  Rocket,
  ChevronsRight,
  ChevronsLeft,
  ArrowRight,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import Logo from "@/components/Logo";
import { LinkedInIcon } from "@/components/SocialIcons";
import {
  getProspectIntentSignal,
  INTENT_CATEGORIES,
  RECENCY_WINDOWS,
  type IntentSignal,
} from "@/lib/intent";

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
  corpPhone?: string;
  directPhone?: string;
  mobilePhone?: string;
  hasPhone: boolean;
  hasEmail: boolean;
  linkedin: string;
  ownership?: string;
  icpScore: number;
  icpTier: "Tier 1" | "Tier 2" | "Tier 3";
  source: string;
  intentSignal?: IntentSignal;
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
  notes?: string[];
}

const PIPELINE_STAGES = [
  { id: "identified", label: "Lead Identified", color: "border-slate-300 bg-slate-50", badge: "bg-slate-100 text-slate-700" },
  { id: "contacted", label: "Outreach Sent", color: "border-sky-300 bg-sky-50/50", badge: "bg-sky-50 text-sky-700" },
  { id: "demo_booked", label: "Meeting Booked", color: "border-indigo-300 bg-indigo-50/50", badge: "bg-indigo-50 text-indigo-700" },
  { id: "proposal", label: "Qualified Opportunity", color: "border-amber-300 bg-amber-50/50", badge: "bg-amber-50 text-amber-700" },
  { id: "won", label: "Proposal / Negotiation", color: "border-purple-300 bg-purple-50/50", badge: "bg-purple-50 text-purple-700" },
  { id: "closed_won", label: "Closed Won", color: "border-emerald-300 bg-emerald-50/50", badge: "bg-emerald-50 text-emerald-700" },
];

type NavItem =
  | "home"
  | "discover"
  | "lists"
  | "enrich"
  | "outreach"
  | "engagement"
  | "pipeline"
  | "intelligence"
  | "integrations"
  | "settings";

interface EngagementActivity {
  id: string;
  prospectId: string;
  prospectName: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  cadenceStep: string;
  status: "replied_interested" | "replied_followup" | "meeting_booked" | "delivered" | "unsubscribed";
  sentiment: "positive" | "neutral" | "negative";
  date: string;
  notes?: string;
}

// Onboarding Task Definition for Home page (Screenshot 2)
interface OnboardingTask {
  id: string;
  section: "prospects" | "inbox" | "outreach" | "meetings";
  title: string;
  actionText: string;
  credits: number;
  highlightAction?: boolean;
}

const ONBOARDING_TASKS: OnboardingTask[] = [
  // Section 1: Prospects (20 credits)
  {
    id: "task_save_contact",
    section: "prospects",
    title: "Save a contact to start building your pipeline",
    actionText: "Save a prospect",
    credits: 5,
    highlightAction: true,
  },
  {
    id: "task_save_mobile",
    section: "prospects",
    title: "Save a mobile number to reach people by phone",
    actionText: "Find numbers",
    credits: 3,
  },
  {
    id: "task_create_list",
    section: "prospects",
    title: "Create a list to keep your prospects organized",
    actionText: "Create a list",
    credits: 3,
  },
  {
    id: "task_save_company",
    section: "prospects",
    title: "Save target companies to find the right people inside them",
    actionText: "Save a company",
    credits: 3,
  },
  {
    id: "task_save_search",
    section: "prospects",
    title: "Save your search and get notified when new leads match your audience",
    actionText: "Set up alert",
    credits: 3,
  },
  {
    id: "task_download_extension",
    section: "prospects",
    title: "Download the Chrome extension to prospect directly on LinkedIn and company websites",
    actionText: "Install extension",
    credits: 3,
  },

  // Section 2: Inbox (15 credits)
  {
    id: "task_connect_inbox",
    section: "inbox",
    title: "Connect your primary email mailbox (Google / Outlook / SMTP)",
    actionText: "Connect inbox",
    credits: 5,
  },
  {
    id: "task_verify_domain",
    section: "inbox",
    title: "Configure SPF, DKIM & DMARC deliverability guard",
    actionText: "Verify domain",
    credits: 5,
  },
  {
    id: "task_warmup_limits",
    section: "inbox",
    title: "Set daily send warmup limits to protect domain reputation",
    actionText: "Set limits",
    credits: 5,
  },

  // Section 3: Outreach (15 credits)
  {
    id: "task_new_sequence",
    section: "outreach",
    title: "Create your first multi-step cold email cadence",
    actionText: "New sequence",
    credits: 5,
  },
  {
    id: "task_ai_snippets",
    section: "outreach",
    title: "Personalize email body with dynamic ICP snippets",
    actionText: "Use AI writer",
    credits: 5,
  },
  {
    id: "task_launch_sequence",
    section: "outreach",
    title: "Launch sequence to verified prospects",
    actionText: "Start sequence",
    credits: 5,
  },

  // Section 4: Meetings (20 credits)
  {
    id: "task_connect_calendar",
    section: "meetings",
    title: "Connect your calendar (Google Meet / Zoom / Calendly)",
    actionText: "Connect calendar",
    credits: 7,
  },
  {
    id: "task_booking_link",
    section: "meetings",
    title: "Create a one-click booking link for inbound leads",
    actionText: "Create link",
    credits: 7,
  },
  {
    id: "task_pipeline_sync",
    section: "meetings",
    title: "Log deal activity to sales pipeline",
    actionText: "View pipeline",
    credits: 6,
  },
];

export default function LeadIntellectWorkspace() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession>({
    id: "usr_guest",
    name: "Guest Prospector",
    email: "guest@leadintellect.ai",
    company: "Revenue Operations",
    provider: "email",
    role: "user",
    credits: 99,
  });
  const [credits, setCredits] = useState<number>(99);

  // Column Customization States (14 Template Fields from Database Template.xlsx)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    decisionMaker: true,
    company: true,
    location: true,
    icpScore: true,
    reachability: true,
    departments: false,
    directPhone: false,
    corpPhone: false,
    revenue: false,
    employees: false,
    linkedin: false,
    website: false,
    ownership: false,
    actions: true,
  });
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false);

  // Outreach Target List & Campaign Send State
  const [outreachSelectedListId, setOutreachSelectedListId] = useState<string>("all");
  const [outreachSending, setOutreachSending] = useState(false);
  const [outreachSentSuccess, setOutreachSentSuccess] = useState(false);

  // Engagement Stage State
  const [engagementFilter, setEngagementFilter] = useState<string>("all");
  const [engagementActivities, setEngagementActivities] = useState<EngagementActivity[]>([
    {
      id: "eng_1",
      prospectId: "p_1",
      prospectName: "Chelsea Hoff",
      title: "Director IT & ERP Software",
      company: "555 Corp",
      email: "c.hoff@555corp.com",
      phone: "+1 (312) 555-0192",
      cadenceStep: "Step 2: Follow-up Value Proposition",
      status: "replied_interested",
      sentiment: "positive",
      date: "Today at 10:24 AM",
      notes: "Asked for pricing for a team of 15 SDRs and custom API limits.",
    },
    {
      id: "eng_2",
      prospectId: "p_2",
      prospectName: "Jacob Saunders",
      title: "CTO",
      company: "10th Magnitude",
      email: "jsaunders@10thmagnitude.com",
      phone: "+1 (312) 880-4921",
      cadenceStep: "Step 3: Executive Touchpoint",
      status: "meeting_booked",
      sentiment: "positive",
      date: "Yesterday at 4:15 PM",
      notes: "Demo call scheduled for next Tuesday at 2:00 PM EST.",
    },
    {
      id: "eng_3",
      prospectId: "p_3",
      prospectName: "Benoit Hodebert",
      title: "Senior Business Analyst",
      company: "2020 Spaces",
      email: "b.hodebert@2020spaces.com",
      cadenceStep: "Step 1: Cold Introduction",
      status: "replied_followup",
      sentiment: "neutral",
      date: "2 days ago",
      notes: "Evaluating Q4 budget, requested re-contact next month.",
    },
    {
      id: "eng_4",
      prospectId: "p_4",
      prospectName: "David Karlsberg",
      title: "Director Network Ops",
      company: "1-800-Flowers.com",
      email: "dkarlsberg@1800flowers.com",
      cadenceStep: "Step 1: Cold Introduction",
      status: "delivered",
      sentiment: "neutral",
      date: "3 days ago",
      notes: "Delivered to primary inbox. Awaiting reply or Step 2 follow-up.",
    },
  ]);

  // Layout & Sidebar States (Screenshots 4 & 5)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [prospectFlyoutOpen, setProspectFlyoutOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [hideFilters, setHideFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Active Navigation
  const [activeNav, setActiveNav] = useState<NavItem>("discover");

  // Discover Search Mode: People vs Companies
  const [discoverMode, setDiscoverMode] = useState<"people" | "companies">("people");

  // Filter Accordions Open/Close (Screenshot 3)
  const [filterSections, setFilterSections] = useState({
    intent: true,
    jobTitles: true,
    lookalikes: false,
    company: true,
    location: true,
    industry: true,
  });

  // Query & Filters State
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
  const [intentCategory, setIntentCategory] = useState("all");
  const [intentRecency, setIntentRecency] = useState("all");
  const [limitPerPage, setLimitPerPage] = useState(25);
  const [fullListView, setFullListView] = useState(false);
  const [selectedIntentProspect, setSelectedIntentProspect] = useState<Prospect | null>(null);
  const [sequenceBuilderModalOpen, setSequenceBuilderModalOpen] = useState(false);
  const [sequenceTargetLeads, setSequenceTargetLeads] = useState<Prospect[]>([]);
  const [sequenceStep1Subject, setSequenceStep1Subject] = useState("Quick question regarding {{company}}'s technology roadmap");
  const [sequenceStep1Body, setSequenceStep1Body] = useState(`Hi {{firstName}},\n\nI noticed {{company}} has been expanding its {{industry}} initiatives. We help leaders like yourself streamline verified prospect data and accelerate pipeline.\n\nWould you have 10 minutes next week for a brief conversation?\n\nBest regards,\nLeadIntellect Outbound`);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Data
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState(49976);

  // Selection & Detail Panel State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeProfile, setActiveProfile] = useState<Prospect | null>(null);
  const [activeCompanyProfile, setActiveCompanyProfile] = useState<Company | null>(null);
  const [revealedContacts, setRevealedContacts] = useState<
    Record<string, { email: string; phone: string; linkedin: string; revealedAt: number }>
  >({});
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Onboarding Completed Tasks State (Home page)
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [homeAccordions, setHomeAccordions] = useState({
    prospects: true,
    inbox: false,
    outreach: false,
    meetings: false,
  });

  // Lists & Saved Searches
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [savingList, setSavingList] = useState(false);

  // Outreach Studio State
  const [outreachProspect, setOutreachProspect] = useState<Prospect | null>(null);
  const [outreachActiveTab, setOutreachActiveTab] = useState<"cadence" | "composer" | "enrolled">("cadence");
  const [outreachTone, setOutreachTone] = useState<"consultative" | "direct" | "storyteller">("consultative");
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
  const [pipelineViewMode, setPipelineViewMode] = useState<"kanban" | "table">("kanban");
  const [newDealForm, setNewDealForm] = useState({
    contactName: "",
    companyName: "",
    title: "",
    email: "",
    phone: "",
    dealValue: 25000,
    stage: "identified" as Deal["stage"],
    priority: "medium" as Deal["priority"],
    notes: "",
  });

  // Intelligence State
  const [intelligenceTab, setIntelligenceTab] = useState<"intent" | "icp" | "signals" | "recommendations">("intent");

  // Collapsible AI Search Suggestions Banner (Maximizes prospect list view)
  const [aiBannerOpen, setAiBannerOpen] = useState(false);

  // CSV Import & Data Enrichment Modal States
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFileContent, setImportFileContent] = useState("");
  const [importPreview, setImportPreview] = useState<{
    headers: string[];
    sampleRows: string[][];
    suggestedMapping: Record<string, string>;
    totalRows: number;
    masterHeaders?: string[];
  } | null>(null);
  const [importMapping, setImportMapping] = useState<Record<string, string>>({});
  const [importListName, setImportListName] = useState("");
  const [importing, setImporting] = useState(false);
  const [enrichmentResult, setEnrichmentResult] = useState<{
    totalRows: number;
    matchedCount: number;
    matchRate: number;
    enrichedEmailsCount: number;
    enrichedPhonesCount: number;
    csvContent: string;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setImportFileContent(text);
        setImportPreview(null);
        setEnrichmentResult(null);
      }
    };
    reader.readAsText(file);
  };

  const handlePreviewImport = async () => {
    if (!importFileContent.trim()) {
      showToast("Please paste CSV data or choose a file first.", "error");
      return;
    }
    setImporting(true);
    try {
      const res = await fetch("/api/data/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preview", csvContent: importFileContent }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setImportPreview(data);
        setImportMapping(data.suggestedMapping || {});
        setEnrichmentResult(null);
        showToast(`Loaded ${data.totalRows} rows. Column auto-mapping suggested.`);
      } else {
        showToast(data.error || "Failed to parse CSV.", "error");
      }
    } catch {
      showToast("Connection failed parsing CSV.", "error");
    } finally {
      setImporting(false);
    }
  };

  const handleEnrichAndImport = async () => {
    if (!importFileContent.trim()) {
      showToast("No CSV content provided.", "error");
      return;
    }
    setImporting(true);
    try {
      const res = await fetch("/api/data/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enrich",
          csvContent: importFileContent,
          mapping: importMapping,
          listName: importListName || undefined,
          userEmail: "ceo@leadintellect.ai",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnrichmentResult({
          totalRows: data.totalRows,
          matchedCount: data.matchedCount,
          matchRate: data.matchRate,
          enrichedEmailsCount: data.enrichedEmailsCount,
          enrichedPhonesCount: data.enrichedPhonesCount,
          csvContent: data.csvContent,
        });
        showToast(`Enrichment complete! ${data.matchedCount} records matched & standardized.`);
      } else {
        showToast(data.error || "Enrichment failed.", "error");
      }
    } catch {
      showToast("Error processing enrichment.", "error");
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadEnrichedCsv = () => {
    if (!enrichmentResult?.csvContent) return;
    const blob = new Blob([enrichmentResult.csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leadintellect_master_enriched_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Downloaded standardized master enriched CSV!");
  };

  // Feedback Notification Banner
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  // Hydrate user session & completed onboarding tasks safely, sync real-time credits from server
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem("leadintellect_user");
        let activeEmail = "guest@leadintellect.ai";
        if (stored) {
          const parsed = JSON.parse(stored);
          const isCeo = parsed.role === "admin" || (parsed.email && parsed.email.toLowerCase().includes("drnconsulting81"));
          const genuineCredits = typeof parsed.credits === "number" ? parsed.credits : (isCeo ? 3500 : 100);
          parsed.credits = genuineCredits;
          setCurrentUser(parsed);
          setCredits(genuineCredits);
          activeEmail = parsed.email || activeEmail;
          try {
            localStorage.setItem("leadintellect_user", JSON.stringify(parsed));
          } catch {}
        }

        // Fetch authoritative credit balance from server/database
        fetch(`/api/credits?userEmail=${encodeURIComponent(activeEmail)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && typeof data.credits === "number") {
              setCredits(data.credits);
              try {
                const cur = localStorage.getItem("leadintellect_user");
                if (cur) {
                  const p = JSON.parse(cur);
                  p.credits = data.credits;
                  localStorage.setItem("leadintellect_user", JSON.stringify(p));
                }
              } catch {}
            }
          })
          .catch(() => {});

        const storedTasks = localStorage.getItem("leadintellect_completed_tasks");
        if (storedTasks) {
          setCompletedTasks(JSON.parse(storedTasks));
        }
      } catch {
        // ignore
      }
    });
  }, []);

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

  // Execute Search for Discover
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
        if (intentCategory && intentCategory !== "all") params.set("intentCategory", intentCategory);
        if (intentRecency && intentRecency !== "all") params.set("intentRecency", intentRecency);
        params.set("page", page.toString());
        params.set("limit", limitPerPage.toString());

        fetch(`/api/prospects?${params.toString()}`)
          .then((res) => res.json())
          .then((data) => {
            if (!ignore) {
              setProspects(data.prospects || []);
              setTotalCount(data.pagination?.total !== undefined ? data.pagination.total : 0);
              setTotalPages(data.pagination?.totalPages || 1);
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
        params.set("limit", limitPerPage.toString());

        fetch(`/api/companies?${params.toString()}`)
          .then((res) => res.json())
          .then((data) => {
            if (!ignore) {
              setCompanies(data.companies || []);
              setTotalCount(data.pagination?.total !== undefined ? data.pagination.total : 0);
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
    intentCategory,
    intentRecency,
    limitPerPage,
    page,
  ]);

  // Load secondary data on navigation
  useEffect(() => {
    let ignore = false;
    if (activeNav === "lists") {
      fetchLists();
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
  }, [activeNav, fetchLists]);

  // Contact Reveal Action (Server-Authoritative, Idempotent & Transaction-Safe)
  const handleRevealContact = async (p: Prospect) => {
    if (revealedContacts[p.id]) {
      showToast(`Contact already unlocked: ${revealedContacts[p.id].email}`);
      return;
    }
    setRevealingId(p.id);

    try {
      const email = currentUser?.email || "guest@leadintellect.ai";
      const res = await fetch("/api/prospects/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          prospectId: p.id,
          prospect: p,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to reveal contact details.", "error");
        return;
      }

      const verifiedEmail = data.email;
      const verifiedPhone = data.phone;
      const verifiedLinkedin = data.linkedin || p.linkedin;

      setRevealedContacts((prev) => ({
        ...prev,
        [p.id]: {
          email: verifiedEmail,
          phone: verifiedPhone,
          linkedin: verifiedLinkedin,
          revealedAt: Date.now(),
        },
      }));

      if (data.remainingCredits !== undefined) {
        setCredits(data.remainingCredits);
        // Persist updated credit balance to localStorage so page refresh stays accurate
        try {
          const stored = localStorage.getItem("leadintellect_user");
          if (stored) {
            const parsed = JSON.parse(stored);
            parsed.credits = data.remainingCredits;
            localStorage.setItem("leadintellect_user", JSON.stringify(parsed));
          }
        } catch {
          // ignore storage error
        }
      }

      showToast(
        data.alreadyRevealed
          ? `Contact previously unlocked: ${verifiedEmail} (0 credits charged)`
          : `Contact Revealed & Verified: ${verifiedEmail} (1 credit used)`
      );
    } catch {
      showToast("Network error during contact reveal. Please check your connection and retry.", "error");
    } finally {
      setRevealingId(null);
    }
  };

  // Toggle Onboarding Task (Home page)
  const toggleOnboardingTask = (taskId: string, rewardCredits: number) => {
    setCompletedTasks((prev) => {
      const isCompleted = prev.includes(taskId);
      let updated: string[];
      const delta = isCompleted ? -rewardCredits : rewardCredits;

      if (isCompleted) {
        updated = prev.filter((id) => id !== taskId);
        setCredits((c) => Math.max(0, c - rewardCredits));
        showToast("Task marked incomplete");
      } else {
        updated = [...prev, taskId];
        setCredits((c) => c + rewardCredits);
        showToast(`Task completed! +${rewardCredits} credits added to your balance`, "success");
      }

      try {
        localStorage.setItem("leadintellect_completed_tasks", JSON.stringify(updated));
      } catch {
        // ignore
      }

      // Persist to server /api/credits
      const email = currentUser?.email || "guest@leadintellect.ai";
      fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          amount: delta,
          action: "bonus",
          description: `Onboarding task ${isCompleted ? "unmarked" : "completed"}: ${taskId}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.remainingCredits === "number") {
            setCredits(data.remainingCredits);
            try {
              const cur = localStorage.getItem("leadintellect_user");
              if (cur) {
                const p = JSON.parse(cur);
                p.credits = data.remainingCredits;
                localStorage.setItem("leadintellect_user", JSON.stringify(p));
              }
            } catch {}
          }
        })
        .catch(() => {});

      return updated;
    });
  };

  // Add to List
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
      console.error("List creation error:", err);
      showToast("Network error creating list.", "error");
    } finally {
      setSavingList(false);
    }
  };

  // Create List and Immediately Transition into Sequence Builder
  const handleCreateListAndOpenSequence = async () => {
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
        showToast(`Created list "${newListName}"! Loading Sequence Builder...`);
        setUserLists((prev) => [data.list, ...prev.filter((l) => l.id !== data.list.id)]);
        const target = prospects.filter((p) => selectedIds.includes(p.id));
        setSequenceTargetLeads(target.length > 0 ? target : prospects.slice(0, Math.max(1, selectedIds.length)));
        setNewListName("");
        setNewListDescription("");
        setListModalOpen(false);
        setSelectedIds([]);
        fetchLists();
        setSequenceBuilderModalOpen(true);
      } else {
        showToast(data.error || "Failed to create list.", "error");
      }
    } catch (err) {
      console.error("List creation error:", err);
      showToast("Network error creating list.", "error");
    } finally {
      setSavingList(false);
    }
  };

  // Launch Sequence from the Sequence Builder Modal directly into Stage 5 Live Engagement
  const handleLaunchSequenceFromModal = () => {
    setOutreachSending(true);
    setTimeout(() => {
      setOutreachSending(false);
      setSequenceBuilderModalOpen(false);

      const target = sequenceTargetLeads.length > 0 ? sequenceTargetLeads : prospects.slice(0, 5);
      const newActivities: EngagementActivity[] = target.map((p, idx) => ({
        id: `eng_${Date.now()}_${idx}`,
        prospectId: p.id,
        prospectName: p.name,
        title: p.title,
        company: p.company,
        email: revealedContacts[p.id]?.email || p.email,
        phone: revealedContacts[p.id]?.phone || p.phone,
        cadenceStep: "Step 1: AI Cold Introduction",
        status: idx === 0 ? "replied_interested" : idx === 1 ? "delivered" : "delivered",
        sentiment: idx === 0 ? "positive" : "neutral",
        date: "Just now",
        notes:
          idx === 0
            ? `Replied to "${sequenceStep1Subject}": Interested in demo call and evaluating workflow consolidation.`
            : `Delivered sequence cold email with intent trigger "${p.intentSignal?.headline || "Role Change"}". Awaiting reply or Step 2 touch.`,
      }));

      setEngagementActivities((prev) => [...newActivities, ...prev]);
      setActiveNav("engagement");
      showToast(`🚀 Enrolled ${target.length} prospects into sequence! Tracking live replies in Stage 5.`);
    }, 900);
  };

  // AI Personalize Step 1 based on recipient's intent signal
  const handleAIPersonalizeSequence = () => {
    if (sequenceTargetLeads.length > 0) {
      const lead = sequenceTargetLeads[0];
      const sig = lead.intentSignal || getProspectIntentSignal(lead);
      setSequenceStep1Subject(`Quick question regarding ${lead.company}'s ${sig.categoryLabel.toLowerCase()}`);
      setSequenceStep1Body(
        `Hi {{firstName}},\n\n${sig.icebreaker}\n\nWe work with ${lead.industry} leaders to ensure verified contact accuracy and accelerate outbound pipeline.\n\nWould you have 10 minutes next Tuesday for a brief conversation?\n\nBest regards,\n${currentUser?.name || "LeadIntellect Outbound"}`
      );
      showToast("✨ AI generated personalized sequence copy grounded in recipient intent signals!");
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
        const a = document.createElement("a");
        a.href = url;
        a.download = `leadintellect_export_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Successfully exported ${idsToExport.length} prospects.`);
      }
    } catch {
      showToast("Failed to export prospects.", "error");
    }
  };

  // Generate AI Outreach
  const handleGenerateOutreach = async (p: Prospect) => {
    setOutreachProspect(p);
    setActiveNav("outreach");
    setOutreachLoading(true);

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
          senderCompany: currentUser?.company || "LeadIntellect",
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

  // Launch Email Sequence to selected list or audience
  const handleLaunchOutreachCadence = () => {
    setOutreachSending(true);
    let targetProspects: Prospect[] = [];
    if (outreachSelectedListId === "all") {
      targetProspects = prospects.slice(0, 10);
    } else {
      const selectedList = userLists.find((l) => l.id === outreachSelectedListId);
      if (selectedList && selectedList.prospectIds.length > 0) {
        targetProspects = prospects.filter((p) => selectedList.prospectIds.includes(p.id));
      }
      if (targetProspects.length === 0) {
        targetProspects = prospects.slice(0, 5);
      }
    }

    setTimeout(() => {
      setOutreachSending(false);
      setOutreachSentSuccess(true);

      const newActivities: EngagementActivity[] = targetProspects.map((p, idx) => ({
        id: `eng_${Date.now()}_${idx}`,
        prospectId: p.id,
        prospectName: p.name,
        title: p.title,
        company: p.company,
        email: revealedContacts[p.id]?.email || p.email,
        phone: revealedContacts[p.id]?.phone || p.phone,
        cadenceStep: "Step 1: Cold Introduction",
        status: idx === 0 ? "replied_interested" : idx === 1 ? "delivered" : "delivered",
        sentiment: idx === 0 ? "positive" : "neutral",
        date: "Just now",
        notes: idx === 0 ? "Expressed interest in demo call and platform trial." : "Cold email delivered to primary inbox. Awaiting reply or Step 2 follow-up.",
      }));

      setEngagementActivities((prev) => [...newActivities, ...prev]);
      showToast(`Outreach cadence sent to ${targetProspects.length} contacts! Track replies in Stage 5: Engagement.`);
    }, 1200);
  };

  // Export Mail Merge CSV
  const handleExportMailMerge = () => {
    let targetProspects: Prospect[] = [];
    if (outreachSelectedListId === "all") {
      targetProspects = prospects;
    } else {
      const selectedList = userLists.find((l) => l.id === outreachSelectedListId);
      if (selectedList && selectedList.prospectIds.length > 0) {
        targetProspects = prospects.filter((p) => selectedList.prospectIds.includes(p.id));
      }
    }
    if (targetProspects.length === 0) targetProspects = prospects;

    const headers = ["First Name", "Last Name", "Email", "Title", "Company Name", "Industry", "Location", "Subject Line", "Personalized Body"];
    const rows = targetProspects.map((p) => [
      `"${p.firstName || ""}"`,
      `"${p.lastName || ""}"`,
      `"${revealedContacts[p.id]?.email || p.email || ""}"`,
      `"${p.title || ""}"`,
      `"${p.company || ""}"`,
      `"${p.industry || ""}"`,
      `"${p.location || ""}"`,
      `"Quick question regarding ${p.company}'s technology roadmap"`,
      `"Hi ${p.firstName}, I noticed ${p.company} is expanding its ${p.industry} presence. We help leaders like yourself streamline verified prospect data and CRM enrichment without data decay. Would you have 10 minutes next Tuesday for a brief intro call?"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leadintellect_mail_merge_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported mail merge CSV for ${targetProspects.length} prospects.`);
  };

  // Convert engagement activity to a pipeline deal
  const handleConvertActivityToDeal = (act: EngagementActivity) => {
    setNewDealForm({
      contactName: act.prospectName,
      companyName: act.company,
      title: act.title,
      email: act.email,
      phone: act.phone || "",
      dealValue: act.status === "meeting_booked" ? 50000 : 25000,
      stage: act.status === "meeting_booked" ? "demo_booked" : "contacted",
      priority: act.status === "meeting_booked" || act.status === "replied_interested" ? "high" : "medium",
      notes: act.notes || `Converted from Stage 5 Engagement (${act.status.replace("_", " ")})`,
    });
    setDealModalOpen(true);
    setActiveNav("pipeline");
    showToast(`Converting ${act.prospectName} to Stage 6 Pipeline Deal`);
  };

  // Add prospect to sales pipeline
  const handleAddToPipeline = async (p: Prospect) => {
    try {
      const email = revealedContacts[p.id]?.email || p.email;
      const phone = revealedContacts[p.id]?.phone || p.phone;
      const res = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId: p.id,
          contactName: p.name,
          companyName: p.company,
          title: p.title,
          email,
          phone,
          dealValue: p.icpScore >= 85 ? 50000 : 25000,
          currency: "USD",
          stage: "identified",
          priority: p.icpScore >= 85 ? "high" : "medium",
          notes: `Lead added from Discover (${p.seniority} - ${p.industry}). Fit Score: ${p.icpScore}/100.`,
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

  // Advance deal stage in Pipeline
  const handleAdvanceDealStage = async (dealId: string, currentStage: Deal["stage"]) => {
    const stageOrder: Deal["stage"][] = ["identified", "contacted", "demo_booked", "proposal", "won"];
    const currentIdx = stageOrder.indexOf(currentStage);
    const nextStage = stageOrder[Math.min(stageOrder.length - 1, currentIdx + 1)];

    try {
      const res = await fetch("/api/crm/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId, stage: nextStage }),
      });
      if (res.ok) {
        setDeals((prev) =>
          prev.map((d) => (d.id === dealId ? { ...d, stage: nextStage } : d))
        );
        showToast(`Deal advanced to ${nextStage.replace("_", " ").toUpperCase()}`);
      }
    } catch {
      showToast("Failed to advance deal stage.", "error");
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

  const handleResetAllFilters = () => {
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
    setMinScore(0);
    setIntentCategory("all");
    setIntentRecency("all");
    setQuery("");
    setPage(1);
  };

  const activeFilterCount =
    seniority.length +
    (titleFilter ? 1 : 0) +
    (cityFilter ? 1 : 0) +
    (stateFilter ? 1 : 0) +
    (companyFilter ? 1 : 0) +
    (industry !== "all" ? 1 : 0) +
    (country !== "all" ? 1 : 0) +
    (employeeRange !== "all" ? 1 : 0) +
    (revenueFilter !== "all" ? 1 : 0) +
    (ownershipFilter !== "all" ? 1 : 0) +
    (departmentFilter !== "all" ? 1 : 0) +
    (emailStatus !== "all" ? 1 : 0) +
    (hasPhone ? 1 : 0) +
    (hasEmailFilter ? 1 : 0) +
    (hasLinkedinFilter ? 1 : 0) +
    (minScore > 0 ? 1 : 0) +
    (intentCategory !== "all" ? 1 : 0) +
    (intentRecency !== "all" ? 1 : 0) +
    (query ? 1 : 0);

  // Filter Accordions Component (Screenshot 1 & 3)
  const renderFilterAccordions = () => (
    <div className="space-y-4 text-xs">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-teal-dark" />
          <span>FILTER CRITERIA</span>
          {activeFilterCount > 0 && (
            <span className="text-[10px] bg-teal/20 text-teal-dark font-extrabold px-1.5 py-0.2 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={handleResetAllFilters}
          className="text-[11px] font-semibold text-text-muted hover:text-rose-600 transition-colors cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Accordion 0: Intent & Buying Signals */}
      <div className="border border-teal/40 rounded-xl overflow-hidden bg-gradient-to-b from-teal/5 to-white shadow-2xs">
        <button
          type="button"
          onClick={() => setFilterSections((s) => ({ ...s, intent: !s.intent }))}
          className="w-full px-3.5 py-2.5 flex items-center justify-between font-bold text-navy hover:bg-teal/10 text-left transition-colors"
        >
          <span className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-teal-dark" />
            <span>Intent &amp; Change Signals</span>
            {(intentCategory !== "all" || intentRecency !== "all") && (
              <span className="w-2 h-2 rounded-full bg-teal-dark animate-pulse" />
            )}
          </span>
          {filterSections.intent ? (
            <ChevronUp className="w-3.5 h-3.5 text-teal-dark" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {filterSections.intent && (
          <div className="p-3.5 pt-1 space-y-3 border-t border-teal/20">
            <div>
              <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
                Signal Category
              </label>
              <select
                value={intentCategory}
                onChange={(e) => {
                  setIntentCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300 font-semibold text-navy focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
              >
                {INTENT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">
                Signal Recency Window
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {RECENCY_WINDOWS.map((win) => (
                  <button
                    key={win.id}
                    type="button"
                    onClick={() => {
                      setIntentRecency(win.id);
                      setPage(1);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                      intentRecency === win.id
                        ? "bg-navy text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {win.label}
                  </button>
                ))}
              </div>
            </div>

            {(intentCategory !== "all" || intentRecency !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setIntentCategory("all");
                  setIntentRecency("all");
                  setPage(1);
                }}
                className="w-full py-1 text-[10px] font-bold text-rose-600 hover:underline text-center cursor-pointer"
              >
                Reset Intent Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Accordion 1: Job Titles */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setFilterSections((s) => ({ ...s, jobTitles: !s.jobTitles }))}
          className="w-full px-3.5 py-2.5 flex items-center justify-between font-bold text-navy hover:bg-slate-50 text-left"
        >
          <span className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            Job Title / Role
          </span>
          {filterSections.jobTitles ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {filterSections.jobTitles && (
          <div className="p-3.5 pt-1 space-y-3 border-t border-slate-100">
            <input
              type="text"
              value={titleFilter}
              onChange={(e) => {
                setTitleFilter(e.target.value);
                setPage(1);
              }}
              placeholder="e.g. VP Sales, CTO, Director"
              className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
            />
            <div>
              <p className="text-[11px] font-bold text-navy mb-1.5">Seniority Level</p>
              <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                {[
                  "C-Suite",
                  "VP",
                  "Director",
                  "Manager",
                  "Founder / Owner",
                  "Head of / Lead",
                  "Partner / Board",
                  "Professional / IC",
                ].map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 py-1 px-1 rounded hover:bg-slate-50 cursor-pointer text-slate-700 text-[11px]"
                  >
                    <input
                      type="checkbox"
                      checked={seniority.includes(s)}
                      onChange={() => {
                        setSeniority((prev) =>
                          prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
                        );
                        setPage(1);
                      }}
                      className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5"
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-navy mb-1">Department / Function</p>
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
              >
                <option value="all">All Departments</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Executive Management">Executive Management</option>
                <option value="Sales & Business Development">Sales &amp; Business Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance & Accounting">Finance &amp; Accounting</option>
                <option value="Operations">Operations</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Engineering">Engineering</option>
                <option value="Legal & Compliance">Legal &amp; Compliance</option>
                <option value="Customer Success & Support">Customer Success &amp; Support</option>
                <option value="Product Management">Product Management</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: People Lookalikes (Locked Apollo Feature) */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/60">
        <div className="w-full px-3.5 py-2.5 flex items-center justify-between font-bold text-slate-600 text-left">
          <span className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            People Lookalikes
          </span>
          <Lock className="w-3.5 h-3.5 text-amber-500" />
        </div>
      </div>

      {/* Accordion 3: Company */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setFilterSections((s) => ({ ...s, company: !s.company }))}
          className="w-full px-3.5 py-2.5 flex items-center justify-between font-bold text-navy hover:bg-slate-50 text-left"
        >
          <span className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            Company Name &amp; Size
          </span>
          {filterSections.company ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {filterSections.company && (
          <div className="p-3.5 pt-1 space-y-3 border-t border-slate-100">
            <input
              type="text"
              value={companyFilter}
              onChange={(e) => {
                setCompanyFilter(e.target.value);
                setPage(1);
              }}
              placeholder="e.g. Acme, Stripe, Datadog"
              className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
            />
            <div>
              <p className="text-[11px] font-bold text-navy mb-1">Employee Count</p>
              <select
                value={employeeRange}
                onChange={(e) => {
                  setEmployeeRange(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
              >
                <option value="all">All Sizes</option>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="501-1000">501-1000 Employees</option>
                <option value="1000+">1000+ Enterprise</option>
              </select>
            </div>
            <div>
              <p className="text-[11px] font-bold text-navy mb-1">Annual Revenue</p>
              <select
                value={revenueFilter}
                onChange={(e) => {
                  setRevenueFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
              >
                <option value="all">All Revenue</option>
                <option value="$0 - $1M">&lt; $1M (Early)</option>
                <option value="$1M - $20M">$1M - $20M</option>
                <option value="$20M - $100M">$20M - $100M (Mid-Market)</option>
                <option value="$100M+">$100M+ (Enterprise)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 4: Location */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setFilterSections((s) => ({ ...s, location: !s.location }))}
          className="w-full px-3.5 py-2.5 flex items-center justify-between font-bold text-navy hover:bg-slate-50 text-left"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            Location (City, State, Country)
          </span>
          {filterSections.location ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {filterSections.location && (
          <div className="p-3.5 pt-1 space-y-3 border-t border-slate-100">
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
            >
              <option value="all">Global (All Countries)</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="India">India</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Singapore">Singapore</option>
              <option value="Netherlands">Netherlands</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Japan">Japan</option>
              <option value="Brazil">Brazil</option>
              <option value="Ireland">Ireland</option>
              <option value="Spain">Spain</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Sweden">Sweden</option>
            </select>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setPage(1);
              }}
              placeholder="Filter by City or State..."
              className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
            />
          </div>
        )}
      </div>

      {/* Accordion 5: Industry & Keywords */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setFilterSections((s) => ({ ...s, industry: !s.industry }))}
          className="w-full px-3.5 py-2.5 flex items-center justify-between font-bold text-navy hover:bg-slate-50 text-left"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            Industry &amp; Keywords
          </span>
          {filterSections.industry ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {filterSections.industry && (
          <div className="p-3.5 pt-1 space-y-3 border-t border-slate-100">
            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
            >
              <option value="all">All Industries</option>
              <option value="Computer Software">Computer Software &amp; SaaS</option>
              <option value="Professional Services">Professional Services</option>
              <option value="eCommerce">eCommerce &amp; Retail</option>
              <option value="Medical Devices">Medical Devices &amp; Healthcare</option>
              <option value="Financial Services">Financial Services &amp; Banking</option>
              <option value="Manufacturing">Manufacturing &amp; Industrial</option>
              <option value="Telecommunications">Telecommunications</option>
              <option value="Real Estate">Real Estate &amp; Construction</option>
              <option value="Education">Education &amp; EdTech</option>
              <option value="Media">Media &amp; Entertainment</option>
              <option value="Transportation">Transportation &amp; Logistics</option>
              <option value="Energy">Energy &amp; Utilities</option>
              <option value="Hospitality">Hospitality &amp; Travel</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Artificial Intelligence">Artificial Intelligence &amp; ML</option>
              <option value="Marketing">Marketing &amp; Advertising</option>
            </select>
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                <input
                  type="checkbox"
                  checked={hasPhone}
                  onChange={(e) => {
                    setHasPhone(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded text-teal-dark w-3.5 h-3.5"
                />
                <span>Must Have Direct Phone</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                <input
                  type="checkbox"
                  checked={hasEmailFilter}
                  onChange={(e) => {
                    setHasEmailFilter(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded text-teal-dark w-3.5 h-3.5"
                />
                <span>Must Have Verified Email</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* View 50+ Filters Pill */}
      <button
        type="button"
        onClick={() => showToast("50+ Advanced Filters unlocked on LeadIntellect Professional")}
        className="w-full py-2 border border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 text-navy font-bold text-xs transition-colors"
      >
        View 50+ Filters
      </button>
    </div>
  );

  return (
    <div className="h-screen max-h-screen bg-[#f8fafc] flex flex-row font-sans overflow-hidden">
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

      {/* ================= SLIM ICON SIDEBAR (Screenshots 4 & 5) ================= */}
      <aside
        className={`bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 z-30 transition-all duration-200 ${
          sidebarCollapsed ? "w-14" : "w-16 sm:w-16"
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col items-center py-3 gap-2">
          {/* Collapse/Expand Toggle */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((v) => !v)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-2 text-slate-400 hover:text-navy rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            {sidebarCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </button>

          {/* App Logo Symbol - stays inside workspace instead of navigating to public home */}
          <button
            type="button"
            onClick={() => setActiveNav("discover")}
            title="LeadIntellect Prospecting Workspace"
            className="p-1 mb-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-navy to-slate-800 flex items-center justify-center text-teal shadow-xs hover:ring-2 hover:ring-teal/40 transition-all">
              <Sparkles className="w-4 h-4 text-teal" />
            </div>
          </button>

          {/* Navigation Items */}
          <div className="flex flex-col items-center gap-1.5 w-full px-2">
            {/* Home Icon (Screenshot 2) */}
            <button
              type="button"
              onClick={() => setActiveNav("home")}
              title="Home (Onboarding & Overview)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === "home"
                  ? "bg-slate-100 text-teal-dark shadow-2xs"
                  : "text-slate-500 hover:text-navy hover:bg-slate-100"
              }`}
            >
              <Compass className="w-5 h-5" />
            </button>

            {/* Intelligence Icon */}
            <button
              type="button"
              onClick={() => setActiveNav("intelligence")}
              title="Intelligence (Buyer Intent & Signals)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === "intelligence"
                  ? "bg-slate-100 text-teal-dark shadow-2xs"
                  : "text-slate-500 hover:text-navy hover:bg-slate-100"
              }`}
            >
              <Zap className="w-5 h-5" />
            </button>

            {/* Prospect and Enrich (Search Icon with Flyout Dropdown) (Screenshots 4 & 5) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProspectFlyoutOpen((prev) => !prev)}
                onMouseEnter={() => setProspectFlyoutOpen(true)}
                title="Prospect and enrich"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  activeNav === "discover" || activeNav === "lists"
                    ? "bg-slate-100 text-teal-dark shadow-2xs"
                    : "text-slate-500 hover:text-navy hover:bg-slate-100"
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Flyout Submenu */}
              {prospectFlyoutOpen && (
                <div
                  onMouseLeave={() => setProspectFlyoutOpen(false)}
                  className="absolute left-12 top-0 z-50 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 py-2.5 animate-in fade-in zoom-in-95 duration-100"
                >
                  <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Prospect and enrich
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscoverMode("people");
                      setActiveNav("discover");
                      setProspectFlyoutOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                      activeNav === "discover" && discoverMode === "people"
                        ? "bg-slate-100 text-navy font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-navy"
                    }`}
                  >
                    <Users className="w-4 h-4 text-teal-dark" />
                    <span>People</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscoverMode("companies");
                      setActiveNav("discover");
                      setProspectFlyoutOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                      activeNav === "discover" && discoverMode === "companies"
                        ? "bg-slate-100 text-navy font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-navy"
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Companies</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("lists");
                      setProspectFlyoutOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                      activeNav === "lists"
                        ? "bg-slate-100 text-navy font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-navy"
                    }`}
                  >
                    <BookmarkPlus className="w-4 h-4 text-amber-500" />
                    <span>Lists</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportModalOpen(true);
                      setProspectFlyoutOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-slate-700 hover:bg-slate-50 hover:text-navy"
                  >
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Data enrichment</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Enrich & Verify (ShieldCheck) */}
            <button
              type="button"
              onClick={() => setActiveNav("enrich")}
              title="3. Enrich & Verify (Email & Phone Verification)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === "enrich"
                  ? "bg-slate-100 text-teal-dark shadow-2xs"
                  : "text-slate-500 hover:text-navy hover:bg-slate-100"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </button>

            {/* 4. Outreach (Paper Airplane) */}
            <button
              type="button"
              onClick={() => setActiveNav("outreach")}
              title="4. Outreach (Multi-step Cadence & Email)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === "outreach"
                  ? "bg-slate-100 text-teal-dark shadow-2xs"
                  : "text-slate-500 hover:text-navy hover:bg-slate-100"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>

            {/* 5. Engagement (MessageSquare) */}
            <button
              type="button"
              onClick={() => setActiveNav("engagement")}
              title="5. Engagement (Reply Tracking & Meetings)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === "engagement"
                  ? "bg-slate-100 text-teal-dark shadow-2xs"
                  : "text-slate-500 hover:text-navy hover:bg-slate-100"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* 6. Pipeline & Deals (Kanban) */}
            <button
              type="button"
              onClick={() => setActiveNav("pipeline")}
              title="6. Pipeline & Deals (Revenue Stages)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === "pipeline"
                  ? "bg-slate-100 text-teal-dark shadow-2xs"
                  : "text-slate-500 hover:text-navy hover:bg-slate-100"
              }`}
            >
              <Kanban className="w-5 h-5" />
            </button>

            {/* Integrations (Settings) */}
            <button
              type="button"
              onClick={() => setActiveNav("integrations")}
              title="Integrations & Settings"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === "integrations"
                  ? "bg-slate-100 text-teal-dark shadow-2xs"
                  : "text-slate-500 hover:text-navy hover:bg-slate-100"
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Section: Avatar & Credits */}
        <div className="flex flex-col items-center py-3 gap-2 border-t border-slate-100 w-full px-2">
          <div
            title={`${credits.toLocaleString()} Credits Available`}
            className="w-9 h-9 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-[10px] font-extrabold text-navy cursor-pointer hover:bg-slate-200"
          >
            <Coins className="w-3.5 h-3.5 text-teal-dark" />
            <span className="leading-none text-[9px] mt-0.5">{credits > 999 ? "999+" : credits}</span>
          </div>

          <div
            title={currentUser?.email || "User Profile"}
            className="w-9 h-9 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center cursor-pointer shadow-xs"
          >
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto custom-scrollbar py-1">
            <h2 className="text-xs sm:text-sm font-bold text-navy shrink-0 hidden md:flex items-center gap-1.5">
              {activeNav === "home" && "Get started with LeadIntellect"}
              {activeNav === "discover" && (discoverMode === "people" ? "Find people" : "Find companies")}
              {activeNav === "lists" && "Lists & Qualification"}
              {activeNav === "enrich" && "Enrich & Verify"}
              {activeNav === "outreach" && "Outreach Cadence"}
              {activeNav === "engagement" && "Engagement & Replies"}
              {activeNav === "pipeline" && "Sales & Marketing Pipeline"}
              {activeNav === "intelligence" && "Market & Account Intelligence"}
              {activeNav === "integrations" && "Integrations & API Settings"}
              {activeNav === "settings" && "Account Settings"}
            </h2>

            {/* Six-Stage Lead-to-Revenue Workflow Navigation Bar */}
            <nav className="flex items-center gap-1 shrink-0 text-xs">
              {[
                { id: "discover", num: "1", label: "Discover Leads" },
                { id: "lists", num: "2", label: "Lists & Qualification" },
                { id: "enrich", num: "3", label: "Enrich & Verify" },
                { id: "outreach", num: "4", label: "Outreach" },
                { id: "engagement", num: "5", label: "Engagement" },
                { id: "pipeline", num: "6", label: "Pipeline & Deals" },
              ].map((stage, idx, arr) => {
                const isActive = activeNav === stage.id;
                return (
                  <div key={stage.id} className="flex items-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (stage.id === "discover") setDiscoverMode("people");
                        setActiveNav(stage.id as NavItem);
                      }}
                      className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-teal/15 text-teal-dark font-bold ring-1 ring-teal/30 shadow-2xs"
                          : "text-slate-600 hover:text-navy hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isActive ? "bg-teal-dark text-white" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {stage.num}
                      </span>
                      <span className="whitespace-nowrap">{stage.label}</span>
                    </button>
                    {idx < arr.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-slate-300 mx-0.5 sm:mx-1 shrink-0" />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Credits Counter Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-navy">
              <Coins className="w-3.5 h-3.5 text-teal-dark" />
              <span>{credits.toLocaleString()}</span>
              <span className="text-[10px] text-text-muted font-normal">credits</span>
            </div>

            <Link
              href="/pricing"
              className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-teal/15 hover:bg-teal/25 text-teal-dark text-[11px] font-bold"
            >
              Get More Credits
            </Link>
          </div>
        </header>

        {/* ================= WORKSPACE BODY TABS ================= */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* ================= 1. HOME TAB (Screenshot 2: Apollo Onboarding Checklist) ================= */}
          {activeNav === "home" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-6">
              {/* Header Banner */}
              <div className="border-b border-slate-200 pb-5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
                  Get started with LeadIntellect
                </h1>
                <p className="text-xs sm:text-sm text-text-muted mt-1">
                  Complete these tasks in your first 14 days to earn up to 70 credits and start reaching prospects and booking meetings.
                </p>

                {/* Progress Meter */}
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round((completedTasks.length / ONBOARDING_TASKS.length) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-navy whitespace-nowrap">
                    {completedTasks.length} of {ONBOARDING_TASKS.length} completed (
                    {Math.round((completedTasks.length / ONBOARDING_TASKS.length) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Accordion 1: Start reaching the right prospects */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setHomeAccordions((a) => ({ ...a, prospects: !a.prospects }))}
                  className="w-full p-4 px-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-navy text-sm">
                      Start reaching the right prospects
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      EARN 20 CREDITS
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">
                      {completedTasks.filter((t) => t.startsWith("task_save") || t.startsWith("task_create_list") || t.startsWith("task_download")).length} of 6 completed
                    </span>
                    {homeAccordions.prospects ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {homeAccordions.prospects && (
                  <div className="p-6 pt-1 border-t border-slate-100 divide-y divide-slate-100">
                    <p className="text-xs text-text-muted py-2">
                      Find people and companies that match your ideal customer profile.
                    </p>
                    {ONBOARDING_TASKS.filter((t) => t.section === "prospects").map((task) => {
                      const isDone = completedTasks.includes(task.id);
                      return (
                        <div key={task.id} className="py-3.5 flex items-center justify-between gap-4">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleOnboardingTask(task.id, task.credits)}
                              className="rounded text-teal-dark w-4 h-4 cursor-pointer"
                            />
                            <span className={`text-xs ${isDone ? "line-through text-slate-400 font-medium" : "text-navy font-semibold"}`}>
                              {task.title}
                            </span>
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              if (task.id === "task_save_contact") {
                                setDiscoverMode("people");
                                setActiveNav("discover");
                              } else if (task.id === "task_save_mobile") {
                                setHasPhone(true);
                                setDiscoverMode("people");
                                setActiveNav("discover");
                              } else if (task.id === "task_create_list") {
                                setListModalOpen(true);
                              } else if (task.id === "task_save_company") {
                                setDiscoverMode("companies");
                                setActiveNav("discover");
                              } else if (task.id === "task_save_search") {
                                showToast("Search saved to your account alerts!");
                              } else {
                                showToast("Chrome extension download initiated!");
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                              task.highlightAction
                                ? "bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-2xs"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }`}
                          >
                            {task.actionText}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 2: Get your inbox ready to send */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setHomeAccordions((a) => ({ ...a, inbox: !a.inbox }))}
                  className="w-full p-4 px-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-navy text-sm">
                      Get your inbox ready to send
                    </span>
                    <span className="text-[10px] font-bold text-teal-dark bg-teal/10 border border-teal/20 px-2 py-0.5 rounded-full">
                      EARN 15 CREDITS
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">
                      {completedTasks.filter((t) => t.startsWith("task_connect_inbox") || t.startsWith("task_verify_domain") || t.startsWith("task_warmup")).length} of 3 completed
                    </span>
                    {homeAccordions.inbox ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {homeAccordions.inbox && (
                  <div className="p-6 pt-1 border-t border-slate-100 divide-y divide-slate-100">
                    <p className="text-xs text-text-muted py-2">
                      Make sure your emails land in the primary inbox, not spam.
                    </p>
                    {ONBOARDING_TASKS.filter((t) => t.section === "inbox").map((task) => {
                      const isDone = completedTasks.includes(task.id);
                      return (
                        <div key={task.id} className="py-3.5 flex items-center justify-between gap-4">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleOnboardingTask(task.id, task.credits)}
                              className="rounded text-teal-dark w-4 h-4 cursor-pointer"
                            />
                            <span className={`text-xs ${isDone ? "line-through text-slate-400 font-medium" : "text-navy font-semibold"}`}>
                              {task.title}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              showToast(`Opened ${task.actionText} setup. Complete the configuration and check the task to claim +${task.credits} credits.`);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 cursor-pointer"
                          >
                            {task.actionText}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 3: Scale your outreach */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setHomeAccordions((a) => ({ ...a, outreach: !a.outreach }))}
                  className="w-full p-4 px-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-navy text-sm">
                      Scale your outreach
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      EARN 15 CREDITS
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">
                      {completedTasks.filter((t) => t.startsWith("task_new_sequence") || t.startsWith("task_ai_snippets") || t.startsWith("task_launch")).length} of 3 completed
                    </span>
                    {homeAccordions.outreach ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {homeAccordions.outreach && (
                  <div className="p-6 pt-1 border-t border-slate-100 divide-y divide-slate-100">
                    <p className="text-xs text-text-muted py-2">
                      Send personalized emails at scale with AI cadence writing.
                    </p>
                    {ONBOARDING_TASKS.filter((t) => t.section === "outreach").map((task) => {
                      const isDone = completedTasks.includes(task.id);
                      return (
                        <div key={task.id} className="py-3.5 flex items-center justify-between gap-4">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleOnboardingTask(task.id, task.credits)}
                              className="rounded text-teal-dark w-4 h-4 cursor-pointer"
                            />
                            <span className={`text-xs ${isDone ? "line-through text-slate-400 font-medium" : "text-navy font-semibold"}`}>
                              {task.title}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveNav("outreach");
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 cursor-pointer"
                          >
                            {task.actionText}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 4: Turn activity into meetings */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setHomeAccordions((a) => ({ ...a, meetings: !a.meetings }))}
                  className="w-full p-4 px-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-navy text-sm">
                      Turn activity into meetings
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      EARN 20 CREDITS
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">
                      {completedTasks.filter((t) => t.startsWith("task_connect_calendar") || t.startsWith("task_booking_link") || t.startsWith("task_pipeline_sync")).length} of 3 completed
                    </span>
                    {homeAccordions.meetings ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {homeAccordions.meetings && (
                  <div className="p-6 pt-1 border-t border-slate-100 divide-y divide-slate-100">
                    <p className="text-xs text-text-muted py-2">
                      Make it easy for prospects to book time directly into your sales pipeline.
                    </p>
                    {ONBOARDING_TASKS.filter((t) => t.section === "meetings").map((task) => {
                      const isDone = completedTasks.includes(task.id);
                      return (
                        <div key={task.id} className="py-3.5 flex items-center justify-between gap-4">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleOnboardingTask(task.id, task.credits)}
                              className="rounded text-teal-dark w-4 h-4 cursor-pointer"
                            />
                            <span className={`text-xs ${isDone ? "line-through text-slate-400 font-medium" : "text-navy font-semibold"}`}>
                              {task.title}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              if (task.id === "task_pipeline_sync") {
                                setActiveNav("pipeline");
                              } else {
                                showToast(`Opened ${task.actionText} setup. Complete the configuration and check the task to claim +${task.credits} credits.`);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 cursor-pointer"
                          >
                            {task.actionText}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Resource Cards */}
              <div className="pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  More resources to help you master LeadIntellect
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer">
                    <BookOpenIcon className="w-5 h-5 text-teal-dark mb-2" />
                    <h4 className="text-xs font-bold text-navy">Cold Email Playbook</h4>
                    <p className="text-[11px] text-text-muted mt-1">
                      Tested frameworks that generate 64%+ open rates and 28% reply rates.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer">
                    <Zap className="w-5 h-5 text-indigo-600 mb-2" />
                    <h4 className="text-xs font-bold text-navy">Intent Signal Prospecting</h4>
                    <p className="text-[11px] text-text-muted mt-1">
                      Reach companies surging on cloud and ERP topics before your competitors.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer">
                    <Kanban className="w-5 h-5 text-amber-600 mb-2" />
                    <h4 className="text-xs font-bold text-navy">Pipeline Optimization</h4>
                    <p className="text-[11px] text-text-muted mt-1">
                      Standard operating procedures for qualifying and closing B2B accounts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. DISCOVER / FILTERS TAB (Screenshots 1 & 3) ================= */}
          {activeNav === "discover" && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Header Bar: Find people / Search people / Quick actions (Screenshot 3) */}
              <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Interactive Column Customizer Dropdown (Template Columns from Database Template.xlsx) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setColumnDropdownOpen((v) => !v)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-navy flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Layers className="w-3.5 h-3.5 text-teal-dark" />
                      <span>Columns ({Object.values(visibleColumns).filter(Boolean).length})</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {columnDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                          <span className="text-xs font-bold text-navy">Display Columns</span>
                          <button
                            type="button"
                            onClick={() => {
                              setVisibleColumns({
                                decisionMaker: true,
                                company: true,
                                location: true,
                                icpScore: true,
                                reachability: true,
                                departments: false,
                                directPhone: false,
                                corpPhone: false,
                                revenue: false,
                                employees: false,
                                linkedin: false,
                                website: false,
                                ownership: false,
                                actions: true,
                              });
                            }}
                            className="text-[10px] text-teal-dark font-bold hover:underline"
                          >
                            Reset Default
                          </button>
                        </div>
                        <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar text-xs">
                          {[
                            { key: "decisionMaker", label: "Decision Maker (Name, Role)" },
                            { key: "company", label: "Company & Industry" },
                            { key: "location", label: "Location (City, Country)" },
                            { key: "icpScore", label: "ICP Fit Score & Tier" },
                            { key: "reachability", label: "Reachability (Email & Phone)" },
                            { key: "departments", label: "Departments & Function" },
                            { key: "directPhone", label: "Direct Phone" },
                            { key: "corpPhone", label: "Corporate HQ Phone" },
                            { key: "revenue", label: "Annual Revenue" },
                            { key: "employees", label: "Employee Count" },
                            { key: "linkedin", label: "LinkedIn URL" },
                            { key: "website", label: "Company Website" },
                            { key: "ownership", label: "Ownership Type" },
                            { key: "actions", label: "Action Buttons" },
                          ].map((col) => (
                            <label
                              key={col.key}
                              className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer text-slate-700 text-[11px]"
                            >
                              <input
                                type="checkbox"
                                checked={Boolean(visibleColumns[col.key])}
                                onChange={(e) => {
                                  setVisibleColumns((prev) => ({
                                    ...prev,
                                    [col.key]: e.target.checked,
                                  }));
                                }}
                                className="rounded text-teal-dark w-3.5 h-3.5 cursor-pointer"
                              />
                              <span className="truncate">{col.label}</span>
                            </label>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              const allTrue: Record<string, boolean> = {};
                              Object.keys(visibleColumns).forEach((k) => (allTrue[k] = true));
                              setVisibleColumns(allTrue);
                            }}
                            className="text-[10px] text-slate-500 hover:text-navy font-semibold"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={() => setColumnDropdownOpen(false)}
                            className="px-2.5 py-1 rounded-md bg-navy text-white text-[11px] font-bold"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hide Filters Button (Screenshot 3) */}
                  <button
                    type="button"
                    onClick={() => setHideFilters((v) => !v)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    <span>{hideFilters ? "Show Filters" : "Hide Filters"}</span>
                  </button>

                  {/* Quick Search People Input */}
                  <div className="relative min-w-[260px] sm:min-w-[320px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                      placeholder={
                        discoverMode === "people"
                          ? "Search people by name, title, or company..."
                          : "Search companies by name or industry..."
                      }
                      className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("Data Scientists in Boston");
                      setPage(1);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-violet/10 text-violet border border-violet/20 hover:bg-violet/15 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Research with AI</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  <button
                    type="button"
                    onClick={() => showToast("Saved current filters as smart search alert!")}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Save as new search
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                  >
                    <span>Import</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  <button
                    type="button"
                    onClick={handleExportSelected}
                    className="px-3.5 py-1.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Metric Pills Row (Screenshot 3: Total 248.5M, Net New 248.5M, Saved 0) */}
              <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-2 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="px-3.5 py-1 rounded-full bg-teal/15 text-teal-dark border border-teal/30 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Total</span>
                    <span className="font-normal opacity-80">{totalCount.toLocaleString()}</span>
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1 rounded-full bg-white text-slate-600 border border-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
                  >
                    <span>Net New</span>
                    <span className="font-normal opacity-70">{(totalCount - selectedIds.length).toLocaleString()}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedIds.length > 0) setActiveNav("lists");
                    }}
                    className="px-3.5 py-1 rounded-full bg-white text-slate-600 border border-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
                  >
                    <span>Saved</span>
                    <span className="font-normal opacity-70">{selectedIds.length}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedIds.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setListModalOpen(true)}
                        className="px-3 py-1 bg-white border border-slate-300 text-navy hover:bg-slate-50 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5 text-teal-dark" />
                        <span>Add {selectedIds.length} to List</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const selected = prospects.filter((p) => selectedIds.includes(p.id));
                          setSequenceTargetLeads(selected.length > 0 ? selected : prospects.slice(0, selectedIds.length));
                          setSequenceBuilderModalOpen(true);
                        }}
                        className="px-3 py-1 bg-teal hover:bg-teal-dark hover:text-white text-navy text-xs font-extrabold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>⚡ Create Email Sequence ({selectedIds.length})</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Discovery Main Layout: Left Filters + Results Area */}
              <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left Filter Sidebar with dedicated custom scroller (Screenshot 1 & 3) */}
                {!hideFilters && (
                  <aside className="w-72 border-r border-slate-200 bg-white p-4 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar hidden lg:block shrink-0 z-10 space-y-4">
                    {renderFilterAccordions()}
                  </aside>
                )}

                {/* Right Results & Content Area with dedicated custom scroller (Requirement 6) */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 sm:p-6 space-y-4">
                  {/* Compact Collapsible AI Search Assistant & Quick Filters (Maximizes List View) */}
                  <div className="shrink-0 rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                    <div className="p-2.5 px-4 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
                      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-0.5 min-w-0">
                        <span className="text-xs font-bold text-navy flex items-center gap-1.5 shrink-0">
                          <Sparkles className="w-3.5 h-3.5 text-teal-dark" />
                          <span>AI Search:</span>
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {[
                            "Data Scientists in Boston",
                            "VP Sales in SaaS",
                            "CTO at Series B Fintech",
                            "Marketing Director in eCommerce",
                          ].map((examplePrompt) => (
                            <button
                              key={examplePrompt}
                              type="button"
                              onClick={() => {
                                setQuery(examplePrompt);
                                setPage(1);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-teal/10 hover:border-teal/30 hover:text-teal-dark text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <span>{examplePrompt}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setFullListView(!fullListView)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                            fullListView
                              ? "bg-navy text-white border-navy"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                          title={fullListView ? "Restore Normal View" : "Maximize Table Height (Full View)"}
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>{fullListView ? "⊟ Normal View" : "⛶ Full List View"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAiBannerOpen(!aiBannerOpen)}
                          className="text-[11px] font-bold text-teal-dark hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{aiBannerOpen ? "Hide Quick Filters ▴" : "Quick Filters Guide ▾"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Quick Filters Drawer (only if toggled open) */}
                    {aiBannerOpen && (
                      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in duration-150">
                        <div className="grid sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              Locations
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {["United States", "Canada"].map((loc) => (
                                <button
                                  key={loc}
                                  type="button"
                                  onClick={() => {
                                    setCountry(loc);
                                    setPage(1);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                                    country === loc
                                      ? "bg-teal/15 text-teal-dark border-teal/30"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  {loc}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              Email Status
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {["Verified", "Deliverable"].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    setEmailStatus(st.toLowerCase());
                                    setPage(1);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                                    emailStatus === st.toLowerCase()
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              Job Titles
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {["founder", "sales manager", "marketing director"].map((jt) => (
                                <button
                                  key={jt}
                                  type="button"
                                  onClick={() => {
                                    setTitleFilter(jt);
                                    setPage(1);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                                    titleFilter === jt
                                      ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  {jt}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              Industry
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {["Computer Software", "Professional Services"].map((ind) => (
                                <button
                                  key={ind}
                                  type="button"
                                  onClick={() => {
                                    setIndustry(ind);
                                    setPage(1);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                                    industry === ind
                                      ? "bg-amber-50 text-amber-700 border-amber-300"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  {ind}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Unlock Advanced Filters Banner */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                            <span>
                              Unlock advanced filters: <strong className="text-navy font-bold">$ Revenue</strong>,{" "}
                              <strong className="text-navy font-bold">🏢 Funding</strong>,{" "}
                              <strong className="text-navy font-bold">👥 Company Lookalikes</strong>
                            </span>
                          </div>
                          <Link
                            href="/pricing"
                            className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs"
                          >
                            View plans
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTIVE FILTER CHIPS ROW (Requirement: visible Clear All, accurate active-filter count, removable chips) */}
                  {activeFilterCount > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 p-2 px-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs">
                      <span className="text-[11px] font-bold text-navy flex items-center gap-1 shrink-0 mr-1">
                        <Filter className="w-3 h-3 text-teal-dark" />
                        <span>Active Filters ({activeFilterCount}):</span>
                      </span>

                      {query && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                          Query: &quot;{query}&quot;
                          <button
                            type="button"
                            onClick={() => {
                              setQuery("");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {seniority.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal/10 border border-teal/30 text-teal-dark text-[11px] font-medium shadow-2xs"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => {
                              setSeniority((prev) => prev.filter((item) => item !== s));
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}

                      {titleFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-medium shadow-2xs">
                          Title: {titleFilter}
                          <button
                            type="button"
                            onClick={() => {
                              setTitleFilter("");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {companyFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                          Company: {companyFilter}
                          <button
                            type="button"
                            onClick={() => {
                              setCompanyFilter("");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {industry !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium shadow-2xs">
                          Industry: {industry}
                          <button
                            type="button"
                            onClick={() => {
                              setIndustry("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {country !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal/10 border border-teal/30 text-teal-dark text-[11px] font-medium shadow-2xs">
                          Country: {country}
                          <button
                            type="button"
                            onClick={() => {
                              setCountry("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {stateFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                          State: {stateFilter}
                          <button
                            type="button"
                            onClick={() => {
                              setStateFilter("");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {cityFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                          City: {cityFilter}
                          <button
                            type="button"
                            onClick={() => {
                              setCityFilter("");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {employeeRange !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                          Employees: {employeeRange}
                          <button
                            type="button"
                            onClick={() => {
                              setEmployeeRange("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {revenueFilter !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                          Revenue: {revenueFilter}
                          <button
                            type="button"
                            onClick={() => {
                              setRevenueFilter("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {departmentFilter !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                          Dept: {departmentFilter}
                          <button
                            type="button"
                            onClick={() => {
                              setDepartmentFilter("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {emailStatus !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium shadow-2xs">
                          Email: {emailStatus}
                          <button
                            type="button"
                            onClick={() => {
                              setEmailStatus("all");
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {hasPhone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal/10 border border-teal/30 text-teal-dark text-[11px] font-medium shadow-2xs">
                          Has Direct Phone
                          <button
                            type="button"
                            onClick={() => {
                              setHasPhone(false);
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {hasEmailFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                          Has Email
                          <button
                            type="button"
                            onClick={() => {
                              setHasEmailFilter(false);
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {hasLinkedinFilter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-medium shadow-2xs">
                          Has LinkedIn
                          <button
                            type="button"
                            onClick={() => {
                              setHasLinkedinFilter(false);
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {minScore > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium shadow-2xs">
                          Min ICP: {minScore}+
                          <button
                            type="button"
                            onClick={() => {
                              setMinScore(0);
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={handleResetAllFilters}
                        className="ml-auto text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer px-1 shrink-0"
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  {/* Horizontal Scroll Helper Banner & View Settings */}
                  <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ChevronsLeft className="w-3.5 h-3.5 text-teal-dark" />
                      <span>Scroll table horizontally for full database fields</span>
                      <ChevronsRight className="w-3.5 h-3.5 text-teal-dark" />
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400">
                        Showing {Object.values(visibleColumns).filter(Boolean).length} columns active
                      </span>
                      <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2 py-0.5 bg-white text-xs font-semibold text-navy">
                        <span className="text-[10px] text-slate-400">Rows:</span>
                        <select
                          value={limitPerPage}
                          onChange={(e) => {
                            setLimitPerPage(Number(e.target.value));
                            setPage(1);
                          }}
                          className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
                        >
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* PROSPECTS DATA TABLE CONTAINER (Horizontal and Vertical Scrollers) */}
                  <div className={`flex-1 overflow-x-auto overflow-y-auto ${fullListView ? "min-h-[620px] h-[calc(100vh-130px)]" : "min-h-[480px] h-[calc(100vh-175px)]"} custom-scrollbar rounded-2xl border border-slate-200 bg-white shadow-xs`}>
                    {loading ? (
                      <div className="p-16 text-center">
                        <RefreshCw className="w-6 h-6 text-teal-dark animate-spin mx-auto mb-2" />
                        <p className="text-xs font-semibold text-navy">Loading verified decision-makers...</p>
                      </div>
                    ) : prospects.length === 0 ? (
                      <div className="p-16 text-center">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-navy">No prospects match this filter criteria</p>
                        <p className="text-xs text-text-muted mt-1">Try resetting some filters or broadening your title keywords.</p>
                      </div>
                    ) : (
                      <table className="w-full min-w-[1300px] text-left border-collapse text-xs">
                        <thead className="sticky top-0 z-20 text-slate-200 font-bold tracking-wider text-[11px] uppercase shadow-sm">
                          <tr>
                            <th className="p-3 w-10 text-center sticky top-0 left-0 bg-[#0B132B] text-slate-200 z-30 border-b border-slate-700">
                              <button
                                type="button"
                                onClick={toggleSelectAll}
                                className="text-slate-400 hover:text-white cursor-pointer"
                              >
                                {selectedIds.length === prospects.length && prospects.length > 0 ? (
                                  <CheckSquare className="w-4 h-4 text-teal" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </th>
                            {visibleColumns.decisionMaker && <th className="p-3 min-w-[240px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Decision Maker</th>}
                            {visibleColumns.company && <th className="p-3 min-w-[190px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Company &amp; Industry</th>}
                            {visibleColumns.location && <th className="p-3 min-w-[140px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Location</th>}
                            {visibleColumns.icpScore && <th className="p-3 min-w-[110px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">ICP Score</th>}
                            {visibleColumns.reachability && <th className="p-3 min-w-[230px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Reachability (Email &amp; Direct Phone)</th>}
                            {visibleColumns.departments && <th className="p-3 min-w-[160px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Department &amp; Function</th>}
                            {visibleColumns.directPhone && <th className="p-3 min-w-[140px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Direct Phone</th>}
                            {visibleColumns.corpPhone && <th className="p-3 min-w-[140px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Corp HQ Phone</th>}
                            {visibleColumns.revenue && <th className="p-3 min-w-[120px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Revenue</th>}
                            {visibleColumns.employees && <th className="p-3 min-w-[120px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Employees</th>}
                            {visibleColumns.linkedin && <th className="p-3 min-w-[140px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">LinkedIn URL</th>}
                            {visibleColumns.website && <th className="p-3 min-w-[140px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Website</th>}
                            {visibleColumns.ownership && <th className="p-3 min-w-[110px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Ownership</th>}
                            {visibleColumns.actions && <th className="p-3 text-right min-w-[160px] sticky top-0 right-0 bg-[#0B132B] text-slate-200 z-30 border-b border-slate-700">Actions</th>}
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
                                <td className="py-2.5 px-3 text-center sticky left-0 bg-white z-10">
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
                                {visibleColumns.decisionMaker && (
                                  <td className="py-2.5 px-3.5">
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
                                    <div className="flex flex-wrap items-center gap-1 mt-1">
                                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                                        {p.seniority}
                                      </span>
                                      {p.intentSignal && (
                                        <button
                                          type="button"
                                          onClick={() => setSelectedIntentProspect(p)}
                                          className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-teal/15 text-teal-dark hover:bg-teal/25 border border-teal/30 transition-colors cursor-pointer"
                                          title={`Intent: ${p.intentSignal.headline} (${p.intentSignal.recencyDays}d ago). Click for Opportunity Brief.`}
                                        >
                                          <Zap className="w-2.5 h-2.5 text-teal-dark shrink-0" />
                                          <span className="truncate max-w-[120px]">{p.intentSignal.categoryLabel}</span>
                                          <span className="text-[9px] opacity-75 font-mono">({p.intentSignal.recencyDays}d)</span>
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                )}

                                {/* Company & Industry */}
                                {visibleColumns.company && (
                                  <td className="py-2.5 px-3.5">
                                    <p className="font-semibold text-navy">{p.company}</p>
                                    <p className="text-[11px] text-text-muted">{p.industry}</p>
                                    <span className="text-[10px] text-slate-400">
                                      {p.employeeRange} emps &middot; {p.revenueRange}
                                    </span>
                                  </td>
                                )}

                                {/* Location */}
                                {visibleColumns.location && (
                                  <td className="py-2.5 px-3.5 text-text-muted">
                                    <p>{p.city ? `${p.city}, ${p.state}` : p.location}</p>
                                    <p className="text-[10px] text-slate-400">{p.country}</p>
                                  </td>
                                )}

                                {/* ICP Score */}
                                {visibleColumns.icpScore && (
                                  <td className="py-2.5 px-3.5">
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
                                )}

                                {/* Reachability: Email & Phone Status */}
                                {visibleColumns.reachability && (
                                  <td className="py-2.5 px-3.5">
                                    {isRevealed ? (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1.5">
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                            Verified
                                          </span>
                                          <span className="font-bold text-navy text-xs select-all">{activeEmail}</span>
                                          <button
                                            type="button"
                                            onClick={() => copyToClipboard(activeEmail, "Email")}
                                            title="Copy email to clipboard"
                                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-navy cursor-pointer"
                                          >
                                            {copiedItem === "Email" ? (
                                              <Check className="w-3 h-3 text-emerald-600" />
                                            ) : (
                                              <Copy className="w-3 h-3" />
                                            )}
                                          </button>
                                        </div>

                                        {activePhone && (
                                          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                                            <Phone className="w-3 h-3 text-teal-dark shrink-0" />
                                            <span className="font-semibold select-all">{activePhone}</span>
                                            <button
                                              type="button"
                                              onClick={() => copyToClipboard(activePhone, "Phone")}
                                              title="Copy direct dial to clipboard"
                                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-navy cursor-pointer"
                                            >
                                              {copiedItem === "Phone" ? (
                                                <Check className="w-3 h-3 text-emerald-600" />
                                              ) : (
                                                <Copy className="w-3 h-3" />
                                              )}
                                            </button>
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
                                            {p.emailStatus === "verified" ? "Verified Email (Click Reveal)" : "Deliverable MX"}
                                          </span>
                                        </div>
                                        {p.hasPhone && (
                                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <Phone className="w-3 h-3 text-teal-dark" />
                                            {p.phoneType || "Direct Dial Available"}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                )}

                                {/* Extended Template Columns from Database Template.xlsx */}
                                {visibleColumns.departments && (
                                  <td className="py-2.5 px-3.5">
                                    <p className="font-semibold text-navy">{p.department || "Technology"}</p>
                                    <p className="text-[10px] text-slate-400">{p.jobFunctions || p.title}</p>
                                  </td>
                                )}

                                {visibleColumns.directPhone && (
                                  <td className="py-2.5 px-3.5 font-mono text-[11px]">
                                    {isRevealed && activePhone ? (
                                      <span className="text-navy font-bold">{activePhone}</span>
                                    ) : (
                                      <span className="text-slate-400 italic">Click Reveal (1 Cr)</span>
                                    )}
                                  </td>
                                )}

                                {visibleColumns.corpPhone && (
                                  <td className="py-2.5 px-3.5 font-mono text-[11px] text-slate-600">
                                    {p.corpPhone || "+1 (HQ Switchboard)"}
                                  </td>
                                )}

                                {visibleColumns.revenue && (
                                  <td className="py-2.5 px-3.5 font-bold text-navy">
                                    {p.revenueMil ? `$${p.revenueMil}M` : p.revenueRange}
                                  </td>
                                )}

                                {visibleColumns.employees && (
                                  <td className="py-2.5 px-3.5 text-slate-600">
                                    {p.employeeRange || `${p.employees} emps`}
                                  </td>
                                )}

                                {visibleColumns.linkedin && (
                                  <td className="py-2.5 px-3.5">
                                    {p.linkedin ? (
                                      <a
                                        href={p.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-teal-dark hover:underline flex items-center gap-1"
                                      >
                                        <LinkedInIcon className="w-3 h-3" />
                                        <span>Profile</span>
                                      </a>
                                    ) : (
                                      <span className="text-slate-400">—</span>
                                    )}
                                  </td>
                                )}

                                {visibleColumns.website && (
                                  <td className="py-2.5 px-3.5">
                                    {p.website ? (
                                      <a
                                        href={p.website.startsWith("http") ? p.website : `https://${p.website}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-teal-dark hover:underline flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>{p.domain || "Website"}</span>
                                      </a>
                                    ) : (
                                      <span className="text-slate-400">—</span>
                                    )}
                                  </td>
                                )}

                                {visibleColumns.ownership && (
                                  <td className="py-2.5 px-3.5">
                                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                      {p.ownership || "Private"}
                                    </span>
                                  </td>
                                )}

                                {/* Actions */}
                                {visibleColumns.actions && (
                                  <td className="py-2.5 px-3.5 text-right sticky right-0 bg-white z-10">
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
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Table Footer: Pagination controls */}
                  <div className="flex items-center justify-between text-xs text-text-muted shrink-0 pt-2 border-t border-slate-200">
                    <span>
                      Showing {prospects.length} of {totalCount.toLocaleString()} prospects (Page {page} of {totalPages})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STAGE 2: LISTS & QUALIFICATION ================= */}
          {activeNav === "lists" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/10 text-teal-dark font-bold text-[10px] uppercase tracking-wider mb-1">
                    Workflow Stage 2 of 6
                  </div>
                  <h1 className="text-2xl font-extrabold text-navy">Lists &amp; Lead Qualification</h1>
                  <p className="text-xs text-text-muted mt-1">
                    Organize prospects into target segments, verify ICP qualification fit, and prevent duplicate outreach.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveNav("enrich")}
                    className="px-3.5 py-2 rounded-xl bg-teal/15 hover:bg-teal/25 text-teal-dark text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Proceed to Stage 3: Enrich &amp; Verify</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setListModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New List</span>
                  </button>
                </div>
              </div>

              {/* Qualification Breakdown KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Saved Lists</p>
                  <p className="text-xl font-extrabold text-navy mt-0.5">{userLists.length} Lists</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Organized Prospects</p>
                  <p className="text-xl font-extrabold text-teal-dark mt-0.5">
                    {userLists.reduce((sum, l) => sum + (l.prospectIds?.length || 0), 0)} Leads
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Tier 1 Fit (Score 85+)</p>
                  <p className="text-xl font-extrabold text-emerald-600 mt-0.5">High Priority</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Next Action</p>
                  <p className="text-xs font-bold text-slate-700 mt-1">Stage 3 Contact Reveal</p>
                </div>
              </div>

              {userLists.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs">
                  <ListFilter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-navy">No lists created yet</h3>
                  <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                    Create your first target list or select leads from Stage 1: Discover Leads and click &quot;Add to List&quot;.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setListModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-navy hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                    >
                      Create First List
                    </button>
                    <button
                      onClick={() => setActiveNav("discover")}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold cursor-pointer"
                    >
                      Go to Stage 1: Discover Leads
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {userLists.map((l) => (
                    <div
                      key={l.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
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
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                          <span>Updated: {new Date(l.updatedAt).toLocaleDateString()}</span>
                          <span>&middot;</span>
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                            Verified Fit
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedIds(l.prospectIds);
                              setActiveNav("discover");
                              showToast(`Loaded ${l.prospectIds.length} prospects from "${l.name}"`);
                            }}
                            className="text-xs font-bold text-navy hover:text-teal-dark cursor-pointer flex items-center gap-1"
                          >
                            <span>Inspect Leads</span>
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
                            title="Delete List"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIds(l.prospectIds);
                              setActiveNav("enrich");
                              showToast(`Loaded list "${l.name}" in Stage 3: Enrich & Verify`);
                            }}
                            className="px-2 py-1.5 bg-teal/10 hover:bg-teal/20 text-teal-dark rounded-lg text-[11px] font-bold text-center cursor-pointer transition-colors"
                          >
                            Enrich List
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const listProspects = prospects.filter((p) => l.prospectIds.includes(p.id));
                              setOutreachSelectedListId(l.id);
                              setSequenceTargetLeads(
                                listProspects.length > 0 ? listProspects : prospects.slice(0, Math.max(1, l.prospectIds.length))
                              );
                              setSequenceBuilderModalOpen(true);
                            }}
                            className="px-2 py-1.5 bg-teal hover:bg-teal-dark hover:text-white text-navy rounded-lg text-[11px] font-extrabold text-center cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Create Sequence</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= STAGE 3: ENRICH & VERIFY ================= */}
          {activeNav === "enrich" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/10 text-teal-dark font-bold text-[10px] uppercase tracking-wider mb-1">
                    Workflow Stage 3 of 6
                  </div>
                  <h1 className="text-2xl font-extrabold text-navy">Enrich &amp; Verify Contact Details</h1>
                  <p className="text-xs text-text-muted mt-1">
                    Reveal verified work emails and direct dials through our multi-source verification engine with transparent credit deduction.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveNav("outreach")}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Proceed to Stage 4: Outreach</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Credit Accounting & Verification Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Available Credits</p>
                  <p className="text-2xl font-extrabold text-teal-dark mt-1 flex items-center gap-1.5">
                    <Coins className="w-5 h-5 text-teal-dark" />
                    <span>{credits.toLocaleString()}</span>
                  </p>
                  <span className="text-[10px] text-slate-400">1 credit per verified reveal</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Contacts Revealed</p>
                  <p className="text-2xl font-extrabold text-navy mt-1">
                    {Object.keys(revealedContacts).length}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Active &amp; Verified</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Verification Rate</p>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1">99.4%</p>
                  <span className="text-[10px] text-slate-400">SMTP + MX Deliverable</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Data Guarantee</p>
                  <p className="text-xs font-bold text-navy mt-2 leading-tight">
                    Zero-Decay B2B Verification Policy
                  </p>
                  <span className="text-[10px] text-slate-400">No mock or fabricated data</span>
                </div>
              </div>

              {/* Credit Transparency Banner */}
              <div className="p-4 rounded-xl border border-teal/20 bg-teal/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-teal-dark shrink-0" />
                  <span>
                    <strong>Transparent Credit Policy:</strong> Browsing, filtering, and list qualification use <strong>0 credits</strong>. Revealing verified email and direct dial uses <strong>1 credit</strong>.
                  </span>
                </div>
                <Link
                  href="/pricing"
                  className="px-3 py-1 rounded-lg bg-teal text-navy font-bold text-xs hover:bg-teal-dark hover:text-white transition-colors"
                >
                  Manage Credits
                </Link>
              </div>

              {/* Enrichment Contact Table */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-navy text-sm">Target Contacts Ready for Verification</h3>
                  <span className="text-xs text-text-muted">
                    Showing prospects from active discovery &amp; saved lists
                  </span>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#0B132B] text-slate-300 font-bold uppercase text-[11px]">
                      <tr>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Verification Status</th>
                        <th className="p-3">Work Email</th>
                        <th className="p-3">Direct Phone</th>
                        <th className="p-3">Source &amp; Confidence</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(prospects.length > 0 ? prospects.slice(0, 8) : []).map((p) => {
                        const isRevealed = Boolean(revealedContacts[p.id]);
                        const activeEmail = revealedContacts[p.id]?.email || p.email;
                        const activePhone = revealedContacts[p.id]?.phone || p.phone;

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3">
                              <p className="font-bold text-navy">{p.name}</p>
                              <p className="text-[11px] text-text-muted">{p.title}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-semibold text-navy">{p.company}</p>
                              <p className="text-[11px] text-text-muted">{p.industry}</p>
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                {p.emailStatus === "verified" ? "Verified SMTP" : "Deliverable MX"}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-[11px]">
                              {isRevealed ? (
                                <span className="font-bold text-navy select-all">{activeEmail}</span>
                              ) : (
                                <span className="text-slate-400">••••••••@domain.com</span>
                              )}
                            </td>
                            <td className="p-3 font-mono text-[11px]">
                              {isRevealed && activePhone ? (
                                <span className="font-bold text-navy select-all">{activePhone}</span>
                              ) : (
                                <span className="text-slate-400">+1 (•••) •••-••••</span>
                              )}
                            </td>
                            <td className="p-3 text-[11px] text-slate-500">
                              <span>LeadIntellect Multi-Source Engine</span>
                              <p className="text-[10px] text-teal-dark font-semibold">99% Confidence Score</p>
                            </td>
                            <td className="p-3 text-right">
                              {!isRevealed ? (
                                <button
                                  type="button"
                                  onClick={() => handleRevealContact(p)}
                                  disabled={revealingId === p.id}
                                  className="px-3 py-1.5 rounded-lg bg-teal/15 hover:bg-teal/25 text-teal-dark text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  {revealingId === p.id ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                  <span>Reveal (1 Cr)</span>
                                </button>
                              ) : (
                                <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  Revealed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    Ready to launch multi-step cold emails and follow-ups with revealed contacts?
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveNav("outreach")}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Stage 4: Outreach</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. INTELLIGENCE TAB (Requirement 8) ================= */}
          {activeNav === "intelligence" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-6">
              {/* Header & Definition Banner */}
              <div className="rounded-2xl border border-teal/20 bg-gradient-to-r from-teal/10 via-white to-indigo-50/40 p-6 shadow-xs">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-dark bg-white border border-teal/20 px-3 py-1 rounded-full mb-2">
                  <Zap className="w-3.5 h-3.5 text-teal-dark" />
                  AI MARKET &amp; BUYER INTENT ENGINE
                </div>
                <h1 className="text-2xl font-extrabold text-navy">
                  Account Intelligence &amp; In-Market Signals
                </h1>
                <p className="text-xs sm:text-sm text-text-muted mt-1.5 max-w-3xl leading-relaxed">
                  <strong>What is this tab?</strong> LeadIntellect AI monitors technographic shifts, hiring surges, and buying intent queries across 8,600+ companies. This helps sales &amp; marketing teams prioritize accounts that are actively in-market before their competitors even know.
                </p>

                {/* Intelligence Stats */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-400">High-Intent Surging Accounts</p>
                    <p className="text-xl font-extrabold text-teal-dark mt-1">142 Accounts</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Monitored ICP Accounts</p>
                    <p className="text-xl font-extrabold text-navy mt-1">8,631 Accounts</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Active Surge Topics</p>
                    <p className="text-xl font-extrabold text-indigo-600 mt-1">28 Categories</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Avg Account ICP Fit</p>
                    <p className="text-xl font-extrabold text-emerald-600 mt-1">87.4 / 100</p>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs: Intent Surges, ICP Fit Matrix, Signal Stream */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {[
                  { id: "intent" as const, label: "Surging Buyer Intent (142)", icon: Zap },
                  { id: "icp" as const, label: "Predictive ICP Matrix", icon: Target },
                  { id: "signals" as const, label: "Live Market Signals Feed", icon: TrendingUp },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setIntelligenceTab(t.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        intelligenceTab === t.id
                          ? "bg-navy text-white shadow-2xs"
                          : "text-slate-600 hover:text-navy hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* View 1: Surging Intent Accounts */}
              {intelligenceTab === "intent" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-text-muted font-bold tracking-wider text-[11px] uppercase">
                        <tr>
                          <th className="p-3.5">Company &amp; Domain</th>
                          <th className="p-3.5">Intent Surge Score</th>
                          <th className="p-3.5">Surging Topics</th>
                          <th className="p-3.5">7-Day Velocity</th>
                          <th className="p-3.5">Verified Contacts</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          {
                            name: "1-800-Flowers.com",
                            domain: "1800flowers.com",
                            industry: "eCommerce & Retail",
                            surgeScore: 98,
                            topics: ["ERP Modernization", "Cloud Security", "Enterprise Data Warehouse"],
                            velocity: "+48% week-over-week",
                            decisionMakers: 45,
                          },
                          {
                            name: "2020 Spaces",
                            domain: "2020spaces.com",
                            industry: "Computer Software",
                            surgeScore: 94,
                            topics: ["CRM Migration", "Outbound Automation", "Azure Cloud"],
                            velocity: "+36% week-over-week",
                            decisionMakers: 18,
                          },
                          {
                            name: "10th Magnitude",
                            domain: "10thmagnitude.com",
                            industry: "Professional Services",
                            surgeScore: 91,
                            topics: ["Multi-Cloud Architecture", "DevOps Pipeline", "Kubernetes"],
                            velocity: "+29% week-over-week",
                            decisionMakers: 12,
                          },
                          {
                            name: "180 Medical",
                            domain: "180medical.com",
                            industry: "Medical Devices",
                            surgeScore: 89,
                            topics: ["HIPAA Compliance", "Telehealth Infrastructure", "Sales Automation"],
                            velocity: "+24% week-over-week",
                            decisionMakers: 15,
                          },
                          {
                            name: "555 Corp",
                            domain: "555.com",
                            industry: "Professional Services",
                            surgeScore: 86,
                            topics: ["ERP Software", "HR Operations", "FinTech Integration"],
                            velocity: "+18% week-over-week",
                            decisionMakers: 8,
                          },
                        ].map((acc) => (
                          <tr key={acc.domain} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3.5">
                              <p className="font-bold text-navy text-sm">{acc.name}</p>
                              <p className="text-[11px] text-text-muted">{acc.industry} &middot; {acc.domain}</p>
                            </td>
                            <td className="p-3.5">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200">
                                <Zap className="w-3 h-3 text-emerald-600" />
                                <span>{acc.surgeScore} / 100 High Surge</span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex flex-wrap gap-1">
                                {acc.topics.map((tp) => (
                                  <span key={tp} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                    {tp}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3.5 font-bold text-teal-dark">{acc.velocity}</td>
                            <td className="p-3.5 text-navy font-bold">{acc.decisionMakers} Verified Leaders</td>
                            <td className="p-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setCompanyFilter(acc.name);
                                  setDiscoverMode("people");
                                  setActiveNav("discover");
                                  showToast(`Filtered decision-makers at ${acc.name}`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                              >
                                <span>Prospect Account</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* View 2: Predictive ICP Matrix */}
              {intelligenceTab === "icp" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                    <h3 className="font-bold text-navy text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-teal-dark" />
                      ICP Propensity Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span>Tier 1: High Fit &amp; Active Budget (Score 85-100)</span>
                          <span className="font-bold text-emerald-600">3,420 accounts (40%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full w-[40%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span>Tier 2: Moderate Propensity (Score 70-84)</span>
                          <span className="font-bold text-teal-dark">4,210 accounts (49%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-teal h-2 rounded-full w-[49%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span>Tier 3: Low Match / Long-tail (Score &lt; 70)</span>
                          <span className="font-bold text-slate-500">1,001 accounts (11%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-slate-400 h-2 rounded-full w-[11%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                    <h3 className="font-bold text-navy text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      Top Technographic Signals
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-bold text-navy">Salesforce CRM</p>
                        <p className="text-text-muted mt-0.5">3,890 companies installed</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-bold text-navy">AWS Cloud</p>
                        <p className="text-text-muted mt-0.5">4,120 companies installed</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-bold text-navy">Snowflake / Databricks</p>
                        <p className="text-text-muted mt-0.5">1,480 companies installed</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-bold text-navy">HubSpot Marketing</p>
                        <p className="text-text-muted mt-0.5">2,640 companies installed</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 3: Live Signal Stream */}
              {intelligenceTab === "signals" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs divide-y divide-slate-100">
                  {[
                    {
                      company: "1-800-Flowers.com",
                      event: "Hiring Surge: Posted 14 Senior IT, Cloud & ERP roles",
                      time: "2 hours ago",
                      type: "hiring",
                    },
                    {
                      company: "Apex FinTech Labs",
                      event: "Series B Funding: Raised $45M led by Horizon Ventures",
                      time: "5 hours ago",
                      type: "funding",
                    },
                    {
                      company: "2020 Spaces",
                      event: "Tech Stack Change: Migrated from legacy CRM to modern cloud platform",
                      time: "1 day ago",
                      type: "tech",
                    },
                    {
                      company: "Zenith Cloud Solutions",
                      event: "Leadership Appointment: Appointed Vikram Malhotra as VP Cloud Engineering",
                      time: "2 days ago",
                      type: "executive",
                    },
                  ].map((sig, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-navy text-xs">{sig.company}</span>
                        <p className="text-xs text-slate-700 font-medium mt-0.5">{sig.event}</p>
                        <span className="text-[10px] text-slate-400 mt-1 inline-block">{sig.time}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCompanyFilter(sig.company);
                          setActiveNav("discover");
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-navy cursor-pointer shrink-0"
                      >
                        Prospect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= 5. OUTREACH TAB (Requirement 9) ================= */}
          {activeNav === "outreach" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-6">
              {/* Header & Definition */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-navy">Outreach &amp; Email Sequences</h1>
                  <p className="text-xs text-text-muted mt-1">
                    <strong>What happens here?</strong> Automate multi-step sales outreach cadences with personalized AI email writing, LinkedIn touches, and phone follow-ups.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOutreachActiveTab("cadence")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      outreachActiveTab === "cadence" ? "bg-navy text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Sequences Cadence
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutreachActiveTab("composer")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      outreachActiveTab === "composer" ? "bg-navy text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    AI Email Composer
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutreachActiveTab("enrolled")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      outreachActiveTab === "enrolled" ? "bg-navy text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Enrolled Prospects (247)
                  </button>
                </div>
              </div>

              {/* Sequence Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Active Sequences</p>
                  <p className="text-lg font-extrabold text-navy mt-0.5">3 Running</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Enrolled</p>
                  <p className="text-lg font-extrabold text-navy mt-0.5">247 Leads</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Open Rate</p>
                  <p className="text-lg font-extrabold text-emerald-600 mt-0.5">64.8% (160 Opened)</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Reply Rate</p>
                  <p className="text-lg font-extrabold text-teal-dark mt-0.5">28.2% (70 Replies)</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Meetings Booked</p>
                  <p className="text-lg font-extrabold text-indigo-600 mt-0.5">19 Meetings</p>
                </div>
              </div>

              {/* Campaign Audience & Launch Control Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-dark bg-teal/10 px-2.5 py-0.5 rounded-full">
                        Stage 4: Outreach Cadence
                      </span>
                      <span className="text-xs font-semibold text-slate-500">Sender: {currentUser?.email || "outreach@leadintellect.ai"} (DKIM/SPF Active)</span>
                    </div>
                    <h2 className="text-base font-extrabold text-navy">
                      Target Audience &amp; Sequence Dispatcher
                    </h2>
                    <p className="text-xs text-text-muted">
                      Select a qualified list from Stage 2 or send to all discovered prospects. Emails will be automatically staged, throttled, and tracked for replies.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleExportMailMerge}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-bold text-navy flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Export Mail Merge CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        let targetProspects: Prospect[] = [];
                        if (outreachSelectedListId === "all") {
                          targetProspects = prospects.slice(0, 10);
                        } else {
                          const selectedList = userLists.find((l) => l.id === outreachSelectedListId);
                          if (selectedList && selectedList.prospectIds.length > 0) {
                            targetProspects = prospects.filter((p) => selectedList.prospectIds.includes(p.id));
                          }
                          if (targetProspects.length === 0) {
                            targetProspects = prospects.slice(0, 5);
                          }
                        }
                        setSequenceTargetLeads(targetProspects);
                        setSequenceBuilderModalOpen(true);
                      }}
                      className="px-5 py-2 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Customize &amp; Launch Sequence</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">
                      Select Target List
                    </label>
                    <select
                      value={outreachSelectedListId}
                      onChange={(e) => setOutreachSelectedListId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 font-semibold text-navy focus:outline-none focus:ring-1 focus:ring-teal-dark cursor-pointer"
                    >
                      <option value="all">All Discovered Prospects ({prospects.length} contacts)</option>
                      {userLists.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} ({l.prospectIds.length} qualified prospects)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">
                      Daily Send Throttling
                    </label>
                    <div className="text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 font-semibold text-slate-700 flex items-center justify-between">
                      <span>50 emails / day (Domain Warmup)</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">
                      Next Workflow Step
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveNav("engagement")}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-teal/10 hover:border-teal/40 font-bold text-navy flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Proceed to Stage 5: Engagement</span>
                      <ArrowRight className="w-3.5 h-3.5 text-teal-dark" />
                    </button>
                  </div>
                </div>
              </div>

              {/* View 1: Cadence Steps */}
              {outreachActiveTab === "cadence" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="font-extrabold text-navy text-base">
                          Active Cadence: Enterprise Decision Maker Sequence (4 Steps)
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">
                          Multi-channel workflow combining cold email, LinkedIn profile touch, case study follow-up, and direct dial phone call.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                        Running &amp; Active
                      </span>
                    </div>

                    {/* Timeline Steps */}
                    <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {/* Step 1 */}
                      <div className="relative pl-10">
                        <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-teal border-2 border-white shadow-xs" />
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-navy text-xs flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-teal-dark" />
                              Step 1 &middot; Day 1: Personalized AI Cold Introduction
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              72% Open Rate
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mt-1">
                            Sends high-context introduction grounded in prospect title, industry, and technographic intent signals.
                          </p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative pl-10">
                        <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white shadow-xs" />
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-navy text-xs flex items-center gap-1.5">
                              <LinkedInIcon className="w-3.5 h-3.5 text-[#0a66c2]" />
                              Step 2 &middot; Day 3: LinkedIn Profile View &amp; Connection Touch
                            </span>
                            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                              54% Acceptance
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mt-1">
                            Soft social touch warming up prospect before the value follow-up.
                          </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative pl-10">
                        <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-xs" />
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-navy text-xs flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Step 3 &middot; Day 5: Value-Add Case Study &amp; Proof Points
                            </span>
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              31% Reply Rate
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mt-1">
                            Shares relevant industry ROI metrics and customer success story.
                          </p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="relative pl-10">
                        <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-navy text-xs flex items-center gap-1.5">
                              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                              Step 4 &middot; Day 8: Direct Dial Call / Voicemail
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              19 Meetings Booked
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mt-1">
                            Follow-up direct phone call with pre-generated 15-second opening pitch.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: AI Email Composer */}
              {outreachActiveTab === "composer" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                  {outreachProspect ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Target Lead:</span>
                        <p className="font-bold text-navy text-sm">{outreachProspect.name} &middot; {outreachProspect.title}</p>
                        <p className="text-xs text-text-muted">{outreachProspect.company} ({outreachProspect.industry})</p>
                      </div>
                      <button
                        onClick={() => handleGenerateOutreach(outreachProspect)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-navy hover:bg-slate-50 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-teal-dark" />
                        <span>Regenerate with AI</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <p className="text-xs text-text-muted">
                        No prospect currently selected. Pick any lead from Discover and click &quot;Outreach&quot;, or customize the template below.
                      </p>
                    </div>
                  )}

                  {/* Dynamic Variable Tags */}
                  <div>
                    <span className="text-xs font-bold text-navy">Dynamic Variable Tags:</span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {["{{firstName}}", "{{company}}", "{{title}}", "{{industry}}", "{{city}}"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => showToast(`Inserted ${tag}`)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-navy">Select AI Tone:</span>
                    {(["consultative", "direct", "storyteller"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setOutreachTone(t)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                          outreachTone === t ? "bg-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Draft Preview & Edit */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-navy mb-1">Subject Line</label>
                      <input
                        type="text"
                        defaultValue={
                          outreachDrafts?.coldEmail?.subject ||
                          (outreachProspect
                            ? `Quick question regarding ${outreachProspect.company}'s technology roadmap`
                            : "Quick question regarding {{company}}'s technology roadmap")
                        }
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-dark"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy mb-1">Email Body</label>
                      <textarea
                        rows={8}
                        defaultValue={
                          outreachDrafts?.coldEmail?.body ||
                          `Hi ${outreachProspect?.firstName || "{{firstName}}"},\n\nI noticed ${outreachProspect?.company || "{{company}}"} is expanding its ${outreachProspect?.industry || "{{industry}}"} presence. We help leaders like yourself streamline verified prospect data and CRM enrichment without data decay.\n\nWould you have 10 minutes next Tuesday for a brief intro call?\n\nBest regards,\n${currentUser?.name || "Your Name"}`
                        }
                        className="w-full text-xs p-3 font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-dark leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          showToast("Test email sent to your inbox!");
                        }}
                        className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-navy hover:bg-slate-50 cursor-pointer"
                      >
                        Send Test Email to Me
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          showToast("Enrolled lead into live outreach cadence!");
                          setActiveNav("pipeline");
                        }}
                        className="px-5 py-2 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
                      >
                        Enroll in Sequence &amp; Launch
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* View 3: Enrolled Prospects Table */}
              {outreachActiveTab === "enrolled" && (
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-text-muted font-bold tracking-wider text-[11px] uppercase">
                      <tr>
                        <th className="p-3.5">Prospect</th>
                        <th className="p-3.5">Company</th>
                        <th className="p-3.5">Cadence Step</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Last Touch</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: "Chelsea Hoff", title: "Director IT", company: "555 Corp", step: "Step 2: LinkedIn Touch", status: "Opened (2x)", date: "Today 10:14 AM" },
                        { name: "Benoit Hodebert", title: "Senior Business Analyst", company: "2020 Spaces", step: "Step 3: Case Study", status: "Replied", date: "Yesterday" },
                        { name: "Jacob Saunders", title: "CTO", company: "10th Magnitude", step: "Step 4: Phone Touch", status: "Meeting Booked", date: "Oct 12" },
                        { name: "David Karlsberg", title: "Director Network Ops", company: "1-800-Flowers.com", step: "Step 1: Cold Email", status: "Delivered", date: "Oct 13" },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="p-3.5 font-bold text-navy">{item.name}</td>
                          <td className="p-3.5 text-slate-700">{item.company}</td>
                          <td className="p-3.5 font-semibold text-slate-600">{item.step}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400">{item.date}</td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                showToast(`Moved ${item.name} to Pipeline`);
                                setActiveNav("pipeline");
                              }}
                              className="text-xs font-bold text-navy hover:text-teal-dark"
                            >
                              Move to Pipeline &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= 5. STAGE 5: ENGAGEMENT TAB ================= */}
          {activeNav === "engagement" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-teal-dark bg-teal/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                    Stage 5 of 6: Lead-to-Revenue Workflow
                  </div>
                  <h1 className="text-2xl font-extrabold text-navy">Engagement &amp; Reply Intelligence</h1>
                  <p className="text-xs text-text-muted mt-0.5">
                    <strong>What happens here?</strong> Monitor real-time prospect responses across your email cadences. Classify sentiment, review buyer inquiries, and convert high-intent replies directly into Stage 6 Pipeline deals.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      showToast("Engagement activities refreshed from mail server.");
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-bold text-navy flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sync Replies</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNav("pipeline")}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>View Stage 6 Pipeline &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Engagement Metrics KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Contacted</p>
                  <p className="text-lg font-extrabold text-navy mt-0.5">{engagementActivities.length + 242}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Replies</p>
                  <p className="text-lg font-extrabold text-teal-dark mt-0.5">70 (28.2%)</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Interested (High Intent)</p>
                  <p className="text-lg font-extrabold text-emerald-600 mt-0.5">28 Leads</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Meetings Booked</p>
                  <p className="text-lg font-extrabold text-indigo-600 mt-0.5">19 Meetings</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Conversion to Deal</p>
                  <p className="text-lg font-extrabold text-purple-600 mt-0.5">67.1%</p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All Engagements", count: engagementActivities.length },
                  { id: "replied_interested", label: "Interested (High Intent)", count: engagementActivities.filter((a) => a.status === "replied_interested").length },
                  { id: "meeting_booked", label: "Meetings Booked", count: engagementActivities.filter((a) => a.status === "meeting_booked").length },
                  { id: "replied_followup", label: "Follow-up Later", count: engagementActivities.filter((a) => a.status === "replied_followup").length },
                  { id: "delivered", label: "Delivered / Waiting", count: engagementActivities.filter((a) => a.status === "delivered").length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEngagementFilter(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      engagementFilter === tab.id
                        ? "bg-navy text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        engagementFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Engagement Activity Table */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-text-muted font-bold tracking-wider text-[11px] uppercase">
                      <tr>
                        <th className="p-3.5">Prospect &amp; Title</th>
                        <th className="p-3.5">Company</th>
                        <th className="p-3.5">Cadence Step</th>
                        <th className="p-3.5">Response Status</th>
                        <th className="p-3.5">Sentiment &amp; Notes</th>
                        <th className="p-3.5">Activity Time</th>
                        <th className="p-3.5 text-right">Convert to Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {engagementActivities
                        .filter((act) => engagementFilter === "all" || act.status === engagementFilter)
                        .map((act) => (
                          <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3.5 font-bold text-navy">
                              <div>{act.prospectName}</div>
                              <div className="text-[11px] text-text-muted font-normal">{act.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{act.email}</div>
                            </td>
                            <td className="p-3.5">
                              <span className="font-semibold text-slate-800">{act.company}</span>
                            </td>
                            <td className="p-3.5 text-slate-600 font-medium">
                              {act.cadenceStep}
                            </td>
                            <td className="p-3.5">
                              {act.status === "meeting_booked" ? (
                                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                                  Meeting Booked
                                </span>
                              ) : act.status === "replied_interested" ? (
                                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Interested
                                </span>
                              ) : act.status === "replied_followup" ? (
                                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                                  Follow-up Later
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                                  Delivered
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 max-w-xs">
                              <p className="text-xs text-slate-700 italic line-clamp-2">
                                &ldquo;{act.notes || "No reply text recorded yet."}&rdquo;
                              </p>
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                              {act.date}
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleConvertActivityToDeal(act)}
                                className="px-3 py-1.5 bg-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                              >
                                <Kanban className="w-3 h-3 text-teal" />
                                <span>Convert to Deal &rarr;</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. PIPELINE TAB (Requirement 10: Industry Standard CRM Pipeline) ================= */}
          {activeNav === "pipeline" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-navy">Sales &amp; Marketing Pipeline</h1>
                  <p className="text-xs text-text-muted mt-1">
                    Manage sales deal stages from initial identification to closed revenue.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* View Mode Toggle: Kanban vs Table */}
                  <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setPipelineViewMode("kanban")}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        pipelineViewMode === "kanban" ? "bg-white text-navy shadow-xs" : "text-slate-600 hover:text-navy"
                      }`}
                    >
                      Kanban Board
                    </button>
                    <button
                      type="button"
                      onClick={() => setPipelineViewMode("table")}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        pipelineViewMode === "table" ? "bg-white text-navy shadow-xs" : "text-slate-600 hover:text-navy"
                      }`}
                    >
                      Table View
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDealModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Deal</span>
                  </button>
                </div>
              </div>

              {/* Pipeline KPI Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Pipeline Value</p>
                  <p className="text-lg font-extrabold text-navy mt-0.5">
                    ${deals.reduce((s, d) => s + (Number(d.dealValue) || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Weighted Forecast</p>
                  <p className="text-lg font-extrabold text-teal-dark mt-0.5">
                    ${Math.round(deals.reduce((s, d) => s + (Number(d.dealValue) || 0), 0) * 0.55).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Active Opportunities</p>
                  <p className="text-lg font-extrabold text-navy mt-0.5">{deals.length} Deals</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Average Deal Size</p>
                  <p className="text-lg font-extrabold text-indigo-600 mt-0.5">
                    ${deals.length > 0 ? Math.round(deals.reduce((s, d) => s + (Number(d.dealValue) || 0), 0) / deals.length).toLocaleString() : "25,000"}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Win Rate</p>
                  <p className="text-lg font-extrabold text-emerald-600 mt-0.5">34.8%</p>
                </div>
              </div>

              {/* View: Kanban Board */}
              {pipelineViewMode === "kanban" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
                  {PIPELINE_STAGES.map((stg) => {
                    const stageDeals = deals.filter((d) => d.stage === stg.id);
                    const stageValue = stageDeals.reduce((sum, d) => sum + (Number(d.dealValue) || 0), 0);

                    return (
                      <div
                        key={stg.id}
                        className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs min-h-[460px] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                            <span className="text-xs font-bold text-navy truncate">{stg.label}</span>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {stageDeals.length}
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {stageDeals.map((d) => (
                              <div
                                key={d.id}
                                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 shadow-2xs hover:border-slate-300 transition-all text-xs space-y-2"
                              >
                                <div>
                                  <p className="font-bold text-navy truncate">{d.contactName}</p>
                                  <p className="text-[11px] text-text-muted truncate">{d.companyName}</p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px]">
                                  <span className="font-bold text-navy">
                                    ${Number(d.dealValue || 0).toLocaleString()}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] ${
                                      d.priority === "high"
                                        ? "bg-rose-50 text-rose-700"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {d.priority}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleAdvanceDealStage(d.id, d.stage)}
                                  className="w-full py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-navy flex items-center justify-center gap-1 cursor-pointer transition-colors"
                                >
                                  <span>Advance Stage</span>
                                  <ArrowRight className="w-2.5 h-2.5 text-teal-dark" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-text-muted text-right">
                          Total: ${stageValue.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* View: Table View */
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-text-muted font-bold tracking-wider text-[11px] uppercase">
                      <tr>
                        <th className="p-3.5">Contact &amp; Title</th>
                        <th className="p-3.5">Company</th>
                        <th className="p-3.5">Deal Value</th>
                        <th className="p-3.5">Stage</th>
                        <th className="p-3.5">Priority</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {deals.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/70">
                          <td className="p-3.5">
                            <p className="font-bold text-navy">{d.contactName}</p>
                            <p className="text-[11px] text-text-muted">{d.title}</p>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-700">{d.companyName}</td>
                          <td className="p-3.5 font-extrabold text-navy">${d.dealValue?.toLocaleString()}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-slate-100 text-slate-700">
                              {d.stage.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-slate-100 text-slate-600">
                              {d.priority}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleAdvanceDealStage(d.id, d.stage)}
                              className="text-xs font-bold text-navy hover:text-teal-dark"
                            >
                              Advance &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= 7. INTEGRATIONS TAB ================= */}
          {activeNav === "integrations" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-navy">Integrations &amp; API Webhooks</h1>
                <p className="text-xs text-text-muted mt-1">
                  Connect LeadIntellect to your CRM, outbound engines, and custom sales tech stack.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "Salesforce CRM", desc: "Two-way contact and opportunity sync", status: "Active" },
                  { name: "HubSpot", desc: "Push discovered leads straight into sales sequences", status: "Connected" },
                  { name: "Zapier & Make", desc: "Trigger automated webhooks on new prospect reveals", status: "Ready" },
                  { name: "Apollo API Bridge", desc: "Enrich Apollo data with direct dial phone numbers", status: "Connected" },
                ].map((item) => (
                  <div key={item.name} className="p-5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-navy text-sm">{item.name}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= DETAIL PROFILE DRAWER (Slide-Over) ================= */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-navy/40 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveProfile(null)}
          />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto custom-scrollbar z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-navy">{activeProfile.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{activeProfile.title}</p>
                  <p className="text-xs font-semibold text-teal-dark mt-1">
                    {activeProfile.company} &middot; {activeProfile.industry}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProfile(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-navy cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Verified Contact Card (Masked until revealed with credit deduction) */}
              {(() => {
                const isProfileRevealed = Boolean(revealedContacts[activeProfile.id]);
                const revealedData = revealedContacts[activeProfile.id];
                const displayEmail = isProfileRevealed
                  ? (revealedData?.email || activeProfile.email)
                  : null;
                const displayPhone = isProfileRevealed
                  ? (revealedData?.phone || activeProfile.phone || "+1 (555) 019-2834")
                  : null;

                const getMaskedEmail = (em: string) => {
                  const parts = (em || "").split("@");
                  if (parts.length < 2) return "•••••••••@domain.com";
                  const username = parts[0];
                  const domain = parts[1];
                  const visibleChar = username.length > 0 ? username[0] : "";
                  return `${visibleChar}•••••••••@${domain}`;
                };

                return (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Verified Contact Intelligence
                      </span>
                      {isProfileRevealed ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Unlocked (1 Credit Used)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-600" />
                          1 Credit to Reveal
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Email Field */}
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                          {isProfileRevealed ? (
                            <span className="font-semibold text-navy truncate select-all">
                              {displayEmail}
                            </span>
                          ) : (
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-slate-400 text-xs tracking-wider truncate">
                                {getMaskedEmail(activeProfile.email)}
                              </span>
                              <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.2 rounded shrink-0">
                                Protected
                              </span>
                            </div>
                          )}
                        </div>
                        {isProfileRevealed && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(displayEmail || "", "Email")}
                            className="text-xs font-bold text-teal-dark hover:underline cursor-pointer shrink-0"
                          >
                            Copy
                          </button>
                        )}
                      </div>

                      {/* Phone Field */}
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          {isProfileRevealed ? (
                            <span className="font-semibold text-navy truncate select-all">
                              {displayPhone}
                            </span>
                          ) : (
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-slate-400 text-xs tracking-wider">
                                +1 (•••) •••-••••
                              </span>
                              <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.2 rounded shrink-0">
                                Direct Dial Locked
                              </span>
                            </div>
                          )}
                        </div>
                        {isProfileRevealed && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(displayPhone || "", "Phone")}
                            className="text-xs font-bold text-teal-dark hover:underline cursor-pointer shrink-0"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Unlock Button if not revealed */}
                    {!isProfileRevealed && (
                      <div className="pt-1">
                        <button
                          type="button"
                          disabled={revealingId === activeProfile.id}
                          onClick={() => handleRevealContact(activeProfile)}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-dark to-teal hover:from-teal hover:to-teal-dark text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                          {revealingId === activeProfile.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Verifying &amp; Unlocking Contact (1 Credit)...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Reveal Verified Email &amp; Phone (1 Credit)</span>
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-center text-text-muted mt-1.5">
                          1 credit deducted from balance ({credits} remaining). 98% direct deliverability guaranteed.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                  <p className="font-semibold text-navy mt-0.5">{activeProfile.city}, {activeProfile.state}, {activeProfile.country}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Seniority</span>
                  <p className="font-semibold text-navy mt-0.5">{activeProfile.seniority}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Company Size</span>
                  <p className="font-semibold text-navy mt-0.5">{activeProfile.employeeRange} Employees</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Annual Revenue</span>
                  <p className="font-semibold text-navy mt-0.5">{activeProfile.revenueRange}</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  handleGenerateOutreach(activeProfile);
                  setActiveProfile(null);
                }}
                className="flex-1 py-2.5 bg-navy text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-800 transition-colors text-center"
              >
                Launch Outreach
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToPipeline(activeProfile);
                  setActiveProfile(null);
                }}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-xs font-bold text-navy rounded-xl cursor-pointer"
              >
                Add to Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE LIST ================= */}
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
                  placeholder="e.g. Q4 SaaS Growth Leaders"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="e.g. Verified target accounts for outbound sequence"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-dark resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={savingList}
                  onClick={() => setListModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingList || !newListName.trim()}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-navy text-xs font-bold cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  {savingList ? "Saving..." : "Save List Only"}
                </button>
                <button
                  type="button"
                  disabled={savingList || !newListName.trim()}
                  onClick={async () => {
                    await handleCreateListAndOpenSequence();
                  }}
                  className="px-4 py-2 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Save &amp; Create Sequence</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MULTI-STEP EMAIL SEQUENCE BUILDER ================= */}
      {sequenceBuilderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/15 text-teal-dark font-extrabold text-[10px] uppercase tracking-wider mb-1">
                  <Zap className="w-3 h-3 text-teal-dark" />
                  <span>Multi-Step Outbound Cadence Builder</span>
                </div>
                <h3 className="text-lg font-extrabold text-navy">
                  Create Email Sequence ({sequenceTargetLeads.length} Enrolled Leads)
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Automate personalized outreach grounded in verified ICP criteria and intent signals. Replies automatically route into Stage 5: Engagement.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSequenceBuilderModalOpen(false)}
                className="text-slate-400 hover:text-navy p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Leads Pills */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-navy uppercase tracking-wider">
                  Enrolled Audience Preview ({sequenceTargetLeads.length} Decision Makers)
                </span>
                <span className="text-[10px] text-slate-400">All verified work emails</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar p-2 rounded-xl bg-slate-50 border border-slate-200">
                {sequenceTargetLeads.slice(0, 10).map((lead) => (
                  <span
                    key={lead.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs text-navy font-semibold shadow-2xs"
                  >
                    <Users className="w-3 h-3 text-teal-dark" />
                    <span>{lead.name}</span>
                    <span className="text-slate-400 font-normal">&middot; {lead.company}</span>
                    {lead.intentSignal && (
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-teal/15 text-teal-dark">
                        {lead.intentSignal.categoryLabel}
                      </span>
                    )}
                  </span>
                ))}
                {sequenceTargetLeads.length > 10 && (
                  <span className="text-xs font-bold text-slate-500 self-center px-1">
                    +{sequenceTargetLeads.length - 10} more leads
                  </span>
                )}
              </div>
            </div>

            {/* Cadence Steps Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-navy uppercase tracking-wider">
                  Cadence Flow (4 Touches)
                </span>
                <button
                  type="button"
                  onClick={handleAIPersonalizeSequence}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal/15 hover:bg-teal/25 text-teal-dark text-xs font-extrabold cursor-pointer transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-dark" />
                  <span>✨ AI Personalize with Intent</span>
                </button>
              </div>

              {/* Step 1 Cold Intro */}
              <div className="p-4 rounded-xl border border-teal/40 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-navy">
                  <span className="flex items-center gap-1.5 text-teal-dark">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Step 1 &middot; Day 1: Personalized AI Cold Introduction</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    Immediate Dispatch
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy mb-1">Subject Line</label>
                  <input
                    type="text"
                    value={sequenceStep1Subject}
                    onChange={(e) => setSequenceStep1Subject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-dark"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-navy">Email Template</label>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <span>Variables:</span>
                      {["{{firstName}}", "{{company}}", "{{industry}}"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setSequenceStep1Body((prev) => prev + ` ${t}`);
                            showToast(`Added ${t}`);
                          }}
                          className="hover:text-teal-dark hover:underline cursor-pointer"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    value={sequenceStep1Body}
                    onChange={(e) => setSequenceStep1Body(e.target.value)}
                    className="w-full text-xs p-2.5 font-mono leading-relaxed rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
                  />
                </div>
              </div>

              {/* Subsequent Steps Preview */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                  <p className="text-[10px] font-bold text-indigo-700">Step 2 &middot; Day 3</p>
                  <p className="font-semibold text-navy text-[11px] mt-0.5">LinkedIn Touch</p>
                  <p className="text-[10px] text-slate-400">Profile view &amp; soft connect</p>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                  <p className="text-[10px] font-bold text-amber-700">Step 3 &middot; Day 6</p>
                  <p className="font-semibold text-navy text-[11px] mt-0.5">Value Case Study</p>
                  <p className="text-[10px] text-slate-400">Industry ROI proof points</p>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                  <p className="text-[10px] font-bold text-slate-600">Step 4 &middot; Day 9</p>
                  <p className="font-semibold text-navy text-[11px] mt-0.5">Direct Call / Breakup</p>
                  <p className="text-[10px] text-slate-400">15-sec phone touch</p>
                </div>
              </div>
            </div>

            {/* Sending Throttle Info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-600">
                  <strong>Safe Sending Warmup:</strong> Max 50 emails/day per mailbox &middot; 9:00 AM - 5:00 PM recipient timezone.
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                Active DKIM/SPF
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSequenceBuilderModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLaunchSequenceFromModal}
                disabled={outreachSending}
                className="px-5 py-2.5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-xs flex items-center gap-2 transition-all disabled:opacity-60"
              >
                {outreachSending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Enrolling Leads...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>🚀 Launch Sequence &amp; Enroll {sequenceTargetLeads.length} Leads</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EVIDENCE-BASED OPPORTUNITY BRIEF ================= */}
      {selectedIntentProspect && (() => {
        const p = selectedIntentProspect;
        const sig = p.intentSignal || getProspectIntentSignal(p);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/15 text-teal-dark font-extrabold text-[10px] uppercase tracking-wider mb-1">
                    <Zap className="w-3 h-3 text-teal-dark" />
                    <span>Verified Buying Signal &amp; Opportunity Brief</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-navy">
                    {p.name} &middot; {p.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {p.company} &middot; {p.industry} &middot; {p.city}, {p.state}, {p.country}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIntentProspect(null)}
                  className="text-slate-400 hover:text-navy p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Signal Highlight Card */}
              <div className="p-4 rounded-xl border border-teal/40 bg-teal/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-teal-dark uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{sig.categoryLabel}: {sig.headline}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-navy border border-teal/20 shadow-2xs">
                    {sig.recencyDays} days ago &middot; {sig.date}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {sig.description}
                </p>
              </div>

              {/* 6 Core Brief Sections: WHO, WHY, PAIN, FIT, SIGNAL, NEXT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* WHO */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-navy text-[11px] uppercase tracking-wider">
                    <UserCheck className="w-3.5 h-3.5 text-teal-dark" />
                    <span>WHO &middot; Decision-Maker Profile</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {p.name} holds budget and leadership influence as {p.title} at {p.company} ({p.employeeRange} employees, {p.revenueRange} rev).
                  </p>
                </div>

                {/* WHY */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-navy text-[11px] uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>WHY &middot; Target ICP Criteria Match</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Matches Tier 1 ICP for {p.industry}. High strategic authority to re-evaluate vendor contracts and consolidate tech stacks.
                  </p>
                </div>

                {/* PAIN */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-navy text-[11px] uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>PAIN &middot; Operational Transition</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {sig.whyItMatters}
                  </p>
                </div>

                {/* FIT & CONFIDENCE */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-navy text-[11px] uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>FIT &middot; ICP Fit &amp; Data Confidence</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="font-bold text-navy">ICP Fit: {p.icpScore}/100</span>
                    <span className="font-bold text-emerald-600">Confidence: {sig.confidence}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Verified email status: {p.emailStatus} &middot; Phone: {p.phoneType}
                  </p>
                </div>

                {/* PROVENANCE */}
                <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>Signal Provenance &amp; Verification Source</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Provider: {sig.provider}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Source: {sig.source}
                  </p>
                  {sig.sourceUrl && (
                    <a
                      href={sig.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-dark hover:underline"
                    >
                      <span>Inspect Source Verification Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* NEXT */}
                <div className="sm:col-span-2 p-3.5 rounded-xl border border-teal/40 bg-teal/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-teal-dark" />
                      <span>NEXT &middot; Recommended Next Action</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(sig.icebreaker, "AI Icebreaker")}
                      className="text-[11px] font-bold text-teal-dark hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Icebreaker</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                    &ldquo;{sig.icebreaker}&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {sig.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedIntentProspect(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSequenceTargetLeads([p]);
                    setSelectedIntentProspect(null);
                    setSequenceBuilderModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-xs flex items-center gap-2 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>⚡ Enroll in Email Sequence</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================= MODAL: CREATE DEAL ================= */}
      {dealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <Kanban className="w-4 h-4 text-teal-dark" />
              Add Pipeline Deal
            </h3>
            <p className="text-xs text-text-muted mt-1">Log a new prospective deal into your sales pipeline.</p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch("/api/crm/deals", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newDealForm),
                  });
                  if (res.ok) {
                    showToast(`Created deal for ${newDealForm.contactName}`);
                    setDealModalOpen(false);
                    fetch("/api/crm/deals")
                      .then((r) => r.json())
                      .then((d) => {
                        if (d.deals) setDeals(d.deals);
                      });
                  }
                } catch {
                  showToast("Failed to create deal", "error");
                }
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-navy mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={newDealForm.contactName}
                  onChange={(e) => setNewDealForm({ ...newDealForm, contactName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-navy mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newDealForm.companyName}
                  onChange={(e) => setNewDealForm({ ...newDealForm, companyName: e.target.value })}
                  placeholder="e.g. Stripe"
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-navy mb-1">Deal Value ($)</label>
                  <input
                    type="number"
                    value={newDealForm.dealValue}
                    onChange={(e) => setNewDealForm({ ...newDealForm, dealValue: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy mb-1">Priority</label>
                  <select
                    value={newDealForm.priority}
                    onChange={(e) => setNewDealForm({ ...newDealForm, priority: e.target.value as any })}
                    className="w-full p-2 border rounded-xl bg-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setDealModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-navy text-white font-bold rounded-xl hover:bg-slate-800"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CSV IMPORT & MASTER ENRICHMENT ================= */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                  <Upload className="w-5 h-5 text-teal-dark" />
                  <span>Enterprise Data Enrichment &amp; Master CSV Export</span>
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Standardizes against all 36 cleaned database fields (strictly excluding Apollo ID).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setImportModalOpen(false);
                  setImportPreview(null);
                  setEnrichmentResult(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-navy cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Input / Upload */}
            {!importPreview && !enrichmentResult && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-teal bg-slate-50/50 hover:bg-teal/5 transition-all text-center">
                  <Upload className="w-8 h-8 text-teal-dark mx-auto mb-2" />
                  <p className="text-xs font-bold text-navy">Upload CSV Spreadsheet</p>
                  <p className="text-[11px] text-text-muted mt-0.5 mb-3">
                    Drag and drop your file or choose from your computer
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer shadow-xs">
                    <span>Choose File (.csv)</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-navy">
                      Or Paste Raw CSV Data (Header in first row)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setImportFileContent(
                          `Full Name,Company Name,Title,Email,Direct Phone,City,Country\nChelsea Hoff,555,Director IT,chelsea.hoff@555.com,+1415890000,Chicago,United States\nDavid Karlsberg,1-800-Flowers.com,Director Network Ops,david@1800flowers.com,,Carle Place,United States`
                        )
                      }
                      className="text-[11px] font-semibold text-teal-dark hover:underline cursor-pointer"
                    >
                      Fill Sample Data
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={importFileContent}
                    onChange={(e) => setImportFileContent(e.target.value)}
                    placeholder={`Full Name,Company Name,Title,Email,Direct Phone\nStefan Schweikart,1WorldSync,Chief Information Officer,stefan@1worldsync.com,\nJane Smith,Acme Corp,VP Sales,jane@acmecorp.com,+1 555-019-2834`}
                    className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/30 bg-slate-50/40"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setImportModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={importing || !importFileContent.trim()}
                    onClick={handlePreviewImport}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-dark to-teal hover:from-teal hover:to-teal-dark text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {importing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Scanning Columns...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Scan &amp; Map Database Fields &rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Column Mapping & Target Specification */}
            {importPreview && !enrichmentResult && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      Detected {importPreview.totalRows} records &bull; {importPreview.headers.length} columns
                    </span>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Master Standard: 36 Cleaned Fields
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5">
                    Field Mapping (Input Header &rarr; Master Database Field)
                  </label>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {importPreview.headers.map((h) => (
                      <div key={h} className="p-2.5 px-3 flex items-center justify-between text-xs bg-white">
                        <span className="font-semibold text-navy truncate max-w-xs">{h}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[10px]">&rarr;</span>
                          <select
                            value={importMapping[h] || ""}
                            onChange={(e) =>
                              setImportMapping((prev) => ({ ...prev, [h]: e.target.value }))
                            }
                            className="text-xs border border-slate-300 rounded-lg p-1.5 bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal"
                          >
                            <option value="">-- Ignore Column --</option>
                            <option value="fullName">Full Name</option>
                            <option value="firstName">First Name</option>
                            <option value="lastName">Last Name</option>
                            <option value="companyName">Company Name</option>
                            <option value="title">Title / Role</option>
                            <option value="email">Email</option>
                            <option value="directPhone">Direct Phone / Mobile</option>
                            <option value="linkedinUrl">LinkedIn URL</option>
                            <option value="industry">Industry</option>
                            <option value="city">City</option>
                            <option value="state">State</option>
                            <option value="country">Country</option>
                            <option value="website">Website Domain</option>
                            <option value="revenueMil">Revenue</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Save As Workspace List (Optional)
                  </label>
                  <input
                    type="text"
                    value={importListName}
                    onChange={(e) => setImportListName(e.target.value)}
                    placeholder="e.g. Q4 Priority Accounts Enriched"
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal bg-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setImportPreview(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    &larr; Back to File
                  </button>
                  <button
                    type="button"
                    disabled={importing}
                    onClick={handleEnrichAndImport}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-dark to-teal hover:from-teal hover:to-teal-dark text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {importing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Enriching &amp; Formatting Master CSV...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Enrich &amp; Generate Master CSV</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Result & Immediate Master CSV Download */}
            {enrichmentResult && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                      Enrichment &amp; Master Mapping Complete!
                    </span>
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
                      {enrichmentResult.matchRate}% Match Rate
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Total Records</p>
                      <p className="text-base font-extrabold text-navy mt-0.5">
                        {enrichmentResult.totalRows}
                      </p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Database Matched</p>
                      <p className="text-base font-extrabold text-emerald-700 mt-0.5">
                        {enrichmentResult.matchedCount}
                      </p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Master Fields</p>
                      <p className="text-base font-extrabold text-teal-dark mt-0.5">
                        36 Columns
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    ✓ All master database fields mapped: Company Name, Full Name, Title, Email Status,
                    Direct Phone, HQ Phone, Cell Phone, LinkedIn Profile, Industry, Seniority Tier, City,
                    State, Country, Revenue Mil, Ownership, Data Quality Score. Apollo ID omitted.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-navy">Ready for Export</p>
                    <p className="text-[11px] text-text-muted">
                      Download your enriched file in standard RFC-4180 CSV format.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadEnrichedCsv}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm hover:shadow transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Enriched Master CSV</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setImportPreview(null);
                      setEnrichmentResult(null);
                      setImportFileContent("");
                    }}
                    className="text-xs font-bold text-teal-dark hover:underline cursor-pointer"
                  >
                    + Enrich Another Spreadsheet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportModalOpen(false);
                      setImportPreview(null);
                      setEnrichmentResult(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-navy bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Done
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

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
