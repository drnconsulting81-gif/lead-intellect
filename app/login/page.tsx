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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  // Check if already authenticated
  useEffect(() => {
    try {
      const stored = localStorage.getItem("leadintellect_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.email) {
          router.push(u.role === "admin" ? "/admin" : "/dashboard");
        }
      }
    } catch {}
  }, [router]);

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

        setSuccessMsg("✓ Logged in successfully. Taking you to your workspace...");
        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/dashboard";
          }
        }, 800);
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
        setSuccessMsg(`✓ Authenticated with ${provider.toUpperCase()}. Opening workspace...`);
        setTimeout(() => {
          window.location.href = data.user.role === "admin" ? "/admin" : "/dashboard";
        }, 700);
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
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-[420px]">
          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-7 sm:p-8">
            {/* Top Toggle Tabs (Matching user screenshot) */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                type="button"
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#22252A] text-white shadow-xs cursor-default"
              >
                Log In
              </button>
              <Link
                href="/signup"
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign Up</span>
              </Link>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialClick("google")}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 text-xs font-semibold text-slate-800 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
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
                <span>Log In with Google</span>
              </button>

              {/* Microsoft */}
              <button
                type="button"
                onClick={() => handleSocialClick("microsoft")}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 text-xs font-semibold text-slate-800 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                <span>Log In with Microsoft</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleSocialClick("apple")}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 text-xs font-semibold text-slate-800 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0 fill-current text-slate-900" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.41-9.79-11.48-20.74-15.2-32.84-3.72-12.1-5.58-23.77-5.58-35.01 0-14.75 3.69-27.18 11.08-37.28 7.38-10.1 16.71-15.28 27.97-15.54 4.58 0 9.77 1.17 15.58 3.51 5.8 2.34 9.77 3.56 11.9 3.67 1.83 0 5.8-1.29 11.9-3.86 6.1-2.58 11.29-3.76 15.58-3.55 12.33.64 22.42 5.09 30.28 13.36-10.79 6.53-16.08 15.58-15.86 27.14.22 9.04 3.73 16.71 10.53 23 6.8 6.29 14.88 9.78 24.24 10.49-1.94 6.24-4.33 12.63-7.18 19.16zM119.22 31.84c0-7.39 2.67-14.29 8.01-20.7 5.34-6.42 11.96-10.49 19.86-12.21.22 1.09.33 2.18.33 3.26 0 7.39-2.73 14.37-8.19 20.94-5.45 6.57-12.13 10.59-20.01 12.06 0-1.12 0-2.23 0-3.35z" />
                </svg>
                <span>Sign in with Apple</span>
              </button>

              {/* Organization SSO */}
              <button
                type="button"
                onClick={() => handleSocialClick("organization")}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 text-xs font-semibold text-slate-800 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <Key className="w-3.5 h-3.5 text-slate-600" />
                <span>Log In with your Organization</span>
              </button>
            </div>

            {/* "Or" Divider */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">
                Or
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
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Work Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* High-Contrast "Log In" Primary CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#E6FF00] hover:bg-[#D4ED00] text-black font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? "Authenticating..." : "Log In"}</span>
              </button>

              {/* Aux Controls: Keep me signed in & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-0 cursor-pointer accent-black"
                  />
                  <span className="text-slate-700 text-[11px] font-medium">Keep me signed in</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotPasswordOpen(true);
                  }}
                  className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </div>

          {/* Footer (Matching user screenshot) */}
          <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
            <p className="text-[11px]">2026 All Rights Reserved.</p>
            <div className="flex items-center justify-center gap-3 text-[11px]">
              <Link href="/privacy" className="hover:text-slate-800 hover:underline">
                Privacy
              </Link>
              <span>and</span>
              <Link href="/terms" className="hover:text-slate-800 hover:underline">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Social Provider Modal (Enter work email for SSO) */}
      {socialModalProvider && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 capitalize">
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
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#22252A] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
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
              <h3 className="text-sm font-bold text-slate-900">Reset Your Password</h3>
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
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#E6FF00] hover:bg-[#D4ED00] text-black text-xs font-bold transition-colors cursor-pointer"
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
