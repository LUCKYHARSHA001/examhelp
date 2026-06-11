// src/middleware/rateLimiter.js
// Configures API rate limiting middleware using `express-rate-limit`.
// Specifically rate-limits authentication endpoints to prevent abuse or brute force attempts.
import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.', code: 'RATE_LIMITED' },
});
