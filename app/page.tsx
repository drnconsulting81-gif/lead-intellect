import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import ProblemSection from "@/components/ProblemSection";
import Workflow from "@/components/Workflow";
import FeatureGrid from "@/components/FeatureGrid";
import IntelligenceFramework from "@/components/IntelligenceFramework";
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
        <ProblemSection />
        <Workflow />
        <FeatureGrid />
        <IntelligenceFramework />
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
