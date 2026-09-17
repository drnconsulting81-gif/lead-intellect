import { NextResponse } from "next/server";
import { saveUser, getUsers } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, title, company, password, provider } = body;

    if (provider === "google" || provider === "github" || provider === "microsoft") {
      const user = saveUser({
        name: name || "Verified User",
        email: email || `${provider}.user@leadintellect.ai`,
        title: title || "",
        company: company || "",
        provider,
      });
      return NextResponse.json({
        success: true,
        message: `Account created with ${provider}.`,
        user,
      });
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Full Name, Work Email, and Password are required." },
        { status: 400 }
      );
    }

    const user = saveUser({
      name,
      email,
      title: title || "",
      company: company || "",
      provider: "email",
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully! Welcome to LeadIntellect.",
      user,
    });
  } catch (error) {
    console.error("Error in /api/auth/signup:", error);
    return NextResponse.json(
      { error: "Signup failed. Please try again." },
      { status: 500 }
    );
  }
}
