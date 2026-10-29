import { NextResponse } from "next/server";
import { getUsers, updateUserPlan, addOrAdjustUserCredit, findUserByEmail, saveUser } from "@/lib/db";

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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { email, plan, planStatus, credits, role } = body;

    if (!email) {
      return NextResponse.json({ error: "User email is required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await findUserByEmail(cleanEmail);

    if (plan !== undefined || planStatus !== undefined) {
      user = await updateUserPlan(
        cleanEmail,
        plan || user?.plan || "free",
        planStatus || user?.planStatus || "active",
        0
      );
    }

    if (credits !== undefined) {
      const delta = Number(credits) - (user?.credits || 0);
      await addOrAdjustUserCredit(cleanEmail, delta, "bonus", "Admin manual credit adjustment");
      if (user) user.credits = Number(credits);
    }

    if (role && user) {
      await saveUser({
        name: user.name,
        email: user.email,
        title: user.title,
        company: user.company,
        password: user.password,
        provider: user.provider,
        role: role as "admin" | "user",
        plan: user.plan,
        planStatus: user.planStatus,
        credits: user.credits,
      });
      user.role = role;
    }

    return NextResponse.json({
      success: true,
      message: `User ${cleanEmail} updated successfully.`,
      user,
    });
  } catch (error) {
    console.error("Error updating user in /api/admin/users:", error);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
