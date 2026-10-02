import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface Deal {
  id: string;
  prospectId?: string;
  contactName: string;
  companyName: string;
  title: string;
  email: string;
  phone?: string;
  linkedin?: string;
  dealValue: number;
  currency: string;
  stage: "identified" | "contacted" | "demo_booked" | "proposal" | "won" | "lost";
  priority: "low" | "medium" | "high";
  notes: string[];
  lastActivity: string;
  createdAt: string;
  expectedCloseDate?: string;
}

const CRM_FILE = path.join(process.cwd(), "data", "crm-deals.json");

function getInitialDeals(): Deal[] {
  return [
    {
      id: "deal_1001",
      contactName: "Vikram Malhotra",
      companyName: "Zenith Cloud Solutions",
      title: "VP of Engineering & Cloud",
      email: "vikram.m@zenithcloud.io",
      phone: "+91 98201 88921",
      dealValue: 120000,
      currency: "INR",
      stage: "proposal",
      priority: "high",
      notes: [
        "Met on demo call: highly interested in enterprise waterfall enrichment and custom CRM.",
        "Sent formal RFP and pricing proposal for 5 seats.",
      ],
      lastActivity: "Sent revised enterprise proposal",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      expectedCloseDate: "2026-10-15",
    },
    {
      id: "deal_1002",
      contactName: "Sarah Jenkins",
      companyName: "Apex FinTech Labs",
      title: "Head of Growth & Revenue",
      email: "s.jenkins@apexfintech.com",
      phone: "+1 (415) 672-9011",
      dealValue: 2400,
      currency: "USD",
      stage: "demo_booked",
      priority: "high",
      notes: [
        "Replied to cold email sequence: wants a walkthrough of AI ICP score synthesis.",
        "Demo scheduled for Friday 2 PM EST.",
      ],
      lastActivity: "Confirmed calendar invite for demo",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      expectedCloseDate: "2026-10-20",
    },
    {
      id: "deal_1003",
      contactName: "Ananya Deshmukh",
      companyName: "Nexus Health Systems",
      title: "Director of Digital Operations",
      email: "ananya.d@nexushealth.in",
      phone: "+91 99302 54120",
      dealValue: 65000,
      currency: "INR",
      stage: "won",
      priority: "high",
      notes: [
        "Onboarded onto Professional Plan with WhatsApp direct dials.",
        "First 500 prospects verified and synced to internal pipeline.",
      ],
      lastActivity: "Subscription activated, invoice sent",
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
    {
      id: "deal_1004",
      contactName: "Marcus Vance",
      companyName: "HyperScale Media",
      title: "Founder & Chief Executive Officer",
      email: "marcus@hyperscalemedia.co",
      phone: "+1 (312) 440-8910",
      dealValue: 1800,
      currency: "USD",
      stage: "contacted",
      priority: "medium",
      notes: [
        "Personalized outreach generated via 5-Question AI context studio.",
        "LinkedIn connection request accepted, follow-up sent.",
      ],
      lastActivity: "Follow-up email sequence step 2 dispatched",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "deal_1005",
      contactName: "Pooja Reddy",
      companyName: "Infiniti HR Tech",
      title: "Chief Marketing Officer",
      email: "pooja.reddy@infinitihr.com",
      phone: "+91 97010 33411",
      dealValue: 45000,
      currency: "INR",
      stage: "identified",
      priority: "medium",
      notes: [
        "Scored 94/100 Tier 1 fit from LeadIntellect Database.",
        "Preparing customized battlecard for enterprise HR pain points.",
      ],
      lastActivity: "Added to pipeline from LeadIntellect Database",
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];
}

function loadDeals(): Deal[] {
  try {
    if (fs.existsSync(CRM_FILE)) {
      const data = fs.readFileSync(CRM_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading crm-deals.json:", err);
  }
  const initial = getInitialDeals();
  saveDeals(initial);
  return initial;
}

function saveDeals(deals: Deal[]) {
  try {
    const dir = path.dirname(CRM_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CRM_FILE, JSON.stringify(deals, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving crm-deals.json:", err);
  }
}

export async function GET() {
  const deals = loadDeals();
  return NextResponse.json({ success: true, deals });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const deals = loadDeals();

    const newDeal: Deal = {
      id: `deal_${Date.now().toString().slice(-6)}`,
      prospectId: body.prospectId || "",
      contactName: body.contactName || "New Lead",
      companyName: body.companyName || "Organization",
      title: body.title || "Decision Maker",
      email: body.email || "",
      phone: body.phone || "",
      linkedin: body.linkedin || "",
      dealValue: Number(body.dealValue) || 25000,
      currency: body.currency || "INR",
      stage: body.stage || "identified",
      priority: body.priority || "medium",
      notes: body.notes ? (Array.isArray(body.notes) ? body.notes : [body.notes]) : ["Added to CRM pipeline."],
      lastActivity: "Added to CRM pipeline",
      createdAt: new Date().toISOString(),
      expectedCloseDate: body.expectedCloseDate || "",
    };

    deals.unshift(newDeal);
    saveDeals(deals);

    return NextResponse.json({ success: true, deal: newDeal });
  } catch (err) {
    console.error("Error creating deal:", err);
    return NextResponse.json({ error: "Failed to create deal." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, stage, notes, dealValue, priority, expectedCloseDate } = body;

    if (!id) return NextResponse.json({ error: "Deal ID required" }, { status: 400 });

    const deals = loadDeals();
    const index = deals.findIndex((d) => d.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    if (stage) deals[index].stage = stage;
    if (dealValue !== undefined) deals[index].dealValue = Number(dealValue);
    if (priority) deals[index].priority = priority;
    if (expectedCloseDate !== undefined) deals[index].expectedCloseDate = expectedCloseDate;
    if (notes) {
      deals[index].notes.unshift(notes);
      deals[index].lastActivity = notes;
    }

    saveDeals(deals);
    return NextResponse.json({ success: true, deal: deals[index] });
  } catch (err) {
    console.error("Error updating deal:", err);
    return NextResponse.json({ error: "Failed to update deal." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    let deals = loadDeals();
    deals = deals.filter((d) => d.id !== id);
    saveDeals(deals);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting deal:", err);
    return NextResponse.json({ error: "Failed to delete deal." }, { status: 500 });
  }
}
