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
  password?: string;
  provider: "email" | "google" | "github" | "microsoft";
  role?: "admin" | "user";
  credits?: number;
  emailVerified?: boolean;
  createdAt: string;
}

export interface EmailLogRecord {
  id: string;
  type: "welcome_confirmation" | "ceo_new_user_alert" | "order_receipt";
  recipient: string;
  subject: string;
  status: "sent" | "failed" | "simulated";
  errorMessage?: string;
  createdAt: string;
}

export interface ListRecord {
  id: string;
  userEmail: string;
  name: string;
  description?: string;
  prospectIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearchRecord {
  id: string;
  userEmail: string;
  name: string;
  searchType: "people" | "companies";
  filters: Record<string, unknown>;
  resultCount?: number;
  createdAt: string;
}

export interface CreditLedgerRecord {
  id: string;
  userEmail: string;
  action: "reveal" | "enrichment" | "verification" | "export" | "bonus" | "subscription";
  amount: number;
  balanceAfter: number;
  description: string;
  recordId?: string;
  createdAt: string;
}

export interface SuppressionRecord {
  id: string;
  email: string;
  domain?: string;
  reason: string;
  createdAt: string;
}

export interface ExportLogRecord {
  id: string;
  userEmail: string;
  recordCount: number;
  exportType: "people" | "companies";
  format: "csv";
  createdAt: string;
}

export const CEO_EMAILS = [
  "drnconsulting81@gmail.com",
  "raghu96666@gmail.com",
  "raghud.smartcheck@gmail.com",
  "ceo@leadintellect.ai",
];

export function isCeoEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  if (CEO_EMAILS.includes(clean)) return true;
  const adminEnv = process.env.ADMIN_EMAILS || "";
  const allowed = adminEnv.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(clean);
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
  planName: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
}

interface DatabaseSchema {
  leads: LeadRecord[];
  contacts: ContactRecord[];
  users: UserRecord[];
  orders: OrderRecord[];
  emailLogs?: EmailLogRecord[];
  lists?: ListRecord[];
  savedSearches?: SavedSearchRecord[];
  creditLedger?: CreditLedgerRecord[];
  suppression?: SuppressionRecord[];
  exportLogs?: ExportLogRecord[];
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
      lists: [],
      savedSearches: [],
      creditLedger: [],
      suppression: [],
      exportLogs: [],
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
      emailLogs: parsed.emailLogs || [],
      lists: parsed.lists || [],
      savedSearches: parsed.savedSearches || [],
      creditLedger: parsed.creditLedger || [],
      suppression: parsed.suppression || [],
      exportLogs: parsed.exportLogs || [],
    };
  } catch (err) {
    console.error("Error reading local db.json, returning empty defaults:", err);
    return {
      leads: [],
      contacts: [],
      users: [],
      orders: [],
      lists: [],
      savedSearches: [],
      creditLedger: [],
      suppression: [],
      exportLogs: [],
    };
  }
}

function writeLocalDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/* ----------------- LEADS & CONTACTS ----------------- */

export async function saveLead(
  lead: Omit<LeadRecord, "id" | "createdAt" | "status"> & { status?: LeadStatus }
): Promise<LeadRecord> {
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

export async function saveContact(
  contact: Omit<ContactRecord, "id" | "createdAt">
): Promise<ContactRecord> {
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

/* ----------------- USERS & AUTH ----------------- */

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const cleanEmail = email.toLowerCase().trim();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const u = await db.collection<UserRecord>("users").findOne({ email: cleanEmail });
        if (u) {
          const role = isCeoEmail(u.email) ? "admin" : (u.role || "user");
          const credits = u.credits ?? (isCeoEmail(u.email) ? 999999 : 100);
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            title: u.title,
            company: u.company,
            password: u.password,
            provider: u.provider,
            role,
            credits,
            emailVerified: u.emailVerified ?? false,
            createdAt: u.createdAt,
          };
        }
        return null;
      }
    } catch (err) {
      console.warn("MongoDB findUserByEmail failed:", err);
    }
  }

  const local = readLocalDb();
  const found = local.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (found) {
    found.role = isCeoEmail(found.email) ? "admin" : (found.role || "user");
    found.credits = found.credits ?? (isCeoEmail(found.email) ? 999999 : 100);
    return found;
  }
  return null;
}

export async function saveUser(user: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> {
  const cleanEmail = user.email.toLowerCase().trim();
  const role = isCeoEmail(cleanEmail) ? "admin" : (user.role || "user");
  const credits = user.credits ?? (isCeoEmail(cleanEmail) ? 999999 : 100);
  const emailVerified = user.emailVerified ?? false;

  const record: UserRecord = {
    ...user,
    email: cleanEmail,
    role,
    credits,
    emailVerified,
    id: "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  // 1. Persist to MongoDB if configured
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const existing = await db
          .collection<UserRecord>("users")
          .findOne({ email: cleanEmail });
        if (existing) {
          const updateFields: Partial<UserRecord> = { role };
          if (user.password && !existing.password) updateFields.password = user.password;
          if (user.name) updateFields.name = user.name;
          if (user.company) updateFields.company = user.company;
          if (user.title) updateFields.title = user.title;

          await db.collection<UserRecord>("users").updateOne(
            { email: cleanEmail },
            { $set: updateFields }
          );
          existing.role = role;
          existing.credits = existing.credits ?? credits;
        } else {
          await db.collection<UserRecord>("users").insertOne({ ...record });
        }
      }
    } catch (err) {
      console.warn("MongoDB user write failed, falling back to local storage:", err);
    }
  }

  // 2. Synchronous local JSON mirror
  const local = readLocalDb();
  const existingIndex = local.users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  if (existingIndex !== -1) {
    local.users[existingIndex].role = role;
    if (user.password && !local.users[existingIndex].password) {
      local.users[existingIndex].password = user.password;
    }
    if (user.name) local.users[existingIndex].name = user.name;
    if (user.company) local.users[existingIndex].company = user.company;
    if (user.title) local.users[existingIndex].title = user.title;
    writeLocalDb(local);
  } else {
    local.users.unshift(record);
    writeLocalDb(local);
  }

  // 3. Register user in pipeline leads
  try {
    await saveLead({
      type: "trial",
      fullName: record.name,
      title: record.title || "Platform User",
      companyName: record.company || "Self",
      email: record.email,
      phone: "",
      comments: `New Platform User Sign-up (${role.toUpperCase()}). Granted 100 free prospecting credits.`,
      status: "new",
    });
  } catch (err) {
    console.warn("Failed to create pipeline lead for new user:", err);
  }

  return record;
}

export async function deleteUserAccount(email: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("users").deleteOne({ email: cleanEmail });
        await db.collection("lists").deleteMany({ userEmail: cleanEmail });
        await db.collection("saved_searches").deleteMany({ userEmail: cleanEmail });
      }
    } catch (err) {
      console.warn("MongoDB deleteUserAccount error:", err);
    }
  }

  const local = readLocalDb();
  local.users = local.users.filter((u) => u.email.toLowerCase() !== cleanEmail);
  if (local.lists) local.lists = local.lists.filter((l) => l.userEmail.toLowerCase() !== cleanEmail);
  if (local.savedSearches) {
    local.savedSearches = local.savedSearches.filter((s) => s.userEmail.toLowerCase() !== cleanEmail);
  }
  writeLocalDb(local);
  return true;
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
          password: u.password,
          provider: u.provider,
          role: isCeoEmail(u.email) ? "admin" : (u.role || "user"),
          credits: u.credits ?? (isCeoEmail(u.email) ? 999999 : 100),
          emailVerified: u.emailVerified ?? false,
          createdAt: u.createdAt,
        }));
      }
    } catch (err) {
      console.warn("MongoDB user read failed, falling back to local storage:", err);
    }
  }

  const local = readLocalDb();
  return local.users.map((u) => ({
    ...u,
    role: isCeoEmail(u.email) ? "admin" : (u.role || "user"),
    credits: u.credits ?? (isCeoEmail(u.email) ? 999999 : 100),
  }));
}

/* ----------------- CREDIT SYSTEM & LEDGER ----------------- */

export async function logCreditTransaction(
  tx: Omit<CreditLedgerRecord, "id" | "createdAt">
): Promise<CreditLedgerRecord> {
  const record: CreditLedgerRecord = {
    ...tx,
    id: "crd_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection<CreditLedgerRecord>("credit_ledger").insertOne(record);
      }
    } catch (err) {
      console.warn("MongoDB credit log failed:", err);
    }
  }

  const local = readLocalDb();
  if (!local.creditLedger) local.creditLedger = [];
  local.creditLedger.unshift(record);
  writeLocalDb(local);
  return record;
}

export async function getCreditHistoryByUser(email: string): Promise<CreditLedgerRecord[]> {
  const cleanEmail = email.toLowerCase().trim();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const res = await db
          .collection<CreditLedgerRecord>("credit_ledger")
          .find({ userEmail: cleanEmail })
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray();
        return res;
      }
    } catch (err) {
      console.warn("MongoDB getCreditHistoryByUser failed:", err);
    }
  }

  const local = readLocalDb();
  return (local.creditLedger || []).filter((c) => c.userEmail.toLowerCase() === cleanEmail);
}

export async function deductUserCredit(
  email: string,
  amount = 1,
  action: CreditLedgerRecord["action"] = "reveal",
  description = "Contact detail reveal",
  recordId?: string
): Promise<{ success: boolean; remainingCredits: number }> {
  const cleanEmail = email.toLowerCase().trim();

  // CEO has unlimited credits
  if (isCeoEmail(cleanEmail)) {
    await logCreditTransaction({
      userEmail: cleanEmail,
      action,
      amount: 0,
      balanceAfter: 999999,
      description: `${description} (Admin Unlimited Privilege)`,
      recordId,
    });
    return { success: true, remainingCredits: 999999 };
  }

  let currentCredits = 100;
  let userFound = false;

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const u = await db.collection<UserRecord>("users").findOne({ email: cleanEmail });
        if (u) {
          userFound = true;
          currentCredits = u.credits ?? 100;
          if (currentCredits < amount) {
            return { success: false, remainingCredits: currentCredits };
          }
          const updated = currentCredits - amount;
          await db.collection<UserRecord>("users").updateOne(
            { email: cleanEmail },
            { $set: { credits: updated } }
          );
          await logCreditTransaction({
            userEmail: cleanEmail,
            action,
            amount,
            balanceAfter: updated,
            description,
            recordId,
          });
          return { success: true, remainingCredits: updated };
        }
      }
    } catch (err) {
      console.warn("MongoDB deductUserCredit failed:", err);
    }
  }

  const local = readLocalDb();
  const idx = local.users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  if (idx !== -1) {
    userFound = true;
    currentCredits = local.users[idx].credits ?? 100;
    if (currentCredits < amount) return { success: false, remainingCredits: currentCredits };
    local.users[idx].credits = currentCredits - amount;
    writeLocalDb(local);
    await logCreditTransaction({
      userEmail: cleanEmail,
      action,
      amount,
      balanceAfter: local.users[idx].credits ?? 0,
      description,
      recordId,
    });
    return { success: true, remainingCredits: local.users[idx].credits ?? 0 };
  }

  if (!userFound) {
    const fallback = Math.max(0, 100 - amount);
    await logCreditTransaction({
      userEmail: cleanEmail,
      action,
      amount,
      balanceAfter: fallback,
      description,
      recordId,
    });
    return { success: true, remainingCredits: fallback };
  }

  return { success: false, remainingCredits: 0 };
}

/* ----------------- LISTS MANAGEMENT ----------------- */

export async function saveList(
  list: Omit<ListRecord, "id" | "createdAt" | "updatedAt">
): Promise<ListRecord> {
  const record: ListRecord = {
    ...list,
    id: "list_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection<ListRecord>("lists").insertOne(record);
      }
    } catch (err) {
      console.warn("MongoDB saveList failed:", err);
    }
  }

  const local = readLocalDb();
  if (!local.lists) local.lists = [];
  local.lists.unshift(record);
  writeLocalDb(local);
  return record;
}

export async function getListsByUser(email: string): Promise<ListRecord[]> {
  const cleanEmail = email.toLowerCase().trim();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        return await db
          .collection<ListRecord>("lists")
          .find({ userEmail: cleanEmail })
          .sort({ updatedAt: -1 })
          .toArray();
      }
    } catch (err) {
      console.warn("MongoDB getListsByUser failed:", err);
    }
  }

  const local = readLocalDb();
  return (local.lists || []).filter((l) => l.userEmail.toLowerCase() === cleanEmail);
}

export async function addProspectsToList(listId: string, prospectIds: string[]): Promise<boolean> {
  const now = new Date().toISOString();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection<ListRecord>("lists").updateOne(
          { id: listId },
          {
            $addToSet: { prospectIds: { $each: prospectIds } },
            $set: { updatedAt: now },
          }
        );
      }
    } catch (err) {
      console.warn("MongoDB addProspectsToList failed:", err);
    }
  }

  const local = readLocalDb();
  if (!local.lists) return false;
  const target = local.lists.find((l) => l.id === listId);
  if (target) {
    const set = new Set([...target.prospectIds, ...prospectIds]);
    target.prospectIds = Array.from(set);
    target.updatedAt = now;
    writeLocalDb(local);
    return true;
  }
  return false;
}

export async function removeProspectFromList(listId: string, prospectId: string): Promise<boolean> {
  const now = new Date().toISOString();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection<ListRecord>("lists").updateOne(
          { id: listId },
          {
            $pull: { prospectIds: prospectId },
            $set: { updatedAt: now },
          }
        );
      }
    } catch (err) {
      console.warn("MongoDB removeProspectFromList failed:", err);
    }
  }

  const local = readLocalDb();
  if (!local.lists) return false;
  const target = local.lists.find((l) => l.id === listId);
  if (target) {
    target.prospectIds = target.prospectIds.filter((id) => id !== prospectId);
    target.updatedAt = now;
    writeLocalDb(local);
    return true;
  }
  return false;
}

export async function deleteList(listId: string, userEmail: string): Promise<boolean> {
  const cleanEmail = userEmail.toLowerCase().trim();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("lists").deleteOne({ id: listId, userEmail: cleanEmail });
      }
    } catch (err) {
      console.warn("MongoDB deleteList failed:", err);
    }
  }

  const local = readLocalDb();
  if (!local.lists) return false;
  local.lists = local.lists.filter((l) => !(l.id === listId && l.userEmail.toLowerCase() === cleanEmail));
  writeLocalDb(local);
  return true;
}

/* ----------------- SAVED SEARCHES ----------------- */

export async function saveSavedSearch(
  search: Omit<SavedSearchRecord, "id" | "createdAt">
): Promise<SavedSearchRecord> {
  const record: SavedSearchRecord = {
    ...search,
    id: "srch_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection<SavedSearchRecord>("saved_searches").insertOne(record);
      }
    } catch (err) {
      console.warn("MongoDB saveSavedSearch failed:", err);
    }
  }

  const local = readLocalDb();
  if (!local.savedSearches) local.savedSearches = [];
  local.savedSearches.unshift(record);
  writeLocalDb(local);
  return record;
}

export async function getSavedSearchesByUser(email: string): Promise<SavedSearchRecord[]> {
  const cleanEmail = email.toLowerCase().trim();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        return await db
          .collection<SavedSearchRecord>("saved_searches")
          .find({ userEmail: cleanEmail })
          .sort({ createdAt: -1 })
          .toArray();
      }
    } catch (err) {
      console.warn("MongoDB getSavedSearchesByUser failed:", err);
    }
  }

  const local = readLocalDb();
  return (local.savedSearches || []).filter((s) => s.userEmail.toLowerCase() === cleanEmail);
}

export async function deleteSavedSearch(id: string, userEmail: string): Promise<boolean> {
  const cleanEmail = userEmail.toLowerCase().trim();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("saved_searches").deleteOne({ id, userEmail: cleanEmail });
      }
    } catch (err) {
      console.warn("MongoDB deleteSavedSearch failed:", err);
    }
  }

  const local = readLocalDb();
  if (!local.savedSearches) return false;
  local.savedSearches = local.savedSearches.filter(
    (s) => !(s.id === id && s.userEmail.toLowerCase() === cleanEmail)
  );
  writeLocalDb(local);
  return true;
}

/* ----------------- SUPPRESSION LIST ----------------- */

export async function addSuppression(email: string, reason = "User opt-out request"): Promise<SuppressionRecord> {
  const cleanEmail = email.toLowerCase().trim();
  const record: SuppressionRecord = {
    id: "sup_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    email: cleanEmail,
    reason,
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("suppression").updateOne({ email: cleanEmail }, { $set: record }, { upsert: true });
      }
    } catch (err) {
      console.warn("MongoDB addSuppression failed:", err);
    }
  }

  const local = readLocalDb();
  if (!local.suppression) local.suppression = [];
  if (!local.suppression.some((s) => s.email.toLowerCase() === cleanEmail)) {
    local.suppression.push(record);
    writeLocalDb(local);
  }
  return record;
}

export async function isEmailSuppressed(email: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const found = await db.collection("suppression").findOne({ email: cleanEmail });
        if (found) return true;
      }
    } catch {
      // fallback
    }
  }

  const local = readLocalDb();
  return (local.suppression || []).some((s) => s.email.toLowerCase() === cleanEmail);
}

/* ----------------- EXPORT LOGS ----------------- */

export async function logExport(
  entry: Omit<ExportLogRecord, "id" | "createdAt">
): Promise<ExportLogRecord> {
  const record: ExportLogRecord = {
    ...entry,
    id: "exp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("export_logs").insertOne(record);
      }
    } catch (err) {
      console.warn("MongoDB logExport failed:", err);
    }
  }

  const local = readLocalDb();
  if (!local.exportLogs) local.exportLogs = [];
  local.exportLogs.unshift(record);
  writeLocalDb(local);
  return record;
}

export async function getExportLogsByUser(email: string): Promise<ExportLogRecord[]> {
  const cleanEmail = email.toLowerCase().trim();
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        return await db.collection<ExportLogRecord>("export_logs").find({ userEmail: cleanEmail }).sort({ createdAt: -1 }).toArray();
      }
    } catch (err) {
      console.warn("MongoDB getExportLogsByUser failed:", err);
    }
  }

  const local = readLocalDb();
  return (local.exportLogs || []).filter((e) => e.userEmail.toLowerCase() === cleanEmail);
}

/* ----------------- EMAIL LOGS ----------------- */

export async function saveEmailLog(
  log: Omit<EmailLogRecord, "id" | "createdAt">
): Promise<EmailLogRecord> {
  const record: EmailLogRecord = {
    ...log,
    id: "eml_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection<EmailLogRecord>("email_logs").insertOne(record);
      }
    } catch (err) {
      console.warn("MongoDB email log write failed:", err);
    }
  }

  const local = readLocalDb();
  if (!local.emailLogs) local.emailLogs = [];
  local.emailLogs.unshift(record);
  writeLocalDb(local);
  return record;
}

export async function getEmailLogs(): Promise<EmailLogRecord[]> {
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const logs = await db
          .collection<EmailLogRecord>("email_logs")
          .find({})
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray();
        return logs.map((l) => ({
          id: l.id,
          type: l.type,
          recipient: l.recipient,
          subject: l.subject,
          status: l.status,
          errorMessage: l.errorMessage,
          createdAt: l.createdAt,
        }));
      }
    } catch (err) {
      console.warn("MongoDB email logs read failed:", err);
    }
  }

  const local = readLocalDb();
  return local.emailLogs || [];
}

/* ----------------- ORDERS / SUBSCRIPTIONS ----------------- */

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
