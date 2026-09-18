import { NextResponse } from "next/server";
import { getEmailLogs } from "@/lib/db";

export async function GET() {
  try {
    const emailLogs = await getEmailLogs();
    return NextResponse.json({
      success: true,
      emailLogs,
      count: emailLogs.length,
    });
  } catch (error) {
    console.error("Error fetching email logs:", error);
    return NextResponse.json(
      { error: "Failed to retrieve email logs." },
      { status: 500 }
    );
  }
}
