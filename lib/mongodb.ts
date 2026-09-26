import { MongoClient, type Db } from "mongodb";

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Missing environment variable: "MONGODB_URI"');
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    return client.connect();
  }
}

export async function getDb(dbName = process.env.MONGODB_DB_NAME ?? "mindforge"): Promise<Db> {
  if (!clientPromise) {
    clientPromise = getClientPromise();
  }
  const client = await clientPromise;
  return client.db(dbName);
}
