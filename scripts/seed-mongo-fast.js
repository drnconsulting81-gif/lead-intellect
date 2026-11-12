const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://drnconsulting81_db_user:BuU3CUOF1nfzrs9n@cluster0.0yz4rlv.mongodb.net/leadintellect?appName=Cluster0&retryWrites=true&w=majority";

async function main() {
  console.log("=== Fast MongoDB Atlas Prospect Seeder ===");
  const client = new MongoClient(uri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 60000,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    const db = client.db("leadintellect");
    const collection = db.collection("prospects");

    console.log("Clearing existing prospects collection for a clean ingestion...");
    await collection.drop().catch(() => console.log("Collection did not exist yet, creating fresh."));

    const dataDir = path.join(__dirname, "..", "data");
    const files = ["prospects_part1.json", "prospects_part2.json", "prospects_part3.json"];

    let grandTotal = 0;
    const startTime = Date.now();

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }

      console.log(`\nLoading ${file}...`);
      const raw = fs.readFileSync(filePath, "utf-8");
      const records = JSON.parse(raw);
      console.log(`Ingesting ${records.length} records in batches of 5000...`);

      const batchSize = 5000;
      for (let i = 0; i < records.length; i += batchSize) {
        const chunk = records.slice(i, i + batchSize);
        await collection.insertMany(chunk, { ordered: false });
        grandTotal += chunk.length;
        process.stdout.write(
          `\rIngested: ${grandTotal} / 220,814 records (${Math.round((grandTotal / 220814) * 100)}%)`
        );
      }
    }

    console.log("\n\nBuilding performance indexes on MongoDB Atlas...");
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ icpScore: -1 });
    await collection.createIndex({ industry: 1 });
    await collection.createIndex({ country: 1 });
    await collection.createIndex({ seniority: 1 });
    await collection.createIndex({ title: 1 });
    await collection.createIndex({ company: 1 });
    await collection.createIndex({ emailStatus: 1 });
    await collection.createIndex({ hasEmail: 1, hasPhone: 1 });
    await collection.createIndex({
      name: "text",
      company: "text",
      title: "text",
      industry: "text",
      city: "text",
    });

    const totalInDb = await collection.countDocuments();
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n==============================================`);
    console.log(`✓ COMPLETE: ${totalInDb} validated prospects in MongoDB Atlas!`);
    console.log(`Elapsed time: ${elapsedSec}s`);
    console.log(`==============================================\n`);
  } catch (err) {
    console.error("Ingestion failed:", err);
  } finally {
    await client.close();
  }
}

main();
