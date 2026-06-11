// src/routes/auth.js
// Express router defining authentication endpoints.
// Handles signup and login with email/password, routes to initiate Google OAuth and receive callbacks,
// token refreshing via HttpOnly refresh cookie validation, and session logout.
import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  createRefreshTokenRecord,
  revokeRefreshToken,
  validateRefreshToken,
} from '../utils/jwt.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import User from '../models/User.js';

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// POST /api/auth/signup — email/password signup
router.post('/signup', authRateLimiter, async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required', code: 'MISSING_FIELDS' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email', code: 'INVALID_EMAIL' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters', code: 'WEAK_PASSWORD' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    // If they already have a Google-only account, guide them to Google sign-in.
    if (!existing.passwordHash && existing.googleId) {
      return res.status(409).json({
        error: 'Account already exists with Google sign-in. Please sign in with Google.',
        code: 'ACCOUNT_EXISTS_OAUTH',
      });
    }
    return res.status(409).json({ error: 'Email already in use', code: 'EMAIL_IN_USE' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, passwordHash });

  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const rawRefreshToken = signRefreshToken({ id: user.id, email: user.email });
  await createRefreshTokenRecord(user.id, rawRefreshToken);
  res.cookie('refreshToken', rawRefreshToken, COOKIE_OPTIONS);

  return res.status(201).json({ accessToken });
});

// POST /api/auth/login — email/password login
router.post('/login', authRateLimiter, async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required', code: 'MISSING_FIELDS' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email', code: 'INVALID_EMAIL' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
  }
  if (!user.passwordHash) {
    return res.status(409).json({
      error: 'This account uses Google sign-in. Please sign in with Google.',
      code: 'ACCOUNT_OAUTH_ONLY',
    });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
  }

  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const rawRefreshToken = signRefreshToken({ id: user.id, email: user.email });
  await createRefreshTokenRecord(user.id, rawRefreshToken);
  res.cookie('refreshToken', rawRefreshToken, COOKIE_OPTIONS);

  return res.json({ accessToken });
});


export default router;
