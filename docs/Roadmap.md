# CareNest — Development Roadmap

**Status:** Architecture Frozen  
**Implementation:** Not started

---

## Phase Overview

| Phase   | Name                  | Deliverable                                                  |
| ------- | --------------------- | ------------------------------------------------------------ |
| **0**   | Development Standards | Prettier, ESLint, EditorConfig, husky, lint-staged, CI, docs |
| **1**   | Project Foundation    | routes, folder scaffold, constants, lazy loading             |
| **2**   | Design System         | Tokens, 14 UI components, self-hosted Inter, a11y DoD        |
| **3**   | Layouts & Providers   | 4 layouts, 3 contexts, AppProviders, ErrorBoundary           |
| **4**   | Navigation Guards     | ProtectedRoute, OnboardingGuard                              |
| **5**   | Authentication UI     | Login, Google/Apple buttons, mock auth                       |
| **6**   | Onboarding            | Welcome, Care Recipient, Caregiver forms                     |
| **7**   | Dashboard             | Health-style cards, sidebar, empty states                    |
| **8**   | Notes                 | Timeline, search, filters, mock notes service                |
| **8.5** | QA & Testing          | Vitest (mandatory), Lighthouse, responsive audit             |
| **9**   | Database Design       | ERD, RLS, migrations plan — no SQL execution                 |
| **10**  | Supabase Integration  | Auth, profiles, notes, TanStack Query                        |
| **11**  | AI Features           | Voice, summaries, Edge Functions                             |

---

## Phase 0 — Development Standards

**Why:** Lock tooling and conventions before any feature code.

### Deliverables

| Item                | File                                      |
| ------------------- | ----------------------------------------- |
| Prettier            | `.prettierrc`, `.prettierignore`          |
| EditorConfig        | `.editorconfig`                           |
| husky + lint-staged | `.husky/pre-commit`, `package.json`       |
| Path alias          | `vite.config.js` → `@` → `src/`           |
| CI                  | `.github/workflows/ci.yml` — lint + build |
| Env template        | `.env.example`                            |
| Git conventions     | Documented in CodingStandards.md          |

### Dependencies to add

`prettier`, `husky`, `lint-staged`, `@fontsource/inter` (Phase 2 uses it)

### No application code in Phase 0

---

## Phase 1 — Project Foundation

**Why:** Fix broken `routes.jsx` import; scaffold folders; centralize constants.

| File                              | Responsibility       |
| --------------------------------- | -------------------- |
| `src/routes.jsx`                  | Lazy-loaded routes   |
| `src/utils/constants/routes.js`   | Route paths + groups |
| `src/utils/constants/strings.js`  | All copy             |
| `src/services/types.js`           | JSDoc typedefs       |
| `src/services/errors.js`          | Error classes        |
| `src/pages/NotFound/NotFound.jsx` | 404 page             |
| Folder scaffold                   | Per Architecture.md  |

---

## Phase 2 — Design System

**Why:** Build primitives once with accessibility baked in.

| Deliverable                   | Notes                                     |
| ----------------------------- | ----------------------------------------- |
| `styles/theme/tokens.css`     | Full palette + type/spacing scale         |
| `styles/theme/globals.css`    | Self-hosted Inter via `@fontsource/inter` |
| `styles/theme/animations.css` | `prefers-reduced-motion`                  |
| `lib/motion.js`               | Framer variants                           |
| `components/ui/*`             | 12 atomic components                      |
| `components/navigation/*`     | Sidebar, Navbar                           |
| EmptyState, VoiceButton       | Included                                  |

**Accessibility = Definition of Done** for every component in this phase.

---

## Phase 3 — Layouts & Providers

| Deliverable                                               | Notes                          |
| --------------------------------------------------------- | ------------------------------ |
| AuthLayout, OnboardingLayout, AppLayout, DashboardLayout  |                                |
| AuthContext (skeleton), CareContext (skeleton), UIContext |                                |
| ThemeContext                                              | **DEFERRED**                   |
| AppProviders.jsx                                          | Nests contexts + ErrorBoundary |
| ErrorBoundary                                             | `components/common/`           |

**No AppContext.** Onboarding completion in CareContext.

---

## Phase 4 — Navigation Guards

| File                          | Responsibility            |
| ----------------------------- | ------------------------- |
| ProtectedRoute                | Unauthenticated → `/`     |
| OnboardingGuard               | Incomplete → correct step |
| `utils/helpers/onboarding.js` | Pure step logic           |

**Tests required:** guard behavior (Vitest).

---

## Phase 5 — Authentication UI (Mock)

| Deliverable                           | Notes                          |
| ------------------------------------- | ------------------------------ |
| Login page                            | One task per screen            |
| GoogleSignInButton, AppleSignInButton | Apple = "Coming soon"          |
| AuthContext (full)                    | Mock session                   |
| authService                           | Promise API                    |
| sessionStorageAdapter                 | **Never localStorage for PHI** |

Sign out clears all client state.

---

## Phase 6 — Onboarding

| Screen         | Fields                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------- |
| Welcome        | Greeting + Continue                                                                       |
| Care Recipient | firstName, lastName, **dateOfBirth**, gender, healthDescription, voice placeholder, HIPAA |
| Caregiver      | firstName, lastName, dateOfBirth, gender + encouragement on complete                      |

CareContext stores profiles + onboarding completion.

**Tests required:** profileValidators, onboarding helpers.

---

## Phase 7 — Dashboard

Apple Health inspired. Max 3–4 cards:

- WelcomeHeader
- CareRecipientSummaryCard
- QuickNoteCard
- RecentActivityCard
- EmptyState when no data

---

## Phase 8 — Notes

| Feature              | Implementation            |
| -------------------- | ------------------------- |
| Timeline             | Newest first              |
| Search + filters     | Client-side on mock       |
| NoteEditor           | Manual notes              |
| VoiceNotePlaceholder | "Coming soon"             |
| notesService         | Full pagination API shape |

```js
getNotes(careRecipientId, { page, limit, search, sortBy, sortOrder });
```

---

## Phase 8.5 — QA & Testing (Mandatory)

| Area           | Action                                         |
| -------------- | ---------------------------------------------- |
| **Vitest**     | Validators, guards, helpers, service contracts |
| Responsive     | 320, 375, 768, 1024, 1920px                    |
| Lighthouse     | Performance ≥ 90, Accessibility ≥ 95           |
| Loading states | Every async action                             |
| Empty states   | Dashboard + Notes                              |
| CI             | Add `npm run test` to GitHub Actions           |

---

## Phase 9 — Database Design

**Deliverable:** `docs/Database.md` finalized + `supabase/migrations/` folder structure planned.

- `date_of_birth` not `age`
- RLS policy sketches
- households, audit_logs, note_revisions
- **No SQL execution**

---

## Phase 10 — Supabase Integration

- `lib/supabase.js`
- Replace mock services (same signatures)
- TanStack Query for notes
- Google OAuth live
- Remove sessionStorageAdapter from services

---

## Phase 11 — AI Features

Per `docs/AI.md`:

- Edge Functions → OpenAI, Twilio
- `services/ai/*`
- Feature flags
- Consent UI

---

## Working Agreement

1. Explain WHY before each file
2. **User approves**
3. Implement **one file at a time**
4. User tests locally
5. **User approves** → next file

---

## Documentation Index

| Document                                   | Purpose                      |
| ------------------------------------------ | ---------------------------- |
| [ProductVision.md](./ProductVision.md)     | Mission, personas, scope     |
| [Architecture.md](./Architecture.md)       | Layers, folders, contexts    |
| [DesignSystem.md](./DesignSystem.md)       | Tokens, components, a11y DoD |
| [CodingStandards.md](./CodingStandards.md) | Code rules, git, tooling     |
| [API.md](./API.md)                         | Service contracts            |
| [Database.md](./Database.md)               | Schema design                |
| [Security.md](./Security.md)               | Security policies            |
| [AI.md](./AI.md)                           | AI architecture              |
| [Compliance.md](./Compliance.md)           | HIPAA considerations         |
| [Deployment.md](./Deployment.md)           | Build, CI/CD, hosting        |
| [Roadmap.md](./Roadmap.md)                 | This file                    |

---

## Technology Stack (Frozen)

| Layer                 | Choice                          |
| --------------------- | ------------------------------- |
| UI                    | React 19, Tailwind CSS v4       |
| Build                 | Vite                            |
| Routing               | React Router DOM                |
| HTTP (Edge Functions) | Axios                           |
| Animation             | Framer Motion                   |
| Icons                 | Lucide React                    |
| Backend               | Supabase (Phase 10)             |
| Testing               | Vitest + Testing Library        |
| Font                  | @fontsource/inter (self-hosted) |

**Not changing:** layered architecture, mock-first, UI-first, database design before implementation.
