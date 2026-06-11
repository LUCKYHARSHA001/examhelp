// src/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import authRoutes from './routes/auth.js';
import summarizeRoutes from './routes/summarize.js';
import summariesRoutes from './routes/summaries.js';
import userRoutes from './routes/user.js';
import './services/passportStrategy.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api', summarizeRoutes);
app.use('/api', summariesRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 StudySnap server running on port ${PORT}`);
});
export default app;
