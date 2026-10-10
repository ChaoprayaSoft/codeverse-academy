# 🚀 CodeVerse Academy — Application Architecture & Next.js Documentation

> **Platform:** CodeVerse Academy (Interactive Space-Themed STEM & Coding Learning Environment)  
> **Repository:** `ChaoprayaSoft/codeverse-academy`  
> **Framework:** Next.js (App Router, Turbopack, TypeScript, Tailwind CSS)  
> **Backend:** Next.js Route Handlers (`/api/codeverse`), Firebase Firestore, Google OAuth 2.0.

---

## 📑 Table of Contents
1. [Overview & New Architecture](#-overview--new-architecture)
2. [Project Structure](#-project-structure)
3. [9 Interactive Learning Tracks](#-9-interactive-learning-tracks)
4. [Gamification & Progression Engine](#-gamification--progression-engine)
5. [Authentication & Role Management](#-authentication--role-management)
6. [API Route Specifications](#-api-route-specifications)
7. [Running & Deployment](#-running--deployment)
8. [Legacy Backup](#-legacy-backup)

---

## 🌟 Overview & New Architecture

CodeVerse Academy is re-engineered as a modern, high-performance **Next.js App Router** application with:
- **TypeScript:** Full type safety across cadet profiles, progress states, and mission telemetry.
- **Tailwind CSS + Glassmorphism:** Curated cyberpunk space theme with glowing accents, frosted glass panels, and cosmic nebulae.
- **Serverless API Route:** Native App Router API (`app/api/codeverse/route.ts`) replacing external standalone scripts.
- **Context Store:** Global `AuthProgressContext` managing instant local caching and background Firestore sync.

```
+-------------------------------------------------------------------------------+
|                        CODEVERSE ACADEMY (NEXT.JS)                            |
+-------------------------------------------------------------------------------+
|  /                      -> Landing Page, Hero Mascot, 9 Tracks, Sandbox       |
|  /dashboard             -> Cadet Profile, XP Rank, Badges, Mission Briefings  |
|  /admin                 -> Command Center, Cadet Telemetry Table, CSV Export  |
|  /missions/[courseId]   -> Dynamic Interactive Mission Runner for 9 Courses   |
|  /api/codeverse         -> OAuth2 Token Verifier & Firestore Backend Service  |
+-------------------------------------------------------------------------------+
```

---

## 📁 Project Structure

```
CodeVerse/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with SpaceBackground & Navbar
│   │   ├── globals.css               # Tailwind CSS & Cyberpunk Space Design System
│   │   ├── page.tsx                  # Home Landing Page
│   │   ├── dashboard/page.tsx        # Cadet Dashboard & Progression Tracker
│   │   ├── admin/page.tsx            # Admin Command Center & User Management
│   │   ├── missions/
│   │   │   └── [courseId]/page.tsx   # Static Pre-rendered Mission Runners
│   │   └── api/
│   │       └── codeverse/route.ts    # Unified API Route Handler
│   │
│   ├── components/
│   │   ├── Navbar.tsx                # Responsive navigation & Auth state pill
│   │   ├── SpaceBackground.tsx       # Animated starfield & nebula overlays
│   │   ├── XPProgressBar.tsx         # Military Cadet Rank & XP Bar
│   │   ├── RoleModal.tsx             # New user onboarding modal (Teacher/Student/Guest)
│   │   ├── EditProfileModal.tsx      # Avatar & Callsign customizer
│   │   ├── GoogleAuthModal.tsx       # Google Identity Services modal
│   │   └── missions/
│   │       └── MissionRunnerClient.tsx # Interactive 5x5 Grid & Code Runner
│   │
│   ├── context/
│   │   └── AuthProgressContext.tsx   # Global progression & auth store
│   ├── lib/
│   │   ├── constants.ts              # Course metadata, XP rewards, avatars, ranks
│   │   └── firebase.ts               # Firebase Firestore initialization
│   └── types/
│       └── index.ts                  # TypeScript interfaces
│
├── public/
│   └── assets/                       # Mascot and graphic assets
├── legacy/                           # Full backup of the previous vanilla HTML/CSS/JS files
├── package.json                      # Dependencies & Scripts
├── tsconfig.json                     # TypeScript configuration
└── next.config.ts                    # Next.js configuration
```

---

## 🎮 9 Interactive Learning Tracks

| Track ID | Track Title | Target Age | Levels | Level XP | Course Bonus |
|:---|:---|:---:|:---:|:---:|:---:|
| `explorer` | Explorer Academy | Ages 5-8 | 5 | +20 XP | +250 XP |
| `navigator` | Navigator Terminal | Ages 9-12 | 6 | +25 XP | +500 XP |
| `commander` | Commander IDE | Ages 13-15 | 5 | +30 XP | +400 XP |
| `architect` | Architect Systems | Ages 15+ | 12 | +40 XP | +500 XP |
| `data_analytic` | Data Analytics | Ages 15+ | 10 | +20 XP | +300 XP |
| `ai_ml` | AI & Machine Learning | Ages 15+ | 20 | +15 XP | +500 XP |
| `vision` | Computer Vision | Ages 15+ | 15 | +50 XP | +250 XP |
| `prompt_eng` | Prompt Engineering | Ages 15+ | 10 | +30 XP | +500 XP |
| `robotics` | Fundamental of Robot | Ages 15+ | 20 | +50 XP | +500 XP |

---

## ⚡ Running & Development

### 1. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
npm run start
```

---

## 💾 Legacy Backup
All previous Vanilla HTML/CSS/JS files have been safely preserved in the [`legacy/`](file:///i:/WebApp/CodeVerse/legacy) folder for reference.
