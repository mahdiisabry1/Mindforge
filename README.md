# MindForge

**MindForge** is a gamified coding learning platform built with Next.js. Users sign in with Clerk, pick a course, follow a lesson path, and earn XP and streaks as they complete challenges.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Routes & Pages](#routes--pages)
- [Authentication](#authentication)
- [Database](#database)
- [Server Actions](#server-actions)
- [UI & Styling](#ui--styling)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Security](#security)

---

## Overview

The app uses Next.js App Router **route groups**: a public landing experience at `/`, and an authenticated learning shell under `(main)` for the dashboard, courses, lessons, leaderboard, and profile.

| Area | Status |
|------|--------|
| Landing page (`/`) | Implemented |
| Home / lesson path (`/home`) | Implemented |
| Course selection (`/languages`) | Implemented |
| Lesson player (`/lesson/[id]`) | Implemented |
| Leaderboard (`/leaderboard`) | Placeholder |
| Profile (`/profile`) | Placeholder |
| Clerk authentication | Integrated |
| Neon + Drizzle persistence | Integrated |
| XP / streaks / lesson completion | Implemented via server actions |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js](https://nextjs.org) (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Auth | [Clerk](https://clerk.com) (`@clerk/nextjs`) |
| Database | [Neon](https://neon.tech) (PostgreSQL) via `@neondatabase/serverless` |
| ORM | [Drizzle ORM](https://orm.drizzle.team) + `drizzle-kit` |
| Linting | ESLint + `eslint-config-next` |
| Container | Docker (Node Alpine) |
| CI/CD | GitHub Actions → Docker Hub → self-hosted deploy |

---

## Project Structure

```
Mindforge/
├── app/
│   ├── layout.tsx                 # Root layout: ClerkProvider, fonts, metadata
│   ├── globals.css                # Tailwind v4 + theme CSS variables
│   ├── middleware.ts              # (app-level middleware file, if present)
│   ├── (landing)/                 # Public marketing shell → "/"
│   │   ├── layout.tsx             # Header, footer, background
│   │   ├── page.tsx               # Hero + Get Started / Continue Learning
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── (main)/                    # Authenticated learning shell
│       ├── layout.tsx             # Nav + getOrCreateUser gate
│       ├── home/page.tsx          # Active course + lesson path
│       ├── languages/page.tsx     # Course picker
│       ├── lesson/[id]/           # Lesson player (server + client)
│       ├── leaderboard/page.tsx   # Placeholder
│       └── profile/page.tsx       # Placeholder
├── actions/
│   └── user-progress.ts           # selectCourse, completeLesson, …
├── components/
│   ├── NavigationBar.tsx          # Main app nav (desktop)
│   ├── CourseCard.tsx
│   ├── LessonPath.tsx
│   ├── StatsBar.tsx
│   ├── StreakCard.tsx
│   └── ui/                        # shadcn primitives
├── db/
│   ├── index.ts                   # Drizzle client (Neon Pool)
│   ├── schema.ts                  # Tables, enums, relations
│   └── seed.ts                    # Content seed script
├── lib/
│   ├── user.ts                    # getOrCreateUser (Clerk → DB upsert)
│   ├── get-home-data.ts           # Home dashboard data loader
│   └── utils.ts                   # cn() helper
├── hooks/
│   └── use-mobile.ts
├── public/                        # Static assets (landing images, etc.)
├── middleware.ts                  # Clerk middleware (protects /home)
├── drizzle.config.ts              # Drizzle Kit → DATABASE_URL
├── Dockerfile
├── .github/workflows/cicd.yml
├── SECURITY.md
└── package.json
```

---

## Routes & Pages

| Path | Route group | Description |
|------|-------------|-------------|
| `/` | `(landing)` | Marketing hero; sign-up modal when signed out, link to `/home` when signed in |
| `/home` | `(main)` | Dashboard: streak/stats + interactive lesson path for the active course |
| `/languages` | `(main)` | Browse published courses and set the active course |
| `/lesson/[id]` | `(main)` | Lesson challenge player |
| `/leaderboard` | `(main)` | Placeholder ranks page |
| `/profile` | `(main)` | Placeholder profile page |

Route groups `(landing)` and `(main)` do **not** appear in URLs.

---

## Authentication

- **Provider:** Clerk via `ClerkProvider` in `app/layout.tsx`.
- **Middleware:** `middleware.ts` uses `clerkMiddleware()` and protects `/home(.*)`.
- **App shell:** `(main)/layout.tsx` calls `getOrCreateUser()` and redirects to `/sign-in` if there is no session.
- **Landing:**
  - Signed out → “Get Started” (`SignUpButton`, modal)
  - Signed in → “Continue Learning” → `/home`
- **Nav:** `UserButton` for account / sign-out.

Configure keys in the [Clerk Dashboard](https://dashboard.clerk.com).

---

## Database

Persistence is **PostgreSQL on Neon**, accessed with Drizzle.

- **Client:** `db/index.ts` — Neon serverless `Pool` + `drizzle(pool, { schema })`
- **Schema:** `db/schema.ts`
- **Config:** `drizzle.config.ts` reads `DATABASE_URL` from `.env.local`

### Content model

```
courses → units → lessons → challenges → challenge_options
```

Challenge types: `select`, `fill_blank`, `arrange_lines`, `match_pairs`, `write_code`.

### Progress & gamification

| Table | Role |
|-------|------|
| `users` | Clerk user id, XP, hearts, gems, streak caches, active course |
| `lesson_completions` | Per-user lesson completion + accuracy |
| `challenge_attempts` | Answer history |
| `xp_events` | Immutable XP ledger |
| `daily_activity` | Per-day XP / lessons (streak calendar) |
| `achievements` / `user_achievements` | Badges |
| `friendships` | Optional social (schema ready) |

Users are created lazily on first authenticated request via `lib/user.ts` (`getOrCreateUser`).

### Migrations & seed

```bash
# Push schema to Neon (Drizzle Kit)
npx drizzle-kit push

# Seed content (see db/seed.ts; ensure DATABASE_URL is set)
npx tsx db/seed.ts
```

---

## Server Actions

`actions/user-progress.ts` (server-only):

| Action | Purpose |
|--------|---------|
| `selectCourse(courseId)` | Set `users.activeCourseId`, revalidate, redirect to `/home` |
| `completeLesson(lessonId, accuracy)` | Record completion, XP event, daily activity, update streak/XP |

---

## UI & Styling

- **Design system:** shadcn/ui (`components.json`, CSS variables in `app/globals.css`)
- **App chrome:** `NavigationBar` — Dashboard, Languages, Ranks, Profile
- **Learning UI:** `LessonPath`, `CourseCard`, `StatsBar`, `StreakCard`
- **Utilities:** `cn()` in `lib/utils.ts`

---

## Environment Variables

Create `.env.local` (gitignored):

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `SITE_URL` | Deploy / CI | Public site URL |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Clerk application keys
- Neon (or other Postgres) database

### Install and run

```bash
git clone <repository-url>
cd Mindforge
npm install
```

Add `.env.local` with the variables above, push the schema, then:

```bash
npx drizzle-kit push
npx tsx db/seed.ts   # optional: sample course content
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build (local)

```bash
npm run build
npm run start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npx drizzle-kit push` | Sync schema to the database |
| `npx tsx db/seed.ts` | Seed courses / lessons / challenges |

---

## Docker

The `Dockerfile` builds and runs the app on Node Alpine, exposes port **3000**, and starts with `npm run start`.

```bash
docker build -t mindforge .
docker run -p 3000:3000 --env-file .env.local mindforge
```

Ensure Clerk and `DATABASE_URL` are available to the container at build/runtime as needed.

---

## CI/CD

Workflow: `.github/workflows/cicd.yml`  
**Trigger:** push to branch `Production`

1. **build** (ubuntu-latest): write env secrets, `docker build`, push to Docker Hub (`mahdisabry/mindforge:latest`)
2. **deploy** (self-hosted): pull image, replace `mindforge-container`, run on port 3000

**Typical GitHub secrets:** Clerk keys, `DATABASE_URL` (or legacy DB URL if still referenced in the workflow), `SITE_URL`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`

---

## Security

- See [SECURITY.md](./SECURITY.md) for reporting guidance.
- Account creation can be disabled in the Clerk Dashboard (noted on the landing page).
- Never commit `.env.local` or production secrets.

---

## License

Private project (`"private": true` in `package.json`).
