import { NextResponse } from "next/server";
import { saveUser, findUserByEmail } from "@/lib/db";
import { sendLeadNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, title, company, password, provider } = body;

    // 1. Social Provider Signup
    if (provider === "google" || provider === "github" || provider === "microsoft") {
      const user = await saveUser({
        name: name || "Verified User",
        email: email || `${provider}.user@leadintellect.ai`,
        title: title || "",
        company: company || "",
        provider,
      });

      // Dispatch signup alert
      await sendLeadNotification({
        type: "trial",
        fullName: user.name,
        email: user.email,
        companyName: user.company || "N/A",
        title: user.title || "N/A",
        comments: `🚀 New User Sign-up via ${provider.toUpperCase()}.`,
      });

      return NextResponse.json({
        success: true,
        message: `Account created with ${provider.toUpperCase()}.`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company,
          title: user.title,
          provider: user.provider,
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

    // 4. Create and persist user
    const user = await saveUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      title: (title || "").trim(),
      company: (company || "").trim(),
      password,
      provider: "email",
    });

    // 5. Dispatch notification to CRM / Webhook / Email logger
    await sendLeadNotification({
      type: "trial",
      fullName: user.name,
      email: user.email,
      companyName: user.company || "N/A",
      title: user.title || "N/A",
      comments: `🚀 New Platform User Sign-up! Account provisioned for ${user.name} (${user.email}).`,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully! Welcome to LeadIntellect.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        title: user.title,
        provider: user.provider,
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
