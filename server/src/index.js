// src/index.js
import 'dotenv/config';
import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 StudySnap server running on port ${PORT}`);
});
export default app;
