# Turki Platform — Phase 1 Setup

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally
- npm 9+

---

## 1. Create the PostgreSQL database

```bash
createdb turki_platform
```

Or via psql:
```sql
CREATE DATABASE turki_platform;
```

---

## 2. Configure environment variables

The `.env` file is already created at `backend/.env` with development defaults.
These example values are for local development only and must not be reused in production.

Open it and confirm or update:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/turki_platform
SESSION_SECRET=replace-with-64-random-bytes
ADMIN_EMAIL=turki@turki.dev
ADMIN_PASSWORD=YourStrongPassword
```

Generate a proper session secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### AI provider configuration (Phase 4 — Job Intelligence)

The Job Intelligence module supports real AI analysis via Anthropic.

**Mock mode (default — no key needed):**

Leave `AI_API_KEY` blank in `backend/.env`. The module returns a clearly-marked placeholder analysis. Mock mode is safe and works in development without any external calls.

**Real provider mode:**

Add the following to `backend/.env`:

```
AI_PROVIDER=anthropic
AI_API_KEY=<your-anthropic-key>
AI_MODEL=claude-haiku-4-5-20251001
```

**Key safety rules — read before setting a key:**

- `backend/.env` is listed in `.gitignore` and must **never** be committed.
- Never paste your `AI_API_KEY` into chat, commit messages, code comments, or log output.
- Never share `AI_API_KEY` with the frontend — it lives only in `backend/.env`.
- Never store `AI_API_KEY` in the database.
- If you suspect a key has been exposed, rotate it immediately at console.anthropic.com.
- In production, set `AI_API_KEY` via your deployment environment's secret manager — not in a file.

**Verify your `.env` is not tracked:**

```bash
git ls-files backend/.env
# Should return nothing (empty output = not tracked)
```

---

## 3. Initialize the database schema + admin user

```bash
cd backend
npm run db:init
```

This will:
- Create all tables (users, security_events, contact_messages, session)
- Create all indexes
- Create the admin user from ADMIN_EMAIL + ADMIN_PASSWORD

**Run this only once.** It is idempotent — safe to re-run, but the admin user will already exist.

---

## 4. Start everything

Open 3 terminal tabs:

**Terminal 1 — Backend API:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 — Public Site:**
```bash
cd apps/public-site
npm run dev
# Runs on http://localhost:5173
```

**Terminal 3 — Admin Console:**
```bash
cd apps/admin-console
npm run dev
# Runs on http://localhost:5174
```

---

## 5. Access

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Public portfolio |
| http://localhost:5173/projects | Projects page |
| http://localhost:5173/cyber-labs | Cyber Labs page |
| http://localhost:5173/contact | Contact form |
| http://localhost:5174/security/login | Admin login |
| http://localhost:5174/security/dashboard | Dashboard (auth required) |
| http://localhost:5174/security/siem | SIEM Events (auth required) |
| http://localhost:3001/health | Backend health check |

**Admin login credentials** (local development only, from your `.env`):
- Email: `turki@turki.dev`
- Password: `AdminPass123!ChangeThis`

---

## 6. API Routes

### Public (no auth)
```
GET  /api/public/projects
GET  /api/public/cyber-labs
GET  /api/public/skills
POST /api/public/contact
POST /api/public/telemetry
GET  /api/public/cv-download
```

### Auth
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### SIEM (requires auth)
```
GET   /api/siem/events?page=1&limit=20&severity=high&status=open
GET   /api/siem/summary
PATCH /api/siem/events/:id/resolve
```

---

## 7. Architecture overview

```
turki-platform/
  backend/                  Node.js + Express API
    src/
      app.js                Express app setup (middleware, routes)
      server.js             HTTP server start
      security/
        security.config.js  Constants: event types, severities, sensitive paths
      middleware/
        auth.middleware.js       Session auth guard
        sensitive-path.middleware.js  Detects .env/.git/wp-admin scans
        rate-limit.middleware.js     4 rate limiters
        error.middleware.js          Production-safe error handler
        siem-logger.middleware.js    Fire-and-forget request logger
      modules/
        auth/               Login, logout, session management
        siem/               SIEM event storage, filtering, resolve
        contact/            Contact form submission
        public/             Static data (projects, skills, labs)
      database/
        db.js               pg.Pool + query helper
        schema.sql          All tables and indexes
        init.js             Schema runner + admin seed
  apps/
    public-site/            React + Vite — public portfolio
    admin-console/          React + Vite — private command center
```

---

## 8. Security features implemented

- HttpOnly + SameSite=Strict + Secure (prod) session cookies
- Session name obscured: `turki.sid`
- Session regeneration on login (prevents session fixation)
- bcrypt password hashing (12 rounds)
- Helmet security headers (CSP, HSTS in prod, X-Frame-Options, etc.)
- CORS restricted to ALLOWED_ORIGINS only
- Rate limiting: login (5/15min), contact (3/hr), API (100/15min)
- Sensitive path detection and SIEM event on access
- Failed login logged to SIEM (same error message regardless of whether email exists)
- Unauthorized dashboard access logged to SIEM
- No stack traces in production responses
- All SQL uses parameterized queries (no injection possible)
- No secrets in frontend code
- `noindex, nofollow` meta on admin console
- SIEM emitter never throws (won't crash the app)

---

## 9. What was NOT built in Phase 1

By design — these are left for later phases:

- Gmail OAuth integration
- Email assistant
- AI Cyber Analyst
- Job Intelligence (scraping, AI matching)
- Website analytics (page views stored; dashboard not built yet)
- Applications tracker
- Multi-user permissions
- 2FA / MFA
- Password change UI
- Real CV file (placeholder shown)
- Production deployment config (nginx, systemd, Docker)

---

## 10. Recommended Phase 2

**Website Analytics + Tasks**

The telemetry endpoint (`POST /api/public/telemetry`) already receives events.
Phase 2 adds:
- Analytics dashboard page in admin console
- Chart: page views over time, most visited pages, referrer breakdown
- Simple tasks module: create/complete personal TODO items
- New DB table: `page_views`, `tasks`
- New routes: `/api/analytics/*`, `/api/tasks/*`
- New sidebar item: Analytics (enabled), Tasks (enabled)
