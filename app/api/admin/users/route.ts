import { NextResponse } from "next/server";
import { getUsers } from "@/lib/db";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users in /api/admin/users:", error);
    return NextResponse.json(
      { error: "Failed to retrieve registered users." },
      { status: 500 }
    );
  }
}
