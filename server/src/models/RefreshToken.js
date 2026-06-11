// src/models/RefreshToken.js
// Defines the Mongoose schema and model for Refresh Tokens.
// Stores cryptographically hashed refresh tokens linked to a user to manage authenticated sessions.

import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
});

refreshTokenSchema.set('toJSON', { virtuals: true });
refreshTokenSchema.set('toObject', { virtuals: true });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;
