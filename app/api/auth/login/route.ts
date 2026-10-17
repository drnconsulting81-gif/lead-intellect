import { NextResponse } from "next/server";
import { saveUser, findUserByEmail, isCeoEmail } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, provider, name } = body;

    // 1. Social Provider Authentication (Google, Microsoft, GitHub)
    if (provider === "google" || provider === "github" || provider === "microsoft") {
      const cleanEmail = (email || "").toLowerCase().trim();
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return NextResponse.json(
          { error: "A valid Google / work email address is required." },
          { status: 400 }
        );
      }

      const isCeo = isCeoEmail(cleanEmail);
      let user = await findUserByEmail(cleanEmail);

      if (!user) {
        // Automatically provision new user with standard welcome credits
        const displayName = name || cleanEmail.split("@")[0].replace(/[._-]/g, " ");
        user = await saveUser({
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          email: cleanEmail,
          provider,
          role: isCeo ? "admin" : "user",
          credits: isCeo ? 3500 : 100,
        });
      }

      return NextResponse.json({
        success: true,
        message: `Successfully authenticated with ${provider.toUpperCase()}.`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company,
          title: user.title,
          provider: user.provider,
          role: isCeo ? "admin" : (user.role || "user"),
          credits: user.credits ?? (isCeo ? 3500 : 100),
        },
      });
    }

    // 2. Email & Password Verification
    if (!email) {
      return NextResponse.json(
        { error: "Work email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const isCeo = isCeoEmail(cleanEmail);

    let user = await findUserByEmail(cleanEmail);

    // If CEO is logging in for the first time via admin/CEO signin
    if (!user && isCeo) {
      user = await saveUser({
        name: "DRN Consulting (CEO)",
        email: cleanEmail,
        password: password || "executive_access_grant",
        provider: "email",
        role: "admin",
        credits: 3500,
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email. Please click 'Create Account' to sign up first." },
        { status: 404 }
      );
    }

    // Check password if set
    if (user.password && password && user.password !== password) {
      // Allow executive master key bypass for CEO accounts if requested
      const isExecKey = isCeo && (password === "executive_access_grant" || password === "admin123" || password === "ceo2026");
      if (!isExecKey) {
        return NextResponse.json(
          { error: "Incorrect password. Please verify your credentials and try again." },
          { status: 401 }
        );
      }
    }

    // If user previously signed up without a password saved, update it now
    if (!user.password && password) {
      await saveUser({
        name: user.name,
        email: user.email,
        title: user.title,
        company: user.company,
        password,
        provider: user.provider,
        role: isCeo ? "admin" : (user.role || "user"),
        credits: user.credits,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Login successful. Welcome back!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        title: user.title,
        provider: user.provider,
        role: isCeo ? "admin" : (user.role || "user"),
        credits: user.credits ?? (isCeo ? 3500 : 100),
      },
    });
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json(
      { error: "Authentication failed due to a server error. Please try again." },
      { status: 500 }
    );
  }
}
