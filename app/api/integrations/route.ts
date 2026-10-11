import { NextResponse } from "next/server";
import { providerManager } from "@/lib/providers/manager";

export async function GET() {
  try {
    const integrations = await providerManager.getAllHealth();
    return NextResponse.json({
      success: true,
      integrations,
    });
  } catch (err) {
    console.error("Error in GET /api/integrations:", err);
    return NextResponse.json({ error: "Failed to fetch integrations." }, { status: 500 });
  }
}
