import fs from "fs";
import path from "path";
import { getMongoDb, isMongoConfigured } from "./mongodb";

export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export interface LeadRecord {
  id: string;
  type: "demo" | "trial";
  fullName: string;
  title: string;
  companyName: string;
  email: string;
  phone: string;
  comments?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface ContactRecord {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  title?: string;
  company?: string;
  provider: "email" | "google" | "github" | "microsoft";
  createdAt: string;
}

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type OrderItemType = "subscription" | "database_purchase";

export interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  phone?: string;
  itemType: OrderItemType;
  planName: string; // e.g. "Growth Subscription (Monthly)", "50,000 Verified B2B Database Pack"
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string; // e.g. "Bank Transfer / Wire", "Stripe", "Razorpay", "Invoice"
  transactionId?: string;
  notes?: string;
  createdAt: string;
}

interface DatabaseSchema {
  leads: LeadRecord[];
  contacts: ContactRecord[];
  users: UserRecord[];
  orders: OrderRecord[];
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

/* ----------------- LOCAL JSON STORAGE HELPERS ----------------- */

function readLocalDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      leads: [],
      contacts: [],
      users: [],
      orders: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      leads: parsed.leads || [],
      contacts: parsed.contacts || [],
      users: parsed.users || [],
      orders: parsed.orders || [],
    };
  } catch (err) {
    console.error("Error reading local db.json, returning empty defaults:", err);
    return { leads: [], contacts: [], users: [], orders: [] };
  }
}

function writeLocalDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/* ----------------- DUAL-MODE EXPORTED OPERATIONS ----------------- */

export async function saveLead(lead: Omit<LeadRecord, "id" | "createdAt" | "status"> & { status?: LeadStatus }): Promise<LeadRecord> {
  const record: LeadRecord = {
    ...lead,
    id: "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    status: lead.status || "new",
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection<LeadRecord>("leads").insertOne(record);
        return record;
      }
    } catch (err) {
      console.warn("MongoDB write failed, falling back to local storage:", err);
    }
  }

  // Fallback to local JSON
  const local = readLocalDb();
  local.leads.unshift(record);
  writeLocalDb(local);
  return record;
}

export async function getLeads(): Promise<LeadRecord[]> {
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const records = await db
          .collection<LeadRecord>("leads")
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        return records.map((r) => ({
          id: r.id,
          type: r.type,
          fullName: r.fullName,
          title: r.title,
          companyName: r.companyName,
          email: r.email,
          phone: r.phone,
          comments: r.comments,
          status: r.status || "new",
          createdAt: r.createdAt,
        }));
      }
    } catch (err) {
      console.warn("MongoDB read failed, falling back to local storage:", err);
    }
  }

  const local = readLocalDb();
  return local.leads;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const res = await db
          .collection<LeadRecord>("leads")
          .updateOne({ id }, { $set: { status } });
        if (res.modifiedCount > 0) return true;
      }
    } catch (err) {
      console.warn("MongoDB update status failed:", err);
    }
  }

  const local = readLocalDb();
  const index = local.leads.findIndex((l) => l.id === id);
  if (index !== -1) {
    local.leads[index].status = status;
    writeLocalDb(local);
    return true;
  }
  return false;
}

export async function saveContact(contact: Omit<ContactRecord, "id" | "createdAt">): Promise<ContactRecord> {
  const record: ContactRecord = {
    ...contact,
    id: "contact_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection<ContactRecord>("contacts").insertOne(record);
        return record;
      }
    } catch (err) {
      console.warn("MongoDB contact write failed, falling back to local storage:", err);
    }
  }

  const local = readLocalDb();
  local.contacts.unshift(record);
  writeLocalDb(local);
  return record;
}

export async function getContacts(): Promise<ContactRecord[]> {
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const records = await db
          .collection<ContactRecord>("contacts")
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        return records.map((c) => ({
          id: c.id,
          fullName: c.fullName,
          email: c.email,
          company: c.company,
          phone: c.phone,
          subject: c.subject,
          message: c.message,
          createdAt: c.createdAt,
        }));
      }
    } catch (err) {
      console.warn("MongoDB contact read failed, falling back to local storage:", err);
    }
  }

  const local = readLocalDb();
  return local.contacts;
}

export async function saveUser(user: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> {
  const record: UserRecord = {
    ...user,
    id: "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const existing = await db
          .collection<UserRecord>("users")
          .findOne({ email: user.email.toLowerCase() });
        if (existing) return existing;
        await db.collection<UserRecord>("users").insertOne(record);
        return record;
      }
    } catch (err) {
      console.warn("MongoDB user write failed, falling back to local storage:", err);
    }
  }

  const local = readLocalDb();
  const existing = local.users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (existing) return existing;

  local.users.unshift(record);
  writeLocalDb(local);
  return record;
}

export async function getUsers(): Promise<UserRecord[]> {
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const records = await db
          .collection<UserRecord>("users")
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        return records.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          title: u.title,
          company: u.company,
          provider: u.provider,
          createdAt: u.createdAt,
        }));
      }
    } catch (err) {
      console.warn("MongoDB user read failed, falling back to local storage:", err);
    }
  }

  const local = readLocalDb();
  return local.users;
}

/* ----------------- ORDERS / SUBSCRIPTIONS OPERATIONS ----------------- */

export async function saveOrder(order: Omit<OrderRecord, "id" | "createdAt">): Promise<OrderRecord> {
  const record: OrderRecord = {
    ...order,
    id: "ord_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection<OrderRecord>("orders").insertOne(record);
        return record;
      }
    } catch (err) {
      console.warn("MongoDB order write failed, falling back to local storage:", err);
    }
  }

  const local = readLocalDb();
  local.orders.unshift(record);
  writeLocalDb(local);
  return record;
}

export async function getOrders(): Promise<OrderRecord[]> {
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const records = await db
          .collection<OrderRecord>("orders")
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        return records.map((o) => ({
          id: o.id,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          companyName: o.companyName,
          phone: o.phone,
          itemType: o.itemType,
          planName: o.planName,
          amount: o.amount,
          currency: o.currency || "USD",
          paymentStatus: o.paymentStatus || "paid",
          paymentMethod: o.paymentMethod || "Bank Transfer",
          transactionId: o.transactionId,
          notes: o.notes,
          createdAt: o.createdAt,
        }));
      }
    } catch (err) {
      console.warn("MongoDB orders read failed, falling back to local storage:", err);
    }
  }

  const local = readLocalDb();
  return local.orders || [];
}

export async function updateOrderStatus(id: string, paymentStatus: PaymentStatus): Promise<boolean> {
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const res = await db
          .collection<OrderRecord>("orders")
          .updateOne({ id }, { $set: { paymentStatus } });
        if (res.modifiedCount > 0) return true;
      }
    } catch (err) {
      console.warn("MongoDB order update failed:", err);
    }
  }

  const local = readLocalDb();
  const index = local.orders.findIndex((o) => o.id === id);
  if (index !== -1) {
    local.orders[index].paymentStatus = paymentStatus;
    writeLocalDb(local);
    return true;
  }
  return false;
}

/* ----------------- DIAGNOSTICS & STATUS ----------------- */

export async function getDatabaseDiagnostics(): Promise<{
  mode: "mongodb" | "local_json";
  connected: boolean;
  uriConfigured: boolean;
  counts: {
    totalLeads: number;
    demos: number;
    trials: number;
    contacts: number;
    users: number;
    orders: number;
    paidRevenue: number;
  };
}> {
  const uriConfigured = isMongoConfigured();
  let connected = false;
  let mode: "mongodb" | "local_json" = "local_json";

  if (uriConfigured) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.command({ ping: 1 });
        connected = true;
        mode = "mongodb";
      }
    } catch {
      connected = false;
    }
  }

  const leads = await getLeads();
  const contacts = await getContacts();
  const users = await getUsers();
  const orders = await getOrders();

  const paidRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  return {
    mode,
    connected: mode === "mongodb" ? connected : true,
    uriConfigured,
    counts: {
      totalLeads: leads.length,
      demos: leads.filter((l) => l.type === "demo").length,
      trials: leads.filter((l) => l.type === "trial").length,
      contacts: contacts.length,
      users: users.length,
      orders: orders.length,
      paidRevenue,
    },
  };
}
