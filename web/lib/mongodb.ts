import { MongoClient, type Db } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("DATABASE_URL environment variable is not set");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri);

const clientPromise =
  process.env.NODE_ENV === "development"
    ? (global._mongoClientPromise ??= client.connect())
    : client.connect();

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getMongoDb(dbName?: string): Promise<Db> {
  const connectedClient = await getMongoClient();
  return connectedClient.db(dbName);
}
