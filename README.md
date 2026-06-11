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

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID and Secret to `server/.env`

---

## Authentication Modes

StudySnap now supports two sign-in flows:

- **Google OAuth**: one-click sign in with Google.
- **Email/Password (manual auth)**: create an account and sign in with credentials.

Behavior details:

- If an email already exists as a Google-only account, manual signup/login returns guidance to continue with Google.
- If a user signs up manually first, later Google sign-in with the same email links that Google account to the same user.
- Auth responses include a short-lived access token and set a secure HTTP-only refresh-token cookie.

---

## Gemini API

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to `server/.env` as `GEMINI_API_KEY`

The app uses `gemini-2.5-flash` for fast, low-latency streaming summaries.
If your host has stream parsing issues, set `GEMINI_DISABLE_STREAM=true` in `server/.env` to force non-stream generation.

---

## Deployment

### Frontend → Vercel
```bash
cd client
vercel deploy
# Set VITE_API_URL to your Render backend URL
```

### Backend → Render
- Create a new Web Service pointing to `/server`
- Start command: `npm start`
- Add all env vars from `.env.example`

### Worker → Render
- Create a separate Background Worker service
- Root directory: `/server`
- Start command: `npm run worker`

### Database → MongoDB Atlas
- Create a cluster and grab the `MONGODB_URI` connection string
- Add it to your environment variables in Render/production

### Redis → Upstash
- Create a Redis database
- Use the `REDIS_URL` from Upstash dashboard

---

## API Reference

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create account with name, email, and password |
| POST | `/api/auth/login` | Sign in with email/password |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | OAuth callback |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Revoke refresh token + clear cookie |

### Summaries
| Method | Path | Description |
|---|---|---|
| POST | `/api/summarize` | Upload PDF + enqueue job |
| GET | `/api/summary/:id/stream` | SSE stream of live output |
| GET | `/api/summaries` | All user summaries |
| GET | `/api/summary/:id` | Single summary |
| DELETE | `/api/summary/:id` | Delete summary |

### User
| Method | Path | Description |
|---|---|---|
| GET | `/api/user/me` | Current user + daily usage |

---

