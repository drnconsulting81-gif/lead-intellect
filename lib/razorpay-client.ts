"use client";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface CheckoutOptions {
  planId: "basic" | "starter" | "growth" | "enterprise";
  currency?: "INR" | "USD";
  billingCycle?: "monthly" | "annual";
  userEmail: string;
  userName?: string;
  userPhone?: string;
  preferredMethod?: "card" | "netbanking" | "upi" | "wallet";
  onSuccess: (verifiedUser: any, transactionId: string) => void;
  onError: (errorMsg: string) => void;
  onDismiss?: () => void;
}

export async function launchRazorpayCheckout(opts: CheckoutOptions) {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      opts.onError("Failed to load Razorpay payment gateway script. Please check your network connection.");
      return;
    }

    // 1. Create order on backend
    const res = await fetch("/api/payment/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: opts.planId,
        currency: opts.currency || "USD",
        billingCycle: opts.billingCycle || "monthly",
        userEmail: opts.userEmail,
        userName: opts.userName,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      opts.onError(data.error || "Unable to initialize payment order.");
      return;
    }

    // 2. Configure Razorpay modal prioritizing global card payment and searchable alternatives
    const razorpayOptions: any = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "LeadIntellect",
      description: `${data.plan.name} Subscription`,
      order_id: data.orderId,
      image: "/favicon.svg",
      prefill: {
        name: opts.userName || "",
        email: opts.userEmail,
        contact: opts.userPhone || "",
        method: opts.preferredMethod || (data.currency === "USD" ? "card" : undefined),
      },
      config: {
        display: {
          blocks: {
            card_block: {
              name: "Cards (Global Visa, MasterCard, Amex, Discover)",
              instruments: [
                {
                  method: "card",
                },
              ],
            },
            other_block: {
              name: "Other Payment Options (Search & Select)",
              instruments: [
                {
                  method: "netbanking",
                },
                {
                  method: "wallet",
                },
                {
                  method: "upi",
                },
              ],
            },
          },
          sequence: ["block.card_block", "block.other_block"],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      theme: {
        color: "#0B132B", // LeadIntellect Navy
      },
      modal: {
        confirm_close: true,
        ondismiss: () => {
          if (opts.onDismiss) opts.onDismiss();
        },
      },
      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        try {
          // 3. Verify signature securely on the server
          const verifyRes = await fetch("/api/payment/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planId: opts.planId,
              billingCycle: opts.billingCycle || "monthly",
              userEmail: opts.userEmail,
              userName: opts.userName,
              currency: data.currency,
              amount: data.amount / 100,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            // Update local storage session
            try {
              localStorage.setItem("leadintellect_user", JSON.stringify(verifyData.user));
            } catch {}
            opts.onSuccess(verifyData.user, response.razorpay_payment_id);
          } else {
            opts.onError(verifyData.error || "Payment verification failed.");
          }
        } catch {
          opts.onError("Connection error while verifying payment with server.");
        }
      },
    };

    const rzpInstance = new window.Razorpay(razorpayOptions);
    rzpInstance.open();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected payment error";
    opts.onError(msg);
  }
}

