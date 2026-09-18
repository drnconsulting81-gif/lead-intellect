"use client";

import { useState } from "react";
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
  Sparkles,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  const handleSocialAuth = async (provider: "google" | "github" | "microsoft") => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          name: "Verified User",
          email: `${provider}.user@company.com`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("leadintellect_user", JSON.stringify(data.user));
        setSuccessMsg(`Welcome! Account created via ${provider.toUpperCase()}. 100 credits granted!`);
        setTimeout(() => {
          window.location.href = data.user.role === "admin" ? "/admin" : "/dashboard";
        }, 900);
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

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          title: title.trim(),
          password,
          provider: "email",
        }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        localStorage.setItem("leadintellect_user", JSON.stringify(data.user));
        setSuccessMsg("✓ Account created! 100 free prospecting credits added & confirmation email dispatched. Redirecting...");
        setTimeout(() => {
          // Regular users ALWAYS go to /dashboard; only CEO goes to /admin
          window.location.href = data.user.role === "admin" ? "/admin" : "/dashboard";
        }, 1100);
      } else {
        setErrorMsg(data.error || "Registration failed. Please check your information.");
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
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-navy mb-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex justify-center mb-2">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Start prospecting with verified B2B contacts &amp; Apollo-style ICP filters.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(11,18,32,0.12)]">
            {/* Free Credits Callout */}
            <div className="mb-6 p-3 rounded-xl bg-teal/10 border border-teal/20 flex items-center gap-3 text-xs text-navy">
              <div className="w-8 h-8 rounded-lg bg-teal text-navy flex items-center justify-center shrink-0 font-extrabold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold">100 Free Prospecting Credits</span>
                <p className="text-[11px] text-teal-dark">Instant access to verified C-Suite &amp; VP contacts upon signup.</p>
              </div>
            </div>

            {/* Social Auth Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                type="button"
                onClick={() => handleSocialAuth("google")}
                disabled={loading}
                className="flex items-center justify-center py-2 px-3 rounded-xl border border-border hover:bg-surface text-xs font-semibold text-navy transition-colors disabled:opacity-50 cursor-pointer"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialAuth("github")}
                disabled={loading}
                className="flex items-center justify-center py-2 px-3 rounded-xl border border-border hover:bg-surface text-xs font-semibold text-navy transition-colors disabled:opacity-50 cursor-pointer"
              >
                GitHub
              </button>
              <button
                type="button"
                onClick={() => handleSocialAuth("microsoft")}
                disabled={loading}
                className="flex items-center justify-center py-2 px-3 rounded-xl border border-border hover:bg-surface text-xs font-semibold text-navy transition-colors disabled:opacity-50 cursor-pointer"
              >
                Microsoft
              </button>
            </div>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                Or sign up with email
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-surface text-navy text-xs focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-surface text-navy text-xs focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Company</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-surface text-navy text-xs focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Job Title</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="VP Sales"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-surface text-navy text-xs focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-surface text-navy text-xs focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-teal hover:bg-teal-dark text-navy hover:text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Free Account (100 Credits) →"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-border text-center text-xs text-text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-teal-dark hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
