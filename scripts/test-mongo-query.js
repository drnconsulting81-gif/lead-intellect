const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://drnconsulting81_db_user:BuU3CUOF1nfzrs9n@cluster0.0yz4rlv.mongodb.net/leadintellect?appName=Cluster0&retryWrites=true&w=majority";

async function test() {
  const client = new MongoClient(uri);
  await client.connect();
  const collection = client.db("leadintellect").collection("prospects");

  const start = Date.now();
  const total = await collection.countDocuments({});
  const sample = await collection.find({}).sort({ icpScore: -1 }).limit(5).toArray();
  const elapsed = Date.now() - start;

  console.log(`Query completed in ${elapsed}ms:`);
  console.log(`Total records: ${total}`);
  console.log("Top 2 samples:", sample.slice(0, 2).map((p) => ({
    name: p.name,
    title: p.title,
    company: p.company,
    score: p.icpScore,
    location: `${p.city}, ${p.country}`,
  })));

  await client.close();
}

test().catch(console.error);
