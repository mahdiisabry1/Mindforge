# MindForge

**MindForge** is a web-based learning platform built with Next.js. Users can sign in with Clerk, land on a marketing homepage, and access a learning area at `/learn`. The project is set up for MongoDB persistence and Docker-based deployment via GitHub Actions.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Routes & Pages](#routes--pages)
- [Authentication](#authentication)
- [Database](#database)
- [UI & Styling](#ui--styling)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Security](#security)
- [Current Status & Roadmap Notes](#current-status--roadmap-notes)

---

## Overview

MindForge aims to help users **learn, practice, and empower their learning** through a modern web app. The codebase is organized with Next.js App Router **route groups** for a public landing experience and a separate main app shell for authenticated learning content.

| Area | Status |
|------|--------|
| Landing page (`/`) | Implemented |
| Learn page (`/learn`) | Placeholder UI (resource cards) |
| Clerk authentication | Integrated |
| MongoDB client (`lib/mongodb.ts`) | Ready; not yet used by pages/API |
| API routes | None yet |
| Prisma | Not in use (legacy paths may appear in `.gitignore`) |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript 5.8 |
| UI | React 19 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) (New York style) |
| Icons | [Lucide React](https://lucide.dev) |
| Auth | [Clerk](https://clerk.com) (`@clerk/nextjs`) |
| Database driver | [MongoDB Node.js driver](https://www.mongodb.com/docs/drivers/node/current/) |
| Forms (deps) | `react-hook-form`, `@hookform/resolvers` (available, not wired in UI yet) |
| Other deps | `bcrypt`, `ws` (present in `package.json`, not used in app code yet) |
| Linting | ESLint 9 + `eslint-config-next` |
| Container | Docker (Node 22 Alpine) |
| CI/CD | GitHub Actions → Docker Hub → self-hosted deploy |

---

## Project Structure

```
Mindforge/
├── app/
│   ├── layout.tsx              # Root layout: ClerkProvider, Nunito font, metadata
│   ├── globals.css             # Tailwind v4 + theme CSS variables
│   ├── (landing)/              # Public marketing shell → route "/"
│   │   ├── layout.tsx          # Header, footer, background image
│   │   ├── page.tsx            # Home: hero, sign-up / continue learning
│   │   ├── header.tsx          # Nav (FAQ, About, Contact), Admin, UserButton
│   │   └── footer.tsx
│   └── (main)/                 # App shell for authenticated areas
│       ├── layout.tsx          # Minimal centered layout
│       └── learn/
│           └── page.tsx        # Learn dashboard (placeholder cards)
├── components/
│   └── ui/
│       ├── button.tsx          # shadcn Button (CVA variants)
│       └── label.tsx           # shadcn Label
├── lib/
│   ├── mongodb.ts              # MongoClient singleton + getDb()
│   └── utils.ts                # cn() — clsx + tailwind-merge
├── public/
│   ├── background.jpg          # Landing background (low opacity)
│   ├── pngegg.png              # Landing hero image
│   ├── landingtemp.png
│   └── *.svg                   # Default Next.js static assets
├── middleware.ts               # Clerk middleware (protects matching routes)
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json               # Path alias: @/* → project root
├── components.json             # shadcn/ui configuration
├── Dockerfile
├── .github/workflows/cicd.yml
├── SECURITY.md
└── package.json
```

**Not present (yet):** `app/api/`, `hooks/`, Prisma schema, tests, or dedicated admin routes—the Admin button in the header is UI-only.

---

## Routes & Pages

| Path | Route group | Description |
|------|-------------|-------------|
| `/` | `(landing)` | Welcome page with hero image, Clerk sign-up modal (“Get Started”), or link to `/learn` when signed in. Notes that account creation may be disabled for security. |
| `/learn` | `(main)` | Learning hub with placeholder resource cards in a responsive grid. |

Route groups `(landing)` and `(main)` do **not** appear in URLs; they only organize layouts and files.

---

## Authentication

- **Provider:** Clerk, wrapped in `ClerkProvider` in `app/layout.tsx`.
- **Middleware:** `middleware.ts` uses `clerkMiddleware()` from `@clerk/nextjs/server` with the default matcher (app routes + API paths, excluding static assets).
- **Landing behavior:**
  - **Signed out:** “Get Started” opens Clerk `SignUpButton` (modal).
  - **Signed in:** “Continue Learning” links to `/learn` (opens in new tab).
- **Header:** Shows `UserButton` when signed in; “Admin” button is not connected to a route yet.

Configure Clerk in the [Clerk Dashboard](https://dashboard.clerk.com) and set the keys listed under [Environment Variables](#environment-variables).

---

## Database

`lib/mongodb.ts` provides:

- A **singleton** `MongoClient` connection (reused in development via `global._mongoClientPromise`).
- **`getDb(dbName?)`** — returns a `Db` instance; default database name is `mindforge` or `MONGODB_DB_NAME`.

**Note:** No pages or API handlers import `getDb` yet. The connection module expects `MONGODB_URL` at runtime (the error message in code references `MONGODB_URI`—use `MONGODB_URL` to match CI and typical naming).

---

## UI & Styling

- **Font:** Google [Nunito](https://fonts.google.com/specimen/Nunito) via `next/font/google`.
- **Design system:** shadcn/ui with `components.json` (style: `new-york`, base color: `slate`, CSS variables in `app/globals.css`).
- **Utilities:** `cn()` in `lib/utils.ts` for conditional class names.
- **Landing layout:** Full-height flex column, `background.jpg` as a faint full-bleed overlay, responsive hero (`pngegg.png`).

Add more shadcn components with the CLI (see [shadcn docs](https://ui.shadcn.com/docs/installation/next)) using the existing `components.json` aliases.

---

## Environment Variables

Create `.env.local` for local development (never commit secrets; `.env*` is gitignored).

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key (client) |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key (server) |
| `MONGODB_URL` | Yes (if using DB) | MongoDB connection string |
| `MONGODB_DB_NAME` | No | Database name (default: `mindforge`) |
| `SITE_URL` | Deploy / CI | Site URL (used in CI workflow) |

CI writes these into `.env` during the build job from GitHub Actions secrets.

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (Docker image uses Node 22)
- **npm** (lockfile: `package-lock.json`)
- Clerk application keys
- MongoDB instance (optional until you use `getDb`)

### Install and run

```bash
git clone <repository-url>
cd Mindforge
npm install
```

Add `.env.local` with the variables above, then:

```bash
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
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint (`next lint`) |

---

## Docker

The `Dockerfile` uses a multi-stage-style flow on **Node 22 Alpine**:

1. Copy `package*.json` and run `npm install --production`
2. Copy source and `npm run build`
3. Expose port **3000**
4. CMD: `npm run start`

Build and run locally:

```bash
docker build -t mindforge .
docker run -p 3000:3000 --env-file .env.local mindforge
```

Ensure build-time/runtime env vars (Clerk, MongoDB) are available to the container as needed.

---

## CI/CD

Workflow: `.github/workflows/cicd.yml`  
**Trigger:** push to branch `Production`

### Job: `build` (ubuntu-latest)

1. Checkout code
2. Append secrets to `.env`: Clerk keys, `MONGODB_URL`, `SITE_URL`
3. `docker build -t mahdisabry/mindforge .`
4. Login to Docker Hub
5. `docker push mahdisabry/mindforge:latest`

### Job: `deploy` (self-hosted, depends on `build`)

1. `docker pull mahdisabry/mindforge:latest`
2. `docker rm -f mindforge-container`
3. `docker run -d -p 3000:3000 --name mindforge-container mahdisabry/mindforge`

**Required GitHub secrets:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `MONGODB_URL`, `SITE_URL`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`

---

## Security

- See [SECURITY.md](./SECURITY.md) for supported versions and vulnerability reporting.
- The landing page states that **account creation may be disabled** for security; control this in the Clerk Dashboard.
- Keep `.env.local` and production secrets out of version control.

---

## Current Status & Roadmap Notes

The repository is an **active foundation** rather than a finished product:

- **Implemented:** Landing experience, Clerk auth flow, learn page shell, MongoDB helper, Docker + CI/CD pipeline.
- **Placeholder / planned:** Real learning content, API routes, admin area, FAQ/About/Contact pages, use of `bcrypt`/`ws`/forms, and MongoDB-backed features.
- **Removed / outdated:** The previous README referenced Prisma (`prisma generate`, `db push`, `studio`); there is **no Prisma setup** in the current tree—use MongoDB via `lib/mongodb.ts` instead.

Contributions should follow existing patterns: App Router route groups, `@/` imports, shadcn components, and Clerk for auth.

---

## License

Private project (`"private": true` in `package.json`). Add a license file if you intend to open-source or share the repository.
