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
  CreditCard,
  DollarSign,
  Package,
  X,
  UserCheck,
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

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  title?: string;
  company?: string;
  provider: string;
  createdAt: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  phone?: string;
  itemType: "subscription" | "database_purchase";
  planName: string;
  amount: number;
  currency: string;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
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
    orders?: number;
    paidRevenue?: number;
  };
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "users" | "orders" | "demos" | "trials" | "contacts" | "settings"
  >("users");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [diagnostics, setDiagnostics] = useState<DbDiagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Order modal state
  const [isRecordOrderOpen, setIsRecordOrderOpen] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerEmail: "",
    companyName: "",
    phone: "",
    itemType: "subscription",
    planName: "Growth Subscription Plan ($499/mo)",
    amount: "499",
    currency: "USD",
    paymentStatus: "paid",
    paymentMethod: "Bank Transfer / Wire",
    transactionId: "",
    notes: "",
  });

  // Webhook tester state
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, contactsRes, diagRes, usersRes, ordersRes] = await Promise.all([
        fetch("/api/admin/leads"),
        fetch("/api/contact"),
        fetch("/api/admin/db-status"),
        fetch("/api/admin/users"),
        fetch("/api/admin/orders"),
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
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
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

  // Update lead status
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

  // Update order status
  const handleOrderStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, paymentStatus: newStatus as Order["paymentStatus"] } : o))
        );
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // Save new order / payment
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOrder(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderForm),
      });
      if (res.ok) {
        setIsRecordOrderOpen(false);
        setOrderForm({
          customerName: "",
          customerEmail: "",
          companyName: "",
          phone: "",
          itemType: "subscription",
          planName: "Growth Subscription Plan ($499/mo)",
          amount: "499",
          currency: "USD",
          paymentStatus: "paid",
          paymentMethod: "Bank Transfer / Wire",
          transactionId: "",
          notes: "",
        });
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to record order.");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Error recording order.");
    } finally {
      setSavingOrder(false);
    }
  };

  // Generate test sample lead
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

  // Generate sample order
  const handleGenerateSampleOrder = async (itemType: "subscription" | "database_purchase") => {
    try {
      const isSub = itemType === "subscription";
      const sample = isSub
        ? {
            customerName: "Alex Vance",
            customerEmail: "alex.vance@blackmesa.io",
            companyName: "Black Mesa Systems",
            phone: "+1 (415) 555-0192",
            itemType: "subscription",
            planName: "Pro Tier ($899/mo - Unlimited Enriched Leads)",
            amount: 899,
            currency: "USD",
            paymentStatus: "paid",
            paymentMethod: "Stripe",
            transactionId: `STRIPE_CH_${Date.now().toString().slice(-6)}`,
            notes: "Annual recurring agreement signed.",
          }
        : {
            customerName: "Siddharth Mehta",
            customerEmail: "siddharth@apexfin.in",
            companyName: "Apex Financial Solutions",
            phone: "+91 98201 45890",
            itemType: "database_purchase",
            planName: "50,000 Verified B2B Decision-Maker Records (Fintech & Healthcare)",
            amount: 1500,
            currency: "USD",
            paymentStatus: "paid",
            paymentMethod: "Bank Wire Transfer",
            transactionId: `WIRE-IN-${Date.now().toString().slice(-6)}`,
            notes: "Direct database delivery via encrypted CSV.",
          };

      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sample),
      });
      if (res.ok) {
        fetchData();
        setActiveTab("orders");
      }
    } catch (err) {
      console.error("Error creating sample order:", err);
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
  const exportCsv = (type: string) => {
    let rows: string[][] = [];
    let filename = `leadintellect_${type}_${new Date().toISOString().split("T")[0]}.csv`;

    if (type === "users") {
      rows.push(["User ID", "Full Name", "Email", "Company", "Title", "Auth Provider", "Joined Date"]);
      users.forEach((u) => {
        rows.push([u.id, u.name, u.email, u.company || "", u.title || "", u.provider, u.createdAt]);
      });
    } else if (type === "orders") {
      rows.push(["Order ID", "Customer", "Email", "Company", "Phone", "Type", "Plan Name", "Amount", "Currency", "Status", "Payment Method", "Transaction ID", "Date"]);
      orders.forEach((o) => {
        rows.push([
          o.id,
          o.customerName,
          o.customerEmail,
          o.companyName || "",
          o.phone || "",
          o.itemType,
          `"${o.planName.replace(/"/g, '""')}"`,
          String(o.amount),
          o.currency,
          o.paymentStatus,
          o.paymentMethod,
          o.transactionId || "",
          o.createdAt,
        ]);
      });
    } else if (type === "demos" || type === "trials") {
      const targetType = type === "demos" ? "demo" : "trial";
      const subset = leads.filter((l) => l.type === targetType);
      rows.push(["Lead ID", "Full Name", "Title", "Company", "Email", "Phone", "Status", "Comments", "Created At"]);
      subset.forEach((l) => {
        rows.push([
          l.id,
          l.fullName,
          l.title,
          l.companyName,
          l.email,
          l.phone,
          l.status,
          `"${(l.comments || "").replace(/"/g, '""')}"`,
          l.createdAt,
        ]);
      });
    } else if (type === "contacts") {
      rows.push(["Contact ID", "Full Name", "Email", "Company", "Phone", "Subject", "Message", "Created At"]);
      contacts.forEach((c) => {
        rows.push([
          c.id,
          c.fullName,
          c.email,
          c.company || "",
          c.phone || "",
          `"${c.subject.replace(/"/g, '""')}"`,
          `"${c.message.replace(/"/g, '""')}"`,
          c.createdAt,
        ]);
      });
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
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.company && u.company.toLowerCase().includes(q)) ||
        (u.title && u.title.toLowerCase().includes(q))
      );
    });
  }, [users, searchQuery]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.planName.toLowerCase().includes(q) ||
        (o.transactionId && o.transactionId.toLowerCase().includes(q)) ||
        (o.companyName && o.companyName.toLowerCase().includes(q))
      );
    });
  }, [orders, searchQuery]);

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

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  }, [orders]);

  const demoCount = leads.filter((l) => l.type === "demo").length;
  const trialCount = leads.filter((l) => l.type === "trial").length;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-navy text-white border-b border-white/10 sticky top-0 z-40 shadow-sm">
        <div className="container-page flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="bg-teal/20 text-teal text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-teal/30">
              Admin &middot; Operations &amp; Revenue Center
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
                  : "Storage: Local JSON"}
              </span>
            </div>

            <button
              onClick={fetchData}
              title="Refresh all data"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 container-page py-8">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* Revenue */}
          <div className="rounded-2xl bg-white border border-border p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Paid Revenue</p>
              <p className="text-2xl font-extrabold text-teal-dark mt-1">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">{orders.length} Total Transactions</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal/15 text-teal-dark flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* Registered Users */}
          <div className="rounded-2xl bg-white border border-border p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Platform Sign-ups</p>
              <p className="text-2xl font-extrabold text-navy mt-1">{users.length}</p>
              <p className="text-[10px] text-teal-dark font-medium mt-0.5">Registered User Accounts</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-navy text-teal flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Subscriptions & Purchases */}
          <div className="rounded-2xl bg-white border border-border p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Purchases &amp; Subs</p>
              <p className="text-2xl font-extrabold text-navy mt-1">{orders.length}</p>
              <p className="text-[10px] text-text-muted mt-0.5">Subscriptions &amp; Data Packs</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-violet/10 text-violet flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          {/* Pipeline Leads */}
          <div className="rounded-2xl bg-white border border-border p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Pipeline Leads</p>
              <p className="text-2xl font-extrabold text-navy mt-1">{leads.length}</p>
              <p className="text-[10px] text-teal-dark font-medium mt-0.5">Demos: {demoCount} &middot; Trials: {trialCount}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal/10 text-teal-dark flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Contacts */}
          <div className="rounded-2xl bg-white border border-border p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Contact Inquiries</p>
              <p className="text-2xl font-extrabold text-navy mt-1">{contacts.length}</p>
              <p className="text-[10px] text-text-muted mt-0.5">Direct Website Messages</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Quick Testing Bar */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-navy">Quick Admin Actions:</span>
            <span className="text-xs text-text-muted">Record payments or generate test pipeline entries:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsRecordOrderOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-teal text-navy hover:bg-teal-dark hover:text-white transition-colors cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              + Record Customer Payment / Order
            </button>
            <button
              onClick={() => handleGenerateSampleOrder("subscription")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy text-teal hover:bg-teal hover:text-navy transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              + Add Sample Subscription ($899)
            </button>
            <button
              onClick={() => handleGenerateSampleOrder("database_purchase")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-surface text-navy hover:border-navy transition-colors cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-teal-dark" />
              + Add Sample Database Order ($1,500)
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-6 gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "users"
                  ? "bg-navy text-teal shadow-xs"
                  : "bg-white text-text-muted hover:text-navy border border-border"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Platform Sign-ups</span>
              <span className="bg-white/10 px-1.5 py-0.2 rounded text-[10px]">{users.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-navy text-teal shadow-xs"
                  : "bg-white text-text-muted hover:text-navy border border-border"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Subscriptions &amp; Purchases</span>
              <span className="bg-white/10 px-1.5 py-0.2 rounded text-[10px]">{orders.length}</span>
            </button>

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
              <span>Export {activeTab.toUpperCase()} (CSV)</span>
            </button>
          )}
        </div>

        {/* ================= TAB 1: REGISTERED USERS ================= */}
        {activeTab === "users" && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users by name, email, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                />
              </div>
              <div className="text-xs text-text-muted">
                Showing <span className="font-bold text-navy">{filteredUsers.length}</span> registered account(s)
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-navy border-collapse">
                  <thead className="bg-surface border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Work Email</th>
                      <th className="p-4">Company &amp; Title</th>
                      <th className="p-4">Auth Provider</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-text-muted">
                          No registered users found. Users appear here when someone signs up or logs into your platform.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-surface/60 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-navy">{u.name}</div>
                            <div className="text-[10px] text-text-muted font-mono">{u.id}</div>
                          </td>
                          <td className="p-4">
                            <a
                              href={`mailto:${u.email}`}
                              className="font-medium text-teal-dark hover:underline flex items-center gap-1"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              {u.email}
                            </a>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-navy flex items-center gap-1">
                              <Building className="w-3.5 h-3.5 text-text-muted shrink-0" />
                              {u.company || "Not specified"}
                            </div>
                            <div className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                              <Briefcase className="w-3.5 h-3.5 text-text-muted shrink-0" />
                              {u.title || "Not specified"}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                                u.provider === "google"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : u.provider === "microsoft"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : u.provider === "github"
                                  ? "bg-slate-100 text-slate-800 border-slate-300"
                                  : "bg-teal/15 text-teal-dark border-teal/30"
                              }`}
                            >
                              {u.provider}
                            </span>
                          </td>
                          <td className="p-4 text-[11px] text-text-muted whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(u.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <a
                              href={`mailto:${u.email}?subject=Welcome%20to%20LeadIntellect`}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-border hover:bg-surface text-navy hover:text-teal-dark transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Contact
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

        {/* ================= TAB 2: SUBSCRIPTIONS & DATABASE PURCHASES ================= */}
        {activeTab === "orders" && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders by customer, plan, TXN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-text-muted">
                  Total Paid: <span className="font-bold text-teal-dark">${totalRevenue.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setIsRecordOrderOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-navy text-teal hover:bg-teal hover:text-navy transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Record Payment
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-navy border-collapse">
                  <thead className="bg-surface border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Plan / Database Pack</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method &amp; TXN</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-text-muted">
                          No orders or subscriptions recorded yet. Click &ldquo;Record Payment&rdquo; or &ldquo;+ Add Sample Subscription&rdquo; above.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-surface/60 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-navy">{order.customerName}</div>
                            <div className="text-[11px] text-teal-dark mt-0.5">{order.customerEmail}</div>
                            {order.companyName && (
                              <div className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                                <Building className="w-3 h-3 text-text-muted" />
                                {order.companyName}
                              </div>
                            )}
                          </td>
                          <td className="p-4 max-w-xs">
                            <div className="font-semibold text-navy line-clamp-2">{order.planName}</div>
                            {order.notes && <div className="text-[10px] text-text-muted italic mt-0.5">{order.notes}</div>}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                                order.itemType === "database_purchase"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              {order.itemType === "database_purchase" ? "Database Pack" : "Subscription"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-extrabold text-navy">
                              ${Number(order.amount).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-text-muted uppercase ml-1">{order.currency}</span>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-navy">{order.paymentMethod}</div>
                            {order.transactionId && (
                              <div className="text-[10px] font-mono text-text-muted">{order.transactionId}</div>
                            )}
                          </td>
                          <td className="p-4">
                            <select
                              value={order.paymentStatus}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none cursor-pointer ${
                                order.paymentStatus === "paid"
                                  ? "bg-teal/15 text-teal-dark border-teal/30"
                                  : order.paymentStatus === "pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              <option value="paid">🟢 Paid</option>
                              <option value="pending">🟡 Pending</option>
                              <option value="failed">🔴 Failed</option>
                              <option value="refunded">⚪ Refunded</option>
                            </select>
                          </td>
                          <td className="p-4 text-[11px] text-text-muted whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-4 text-right">
                            <a
                              href={`mailto:${order.customerEmail}?subject=LeadIntellect%20Receipt%20${order.transactionId || order.id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-border hover:bg-surface text-navy hover:text-teal-dark transition-colors"
                            >
                              <Send className="w-3 h-3" />
                              Receipt
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

        {/* ================= TAB 3 & 4: DEMOS & TRIALS ================= */}
        {(activeTab === "demos" || activeTab === "trials") && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === "demos" ? "demo requests" : "trial signups"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Sliders className="w-3.5 h-3.5 text-text-muted" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-border text-navy rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-teal cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

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

        {/* ================= TAB 5: CONTACT INQUIRIES ================= */}
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

        {/* ================= TAB 6: SETTINGS & DATABASE ================= */}
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
                    {users.length} Users &middot; {orders.length} Orders &middot; {leads.length} Leads &middot; {contacts.length} Messages
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-navy">
                <h3 className="font-bold text-navy text-sm">How your MongoDB Atlas database works:</h3>
                <p className="text-text-muted leading-relaxed">
                  All signups, free trial passes, demo requests, and database purchase orders are automatically synchronized in real time to your MongoDB Atlas cluster (<code className="bg-surface px-1 rounded">leadintellect</code> database).
                </p>
              </div>
            </div>

            {/* Webhook Settings */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet/10 text-violet flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-navy">Real-time Lead Webhooks</h2>
                  <p className="text-xs text-text-muted">Forward leads to Slack, HubSpot, Zapier, or Make</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-navy">Send Test Payload to Webhook URL:</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                  />
                  <button
                    onClick={handleTestWebhook}
                    disabled={webhookTesting || !webhookUrl}
                    className="px-4 py-2 bg-navy text-teal hover:bg-teal hover:text-navy text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {webhookTesting ? "Testing..." : "Send Test"}
                  </button>
                </div>

                {webhookResult && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      webhookResult.success
                        ? "bg-teal/10 text-teal-dark border border-teal/20"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {webhookResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{webhookResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= RECORD ORDER MODAL ================= */}
      {isRecordOrderOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-border shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-navy">Record Subscription / Database Purchase</h3>
                <p className="text-xs text-text-muted">Log offline payments, wire transfers, or custom enterprise deals.</p>
              </div>
              <button
                onClick={() => setIsRecordOrderOpen(false)}
                className="p-2 rounded-xl text-text-muted hover:bg-surface hover:text-navy cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy block mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Adams"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy block mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="rachel@acme.com"
                    value={orderForm.customerEmail}
                    onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy block mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={orderForm.companyName}
                    onChange={(e) => setOrderForm({ ...orderForm, companyName: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 / +1 ..."
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy block mb-1">Purchase Type</label>
                  <select
                    value={orderForm.itemType}
                    onChange={(e) => setOrderForm({ ...orderForm, itemType: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal cursor-pointer"
                  >
                    <option value="subscription">Monthly / Annual Subscription</option>
                    <option value="database_purchase">Custom Database Package</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy block mb-1">Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="499"
                    value={orderForm.amount}
                    onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Plan / Database Pack Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Growth Plan ($499/mo) or 50k US Healthcare B2B Database"
                  value={orderForm.planName}
                  onChange={(e) => setOrderForm({ ...orderForm, planName: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy block mb-1">Payment Method</label>
                  <select
                    value={orderForm.paymentMethod}
                    onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal cursor-pointer"
                  >
                    <option value="Bank Transfer / Wire">Bank Transfer / Wire</option>
                    <option value="Stripe">Stripe Card</option>
                    <option value="Razorpay">Razorpay / UPI</option>
                    <option value="Invoice">Invoice Net 30</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy block mb-1">Payment Status</label>
                  <select
                    value={orderForm.paymentStatus}
                    onChange={(e) => setOrderForm({ ...orderForm, paymentStatus: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal cursor-pointer"
                  >
                    <option value="paid">Paid (Confirmed)</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Transaction ID / Reference Number</label>
                <input
                  type="text"
                  placeholder="e.g. WIRE-892401 or STRIPE_PI_1028"
                  value={orderForm.transactionId}
                  onChange={(e) => setOrderForm({ ...orderForm, transactionId: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">Notes / Delivery Details</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 50k CSV dataset sent to email, renewal due on 17th next month."
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecordOrderOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-navy hover:bg-surface font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingOrder}
                  className="px-5 py-2 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white font-bold transition-colors cursor-pointer"
                >
                  {savingOrder ? "Saving..." : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
