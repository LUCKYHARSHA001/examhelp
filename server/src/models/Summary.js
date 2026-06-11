// src/models/Summary.js
// Defines the Mongoose schema and model for Summaries.
// Stores the uploaded PDF filename, study configuration details, and the generated summary output text.

import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  examTime: {
    type: String,
    required: true,
  },
  summaryType: {
    type: String,
    required: true,
  },
  focusTopic: {
    type: String,
  },
  summaryText: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'DONE', 'FAILED'],
    default: 'PENDING',
  },
  errorMsg: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

summarySchema.set('toJSON', { virtuals: true });
summarySchema.set('toObject', { virtuals: true });

const Summary = mongoose.model('Summary', summarySchema);
export default Summary;
