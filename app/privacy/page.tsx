import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | LeadIntellect",
  description:
    "LeadIntellect's privacy policy outlining data collection, lawful basis for B2B processing, retention periods, and individual rights.",
  alternates: {
    canonical: "https://lead-intellect.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container-page max-w-4xl mx-auto">
          <div className="mb-10 pb-6 border-b border-slate-200">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-text-muted mt-2">
              Last updated: October 2026 &middot; LeadIntellect Privacy &amp; Data Rights Governance
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-navy mb-2">1. Introduction &amp; Scope</h2>
              <p>
                LeadIntellect (&quot;we&quot;, &quot;our&quot;, &quot;platform&quot;) operates a B2B sales intelligence and prospect
                discovery workspace. We provide professional contact and company information to business users
                conducting legitimate business-to-business communications. This policy explains how we collect,
                process, verify, and safeguard personal and business data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-2">2. Categories of B2B Data Processed</h2>
              <p>
                Our B2B index processes professional business identity details including:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Professional name, job title, seniority, and department.</li>
                <li>Corporate business email addresses and domain names.</li>
                <li>Direct business dial and corporate switchboard phone numbers.</li>
                <li>Public corporate social profile URLs (such as LinkedIn company and professional pages).</li>
                <li>Company firmographics (headcount tiers, industry sectors, registered city, state, country).</li>
              </ul>
              <p className="mt-2">
                We do not collect or index sensitive personal data such as political affiliations, religious
                beliefs, health records, biometric information, or consumer personal financial credentials.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-2">3. Lawful Basis for Processing</h2>
              <p>
                We process professional B2B directory information under legitimate interest for professional
                business-to-business communication. We maintain balanced assessments ensuring that our processing
                does not override the fundamental rights and freedoms of individuals. Users who do not wish to have
                their corporate contact details indexed may submit an opt-out request at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-2">4. Your Data Rights &amp; Opt-Out</h2>
              <p>
                Any professional has the right to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Request confirmation of whether their business contact details exist in our index.</li>
                <li>Request immediate suppression and permanent removal of their contact record.</li>
                <li>Correct inaccurate business title, company affiliation, or location details.</li>
              </ul>
              <p className="mt-2">
                To submit an opt-out or removal request, visit our <a href="/data-use" className="text-teal-dark font-semibold underline">Data Use &amp; Suppression Registry</a> page or email privacy@leadintellect.ai.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-2">5. Data Retention &amp; Security</h2>
              <p>
                All account credentials and API keys are stored server-side with industry-standard cryptographic
                hashing and encryption in transit (TLS 1.3). We review dataset freshness on scheduled cycles to retire
                decayed or stale records.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
