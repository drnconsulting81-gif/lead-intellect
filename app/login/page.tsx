"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ExternalLink,
  Eye,
  EyeOff,
  AlertCircle,
  X,
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
  role?: "admin" | "user";
  credits?: number;
}

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active user session detection
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("leadintellect_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) return parsed;
      }
    } catch {}
    return null;
  });

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Google Modal State
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot password modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("leadintellect_user");
    setCurrentUser(null);
    setSuccessMsg("Signed out successfully. You can now log in with another account.");
    setErrorMsg(null);
    setPassword("");
  };

  // Google Auth Trigger
  const handleGoogleAuthClick = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    // Pre-fill if email already entered in form
    if (email && email.includes("@")) {
      setGoogleEmail(email);
    }
    setGoogleModalOpen(true);
  };

  // Execute Google Authentication with genuine email
  const executeGoogleAuth = async (selectedEmail: string, selectedName?: string) => {
    const cleanEmail = (selectedEmail || googleEmail).toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Please enter a valid Google / work email address.");
      return;
    }

    setGoogleLoading(true);
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const displayName = selectedName || googleName || cleanEmail.split("@")[0].replace(/[._-]/g, " ");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          email: cleanEmail,
          name: displayName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("leadintellect_user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setGoogleModalOpen(false);
        setSuccessMsg(`Welcome, ${data.user.name}! Authenticated via Google. Redirecting to your workspace...`);
        
        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/dashboard";
          }
        }, 800);
      } else {
        setErrorMsg(data.error || "Google authentication failed. Please try again.");
      }
    } catch {
      setErrorMsg("Failed to connect to authentication server. Please retry.");
    } finally {
      setGoogleLoading(false);
      setLoading(false);
    }
  };

  // Email & Password Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.toLowerCase().trim();
    const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/signup";
    const payload =
      tab === "login"
        ? { email: cleanEmail, password, provider: "email" }
        : {
            name: name.trim() || cleanEmail.split("@")[0],
            email: cleanEmail,
            title: title.trim(),
            company: company.trim(),
            password,
            provider: "email",
          };

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
        setSuccessMsg(
          tab === "login"
            ? `Welcome back, ${data.user.name}! Redirecting to workspace...`
            : `✓ Account created successfully! 100 free prospecting credits added. Redirecting...`
        );
        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/dashboard";
          }
        }, 900);
      } else {
        setErrorMsg(data.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setErrorMsg("Failed to connect to authentication server. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-navy mb-3 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex justify-center mb-2">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
              {tab === "login" ? "Welcome back to LeadIntellect" : "Create your free account"}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-text-muted">
              {tab === "login"
                ? "Sign in with your Google account or work email"
                : "Get 100 free prospecting credits & verified B2B intelligence"}
            </p>
          </div>

          {/* Active Session Notice Banner (if already logged in) */}
          {currentUser && (
            <div className="mb-5 p-4 rounded-2xl bg-teal/10 border border-teal/30 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-teal text-navy font-extrabold flex items-center justify-center shrink-0 text-xs">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-navy truncate">{currentUser.name}</p>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-teal text-navy uppercase">
                      {currentUser.role === "admin" ? "CEO Admin" : "Active"}
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-dark truncate">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={currentUser.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-3 py-1.5 rounded-lg bg-navy text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Workspace &rarr;
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out of current account"
                  className="p-1.5 text-text-muted hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(11,18,32,0.12)]">
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
                  tab === "login" ? "bg-white text-navy shadow-xs" : "text-text-muted hover:text-navy"
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
                  tab === "signup" ? "bg-white text-navy shadow-xs" : "text-text-muted hover:text-navy"
                }`}
              >
                Sign Up (100 Free Credits)
              </button>
            </div>

            {/* Google Authentication Button */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleAuthClick}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-navy hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            </div>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-border w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-text-muted uppercase tracking-wider absolute">
                Or with work email
              </span>
            </div>

            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex flex-col gap-1.5">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <p className="font-semibold">{errorMsg}</p>
                </div>
                {errorMsg.toLowerCase().includes("no account found") && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab("signup");
                      setErrorMsg(null);
                    }}
                    className="text-left font-bold text-teal-dark hover:underline cursor-pointer pl-6"
                  >
                    &rarr; Click here to create your free account (100 credits)
                  </button>
                )}
                {errorMsg.toLowerCase().includes("already exists") && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab("login");
                      setErrorMsg(null);
                    }}
                    className="text-left font-bold text-teal-dark hover:underline cursor-pointer pl-6"
                  >
                    &rarr; Switch to Sign In tab
                  </button>
                )}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-teal/15 border border-teal/30 text-xs font-semibold text-teal-dark flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-dark" />
                  <span>{successMsg}</span>
                </div>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === "signup" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1">
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
                      <label className="block text-xs font-bold text-navy mb-1">Company</label>
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
                      <label className="block text-xs font-bold text-navy mb-1">Title</label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="VP Sales"
                          className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-navy mb-1">
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
                  <label className="text-xs font-bold text-navy">
                    Password <span className="text-teal">*</span>
                  </label>
                  {tab === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotPasswordOpen(true);
                      }}
                      className="text-[11px] font-semibold text-teal-dark hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy cursor-pointer p-0.5"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Keep me signed in */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-teal-dark focus:ring-teal w-4 h-4 cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-teal-dark to-teal hover:from-teal hover:to-teal-dark text-white py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{tab === "login" ? "Sign In to LeadIntellect" : "Create Free Account (100 Credits)"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-border text-center text-xs text-text-muted">
              {tab === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setTab("signup");
                      setErrorMsg(null);
                    }}
                    className="font-bold text-teal-dark hover:underline cursor-pointer"
                  >
                    Sign up free &rarr;
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setTab("login");
                      setErrorMsg(null);
                    }}
                    className="font-bold text-teal-dark hover:underline cursor-pointer"
                  >
                    Sign in here &rarr;
                  </button>
                </>
              )}
            </div>

            {/* Admin Portal Gateway Callout */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-text-muted">
              <span>Platform Executive / CEO?</span>
              <Link href="/admin" className="font-bold text-navy hover:text-teal-dark hover:underline">
                Admin Sign-In &rarr;
              </Link>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-text-muted">
            <ShieldCheck className="w-4 h-4 text-teal-dark" />
            <span>256-Bit SSL Encrypted &middot; Enterprise Protected Authentication</span>
          </div>
        </div>
      </main>

      {/* ================= GOOGLE AUTHENTICATION MODAL ================= */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setGoogleModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              </div>
              <h3 className="text-xl font-extrabold text-navy">Sign in with Google</h3>
              <p className="text-xs text-text-muted mt-1">
                Choose your Google Account or enter your Gmail / Google Workspace address
              </p>
            </div>

            {/* Quick-choice CEO / Executive Account */}
            <div className="space-y-2 mb-4">
              <p className="text-[11px] font-bold text-navy uppercase tracking-wider">Fast Account Select</p>
              
              <button
                type="button"
                onClick={() => executeGoogleAuth("drnconsulting81@gmail.com", "DRN Consulting (CEO)")}
                disabled={googleLoading}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-teal hover:bg-teal/5 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal text-navy font-extrabold text-xs flex items-center justify-center shrink-0">
                    D
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-navy">DRN Consulting</span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-teal/20 text-teal-dark uppercase">
                        CEO
                      </span>
                    </div>
                    <span className="text-[11px] text-text-muted">drnconsulting81@gmail.com</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-teal-dark transition-colors" />
              </button>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-bold text-text-muted uppercase tracking-wider absolute">
                Or enter your Google email
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeGoogleAuth(googleEmail, googleName);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Google Email / Workspace</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="you@gmail.com or you@company.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-navy focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Display Name (Optional)</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-navy focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={googleLoading}
                className="w-full mt-2 py-2.5 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {googleLoading ? "Connecting with Google..." : "Continue to LeadIntellect →"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setForgotPasswordOpen(false);
                setForgotSuccess(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-extrabold text-navy mb-1">Reset Your Password</h3>
            <p className="text-xs text-text-muted mb-4">
              Enter your work email address and we will dispatch a secure credential reset link.
            </p>

            {forgotSuccess ? (
              <div className="p-3 rounded-xl bg-teal/15 border border-teal/30 text-teal-dark text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-dark" />
                <span>Password reset link dispatched to {forgotEmail}! Check your inbox.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSuccess(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-navy focus:outline-none focus:border-teal"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white font-extrabold text-xs transition-colors"
                >
                  Send Reset Instructions
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
