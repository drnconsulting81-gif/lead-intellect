import { NextResponse } from "next/server";
import {
  saveList,
  getListsByUser,
  addProspectsToList,
  removeProspectFromList,
  deleteList,
} from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail") || "guest@leadintellect.ai";
    const lists = await getListsByUser(userEmail);
    return NextResponse.json({ success: true, lists });
  } catch (err) {
    console.error("Error in GET /api/lists:", err);
    return NextResponse.json({ error: "Failed to fetch lists." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, name, description, prospectIds } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "List name is required." }, { status: 400 });
    }

    const email = userEmail || "guest@leadintellect.ai";
    const created = await saveList({
      userEmail: email,
      name: name.trim(),
      description: description?.trim() || "",
      prospectIds: Array.isArray(prospectIds) ? prospectIds : [],
    });

    return NextResponse.json({ success: true, list: created });
  } catch (err) {
    console.error("Error in POST /api/lists:", err);
    return NextResponse.json({ error: "Failed to create list." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { listId, action, prospectIds, prospectId } = body;

    if (!listId) {
      return NextResponse.json({ error: "List ID is required." }, { status: 400 });
    }

    if (action === "add" && Array.isArray(prospectIds)) {
      const ok = await addProspectsToList(listId, prospectIds);
      return NextResponse.json({ success: ok });
    }

    if (action === "remove" && prospectId) {
      const ok = await removeProspectFromList(listId, prospectId);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ error: "Invalid action or parameters." }, { status: 400 });
  } catch (err) {
    console.error("Error in PATCH /api/lists:", err);
    return NextResponse.json({ error: "Failed to update list." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const listId = searchParams.get("listId");
    const userEmail = searchParams.get("userEmail") || "guest@leadintellect.ai";

    if (!listId) {
      return NextResponse.json({ error: "List ID is required." }, { status: 400 });
    }

    const ok = await deleteList(listId, userEmail);
    return NextResponse.json({ success: ok });
  } catch (err) {
    console.error("Error in DELETE /api/lists:", err);
    return NextResponse.json({ error: "Failed to delete list." }, { status: 500 });
  }
}
