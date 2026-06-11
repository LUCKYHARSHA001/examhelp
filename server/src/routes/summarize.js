// src/routes/summarize.js
// Express router defining PDF upload and live result streaming endpoints.
// Exposes `/api/summarize` to receive PDF files, verify limits, parse text, and queue the job,
// and `/api/summary/:summaryId/stream` to stream generated content chunks to the client via Server-Sent Events (SSE).
import express from 'express';
import fs from 'fs';
import verifyJWT from '../middleware/verifyJWT.js';
import upload from '../middleware/upload.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { enqueueSummarizeJob } from '../queues/summarizeQueue.js';
import { createIsolatedRedisClient } from '../utils/redis.js';
import User from '../models/User.js';
import Summary from '../models/Summary.js';

const router = express.Router();

const DAILY_LIMIT = 10;
const SSE_IDLE_TIMEOUT_MS = Number(process.env.SSE_IDLE_TIMEOUT_MS || 20 * 60 * 1000);
const SSE_HEARTBEAT_MS = 15000;

// POST /api/summarize — upload + enqueue
router.post('/summarize', verifyJWT, upload.single('pdf'), async (req, res) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'PDF file is required', code: 'NO_FILE' });
  }

  const { examTime, summaryType, focusTopic } = req.body;

  if (!examTime || !summaryType) {
    fs.unlinkSync(file.path);
    return res.status(400).json({ error: 'examTime and summaryType are required', code: 'MISSING_FIELDS' });
  }

  try {
    // Check daily rate limit
    const user = await User.findById(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dailyCount = user.dailyRequestCount;
    const lastDate = user.lastRequestDate;

    if (!lastDate || new Date(lastDate) < today) {
      dailyCount = 0;
    }

    if (dailyCount >= DAILY_LIMIT) {
      fs.unlinkSync(file.path);
      return res.status(429).json({
        error: 'Daily limit reached. Resets at midnight.',
        code: 'DAILY_LIMIT_REACHED',
      });
    }

    // Extract text from PDF (synchronous, fast)
    const { text: extractedText, truncated } = await extractTextFromPDF(file.path);

    if (!extractedText.trim()) {
      fs.unlinkSync(file.path);
      return res.status(422).json({ error: 'Could not extract text from PDF', code: 'EMPTY_PDF' });
    }

    // Create Summary record
    const summary = await Summary.create({
      userId,
      fileName: file.originalname,
      examTime,
      summaryType,
      focusTopic: focusTopic || null,
      status: 'PENDING',
    });

    // Update user daily count
    await User.findByIdAndUpdate(userId, {
      dailyRequestCount: dailyCount + 1,
      lastRequestDate: new Date(),
    });

    // Enqueue job
    await enqueueSummarizeJob({
      summaryId: summary.id,
      extractedText,
      examTime,
      summaryType,
      focusTopic: focusTopic || null,
      userId,
    });

    // Delete temp file
    fs.unlinkSync(file.path);

    res.status(202).json({
      summaryId: summary.id,
      truncated,
      message: 'Summary queued successfully',
    });
  } catch (err) {
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    console.error('[Summarize]', err);
    res.status(500).json({ error: 'Failed to process request', code: 'SERVER_ERROR' });
  }
});


export default router;
