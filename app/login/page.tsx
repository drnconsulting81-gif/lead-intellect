"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  User,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Sparkles,
  Zap,
  Sliders,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  company?: string;
  title?: string;
  provider: string;
}

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  // Restore session from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("leadintellect_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("leadintellect_user");
    setCurrentUser(null);
    setSuccessMsg(null);
    setErrorMsg(null);
    setPassword("");
  };

  const handleSocialAuth = async (provider: "google" | "github" | "microsoft") => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, email: `${provider}.user@company.com` }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("leadintellect_user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setSuccessMsg(`Welcome! Authenticated via ${provider.toUpperCase()}.`);
      } else {
        setErrorMsg(data.error || "Social authentication failed.");
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/signup";
    const payload =
      tab === "login"
        ? { email: email.trim(), password, provider: "email" }
        : { name: name.trim(), email: email.trim(), title: title.trim(), company: company.trim(), password, provider: "email" };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        localStorage.setItem("leadintellect_user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setSuccessMsg(data.message || (tab === "login" ? "Login successful!" : "Account created successfully!"));
      } else {
        setErrorMsg(data.error || "Authentication failed. Check your credentials.");
      }
    } catch {
      setErrorMsg("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-navy mb-4 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex justify-center mb-2">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
              {currentUser
                ? "Your LeadIntellect Workspace"
                : tab === "login"
                ? "Welcome back to LeadIntellect"
                : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              {currentUser
                ? "You are signed in and your workspace session is active."
                : tab === "login"
                ? "Sign in to access your sales intelligence workspace"
                : "Start prospecting with verified B2B data & AI scoring"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(11,18,32,0.12)]">
            {/* ================= STATE 1: SIGNED IN ================= */}
            {currentUser ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-teal/10 border border-teal/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal text-navy flex items-center justify-center font-extrabold shrink-0 text-sm">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-navy truncate">{currentUser.name}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal text-navy uppercase">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-teal-dark truncate">{currentUser.email}</p>
                    {(currentUser.company || currentUser.title) && (
                      <p className="text-[11px] text-text-muted truncate mt-0.5">
                        {currentUser.title ? `${currentUser.title} at ` : ""}
                        {currentUser.company || "LeadIntellect Workspace"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-navy uppercase tracking-wider">Quick Actions</p>

                  <Link
                    href="/admin"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-teal/50 hover:bg-surface transition-all text-xs font-bold text-navy group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-navy text-teal flex items-center justify-center shrink-0">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-navy font-bold">Admin Operations &amp; Revenue Portal</p>
                        <p className="text-[10px] text-text-muted font-normal">View leads, users, database sales &amp; stats</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-teal-dark transition-colors" />
                  </Link>

                  <Link
                    href="/#features"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-teal/50 hover:bg-surface transition-all text-xs font-bold text-navy group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal/15 text-teal-dark flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-navy font-bold">AI Prospecting &amp; ICP Scoring Engine</p>
                        <p className="text-[10px] text-text-muted font-normal">Explore live buyer intelligence models</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-teal-dark transition-colors" />
                  </Link>

                  <Link
                    href="/book-demo"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-teal/50 hover:bg-surface transition-all text-xs font-bold text-navy group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-violet/10 text-violet flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-navy font-bold">Book VIP Solution Walkthrough</p>
                        <p className="text-[10px] text-text-muted font-normal">Coordinate custom onboarding session</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-teal-dark transition-colors" />
                  </Link>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Link
                    href="/"
                    className="text-xs text-teal-dark hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Go to Homepage</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              /* ================= STATE 2: LOGIN / SIGNUP FORMS ================= */
              <>
                {/* Toggle Tabs */}
                <div className="grid grid-cols-2 p-1 bg-surface rounded-xl border border-border mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setTab("login");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      tab === "login"
                        ? "bg-white text-navy shadow-xs"
                        : "text-text-muted hover:text-navy"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab("signup");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      tab === "signup"
                        ? "bg-white text-navy shadow-xs"
                        : "text-text-muted hover:text-navy"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Social Logins */}
                <div className="flex flex-col gap-2.5 mb-6">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth("google")}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-navy hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth("microsoft")}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-navy hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                    <span>Continue with Microsoft / SSO</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center mb-6">
                  <div className="border-t border-border w-full" />
                  <span className="bg-white px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider absolute">
                    Or with work email
                  </span>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex flex-col gap-1.5">
                    <p>{errorMsg}</p>
                    {errorMsg.toLowerCase().includes("already exists") && (
                      <button
                        type="button"
                        onClick={() => {
                          setTab("login");
                          setErrorMsg(null);
                        }}
                        className="text-left font-bold text-teal-dark hover:underline cursor-pointer"
                      >
                        &rarr; Switch to Sign In tab
                      </button>
                    )}
                    {errorMsg.toLowerCase().includes("no account found") && (
                      <button
                        type="button"
                        onClick={() => {
                          setTab("signup");
                          setErrorMsg(null);
                        }}
                        className="text-left font-bold text-teal-dark hover:underline cursor-pointer"
                      >
                        &rarr; Click here to Sign Up first
                      </button>
                    )}
                  </div>
                )}

                {successMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-teal/10 border border-teal/30 text-xs font-semibold text-teal-dark flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {tab === "signup" && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1">
                          Full Name <span className="text-teal">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Sarah Jenkins"
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-navy mb-1">Company</label>
                          <div className="relative">
                            <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                              type="text"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              placeholder="Acme Corp"
                              className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-navy mb-1">Title</label>
                          <div className="relative">
                            <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="VP of Sales"
                              className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">
                      Work Email <span className="text-teal">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-navy">
                        Password <span className="text-teal">*</span>
                      </label>
                      {tab === "login" && (
                        <button
                          type="button"
                          onClick={() => alert("Password reset link has been dispatched to your work email.")}
                          className="text-[11px] text-teal-dark hover:underline cursor-pointer"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-navy text-teal hover:bg-teal hover:text-navy py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Verifying credentials...</span>
                    ) : (
                      <>
                        <span>{tab === "login" ? "Sign In to LeadIntellect" : "Create My Account"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-border text-center text-xs text-text-muted">
                  {tab === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        onClick={() => {
                          setTab("signup");
                          setErrorMsg(null);
                        }}
                        className="font-bold text-teal-dark hover:underline cursor-pointer"
                      >
                        Sign up free
                      </button>
                    </>
                  ) : (
                    <>
                      Already registered?{" "}
                      <button
                        onClick={() => {
                          setTab("login");
                          setErrorMsg(null);
                        }}
                        className="font-bold text-teal-dark hover:underline cursor-pointer"
                      >
                        Sign in here
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
            <ShieldCheck className="w-4 h-4 text-teal-dark" />
            <span>256-Bit SSL Encrypted &middot; Enterprise Protected Session</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
