"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Zap,
  Mail,
  Search,
  Download,
  Database,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Phone,
  RefreshCw,
  Sliders,
  Building,
  Briefcase,
  PlusCircle,
  Copy,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import Logo from "@/components/Logo";

interface Lead {
  id: string;
  type: "demo" | "trial";
  fullName: string;
  title: string;
  companyName: string;
  email: string;
  phone: string;
  comments?: string;
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt: string;
}

interface Contact {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface DbDiagnostics {
  mode: "mongodb" | "local_json";
  connected: boolean;
  uriConfigured: boolean;
  counts: {
    totalLeads: number;
    demos: number;
    trials: number;
    contacts: number;
    users: number;
  };
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"demos" | "trials" | "contacts" | "settings">("demos");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [diagnostics, setDiagnostics] = useState<DbDiagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Webhook tester state
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, contactsRes, diagRes] = await Promise.all([
        fetch("/api/admin/leads"),
        fetch("/api/contact"),
        fetch("/api/admin/db-status"),
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContacts(data.contacts || []);
      }
      if (diagRes.ok) {
        const diagData = await diagRes.json();
        setDiagnostics(diagData);
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update status handler
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus as Lead["status"] } : l))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Generate test lead
  const handleGenerateTestLead = async (type: "demo" | "trial") => {
    try {
      const res = await fetch("/api/admin/generate-test-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to generate test lead:", err);
    }
  };

  // Test webhook
  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) return;
    setWebhookTesting(true);
    setWebhookResult(null);

    try {
      const res = await fetch("/api/admin/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setWebhookResult({ success: true, message: data.message || "Webhook delivered successfully!" });
      } else {
        setWebhookResult({ success: false, message: data.error || "Failed to reach webhook URL." });
      }
    } catch {
      setWebhookResult({ success: false, message: "Network connection error testing webhook." });
    } finally {
      setWebhookTesting(false);
    }
  };

  // Export CSV
  const exportCsv = (type: "demos" | "trials" | "contacts") => {
    let rows: string[][] = [];
    let filename = `leadintellect_${type}_${new Date().toISOString().split("T")[0]}.csv`;

    if (type === "demos" || type === "trials") {
      const targetType = type === "demos" ? "demo" : "trial";
      const subset = leads.filter((l) => l.type === targetType);
      rows = [
        ["ID", "Type", "Full Name", "Job Title", "Company Name", "Email", "Phone", "Status", "Date", "Comments"],
        ...subset.map((l) => [
          l.id,
          l.type,
          `"${l.fullName.replace(/"/g, '""')}"`,
          `"${(l.title || "").replace(/"/g, '""')}"`,
          `"${l.companyName.replace(/"/g, '""')}"`,
          l.email,
          l.phone || "",
          l.status,
          l.createdAt,
          `"${(l.comments || "").replace(/"/g, '""')}"`,
        ]),
      ];
    } else {
      rows = [
        ["ID", "Full Name", "Email", "Company", "Phone", "Subject", "Date", "Message"],
        ...contacts.map((c) => [
          c.id,
          `"${c.fullName.replace(/"/g, '""')}"`,
          c.email,
          `"${(c.company || "").replace(/"/g, '""')}"`,
          c.phone || "",
          `"${c.subject.replace(/"/g, '""')}"`,
          c.createdAt,
          `"${c.message.replace(/"/g, '""')}"`,
        ]),
      ];
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredDemos = useMemo(() => {
    return leads
      .filter((l) => l.type === "demo")
      .filter((l) => (statusFilter === "all" ? true : l.status === statusFilter))
      .filter((l) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          l.fullName.toLowerCase().includes(q) ||
          l.companyName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.title && l.title.toLowerCase().includes(q))
        );
      });
  }, [leads, searchQuery, statusFilter]);

  const filteredTrials = useMemo(() => {
    return leads
      .filter((l) => l.type === "trial")
      .filter((l) => (statusFilter === "all" ? true : l.status === statusFilter))
      .filter((l) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          l.fullName.toLowerCase().includes(q) ||
          l.companyName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.title && l.title.toLowerCase().includes(q))
        );
      });
  }, [leads, searchQuery, statusFilter]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q))
      );
    });
  }, [contacts, searchQuery]);

  const demoCount = leads.filter((l) => l.type === "demo").length;
  const trialCount = leads.filter((l) => l.type === "trial").length;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-navy text-white border-b border-white/10 sticky top-0 z-40">
        <div className="container-page flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="bg-teal/20 text-teal text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-teal/30">
              Admin &middot; Lead Intelligence Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Database status pill */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                diagnostics?.mode === "mongodb" && diagnostics?.connected
                  ? "bg-teal/10 border-teal/30 text-teal"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  diagnostics?.mode === "mongodb" && diagnostics?.connected
                    ? "bg-teal animate-pulse"
                    : "bg-amber-400"
                }`}
              />
              <span>
                {diagnostics?.mode === "mongodb" && diagnostics?.connected
                  ? "MongoDB: Active"
                  : "Storage: Local JSON (data/db.json)"}
              </span>
            </div>

            <button
              onClick={fetchData}
              title="Refresh leads"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 container-page py-8">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-white border border-border p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Pipeline Leads</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">{leads.length}</p>
              <p className="text-[11px] text-teal-dark font-medium mt-0.5">Demos &amp; Trials Combined</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal-dark flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-border p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Demo Requests</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">{demoCount}</p>
              <p className="text-[11px] text-text-muted font-medium mt-0.5">VIP Scheduled Walkthroughs</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet/10 text-violet flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-border p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Free Trials Active</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">{trialCount}</p>
              <p className="text-[11px] text-teal-dark font-medium mt-0.5">14-Day Provisioned Passes</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal/15 text-teal-dark flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-border p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Contact Inquiries</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">{contacts.length}</p>
              <p className="text-[11px] text-text-muted font-medium mt-0.5">Direct Form Messages</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-navy text-teal flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Testing Bar */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-navy">Quick Testing Actions:</span>
            <span className="text-xs text-text-muted">Simulate live website leads without filling forms:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleGenerateTestLead("demo")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy text-teal hover:bg-teal hover:text-navy transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              + Add Sample VIP Demo
            </button>
            <button
              onClick={() => handleGenerateTestLead("trial")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal text-navy hover:bg-teal-dark hover:text-white transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              + Add Sample Free Trial
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-6 gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("demos")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "demos"
                  ? "bg-navy text-teal shadow-xs"
                  : "bg-white text-text-muted hover:text-navy border border-border"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Demo Requests</span>
              <span className="bg-white/10 px-1.5 py-0.2 rounded text-[10px]">{demoCount}</span>
            </button>

            <button
              onClick={() => setActiveTab("trials")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "trials"
                  ? "bg-navy text-teal shadow-xs"
                  : "bg-white text-text-muted hover:text-navy border border-border"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>14-Day Free Trials</span>
              <span className="bg-white/10 px-1.5 py-0.2 rounded text-[10px]">{trialCount}</span>
            </button>

            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "contacts"
                  ? "bg-navy text-teal shadow-xs"
                  : "bg-white text-text-muted hover:text-navy border border-border"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Messages</span>
              <span className="bg-white/10 px-1.5 py-0.2 rounded text-[10px]">{contacts.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "settings"
                  ? "bg-navy text-teal shadow-xs"
                  : "bg-white text-text-muted hover:text-navy border border-border"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Database &amp; CRM Sync</span>
            </button>
          </div>

          {activeTab !== "settings" && (
            <button
              onClick={() => exportCsv(activeTab)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-border bg-white text-navy hover:border-navy transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-teal-dark" />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {/* Tab 1 & Tab 2: Demos and Trials Tables */}
        {(activeTab === "demos" || activeTab === "trials") && (
          <div>
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, company, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-text-muted">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-border rounded-xl px-3 py-1.5 text-xs text-navy focus:outline-none focus:border-teal"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-navy border-collapse">
                  <thead className="bg-surface border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="p-4">Lead / Contact</th>
                      <th className="p-4">Company &amp; Title</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Comments / Goals</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(activeTab === "demos" ? filteredDemos : filteredTrials).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-text-muted">
                          No {activeTab === "demos" ? "demo requests" : "trial signups"} found matching your query.
                        </td>
                      </tr>
                    ) : (
                      (activeTab === "demos" ? filteredDemos : filteredTrials).map((lead) => (
                        <tr key={lead.id} className="hover:bg-surface/60 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-navy">{lead.fullName}</div>
                            <div className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(lead.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-navy flex items-center gap-1">
                              <Building className="w-3.5 h-3.5 text-text-muted shrink-0" />
                              {lead.companyName}
                            </div>
                            <div className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                              <Briefcase className="w-3.5 h-3.5 text-text-muted shrink-0" />
                              {lead.title || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            <a
                              href={`mailto:${lead.email}`}
                              className="font-medium text-teal-dark hover:underline flex items-center gap-1"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              {lead.email}
                            </a>
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="text-[11px] text-text-muted hover:text-navy flex items-center gap-1 mt-1"
                              >
                                <Phone className="w-3 h-3" />
                                {lead.phone}
                              </a>
                            )}
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="text-text-muted line-clamp-2 italic">
                              {lead.comments ? `"${lead.comments}"` : "None provided"}
                            </p>
                          </td>
                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                                lead.status === "new"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : lead.status === "contacted"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : lead.status === "qualified"
                                  ? "bg-teal/15 text-teal-dark border-teal/30"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              <option value="new">🔵 New</option>
                              <option value="contacted">🟡 Contacted</option>
                              <option value="qualified">🟢 Qualified</option>
                              <option value="closed">⚪ Closed</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`mailto:${lead.email}?subject=LeadIntellect%20${activeTab === "demos" ? "Demo" : "Trial"}%20Follow-up`}
                                className="p-1.5 rounded-lg border border-border hover:bg-surface text-navy hover:text-teal-dark transition-colors"
                                title="Send email"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                              {lead.phone && (
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="p-1.5 rounded-lg border border-border hover:bg-surface text-navy hover:text-teal-dark transition-colors"
                                  title="Call lead"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Contact Messages */}
        {activeTab === "contacts" && (
          <div>
            <div className="relative w-full sm:w-80 mb-4">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search contact messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
              />
            </div>

            <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-navy border-collapse">
                  <thead className="bg-surface border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="p-4">Sender</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Topic / Subject</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Reply</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredContacts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-text-muted">
                          No contact messages found.
                        </td>
                      </tr>
                    ) : (
                      filteredContacts.map((c) => (
                        <tr key={c.id} className="hover:bg-surface/60 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-navy">{c.fullName}</div>
                            <div className="text-[11px] text-teal-dark mt-0.5">{c.email}</div>
                            {c.phone && <div className="text-[10px] text-text-muted">{c.phone}</div>}
                          </td>
                          <td className="p-4 font-medium text-navy">{c.company || "Individual / None"}</td>
                          <td className="p-4 font-semibold text-navy">
                            <span className="bg-surface border border-border px-2 py-0.5 rounded text-[11px]">
                              {c.subject}
                            </span>
                          </td>
                          <td className="p-4 max-w-sm">
                            <p className="text-text leading-relaxed whitespace-pre-line text-xs">{c.message}</p>
                          </td>
                          <td className="p-4 text-[11px] text-text-muted whitespace-nowrap">
                            {new Date(c.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="p-4 text-right">
                            <a
                              href={`mailto:${c.email}?subject=Re:%20${encodeURIComponent(c.subject)}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy text-teal hover:bg-teal hover:text-navy transition-colors"
                            >
                              <Send className="w-3 h-3" />
                              Reply
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Database & CRM Settings */}
        {activeTab === "settings" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* MongoDB Settings */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal-dark flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-navy">Production Database: MongoDB</h2>
                    <p className="text-xs text-text-muted">Atlas cluster or local connection</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    diagnostics?.mode === "mongodb" && diagnostics?.connected
                      ? "bg-teal/15 text-teal-dark border border-teal/30"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {diagnostics?.mode === "mongodb" && diagnostics?.connected ? "Connected" : "Local Fallback Active"}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border text-xs space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-muted font-medium">Active Engine:</span>
                  <span className="font-bold text-navy uppercase">{diagnostics?.mode || "local_json"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted font-medium">MONGODB_URI in .env:</span>
                  <span className="font-bold text-navy">
                    {diagnostics?.uriConfigured ? "Configured" : "Not Set (using data/db.json)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted font-medium">Stored Records:</span>
                  <span className="font-bold text-navy">
                    {diagnostics?.counts.totalLeads || 0} Leads &middot; {diagnostics?.counts.contacts || 0} Inquiries
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-navy">
                <h3 className="font-bold text-navy text-sm">How to link your MongoDB database:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-text-muted">
                  <li>
                    Create a free MongoDB database at{" "}
                    <a
                      href="https://cloud.mongodb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-dark font-semibold hover:underline"
                    >
                      cloud.mongodb.com
                    </a>
                  </li>
                  <li>Copy your cluster connection string (e.g. <code className="bg-surface px-1 py-0.5 rounded text-navy">mongodb+srv://...</code>).</li>
                  <li>
                    Open your project file: <code className="bg-surface px-1 py-0.5 rounded text-navy font-mono">.env.local</code> and set:
                    <div className="mt-1.5 p-3 rounded-lg bg-navy text-teal font-mono text-[11px] overflow-x-auto">
                      MONGODB_URI=&quot;mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.xxxxx.mongodb.net/leadintellect?retryWrites=true&amp;w=majority&quot;
                    </div>
                  </li>
                  <li>Save the file. Next.js will automatically connect to MongoDB on your next request!</li>
                </ol>
              </div>
            </div>

            {/* CRM & Slack Webhook Sync */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet/10 text-violet flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-navy">CRM &amp; Webhook Synchronization</h2>
                  <p className="text-xs text-text-muted">Sync incoming leads to Slack, HubSpot, Zapier</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <label className="block font-bold text-navy">
                  Test Incoming Webhook URL (Slack / HubSpot / Make / Zapier)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                  />
                  <button
                    onClick={handleTestWebhook}
                    disabled={webhookTesting || !webhookUrl.trim()}
                    className="bg-navy text-teal hover:bg-teal hover:text-navy px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {webhookTesting ? "Testing..." : "Send Test Lead"}
                  </button>
                </div>

                {webhookResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      webhookResult.success
                        ? "bg-teal/10 border-teal/30 text-teal-dark"
                        : "bg-red-50 border-red-200 text-red-600"
                    }`}
                  >
                    {webhookResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{webhookResult.message}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border text-xs space-y-2">
                <h3 className="font-bold text-navy">Permanent Webhook Setup:</h3>
                <p className="text-text-muted">
                  To permanently enable CRM synchronization for all real form submissions, set in your <code className="font-mono text-navy">.env.local</code>:
                </p>
                <div className="p-2.5 rounded-lg bg-navy text-teal font-mono text-[11px] overflow-x-auto">
                  CRM_WEBHOOK_URL=&quot;https://hooks.slack.com/services/...&quot;
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-muted font-medium">Notification Email:</span>
                  <span className="font-bold text-navy">sales@leadintellect.ai</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1">
                  Change via <code className="font-mono text-navy">NOTIFICATION_EMAIL</code> in <code className="font-mono text-navy">.env.local</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
