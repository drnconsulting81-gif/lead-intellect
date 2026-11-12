const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://drnconsulting81_db_user:BuU3CUOF1nfzrs9n@cluster0.0yz4rlv.mongodb.net/leadintellect?appName=Cluster0&retryWrites=true&w=majority";

async function seed() {
  console.log("=== LeadIntellect MongoDB Seeder ===");
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas successfully!");
    const db = client.db("leadintellect");
    const collection = db.collection("prospects");

    const existingCount = await collection.countDocuments();
    console.log(`Current documents in 'prospects' collection: ${existingCount}`);

    const dataDir = path.join(__dirname, "..", "data");
    const files = ["prospects_part1.json", "prospects_part2.json", "prospects_part3.json"];

    let totalInserted = 0;

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }

      console.log(`\nReading ${file}...`);
      const raw = fs.readFileSync(filePath, "utf-8");
      const records = JSON.parse(raw);
      console.log(`Parsed ${records.length} records from ${file}. Ingesting in batches of 2500...`);

      const batchSize = 2500;
      for (let i = 0; i < records.length; i += batchSize) {
        const chunk = records.slice(i, i + batchSize);
        const operations = chunk.map((p) => ({
          updateOne: {
            filter: { id: p.id },
            update: { $set: p },
            upsert: true,
          },
        }));

        await collection.bulkWrite(operations, { ordered: false });
        totalInserted += chunk.length;
        process.stdout.write(
          `\rProgress: ${totalInserted} / 220,814 (${Math.round((totalInserted / 220814) * 100)}%)`
        );
      }
    }

    console.log(`\n\nAll records ingested. Building indexes for high-speed queries...`);
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ icpScore: -1 });
    await collection.createIndex({ industry: 1 });
    await collection.createIndex({ country: 1 });
    await collection.createIndex({ seniority: 1 });
    await collection.createIndex({ company: 1 });
    await collection.createIndex({ title: 1 });
    await collection.createIndex({ emailStatus: 1 });
    await collection.createIndex({ hasEmail: 1, hasPhone: 1 });

    const finalCount = await collection.countDocuments();
    console.log(`\n✓ SUCCESS! Total verified prospects in MongoDB Atlas: ${finalCount}`);
  } catch (err) {
    console.error("\nSeeding error:", err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
