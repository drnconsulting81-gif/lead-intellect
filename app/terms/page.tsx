import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | LeadIntellect",
  description:
    "Terms of service governing the commercial use of LeadIntellect prospecting tools, credits, data exports, and acceptable outbound practices.",
  alternates: {
    canonical: "https://lead-intellect.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container-page max-w-4xl mx-auto">
          <div className="mb-10 pb-6 border-b border-slate-200">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-text-muted mt-2">
              Last updated: October 2026 &middot; Commercial User Agreement
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-navy mb-2">1. Acceptance of Terms</h2>
              <p>
                By creating an account, accessing the LeadIntellect platform, or utilizing our API services, you agree
                to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or
                organization, you represent that you possess the authority to bind such entity.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-2">2. Acceptable Use &amp; Anti-Spam Compliance</h2>
              <p>
                LeadIntellect data is provided strictly for legitimate professional B2B outreach and research. You agree
                to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Comply with all applicable anti-spam and telemarketing regulations (including CAN-SPAM, CASL, and GDPR).</li>
                <li>Honor recipient opt-out and unsubscribe requests promptly.</li>
                <li>Not engage in abusive, deceptive, or unsolicited mass email blasts without clear business relevance.</li>
                <li>Not resell, scrape, or redistribute bulk database dumps to unauthorized third parties.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-2">3. Credits &amp; Subscriptions</h2>
              <p>
                Platform features operate on a server-enforced credit model:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Credits are allocated according to your active subscription plan.</li>
                <li>Credits are consumed only upon successful contact detail revelation or verification.</li>
                <li>We do not charge credits for searches, filter configurations, or viewing company statistics.</li>
                <li>All credit ledger transactions are recorded and auditable within your account dashboard.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-2">4. Disclaimers &amp; Data Accuracy</h2>
              <p>
                While LeadIntellect employs multi-stage syntax verification, MX checking, and provenance tracking, B2B
                data naturally decays over time due to job turnover and domain migrations. We make reasonable commercial
                efforts to maintain high data quality, but do not provide an absolute guarantee of 100% email
                deliverability or continuous uninterrupted uptime.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
