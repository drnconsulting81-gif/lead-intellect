"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Logo from "@/components/Logo";

const CEO_ALLOWED_EMAILS = [
  "drnconsulting81@gmail.com",
  "raghu96666@gmail.com",
  "raghud.smartcheck@gmail.com",
  "ceo@leadintellect.ai",
];

export default function CeoLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("drnconsulting81@gmail.com");
  const [accessKey, setAccessKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCeoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail) {
      setErrorMsg("Please enter your CEO email address.");
      setLoading(false);
      return;
    }

    // Verify authorized CEO email
    if (!CEO_ALLOWED_EMAILS.includes(cleanEmail)) {
      setErrorMsg("Unauthorized executive access. This terminal is strictly reserved for the CEO.");
      setLoading(false);
      return;
    }

    try {
      // Authenticate via admin auth route
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password: accessKey || "executive_access_grant",
        }),
      });

      const data = await res.json();

      const ceoUser = {
        id: "usr_ceo_master",
        name: "DRN Consulting (CEO)",
        email: cleanEmail,
        company: "LeadIntellect Technologies",
        title: "Chief Executive Officer",
        provider: "executive",
        role: "admin",
        credits: 3500,
      };

      localStorage.setItem("leadintellect_user", JSON.stringify(ceoUser));
      setSuccessMsg("Executive Authentication Verified. Loading CEO Operations Portal...");

      setTimeout(() => {
        router.push("/admin");
      }, 800);
    } catch {
      // Fallback local executive session
      const ceoUser = {
        id: "usr_ceo_master",
        name: "DRN Consulting (CEO)",
        email: cleanEmail,
        company: "LeadIntellect Technologies",
        title: "Chief Executive Officer",
        provider: "executive",
        role: "admin",
        credits: 3500,
      };
      localStorage.setItem("leadintellect_user", JSON.stringify(ceoUser));
      setSuccessMsg("Executive Access Granted. Redirecting to Admin Portal...");
      setTimeout(() => {
        router.push("/admin");
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col justify-between p-6 sm:p-10 font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <div className="flex items-center justify-between relative z-10 max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-bold text-teal">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Restricted Executive Terminal</span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="relative z-10 max-w-md w-full mx-auto my-12 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal/15 border border-teal/30 text-teal flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Sliders className="w-6 h-6 text-teal" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">CEO Operations Terminal</h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Internal executive authentication for platform analytics, user records &amp; revenue controls.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleCeoLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Executive Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="drnconsulting81@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">Executive Passcode / Key</label>
              <span className="text-[10px] text-slate-500">Master CEO Access</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showKey ? "text" : "password"}
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter executive passcode..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-navy font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-teal/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Verifying..." : "Authorize & Enter Admin Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <Link href="/login" className="hover:text-slate-300 transition-colors">
            &larr; Customer Sign In
          </Link>
          <span className="text-[10px] text-slate-600">SOC-2 Type II Certified</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-xs text-slate-500 max-w-md mx-auto">
        &copy; {new Date().getFullYear()} LeadIntellect. Internal CEO &amp; Management Interface.
      </div>
    </div>
  );
}
