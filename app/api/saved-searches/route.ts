import { NextResponse } from "next/server";
import { saveSavedSearch, getSavedSearchesByUser, deleteSavedSearch } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail") || "guest@leadintellect.ai";
    const searches = await getSavedSearchesByUser(userEmail);
    return NextResponse.json({ success: true, savedSearches: searches });
  } catch (err) {
    console.error("Error in GET /api/saved-searches:", err);
    return NextResponse.json({ error: "Failed to fetch saved searches." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, name, searchType, filters, resultCount } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Search name is required." }, { status: 400 });
    }

    const email = userEmail || "guest@leadintellect.ai";
    const created = await saveSavedSearch({
      userEmail: email,
      name: name.trim(),
      searchType: searchType || "people",
      filters: filters || {},
      resultCount: resultCount || 0,
    });

    return NextResponse.json({ success: true, savedSearch: created });
  } catch (err) {
    console.error("Error in POST /api/saved-searches:", err);
    return NextResponse.json({ error: "Failed to save search." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userEmail = searchParams.get("userEmail") || "guest@leadintellect.ai";

    if (!id) {
      return NextResponse.json({ error: "Search ID is required." }, { status: 400 });
    }

    const ok = await deleteSavedSearch(id, userEmail);
    return NextResponse.json({ success: ok });
  } catch (err) {
    console.error("Error in DELETE /api/saved-searches:", err);
    return NextResponse.json({ error: "Failed to delete saved search." }, { status: 500 });
  }
}
