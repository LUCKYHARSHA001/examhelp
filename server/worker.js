// worker.js
// Standalone entry point to start the BullMQ background worker.
// This process runs separately from the main Express server and processes enqueued PDF summarization jobs.

import './src/workers/summarizeWorker.js';
import keepalive from './src/utils/keepalive.js';
import connectDB from './src/utils/db.js';

// Connect to MongoDB
connectDB();

keepalive();
