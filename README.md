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

---

## Project Structure

```
studysnap/
├── client/                   # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js      # Axios + JWT interceptor
│   │   ├── components/
│   │   │   └── Layout.jsx            # Nav + page shell
│   │   ├── hooks/
│   │   │   ├── useAuth.jsx           # Auth context + state
│   │   │   ├── useSSEStream.js       # SSE + polling fallback hook
│   │   │   └── useTheme.js           # Light/dark mode persistence
│   │   └── pages/
│   │       ├── LandingPage.jsx
│   │       ├── AuthCallback.jsx
│   │       ├── Dashboard.jsx
│   │       ├── NewSummary.jsx        # Multi-step upload + stream
│   │       ├── SummaryDetail.jsx
│   │       └── Profile.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                   # Express backend
    ├── src/
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Summary.js
    │   │   └── RefreshToken.js
    │   ├── index.js                  # Express app entry
    │   ├── middleware/
    │   │   ├── verifyJWT.js
    │   │   ├── rateLimiter.js
    │   │   └── upload.js             # Multer PDF config
    │   ├── routes/
    │   │   ├── auth.js               # OAuth + JWT endpoints
    │   │   ├── summarize.js          # Upload + SSE stream
    │   │   ├── summaries.js          # CRUD
    │   │   └── user.js               # Profile + usage
    │   ├── services/
    │   │   ├── passportStrategy.js   # Google OAuth strategy
    │   │   ├── GeminiService.js
    │   │   └── pdfService.js
    │   ├── queues/
    │   │   └── summarizeQueue.js     # BullMQ queue
    │   ├── workers/
    │   │   └── summarizeWorker.js    # BullMQ worker process
    │   └── utils/
    │       ├── db.js
    │       ├── redis.js
    │       ├── jwt.js
    │       └── promptBuilder.js
    └── .env.example
```

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB database (local or Atlas)
- Redis (or Upstash)
- Google Cloud OAuth credentials
- Gemini API key

### 1. Clone & install dependencies

```bash
# Install server deps
cd server
npm install

# Install client deps
cd ../client
npm install
```

### 2. Configure environment variables

```bash
# Server
cp server/.env.example server/.env
# Fill in all values in server/.env

# Client
cp client/.env.example client/.env
# Set VITE_API_URL=http://localhost:5000
```

### 3. Set up the database

MongoDB does not require database schema migrations. Simply make sure your local MongoDB instance is running or provide a valid connection string (`MONGODB_URI`) in your `.env`.

### 4. Run all three processes (in separate terminals)

```bash
# Terminal 1 — Backend API
cd server && npm run dev

# Terminal 2 — BullMQ Worker
cd server && node worker.js

# Terminal 3 — Frontend
cd client && npm run dev
```

The app will be at http://localhost:5173.

---

