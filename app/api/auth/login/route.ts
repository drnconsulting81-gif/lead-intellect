import { NextResponse } from "next/server";
import { saveUser, findUserByEmail } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, provider } = body;

    // 1. Social Provider Authentication
    if (provider === "google" || provider === "github" || provider === "microsoft") {
      const mockName = email ? email.split("@")[0] : "Verified User";
      const user = await saveUser({
        name: mockName,
        email: email || `${provider}.user@leadintellect.ai`,
        provider,
      });
      return NextResponse.json({
        success: true,
        message: `Successfully authenticated with ${provider.toUpperCase()}.`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
        },
      });
    }

    // 2. Email & Password Verification
    if (!email || !password) {
      return NextResponse.json(
        { error: "Work email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email. Please click 'Create Account' to sign up first." },
        { status: 404 }
      );
    }

    // Check password if set
    if (user.password && user.password !== password) {
      return NextResponse.json(
        { error: "Incorrect password. Please verify your credentials and try again." },
        { status: 401 }
      );
    }

    // If user previously signed up without a password saved, update it now
    if (!user.password) {
      await saveUser({
        name: user.name,
        email: user.email,
        title: user.title,
        company: user.company,
        password,
        provider: user.provider,
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
