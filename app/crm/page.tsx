"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Building,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  MessageSquare,
  Settings,
  MoreVertical,
  Check,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export interface Deal {
  id: string;
  prospectId?: string;
  contactName: string;
  companyName: string;
  title: string;
  email: string;
  phone?: string;
  linkedin?: string;
  dealValue: number;
  currency: string;
  stage: "identified" | "contacted" | "demo_booked" | "proposal" | "won" | "lost";
  priority: "low" | "medium" | "high";
  notes: string[];
  lastActivity: string;
  createdAt: string;
  expectedCloseDate?: string;
}

const STAGES = [
  { id: "identified", label: "Lead Identified", color: "border-slate-300 bg-slate-50", badgeBg: "bg-slate-200 text-slate-700" },
  { id: "contacted", label: "Outreach Sent", color: "border-sky-300 bg-sky-50/40", badgeBg: "bg-sky-100 text-sky-800" },
  { id: "demo_booked", label: "Demo / Pitch Scheduled", color: "border-indigo-300 bg-indigo-50/40", badgeBg: "bg-indigo-100 text-indigo-800" },
  { id: "proposal", label: "Proposal / Negotiation", color: "border-amber-300 bg-amber-50/40", badgeBg: "bg-amber-100 text-amber-800" },
  { id: "won", label: "Closed - Won 🎉", color: "border-emerald-300 bg-emerald-50/40", badgeBg: "bg-emerald-100 text-emerald-800" },
];

export default function CRMPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<"INR" | "USD">("INR");

  // Deal modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    contactName: "",
    companyName: "",
    title: "",
    email: "",
    phone: "",
    dealValue: 50000,
    stage: "identified" as Deal["stage"],
    priority: "medium" as Deal["priority"],
    notes: "",
  });

  // Customization modal
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: "",
    email: "",
    company: "",
    requirements: "We need custom deal stages, bi-directional HubSpot sync, and custom fields for our SDR team.",
  });
  const [customSubmitted, setCustomSubmitted] = useState(false);

  // Active deal details modal
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [newNote, setNewNote] = useState("");

  const loadDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/crm/deals");
      const data = await res.json();
      if (data.deals) setDeals(data.deals);
    } catch (e) {
      console.error("Failed to load CRM deals:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newDeal,
          currency: selectedCurrency,
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        setNewDeal({
          contactName: "",
          companyName: "",
          title: "",
          email: "",
          phone: "",
          dealValue: 50000,
          stage: "identified",
          priority: "medium",
          notes: "",
        });
        loadDeals();
      }
    } catch (err) {
      console.error("Error creating deal:", err);
    }
  };

  const handleUpdateStage = async (id: string, newStage: Deal["stage"]) => {
    try {
      const res = await fetch("/api/crm/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stage: newStage, notes: `Stage moved to ${newStage.replace('_', ' ')}` }),
      });
      if (res.ok) {
        setDeals((prev) =>
          prev.map((d) => (d.id === id ? { ...d, stage: newStage, lastActivity: `Moved to ${newStage}` } : d))
        );
        if (activeDeal && activeDeal.id === id) {
          setActiveDeal((prev) => (prev ? { ...prev, stage: newStage } : null));
        }
      }
    } catch (err) {
      console.error("Error updating stage:", err);
    }
  };

  const handleAddNote = async (id: string) => {
    if (!newNote.trim()) return;
    try {
      const res = await fetch("/api/crm/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes: newNote.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeals((prev) => prev.map((d) => (d.id === id ? data.deal : d)));
        setActiveDeal(data.deal);
        setNewNote("");
      }
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    if (!confirm("Are you sure you want to remove this deal from CRM?")) return;
    try {
      const res = await fetch(`/api/crm/deals?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeals((prev) => prev.filter((d) => d.id !== id));
        if (activeDeal && activeDeal.id === id) setActiveDeal(null);
      }
    } catch (err) {
      console.error("Error deleting deal:", err);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customForm.name,
          customerEmail: customForm.email,
          companyName: customForm.company,
          itemType: "crm_customization",
          notes: customForm.requirements,
          paymentStatus: "inquiry",
          amount: 0,
        }),
      });
      setCustomSubmitted(true);
      setTimeout(() => {
        setCustomModalOpen(false);
        setCustomSubmitted(false);
      }, 2500);
    } catch {
      alert("Failed to send customization request.");
    }
  };

  // Filter deals
  const filteredDeals = deals.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.contactName.toLowerCase().includes(q) ||
      d.companyName.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q)
    );
  });

  // Calculate CRM Pipeline metrics
  const totalPipelineValue = deals.reduce((sum, d) => sum + (d.dealValue || 0), 0);
  const wonDeals = deals.filter((d) => d.stage === "won");
  const wonValue = wonDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);
  const winRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  const currSymbol = selectedCurrency === "INR" ? "₹" : "$";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="container-page">
          {/* Header & Sub-nav */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-dark mb-1">
                <Layers className="w-4 h-4 text-teal" />
                <span className="uppercase tracking-wider font-extrabold">All-In-One Revenue System</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-600">Visual Deal Pipeline</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0b1220] tracking-tight flex items-center gap-3">
                <span>Autonomous Sales CRM</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal/15 text-teal-dark border border-teal/30">
                  Built-in
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Convert verified database prospects into paying customers. Track deal stages, follow-up notes, and revenue without paying for third-party CRMs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/dashboard"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-teal-dark" />
                <span>Search 11,000+ Database</span>
              </Link>

              <button
                onClick={() => setCustomModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#0b1220] bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>Request Custom CRM</span>
              </button>

              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-black text-[#0b1220] bg-teal hover:bg-teal-dark hover:text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Deal</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Total Pipeline Value</span>
                <DollarSign className="w-4 h-4 text-teal" />
              </div>
              <div className="text-2xl font-black text-[#0b1220] mt-1">
                {currSymbol}{totalPipelineValue.toLocaleString(selectedCurrency === "INR" ? "en-IN" : "en-US")}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{deals.length} active opportunities</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Closed Won Revenue</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {currSymbol}{wonValue.toLocaleString(selectedCurrency === "INR" ? "en-IN" : "en-US")}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{wonDeals.length} won contracts</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Conversion Rate</span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-[#0b1220] mt-1">{winRate}%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Identified to Won ratio</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>CRM Customization</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1.5">Tailored Workflows</div>
              <button
                onClick={() => setCustomModalOpen(true)}
                className="text-[11px] font-extrabold text-teal-dark hover:underline mt-0.5 block cursor-pointer"
              >
                Customize for your team &rarr;
              </button>
            </div>
          </div>

          {/* Search & Currency Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search deals by contact, company, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Pipeline Currency:</span>
              <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setSelectedCurrency("INR")}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                    selectedCurrency === "INR" ? "bg-[#0b1220] text-teal shadow-xs" : "text-slate-600"
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setSelectedCurrency("USD")}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                    selectedCurrency === "USD" ? "bg-[#0b1220] text-teal shadow-xs" : "text-slate-600"
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>
          </div>

          {/* Customization Promo Banner */}
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#0b1220] to-[#14233c] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal/20 text-teal flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black">Need Custom CRM Stages or Bi-Directional Salesforce/HubSpot Sync?</div>
                <div className="text-[11px] text-slate-300">
                  This CRM comes free with your plan. If your sales process requires custom stages, automated WhatsApp triggers, or custom fields, we customize it for you.
                </div>
              </div>
            </div>
            <button
              onClick={() => setCustomModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-teal text-[#0b1220] text-xs font-black hover:bg-teal-dark hover:text-white transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Request Custom CRM
            </button>
          </div>

          {/* ================= KANBAN BOARD ================= */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-6">
            {STAGES.map((col) => {
              const columnDeals = filteredDeals.filter((d) => d.stage === col.id);
              const colValue = columnDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);

              return (
                <div
                  key={col.id}
                  className={`rounded-2xl border p-3 min-w-[260px] flex flex-col min-h-[500px] ${col.color}`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                    <div>
                      <div className="text-xs font-extrabold text-[#0b1220] flex items-center gap-1.5">
                        <span>{col.label}</span>
                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${col.badgeBg}`}>
                          {columnDeals.length}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                        {currSymbol}{colValue.toLocaleString(selectedCurrency === "INR" ? "en-IN" : "en-US")}
                      </div>
                    </div>
                  </div>

                  {/* Deals Cards List */}
                  <div className="space-y-3 flex-1">
                    {columnDeals.length === 0 ? (
                      <div className="p-4 text-center rounded-xl bg-white/60 border border-dashed border-slate-300 text-[11px] text-slate-400">
                        No deals in this stage
                      </div>
                    ) : (
                      columnDeals.map((deal) => (
                        <div
                          key={deal.id}
                          onClick={() => setActiveDeal(deal)}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-teal/60 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2.5 group"
                        >
                          {/* Contact & Company */}
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-extrabold text-xs text-[#0b1220] group-hover:text-teal-dark transition-colors line-clamp-1">
                                {deal.contactName}
                              </h4>
                              <span
                                className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                                  deal.priority === "high"
                                    ? "bg-rose-100 text-rose-700"
                                    : deal.priority === "medium"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {deal.priority}
                              </span>
                            </div>
                            <div className="text-[11px] font-semibold text-slate-600 line-clamp-1">
                              {deal.title}
                            </div>
                            <div className="text-[10px] font-bold text-teal-dark flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3 text-slate-400" />
                              <span className="line-clamp-1">{deal.companyName}</span>
                            </div>
                          </div>

                          {/* Deal Value */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                            <span className="font-black text-[#0b1220]">
                              {currSymbol}{(deal.dealValue || 0).toLocaleString(selectedCurrency === "INR" ? "en-IN" : "en-US")}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(deal.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            </span>
                          </div>

                          {/* Quick Stage Mover */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-between pt-1 gap-1 text-[10px]"
                          >
                            <select
                              value={deal.stage}
                              onChange={(e) => handleUpdateStage(deal.id, e.target.value as Deal["stage"])}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-700 focus:outline-none focus:border-teal"
                            >
                              {STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  Stage: {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ================= ACTIVE DEAL DETAIL DRAWER / MODAL ================= */}
      {activeDeal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-[#0b1220]">{activeDeal.contactName}</h3>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      activeDeal.priority === "high"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {activeDeal.priority} priority
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeDeal.title} &middot; <strong className="text-teal-dark">{activeDeal.companyName}</strong>
                </p>
              </div>
              <button
                onClick={() => setActiveDeal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Work Email</span>
                <span className="font-semibold text-slate-800 break-all">{activeDeal.email || "No email"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Phone Number</span>
                <span className="font-semibold text-slate-800">{activeDeal.phone || "No phone"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Deal Value</span>
                <span className="text-sm font-black text-slate-900">
                  {currSymbol}{(activeDeal.dealValue || 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Current Stage</span>
                <select
                  value={activeDeal.stage}
                  onChange={(e) => handleUpdateStage(activeDeal.id, e.target.value as Deal["stage"])}
                  className="mt-1 w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Activity & Notes */}
            <div className="mt-6">
              <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal" />
                <span>Deal Notes &amp; Activity Log</span>
              </h4>

              {/* Add Note Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Sent pricing proposal via WhatsApp, scheduled follow-up"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNote(activeDeal.id);
                  }}
                  className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal"
                />
                <button
                  onClick={() => handleAddNote(activeDeal.id)}
                  className="px-4 py-2 rounded-xl bg-[#0b1220] hover:bg-slate-800 text-teal text-xs font-bold cursor-pointer"
                >
                  Add Note
                </button>
              </div>

              {/* Notes List */}
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {activeDeal.notes && activeDeal.notes.length > 0 ? (
                  activeDeal.notes.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      {note}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleDeleteDeal(activeDeal.id)}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
              >
                Delete Deal
              </button>
              <button
                onClick={() => setActiveDeal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= NEW DEAL MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0b1220]">Add Opportunity to Pipeline</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={newDeal.contactName}
                  onChange={(e) => setNewDeal({ ...newDeal, contactName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Corp"
                    value={newDeal.companyName}
                    onChange={(e) => setNewDeal({ ...newDeal, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="VP Marketing"
                    value={newDeal.title}
                    onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="rachel@acme.com"
                    value={newDeal.email}
                    onChange={(e) => setNewDeal({ ...newDeal, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98200..."
                    value={newDeal.phone}
                    onChange={(e) => setNewDeal({ ...newDeal, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimated Value ({currSymbol})</label>
                  <input
                    type="number"
                    value={newDeal.dealValue}
                    onChange={(e) => setNewDeal({ ...newDeal, dealValue: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value as Deal["stage"] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Initial Note</label>
                <textarea
                  rows={2}
                  placeholder="Key pain point or context from outreach..."
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal hover:bg-teal-dark hover:text-white text-[#0b1220] font-black text-xs shadow-xs transition-colors cursor-pointer"
              >
                Create Opportunity
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= CUSTOM CRM REQUEST MODAL ================= */}
      {customModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#0b1220]">Request Custom CRM Architecture</h3>
                <p className="text-xs text-slate-500">Tailored to your sales process &amp; existing software</p>
              </div>
              <button onClick={() => setCustomModalOpen(false)} className="text-slate-400 hover:text-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {customSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">Customization Inquiry Received!</h4>
                <p className="text-xs text-slate-600">
                  Our solution engineering team will reach out with a custom schema &amp; demo within 4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deepak Sharma"
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="deepak@company.com"
                      value={customForm.email}
                      onChange={(e) => setCustomForm({ ...customForm, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company</label>
                    <input
                      type="text"
                      placeholder="Acme Tech"
                      value={customForm.company}
                      onChange={(e) => setCustomForm({ ...customForm, company: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">What CRM customizations do you need?</label>
                  <textarea
                    rows={4}
                    value={customForm.requirements}
                    onChange={(e) => setCustomForm({ ...customForm, requirements: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0b1220] hover:bg-slate-800 text-teal font-black text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Submit Customization Request &rarr;
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
