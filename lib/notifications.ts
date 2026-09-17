export interface NotificationPayload {
  type: "demo" | "trial" | "contact";
  fullName: string;
  email: string;
  companyName?: string;
  title?: string;
  phone?: string;
  comments?: string;
  timestamp?: string;
}

export async function sendLeadNotification(payload: NotificationPayload): Promise<{
  webhookSent: boolean;
  emailLogged: boolean;
  message: string;
}> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  const recipientEmail = process.env.NOTIFICATION_EMAIL || "sales@leadintellect.ai";
  let webhookSent = false;

  console.log(`[Lead Notification] New ${payload.type.toUpperCase()} from ${payload.fullName} (${payload.email}) at ${payload.companyName || "N/A"}`);

  // 1. Dispatch to CRM / Slack Webhook if configured
  if (webhookUrl && webhookUrl.startsWith("http")) {
    try {
      const slackStylePayload = {
        text: `🚀 *New ${payload.type === "demo" ? "VIP Demo Request" : payload.type === "trial" ? "14-Day Free Trial Signup" : "Contact Inquiry"}* received on LeadIntellect!`,
        lead: {
          ...payload,
          timestamp: payload.timestamp || new Date().toISOString(),
        },
      };

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackStylePayload),
      });

      webhookSent = res.ok;
      console.log(`[CRM Webhook] Dispatched to ${webhookUrl} - Status: ${res.status}`);
    } catch (err) {
      console.error("[CRM Webhook Error] Failed to send webhook notification:", err);
    }
  }

  // 2. Email alert notification (logged or dispatched)
  console.log(`[Email Alert] Target Recipient: ${recipientEmail} - Subject: [LeadIntellect] New ${payload.type.toUpperCase()}: ${payload.fullName}`);

  return {
    webhookSent,
    emailLogged: true,
    message: webhookSent
      ? "Notification dispatched to CRM/Slack and queued for email."
      : "Notification logged to system. (Configure CRM_WEBHOOK_URL to forward to Slack/HubSpot).",
  };
}

export async function testWebhook(webhookUrl: string): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const testPayload = {
      text: "⚡ *LeadIntellect Webhook Integration Test* - Connection Successful!",
      testLead: {
        type: "demo",
        fullName: "Jordan Lee (Test Lead)",
        title: "VP of Business Development",
        companyName: "Acme Global Solutions",
        email: "jordan.lee@acmeglobal.com",
        phone: "+1 (555) 987-6543",
        comments: "Testing CRM webhook connection from LeadIntellect Admin Portal.",
        timestamp: new Date().toISOString(),
      },
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    return {
      success: res.ok,
      status: res.status,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      error: message,
    };
  }
}
