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
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  BookmarkPlus,
  RefreshCw,
  Database,
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
  Key,
  Play,
  TrendingUp,
  Zap,
  MessageSquare,
  PhoneCall,
  Award,
  Globe,
  Rocket,
  ChevronsRight,
  Home,
  Crown,
  CreditCard,
  ChevronsLeft,
  ArrowRight,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import Logo from "@/components/Logo";
import { LinkedInIcon } from "@/components/SocialIcons";
import ProductDemoVideoModal from "@/components/ProductDemoVideoModal";
import {
  getProspectIntentSignal,
  INTENT_CATEGORIES,
  RECENCY_WINDOWS,
  WEB_INTENT_PLATFORMS,
  type IntentSignal,
  type WebPlatform,
} from "@/lib/intent";

const ALL_COUNTRIES = [
  "United States", "USA", "United Kingdom", "Canada", "Australia", "Germany", "France", "India",
  "Singapore", "Netherlands", "Sweden", "Switzerland", "Japan", "Israel", "Ireland", "Spain",
  "Italy", "Brazil", "Mexico", "United Arab Emirates", "Saudi Arabia", "South Africa", "New Zealand",
  "Albania", "Angola", "Argentina", "Austria", "Bangladesh", "Belgium", "Bermuda", "Botswana",
  "Chile", "China", "Costa Rica", "Croatia", "Czech Republic", "Denmark", "Egypt", "El Salvador",
  "Finland", "Greece", "Hong Kong", "Hungary", "Indonesia", "Jordan", "Kenya", "Kuwait", "Lebanon",
  "Liechtenstein", "Luxembourg", "Malaysia", "Malta", "Nicaragua", "Norway", "Oman", "Panama",
  "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Serbia",
  "South Korea", "Taiwan", "Thailand", "Turkey", "Ukraine", "Vietnam", "Zimbabwe"
];

const ALL_DEPARTMENTS = [
  "Information Technology",
  "Executive Management",
  "Sales & Business Development",
  "Marketing",
  "Finance & Accounting",
  "Operations",
  "Human Resources",
  "Engineering",
  "Legal & Compliance",
  "Customer Success & Support",
  "Product Management",
];

const ALL_EMPLOYEE_RANGES = [
  { id: "1-10", label: "1-10 Employees" },
  { id: "11-50", label: "11-50 Employees" },
  { id: "51-200", label: "51-200 Employees" },
  { id: "201-500", label: "201-500 Employees" },
  { id: "501-1000", label: "501-1000 Employees" },
  { id: "1000+", label: "1000+ Enterprise" },
];

const ALL_REVENUE_RANGES = [
  { id: "$0 - $1M", label: "< $1M (Early Stage)" },
  { id: "$1M - $20M", label: "$1M - $20M (Growth)" },
  { id: "$20M - $100M", label: "$20M - $100M (Mid-Market)" },
  { id: "$100M+", label: "$100M+ (Enterprise)" },
];

const ALL_INDUSTRIES = [
  "Accounting", "Accounting Services", "Advertising / Marketing", "Advertising Services",
  "Aerospace & Defense", "Agriculture & Farming", "Agriculture & Forestry", "Airlines & Aviation",
  "Alternative Medicine", "Apparel & Fashion", "Architecture & Engineering", "Automotive",
  "Automotive & Mobility", "Aviation and Aerospace Component Manufacturing", "Banking",
  "Banking & Financial Services", "Beverages", "Biotechnology", "Biotechnology & Life Sciences",
  "Broadcast Media", "Building Materials", "Building Materials & Construction",
  "Business Consulting and Services", "Business Supplies & Equipment", "Casinos & Gambling",
  "Chemicals", "Chemicals & Plastics", "Civil Engineering", "Commercial Real Estate",
  "Computer & Network Security", "Computer Hardware", "Computer Hardware & Electronics",
  "Computer Software", "Construction", "Consumer Electronics", "Consumer Goods & Retail",
  "Consumer Services", "Cybersecurity", "Defense & Aerospace", "E-Commerce & Digital Marketplaces",
  "Education & EdTech", "Electrical & Electronic Manufacturing", "Energy, Oil & Gas",
  "Entertainment & Media", "Environmental Services & Cleantech", "Financial Services",
  "Financial Technology (FinTech)", "Food & Beverages Manufacturing", "Food Production",
  "Government Administration", "Healthcare & HealthTech", "Healthcare & Life Sciences",
  "Higher Education", "Hospital & Healthcare", "Hospitality & Leisure", "Human Resources & Recruiting",
  "Industrial Automation & Robotics", "Information Services", "Information Technology & Services",
  "Insurance & InsurTech", "Internet & Web Services", "Investment Management", "Legal & Compliance Services",
  "Logistics & Supply Chain", "Management Consulting", "Manufacturing & Industrial Machinery",
  "Marketing, Advertising & PR", "Mechanical or Industrial Engineering", "Medical Devices & Equipment",
  "Mining & Metals", "Non-Profit & Philanthropy", "Oil & Gas", "Pharmaceuticals",
  "Professional Services", "Public Relations & Communications", "Publishing", "Real Estate & PropTech",
  "Renewable Energy & Solar", "Research & Development", "Retail & Consumer Services", "Robotics & AI",
  "SaaS (Software-as-a-Service)", "Semiconductors & Microelectronics", "Software & Cloud Infrastructure",
  "Staffing & Talent Acquisition", "Technology, Media & Telecom", "Telecommunications & 5G",
  "Transportation, Trucking & Railroad", "Travel & Tourism", "Utilities, Water & Power",
  "Venture Capital & Private Equity", "Warehousing & Distribution", "Wholesale Trade", "Wireless"
];

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
  dataset?: string;
  datasetCategory?: string;
  faxNumber?: string;
  streetAddress?: string;
  intentSignal?: IntentSignal;
  isUnlocked?: boolean;
  isRevealed?: boolean;
  isLocked?: boolean;
  maskedEmail?: string;
  maskedPhone?: string;
}

function isCeoEmail(email?: string): boolean {
  if (!email) return false;
  return [
    "raghud2483@gmail.com",
    "ceo@lead-intellect.com",
    "drnconsulting81@gmail.com",
    "ceo@leadintellect.ai",
  ].includes(email.toLowerCase().trim());
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
  role?: "admin" | "customer" | "user";
  credits?: number;
  plan?: string;
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

// Onboarding Task Definition for Core Prospecting Workflow
interface OnboardingTask {
  id: string;
  section: "discover" | "lists" | "enrich";
  title: string;
  actionText: string;
  credits: number;
  highlightAction?: boolean;
}

const ONBOARDING_TASKS: OnboardingTask[] = [
  // Section 1: Discover Leads (15 credits)
  {
    id: "task_save_contact",
    section: "discover",
    title: "Find and explore decision-makers matching your Ideal Customer Profile",
    actionText: "Find people",
    credits: 5,
    highlightAction: true,
  },
  {
    id: "task_save_company",
    section: "discover",
    title: "Filter target accounts by industry, revenue, and location",
    actionText: "Find companies",
    credits: 5,
  },
  {
    id: "task_save_search",
    section: "discover",
    title: "Save complex ICP filter combinations for quick one-click searches",
    actionText: "Save search",
    credits: 5,
  },

  // Section 2: Lists & Qualification (15 credits)
  {
    id: "task_create_list",
    section: "lists",
    title: "Create custom prospect lists to segment target buyer personas",
    actionText: "Create a list",
    credits: 5,
  },
  {
    id: "task_qualify_leads",
    section: "lists",
    title: "Qualify leads by seniority tier and decision-making authority",
    actionText: "Qualify leads",
    credits: 5,
  },
  {
    id: "task_export_csv",
    section: "lists",
    title: "Download RFC-compliant CSV with complete account intelligence",
    actionText: "Export list",
    credits: 5,
  },

  // Section 3: Enrich & Verify (20 credits)
  {
    id: "task_reveal_email",
    section: "enrich",
    title: "Reveal verified work email address with multi-source MX check",
    actionText: "Reveal email",
    credits: 6,
  },
  {
    id: "task_save_mobile",
    section: "enrich",
    title: "Unlock verified direct dial and corporate board telephone lines",
    actionText: "Find numbers",
    credits: 7,
  },
  {
    id: "task_batch_verify",
    section: "enrich",
    title: "Batch verify contact details across your active list in Stage 3",
    actionText: "Batch verify",
    credits: 7,
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
    role: "customer",
    credits: 10,
  });
  const [credits, setCredits] = useState<number>(10);

  // Customer Unlocked Leads & Credit Gating States
  const [savedLeads, setSavedLeads] = useState<Prospect[]>([]);
  const [loadingSavedLeads, setLoadingSavedLeads] = useState(false);
  const [outOfCreditsModalOpen, setOutOfCreditsModalOpen] = useState(false);
  const [savedLeadsSearch, setSavedLeadsSearch] = useState("");

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

  useEffect(() => {
    if (activeNav === "outreach" || activeNav === "engagement" || activeNav === "pipeline") {
      setActiveNav("discover");
    }
  }, [activeNav]);

  // Discover Search Mode: People vs Companies
  const [discoverMode, setDiscoverMode] = useState<"people" | "companies">("people");

  // Filter Accordions Open/Close (Screenshot 3)
  const [filterSections, setFilterSections] = useState({
    datasets: true,
    intent: true,
    jobTitles: true,
    lookalikes: false,
    company: true,
    location: true,
    industry: true,
  });

  // Query & Filters State
  const [query, setQuery] = useState("");
  const [datasetFilter, setDatasetFilter] = useState("all");
  const [availableDatasets, setAvailableDatasets] = useState<{ name: string; count: number }[]>([]);
  const [seniority, setSeniority] = useState<string[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [employeeRanges, setEmployeeRanges] = useState<string[]>([]);
  const [revenueFilters, setRevenueFilters] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [ownershipFilter, setOwnershipFilter] = useState("all");
  const [emailStatus, setEmailStatus] = useState("all");
  const [hasPhone, setHasPhone] = useState(false);
  const [hasEmailFilter, setHasEmailFilter] = useState(false);
  const [hasLinkedinFilter, setHasLinkedinFilter] = useState(false);
  const [minContactsFilter, setMinContactsFilter] = useState("all");
  const [minScore, setMinScore] = useState(0);
  const [intentCategories, setIntentCategories] = useState<string[]>([]);
  const [intentRecency, setIntentRecency] = useState("all");
  const [webPlatforms, setWebPlatforms] = useState<string[]>([]);

  // Computed & Compatibility Helpers
  const industry = industries.join(",");
  const country = countries.join(",");
  const departmentFilter = departments.join(",");
  const employeeRange = employeeRanges.join(",");
  const revenueFilter = revenueFilters.join(",");
  const intentCategory = intentCategories[0] || "all";
  const webPlatform = (webPlatforms[0] as WebPlatform) || "all";

  const setIndustry = (val: string) => setIndustries(val === "all" || !val ? [] : [val]);
  const setCountry = (val: string) => setCountries(val === "all" || !val ? [] : [val]);
  const setEmployeeRange = (val: string) => setEmployeeRanges(val === "all" || !val ? [] : [val]);
  const setRevenueFilter = (val: string) => setRevenueFilters(val === "all" || !val ? [] : [val]);
  const setDepartmentFilter = (val: string) => setDepartments(val === "all" || !val ? [] : [val]);
  const setIntentCategory = (val: string) => setIntentCategories(val === "all" || !val ? [] : [val]);
  const setWebPlatform = (val: WebPlatform) => setWebPlatforms(val === "all" || !val ? [] : [val]);
  const [limitPerPage, setLimitPerPage] = useState(25);
  const [fullListView, setFullListView] = useState(false);
  const [selectedIntentProspect, setSelectedIntentProspect] = useState<Prospect | null>(null);
  const [sequenceBuilderModalOpen, setSequenceBuilderModalOpen] = useState(false);
  const [sequenceTargetLeads, setSequenceTargetLeads] = useState<Prospect[]>([]);
  const [sequenceStep1Subject, setSequenceStep1Subject] = useState("Quick question regarding {{company}}'s technology roadmap");
  const [sequenceStep1Body, setSequenceStep1Body] = useState(`Hi {{firstName}},\n\nI noticed {{company}} has been expanding its {{industry}} initiatives. We help leaders like yourself streamline verified prospect data and accelerate pipeline.\n\nWould you have 10 minutes next week for a brief conversation?\n\nBest regards,\nLeadIntellect Outbound`);
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);
  const [aiOrchestratorOpen, setAiOrchestratorOpen] = useState(false);
  const [aiOrchestratorQuery, setAiOrchestratorQuery] = useState("");
  const [aiOrchestrating, setAiOrchestrating] = useState(false);
  const [orchestratorResult, setOrchestratorResult] = useState<any | null>(null);
  const [orchestratorSelectedLead, setOrchestratorSelectedLead] = useState<any | null>(null);
  const [savingSearchLoading, setSavingSearchLoading] = useState(false);
  const [enrichSelectedListId, setEnrichSelectedListId] = useState("all");
  const [enrichingListLoading, setEnrichingListLoading] = useState(false);
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
    discover: true,
    lists: false,
    enrich: false,
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
  const [intelligenceCategory, setIntelligenceCategory] = useState<string>("all");
  const [intelligenceRecency, setIntelligenceRecency] = useState<number>(90);
  const [intelligenceQuery, setIntelligenceQuery] = useState<string>("");
  const [intelligenceAccounts, setIntelligenceAccounts] = useState<any[]>([]);
  const [intelligenceSignals, setIntelligenceSignals] = useState<any[]>([]);
  const [intelligenceSummary, setIntelligenceSummary] = useState<any>(null);
  const [intelligenceLoading, setIntelligenceLoading] = useState<boolean>(false);

  // Collapsible AI Search Suggestions Banner (Maximizes prospect list view)
  const [aiBannerOpen, setAiBannerOpen] = useState(false);

  // User Profile Menu & Advanced Filters Modal States
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Alphabetical Typeahead / Autocomplete Suggestions States
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [industrySuggestions, setIndustrySuggestions] = useState<string[]>([]);
  const [showIndustrySuggestions, setShowIndustrySuggestions] = useState(false);
  const [industrySearchText, setIndustrySearchText] = useState("");
  const [countrySuggestions, setCountrySuggestions] = useState<string[]>([]);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [countrySearchText, setCountrySearchText] = useState("");
  const [topSuggestions, setTopSuggestions] = useState<{ text: string; category: string }[]>([]);
  const [showTopSuggestions, setShowTopSuggestions] = useState(false);
  const [intentSelectorOpen, setIntentSelectorOpen] = useState(false);
  const [cachedEnrichProspects, setCachedEnrichProspects] = useState<Prospect[]>([]);

  // Advanced Filters (50+ Enterprise Criteria)
  const [advFilters, setAdvFilters] = useState<{
    technographic: string[];
    fundingStage: string[];
    growthRate: string;
    buyingIntentScore: string;
    executiveChange: boolean;
  }>({
    technographic: [],
    fundingStage: [],
    growthRate: "all",
    buyingIntentScore: "all",
    executiveChange: false,
  });

  const isCEOUser =
    currentUser?.role === "admin" ||
    (currentUser?.email &&
      ["raghud2483@gmail.com", "ceo@lead-intellect.com", "drnconsulting81@gmail.com", "ceo@leadintellect.ai"].includes(
        currentUser.email.toLowerCase()
      ));

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

    // Strict CSV validation: only genuine CSV files allowed
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".csv") && file.type !== "text/csv" && file.type !== "application/vnd.ms-excel") {
      showToast("Invalid file format: Please upload a genuine .csv file. Other document formats (e.g., PDF, DOCX, images) are not accepted.", "error");
      e.target.value = "";
      return;
    }

    if (file.size === 0) {
      showToast("The selected CSV file is empty.", "error");
      e.target.value = "";
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast("File size exceeds 15MB limit. Please upload a smaller CSV batch.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text || !text.trim()) {
        showToast("The selected file is empty or cannot be read as text.", "error");
        return;
      }

      if (text.includes("\0") || /[\uFFFD]/.test(text.slice(0, 500))) {
        showToast("The uploaded file contains binary/non-text data. Only standard plain-text CSV spreadsheets are supported.", "error");
        return;
      }

      setImportFileContent(text);
      setImportPreview(null);
      setEnrichmentResult(null);
      showToast(`Selected "${file.name}" (${(file.size / 1024).toFixed(1)} KB). Ready for column mapping & preview.`);
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
          const isPaidPlan = parsed.plan === "pro" || parsed.plan === "business" || parsed.subscriptionStatus === "active";
          const genuineCredits = typeof parsed.credits === "number" ? parsed.credits : 10;
          parsed.credits = genuineCredits;
          parsed.role = isCeoEmail(parsed.email) ? "admin" : (parsed.role === "admin" ? "admin" : "customer");
          setCurrentUser(parsed);
          setCredits(genuineCredits);
          activeEmail = parsed.email || activeEmail;
          try {
            localStorage.setItem("leadintellect_user", JSON.stringify(parsed));
          } catch {}
          loadSavedLeads(activeEmail);
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

    // Read initial tab from URL if present
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const tabParam = sp.get("tab") as NavItem | null;
      if (
        tabParam &&
        ["home", "discover", "lists", "enrich", "intelligence", "integrations", "settings"].includes(tabParam)
      ) {
        setActiveNav(tabParam);
      }
    }

    // Keyboard backspace guard: prevent browser from bouncing back to marketing homepage
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        const target = e.target as HTMLElement | null;
        if (target) {
          const tagName = target.tagName ? target.tagName.toLowerCase() : "";
          const isInput =
            tagName === "input" ||
            tagName === "textarea" ||
            tagName === "select" ||
            target.isContentEditable;
          if (!isInput) {
            e.preventDefault();
            if (window.history.length > 1) {
              window.history.back();
            }
          }
        }
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        setActiveNav(e.state.tab);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Handle user sign out cleanly to Homepage
  const handleSignOut = () => {
    try {
      localStorage.removeItem("leadintellect_user");
      sessionStorage.removeItem("leadintellect_user");
      window.dispatchEvent(new Event("storage"));
    } catch {}
    window.location.href = "/";
  };

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
        if (currentUser?.email) params.set("userEmail", currentUser.email);
        if (query) params.set("query", query);
        if (seniority.length > 0) params.set("seniority", seniority.join(","));
        if (titleFilter) params.set("title", titleFilter);
        if (cityFilter) params.set("city", cityFilter);
        if (stateFilter) params.set("state", stateFilter);
        if (companyFilter) params.set("companyName", companyFilter);
        if (industries.length > 0) params.set("industry", industries.join(","));
        if (countries.length > 0) params.set("country", countries.join(","));
        if (employeeRanges.length > 0) params.set("employeeRange", employeeRanges.join(","));
        if (revenueFilters.length > 0) params.set("revenueRange", revenueFilters.join(","));
        if (ownershipFilter !== "all") params.set("ownership", ownershipFilter);
        if (departments.length > 0) params.set("department", departments.join(","));
        if (emailStatus !== "all") params.set("emailStatus", emailStatus);
        if (hasPhone) params.set("hasPhone", "true");
        if (hasEmailFilter) params.set("hasEmail", "true");
        if (hasLinkedinFilter) params.set("hasLinkedin", "true");
        if (minScore > 0) params.set("minScore", minScore.toString());
        if (intentCategories.length > 0) params.set("intentCategory", intentCategories.join(","));
        if (intentRecency && intentRecency !== "all") params.set("intentRecency", intentRecency);
        if (webPlatforms.length > 0) params.set("webPlatform", webPlatforms.join(","));
        if (datasetFilter && datasetFilter !== "all") params.set("dataset", datasetFilter);
        params.set("page", page.toString());
        params.set("limit", limitPerPage.toString());

        fetch(`/api/prospects?${params.toString()}`)
          .then((res) => res.json())
          .then((data) => {
            if (!ignore) {
              setProspects(data.prospects || []);
              if (data.facets?.datasets && data.facets.datasets.length > 0) {
                setAvailableDatasets(data.facets.datasets);
              }
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
        if (industries.length > 0) params.set("industry", industries.join(","));
        if (countries.length > 0) params.set("country", countries.join(","));
        if (stateFilter) params.set("state", stateFilter);
        if (cityFilter) params.set("city", cityFilter);
        if (employeeRanges.length > 0) params.set("employeeRange", employeeRanges.join(","));
        if (revenueFilters.length > 0) params.set("revenueRange", revenueFilters.join(","));
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
    industries,
    countries,
    employeeRanges,
    revenueFilters,
    ownershipFilter,
    departments,
    emailStatus,
    hasPhone,
    hasEmailFilter,
    hasLinkedinFilter,
    minContactsFilter,
    minScore,
    intentCategories,
    intentRecency,
    webPlatforms,
    datasetFilter,
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
    if (activeNav === "intelligence") {
      setIntelligenceLoading(true);
      const params = new URLSearchParams();
      if (intelligenceCategory && intelligenceCategory !== "all") params.set("category", intelligenceCategory);
      if (intelligenceRecency) params.set("recency", intelligenceRecency.toString());
      if (intelligenceQuery) params.set("query", intelligenceQuery);

      fetch(`/api/intelligence?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          if (!ignore && data.success) {
            setIntelligenceAccounts(data.accounts || []);
            setIntelligenceSignals(data.signals || []);
            setIntelligenceSummary(data);
          }
          if (!ignore) setIntelligenceLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load intelligence data:", err);
          if (!ignore) setIntelligenceLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [activeNav, fetchLists, intelligenceCategory, intelligenceRecency, intelligenceQuery]);

  // Saved Unlocked Leads Loader
  const loadSavedLeads = async (emailToUse?: string) => {
    const targetEmail = emailToUse || currentUser?.email;
    if (!targetEmail || targetEmail === "guest@leadintellect.ai") return;
    setLoadingSavedLeads(true);
    try {
      const res = await fetch(`/api/prospects/unlocked?userEmail=${encodeURIComponent(targetEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.prospects)) {
          setSavedLeads(data.prospects);
          // Seed revealedContacts so they are displayed unmasked everywhere
          setRevealedContacts((prev) => {
            const next = { ...prev };
            data.prospects.forEach((p: Prospect) => {
              next[p.id] = {
                email: p.email,
                phone: p.phone,
                linkedin: p.linkedin,
                revealedAt: Date.now(),
              };
            });
            return next;
          });
        }
      }
    } catch (e) {
      console.error("Error loading saved unlocked leads:", e);
    } finally {
      setLoadingSavedLeads(false);
    }
  };

  // CSV Export for Unlocked Leads Only (Strictly restricted for non-admin customers)
  const handleExportUnlockedLeads = () => {
    if (savedLeads.length === 0) {
      showToast("No unlocked leads to export. Unlock leads from the Directory first.", "info");
      return;
    }

    const headers = [
      "Full Name",
      "Job Title",
      "Company Name",
      "Industry",
      "City",
      "State",
      "Country",
      "Verified Official Email",
      "Verified Direct Phone",
      "LinkedIn Profile",
      "Website",
      "ICP Score",
    ];

    const rows = savedLeads.map((p) => {
      const activeEmail = revealedContacts[p.id]?.email || p.email;
      const activePhone = revealedContacts[p.id]?.phone || p.phone;
      return [
        `"${(p.name || "").replace(/"/g, '""')}"`,
        `"${(p.title || "").replace(/"/g, '""')}"`,
        `"${(p.company || "").replace(/"/g, '""')}"`,
        `"${(p.industry || "").replace(/"/g, '""')}"`,
        `"${(p.city || "").replace(/"/g, '""')}"`,
        `"${(p.state || "").replace(/"/g, '""')}"`,
        `"${(p.country || "").replace(/"/g, '""')}"`,
        `"${(activeEmail || "").replace(/"/g, '""')}"`,
        `"${(activePhone || "").replace(/"/g, '""')}"`,
        `"${(p.linkedin || "").replace(/"/g, '""')}"`,
        `"${(p.website || "").replace(/"/g, '""')}"`,
        `"${p.icpScore || ""}"`,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LeadIntellect_My_Saved_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Successfully exported ${savedLeads.length} unlocked leads to CSV!`, "success");
  };

  // Contact Reveal Action (Server-Authoritative, Idempotent & Transaction-Safe)
  const handleRevealContact = async (p: Prospect) => {
    if (revealedContacts[p.id]) {
      showToast(`Contact already unlocked: ${revealedContacts[p.id].email}`);
      return;
    }

    if (credits <= 0 && !isCEOUser && currentUser.role !== "admin") {
      setOutOfCreditsModalOpen(true);
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
        if (data.insufficientCredits || data.paymentRequired || credits <= 0) {
          setOutOfCreditsModalOpen(true);
        } else {
          showToast(data.error || "Failed to reveal contact details.", "error");
        }
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

      // Automatically store in My Saved Leads tab so user is never charged twice
      setSavedLeads((prev) => {
        if (prev.some((x) => x.id === p.id)) return prev;
        return [
          {
            ...p,
            email: verifiedEmail,
            phone: verifiedPhone,
            isRevealed: true,
            isUnlocked: true,
          },
          ...prev,
        ];
      });

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
          : `⚡ 1 credit deducted. Contact unlocked and saved to "My Saved Leads".`,
        "success"
      );
    } catch {
      showToast("Network error during contact reveal. Please check your connection and retry.", "error");
    } finally {
      setRevealingId(null);
    }
  };

  // Cache prospects persistently so Enrich & Verify never flickers or disappears
  useEffect(() => {
    if (prospects && prospects.length > 0) {
      setCachedEnrichProspects((prev) => {
        const map = new Map<string, Prospect>();
        prev.forEach((p) => map.set(p.id, p));
        prospects.forEach((p) => map.set(p.id, p));
        return Array.from(map.values());
      });
    }
  }, [prospects]);

  // Active List prospects for Stage 3 Enrichment (Stable caching prevents flickering)
  const activeEnrichListProspects = useMemo(() => {
    const pool = cachedEnrichProspects.length > 0 ? cachedEnrichProspects : prospects;
    if (enrichSelectedListId === "all") return pool.length > 0 ? pool : prospects;
    const targetList = userLists.find((l) => l.id === enrichSelectedListId);
    if (!targetList) return pool.length > 0 ? pool : prospects;
    const filtered = pool.filter((p) => targetList.prospectIds.includes(p.id));
    return filtered.length > 0 ? filtered : pool;
  }, [enrichSelectedListId, userLists, cachedEnrichProspects, prospects]);

  // Batch Enrich All in List
  const handleBatchEnrichList = async () => {
    const unrevealed = activeEnrichListProspects.filter((p) => !revealedContacts[p.id]);
    if (unrevealed.length === 0) {
      showToast("All contacts in this list are already verified and revealed!");
      return;
    }

    if (credits < unrevealed.length) {
      showToast(`Insufficient credits. You need ${unrevealed.length} credits, but have ${credits}.`, "error");
      return;
    }

    setEnrichingListLoading(true);
    let successCount = 0;
    try {
      for (const p of unrevealed) {
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
        if (res.ok) {
          const data = await res.json();
          setRevealedContacts((prev) => ({
            ...prev,
            [p.id]: {
              email: data.email,
              phone: data.phone,
              linkedin: data.linkedin || p.linkedin,
              revealedAt: Date.now(),
            },
          }));
          if (data.remainingCredits !== undefined) {
            setCredits(data.remainingCredits);
          }
          successCount++;
        }
      }
      showToast(`Successfully verified & revealed ${successCount} contacts in list!`);
    } catch {
      showToast("Error during batch verification.", "error");
    } finally {
      setEnrichingListLoading(false);
    }
  };

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

  // Helper: export list of prospects as CSV
  const exportProspectsAsCsv = async (list: Prospect[]) => {
    const idsToExport = list && list.length > 0 
      ? list.map((p) => p.id) 
      : (selectedIds.length > 0 ? selectedIds : prospects.slice(0, 25).map((p) => p.id));
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
      } else {
        if (data.paymentRequired) {
          showToast("Export locked: Active subscription required. Redirecting to plans...", "error");
          setTimeout(() => { window.location.href = "/pricing"; }, 1500);
        } else {
          showToast("Export failed: " + (data.error || "Server error"), "error");
        }
      }
    } catch {
      showToast("Failed to export prospects.", "error");
    }
  };

  // AI Intelligence Orchestrator Runner
  const handleRunOrchestrator = async (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : aiOrchestratorQuery).trim();
    if (!q) {
      showToast("Please enter a prospecting objective or query.");
      return;
    }
    setAiOrchestrating(true);
    setAiOrchestratorQuery(q);
    try {
      const res = await fetch("/api/ai/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          limit: 20,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrchestratorResult(data);
        if (data.results && data.results.length > 0) {
          setOrchestratorSelectedLead(data.results[0]);
        }
      } else {
        showToast(data.error || "Failed to execute Intelligence Orchestrator.");
      }
    } catch {
      showToast("Network error running AI Orchestrator.");
    } finally {
      setAiOrchestrating(false);
    }
  };

  const handleApplyOrchestratorCriteria = (criteria: any) => {
    if (!criteria) return;
    if (criteria.targetSeniority) setSeniority([criteria.targetSeniority]);
    if (criteria.targetIndustries && criteria.targetIndustries.length > 0) {
      setIndustry(criteria.targetIndustries[0]);
    }
    if (criteria.targetLocations && criteria.targetLocations.length > 0) {
      setCountry(criteria.targetLocations[0]);
    }
    if (criteria.employeeRanges && criteria.employeeRanges.length > 0) {
      setEmployeeRange(criteria.employeeRanges[0]);
    }
    if (criteria.intentCategories && criteria.intentCategories.length > 0) {
      setIntentCategory(criteria.intentCategories[0]);
    }
    if (criteria.maxRecencyDays) {
      setIntentRecency(String(criteria.maxRecencyDays));
    }
    if (criteria.targetRoles && criteria.targetRoles.length > 0) {
      setTitleFilter(criteria.targetRoles[0]);
    }
    setPage(1);
    setAiOrchestratorOpen(false);
    showToast("✓ Applied AI structured criteria to Discover Leads table!");
  };

  const handleSaveCurrentSearch = async () => {
    setSavingSearchLoading(true);
    try {
      const activeFilters: Record<string, any> = {
        query,
        seniority: seniority.join(","),
        industry,
        country,
        cityFilter,
        employeeRange,
        intentCategory,
        intentRecency,
        titleFilter,
        minScore,
      };
      const searchName = query
        ? `Search: ${query.slice(0, 30)}`
        : `${industry || "All Verticals"} • ${seniority || "All Roles"}`;

      const res = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser?.email || "guest@leadintellect.ai",
          name: searchName,
          searchType: "people",
          filters: activeFilters,
          resultCount: totalCount,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`✓ Saved as smart search alert: "${searchName}"`);
      } else {
        showToast(data.error || "Failed to save search.");
      }
    } catch {
      showToast("Network error saving search.");
    } finally {
      setSavingSearchLoading(false);
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
      } else {
        if (data.paymentRequired) {
          showToast("Export locked: Active subscription required. Redirecting to plans...", "error");
          setTimeout(() => { window.location.href = "/pricing"; }, 1500);
        } else {
          showToast("Export failed: " + (data.error || "Server error"), "error");
        }
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
    setDatasetFilter("all");
    setSeniority([]);
    setTitleFilter("");
    setCityFilter("");
    setStateFilter("");
    setCompanyFilter("");
    setIndustries([]);
    setCountries([]);
    setEmployeeRanges([]);
    setRevenueFilters([]);
    setOwnershipFilter("all");
    setDepartments([]);
    setEmailStatus("all");
    setHasPhone(false);
    setHasEmailFilter(false);
    setHasLinkedinFilter(false);
    setMinScore(0);
    setIntentCategories([]);
    setIntentRecency("all");
    setWebPlatforms([]);
    setCountrySearchText("");
    setIndustrySearchText("");
    setQuery("");
    setPage(1);
  };

  const activeFilterCount =
    seniority.length +
    departments.length +
    employeeRanges.length +
    revenueFilters.length +
    countries.length +
    industries.length +
    intentCategories.length +
    webPlatforms.length +
    (titleFilter ? 1 : 0) +
    (cityFilter ? 1 : 0) +
    (stateFilter ? 1 : 0) +
    (companyFilter ? 1 : 0) +
    (ownershipFilter !== "all" ? 1 : 0) +
    (emailStatus !== "all" ? 1 : 0) +
    (hasPhone ? 1 : 0) +
    (hasEmailFilter ? 1 : 0) +
    (hasLinkedinFilter ? 1 : 0) +
    (minScore > 0 ? 1 : 0) +
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
            {(intentCategories.length > 0 || intentRecency !== "all" || webPlatforms.length > 0) && (
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
          <div className="p-3.5 pt-1 space-y-3.5 border-t border-teal/20">
            {/* Signal Category Multi-Select Checkboxes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-navy uppercase tracking-wider">
                  Signal Category {intentCategories.length > 0 && `(${intentCategories.length})`}
                </label>
                {intentCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIntentCategories([]);
                      setPage(1);
                    }}
                    className="text-[10px] text-rose-600 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar p-1 rounded-lg border border-slate-200 bg-white">
                {INTENT_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                  const isChecked = intentCategories.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? "bg-teal/10 font-bold text-teal-dark" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setIntentCategories((prev) =>
                            isChecked ? prev.filter((id) => id !== cat.id) : [...prev, cat.id]
                          );
                          setPage(1);
                        }}
                        className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                      />
                      <span className="truncate">{cat.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Signal Recency Window */}
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

            {/* Web & Social Intent Source Multi-Select Checkboxes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-navy uppercase tracking-wider">
                  Web &amp; Social Intent Source {webPlatforms.length > 0 && `(${webPlatforms.length})`}
                </label>
                {webPlatforms.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setWebPlatforms([]);
                      setPage(1);
                    }}
                    className="text-[10px] text-rose-600 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar p-1 rounded-lg border border-slate-200 bg-white">
                {WEB_INTENT_PLATFORMS.filter((p) => p.id !== "all").map((plat) => {
                  const isChecked = webPlatforms.includes(plat.id);
                  return (
                    <label
                      key={plat.id}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? "bg-teal/10 font-bold text-teal-dark" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setWebPlatforms((prev) =>
                            isChecked ? prev.filter((id) => id !== plat.id) : [...prev, plat.id]
                          );
                          setPage(1);
                        }}
                        className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                      />
                      <span className="truncate">{plat.icon} {plat.label}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Monitors live buyer intent across G2, Reddit, Quora, Web News &amp; Careers.
              </p>
            </div>

            {(intentCategories.length > 0 || intentRecency !== "all" || webPlatforms.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setIntentCategories([]);
                  setIntentRecency("all");
                  setWebPlatforms([]);
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
            <span>Job Title / Role</span>
            {(seniority.length > 0 || departments.length > 0 || titleFilter) && (
              <span className="w-2 h-2 rounded-full bg-teal-dark" />
            )}
          </span>
          {filterSections.jobTitles ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {filterSections.jobTitles && (
          <div className="p-3.5 pt-1 space-y-3.5 border-t border-slate-100">
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
              <p className="text-[11px] font-bold text-navy mb-1.5">Seniority Level {seniority.length > 0 && `(${seniority.length})`}</p>
              <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar p-1 rounded-lg border border-slate-200 bg-white">
                {[
                  "C-Suite",
                  "VP",
                  "Director",
                  "Manager",
                  "Founder / Owner",
                  "Head of / Lead",
                  "Partner / Board",
                  "Professional / IC",
                ].map((s) => {
                  const isChecked = seniority.includes(s);
                  return (
                    <label
                      key={s}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? "bg-teal/10 font-bold text-teal-dark" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSeniority((prev) =>
                            isChecked ? prev.filter((item) => item !== s) : [...prev, s]
                          );
                          setPage(1);
                        }}
                        className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                      />
                      <span>{s}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-bold text-navy">Department / Function {departments.length > 0 && `(${departments.length})`}</p>
                {departments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setDepartments([]);
                      setPage(1);
                    }}
                    className="text-[10px] text-rose-600 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-44 overflow-y-auto custom-scrollbar p-1 rounded-lg border border-slate-200 bg-white">
                {ALL_DEPARTMENTS.map((dept) => {
                  const isChecked = departments.includes(dept);
                  return (
                    <label
                      key={dept}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? "bg-teal/10 font-bold text-teal-dark" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setDepartments((prev) =>
                            isChecked ? prev.filter((d) => d !== dept) : [...prev, dept]
                          );
                          setPage(1);
                        }}
                        className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                      />
                      <span className="truncate">{dept}</span>
                    </label>
                  );
                })}
              </div>
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
            <span>Company Name &amp; Size</span>
            {(companyFilter || employeeRanges.length > 0 || revenueFilters.length > 0) && (
              <span className="w-2 h-2 rounded-full bg-teal-dark" />
            )}
          </span>
          {filterSections.company ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {filterSections.company && (
          <div className="p-3.5 pt-1 space-y-3.5 border-t border-slate-100">
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
            {/* Employee Count Multi-Select Checkboxes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-bold text-navy">Employee Count {employeeRanges.length > 0 && `(${employeeRanges.length})`}</p>
                {employeeRanges.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmployeeRanges([]);
                      setPage(1);
                    }}
                    className="text-[10px] text-rose-600 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar p-1 rounded-lg border border-slate-200 bg-white">
                {ALL_EMPLOYEE_RANGES.map((r) => {
                  const isChecked = employeeRanges.includes(r.id);
                  return (
                    <label
                      key={r.id}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? "bg-teal/10 font-bold text-teal-dark" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setEmployeeRanges((prev) =>
                            isChecked ? prev.filter((id) => id !== r.id) : [...prev, r.id]
                          );
                          setPage(1);
                        }}
                        className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                      />
                      <span>{r.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Annual Revenue Multi-Select Checkboxes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-bold text-navy">Annual Revenue {revenueFilters.length > 0 && `(${revenueFilters.length})`}</p>
                {revenueFilters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setRevenueFilters([]);
                      setPage(1);
                    }}
                    className="text-[10px] text-rose-600 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar p-1 rounded-lg border border-slate-200 bg-white">
                {ALL_REVENUE_RANGES.map((r) => {
                  const isChecked = revenueFilters.includes(r.id);
                  return (
                    <label
                      key={r.id}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? "bg-teal/10 font-bold text-teal-dark" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setRevenueFilters((prev) =>
                            isChecked ? prev.filter((id) => id !== r.id) : [...prev, r.id]
                          );
                          setPage(1);
                        }}
                        className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                      />
                      <span>{r.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 4: Location (City, State, Country) */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setFilterSections((s) => ({ ...s, location: !s.location }))}
          className="w-full px-3.5 py-2.5 flex items-center justify-between font-bold text-navy hover:bg-slate-50 text-left"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>Location (Country, City, State)</span>
            {(countries.length > 0 || cityFilter || stateFilter) && (
              <span className="w-2 h-2 rounded-full bg-teal-dark" />
            )}
          </span>
          {filterSections.location ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {filterSections.location && (
          <div className="p-3.5 pt-1 space-y-3.5 border-t border-slate-100">
            {/* Country Multi-Select with Search & Checkboxes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-bold text-navy">Country {countries.length > 0 && `(${countries.length} selected)`}</p>
                {countries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCountries([]);
                      setPage(1);
                    }}
                    className="text-[10px] text-rose-600 font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Selected Country Chips */}
              {countries.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2 max-h-24 overflow-y-auto custom-scrollbar p-1 bg-slate-50 rounded-lg border border-slate-200">
                  {countries.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal/10 border border-teal/30 text-teal-dark text-[11px] font-semibold"
                    >
                      <span>📍 {c}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCountries((prev) => prev.filter((item) => item !== c));
                          setPage(1);
                        }}
                        className="hover:text-rose-600 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search Box */}
              <input
                type="text"
                value={countrySearchText}
                onChange={(e) => setCountrySearchText(e.target.value)}
                placeholder="Search 70+ countries (e.g. US, UK, India)..."
                className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark mb-1.5"
              />

              {/* Scrollable Country Checkbox List */}
              <div className="space-y-1 max-h-44 overflow-y-auto custom-scrollbar p-1 rounded-lg border border-slate-200 bg-white">
                {ALL_COUNTRIES.filter((c) =>
                  !countrySearchText.trim() || c.toLowerCase().includes(countrySearchText.trim().toLowerCase())
                ).map((c) => {
                  const isChecked = countries.includes(c);
                  return (
                    <label
                      key={c}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? "bg-teal/10 font-bold text-teal-dark" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setCountries((prev) =>
                            isChecked ? prev.filter((item) => item !== c) : [...prev, c]
                          );
                          setPage(1);
                        }}
                        className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                      />
                      <span className="truncate">{c}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* City or State */}
            <div>
              <p className="text-[11px] font-bold text-navy mb-1">City or State</p>
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setPage(1);
                }}
                placeholder="Filter by City or State (e.g. Boston, CA)..."
                className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark"
              />
            </div>
          </div>
        )}
      </div>

      {/* Accordion 5: Industry */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setFilterSections((s) => ({ ...s, industry: !s.industry }))}
          className="w-full px-3.5 py-2.5 flex items-center justify-between font-bold text-navy hover:bg-slate-50 text-left"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Industry</span>
            {industries.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-teal-dark" />
            )}
          </span>
          {filterSections.industry ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {filterSections.industry && (
          <div className="p-3.5 pt-1 space-y-3.5 border-t border-slate-100">
            {/* Industry Multi-Select with Search & Checkboxes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-bold text-navy">Industry {industries.length > 0 && `(${industries.length} selected)`}</p>
                {industries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIndustries([]);
                      setPage(1);
                    }}
                    className="text-[10px] text-rose-600 font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Selected Industry Chips */}
              {industries.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2 max-h-24 overflow-y-auto custom-scrollbar p-1 bg-slate-50 rounded-lg border border-slate-200">
                  {industries.map((ind) => (
                    <span
                      key={ind}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] font-semibold"
                    >
                      <span className="truncate max-w-[160px]">🏢 {ind}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIndustries((prev) => prev.filter((item) => item !== ind));
                          setPage(1);
                        }}
                        className="hover:text-rose-600 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search Box */}
              <input
                type="text"
                value={industrySearchText}
                onChange={(e) => setIndustrySearchText(e.target.value)}
                placeholder="Search 200+ industries (e.g. SaaS, Fintech, Healthcare)..."
                className="w-full text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-dark mb-1.5"
              />

              {/* Scrollable Industry Checkbox List */}
              <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar p-1 rounded-lg border border-slate-200 bg-white">
                {ALL_INDUSTRIES.filter((ind) =>
                  !industrySearchText.trim() || ind.toLowerCase().includes(industrySearchText.trim().toLowerCase())
                ).map((ind) => {
                  const isChecked = industries.includes(ind);
                  return (
                    <label
                      key={ind}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? "bg-teal/10 font-bold text-teal-dark" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setIndustries((prev) =>
                            isChecked ? prev.filter((item) => item !== ind) : [...prev, ind]
                          );
                          setPage(1);
                        }}
                        className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                      />
                      <span className="truncate">{ind}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Direct Contact Requirements */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                <input
                  type="checkbox"
                  checked={hasPhone}
                  onChange={(e) => {
                    setHasPhone(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded text-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                />
                <span className="font-medium">Must Have Direct Phone</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                <input
                  type="checkbox"
                  checked={hasEmailFilter}
                  onChange={(e) => {
                    setHasEmailFilter(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded text-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                />
                <span className="font-medium">Must Have Verified Email</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* View 50+ Filters Button (Opens Advanced Filters Drawer directly) */}
      <button
        type="button"
        onClick={() => setAdvancedFiltersOpen(true)}
        className="w-full py-2.5 px-3 border border-indigo-200 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>View 50+ Advanced Filters</span>
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
            {/* Home Icon */}
            <button
              type="button"
              onClick={() => {
                setProspectFlyoutOpen(false);
                setActiveNav("home");
              }}
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
              onClick={() => {
                setProspectFlyoutOpen(false);
                setActiveNav("intelligence");
              }}
              title="Intelligence (Buyer Intent & Signals)"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === "intelligence"
                  ? "bg-slate-100 text-teal-dark shadow-2xs"
                  : "text-slate-500 hover:text-navy hover:bg-slate-100"
              }`}
            >
              <Zap className="w-5 h-5" />
            </button>

            {/* Prospect and Enrich (Search Icon with Flyout Dropdown) */}
            <div
              className="relative"
              onMouseLeave={() => setProspectFlyoutOpen(false)}
            >
              <button
                type="button"
                onClick={() => setProspectFlyoutOpen((prev) => !prev)}
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
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProspectFlyoutOpen(false)}
                    onMouseEnter={() => setProspectFlyoutOpen(false)}
                  />
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
              </>
            )}
            </div>

            {/* Integrations (Settings) */}
            <button
              type="button"
              onClick={() => {
                setProspectFlyoutOpen(false);
                setActiveNav("integrations");
              }}
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

        {/* Bottom Section: Avatar & Profile Menu */}
        <div className="relative flex flex-col items-center py-3 gap-2 border-t border-slate-100 w-full px-2">
          {/* User Profile Avatar (Clickable with dropdown menu) */}
          <button
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            title={currentUser?.email || "Account & Profile"}
            className="w-9 h-9 rounded-full bg-navy hover:ring-2 hover:ring-teal-dark text-white text-xs font-bold flex items-center justify-center cursor-pointer shadow-xs transition-all relative"
            aria-label="User account menu"
          >
            {currentUser?.name
              ? currentUser.name.charAt(0).toUpperCase()
              : currentUser?.email
              ? currentUser.email.charAt(0).toUpperCase()
              : "U"}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </button>

          {/* User Profile Popover Menu */}
          {profileMenuOpen && (
            <div className="absolute bottom-12 left-16 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50 text-left animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {currentUser?.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : currentUser?.email
                      ? currentUser.email.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-navy truncate">
                      {currentUser?.name || currentUser?.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-[11px] text-text-muted truncate">
                      {currentUser?.email || "user@leadintellect.ai"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Plan & Credits Badge */}
              <div className="my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-dark block">
                    Current Plan
                  </span>
                  <span className="text-xs font-extrabold text-navy capitalize">
                    {currentUser?.plan || "Growth Plan"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-text-muted block">Balance</span>
                  <span className="text-xs font-bold text-teal-dark">
                    {credits.toLocaleString()} credits
                  </span>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="space-y-1 pt-1 text-xs">
                <Link
                  href="/"
                  onClick={() => setProfileMenuOpen(false)}
                  className="w-full px-2.5 py-2 rounded-xl text-slate-700 hover:text-navy hover:bg-slate-50 font-semibold flex items-center gap-2 transition-colors"
                >
                  <Home className="w-3.5 h-3.5 text-teal-dark" />
                  <span>Return to Homepage</span>
                </Link>

                {isCEOUser && (
                  <Link
                    href="/admin"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full px-2.5 py-2 rounded-xl text-indigo-700 hover:text-indigo-900 bg-indigo-50/60 hover:bg-indigo-50 font-bold flex items-center gap-2 transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>CEO Admin Portal</span>
                  </Link>
                )}

                <Link
                  href="/pricing"
                  onClick={() => setProfileMenuOpen(false)}
                  className="w-full px-2.5 py-2 rounded-xl text-slate-700 hover:text-navy hover:bg-slate-50 font-semibold flex items-center gap-2 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upgrade &amp; Add Credits</span>
                </Link>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full px-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out of LeadIntellect"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto custom-scrollbar py-1">
            <h2 className="text-xs sm:text-sm font-bold text-navy shrink-0 hidden md:flex items-center gap-1.5">
              {activeNav === "home" && "Get started with LeadIntellect"}
              {activeNav === "discover" && (discoverMode === "people" ? "Search Directory: People" : "Search Directory: Companies")}
              {activeNav === "lists" && `My Saved Leads (${savedLeads.length} Unlocked)`}
              {activeNav === "enrich" && "Enrich & Verify (Admin Only)"}
              {activeNav === "intelligence" && "Market & Account Intelligence"}
              {activeNav === "integrations" && "Integrations & API Settings"}
              {activeNav === "settings" && "Account Settings"}
            </h2>

            {/* Core Prospecting Workflow Navigation Bar */}
            <nav className="flex items-center gap-1 shrink-0 text-xs">
              {[
                { id: "discover", num: "1", label: "Search Directory" },
                { id: "lists", num: "2", label: `My Saved Leads (${savedLeads.length})` },
                ...(currentUser?.role === "admin" || isCEOUser
                  ? [{ id: "enrich", num: "3", label: "Enrich & Verify (Admin)" }]
                  : []),
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
            {/* User Role Badge */}
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
              currentUser?.role === "admin" || isCEOUser
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-teal/15 text-teal-dark border border-teal/30"
            }`}>
              {currentUser?.role === "admin" || isCEOUser ? "👑 Admin" : "Customer"}
            </span>

            {/* Credits Counter Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-navy">
              <Coins className="w-3.5 h-3.5 text-teal-dark" />
              <span>{credits.toLocaleString()}</span>
              <span className="text-[10px] text-text-muted font-normal">credits</span>
            </div>

            {currentUser?.role === "admin" || isCEOUser ? (
              <Link
                href="/admin"
                className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200"
              >
                CEO Admin Portal
              </Link>
            ) : null}

            <Link
              href="/pricing"
              className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-teal/15 hover:bg-teal/25 text-teal-dark text-[11px] font-bold"
            >
              Get More Credits
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sign out of LeadIntellect"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
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

              {/* Accordion 1: Discover Decision-Makers */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setHomeAccordions((a) => ({ ...a, discover: !a.discover }))}
                  className="w-full p-4 px-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-navy text-sm">
                      1. Discover Target Decision-Makers
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      EARN 15 CREDITS
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">
                      {completedTasks.filter((t) => t.startsWith("task_save_contact") || t.startsWith("task_save_company") || t.startsWith("task_save_search")).length} of 3 completed
                    </span>
                    {homeAccordions.discover ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {homeAccordions.discover && (
                  <div className="p-6 pt-1 border-t border-slate-100 divide-y divide-slate-100">
                    <p className="text-xs text-text-muted py-2">
                      Find people and companies that match your ideal customer profile across 84,000+ verified records.
                    </p>
                    {ONBOARDING_TASKS.filter((t) => t.section === "discover").map((task) => {
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
                              } else if (task.id === "task_save_company") {
                                setDiscoverMode("companies");
                                setActiveNav("discover");
                              } else if (task.id === "task_save_search") {
                                setDiscoverMode("people");
                                setActiveNav("discover");
                                showToast("Search filters saved!");
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

              {/* Accordion 2: Lists & Lead Qualification */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setHomeAccordions((a) => ({ ...a, lists: !a.lists }))}
                  className="w-full p-4 px-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-navy text-sm">
                      2. Lists &amp; Lead Qualification
                    </span>
                    <span className="text-[10px] font-bold text-teal-dark bg-teal/10 border border-teal/20 px-2 py-0.5 rounded-full">
                      EARN 15 CREDITS
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">
                      {completedTasks.filter((t) => t.startsWith("task_create_list") || t.startsWith("task_qualify") || t.startsWith("task_export")).length} of 3 completed
                    </span>
                    {homeAccordions.lists ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {homeAccordions.lists && (
                  <div className="p-6 pt-1 border-t border-slate-100 divide-y divide-slate-100">
                    <p className="text-xs text-text-muted py-2">
                      Organize discovered leads into segmented target lists and qualify buying tiers.
                    </p>
                    {ONBOARDING_TASKS.filter((t) => t.section === "lists").map((task) => {
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
                              if (task.id === "task_create_list") {
                                setListModalOpen(true);
                              } else {
                                setActiveNav("lists");
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

              {/* Accordion 3: Enrich & Verify Contact Details */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setHomeAccordions((a) => ({ ...a, enrich: !a.enrich }))}
                  className="w-full p-4 px-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-navy text-sm">
                      3. Enrich &amp; Verify Contact Details
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      EARN 20 CREDITS
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">
                      {completedTasks.filter((t) => t.startsWith("task_reveal") || t.startsWith("task_save_mobile") || t.startsWith("task_batch_verify")).length} of 3 completed
                    </span>
                    {homeAccordions.enrich ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {homeAccordions.enrich && (
                  <div className="p-6 pt-1 border-t border-slate-100 divide-y divide-slate-100">
                    <p className="text-xs text-text-muted py-2">
                      Unlock direct phone numbers and verified business emails with waterfall validation.
                    </p>
                    {ONBOARDING_TASKS.filter((t) => t.section === "enrich").map((task) => {
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
                              setActiveNav("enrich");
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
                  <div
                    onClick={() => setDemoVideoOpen(true)}
                    className="p-4 rounded-xl border border-teal/40 bg-gradient-to-br from-teal/10 via-white to-navy/5 hover:border-teal-dark hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-navy text-teal flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Play className="w-4 h-4 fill-teal text-teal" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal text-navy">
                        Interactive Demo
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-navy group-hover:text-teal-dark">Full Product Demo Walkthrough</h4>
                    <p className="text-[11px] text-text-muted mt-1">
                      Watch the complete 4-scene video walkthrough: Web Intent, Discovery, Reveal, and Outbound Cadence.
                    </p>
                  </div>
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

                  {/* Quick Search People Input with Instant Alphabetical Suggestions */}
                  <div className="relative min-w-[260px] sm:min-w-[320px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuery(val);
                        setPage(1);
                        if (val.trim().length >= 1) {
                          fetch(`/api/suggestions?type=all&q=${encodeURIComponent(val.trim())}&limit=8`)
                            .then((r) => r.json())
                            .then((d) => {
                              setTopSuggestions(d.suggestions || []);
                              setShowTopSuggestions(true);
                            })
                            .catch(() => {});
                        } else {
                          setTopSuggestions([]);
                          setShowTopSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (query.trim().length >= 1 && topSuggestions.length > 0) {
                          setShowTopSuggestions(true);
                        }
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
                        onClick={() => {
                          setQuery("");
                          setShowTopSuggestions(false);
                          setPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    {showTopSuggestions && topSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto custom-scrollbar p-1.5">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                          <span>Suggestions</span>
                          <button
                            type="button"
                            onClick={() => setShowTopSuggestions(false)}
                            className="text-slate-400 hover:text-navy text-xs cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                        {topSuggestions.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (item.category === "Job Title") {
                                setTitleFilter(item.text);
                              } else if (item.category === "Industry") {
                                setIndustry(item.text);
                              } else if (item.category === "Country") {
                                setCountry(item.text);
                              } else {
                                setQuery(item.text);
                              }
                              setShowTopSuggestions(false);
                              setPage(1);
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-teal/10 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span className="font-semibold text-navy truncate">{item.text}</span>
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0 ml-2">
                              {item.category}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (query && query.trim().length > 3) {
                        setAiOrchestratorQuery(query.trim());
                      }
                      setAiOrchestratorOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-violet/10 text-violet border border-violet/20 hover:bg-violet/15 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Research with AI</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-dark animate-pulse"></span>
                  </button>

                  <button
                    type="button"
                    disabled={savingSearchLoading}
                    onClick={handleSaveCurrentSearch}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                  >
                    {savingSearchLoading ? "Saving..." : "Save as new search"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoVideoOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-teal/40 bg-teal/10 hover:bg-teal/20 text-xs font-bold text-teal-dark flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Play className="w-3 h-3 fill-teal-dark text-teal-dark" />
                    <span>Demo Video</span>
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
                          setActiveNav("enrich");
                          showToast(`Loaded ${selectedIds.length} prospects in Enrich & Verify`);
                        }}
                        className="px-3 py-1 bg-teal hover:bg-teal-dark hover:text-white text-navy text-xs font-extrabold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Enrich & Verify ({selectedIds.length})</span>
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
                          onClick={() => {
                            const next = !fullListView;
                            setFullListView(next);
                            setHideFilters(next);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                            fullListView
                              ? "bg-navy text-white border-navy"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                          title={fullListView ? "Restore Normal View" : "Maximize Table (Full Width & Height View)"}
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

                      {/* Industries Multi-Select Chips */}
                      {industries.map((ind) => (
                        <span key={ind} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium shadow-2xs">
                          <span>🏢 Industry: {ind}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIndustries((prev) => prev.filter((item) => item !== ind));
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}

                      {/* Countries Multi-Select Chips */}
                      {countries.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal/10 border border-teal/30 text-teal-dark text-[11px] font-medium shadow-2xs">
                          <span>📍 Country: {c}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCountries((prev) => prev.filter((item) => item !== c));
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}

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

                      {/* Employee Count Multi-Select Chips */}
                      {employeeRanges.map((rId) => {
                        const rLabel = ALL_EMPLOYEE_RANGES.find((x) => x.id === rId)?.label || rId;
                        return (
                          <span key={rId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                            <span>👥 Employees: {rLabel}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEmployeeRanges((prev) => prev.filter((item) => item !== rId));
                                setPage(1);
                              }}
                              className="hover:text-rose-600 cursor-pointer ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}

                      {/* Annual Revenue Multi-Select Chips */}
                      {revenueFilters.map((rId) => {
                        const rLabel = ALL_REVENUE_RANGES.find((x) => x.id === rId)?.label || rId;
                        return (
                          <span key={rId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                            <span>💰 Revenue: {rLabel}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setRevenueFilters((prev) => prev.filter((item) => item !== rId));
                                setPage(1);
                              }}
                              className="hover:text-rose-600 cursor-pointer ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}

                      {/* Department Multi-Select Chips */}
                      {departments.map((dept) => (
                        <span key={dept} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                          <span>🏛️ Dept: {dept}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setDepartments((prev) => prev.filter((item) => item !== dept));
                              setPage(1);
                            }}
                            className="hover:text-rose-600 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}

                      {/* Intent Category Chips in Filter Chips Row */}
                      {intentCategories.map((catId) => {
                        const catLabel = INTENT_CATEGORIES.find((c) => c.id === catId)?.label || catId;
                        return (
                          <span key={catId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal/15 border border-teal/30 text-teal-dark text-[11px] font-medium shadow-2xs">
                            <span>⚡ Intent: {catLabel}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setIntentCategories((prev) => prev.filter((item) => item !== catId));
                                setPage(1);
                              }}
                              className="hover:text-rose-600 cursor-pointer ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}

                      {/* Web Intent Platform Chips */}
                      {webPlatforms.map((platId) => {
                        const plat = WEB_INTENT_PLATFORMS.find((p) => p.id === platId);
                        const platLabel = plat ? `${plat.icon} ${plat.label}` : platId;
                        return (
                          <span key={platId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal/15 border border-teal/30 text-teal-dark text-[11px] font-medium shadow-2xs">
                            <span>🌐 Source: {platLabel}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setWebPlatforms((prev) => prev.filter((item) => item !== platId));
                                setPage(1);
                              }}
                              className="hover:text-rose-600 cursor-pointer ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}

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

                      {datasetFilter !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-medium shadow-2xs">
                          Dataset: {datasetFilter}
                          <button
                            type="button"
                            onClick={() => {
                              setDatasetFilter("all");
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

                  {/* Buyer Intent Signals (Selective Multi-Select Dropdown + Removable Chips) */}
                  <div className="relative flex flex-wrap items-center gap-2 px-1 py-1">
                    <button
                      type="button"
                      onClick={() => setIntentSelectorOpen((prev) => !prev)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-300 hover:border-teal-dark text-navy flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-teal-dark fill-teal" />
                      <span>Buyer Intent Signals</span>
                      {intentCategories.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-teal-dark text-white text-[10px] font-extrabold">
                          {intentCategories.length}
                        </span>
                      )}
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {intentCategories.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {intentCategories.map((catId) => {
                          const catLabel = INTENT_CATEGORIES.find((c) => c.id === catId)?.label || catId;
                          return (
                            <span
                              key={catId}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy text-teal text-xs font-bold shadow-xs"
                            >
                              <span>⚡ {catLabel}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setIntentCategories((prev) => prev.filter((id) => id !== catId));
                                  setPage(1);
                                }}
                                className="hover:text-white cursor-pointer ml-1"
                                title="Remove intent filter"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">
                        All Signals Active (Real-Time Whole-Web Radar)
                      </span>
                    )}

                    {intentSelectorOpen && (
                      <div
                        onMouseLeave={() => setIntentSelectorOpen(false)}
                        className="absolute top-full left-1 mt-1 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 space-y-1.5 animate-in fade-in zoom-in-95 duration-100"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-teal-dark" />
                            <span>Select Intent Signals {intentCategories.length > 0 && `(${intentCategories.length})`}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            {intentCategories.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIntentCategories([]);
                                  setPage(1);
                                }}
                                className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                              >
                                Clear
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setIntentSelectorOpen(false)}
                              className="text-slate-400 hover:text-navy cursor-pointer text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* All Signals Option */}
                        <label
                          className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            intentCategories.length === 0
                              ? "bg-teal/15 text-teal-dark font-bold"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={intentCategories.length === 0}
                              onChange={() => {
                                setIntentCategories([]);
                                setPage(1);
                              }}
                              className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                            />
                            <span>🌐 All Signals &amp; Changes</span>
                          </div>
                          {intentCategories.length === 0 && <Check className="w-3.5 h-3.5 text-teal-dark" />}
                        </label>

                        {/* Checklist */}
                        <div className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar p-1">
                          {INTENT_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                            const isChecked = intentCategories.includes(cat.id);
                            return (
                              <label
                                key={cat.id}
                                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                  isChecked
                                    ? "bg-navy text-teal font-bold shadow-xs"
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      setIntentCategories((prev) =>
                                        isChecked ? prev.filter((id) => id !== cat.id) : [...prev, cat.id]
                                      );
                                      setPage(1);
                                    }}
                                    className="rounded text-teal-dark focus:ring-teal-dark w-3.5 h-3.5 accent-[#0d9488]"
                                  />
                                  <span className="truncate">{cat.label}</span>
                                </div>
                                {isChecked && <Check className="w-3.5 h-3.5 text-teal shrink-0" />}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

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
                  <div className={`flex-1 overflow-x-auto overflow-y-auto ${fullListView ? "min-h-[640px] h-[calc(100vh-105px)]" : "min-h-[480px] h-[calc(100vh-175px)]"} custom-scrollbar rounded-2xl border border-slate-200 bg-white shadow-xs`}>
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
                      <table className="w-full text-left border-collapse text-xs">
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
                            {visibleColumns.decisionMaker && <th className="p-3 min-w-[220px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Decision Maker</th>}
                            {visibleColumns.company && <th className="p-3 min-w-[180px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Company &amp; Industry</th>}
                            {visibleColumns.location && <th className="p-3 min-w-[130px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Location</th>}
                            {visibleColumns.icpScore && <th className="p-3 min-w-[100px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">ICP Score</th>}
                            {visibleColumns.reachability && <th className="p-3 min-w-[200px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Reachability</th>}
                            {visibleColumns.departments && <th className="p-3 min-w-[150px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Department &amp; Function</th>}
                            {visibleColumns.directPhone && <th className="p-3 min-w-[130px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Direct Phone</th>}
                            {visibleColumns.corpPhone && <th className="p-3 min-w-[130px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Corp HQ Phone</th>}
                            {visibleColumns.revenue && <th className="p-3 min-w-[110px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Revenue</th>}
                            {visibleColumns.employees && <th className="p-3 min-w-[110px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Employees</th>}
                            {visibleColumns.linkedin && <th className="p-3 min-w-[120px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">LinkedIn URL</th>}
                            {visibleColumns.website && <th className="p-3 min-w-[120px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Website</th>}
                            {visibleColumns.ownership && <th className="p-3 min-w-[100px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Ownership</th>}
                            {visibleColumns.actions && <th className="p-3 text-right min-w-[140px] sticky top-0 bg-[#0B132B] text-slate-200 z-20 border-b border-slate-700">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {prospects.map((p) => {
                            const isSelected = selectedIds.includes(p.id);
                            const isRevealed = Boolean(revealedContacts[p.id]) || Boolean(p.isUnlocked) || Boolean(p.isRevealed) || currentUser?.role === "admin" || isCEOUser;
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
                                      {(() => {
                                        const sig = p.intentSignal || getProspectIntentSignal(p);
                                        if (!sig) return null;
                                        return (
                                          <>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedIntentProspect({ ...p, intentSignal: sig });
                                              }}
                                              className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal/15 text-teal-dark hover:bg-teal/25 border border-teal/30 transition-colors cursor-pointer"
                                              title={`Intent: ${sig.headline} (${sig.recencyDays}d ago). Click for Opportunity Brief.`}
                                            >
                                              <Zap className="w-2.5 h-2.5 text-teal-dark shrink-0" />
                                              <span className="truncate max-w-[120px]">{sig.categoryLabel}</span>
                                              <span className="text-[9px] opacity-75 font-mono">({sig.recencyDays}d)</span>
                                            </button>
                                            {sig.webPlatform && (
                                              <span
                                                className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200"
                                                title={`Web Source: ${WEB_INTENT_PLATFORMS.find((w) => w.id === sig.webPlatform)?.label || "Web"}`}
                                              >
                                                <span>{WEB_INTENT_PLATFORMS.find((w) => w.id === sig.webPlatform)?.icon || "🌐"}</span>
                                                <span>{WEB_INTENT_PLATFORMS.find((w) => w.id === sig.webPlatform)?.label || "Web"}</span>
                                              </span>
                                            )}
                                          </>
                                        );
                                      })()}
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
                                            <CheckCircle className="w-3 h-3 text-emerald-600" />
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
                                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                            <Lock className="w-2.5 h-2.5 text-slate-400" />
                                            <span>Masked</span>
                                          </span>
                                          <span className="font-mono text-xs text-slate-400 select-none tracking-wider">
                                            {p.maskedEmail || (p.email && p.email.includes("@") ? `${p.email.charAt(0)}***@${p.email.split("@")[1]}` : "j***@company.com")}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                          <Phone className="w-3 h-3 text-slate-300 shrink-0" />
                                          <span className="font-mono select-none tracking-wider">
                                            {p.maskedPhone || "+91 987*****"}
                                          </span>
                                        </div>
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
                                  <td className="py-2.5 px-3.5 text-right bg-white">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {!isRevealed ? (
                                        <button
                                          onClick={() => handleRevealContact(p)}
                                          disabled={revealingId === p.id}
                                          className="px-3 py-1.5 rounded-xl bg-teal/20 hover:bg-teal text-navy text-[11px] font-extrabold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs hover:shadow-xs"
                                        >
                                          {revealingId === p.id ? (
                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                          ) : (
                                            <Key className="w-3 h-3 text-teal-dark" />
                                          )}
                                          <span>Unlock Contact (1 Cr)</span>
                                        </button>
                                      ) : (
                                        <div className="flex items-center gap-1.5">
                                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-200 shadow-2xs">
                                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                                            <span>✓ Unlocked</span>
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSelectedIds([p.id]);
                                              setListModalOpen(true);
                                            }}
                                            title="Save to list"
                                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-navy cursor-pointer transition-colors"
                                          >
                                            <BookmarkPlus className="w-3.5 h-3.5 text-teal-dark" />
                                          </button>
                                        </div>
                                      )}
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

          {/* ================= STAGE 2: MY SAVED LEADS & QUALIFICATION ================= */}
          {activeNav === "lists" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-6">
              {/* Header & Main Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/10 text-teal-dark font-bold text-[10px] uppercase tracking-wider mb-1">
                    My Saved Contacts &bull; Stage 2 of 3
                  </div>
                  <h1 className="text-2xl font-extrabold text-navy">My Saved Leads</h1>
                  <p className="text-xs text-text-muted mt-1 max-w-2xl">
                    All contacts you have unlocked with verified direct emails and phone numbers. You own these contacts permanently and are never charged twice to access or export them.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveNav("discover")}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-teal-dark" />
                    <span>Search Directory (85k+)</span>
                  </button>
                  <button
                    onClick={handleExportUnlockedLeads}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Unlocked Leads (CSV)</span>
                  </button>
                </div>
              </div>

              {/* KPI Breakdown Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Unlocked Contacts</p>
                  <p className="text-2xl font-extrabold text-teal-dark mt-0.5">{savedLeads.length}</p>
                  <span className="text-[10px] text-slate-400">Permanently saved to your account</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Available Credits</p>
                  <p className="text-2xl font-extrabold text-navy mt-0.5 flex items-center gap-1">
                    <Coins className="w-4 h-4 text-teal-dark" />
                    <span>{credits}</span>
                  </p>
                  <span className="text-[10px] text-slate-400">1 credit = 1 verified contact reveal</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Verification Rate</p>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">100%</p>
                  <span className="text-[10px] text-emerald-700 font-semibold">SMTP + MX Handshake</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Re-Reveal Policy</p>
                  <p className="text-base font-extrabold text-navy mt-1">0 Credits Charged</p>
                  <span className="text-[10px] text-slate-400">Never pay twice for a contact</span>
                </div>
              </div>

              {/* Search & Filter Bar for Saved Leads */}
              {savedLeads.length > 0 && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter saved leads by name, job title, company, industry, or city..."
                      value={savedLeadsSearch}
                      onChange={(e) => setSavedLeadsSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-xs text-text-muted px-1">
                    <span>
                      Showing <strong>{savedLeads.filter((p) => {
                        if (!savedLeadsSearch.trim()) return true;
                        const q = savedLeadsSearch.toLowerCase();
                        return (
                          (p.name && p.name.toLowerCase().includes(q)) ||
                          (p.title && p.title.toLowerCase().includes(q)) ||
                          (p.company && p.company.toLowerCase().includes(q)) ||
                          (p.industry && p.industry.toLowerCase().includes(q)) ||
                          (p.city && p.city.toLowerCase().includes(q)) ||
                          (p.email && p.email.toLowerCase().includes(q))
                        );
                      }).length}</strong> of {savedLeads.length} unlocked contacts
                    </span>
                  </div>
                </div>
              )}

              {/* Unlocked Contacts Table or Empty State */}
              {savedLeads.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 sm:p-16 text-center shadow-xs space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal/10 text-teal-dark flex items-center justify-center mx-auto shadow-inner">
                    <Coins className="w-7 h-7" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="text-lg font-bold text-navy">You haven&apos;t unlocked any leads yet</h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      You have <strong>{credits} free credits</strong> ready to use! Browse our validated directory of 85,000+ B2B decision-makers, click &quot;Unlock Contact&quot;, and your verified contacts will appear here permanently.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveNav("discover")}
                      className="px-5 py-2.5 rounded-xl bg-navy hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-2"
                    >
                      <Search className="w-4 h-4 text-teal" />
                      <span>Search Lead Directory (85,000+ Leads)</span>
                    </button>
                    <Link
                      href="/pricing"
                      className="px-4 py-2.5 rounded-xl bg-teal/15 hover:bg-teal/25 text-teal-dark text-xs font-bold cursor-pointer transition-all"
                    >
                      View Pricing Plans
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#0B132B] text-slate-200 font-bold uppercase text-[11px] tracking-wider">
                        <tr>
                          <th className="p-3">Decision Maker</th>
                          <th className="p-3">Company &amp; Industry</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Verified Work Email</th>
                          <th className="p-3">Verified Direct Dial</th>
                          <th className="p-3">LinkedIn</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {savedLeads
                          .filter((p) => {
                            if (!savedLeadsSearch.trim()) return true;
                            const q = savedLeadsSearch.toLowerCase();
                            return (
                              (p.name && p.name.toLowerCase().includes(q)) ||
                              (p.title && p.title.toLowerCase().includes(q)) ||
                              (p.company && p.company.toLowerCase().includes(q)) ||
                              (p.industry && p.industry.toLowerCase().includes(q)) ||
                              (p.city && p.city.toLowerCase().includes(q)) ||
                              (p.email && p.email.toLowerCase().includes(q))
                            );
                          })
                          .map((p) => {
                            const activeEmail = revealedContacts[p.id]?.email || p.email;
                            const activePhone = revealedContacts[p.id]?.phone || p.phone;

                            return (
                              <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="p-3">
                                  <p className="font-bold text-navy">{p.name}</p>
                                  <p className="text-[11px] text-text-muted mt-0.5">{p.title}</p>
                                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium mt-1 inline-block">
                                    {p.seniority || "Decision Maker"}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <p className="font-semibold text-navy">{p.company}</p>
                                  <p className="text-[11px] text-text-muted">{p.industry}</p>
                                  <span className="text-[10px] text-slate-400">
                                    {p.employeeRange || "10-250 emps"} &bull; {p.revenueRange || "$10M-$50M"}
                                  </span>
                                </td>
                                <td className="p-3 text-text-muted">
                                  <p className="font-medium text-navy">{p.city || p.location}</p>
                                  <p className="text-[10px] text-slate-400">{p.country || "United States"}</p>
                                </td>
                                <td className="p-3 font-mono text-[11px]">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-navy select-all">{activeEmail}</span>
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
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-1">
                                    <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                                    <span>SMTP Handshake Verified</span>
                                  </span>
                                </td>
                                <td className="p-3 font-mono text-[11px]">
                                  {activePhone ? (
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-semibold text-slate-700 select-all">{activePhone}</span>
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
                                  ) : (
                                    <span className="text-slate-400 italic">HQ Direct Available</span>
                                  )}
                                </td>
                                <td className="p-3">
                                  {p.linkedin ? (
                                    <a
                                      href={p.linkedin}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-teal-dark hover:underline flex items-center gap-1 text-xs"
                                    >
                                      <LinkedInIcon className="w-3.5 h-3.5" />
                                      <span>Profile</span>
                                    </a>
                                  ) : (
                                    <span className="text-slate-400">&mdash;</span>
                                  )}
                                </td>
                                <td className="p-3 text-right">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    <span>✓ Unlocked (0 Cr)</span>
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-text-muted">
                      Need to export these leads for outreach in HubSpot, Salesforce, or Apollo?
                    </span>
                    <button
                      type="button"
                      onClick={handleExportUnlockedLeads}
                      className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export All {savedLeads.length} Unlocked Leads (CSV)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Qualification Lists Section */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-navy text-base">Custom Target Lists ({userLists.length})</h3>
                    <p className="text-xs text-text-muted">Organize your prospects into segmented campaign lists.</p>
                  </div>
                  <button
                    onClick={() => setListModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New List</span>
                  </button>
                </div>

                {userLists.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-4">
                    {userLists.map((l) => (
                      <div
                        key={l.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-navy text-sm">{l.name}</h4>
                            <span className="text-[10px] font-extrabold text-teal-dark bg-teal/10 px-2 py-0.5 rounded-full">
                              {l.prospectIds.length} leads
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mt-1 leading-relaxed">
                            {l.description || "Target list created from Discover"}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedIds(l.prospectIds);
                              setActiveNav("discover");
                              showToast(`Loaded ${l.prospectIds.length} prospects from "${l.name}"`);
                            }}
                            className="text-xs font-bold text-navy hover:text-teal-dark cursor-pointer flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={async () => {
                              const res = await fetch(
                                `/api/lists?listId=${l.id}&userEmail=${encodeURIComponent(currentUser?.email || "")}`,
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= STAGE 3: ENRICH & VERIFY (ADMIN ONLY) ================= */}
          {activeNav === "enrich" && (
            !(currentUser?.role === "admin" || isCEOUser) ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
                      Admin Access Only
                    </span>
                    <h2 className="text-2xl font-extrabold text-navy">
                      Data Quality &amp; Enrichment Engine
                    </h2>
                    <p className="text-xs text-text-muted leading-relaxed">
                      The live multi-source web scraper, real-time SMTP handshaking, and raw database enrichment pipeline are strictly restricted to <strong>LeadIntellect Administrators</strong>.
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      As a customer, you can search our <strong>85,000+ verified B2B lead directory</strong> and unlock verified contacts using your 10 free credits.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveNav("discover")}
                      className="px-5 py-2.5 rounded-xl bg-teal text-navy font-bold text-xs hover:bg-teal-dark hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search Lead Directory</span>
                    </button>
                    <button
                      onClick={() => setActiveNav("lists")}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 text-navy font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <BookmarkPlus className="w-4 h-4 text-teal-dark" />
                      <span>View My Saved Leads ({savedLeads.length})</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/10 text-teal-dark font-bold text-[10px] uppercase tracking-wider mb-1">
                    Workflow Stage 3 of 3
                  </div>
                  <h1 className="text-2xl font-extrabold text-navy">Enrich &amp; Verify Contact Details</h1>
                  <p className="text-xs text-text-muted mt-1">
                    Reveal verified work emails and direct dials through our multi-source verification engine with transparent credit deduction.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportProspectsAsCsv(activeEnrichListProspects)}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Verified Leads (CSV)</span>
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

                            {/* Stage 3 List Filter & Batch Verification Bar */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-navy">Filter Target List:</label>
                  <select
                    value={enrichSelectedListId}
                    onChange={(e) => setEnrichSelectedListId(e.target.value)}
                    className="text-xs font-semibold p-2 rounded-lg bg-slate-50 border border-slate-200 text-navy cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-dark"
                  >
                    <option value="all">All Discovered Leads ({prospects.length})</option>
                    {userLists.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.prospectIds.length} leads)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={enrichingListLoading || activeEnrichListProspects.length === 0}
                    onClick={handleBatchEnrichList}
                    className="px-3.5 py-2 bg-teal hover:bg-teal-dark hover:text-white text-navy rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-2xs"
                  >
                    {enrichingListLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    <span>⚡ Batch Reveal All ({activeEnrichListProspects.filter((p) => !revealedContacts[p.id]).length} Unlocked)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportProspectsAsCsv(activeEnrichListProspects);
                    }}
                    className="px-4 py-2 bg-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Verified Contacts (CSV)</span>
                  </button>
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
                      {(activeEnrichListProspects.length > 0 ? activeEnrichListProspects.slice(0, 15) : []).map((p) => {
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
                    Ready to organize or export your verified contacts into targeted lists?
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveNav("lists")}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Lists &amp; Qualification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            )
          )}

          {/* ================= 4. INTELLIGENCE TAB (Requirement 8) ================= */}
          {activeNav === "intelligence" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-6">
              {/* Header & Definition Banner */}
              <div className="rounded-2xl border border-teal/20 bg-gradient-to-r from-teal/10 via-white to-indigo-50/40 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-dark bg-white border border-teal/20 px-3 py-1 rounded-full mb-2">
                      <Zap className="w-3.5 h-3.5 text-teal-dark" />
                      AI WHOLE-WEB BUYER INTENT ENGINE
                    </div>
                    <h1 className="text-2xl font-extrabold text-navy">
                      Account Intelligence &amp; In-Market Signals
                    </h1>
                    <p className="text-xs sm:text-sm text-text-muted mt-1.5 max-w-3xl leading-relaxed">
                      LeadIntellect monitors 25,000+ monitored accounts across 7 verified intent vectors. Identify decision-makers at companies actively searching, expanding headcount, or re-evaluating software stacks before competitors reach them.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiOrchestratorOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-dark via-teal to-teal text-navy font-bold text-xs shadow-md hover:brightness-105 transition-all cursor-pointer shrink-0 self-start sm:self-center"
                  >
                    <Sparkles className="w-4 h-4 text-navy" />
                    <span>Run AI Orchestrator</span>
                  </button>
                </div>

                {/* Intelligence Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-400">High-Surge Accounts</p>
                    <p className="text-xl font-extrabold text-teal-dark mt-1">
                      {intelligenceSummary?.totalSurging || intelligenceAccounts.length || 80} Accounts
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Monitored ICP Universe</p>
                    <p className="text-xl font-extrabold text-navy mt-1">25,022 Accounts</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Active Intent Categories</p>
                    <p className="text-xl font-extrabold text-indigo-600 mt-1">7 Categories</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Avg In-Market Surge</p>
                    <p className="text-xl font-extrabold text-emerald-600 mt-1">
                      {intelligenceSummary?.avgSurgeScore || 91.4} / 100
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs: Intent Surges, Signals Feed, Predictive ICP Matrix */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {[
                  { id: "intent" as const, label: `Surging Buyer Intent (${intelligenceAccounts.length || 80})`, icon: Zap },
                  { id: "signals" as const, label: `Live Signals Stream (${intelligenceSignals.length || 25})`, icon: TrendingUp },
                  { id: "icp" as const, label: "Predictive ICP Matrix", icon: Target },
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
                  {/* Category Pills & Filter Controls */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Filter accounts by company name, domain, or industry..."
                          value={intelligenceQuery}
                          onChange={(e) => setIntelligenceQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Recency:</span>
                        <select
                          value={intelligenceRecency}
                          onChange={(e) => setIntelligenceRecency(Number(e.target.value))}
                          aria-label="Filter intent by recency window"
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-navy font-semibold focus:outline-hidden focus:border-teal"
                        >
                          <option value="14">&lt; 14 Days (Real-Time)</option>
                          <option value="30">&lt; 30 Days (Active)</option>
                          <option value="60">&lt; 60 Days (Developing)</option>
                          <option value="90">All Windows (&lt; 90 Days)</option>
                        </select>
                      </div>
                    </div>

                    {/* Intent Category Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                      {[
                        { id: "all", label: "All Intent Signals" },
                        { id: "job_change", label: "⚡ Executive Moves (<90d)" },
                        { id: "promotion", label: "💼 Leadership Promotions" },
                        { id: "hiring", label: "👥 Hiring Surges" },
                        { id: "funding_growth", label: "🚀 Funding & Expansion" },
                        { id: "tech_adoption", label: "🔧 Technographic Shifts" },
                        { id: "g2_buyer_intent", label: "📊 G2.com Buyer Intent" },
                        { id: "community_pain_point", label: "💬 Community Pain Points" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setIntelligenceCategory(cat.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            intelligenceCategory === cat.id
                              ? "bg-teal text-navy shadow-2xs font-extrabold"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accounts Table */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                    {intelligenceLoading ? (
                      <div className="p-12 text-center space-y-3">
                        <div className="inline-block w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-text-muted font-semibold">
                          Scanning whole-web telemetry &amp; live intent signals...
                        </p>
                      </div>
                    ) : intelligenceAccounts.length === 0 ? (
                      <div className="p-12 text-center space-y-3">
                        <Zap className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-sm font-bold text-navy">No surging accounts matching active filters</p>
                        <p className="text-xs text-text-muted">
                          Try resetting your category or recency window to view more in-market accounts.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIntelligenceCategory("all");
                            setIntelligenceRecency(90);
                            setIntelligenceQuery("");
                          }}
                          className="px-4 py-1.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-text-muted font-bold tracking-wider text-[11px] uppercase">
                          <tr>
                            <th className="p-3.5">Company &amp; Domain</th>
                            <th className="p-3.5">Intent Surge Score</th>
                            <th className="p-3.5">Surging Topics &amp; Telemetry</th>
                            <th className="p-3.5">7-Day Velocity</th>
                            <th className="p-3.5">Decision Makers</th>
                            <th className="p-3.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {intelligenceAccounts.map((acc: any) => (
                            <tr key={acc.id || acc.domain} className="hover:bg-slate-50/70 transition-colors">
                              <td className="p-3.5">
                                <p className="font-bold text-navy text-sm">{acc.name}</p>
                                <p className="text-[11px] text-text-muted">
                                  {acc.industry} &middot; <span className="font-mono text-slate-500">{acc.domain}</span>
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {acc.employeeRange} emps &middot; {acc.revenueRange}
                                </p>
                              </td>
                              <td className="p-3.5">
                                <div className="space-y-1">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200">
                                    <Zap className="w-3 h-3 text-emerald-600" />
                                    <span>{acc.surgeScore} / 100 In-Market</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                    <span className="truncate max-w-[150px]">{acc.categoryLabel}</span>
                                    <span>&middot;</span>
                                    <span className="font-mono">{acc.recencyDays}d ago</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <p className="text-[11px] font-semibold text-navy truncate max-w-xs" title={acc.headline}>
                                  {acc.headline}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {acc.topics?.map((tp: string) => (
                                    <span key={tp} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                      {tp}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3.5 font-bold text-teal-dark">{acc.velocity}</td>
                              <td className="p-3.5">
                                <span className="font-bold text-navy">{acc.decisionMakerCount} Verified Leaders</span>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {acc.lead && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedIntentProspect(acc.lead)}
                                      className="px-2.5 py-1.5 rounded-xl bg-teal/15 hover:bg-teal/25 text-teal-dark font-bold text-xs border border-teal/30 flex items-center gap-1 cursor-pointer transition-colors"
                                      title="Open verified 6-point Opportunity Brief"
                                    >
                                      <Zap className="w-3 h-3 text-teal-dark" />
                                      <span className="hidden sm:inline">Brief</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCompanyFilter(acc.name);
                                      setDiscoverMode("people");
                                      setPage(1);
                                      setActiveNav("discover");
                                      showToast(`Filtered ${acc.decisionMakerCount} verified decision-makers at ${acc.name}`);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-2xs transition-colors shrink-0"
                                  >
                                    <span>Prospect</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* View 2: Live Market Signals Feed */}
              {intelligenceTab === "signals" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs divide-y divide-slate-100">
                    {intelligenceSignals.map((sig: any, idx: number) => (
                      <div key={sig.id || idx} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-navy text-sm">{sig.company}</span>
                            <span className="text-[11px] text-text-muted">&middot; {sig.industry}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal/15 text-teal-dark border border-teal/30">
                              {sig.categoryLabel}
                            </span>
                          </div>
                          <p className="text-xs text-navy font-bold">{sig.headline}</p>
                          <p className="text-xs text-slate-600 italic">&ldquo;{sig.event}&rdquo;</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                            <span>{sig.timeAgo}</span>
                            <span>&middot;</span>
                            <span>Source: {sig.sourceProvider}</span>
                            {sig.decisionMaker && (
                              <>
                                <span>&middot;</span>
                                <span className="font-medium text-slate-600">
                                  Decision Maker: {sig.decisionMaker.name} ({sig.decisionMaker.title})
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {sig.lead && (
                            <>
                              <button
                                type="button"
                                onClick={() => setSelectedIntentProspect(sig.lead)}
                                className="px-3 py-1.5 rounded-xl bg-teal/15 hover:bg-teal/25 text-teal-dark font-bold text-xs border border-teal/30 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Zap className="w-3 h-3 text-teal-dark" />
                                <span>Opportunity Brief</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOutreachProspect(sig.lead);
                                  setActiveNav("outreach");
                                }}
                                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-600" />
                                <span>AI Outreach</span>
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setCompanyFilter(sig.company);
                              setDiscoverMode("people");
                              setPage(1);
                              setActiveNav("discover");
                              showToast(`Filtered decision-makers at ${sig.company}`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-navy hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors"
                          >
                            Prospect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View 3: Predictive ICP Matrix */}
              {intelligenceTab === "icp" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                    <h3 className="font-bold text-navy text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-teal-dark" />
                      ICP Propensity Breakdown (25,022 Accounts)
                    </h3>
                    <div className="space-y-4">
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
                      Top Technographic Signals Detected
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { name: "Salesforce CRM", count: "3,890 companies", query: "Salesforce" },
                        { name: "AWS Cloud", count: "4,120 companies", query: "AWS" },
                        { name: "Snowflake / Databricks", count: "1,480 companies", query: "Snowflake" },
                        { name: "HubSpot Marketing", count: "2,640 companies", query: "HubSpot" },
                        { name: "Microsoft Azure", count: "3,150 companies", query: "Azure" },
                        { name: "Workday HCM", count: "1,290 companies", query: "Workday" },
                      ].map((tech) => (
                        <div
                          key={tech.name}
                          onClick={() => {
                            setQuery(tech.query);
                            setPage(1);
                            setActiveNav("discover");
                            showToast(`Searching accounts using ${tech.name}`);
                          }}
                          className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group"
                        >
                          <p className="font-bold text-navy group-hover:text-indigo-700">{tech.name}</p>
                          <p className="text-text-muted mt-0.5">{tech.count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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

              {/* Buyer Intent & Intelligence Signal */}
              {(() => {
                const sig = activeProfile.intentSignal || getProspectIntentSignal(activeProfile);
                if (!sig) return null;
                return (
                  <div className="p-3 rounded-xl border border-teal/20 bg-gradient-to-r from-teal/10 to-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-teal-dark shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-teal-dark">Verified In-Market Intent</span>
                        <p className="text-xs font-bold text-navy truncate max-w-[220px]">{sig.headline || sig.categoryLabel}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedIntentProspect({ ...activeProfile, intentSignal: sig })}
                      className="text-[10px] font-bold bg-teal text-navy px-2.5 py-1 rounded-md hover:bg-teal-light cursor-pointer shadow-2xs shrink-0"
                    >
                      Opportunity Brief
                    </button>
                  </div>
                );
              })()}

              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                  <p className="font-semibold text-navy mt-0.5">
                    {activeProfile.city ? `${activeProfile.city}, ` : ""}{activeProfile.state ? `${activeProfile.state}, ` : ""}{activeProfile.country || "United States"}
                  </p>
                  {activeProfile.streetAddress && (
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{activeProfile.streetAddress}</p>
                  )}
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Seniority &amp; Tier</span>
                  <p className="font-semibold text-navy mt-0.5">{activeProfile.seniority}</p>
                  <span className="text-[10px] font-bold text-teal-dark">{activeProfile.icpTier} ({activeProfile.icpScore}/100)</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Company Size</span>
                  <p className="font-semibold text-navy mt-0.5">{activeProfile.employeeRange} Employees</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Annual Revenue</span>
                  <p className="font-semibold text-navy mt-0.5">{activeProfile.revenueRange}</p>
                </div>
                {activeProfile.subIndustry && (
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Sub-Industry / Focus</span>
                    <p className="font-semibold text-navy mt-0.5 truncate">{activeProfile.subIndustry}</p>
                  </div>
                )}
                {activeProfile.reportsTo && (
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Reports To</span>
                    <p className="font-semibold text-navy mt-0.5 truncate">{activeProfile.reportsTo}</p>
                  </div>
                )}
                {activeProfile.corpPhone && (
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Corp HQ Switchboard</span>
                    <p className="font-mono text-xs font-semibold text-navy mt-0.5">{activeProfile.corpPhone}</p>
                  </div>
                )}
                {activeProfile.faxNumber && (
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Fax Number</span>
                    <p className="font-mono text-xs font-semibold text-navy mt-0.5">{activeProfile.faxNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedIds([activeProfile.id]);
                  setListModalOpen(true);
                  setActiveProfile(null);
                }}
                className="flex-1 py-2.5 bg-navy text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-800 transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <BookmarkPlus className="w-4 h-4 text-teal" />
                <span>Save to List</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  exportProspectsAsCsv([activeProfile]);
                  setActiveProfile(null);
                }}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-xs font-bold text-navy rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Export Contact</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE LIST ================= */}
      {listModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200 relative">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <BookmarkPlus className="w-4 h-4 text-teal-dark" />
                <span>Create New Prospect List</span>
              </h3>
              <button
                type="button"
                onClick={() => setListModalOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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

                {/* FIT & CONFIDENCE: 4 INDEPENDENT DIMENSIONS */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-navy text-[11px] uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>FIT &middot; 4 Independent Score Dimensions</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center pt-0.5">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 text-[9px] uppercase font-semibold">ICP Fit</div>
                      <div className="font-extrabold text-navy">{p.icpScore}/100</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 text-[9px] uppercase font-semibold">Intent</div>
                      <div className="font-extrabold text-teal-dark">{sig.confidence}%</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 text-[9px] uppercase font-semibold">Contact</div>
                      <div className="font-extrabold text-indigo-700">{p.emailConfidence || 85}%</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 text-[9px] uppercase font-semibold">Freshness</div>
                      <div className="font-extrabold text-amber-700">{sig.recencyDays}d</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-0.5">
                    Email deliverability: <strong className="text-navy">{p.emailStatus}</strong> &middot; Phone: <strong className="text-navy">{p.phoneType}</strong>
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
                    setSelectedIds([p.id]);
                    setListModalOpen(true);
                    setSelectedIntentProspect(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-xs flex items-center gap-2 transition-all"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Save to Target List</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================= MODAL: AI INTELLIGENCE ORCHESTRATOR ================= */}
      {aiOrchestratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-navy via-slate-900 to-navy text-white flex items-start justify-between border-b border-slate-800 shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/20 text-teal font-extrabold text-[11px] uppercase tracking-wider border border-teal/30">
                  <Bot className="w-3.5 h-3.5 text-teal" />
                  <span>AI Intelligence Orchestration &amp; Multi-Agent Pipeline</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2 pt-1">
                  <span>Goal-Driven B2B Prospecting &amp; Intent Synthesis</span>
                  <Sparkles className="w-4 h-4 text-accent" />
                </h2>
                <p className="text-xs text-slate-300">
                  Autonomous 7-Agent coordination: Natural Language Objective Interpreter, Deterministic Database Filter, Intent Correlator, ICP Qualification, SMTP Verification, and Explainable Opportunity Briefs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAiOrchestratorOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Prompt Input Box */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                  State Your Prospecting Objective in Plain English:
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={aiOrchestratorQuery}
                      onChange={(e) => setAiOrchestratorQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRunOrchestrator();
                        }
                      }}
                      placeholder="e.g. Find VP of Engineering at series B tech companies in California hiring in the last 30 days"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-dark"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={aiOrchestrating}
                    onClick={() => handleRunOrchestrator()}
                    className="px-5 py-3 rounded-2xl bg-teal hover:bg-teal-dark text-navy hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    {aiOrchestrating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Orchestrating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run Pipeline</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Prompts:</span>
                  {[
                    "Series B tech companies hiring engineering leads in California",
                    "C-Suite in Healthcare evaluating software on G2",
                    "Founders of funded Fintech startups (<60 days)",
                    "Sales Directors with verified mobile numbers in Texas",
                  ].map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleRunOrchestrator(p)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal/15 hover:text-teal-dark text-slate-600 transition-colors border border-slate-200 font-medium cursor-pointer"
                    >
                      &ldquo;{p}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-Agent Execution Telemetry Row */}
              {orchestratorResult?.agents && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-teal-dark" />
                      <span>7 Specialist Agents Execution Telemetry ({orchestratorResult.timingMs}ms)</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ All Agents Coordinated
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {[
                      { name: "Discovery", icon: Search, desc: "Master DB Search" },
                      { name: "Intent", icon: Zap, desc: "Buying Signals" },
                      { name: "Research", icon: Globe, desc: "Evidence Synthesis" },
                      { name: "Enrichment", icon: Database, desc: "Contact Coordinates" },
                      { name: "Qualification", icon: Target, desc: "ICP Fit Scoring" },
                      { name: "Verification", icon: ShieldCheck, desc: "SMTP Handshake" },
                      { name: "Ranking", icon: BarChart3, desc: "Multi-Dimension Rank" },
                    ].map((agent, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                        <agent.icon className="w-3.5 h-3.5 text-teal-dark mx-auto" />
                        <div className="text-[10px] font-bold text-navy truncate">{agent.name}</div>
                        <div className="text-[9px] text-slate-400 truncate">{agent.desc}</div>
                        <span className="inline-block text-[9px] font-extrabold text-emerald-600">Active</span>
                      </div>
                    ))}
                  </div>

                  {orchestratorResult.interpretedCriteria?.explanation && (
                    <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Interpreted Goal: </span>
                        <span>{orchestratorResult.interpretedCriteria.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Results & Explainable Opportunity Brief */}
              {orchestratorResult?.results && orchestratorResult.results.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-navy">
                        Ranked Opportunities Discovered ({orchestratorResult.results.length} leads)
                      </h3>
                      <p className="text-xs text-text-muted">
                        Each candidate is ranked across 4 independent dimensions with full 6-point Opportunity Briefs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyOrchestratorCriteria(orchestratorResult.interpretedCriteria)}
                      className="px-3 py-1.5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Filter className="w-3 h-3" />
                      <span>Apply to Search Table</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Left Column: Ranked Candidates List */}
                    <div className="md:col-span-5 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {orchestratorResult.results.map((item: any, i: number) => {
                        const isSelected = orchestratorSelectedLead?.prospect?.id === item.prospect.id;
                        return (
                          <div
                            key={i}
                            onClick={() => setOrchestratorSelectedLead(item)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                              isSelected
                                ? "bg-teal/10 border-teal shadow-xs ring-1 ring-teal"
                                : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-bold text-navy truncate">{item.prospect.name}</div>
                                <div className="text-[11px] text-slate-500 truncate">{item.prospect.title}</div>
                                <div className="text-[10px] font-semibold text-slate-600 truncate">
                                  {item.prospect.company} &middot; {item.prospect.city}, {item.prospect.state}
                                </div>
                              </div>
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-navy text-white shrink-0">
                                #{i + 1} &middot; {item.scores.compositeScore}%
                              </span>
                            </div>

                            {/* 4 Independent Score Cards */}
                            <div className="grid grid-cols-4 gap-1 text-[9px] text-center pt-1 border-t border-slate-100">
                              <div className="p-1 rounded bg-slate-100">
                                <div className="text-slate-400">ICP</div>
                                <div className="font-bold text-navy">{item.scores.icpScore}/100</div>
                              </div>
                              <div className="p-1 rounded bg-slate-100">
                                <div className="text-slate-400">Intent</div>
                                <div className="font-bold text-teal-dark">{item.scores.intentScore}%</div>
                              </div>
                              <div className="p-1 rounded bg-slate-100">
                                <div className="text-slate-400">Confidence</div>
                                <div className="font-bold text-indigo-700">{item.scores.contactConfidence}%</div>
                              </div>
                              <div className="p-1 rounded bg-slate-100">
                                <div className="text-slate-400">Freshness</div>
                                <div className="font-bold text-amber-700">{item.scores.signalFreshnessDays}d</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Column: 6-Point Opportunity Brief */}
                    <div className="md:col-span-7 bg-slate-50 rounded-2xl p-4 border border-slate-200 max-h-[380px] overflow-y-auto space-y-3">
                      {orchestratorSelectedLead ? (
                        <>
                          <div className="flex items-start justify-between pb-2 border-b border-slate-200">
                            <div>
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal/20 text-teal-dark font-extrabold text-[9px] uppercase tracking-wider mb-1">
                                <Zap className="w-2.5 h-2.5" />
                                <span>Explainable Opportunity Brief</span>
                              </div>
                              <h4 className="text-sm font-extrabold text-navy">
                                {orchestratorSelectedLead.prospect.name} &middot; {orchestratorSelectedLead.prospect.title}
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                {orchestratorSelectedLead.prospect.company} &middot; {orchestratorSelectedLead.prospect.industry}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedIntentProspect(orchestratorSelectedLead.prospect);
                              }}
                              className="text-[11px] font-bold text-teal-dark hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <span>Full Modal</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>

                          {/* 6 Sections: WHO, WHY, SIGNAL, PAIN, FIT, NEXT */}
                          <div className="space-y-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-0.5">
                              <span className="font-extrabold text-navy text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <UserCheck className="w-3 h-3 text-teal-dark" />
                                <span>WHO &middot; Authority Profile</span>
                              </span>
                              <p className="text-slate-600 text-[11px]">
                                {orchestratorSelectedLead.brief.who.buyingAuthorityRole} at {orchestratorSelectedLead.brief.who.companyName} ({orchestratorSelectedLead.brief.who.employeeRange} employees, {orchestratorSelectedLead.brief.who.revenueRange}).
                              </p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-0.5">
                              <span className="font-extrabold text-navy text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <Target className="w-3 h-3 text-indigo-600" />
                                <span>WHY &middot; Commercial Rationale</span>
                              </span>
                              <p className="text-slate-600 text-[11px]">
                                {orchestratorSelectedLead.brief.why.commercialRationale}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-teal/10 border border-teal/30 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-teal-dark text-[10px] uppercase tracking-wider flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  <span>SIGNAL &middot; Corroborated Market Evidence</span>
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-navy border border-teal/20">
                                  {orchestratorSelectedLead.brief.signal.recencyDays}d ago &middot; {orchestratorSelectedLead.brief.signal.freshnessTier}
                                </span>
                              </div>
                              <p className="text-slate-700 text-[11px] font-medium leading-relaxed">
                                {orchestratorSelectedLead.brief.signal.description}
                              </p>
                              <div className="text-[10px] text-slate-500 italic bg-white/80 p-1.5 rounded border border-teal/15">
                                {orchestratorSelectedLead.brief.signal.evidenceQuote}
                              </div>
                              {orchestratorSelectedLead.brief.signal.sourceUrl && (
                                <a
                                  href={orchestratorSelectedLead.brief.signal.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-dark hover:underline pt-0.5"
                                >
                                  <span>Source: {orchestratorSelectedLead.brief.signal.sourceProvider}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>

                            <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                              <span className="font-extrabold text-navy text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <Award className="w-3 h-3 text-emerald-600" />
                                <span>FIT &middot; Matched vs Missing Criteria</span>
                              </span>
                              <div className="space-y-1 pt-0.5">
                                {orchestratorSelectedLead.brief.fit.matchedCriteria.map((m: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium">
                                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                                    <span>{m}</span>
                                  </div>
                                ))}
                                {orchestratorSelectedLead.brief.fit.missingCriteria.map((m: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-[10px] text-amber-600 font-medium">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    <span>{m}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-navy text-[10px] uppercase tracking-wider flex items-center gap-1">
                                  <ArrowRight className="w-3 h-3 text-teal-dark" />
                                  <span>NEXT &middot; AI Icebreaker &amp; Next Action</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(orchestratorSelectedLead.brief.next.aiIcebreaker, "AI Icebreaker")}
                                  className="text-[10px] font-bold text-teal-dark hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-2.5 h-2.5" />
                                  <span>Copy</span>
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-200">
                                &ldquo;{orchestratorSelectedLead.brief.next.aiIcebreaker}&rdquo;
                              </p>
                              <p className="text-[10px] text-slate-600">
                                <strong>Recommended Action: </strong>{orchestratorSelectedLead.brief.next.recommendedAction}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-slate-400 p-8">
                          Select a prospect from the left to inspect their 6-point Opportunity Brief.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500 font-medium">
                LeadIntellect Autonomous Orchestrator v2.0 &middot; 85,500 master B2B records &middot; Zero hallucinations
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAiOrchestratorOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>
                {orchestratorResult?.interpretedCriteria && (
                  <button
                    type="button"
                    onClick={() => handleApplyOrchestratorCriteria(orchestratorResult.interpretedCriteria)}
                    className="px-4 py-2 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Apply Criteria to Discover Leads Table</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
      {/* ================= MODAL: 50+ ADVANCED FILTERS ================= */}
      {advancedFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[88vh] overflow-y-auto custom-scrollbar space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[10px] uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>LeadIntellect Advanced Intelligence Suite</span>
                </div>
                <h3 className="text-xl font-extrabold text-navy">
                  50+ Advanced Enterprise Prospecting Filters
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Granular multi-dimensional criteria across technographic shifts, funding rounds, buying intent &amp; hiring signals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdvancedFiltersOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 text-xs">
              {/* Technographics */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-navy flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Technographic Stack (Installed Software)</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Salesforce CRM",
                    "HubSpot",
                    "AWS Cloud",
                    "Snowflake",
                    "Datadog",
                    "Google Cloud",
                    "Microsoft Azure",
                    "Stripe Payments",
                    "Marketo",
                    "Segment CDP",
                  ].map((tech) => {
                    const isChecked = advFilters.technographic.includes(tech);
                    return (
                      <label key={tech} className="flex items-center gap-2 cursor-pointer text-[11px] font-medium text-slate-700 p-1.5 rounded-lg hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setAdvFilters((prev) => ({
                              ...prev,
                              technographic: isChecked
                                ? prev.technographic.filter((t) => t !== tech)
                                : [...prev.technographic, tech],
                            }));
                          }}
                          className="rounded text-indigo-600 w-3.5 h-3.5"
                        />
                        <span>{tech}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Funding & Valuations */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-navy flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>Funding Stage &amp; Capitalization</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Seed / Angel",
                    "Series A",
                    "Series B",
                    "Series C+",
                    "Growth Equity",
                    "Private Equity (PE)",
                    "Public (IPO)",
                    "Bootstrapped / Profitable",
                  ].map((stage) => {
                    const isChecked = advFilters.fundingStage.includes(stage);
                    return (
                      <label key={stage} className="flex items-center gap-2 cursor-pointer text-[11px] font-medium text-slate-700 p-1.5 rounded-lg hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setAdvFilters((prev) => ({
                              ...prev,
                              fundingStage: isChecked
                                ? prev.fundingStage.filter((s) => s !== stage)
                                : [...prev.fundingStage, stage],
                            }));
                          }}
                          className="rounded text-emerald-600 w-3.5 h-3.5"
                        />
                        <span>{stage}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Department Growth */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-navy flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-dark" />
                  <span>Department Headcount Growth Rate</span>
                </h4>
                <div className="space-y-1.5">
                  {[
                    { id: "all", label: "Any Growth Rate" },
                    { id: "gt_20", label: "> 20% YoY Net Headcount Expansion" },
                    { id: "gt_50", label: "> 50% YoY Hyper-Growth" },
                    { id: "eng_surge", label: "Engineering & Tech Hiring Surge" },
                    { id: "sales_surge", label: "Sales & Go-To-Market Expansion" },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer text-[11px] font-medium text-slate-700 p-1 rounded hover:bg-white">
                      <input
                        type="radio"
                        name="growthRate"
                        checked={advFilters.growthRate === item.id}
                        onChange={() => setAdvFilters((prev) => ({ ...prev, growthRate: item.id }))}
                        className="text-teal-dark w-3.5 h-3.5"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In-Market Intent Score */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-navy flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Buyer Intent Velocity &amp; Signals</span>
                </h4>
                <div className="space-y-1.5">
                  {[
                    { id: "all", label: "Any In-Market Intent Score" },
                    { id: "surge_90", label: "High Intent Surge (Score 90-100)" },
                    { id: "g2_research", label: "Active Review / Comparison Research" },
                    { id: "job_changes", label: "Recent C-Level Appointment (<90 Days)" },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer text-[11px] font-medium text-slate-700 p-1 rounded hover:bg-white">
                      <input
                        type="radio"
                        name="buyingIntentScore"
                        checked={advFilters.buyingIntentScore === item.id}
                        onChange={() => setAdvFilters((prev) => ({ ...prev, buyingIntentScore: item.id }))}
                        className="text-amber-500 w-3.5 h-3.5"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setAdvFilters({
                    technographic: [],
                    fundingStage: [],
                    growthRate: "all",
                    buyingIntentScore: "all",
                    executiveChange: false,
                  });
                }}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Reset Advanced Filters
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdvancedFiltersOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdvancedFiltersOpen(false);
                    showToast("✓ Applied 50+ Advanced Enterprise Filters to LeadIntellect Engine");
                    setPage(1);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5832E6] to-[#4323c2] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Apply 50+ Advanced Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OUT OF CREDITS POPUP MODAL */}
      {outOfCreditsModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Coins className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider">
                Credit Balance: 0
              </span>
              <h3 className="text-xl font-extrabold text-navy">
                You&apos;re out of credits
              </h3>
              <p className="text-sm font-semibold text-slate-700">
                You&apos;re out of credits. Upgrade your plan to unlock more leads.
              </p>
              <p className="text-xs text-text-muted leading-relaxed pt-1">
                Upgrade to a premium plan to reveal direct work emails, verified mobile phones, whole-web buyer intent surges, and download CSVs of your target accounts.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlock 500 to 5,000+ verified decision-makers</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real-time SMTP &amp; MX zero-bounce deliverability</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full CSV export of all your unlocked leads</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                href="/pricing"
                onClick={() => setOutOfCreditsModalOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-dark via-teal to-teal text-navy font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all text-center"
              >
                Upgrade Your Plan
              </Link>
              <button
                type="button"
                onClick={() => setOutOfCreditsModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-navy transition-colors cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
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
