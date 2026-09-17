const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Please set MONGODB_URI in your environment or .env.local before running migration.");
  process.exit(1);
}

async function migrate() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("leadintellect");
    const dbFile = path.join(process.cwd(), "data", "db.json");

    if (fs.existsSync(dbFile)) {
      const local = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
      if (local.leads && local.leads.length > 0) {
        for (const lead of local.leads) {
          await db.collection("leads").updateOne({ id: lead.id }, { $set: lead }, { upsert: true });
        }
        console.log(`Successfully migrated ${local.leads.length} leads to MongoDB!`);
      }
      if (local.contacts && local.contacts.length > 0) {
        for (const contact of local.contacts) {
          await db.collection("contacts").updateOne({ id: contact.id }, { $set: contact }, { upsert: true });
        }
        console.log(`Successfully migrated ${local.contacts.length} contacts to MongoDB!`);
      }
    }
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.close();
  }
}

migrate();
