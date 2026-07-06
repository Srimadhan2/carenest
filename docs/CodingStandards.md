# CareNest — Coding Standards

**Status:** Frozen

---

## Language & Framework

- **JavaScript** (not TypeScript) with **JSDoc typedefs** for service contracts
- **React 19** functional components only
- **Hooks** for all state and side effects
- No class components except `ErrorBoundary`

---

## File Naming

| Type       | Convention                   | Example                |
| ---------- | ---------------------------- | ---------------------- |
| Components | PascalCase `.jsx`            | `Button.jsx`           |
| Hooks      | camelCase `use` prefix `.js` | `useAuth.js`           |
| Services   | camelCase `.js`              | `authService.js`       |
| Utils      | camelCase `.js`              | `profileValidators.js` |
| Constants  | camelCase `.js`              | `routes.js`            |
| Contexts   | PascalCase `Context` suffix  | `AuthContext.jsx`      |

---

## Import Order

1. React / third-party libraries
2. `@/` internal — contexts, hooks, services
3. `@/` internal — components
4. `@/` internal — utils, constants
5. Relative imports
6. Styles

Use `@/` path alias (maps to `src/`).

---

## Hard Rules

| Never                          | Always                                               |
| ------------------------------ | ---------------------------------------------------- |
| Hardcode hex colors in JSX     | Use Tailwind theme tokens                            |
| Hardcode route paths           | Use `utils/constants/routes.js`                      |
| Hardcode user-facing strings   | Use `utils/constants/strings.js`                     |
| Inline styles                  | Tailwind utility classes                             |
| Import Supabase in pages       | Use services via hooks                               |
| Store PHI in `localStorage`    | `sessionStorage` for mock only; Supabase in Phase 10 |
| Put framework code in `utils/` | `utils/` is pure logic only                          |
| Put business logic in `lib/`   | `lib/` is framework glue only                        |
| AI API keys in frontend        | Edge Functions only (see AI.md)                      |
| Bulk-import `lucide-react`     | Named imports per icon                               |

---

## Component Size

- Target **< 80 lines** JSX per component
- Split when a component has more than one responsibility
- Page components orchestrate; they do not contain form logic

---

## Service Contracts

All services:

1. Return **Promises**
2. Use **JSDoc typedefs** from `services/types.js`
3. Throw typed errors from `services/errors.js`
4. Match mock and Supabase implementations exactly

See [API.md](./API.md) for function signatures.

---

## Testing (Mandatory)

**Vitest** + **@testing-library/react** required for:

| Target            | Examples                            |
| ----------------- | ----------------------------------- |
| Validators        | `profileValidators.js`              |
| Helpers           | `onboarding.js`, `formatAge.js`     |
| Route guards      | `ProtectedRoute`, `OnboardingGuard` |
| Service contracts | Mock service return shapes          |
| Utility functions | All `utils/` pure functions         |

Tests are introduced alongside the code they cover, consolidated in Phase 8.5.

---

## Git Conventions

### Branch naming

```
feature/phase-N-short-description
fix/short-description
docs/short-description
chore/short-description
```

Examples: `feature/phase-2-button-component`, `fix/onboarding-guard-redirect`

### Commit messages

```
type(scope): short description

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:

- `feat(ui): add Button component with variants`
- `docs(architecture): freeze context model`
- `test(validators): add care recipient validation tests`

---

## Phase 0 Tooling Standards

| Tool               | Purpose                         |
| ------------------ | ------------------------------- |
| **Prettier**       | Code formatting                 |
| **ESLint**         | Lint rules (existing)           |
| **EditorConfig**   | Cross-editor consistency        |
| **husky**          | Git hooks                       |
| **lint-staged**    | Run lint/format on staged files |
| **GitHub Actions** | CI: lint + build on push/PR     |

### EditorConfig (`.editorconfig`)

```
root = true
[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

### lint-staged (planned)

```json
{
  "*.{js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md}": ["prettier --write"]
}
```

---

## SOLID (Where Applicable)

- **Single Responsibility** — one component, one job
- **Open/Closed** — extend via props/variants, not modification
- **Dependency Inversion** — pages depend on hooks; hooks depend on service interfaces

---

## Related Documents

- [Architecture.md](./Architecture.md)
- [DesignSystem.md](./DesignSystem.md)
- [API.md](./API.md)
