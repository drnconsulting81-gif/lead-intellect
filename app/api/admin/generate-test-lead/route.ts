import { NextResponse } from "next/server";
import { saveLead } from "@/lib/db";
import { sendLeadNotification } from "@/lib/notifications";

const sampleCompanies = [
  { company: "MedTech Innovations", title: "VP of Partnerships", name: "David Chen", email: "david.chen@medtechinno.com", phone: "+1 (415) 890-1234", comments: "Interested in healthcare ICP scoring." },
  { company: "FinEdge Systems", title: "Chief Commercial Officer", name: "Elena Rostova", email: "elena@finedgesys.io", phone: "+1 (212) 555-7890", comments: "Looking to target Tier 1 fintech CFOs." },
  { company: "CloudVanguard Inc", title: "Head of Sales Development", name: "Marcus Brody", email: "marcus@cloudvanguard.net", phone: "+1 (512) 777-3344", comments: "Exploring Apollo enrichment integration." },
  { company: "BioGenix Diagnostics", title: "Director of Business Growth", name: "Sophia Martinez", email: "smartinez@biogenixdx.org", phone: "+1 (617) 444-2211", comments: "Need verified enterprise contact dials." },
];

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const type = body.type === "trial" ? "trial" : "demo";
    const sample = sampleCompanies[Math.floor(Math.random() * sampleCompanies.length)];

    const lead = await saveLead({
      type,
      fullName: sample.name,
      title: sample.title,
      companyName: sample.company,
      email: sample.email,
      phone: sample.phone,
      comments: sample.comments,
      status: "new",
    });

    sendLeadNotification({
      type,
      fullName: sample.name,
      email: sample.email,
      companyName: sample.company,
      title: sample.title,
      phone: sample.phone,
      comments: sample.comments,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Generated test ${type === "trial" ? "trial signup" : "demo booking"} for ${sample.name}.`,
      lead,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
