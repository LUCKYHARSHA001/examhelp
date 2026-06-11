// src/models/User.js
// Defines the Mongoose schema and model for Users.
// Stores credentials, Google OAuth profile details, and daily request rate limiting count.

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  avatarUrl: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
  dailyRequestCount: {
    type: Number,
    default: 0,
  },
  lastRequestDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Configure schemas to convert virtual 'id' from '_id' automatically in JSON responses
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;
