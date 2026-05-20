import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URL;

if (!uri) {
  throw new Error('Missing environment variable: "MONGODB_URI"');
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  console.log(process.env.NODE_ENV);
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(dbName = process.env.MONGODB_DB_NAME ?? "mindforge"): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
