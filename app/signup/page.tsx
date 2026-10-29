"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Mail,
  Building,
  User,
  Briefcase,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [existingUser, setExistingUser] = useState<any>(null);

  // Two-step signup flow: "form" -> "verify"
  const [step, setStep] = useState<"form" | "verify">("form");
  const [verificationCode, setVerificationCode] = useState("");
  const [resendingCode, setResendingCode] = useState(false);

  // If already logged in, redirect into the workspace system
  useEffect(() => {
    try {
      const stored = localStorage.getItem("leadintellect_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.email) {
          setExistingUser(u);
          setSuccessMsg(`You are already signed in as ${u.name || u.email}. Taking you to your workspace...`);
          setTimeout(() => {
            window.location.href = u.role === "admin" ? "/admin" : "/dashboard";
          }, 1200);
        }
      }
    } catch {}
  }, []);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  const handleSocialAuth = async (provider: "google" | "github" | "microsoft") => {
    let userEmail = email.trim();
    if (!userEmail || !userEmail.includes("@")) {
      const prompted = window.prompt(`Enter your ${provider.toUpperCase()} account email address:`);
      if (!prompted) return;
      userEmail = prompted.trim();
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          name: name.trim() || userEmail.split("@")[0],
          email: userEmail.toLowerCase().trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("leadintellect_user", JSON.stringify(data.user));
        setSuccessMsg(`Welcome! Account created via ${provider.toUpperCase()}. 99 credits and 7-day trial granted!`);
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

  // Step 1: Request Verification Code
  const handleInitiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Please enter a valid work email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          name: name.trim(),
          purpose: "signup",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStep("verify");
        setSuccessMsg(`✓ Verification code sent to ${cleanEmail}. Please enter the 6-digit code below.`);
      } else {
        setErrorMsg(data.error || "Unable to send verification code. Please try again.");
      }
    } catch {
      setErrorMsg("Failed to connect to verification server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend code handler
  const handleResendCode = async () => {
    setResendingCode(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          name: name.trim(),
          purpose: "signup",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`✓ New 6-digit code dispatched to ${email.toLowerCase().trim()}.`);
      } else {
        setErrorMsg(data.error || "Failed to resend code.");
      }
    } catch {
      setErrorMsg("Error contacting verification service.");
    } finally {
      setResendingCode(false);
    }
  };

  // Step 2: Confirm code and complete account registration
  const handleVerifyAndCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.trim().length < 4) {
      setErrorMsg("Please enter the 6-digit verification code from your email.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Verify code
      const verifyRes = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          code: verificationCode.trim(),
          purpose: "signup",
        }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setErrorMsg(verifyData.error || "Invalid verification code. Please check your email or resend.");
        setLoading(false);
        return;
      }

      // 2. Complete signup & credit provision
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
        setSuccessMsg("✓ Email verified! 7-Day Free Trial activated with 99 prospecting credits. Redirecting to your workspace...");
        setTimeout(() => {
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
              Start discovering verified B2B prospects and target decision-makers with granular ICP filters.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(11,18,32,0.12)]">
            {/* Free Credits Callout */}
            <div className="mb-6 p-3 rounded-xl bg-teal/10 border border-teal/20 flex items-center gap-3 text-xs text-navy">
              <div className="w-8 h-8 rounded-lg bg-teal text-navy flex items-center justify-center shrink-0 font-extrabold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold">99 Free Prospecting Credits</span>
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

            {/* Step 1: Initial Form or Step 2: Verification Code Input */}
            {step === "verify" ? (
              <form onSubmit={handleVerifyAndCompleteSignup} className="space-y-4">
                <div className="text-center pb-2">
                  <div className="w-12 h-12 rounded-2xl bg-teal/15 text-teal-dark flex items-center justify-center mx-auto mb-3 font-extrabold">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-navy">Enter Verification Code</h3>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    We sent a 6-digit verification code to <strong className="text-navy">{email}</strong>. Enter it to activate your 7-Day Free Trial.
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full py-3.5 text-center text-3xl font-mono tracking-[10px] font-extrabold rounded-xl border border-border bg-surface text-navy focus:outline-none focus:border-teal"
                  />
                  <span className="block text-[11px] text-center text-text-muted mt-1.5">
                    Valid for 10 minutes &bull; Check inbox &amp; spam folder
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || verificationCode.length < 4}
                  className="w-full py-3.5 rounded-xl bg-teal hover:bg-teal-dark text-navy hover:text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Verifying & Provisioning..." : "Verify Code & Start 7-Day Free Trial →"}
                </button>

                <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendingCode}
                    className="font-bold text-teal-dark hover:underline cursor-pointer"
                  >
                    {resendingCode ? "Resending code..." : "Resend 6-Digit Code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-text-muted hover:text-navy cursor-pointer"
                  >
                    &larr; Edit Details
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleInitiateSignup} className="space-y-4">
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
                  {loading ? "Sending Verification Code..." : "Continue with Email Verification →"}
                </button>
              </form>
            )}

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
