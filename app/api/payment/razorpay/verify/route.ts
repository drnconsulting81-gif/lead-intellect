import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  saveOrder,
  updateUserPlan,
  findUserByEmail,
  saveUser,
  logCreditTransaction,
} from "@/lib/db";
import { PLAN_PRICING } from "../create-order/route";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planId,
      billingCycle = "monthly",
      userEmail,
      userName,
      currency = "USD",
      amount,
    } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required Razorpay payment verification fields." },
        { status: 400 }
      );
    }

    const cleanEmail = (userEmail || "").toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid user email address is required for subscription activation." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "CW7k3f2FLZAGZ0Y3Q8FfFg9j";

    // 1. Cryptographic HMAC SHA256 Signature Verification
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Razorpay signature mismatch:", {
        received: razorpay_signature,
        generated: generatedSignature,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
      return NextResponse.json(
        {
          error:
            "Payment verification failed: cryptographic signature mismatch. Plan upgrade was denied.",
        },
        { status: 400 }
      );
    }

    // 2. Map plan attributes and credit allowance
    const normalizedPlanId = String(planId).toLowerCase();
    const planMeta = PLAN_PRICING[normalizedPlanId] || {
      id: normalizedPlanId,
      name: `${normalizedPlanId.toUpperCase()} Plan`,
      priceUSD: 29,
      priceINR: 2499,
      credits: 100,
    };

    const creditsToAdd = planMeta.credits;
    const finalAmount =
      typeof amount === "number"
        ? amount
        : currency.toUpperCase() === "INR"
        ? planMeta.priceINR
        : planMeta.priceUSD;

    // 3. Ensure user exists and update plan to ACTIVE with paid credits
    let user = await findUserByEmail(cleanEmail);
    if (!user) {
      user = await saveUser({
        name: userName || cleanEmail.split("@")[0],
        email: cleanEmail,
        provider: "email",
        role: "user",
        plan: normalizedPlanId as "basic" | "starter" | "growth" | "enterprise",
        planStatus: "active",
        credits: creditsToAdd,
      });
    } else {
      user = (await updateUserPlan(
        cleanEmail,
        normalizedPlanId as "basic" | "starter" | "growth" | "enterprise",
        "active",
        creditsToAdd
      )) || user;
    }

    // 4. Log the transaction in Credit Ledger
    await logCreditTransaction({
      userEmail: cleanEmail,
      action: "subscription",
      amount: creditsToAdd,
      balanceAfter: user.credits ?? creditsToAdd,
      description: `Razorpay Verified: ${planMeta.name} (${razorpay_payment_id})`,
      recordId: razorpay_payment_id,
    });

    // 5. Record verified Order in the platform database
    const savedOrder = await saveOrder({
      customerName: user.name || userName || cleanEmail.split("@")[0],
      customerEmail: cleanEmail,
      companyName: user.company || "Independent",
      itemType: "subscription",
      planName: `${planMeta.name} (${billingCycle.toUpperCase()})`,
      amount: finalAmount,
      currency: currency.toUpperCase(),
      paymentStatus: "paid",
      paymentMethod: "Razorpay Live Gateway",
      transactionId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      notes: `Verified subscription via Razorpay. Key: ${process.env.RAZORPAY_KEY_ID?.substring(0, 8)}... Order: ${razorpay_order_id}`,
    });

    return NextResponse.json({
      success: true,
      message: `Payment successful! Your account is now active on the ${planMeta.name}.`,
      orderId: savedOrder.id,
      transactionId: razorpay_payment_id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan || normalizedPlanId,
        planStatus: "active",
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Error in /api/payment/razorpay/verify:", error);
    return NextResponse.json(
      { error: "Server error occurred while verifying payment." },
      { status: 500 }
    );
  }
}

