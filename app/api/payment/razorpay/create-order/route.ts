import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";

// Plan pricing definitions matching founder specification:
// Basic: $5; Starter: $29; Growth: $79; Enterprise: Custom
export const PLAN_PRICING: Record<
  string,
  {
    id: string;
    name: string;
    priceUSD: number;
    priceINR: number;
    credits: number;
  }
> = {
  basic: {
    id: "basic",
    name: "Basic (Pilot)",
    priceUSD: 5,
    priceINR: 449,
    credits: 50,
  },
  starter: {
    id: "starter",
    name: "Starter",
    priceUSD: 29,
    priceINR: 2499,
    credits: 100,
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceUSD: 79,
    priceINR: 6799,
    credits: 200,
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      planId,
      currency = "USD",
      billingCycle = "monthly",
      userEmail,
      userName,
    } = body;

    const plan = PLAN_PRICING[String(planId).toLowerCase()];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan selected. Please choose Basic, Starter, or Growth." },
        { status: 400 }
      );
    }

    const cleanEmail = (userEmail || "").toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required to initiate checkout." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_live_TtlEwA7xmPKVu3";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "CW7k3f2FLZAGZ0Y3Q8FfFg9j";

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay payment credentials are not configured on server." },
        { status: 500 }
      );
    }

    // Determine price in chosen currency
    const activeCurrency = currency.toUpperCase() === "INR" ? "INR" : "USD";
    const basePrice = activeCurrency === "INR" ? plan.priceINR : plan.priceUSD;
    const finalAmount = billingCycle === "annual" ? Math.round(basePrice * 10) : basePrice;

    // Razorpay amounts are in subunits (paise for INR, cents for USD)
    const amountInSubunits = finalAmount * 100;
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;

    // Call Razorpay API to create an order
    const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: amountInSubunits,
        currency: activeCurrency,
        receipt: receiptId,
        notes: {
          planId: plan.id,
          planName: plan.name,
          userEmail: cleanEmail,
          userName: userName || cleanEmail.split("@")[0],
          billingCycle,
        },
      }),
    });

    const orderData = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error("Razorpay order creation failed:", orderData);
      return NextResponse.json(
        {
          error:
            orderData.error?.description ||
            "Unable to generate payment order with gateway. Please check credentials or currency.",
          details: orderData,
        },
        { status: razorpayResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId,
      plan: {
        id: plan.id,
        name: plan.name,
        credits: plan.credits,
        priceFormatted: `${activeCurrency === "INR" ? "₹" : "$"}${finalAmount}`,
      },
    });
  } catch (error) {
    console.error("Error in /api/payment/razorpay/create-order:", error);
    return NextResponse.json(
      { error: "Internal server error while initializing payment order." },
      { status: 500 }
    );
  }
}

