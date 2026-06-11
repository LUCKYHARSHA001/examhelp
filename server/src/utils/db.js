// src/utils/db.js
// Utility module to initialize and connect to MongoDB using Mongoose.

import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[Database] Error: MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[Database] Connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
