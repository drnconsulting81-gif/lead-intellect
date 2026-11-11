import Navbar from "@/components/Navbar";
import SearchableDirectory from "@/components/SearchableDirectory";
import Footer from "@/components/Footer";

export const metadata = {
  title: "B2B Lead Directory & Database Search | LeadIntellect",
  description: "Browse 220,000+ validated B2B decision-makers across healthcare, real estate, manufacturing, SaaS, and finance. Get 10 free credits upon signup.",
};

export default function DirectoryPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <SearchableDirectory />
      </main>
      <Footer />
    </>
  );
}

