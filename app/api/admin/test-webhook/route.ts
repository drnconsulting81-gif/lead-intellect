import { NextResponse } from "next/server";
import { testWebhook } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const webhookUrl = body.webhookUrl || process.env.CRM_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Please provide a valid Webhook URL or set CRM_WEBHOOK_URL in .env.local." },
        { status: 400 }
      );
    }

    const result = await testWebhook(webhookUrl);
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test lead successfully delivered to webhook URL!",
        status: result.status,
      });
    } else {
      return NextResponse.json(
        { error: result.error || `Webhook responded with status ${result.status}` },
        { status: 400 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
