import { NextResponse } from "next/server";
import { getOrders, saveOrder, updateOrderStatus, PaymentStatus, OrderItemType } from "@/lib/db";
import { sendLeadNotification } from "@/lib/notifications";

export async function GET() {
  try {
    const orders = await getOrders();
    const paidRevenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
      paidRevenue,
    });
  } catch (error) {
    console.error("Error fetching orders in /api/admin/orders:", error);
    return NextResponse.json(
      { error: "Failed to retrieve orders." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      companyName,
      phone,
      itemType,
      planName,
      amount,
      currency,
      paymentStatus,
      paymentMethod,
      transactionId,
      notes,
    } = body;

    if (!customerName || !customerEmail || !planName || amount === undefined) {
      return NextResponse.json(
        { error: "Customer Name, Email, Plan Name, and Amount are required." },
        { status: 400 }
      );
    }

    const order = await saveOrder({
      customerName,
      customerEmail,
      companyName: companyName || "",
      phone: phone || "",
      itemType: (itemType as OrderItemType) || "subscription",
      planName,
      amount: Number(amount),
      currency: currency || "USD",
      paymentStatus: (paymentStatus as PaymentStatus) || "paid",
      paymentMethod: paymentMethod || "Bank Transfer",
      transactionId: transactionId || `TXN-${Date.now()}`,
      notes: notes || "",
    });

    // Notify CRM / Webhook if configured
    await sendLeadNotification({
      type: "trial",
      fullName: order.customerName,
      email: order.customerEmail,
      companyName: order.companyName || "N/A",
      phone: order.phone || "N/A",
      comments: `New ${order.itemType === "database_purchase" ? "Database Purchase" : "Subscription"}: $${order.amount} | Plan: ${order.planName} | Status: ${order.paymentStatus} | Method: ${order.paymentMethod} | Notes: ${order.notes || "None"}`,
    });

    return NextResponse.json({
      success: true,
      message: "Order / Subscription recorded successfully.",
      order,
    });
  } catch (error) {
    console.error("Error creating order in /api/admin/orders:", error);
    return NextResponse.json(
      { error: "Failed to record order." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, paymentStatus } = body;

    if (!id || !paymentStatus) {
      return NextResponse.json(
        { error: "Order ID and paymentStatus are required." },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, paymentStatus as PaymentStatus);
    if (!updated) {
      return NextResponse.json(
        { error: "Order not found or update failed." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
    });
  } catch (error) {
    console.error("Error updating order status in /api/admin/orders:", error);
    return NextResponse.json(
      { error: "Failed to update order status." },
      { status: 500 }
    );
  }
}
