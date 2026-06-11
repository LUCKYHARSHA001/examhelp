// src/queues/summarizeQueue.js
// Configures and initializes the BullMQ queue for PDF summarization.
// Defines default job parameters (like single attempts, automatic cleanup on completion, and fail-deletion) and enqueues jobs to Redis.
import { Queue } from 'bullmq';
import { getRedisClient } from '../utils/redis.js';

const connection = getRedisClient();

export const summarizeQueue = new Queue('summarize', {
  connection,
  defaultJobOptions: {
    // Do not auto-retry failed jobs; user can explicitly create a fresh summary.
    attempts: 1,
    removeOnComplete: { count: 100 },
    // Remove failed jobs immediately so stale/old failed jobs don't linger.
    removeOnFail: true,
  },
});

export const enqueueSummarizeJob = async (payload) => {
  const job = await summarizeQueue.add('summarize-pdf', payload, {
    jobId: payload.summaryId,
  });
  return job;
};
