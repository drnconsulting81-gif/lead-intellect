import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, Server, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Security & Protections | LeadIntellect",
  description:
    "Security practices at LeadIntellect: Server-side secret management, TLS encryption, strict data access controls, and credit audit logging.",
  alternates: {
    canonical: "https://lead-intellect.com/security",
  },
};

const securityMeasures = [
  {
    icon: Lock,
    title: "Server-Side Credential & Secret Isolation",
    description:
      "All third-party API keys (XMagnet, Hunter, ZeroBounce) and database connection strings are stored exclusively in secure server-side environment variables and are never transmitted to client browsers.",
  },
  {
    icon: Server,
    title: "Encryption in Transit & Rest",
    description:
      "All application traffic is enforced over TLS 1.3 encryption. Passwords and credentials are cryptographically protected with salted hashing.",
  },
  {
    icon: Database,
    title: "Server-Enforced Access & Credit Controls",
    description:
      "Credit deductions and export authorizations are computed and validated exclusively on the server. The application rejects client-tampered credit amounts and enforces strict user tenancy.",
  },
  {
    icon: ShieldCheck,
    title: "Sanitized Upload & Export Safeguards",
    description:
      "Imported CSV files are strictly parsed and sanitized against formula injection (CSV injection). Export files are generated with full escaping and bound to authenticated user sessions.",
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container-page max-w-4xl mx-auto">
          <div className="mb-10 pb-6 border-b border-slate-200">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 px-3.5 py-1.5 rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              INFRASTRUCTURE &amp; APPLICATION SECURITY
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              Security Overview &amp; Protections
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-2">
              Our engineering standards for safeguarding customer accounts, API tokens, and B2B research data.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {securityMeasures.map((m, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-teal-dark flex items-center justify-center mb-4">
                  <m.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-navy">{m.title}</h3>
                <p className="text-xs text-text-muted mt-2 leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 text-xs text-slate-700 leading-relaxed">
            <h4 className="text-sm font-bold text-navy mb-2">Vulnerability Reporting</h4>
            <p>
              If you identify a potential security vulnerability within LeadIntellect services, please contact our
              security team directly at <a href="mailto:security@leadintellect.ai" className="text-teal-dark font-semibold underline">security@leadintellect.ai</a>. We acknowledge responsible disclosure reports promptly.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
