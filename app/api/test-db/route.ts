import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const result: Record<string, any> = {
    isMongoConfigured: isMongoConfigured(),
    mongoStatus: "pending",
    filesInDataDir: [],
    cwd: process.cwd(),
  };

  // 1. Check local files
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (fs.existsSync(dataDir)) {
      result.filesInDataDir = fs.readdirSync(dataDir).map((f) => {
        try {
          const stats = fs.statSync(path.join(dataDir, f));
          return { name: f, sizeMB: (stats.size / (1024 * 1024)).toFixed(2) };
        } catch {
          return { name: f };
        }
      });
    } else {
      result.filesInDataDir = "data directory does not exist";
    }
  } catch (err: any) {
    result.filesInDataDirError = err.message;
  }

  // 2. Check MongoDB Atlas
  try {
    const start = Date.now();
    const db = await getMongoDb();
    if (db) {
      const collections = await db.listCollections().toArray();
      const prospectsCount = await db.collection("prospects").countDocuments();
      result.mongoStatus = "connected";
      result.mongoElapsedMs = Date.now() - start;
      result.collections = collections.map((c) => c.name);
      result.prospectsCount = prospectsCount;
    } else {
      result.mongoStatus = "db is null";
    }
  } catch (err: any) {
    result.mongoStatus = "error";
    result.mongoError = err.message;
  }

  return NextResponse.json(result);
}
