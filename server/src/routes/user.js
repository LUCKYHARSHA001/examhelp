// src/routes/user.js
// Express router defining endpoints related to user profile and limit metadata.
// Exposes `/api/user/me` which returns the currently logged-in user's details and active daily request status limits.
import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import User from '../models/User.js';

const router = express.Router();
const DAILY_LIMIT = 10;

// GET /api/user/me
router.get('/me', verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('email name avatarUrl createdAt dailyRequestCount lastRequestDate')
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found', code: 'NOT_FOUND' });
    }

    // Reset count if last request wasn't today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDate = user.lastRequestDate ? new Date(user.lastRequestDate) : null;
    const dailyCount = !lastDate || lastDate < today ? 0 : user.dailyRequestCount;

    res.json({
      ...user,
      dailyRequestCount: dailyCount,
      dailyLimit: DAILY_LIMIT,
    });
  } catch (err) {
    console.error('[User GET]', err);
    res.status(500).json({ error: 'Failed to fetch user', code: 'SERVER_ERROR' });
  }
});

export default router;
