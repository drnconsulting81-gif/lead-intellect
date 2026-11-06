import nodemailer from "nodemailer";
import { saveEmailLog, CEO_EMAILS } from "./db";

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

function getEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
}

/**
 * Dispatches confirmation email to the user AND notification alert to admin/CEO
 */
export async function sendLeadNotification(payload: NotificationPayload): Promise<{
  webhookSent: boolean;
  emailLogged: boolean;
  message: string;
}> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  const adminEmails = [
    process.env.NOTIFICATION_EMAIL || "raghud2483@gmail.com",
    "drnconsulting81@gmail.com",
    "ceo@leadintellect.ai",
  ];
  let webhookSent = false;
  const timeStr = payload.timestamp || new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) + " IST";

  console.log(`[Lead Notification] Inbound ${payload.type.toUpperCase()}: ${payload.fullName} (${payload.email}) at ${payload.companyName || "N/A"}`);

  // 1. CRM / Slack Webhook
  if (webhookUrl && webhookUrl.startsWith("http")) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🎯 *New ${payload.type.toUpperCase()} Submission* on LeadIntellect from *${payload.fullName}* (${payload.email}) at *${payload.companyName || "N/A"}*`,
          lead: { ...payload, timestamp: timeStr },
        }),
      });
      webhookSent = res.ok;
    } catch (err) {
      console.error("[CRM Webhook Error]", err);
    }
  }

  // 2. Prepare User Confirmation Email
  const typeTitles = {
    demo: "Live Product Demonstration & Strategy Session",
    trial: "7-Day Free Trial (99 Free Prospecting Credits)",
    contact: "Inquiry & Account Intelligence Support",
  };
  const userSubject =
    payload.type === "demo"
      ? "Confirmed: Your LeadIntellect Product Demonstration & Strategy Call 🎯"
      : payload.type === "trial"
      ? "Welcome to LeadIntellect - 7-Day Free Trial & 99 Prospecting Credits Activated 🚀"
      : "Thank you for contacting LeadIntellect — We have received your inquiry";

  const userHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b1220; margin: 0; padding: 30px 15px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
    <div style="background: #0b1220; padding: 28px 36px; border-bottom: 2px solid #14b8a6;">
      <div style="color: #ffffff; font-size: 20px; font-weight: 800;">LEAD<span style="color: #14b8a6;">INTELLECT</span></div>
      <div style="color: #94a3b8; font-size: 11px; margin-top: 4px;">B2B Account Intelligence &amp; Verified Sales Pipeline</div>
    </div>
    <div style="padding: 36px;">
      <h1 style="color: #0b1220; font-size: 22px; font-weight: 800; margin-top: 0;">Hello ${payload.fullName.split(" ")[0]}! 👋</h1>
      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        Thank you for submitting your request for <strong>${typeTitles[payload.type]}</strong> on LeadIntellect.
      </p>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; font-size: 13px;">
        <div style="font-weight: 700; color: #0b1220; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px; color: #64748b;">
          Summary of Your Submission:
        </div>
        <p style="margin: 4px 0;"><strong>Name:</strong> ${payload.fullName}</p>
        <p style="margin: 4px 0;"><strong>Work Email:</strong> ${payload.email}</p>
        ${payload.companyName ? `<p style="margin: 4px 0;"><strong>Company:</strong> ${payload.companyName}</p>` : ""}
        ${payload.title ? `<p style="margin: 4px 0;"><strong>Role / Title:</strong> ${payload.title}</p>` : ""}
        ${payload.phone ? `<p style="margin: 4px 0;"><strong>Phone:</strong> ${payload.phone}</p>` : ""}
        ${payload.comments ? `<p style="margin: 4px 0;"><strong>Notes:</strong> ${payload.comments}</p>` : ""}
      </div>

      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        ${
          payload.type === "trial"
            ? "Your 99 free trial credits have been activated. You can immediately log in to search decision-makers, filter by in-market buying signals, and reveal verified direct dials."
            : "Our executive sales intelligence team is reviewing your requirements and will reach out within 4 business hours to coordinate your custom walkthrough."
        }
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="https://lead-intellect.com/dashboard" style="display: inline-block; background: #14b8a6; color: #0b1220; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 800; font-size: 14px;">
          Access LeadIntellect Platform &rarr;
        </a>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #475569;">
        <strong>Raghunandan Devarshetty</strong><br>
        Founder &amp; CEO, LeadIntellect<br>
        <a href="mailto:ceo@leadintellect.ai" style="color: #0d9488; text-decoration: none;">ceo@leadintellect.ai</a>
      </div>
    </div>
    <div style="background: #f1f5f9; padding: 18px 36px; font-size: 11px; color: #64748b; text-align: center;">
      &copy; ${new Date().getFullYear()} LeadIntellect. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;

  // 3. Prepare Admin Alert Email
  const adminSubject = `🚨 [Inbound ${payload.type.toUpperCase()}] ${payload.fullName} - ${payload.companyName || "No Company"} (${payload.email})`;
  const adminHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; color: #0b1220;">
  <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden;">
    <div style="background: #0b1220; padding: 18px 24px; color: #ffffff; border-bottom: 3px solid #14b8a6;">
      <h2 style="margin: 0; font-size: 16px; color: #14b8a6;">🚨 LeadIntellect Inbound Alert: ${payload.type.toUpperCase()}</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">A prospective customer submitted an inquiry on lead-intellect.com</p>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 120px;">Full Name:</td><td style="padding: 8px 0; font-weight: bold; color: #0b1220;">${payload.fullName}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Work Email:</td><td style="padding: 8px 0; font-weight: bold; color: #0d9488;"><a href="mailto:${payload.email}">${payload.email}</a></td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Company:</td><td style="padding: 8px 0; color: #0b1220; font-weight: bold;">${payload.companyName || "N/A"}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Title / Role:</td><td style="padding: 8px 0; color: #0b1220;">${payload.title || "N/A"}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Phone:</td><td style="padding: 8px 0; color: #0b1220;">${payload.phone || "N/A"}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Comments:</td><td style="padding: 8px 0; color: #0b1220;">${payload.comments || "None"}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Timestamp:</td><td style="padding: 8px 0; color: #64748b;">${timeStr}</td></tr>
      </table>
      <div style="margin-top: 20px; text-align: center;">
        <a href="https://lead-intellect.com/admin" style="display: inline-block; background: #0b1220; color: #14b8a6; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 13px;">View in CEO Admin Portal &rarr;</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  // 4. Dispatch via Transporter (if configured)
  const transporter = getEmailTransporter();
  let userStatus: "sent" | "failed" | "simulated" = "simulated";
  let adminStatus: "sent" | "failed" | "simulated" = "simulated";

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"LeadIntellect" <welcome@leadintellect.ai>',
        to: payload.email,
        subject: userSubject,
        html: userHtml,
      });
      userStatus = "sent";
    } catch (err) {
      console.error("[User Email Error]", err);
      userStatus = "failed";
    }

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"LeadIntellect Alerts" <alerts@leadintellect.ai>',
        to: adminEmails.join(", "),
        subject: adminSubject,
        html: adminHtml,
      });
      adminStatus = "sent";
    } catch (err) {
      console.error("[Admin Alert Email Error]", err);
      adminStatus = "failed";
    }
  }

  // 5. Always persist audit log in system database
  await saveEmailLog({
    type: `user_confirmation_${payload.type}`,
    recipient: payload.email,
    subject: userSubject,
    status: userStatus,
  });

  await saveEmailLog({
    type: `admin_alert_${payload.type}`,
    recipient: adminEmails.join(", "),
    subject: adminSubject,
    status: adminStatus,
  });

  return {
    webhookSent,
    emailLogged: true,
    message: `Confirmation dispatched to ${payload.email} and admin team.`,
  };
}

export async function testWebhook(webhookUrl: string): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "⚡ Test webhook ping from LeadIntellect Admin Console",
        timestamp: new Date().toISOString(),
      }),
    });
    return { success: res.ok, status: res.status };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
