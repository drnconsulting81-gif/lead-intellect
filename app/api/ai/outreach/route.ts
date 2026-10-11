import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prospectName,
      title,
      company,
      industry,
      location,
      userProductDescription,
      senderName,
      senderCompany,
    } = body;

    if (!prospectName || !company) {
      return NextResponse.json(
        { error: "Prospect name and company are required." },
        { status: 400 }
      );
    }

    const firstName = prospectName.split(" ")[0];
    const sName = senderName || "Your Name";
    const sCompany = senderCompany || "Our Team";
    const productPitch =
      userProductDescription ||
      "streamlining B2B revenue operations and targeting verified decision-makers";

    // Factual, restrained outreach drafts
    const coldEmail = {
      subject: `Quick question regarding ${company}'s ${industry || "operations"} initiatives`,
      body: `Hi ${firstName},

I noticed your work leading ${title || "the team"} at ${company}. Given your focus within ${industry || "the sector"} in ${location || "your market"}, I wanted to reach out directly.

At ${sCompany}, we specialize in ${productPitch}. We work with leaders in your role to eliminate operational friction and accelerate target account acquisition.

Would you be open to a brief 10-minute introductory conversation next Tuesday or Thursday?

Best regards,
${sName}
${sCompany}`,
    };

    const followUpEmail = {
      subject: `Re: Quick question regarding ${company}`,
      body: `Hi ${firstName},

Following up on my previous note. I know you're busy steering ${title || "initiatives"} at ${company}.

If evaluating solutions for ${productPitch} is on your radar this quarter, I'd be glad to share a quick 2-page overview of how peer organizations in ${industry || "your industry"} approach this.

Let me know if that would be helpful.

Best,
${sName}`,
    };

    const linkedInMessage = `Hi ${firstName}, saw your role as ${title || "leader"} at ${company}. We help ${industry || "B2B"} teams with ${productPitch}. Would love to connect and share relevant insights if you're open to it.`;

    const phoneOpener = `"Hi ${firstName}, this is ${sName} with ${sCompany}. I know I'm calling out of the blue — I was researching ${company}'s presence in ${location || "your market"} and wanted to ask one quick question about how your team is currently handling ${industry ? industry.toLowerCase() + " workflows" : "operations"}?"`;

    return NextResponse.json({
      success: true,
      drafts: {
        coldEmail,
        followUpEmail,
        linkedInMessage,
        phoneOpener,
      },
    });
  } catch (err) {
    console.error("Error in /api/ai/outreach:", err);
    return NextResponse.json({ error: "Failed to generate outreach drafts." }, { status: 500 });
  }
}
