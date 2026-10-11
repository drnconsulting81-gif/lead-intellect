import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Pricing & Plans | Transparent B2B Credits | LeadIntellect",
  description:
    "Simple, transparent B2B sales intelligence pricing. Transparent credit allowances, verified contact reveals, and server-enforced usage accounting.",
  alternates: {
    canonical: "https://lead-intellect.com/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20">
        <PricingSection />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
