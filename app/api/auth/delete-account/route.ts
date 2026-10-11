import { NextResponse } from "next/server";
import { deleteUserAccount } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, confirmation } = body;

    if (!email || confirmation !== "DELETE") {
      return NextResponse.json(
        { error: "Valid email and confirmation string 'DELETE' are required." },
        { status: 400 }
      );
    }

    const ok = await deleteUserAccount(email);
    return NextResponse.json({
      success: ok,
      message: "Account and associated data have been permanently deleted.",
    });
  } catch (err) {
    console.error("Error in delete-account API:", err);
    return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
  }
}
