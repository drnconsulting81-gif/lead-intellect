import { NextResponse } from "next/server";
import { saveUser, getUsers } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, provider } = body;

    if (provider === "google" || provider === "github" || provider === "microsoft") {
      const mockName = email ? email.split("@")[0] : "Verified User";
      const user = await saveUser({
        name: mockName,
        email: email || `${provider}.user@leadintellect.ai`,
        provider,
      });
      return NextResponse.json({
        success: true,
        message: `Successfully authenticated with ${provider}.`,
        user,
      });
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Work email and password are required." },
        { status: 400 }
      );
    }

    // Check existing or authenticate mock user
    const users = await getUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // For demonstration convenience, auto-register or authenticate
      user = await saveUser({
        name: email.split("@")[0],
        email,
        provider: "email",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Login successful. Redirecting to workspace...",
      user,
    });
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
