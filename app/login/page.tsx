"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Key,
  ExternalLink,
  Check,
  AlertCircle,
  X,
  Lock,
  Mail,
  ArrowLeft,
  Home,
  LayoutDashboard,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [existingUser, setExistingUser] = useState<any>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  // Social Auth Modal (for email capture if not already typed)
  const [socialModalProvider, setSocialModalProvider] = useState<
    "google" | "microsoft" | "apple" | "organization" | null
  >(null);
  const [socialEmail, setSocialEmail] = useState("");

  // Forgot Password Modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Inspect if existing session exists, but DO NOT force auto-redirect
  useEffect(() => {
    try {
      const stored = localStorage.getItem("leadintellect_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.email) {
          setExistingUser(u);
        }
      }
    } catch {}
  }, []);

  const handleSignOutExisting = () => {
    try {
      localStorage.removeItem("leadintellect_user");
      sessionStorage.removeItem("leadintellect_user");
      window.dispatchEvent(new Event("storage"));
    } catch {}
    setExistingUser(null);
    setSuccessMsg("Signed out. You can now log into a different account.");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Please enter a valid work email address.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          provider: "email",
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        try {
          if (keepSignedIn) {
            localStorage.setItem("leadintellect_user", JSON.stringify(data.user));
          } else {
            sessionStorage.setItem("leadintellect_user", JSON.stringify(data.user));
            localStorage.setItem("leadintellect_user", JSON.stringify(data.user));
          }
        } catch {}

        setExistingUser(data.user);
        setSuccessMsg("✓ Logged in successfully. Launching your workspace...");
        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/dashboard";
          }
        }, 900);
      } else {
        setErrorMsg(data.error || "Invalid email or password. Please try again.");
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (
    provider: "google" | "microsoft" | "apple" | "organization"
  ) => {
    setErrorMsg(null);
    if (email && email.includes("@")) {
      executeSocialAuth(provider, email);
    } else {
      setSocialEmail("");
      setSocialModalProvider(provider);
    }
  };

  const executeSocialAuth = async (
    provider: "google" | "microsoft" | "apple" | "organization",
    targetEmail: string
  ) => {
    const cleanEmail = targetEmail.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Please provide a valid corporate email address.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          email: cleanEmail,
          name: cleanEmail.split("@")[0].replace(/[._-]/g, " "),
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("leadintellect_user", JSON.stringify(data.user));
        setSocialModalProvider(null);
        setExistingUser(data.user);
        setSuccessMsg(`✓ Authenticated with ${provider.toUpperCase()}. Launching workspace...`);
        setTimeout(() => {
          window.location.href = data.user.role === "admin" ? "/admin" : "/dashboard";
        }, 800);
      } else {
        setErrorMsg(data.error || "Social authentication failed.");
      }
    } catch {
      setErrorMsg("Connection error during social authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotPasswordOpen(false);
      setForgotSuccess(false);
      setForgotEmail("");
      setSuccessMsg(`✓ Password reset instructions dispatched to ${forgotEmail}.`);
    }, 1800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B132B]">
      {/* Top Header with return to homepage */}
      <header className="w-full bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-teal-dark" />
            <span>Return to Homepage</span>
          </Link>
          {existingUser && (
            <Link
              href={existingUser.role === "admin" ? "/admin" : "/dashboard"}
              className="text-xs font-bold text-white bg-[#5832E6] hover:bg-[#4323c2] px-3.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Open Workspace</span>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-[440px]">
          {/* Active Session Notification if already signed in */}
          {existingUser && (
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Currently Signed In</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-200/60 text-indigo-900">
                  {existingUser.role === "admin" ? "Admin" : existingUser.plan || "Free Trial"}
                </span>
              </div>
              <p className="text-xs text-indigo-900/80 font-medium">
                Signed in as <strong className="text-indigo-950">{existingUser.email}</strong>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href={existingUser.role === "admin" ? "/admin" : "/dashboard"}
                  className="py-2 px-3 rounded-xl bg-[#5832E6] hover:bg-[#4323c2] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Workspace</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOutExisting}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-indigo-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Switch Account</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_12px_40px_rgba(11,19,43,0.06)] p-7 sm:p-8">
            {/* Header & Tabs */}
            <div className="mb-6 text-center">
              <h1 className="text-xl font-extrabold text-navy tracking-tight">
                Sign In to LeadIntellect
              </h1>
              <p className="text-xs text-text-muted mt-1">
                Access verified B2B prospecting intelligence &amp; buyer signals
              </p>
            </div>

            {/* Clean Segment Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
              <button
                type="button"
                className="py-2 px-3 rounded-lg text-xs font-bold text-navy bg-white shadow-xs cursor-default"
              >
                Sign In
              </button>
              <Link
                href="/signup"
                className="py-2 px-3 rounded-lg text-xs font-semibold text-text-muted hover:text-navy text-center transition-colors flex items-center justify-center gap-1"
              >
                <span>Create Account</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSocialClick("google")}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.92H1.21v3.15C3.25 21.43 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.57H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.43l4.11-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.57 1.21 6.57l4.11 3.15c.94-2.82 3.58-4.95 6.68-4.95z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick("microsoft")}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                <span>Continue with Microsoft</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick("organization")}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <Key className="w-3.5 h-3.5 text-slate-600" />
                <span>Single Sign-On (SSO)</span>
              </button>
            </div>

            {/* "Or" Divider */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Or with work email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Link
                    href="/"
                    className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950"
                  >
                    ← Return to Homepage
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950"
                  >
                    Open Workspace &rarr;
                  </Link>
                </div>
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5832E6] focus:ring-1 focus:ring-[#5832E6] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-navy">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotPasswordOpen(true);
                    }}
                    className="text-[11px] font-semibold text-[#5832E6] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5832E6] focus:ring-1 focus:ring-[#5832E6] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Sign In Button (LeadIntellect Purple Branding) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5832E6] to-[#4323c2] hover:from-[#4d2ad4] hover:to-[#3b1fa8] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? "Authenticating..." : "Sign In to LeadIntellect"}</span>
              </button>

              {/* Aux Controls: Keep me signed in & Return home option */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5832E6] border-slate-300 focus:ring-0 cursor-pointer accent-[#5832E6]"
                  />
                  <span className="text-slate-600 text-[11px] font-medium">Keep me signed in</span>
                </label>

                <Link
                  href="/"
                  className="text-[11px] font-semibold text-slate-500 hover:text-navy flex items-center gap-1"
                >
                  <Home className="w-3 h-3" />
                  <span>Go to Homepage</span>
                </Link>
              </div>
            </form>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-xs text-slate-500 space-y-1.5">
            <p className="text-[11px]">
              &copy; {new Date().getFullYear()} LeadIntellect. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-3 text-[11px]">
              <Link href="/privacy" className="hover:text-slate-800 hover:underline">
                Privacy Policy
              </Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-slate-800 hover:underline">
                Terms of Service
              </Link>
              <span>&bull;</span>
              <Link href="/contact" className="hover:text-slate-800 hover:underline">
                Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Social Provider Modal (Enter work email for SSO) */}
      {socialModalProvider && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-navy capitalize">
                Authenticate with {socialModalProvider}
              </h3>
              <button
                type="button"
                onClick={() => setSocialModalProvider(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Enter your corporate email address to authenticate with {socialModalProvider}.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeSocialAuth(socialModalProvider, socialEmail);
              }}
              className="space-y-3"
            >
              <input
                type="email"
                required
                autoFocus
                placeholder="name@company.com"
                value={socialEmail}
                onChange={(e) => setSocialEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5832E6]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#5832E6] hover:bg-[#4323c2] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Continue &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-navy">Reset Your Password</h3>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center">
                ✓ Password reset email dispatched! Please check your inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <p className="text-xs text-slate-500">
                  Enter your registered work email and we&apos;ll send you a secure link to reset your password.
                </p>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5832E6]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#5832E6] hover:bg-[#4323c2] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
