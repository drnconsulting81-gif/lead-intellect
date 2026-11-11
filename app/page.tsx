import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import SearchableDirectory from "@/components/SearchableDirectory";
import ProblemSection from "@/components/ProblemSection";
import Workflow from "@/components/Workflow";
import FeatureGrid from "@/components/FeatureGrid";
import IntelligenceFramework from "@/components/IntelligenceFramework";
import IntentCategoriesSection from "@/components/IntentCategoriesSection";
import ICPScore from "@/components/ICPScore";
import EnrichmentSection from "@/components/EnrichmentSection";
import AgentDemo from "@/components/AgentDemo";
import DashboardPreview from "@/components/DashboardPreview";
import Differentiators from "@/components/Differentiators";
import WhoItsFor from "@/components/WhoItsFor";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <SearchableDirectory />
        <ProblemSection />
        <Workflow />
        <FeatureGrid />
        <IntelligenceFramework />
        <IntentCategoriesSection />
        <ICPScore />
        <EnrichmentSection />
        <AgentDemo />
        <DashboardPreview />
        <Differentiators />
        <WhoItsFor />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
