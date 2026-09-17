"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  User,
  Building,
  MessageSquare,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    subject: "Sales Inquiry",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Failed to send message.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container-page">
          <div className="max-w-xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              GET IN TOUCH WITH OUR TEAM
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              We&apos;re Here to Help Accelerate Your Pipeline
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              Have questions about integrations, enterprise security, or pricing? Send us a message and a sales engineer will reply within 2 hours.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
            {/* Contact details */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-border p-6 shadow-xs">
                <h2 className="text-base font-bold text-navy mb-4">Direct Contact</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-navy text-teal flex items-center justify-center shrink-0">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Direct Phone / WhatsApp</p>
                      <a href="tel:+919985926971" className="font-semibold text-navy hover:text-teal-dark transition-colors text-base">
                        +91 9985926971
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-border p-6 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-navy">Location</h2>
                <div className="flex items-start gap-3 text-xs text-text-muted">
                  <MapPin className="w-4 h-4 text-teal-dark shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-navy">
                    India
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <Clock className="w-4 h-4 text-teal-dark shrink-0" />
                  <span>Monday &ndash; Saturday, 9:00 AM &ndash; 7:00 PM IST</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(11,18,32,0.12)]">
              {submitted ? (
                <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-teal/15 text-teal-dark flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-navy">Message Received!</h2>
                  <p className="mt-3 text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-navy">{form.fullName}</strong>. Your inquiry regarding &ldquo;{form.subject}&rdquo; has been routed to our team. We will review your notes and reply to <strong className="text-navy">{form.email}</strong> promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        fullName: "",
                        email: "",
                        company: "",
                        phone: "",
                        subject: "Sales Inquiry",
                        message: "",
                      });
                    }}
                    className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-lg border border-border hover:border-navy text-navy transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-navy mb-1">Send Us a Direct Message</h2>
                  <p className="text-xs text-text-muted mb-6">
                    Fill out the form below and we will get back to you shortly.
                  </p>

                  {errorMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1">
                          Full Name <span className="text-teal">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            required
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Rachel Green"
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1">
                          Work Email <span className="text-teal">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="email"
                            required
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="rachel@company.com"
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1">Company Name</label>
                        <div className="relative">
                          <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            placeholder="Acme Global"
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-navy placeholder:text-text-muted focus:outline-none focus:border-teal"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy mb-1">Inquiry Topic</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-xs text-navy focus:outline-none focus:border-teal"
                      >
                        <option value="Sales Inquiry">Sales &amp; Enterprise Demo</option>
                        <option value="Custom ICP Consultation">Custom ICP Consultation</option>
                        <option value="Data Provider Integration">Data Provider &amp; API Integration</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Partnership & Referral">Partnership &amp; Referral</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy mb-1">
                        Message <span className="text-teal">*</span>
                      </label>
                      <div className="relative">
                        <MessageSquare className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                        <textarea
                          rows={4}
                          required
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="How can we assist you today? Provide any details on your sales goals..."
                          className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-navy placeholder:text-text-muted focus:outline-none focus:border-teal resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 bg-navy text-teal hover:bg-teal hover:text-navy py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
