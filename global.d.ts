import { MongoClient } from 'mongodb';
import { Mongoose } from 'mongoose';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

export {};