import { NextResponse } from "next/server";
import { getDatabaseDiagnostics } from "@/lib/db";

export async function GET() {
  try {
    const diagnostics = await getDatabaseDiagnostics();
    return NextResponse.json(diagnostics);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
