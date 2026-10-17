import { NextResponse } from "next/server";
import { saveUser, findUserByEmail, isCeoEmail } from "@/lib/db";
import { sendLeadNotification } from "@/lib/notifications";
import { sendWelcomeConfirmationEmail, sendCeoNewUserAlert } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, title, company, password, provider } = body;

    // 1. Social Provider Signup
    if (provider === "google" || provider === "github" || provider === "microsoft") {
      const cleanEmail = (email || "").toLowerCase().trim();
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return NextResponse.json(
          { error: "A valid Google or work email address is required." },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existing = await findUserByEmail(cleanEmail);
      if (existing) {
        return NextResponse.json({
          success: true,
          message: `Account already exists. Successfully authenticated with ${provider.toUpperCase()}!`,
          user: {
            id: existing.id,
            name: existing.name,
            email: existing.email,
            company: existing.company,
            title: existing.title,
            provider: existing.provider,
            role: existing.role,
            credits: existing.credits,
          },
        });
      }

      const displayName = name || cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const user = await saveUser({
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: cleanEmail,
        title: title || "",
        company: company || "",
        provider,
      });

      // Dispatch real welcome confirmation email to user
      sendWelcomeConfirmationEmail({
        name: user.name,
        email: user.email,
        company: user.company,
        credits: user.credits || 100,
      }).catch((err) => console.error("Error sending welcome email:", err));

      // Dispatch alert to CEO
      sendCeoNewUserAlert({
        name: user.name,
        email: user.email,
        company: user.company,
        title: user.title,
        provider,
        role: user.role,
      }).catch((err) => console.error("Error sending CEO alert:", err));

      // Dispatch legacy CRM / Slack webhook
      await sendLeadNotification({
        type: "trial",
        fullName: user.name,
        email: user.email,
        companyName: user.company || "N/A",
        title: user.title || "N/A",
        comments: `🚀 New User Sign-up via ${provider.toUpperCase()} (${user.role}).`,
      });

      return NextResponse.json({
        success: true,
        message: `Account created with ${provider.toUpperCase()}. 100 free prospecting credits added!`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company,
          title: user.title,
          provider: user.provider,
          role: user.role,
          credits: user.credits,
        },
      });
    }

    // 2. Email & Password Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Full Name, Work Email, and Password are required." },
        { status: 400 }
      );
    }

    // 3. Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please switch to the Sign In tab." },
        { status: 409 }
      );
    }

    // 4. Create and persist user with role and credits
    const user = await saveUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      title: (title || "").trim(),
      company: (company || "").trim(),
      password,
      provider: "email",
    });

    // 5. Send Welcome & Confirmation Email to user
    sendWelcomeConfirmationEmail({
      name: user.name,
      email: user.email,
      company: user.company,
      credits: user.credits || 100,
    }).catch((err) => console.error("Error sending user confirmation email:", err));

    // 6. Send Alert Email to CEO
    sendCeoNewUserAlert({
      name: user.name,
      email: user.email,
      company: user.company,
      title: user.title,
      provider: "email",
      role: user.role,
    }).catch((err) => console.error("Error sending CEO alert:", err));

    // 7. Dispatch notification to CRM / Webhook logger
    await sendLeadNotification({
      type: "trial",
      fullName: user.name,
      email: user.email,
      companyName: user.company || "N/A",
      title: user.title || "N/A",
      comments: `🚀 New Platform User Sign-up (${user.role})! Account provisioned for ${user.name} (${user.email}).`,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully! Confirmation email dispatched with 100 free credits.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        title: user.title,
        provider: user.provider,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/auth/signup:", error);
    return NextResponse.json(
      { error: "Signup failed: " + msg },
      { status: 500 }
    );
  }
}
