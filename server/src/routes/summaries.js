// src/routes/summaries.js
// Express router defining CRUD operations for generated PDF summaries.
// Exposes endpoints to retrieve a list of all user summaries, fetch a single detailed summary, and delete a summary.
import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import Summary from '../models/Summary.js';

const router = express.Router();

// GET /api/summaries — all user summaries
router.get('/summaries', verifyJWT, async (req, res) => {
  try {
    const rawSummaries = await Summary.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('fileName examTime summaryType focusTopic status createdAt')
      .lean();
    
    const summaries = rawSummaries.map(s => ({
      ...s,
      id: s._id.toString()
    }));
    
    res.json(summaries);
  } catch (err) {
    console.error('[Summaries GET]', err);
    res.status(500).json({ error: 'Failed to fetch summaries', code: 'SERVER_ERROR' });
  }
});

// GET /api/summary/:id — single summary
router.get('/summary/:id', verifyJWT, async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);

    if (!summary) {
      return res.status(404).json({ error: 'Summary not found', code: 'NOT_FOUND' });
    }

    if (summary.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden', code: 'FORBIDDEN' });
    }

    res.json(summary);
  } catch (err) {
    console.error('[Summary GET]', err);
    res.status(500).json({ error: 'Failed to fetch summary', code: 'SERVER_ERROR' });
  }
});

// DELETE /api/summary/:id
router.delete('/summary/:id', verifyJWT, async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);

    if (!summary) {
      return res.status(404).json({ error: 'Summary not found', code: 'NOT_FOUND' });
    }

    if (summary.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden', code: 'FORBIDDEN' });
    }

    await Summary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Summary deleted' });
  } catch (err) {
    console.error('[Summary DELETE]', err);
    res.status(500).json({ error: 'Failed to delete summary', code: 'SERVER_ERROR' });
  }
});

export default router;
