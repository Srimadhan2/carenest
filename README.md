# CareNest

AI-powered caregiving application for adults caring for elderly parents.

**Architecture status:** Frozen — see [docs/](./docs/) before implementing.

---

## Quick Start

```bash
npm install
npm run dev
```

### Phase 0 scripts

| Command                | Purpose             |
| ---------------------- | ------------------- |
| `npm run lint`         | ESLint              |
| `npm run format`       | Prettier write      |
| `npm run format:check` | Prettier check (CI) |
| `npm run build`        | Production build    |

### Supabase setup (real auth + persistence)

The app runs against Supabase when credentials are present, and falls back to an
in-browser mock (sessionStorage) when they are not.

1. Create a project at [supabase.com](https://supabase.com).
2. In **Authentication → Providers**, enable **Google** (add your Google OAuth
   client ID/secret; set the authorized redirect URI Supabase shows you).
   Add your app origin (e.g. `http://localhost:5173`) to
   **Authentication → URL Configuration → Redirect URLs**.
3. In the **SQL Editor**, run the migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_auth_persistence.sql`
4. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (Project Settings → API).
5. Restart `npm run dev`.

Every account's data is isolated by Row Level Security keyed on `auth.uid()`:
signing in with a different Google account shows only that account's care
recipient, caregiver profile, and notes; signing back in restores your data.

---

## Phase Status

| Phase                         | Status   |
| ----------------------------- | -------- |
| **0 — Development standards** | Complete |
| 1 — Foundation                | Pending  |

## Documentation

| Document                                      | Description                       |
| --------------------------------------------- | --------------------------------- |
| [Product Vision](./docs/ProductVision.md)     | Mission, personas, scope          |
| [Architecture](./docs/Architecture.md)        | Layers, folders, contexts         |
| [Roadmap](./docs/Roadmap.md)                  | Development phases 0–11           |
| [Design System](./docs/DesignSystem.md)       | Tokens, components, accessibility |
| [Coding Standards](./docs/CodingStandards.md) | Rules, git conventions, tooling   |
| [API & Service Contracts](./docs/API.md)      | JSDoc types, service signatures   |
| [Database Design](./docs/Database.md)         | Schema, RLS, indexes              |
| [Security](./docs/Security.md)                | Security policies                 |
| [AI Architecture](./docs/AI.md)               | Edge Functions, no client keys    |
| [Compliance](./docs/Compliance.md)            | HIPAA considerations              |
| [Deployment](./docs/Deployment.md)            | CI/CD, hosting, env vars          |

---

## Tech Stack

React 19 · Vite · JavaScript · Tailwind CSS v4 · React Router · Framer Motion · Lucide React · Supabase (Phase 10)

---

## Development Workflow

One phase at a time. One file at a time. User approval between steps.

**Current phase:** Phase 0 complete — ready for Phase 1.
