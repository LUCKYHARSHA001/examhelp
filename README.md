# StudySnap 📚⚡

[![Live Demo](https://img.shields.io/badge/Live%20Demo-studysnap--sage.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://studysnap-sage.vercel.app/)

An AI-powered PDF study summarizer for students. Upload any PDF, tell it when your exam is, and get a tailored summary streamed in real time with resilient fallback if live events are missed.

---

## Demo Video 

### Video
<video src="https://github.com/user-attachments/assets/9e6ef8c2-74f1-4a4f-8e41-e06c7660cc4f"></video>

## Screenshots

### Landing Page
![Landing Page](./assets/screenshot-landing.png)

### Dashboard
![Dashboard](./assets/screenshot-dashboard.png)

### Step 1 — Upload your PDF
![Upload PDF](./assets/screenshot-upload.png)

### Step 2 — Configure your summary
![Configure Summary](./assets/screenshot-configure-1.png)
![Configure Summary - Scrolled](./assets/screenshot-configure-2.png)

### Step 3 — Generating summary (live stream)
![Generating Summary](./assets/screenshot-generating.png)

### Step 3 — Summary output
![Summary Output](./assets/screenshot-summary.png)

### Profile & Usage
![Profile](./assets/screenshot-profile.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS + react-markdown |
| Backend | Node.js + Express |
| Database | MongoDB via Mongoose |
| Cache/Queue | Redis + BullMQ |
| Auth | Google OAuth 2.0 + Email/Password + JWT (Passport.js + bcrypt) |
| PDF Parsing | pdf-parse |
| AI | Gemini API (`gemini-2.5-flash`) |
| File Upload | Multer |
| Streaming | Server-Sent Events (SSE) + client polling fallback |
| Hosting | Vercel + Render + MongoDB Atlas + Upstash |

