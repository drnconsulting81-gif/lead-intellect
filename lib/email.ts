import nodemailer from "nodemailer";
import { saveEmailLog, CEO_EMAILS } from "./db";

export interface WelcomeEmailParams {
  name: string;
  email: string;
  company?: string;
  title?: string;
  credits?: number;
}

export interface CeoAlertParams {
  name: string;
  email: string;
  company?: string;
  title?: string;
  provider?: string;
  role?: string;
}

function getTransporter() {
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
 * Sends branded welcome & confirmation email to newly registered user
 */
export async function sendWelcomeConfirmationEmail({
  name,
  email,
  company,
  credits = 100,
}: WelcomeEmailParams): Promise<{ success: boolean; mode: string }> {
  const subject = "Welcome to LeadIntellect - 100 Free Prospecting Credits Added! 🚀";
  const firstName = name.split(" ")[0] || "there";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lead-intellect.com";
  const workspaceUrl = `${siteUrl}/dashboard`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1220; margin: 0; padding: 30px 15px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
    .header { background: #0b1220; padding: 32px 40px; text-align: left; border-bottom: 2px solid #14b8a6; }
    .logo { color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .logo span { color: #14b8a6; }
    .content { padding: 40px; }
    h1 { color: #0b1220; font-size: 24px; font-weight: 800; margin-top: 0; line-height: 1.3; }
    p { color: #475569; font-size: 15px; line-height: 1.6; margin: 16px 0; }
    .credit-badge { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 18px 24px; margin: 24px 0; text-align: center; }
    .credit-count { font-size: 32px; font-weight: 900; color: #0d9488; }
    .credit-text { font-size: 13px; font-weight: 600; color: #0f766e; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn { display: inline-block; background: #14b8a6; color: #0b1220; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 800; font-size: 15px; margin: 20px 0; }
    .features { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .feature-item { display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 14px; color: #334155; }
    .feature-item:last-child { margin-bottom: 0; }
    .feature-icon { color: #14b8a6; font-weight: bold; margin-right: 10px; }
    .footer { background: #f1f5f9; padding: 24px 40px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">LEAD<span>INTELLECT</span></div>
      <div style="color: #94a3b8; font-size: 12px; margin-top: 4px;">AI-Powered B2B Prospecting & ICP Intelligence</div>
    </div>
    <div class="content">
      <h1>Welcome aboard, ${firstName}! 👋</h1>
      <p>Your LeadIntellect sales intelligence workspace is ready. You now have instant access to our verified B2B contact database, Apollo-style ICP filtering engine, and 1:1 outreach pitch generator.</p>
      
      <div class="credit-badge">
        <div class="credit-count">${credits} FREE CREDITS</div>
        <div class="credit-text">Allocated to your account (${email})</div>
      </div>

      <div style="text-align: center;">
        <a href="${workspaceUrl}" class="btn">Access Your Prospecting Workspace →</a>
      </div>

      <div class="features">
        <div style="font-weight: 700; color: #0b1220; margin-bottom: 12px; font-size: 14px;">What you can do right now:</div>
        <div class="feature-item">
          <span class="feature-icon">✓</span>
          <span><strong>Filter by ICP Tier:</strong> Surface Tier 1 (90+ Fit) accounts matching your ideal customer profile.</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">✓</span>
          <span><strong>Access C-Suite & VP Contacts:</strong> Unlock verified work emails and direct dial phones.</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">✓</span>
          <span><strong>Generate 1:1 Pitches:</strong> Produce hyper-personalized cold emails and LinkedIn messages mapped to prospect pains.</span>
        </div>
      </div>

      <p style="margin-top: 28px; font-size: 14px; color: #64748b;">
        Need dedicated onboarding or custom dataset requirements? Reply directly to this email or reach our executive team at <a href="mailto:ceo@leadintellect.ai" style="color: #0d9488;">ceo@leadintellect.ai</a>.
      </p>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #334155;">
        <strong>Raghunandan Devarshetty</strong><br>
        CEO &amp; Founder, LeadIntellect<br>
        <span style="color: #64748b;">${company ? `Account configured for: ${company}` : ""}</span>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} LeadIntellect. All rights reserved. &middot; Transforming Contact Data into Business Context.
    </div>
  </div>
</body>
</html>
  `;

  let sent = false;
  let status: "sent" | "failed" | "simulated" = "simulated";
  let errorMessage: string | undefined = undefined;

  // 1. Try Resend if configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.SMTP_FROM || "LeadIntellect <onboarding@leadintellect.ai>",
          to: email,
          subject,
          html,
        }),
      });
      if (res.ok) {
        sent = true;
        status = "sent";
      }
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : String(err);
    }
  }

  // 2. Try SMTP Transporter if not yet sent
  if (!sent) {
    const transporter = getTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"LeadIntellect" <no-reply@leadintellect.ai>',
          to: email,
          subject,
          html,
        });
        sent = true;
        status = "sent";
      } catch (err) {
        errorMessage = err instanceof Error ? err.message : String(err);
        status = "failed";
      }
    }
  }

  // 3. Log to DB and local backup
  await saveEmailLog({
    type: "welcome_confirmation",
    recipient: email,
    subject,
    status,
    errorMessage,
  });

  return { success: true, mode: status };
}

/**
 * Sends real-time alert to CEO whenever a new user signs up
 */
export async function sendCeoNewUserAlert({
  name,
  email,
  company,
  title,
  provider = "email",
  role = "user",
}: CeoAlertParams): Promise<void> {
  const ceoTargetEmail = process.env.NOTIFICATION_EMAIL || CEO_EMAILS[0];
  const subject = `🚨 New User Signup: ${name} (${email}) - ${company || "No Company"}`;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; color: #0b1220;">
  <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background: #0b1220; padding: 20px; color: #ffffff; border-bottom: 3px solid #14b8a6;">
      <h2 style="margin: 0; font-size: 18px; color: #14b8a6;">🚨 LeadIntellect CEO Platform Alert</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">A new user has registered on your sales intelligence platform.</p>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 120px;">Full Name:</td><td style="padding: 8px 0; font-weight: bold; color: #0b1220;">${name}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Work Email:</td><td style="padding: 8px 0; font-weight: bold; color: #0d9488;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Company:</td><td style="padding: 8px 0; color: #0b1220;">${company || "Not provided"}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Job Title:</td><td style="padding: 8px 0; color: #0b1220;">${title || "Not provided"}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Auth Method:</td><td style="padding: 8px 0; text-transform: uppercase; font-weight: bold;">${provider}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Assigned Role:</td><td style="padding: 8px 0; color: #7c3aed; font-weight: bold; text-transform: uppercase;">${role}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Timestamp:</td><td style="padding: 8px 0; color: #64748b;">${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} IST</td></tr>
      </table>

      <div style="margin-top: 24px; text-align: center;">
        <a href="https://lead-intellect.com/admin" style="display: inline-block; background: #0b1220; color: #14b8a6; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-weight: bold; font-size: 13px; border: 1px solid #14b8a6;">Open CEO Admin Portal →</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  let status: "sent" | "failed" | "simulated" = "simulated";
  let errorMessage: string | undefined = undefined;

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"LeadIntellect System" <alerts@leadintellect.ai>',
        to: ceoTargetEmail,
        subject,
        html,
      });
      status = "sent";
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : String(err);
      status = "failed";
    }
  }

  await saveEmailLog({
    type: "ceo_new_user_alert",
    recipient: ceoTargetEmail,
    subject,
    status,
    errorMessage,
  });
}
