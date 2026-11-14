import { NextResponse } from "next/server";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const POPULAR_JOB_TITLES = [
  "Chief Executive Officer (CEO)",
  "Chief Technology Officer (CTO)",
  "Chief Financial Officer (CFO)",
  "Chief Information Officer (CIO)",
  "Chief Revenue Officer (CRO)",
  "VP Sales",
  "VP Marketing",
  "VP Engineering",
  "VP Product",
  "Director of Sales",
  "Director of Information Technology",
  "Director of Marketing",
  "Director of Business Development",
  "Head of Growth",
  "Head of People / HR",
  "Senior Software Engineer",
  "Data Scientist",
  "Account Executive",
  "Sales Development Representative",
];

const POPULAR_INDUSTRIES = [
  "Technology, Media & Telecom",
  "Manufacturing & Industrial",
  "Healthcare & Life Sciences",
  "Financial Services & Banking",
  "Professional Services & Real Estate",
  "Retail, Wholesale & Consumer",
  "Education & Public Sector",
  "Energy, Utilities & Mining",
  "Automotive & Mobility",
  "Biotechnology",
  "Construction & Building",
  "Cybersecurity & Cloud",
];

const POPULAR_COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Germany",
  "France",
  "Singapore",
  "United Arab Emirates",
  "Netherlands",
];

const POPULAR_INTENT_TOPICS = [
  "SOC-2 / ISO-27001 Compliance",
  "CRM & Salesforce Migration",
  "Hiring Machine Learning Engineers",
  "GenAI & LLM Implementation",
  "Cloud Infrastructure Scaling",
  "Series A / Series B Capital Expansion",
  "ERP & NetSuite Replacement",
  "Direct Dial Data Enrichment",
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || "").trim().toLowerCase();

    if (!query || query.length < 1) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions: { text: string; category: string }[] = [];

    // 1. Match Job Titles
    for (const title of POPULAR_JOB_TITLES) {
      if (title.toLowerCase().includes(query)) {
        suggestions.push({ text: title, category: "Job Title" });
      }
      if (suggestions.length >= 4) break;
    }

    // 2. Match Industries
    for (const ind of POPULAR_INDUSTRIES) {
      if (ind.toLowerCase().includes(query)) {
        suggestions.push({ text: ind, category: "Industry" });
      }
      if (suggestions.length >= 7) break;
    }

    // 3. Match Countries
    for (const country of POPULAR_COUNTRIES) {
      if (country.toLowerCase().includes(query)) {
        suggestions.push({ text: country, category: "Country" });
      }
      if (suggestions.length >= 9) break;
    }

    // 4. Match Intent Topics
    for (const topic of POPULAR_INTENT_TOPICS) {
      if (topic.toLowerCase().includes(query)) {
        suggestions.push({ text: topic, category: "Intent Signal" });
      }
      if (suggestions.length >= 11) break;
    }

    // 5. Query MongoDB Atlas for matching Companies or Titles if configured
    if (isMongoConfigured() && suggestions.length < 10) {
      try {
        const db = await getMongoDb();
        if (db) {
          const prospectsColl = db.collection("prospects");
          const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const docs = await prospectsColl
            .find({
              $or: [
                { company: { $regex: safe, $options: "i" } },
                { title: { $regex: safe, $options: "i" } },
              ],
            })
            .limit(5)
            .project({ company: 1, title: 1 })
            .toArray();

          const seen = new Set(suggestions.map((s) => s.text.toLowerCase()));
          for (const doc of docs) {
            if (doc.company && doc.company.toLowerCase().includes(query) && !seen.has(doc.company.toLowerCase())) {
              seen.add(doc.company.toLowerCase());
              suggestions.push({ text: doc.company, category: "Company" });
            }
            if (doc.title && doc.title.toLowerCase().includes(query) && !seen.has(doc.title.toLowerCase())) {
              seen.add(doc.title.toLowerCase());
              suggestions.push({ text: doc.title, category: "Job Title" });
            }
          }
        }
      } catch (e) {
        console.warn("Mongo suggestions lookup skipped:", e);
      }
    }

    return NextResponse.json({
      success: true,
      suggestions: suggestions.slice(0, 10),
    });
  } catch (err) {
    console.error("Suggestions API error:", err);
    return NextResponse.json({ suggestions: [] });
  }
}
