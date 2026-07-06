# CareNest — Architecture

**Status:** Frozen (approved)  
**Last updated:** Architecture review v4

---

## Overview

CareNest is a layered React SPA that separates presentation, application logic, domain rules, and infrastructure. The frontend is built first with mock services; Supabase replaces the persistence layer in Phase 10 without changing pages or hooks.

```
Presentation  →  pages, components
Application   →  hooks, contexts, providers
Domain        →  utils (validators, helpers, constants)
Infrastructure →  services, lib
```

---

## Dependency Rules

```
pages       → hooks, components, utils/constants
hooks       → contexts, services
contexts    → (state only — no direct service calls)
services    → lib, utils
components  → utils/constants, other components
lib         → third-party packages only
utils       → no framework code, no React, no Supabase
```

**Hard rules:**

- Pages **never** import Supabase or Axios directly
- Pages **never** call `sessionStorage` or `localStorage` directly
- AI API keys **never** exist in the frontend
- Business logic **never** lives inside presentational components

---

## Folder Structure

```
src/
├── assets/
│   └── logos/                 # Start minimal; expand as needed
├── components/
│   ├── ui/                    # Atomic primitives (Button, Input, Card…)
│   ├── layout/                # AuthLayout, OnboardingLayout, AppLayout, DashboardLayout
│   ├── navigation/            # Sidebar, Navbar
│   ├── common/                # ErrorBoundary, ProtectedRoute, OnboardingGuard
│   └── forms/                 # FormField, GenderSelect (shared across pages)
├── contexts/
│   ├── AuthContext.jsx
│   ├── CareContext.jsx
│   └── UIContext.jsx
│   └── ThemeContext.jsx       # DEFERRED — only if dark mode becomes a requirement
├── providers/
│   └── AppProviders.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useCare.js
│   ├── useForm.js
│   └── useNotes.js
├── pages/
│   ├── Login/
│   ├── Welcome/
│   ├── CareRecipient/
│   ├── Caregiver/
│   ├── Dashboard/
│   ├── Notes/
│   └── NotFound/
├── services/
│   ├── types.js               # JSDoc typedefs (contracts)
│   ├── errors.js              # ServiceError, AuthError, ValidationError
│   ├── api/
│   │   └── client.js          # Axios — custom backend / Edge Functions only
│   ├── auth/
│   │   └── authService.js
│   ├── profiles/
│   │   ├── careRecipientService.js
│   │   └── caregiverService.js
│   ├── notes/
│   │   └── notesService.js
│   └── storage/
│       └── sessionStorageAdapter.js
├── styles/
│   └── theme/
│       ├── tokens.css
│       ├── globals.css
│       └── animations.css
├── utils/
│   ├── constants/
│   │   ├── routes.js
│   │   └── strings.js
│   ├── helpers/
│   │   └── onboarding.js
│   └── validators/
│       └── profileValidators.js
├── lib/
│   ├── supabase.js            # Phase 10 — singleton client
│   └── motion.js              # Framer Motion presets
├── App.jsx
├── main.jsx
├── routes.jsx
└── index.css
```

---

## Layer Responsibilities

### `lib/` — Framework integrations only

Third-party adapters and browser API wrappers. No business rules.

| File              | Responsibility                |
| ----------------- | ----------------------------- |
| `lib/supabase.js` | Supabase singleton (Phase 10) |
| `lib/motion.js`   | Framer Motion variant objects |

### `utils/` — Pure application logic

No React. No Supabase. No Axios. Testable pure functions.

| Subfolder     | Examples                                         |
| ------------- | ------------------------------------------------ |
| `constants/`  | `routes.js`, `strings.js`                        |
| `helpers/`    | `onboarding.js`, `formatAge.js`, `formatDate.js` |
| `validators/` | `profileValidators.js`                           |

### `services/` — Data and side effects

Promise-based APIs. Mock implementations in Phases 5–8; Supabase swap in Phase 10.

| Module          | Responsibility                                                      |
| --------------- | ------------------------------------------------------------------- |
| `types.js`      | JSDoc contracts for all entities                                    |
| `errors.js`     | Typed error classes                                                 |
| `auth/`         | Sign in, sign out, session                                          |
| `profiles/`     | Care recipient and caregiver CRUD                                   |
| `notes/`        | Notes CRUD with pagination/search                                   |
| `storage/`      | `sessionStorageAdapter` — mock persistence only                     |
| `api/client.js` | Axios for Edge Functions (AI, Phase 11) — **not** for Supabase CRUD |

**HTTP strategy:**

- **Supabase JS client** → all database, auth, storage (Phase 10)
- **Axios** → Supabase Edge Functions and custom APIs only (Phase 11)

### `contexts/` — Client state (four maximum)

| Context          | Responsibility                                                                         | Phase |
| ---------------- | -------------------------------------------------------------------------------------- | ----- |
| **AuthContext**  | User session, `signInWithGoogle()`, `signOut()`                                        | 5     |
| **CareContext**  | Care recipient + caregiver profiles, onboarding drafts, **onboarding completion flag** | 6     |
| **UIContext**    | Toasts, modals, sidebar collapsed state                                                | 3     |
| **ThemeContext** | **DEFERRED** — create only when dark mode is a confirmed requirement                   | —     |

**No AppContext.** Onboarding completion lives in `CareContext`.

Contexts hold state and expose dispatchers. Hooks orchestrate context + services.

### `hooks/` — Public API for pages

Pages call hooks; hooks call services and contexts.

### `pages/` — Thin route orchestrators

Compose layout + components. No business logic. Feature-specific components live in `pages/*/components/`.

---

## State Management Map

| State                      | Owner                                                |
| -------------------------- | ---------------------------------------------------- |
| Auth session               | AuthContext → authService                            |
| Profile drafts             | CareContext (memory) → profile services              |
| Onboarding step + complete | CareContext                                          |
| Notes list                 | useNotes → notesService (Phase 10: + TanStack Query) |
| Form field values          | useForm (local)                                      |
| Toasts, modals, sidebar    | UIContext                                            |

---

## Routing

| Route             | Page                  | Layout                      |
| ----------------- | --------------------- | --------------------------- |
| `/`               | Login                 | AuthLayout                  |
| `/welcome`        | Welcome               | OnboardingLayout            |
| `/care-recipient` | Care Recipient        | OnboardingLayout            |
| `/caregiver`      | Caregiver             | OnboardingLayout            |
| `/dashboard`      | Dashboard             | AppLayout + DashboardLayout |
| `/notes`          | Notes                 | AppLayout                   |
| `/notes/:id`      | Note detail (Phase 8) | AppLayout                   |
| `*`               | Not Found             | —                           |

Route constants: `src/utils/constants/routes.js`  
Guards: `ProtectedRoute`, `OnboardingGuard` in `components/common/`

---

## Feature Ownership Map

| Feature    | Page                              | Hook              | Service                                | Context     |
| ---------- | --------------------------------- | ----------------- | -------------------------------------- | ----------- |
| Auth       | Login                             | useAuth           | authService                            | AuthContext |
| Onboarding | Welcome, CareRecipient, Caregiver | useCare, useForm  | careRecipientService, caregiverService | CareContext |
| Dashboard  | Dashboard                         | useCare, useNotes | profiles, notes                        | CareContext |
| Notes      | Notes                             | useNotes          | notesService                           | —           |

---

## Mock → Supabase Swap (Phase 10)

1. Implement Supabase in `lib/supabase.js`
2. Replace service implementations — **same function signatures**
3. Remove `sessionStorageAdapter` usage from services
4. UI, hooks, pages unchanged

Phase 10 will introduce **TanStack Query** for server state (notes list, cache invalidation).

---

## Related Documents

- [ProductVision.md](./ProductVision.md)
- [DesignSystem.md](./DesignSystem.md)
- [CodingStandards.md](./CodingStandards.md)
- [Database.md](./Database.md)
- [API.md](./API.md)
- [Security.md](./Security.md)
- [AI.md](./AI.md)
- [Compliance.md](./Compliance.md)
- [Deployment.md](./Deployment.md)
- [Roadmap.md](./Roadmap.md)
