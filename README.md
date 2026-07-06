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

Copy `.env.example` to `.env.local` when you reach Phase 10 (Supabase).

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
