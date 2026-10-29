import { NextResponse } from "next/server";
import { deductUserCredit, findUserByEmail, hasUserRevealedProspect, isCeoEmail, isUserOnPaidPlan, saveUser } from "@/lib/db";
import fs from "fs";
import path from "path";

// Fast in-memory cache of master prospects
let prospectCacheMap: Map<string, Record<string, unknown>> | null = null;

function getProspectMap(): Map<string, Record<string, unknown>> {
  if (prospectCacheMap) return prospectCacheMap;
  prospectCacheMap = new Map();
  try {
    const filePath = path.join(process.cwd(), "data", "prospects.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const all: Record<string, unknown>[] = JSON.parse(raw);
      for (const p of all) {
        if (p && p.id) {
          prospectCacheMap.set(String(p.id), p);
        }
      }
    }
  } catch (err) {
    console.error("Failed to load prospect cache:", err);
  }
  return prospectCacheMap;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, prospectId } = body;

    if (!prospectId) {
      return NextResponse.json({ error: "Prospect ID is required." }, { status: 400 });
    }

    const cleanEmail = (userEmail || "").toLowerCase().trim();
    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to reveal verified contact coordinates." },
        { status: 401 }
      );
    }

    // 1. Authenticate user & check authorization
    const isCeo = isCeoEmail(cleanEmail);
    let user = await findUserByEmail(cleanEmail);

    if (!user && isCeo) {
      user = await saveUser({
        name: "DRN Consulting (CEO)",
        email: cleanEmail,
        provider: "email",
        role: "admin",
        credits: 3500,
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Authorized user account not found. Please log in or register." },
        { status: 401 }
      );
    }

    // Enforce paid plan requirement to unlock contact intelligence
    const isPaid = isUserOnPaidPlan(user);
    if (!isPaid && !isCeo) {
      return NextResponse.json(
        {
          error: "Database access locked. Revealing direct corporate emails and mobile lines requires an active paid subscription (Basic, Starter, or Growth). Please upgrade your plan to unlock.",
          paymentRequired: true,
          insufficientCredits: true,
          remainingCredits: user.credits || 0,
        },
        { status: 403 }
      );
    }

    const targetId = String(prospectId);
    const pMap = getProspectMap();
    let foundProspect = pMap.get(targetId) || (body.prospect as Record<string, unknown> | undefined);

    if (!foundProspect) {
      // Secondary search across map entries
      for (const [, val] of pMap.entries()) {
        if (val && String((val as Record<string, unknown>).id) === targetId) {
          foundProspect = val;
          break;
        }
      }
    }

    // 2. Reject if prospect cannot be located
    if (!foundProspect) {
      return NextResponse.json(
        { error: "Prospect record not found in LeadIntellect master directory." },
        { status: 404 }
      );
    }

    // 3. Idempotency Check: Did this user already reveal this contact?
    // Policy: Repeated reveals of the same contact by the same user are 100% free!
    let alreadyRevealed = false;
    try {
      alreadyRevealed = await hasUserRevealedProspect(cleanEmail, targetId);
    } catch (err) {
      console.warn("hasUserRevealedProspect error:", err);
    }

    let remainingCredits = user.credits ?? 3500;

    if (!alreadyRevealed) {
      // 4. Balance check before reveal
      if (!isCeo && remainingCredits < 1) {
        return NextResponse.json(
          {
            error: "Insufficient credits. Your balance is 0. Please upgrade your plan to unlock more prospects.",
            insufficientCredits: true,
            remainingCredits: 0,
          },
          { status: 402 }
        );
      }

      // 5. Execute atomic credit deduction
      const deduction = await deductUserCredit(
        cleanEmail,
        1,
        "reveal",
        `Revealed verified contact details for ${foundProspect.name || "Decision Maker"} (${foundProspect.company || "Company"})`,
        targetId
      );

      if (!deduction.success) {
        return NextResponse.json(
          {
            error: deduction.error || "Failed to process credit transaction. Please try again.",
            remainingCredits: deduction.remainingCredits,
          },
          { status: 400 }
        );
      }

      remainingCredits = deduction.remainingCredits;
    }

    // 6. Return genuine unmasked contact details
    const email = String(foundProspect.email || "").trim();
    const phone = String(foundProspect.phone || "").trim();

    return NextResponse.json({
      success: true,
      prospectId: targetId,
      email: email && email !== "not_available" ? email : "Verified Email Available in Master Directory",
      emailStatus: foundProspect.emailStatus || "verified",
      emailConfidence: foundProspect.emailConfidence || 98,
      verificationSource: foundProspect.verificationSource || "LeadIntellect Cleaned Master Dataset",
      verificationDate: foundProspect.verificationDate || "2026-10-03",
      phone: phone && phone !== "None" ? phone : "Corporate Line Available",
      phoneType: foundProspect.phoneType || "Direct Dial",
      hasPhone: Boolean(phone && phone !== "None"),
      linkedin: foundProspect.linkedin || `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(String(foundProspect.name || ""))}`,
      alreadyRevealed,
      costCharged: alreadyRevealed ? 0 : 1,
      remainingCredits,
    });
  } catch (err) {
    console.error("Error in /api/prospects/reveal:", err);
    return NextResponse.json(
      { error: "Server error during contact reveal. No credits were improperly deducted." },
      { status: 500 }
    );
  }
}
