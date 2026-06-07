# Intervue.ai — AI Interview Simulator

> Practice job interviews with a live AI avatar, get scored instantly, and track your progress over time.

---

## What it does

Intervue.ai puts you in a realistic video interview with an AI interviewer (Jordan) powered by a HeyGen live avatar. After each session it scores your answers, saves your results to Firestore, and shows your progress on a dashboard. A separate Python ML service provides AI-enhanced CV analysis, salary prediction, and deeper answer scoring.

---

## Working Features

| Feature | Status |
|---|---|
| Firebase auth (email + Google) | ✅ Working |
| Sign-in / Sign-up pages | ✅ Working |
| Auth guard on dashboard | ✅ Working |
| Sidebar with user profile | ✅ Working |
| Job Tracker (Firestore CRUD) | ✅ Working |
| Job Tracker — AI salary prediction | ✅ Working (ML service) |
| CV Reviewer (keyword + ATS analysis) | ✅ Working |
| CV Reviewer — AI semantic scoring | ✅ Working (ML service) |
| CV Builder (Firestore save/load) | ✅ Working |
| Cover Letter Generator | ✅ Working |
| Whiteboard diagrams (40+ concepts) | ✅ Working |
| Interview Room (HeyGen LiveAvatar) | ✅ Working |
| Interview setup modal | ✅ Working |
| STAR results panel + PDF export | ✅ Working |
| Interview sessions save to Firestore | ✅ Fixed |
| Score saved back to Firestore after results | ✅ Fixed |
| HistoryPanel — reads from Firestore | ✅ Working |
| StatsOverview — reads from Firestore | ✅ Working |
| ML Service — ATS score endpoint | ✅ Working |
| ML Service — Salary prediction endpoint | ✅ Working |
| ML Service — Answer quality scorer | ✅ Working |

---

## Features

### Interview Room
- Live video interview with HeyGen AI avatar (Jordan)
- Real-time voice transcription and captions
- Auto-generated technical diagrams on the whiteboard panel when you ask technical questions
- Session timer, mute/camera controls, fullscreen mode
- Scores saved to Firestore automatically when session ends

### Dashboard & Stats
- Overall score, average score, hours practised, daily streak
- Score progression chart across last 8 sessions
- Recent sessions list with per-session scores and duration
- First-time onboarding state with quick-start interview types

### CV Reviewer
- Instant client-side ATS scoring (no API needed, works offline)
- AI-enhanced mode when ML service is running — uses sentence-transformers semantic similarity
- Section-by-section breakdown: Work Experience, Skills, Summary, Education, Formatting
- Matched and missing keywords from the job description
- Multi-domain skills bank covering Software, Finance, Marketing, Design, Data, Healthcare, Legal, HR

### Job Tracker
- Kanban board: Wishlist → Applied → Screening → Interview → Offer → Rejected
- **AI salary prediction** — click ✨ Predict next to the salary field to get a range based on role, level, and location
- Firestore-backed: all applications persist and sync across devices

### Interview History
- Full history of all sessions with filters
- Stats: best score, average score, total practice time

### CV Builder
- Multi-template CV editor saved to Firestore

### Cover Letter Generator
- GPT-4o powered, tailored to role, company, and job description

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.7 | App Router, API routes |
| React | 19.2.4 | UI components |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Lucide React | latest | Icons |

### Backend & APIs
| Service | Purpose |
|---|---|
| Firebase Auth | Email/password + Google OAuth |
| Firestore | User data, interviews, CVs, job applications |
| Firebase Storage | File uploads |
| OpenAI GPT-4o | Cover letter, whiteboard SVG diagrams |
| OpenAI GPT-4o-mini | Interview question streaming |
| OpenAI TTS | Text-to-speech |
| HeyGen LiveAvatar | Real-time AI video avatar |

### ML Service (Python)
| Library | Version | Purpose |
|---|---|---|
| FastAPI | 0.115.5 | REST API server |
| sentence-transformers | 3.3.1 | Semantic similarity, answer scoring |
| scikit-learn | 1.5.2 | Salary prediction model |
| joblib | 1.4.2 | Model serialisation |
| uvicorn | 0.32.1 | ASGI server |

---

## Project Structure

```
ai-interview-simulator/
├── app/
│   ├── (auth)/              # Sign-in, sign-up pages
│   ├── (root)/              # Landing page
│   ├── dashboard/           # Main dashboard page
│   └── api/
│       ├── chat/            # GPT-4o-mini interview streaming
│       ├── session/         # HeyGen LiveAvatar token
│       ├── tts/             # OpenAI text-to-speech
│       ├── whiteboard/      # GPT-4o SVG diagram generation
│       └── ml/
│           ├── ats/         # Proxy → Python /ats-score
│           ├── salary/      # Proxy → Python /salary-predict
│           └── answer-score/# Proxy → Python /answer-score
├── components/
│   ├── interview/
│   │   ├── InterviewRoom.tsx     # Live avatar session + whiteboard
│   │   └── InterviewResults.tsx  # Post-session scoring + STAR analysis
│   ├── dashboard/
│   │   └── StatsOverview.tsx     # Charts, stats, recent sessions
│   ├── cv/
│   │   ├── CVReviewer.tsx        # ATS analysis (client + ML enhanced)
│   │   └── CVBuilder.tsx         # CV editor with templates
│   ├── job-tracker/
│   │   └── JobTracker.tsx        # Kanban board + salary prediction
│   ├── history/
│   │   └── HistoryPanel.tsx      # Interview history table
│   ├── cover-letter/
│   │   └── CoverLetterGenerator.tsx
│   └── premium/
│       ├── PricingPage.tsx
│       └── UpgradeModal.tsx
├── contexts/
│   ├── AuthContext.tsx       # Firebase Auth + user profile
│   └── PremiumContext.tsx    # Plan gating (free/starter/pro)
├── lib/
│   ├── firebase.ts           # Firebase initialisation
│   ├── firestore.ts          # Typed Firestore CRUD + subscriptions
│   ├── diagrams.ts           # Pre-built SVG whiteboard templates
│   └── sectorPacks.ts        # African sector interview packs
└── ml-service/
    ├── main.py               # FastAPI server (3 ML endpoints)
    ├── train_salary.py       # Salary model training script
    ├── requirements.txt
    ├── start.bat             # Windows one-click setup + launch
    └── models/               # Saved models (git-ignored)
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables — create `.env.local`
```env
OPENAI_API_KEY=sk-...
LIVEAVATAR_API_KEY=...
LIVEAVATAR_AVATAR_ID=...
LIVEAVATAR_VOICE_ID=...
LIVEAVATAR_JORDAN_CONTEXT_ID=...
LIVEAVATAR_ALEX_CONTEXT_ID=...
PYTHON_API_URL=http://localhost:8000
```

### 3. Start Next.js
```bash
npm run dev
# → http://localhost:3000
```

### 4. Start ML service (optional)
```bash
cd ml-service
start.bat
# Installs deps, trains salary model, starts FastAPI on :8000
```

The app works without the ML service — CV Reviewer falls back to client-side scoring automatically.

---

## ML Service Endpoints

| Endpoint | Method | Input | Output |
|---|---|---|---|
| `/ats-score` | POST | `cv_text`, `job_description` | ATS score, section breakdown, matched/missing keywords |
| `/salary-predict` | POST | `role`, `level`, `location` | Min / median / max salary range |
| `/answer-score` | POST | `answer`, `interview_type` | Quality score, STAR breakdown, feedback |
| `/health` | GET | — | Model load status |

---

## Firestore Schema

All collections under `/users/{uid}/`:

| Collection | Key fields |
|---|---|
| `interviews` | title, field, type, level, score, duration, status, createdAt |
| `jobApplications` | company, role, location, salary, status, priority, appliedDate |
| `cvs` | name, templateId, personalInfo, experience[], education[], skills[] |
| `coverLetters` | jobTitle, company, content, createdAt |

---

## Licence

MIT
