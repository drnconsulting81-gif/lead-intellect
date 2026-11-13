import { MongoClient } from "mongodb";

const DEFAULT_MONGODB_URI =
  "mongodb+srv://drnconsulting81_db_user:BuU3CUOF1nfzrs9n@cluster0.0yz4rlv.mongodb.net/leadintellect?appName=Cluster0&retryWrites=true&w=majority";

const uri = (process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0)
  ? process.env.MONGODB_URI
  : DEFAULT_MONGODB_URI;

const options = {
  serverSelectionTimeoutMS: 6000,
  connectTimeoutMS: 6000,
  socketTimeoutMS: 20000,
  maxPoolSize: 10,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.trim().length > 0);
}

export async function getMongoClientPromise(): Promise<MongoClient | null> {
  if (!uri) {
    return null;
  }

  // Cache client promise globally in all environments (essential for serverless reuse)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      // Clear global promise on connection error so future calls can retry
      global._mongoClientPromise = undefined;
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;

  return clientPromise;
}

export async function getMongoDb() {
  const promise = await getMongoClientPromise();
  if (!promise) return null;
  const client = await promise;
  return client.db("leadintellect");
}
