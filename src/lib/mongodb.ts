import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  // Initialize with rejected promise to satisfy TypeScript and fail gracefully at runtime
  clientPromise = Promise.reject(new Error('Please add your MongoDB URI to .env.local'));
} else {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  if (!uri) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }
  const client = await clientPromise;
  return client.db();
}
