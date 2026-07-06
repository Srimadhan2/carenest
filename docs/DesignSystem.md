# CareNest — Design System

**Status:** Frozen  
**Inspired by:** Apple Human Interface Guidelines

---

## Principles

1. **One primary action per screen**
2. **Generous whitespace** — calm, not dense
3. **Large typography** — readable for ages 40–70
4. **Minimal icons** — Lucide, used sparingly
5. **Subtle motion** — 200–300ms, iOS-like
6. **No visual clutter**

---

## Color Tokens

Never use hex values in JSX. All colors via Tailwind theme classes from `src/styles/theme/tokens.css`.

| Token            | Hex       | Tailwind usage               |
| ---------------- | --------- | ---------------------------- |
| `background`     | `#F5F5F7` | `bg-background`              |
| `surface`        | `#FFFFFF` | `bg-surface`                 |
| `primary`        | `#007AFF` | `bg-primary`, `text-primary` |
| `primary-hover`  | `#0063D1` | `hover:bg-primary-hover`     |
| `text`           | `#1D1D1F` | `text-text`                  |
| `text-secondary` | `#6E6E73` | `text-text-secondary`        |
| `border`         | `#D2D2D7` | `border-border`              |
| `success`        | `#34C759` | `text-success`, `bg-success` |
| `warning`        | `#FF9500` | `text-warning`               |
| `danger`         | `#FF3B30` | `text-danger`                |

### Message Bubbles (iMessage-inspired)

| Token             | Hex       | Tailwind usage       | Usage                                                 |
| ----------------- | --------- | -------------------- | ----------------------------------------------------- |
| `bubble-sent`     | `#007AFF` | `bg-bubble-sent`     | Caregiver-authored notes, right-aligned, white text   |
| `bubble-received` | `#E9E9EB` | `bg-bubble-received` | System/AI summaries (future), left-aligned, dark text |

---

## Typography

**Font:** Inter — **self-hosted** via `@fontsource/inter` (no Google Fonts CDN).

| Scale          | Size    | Usage                         |
| -------------- | ------- | ----------------------------- |
| `text-hero`    | 34–40px | Login headline, welcome title |
| `text-title`   | 28px    | Page titles                   |
| `text-heading` | 22px    | Card headings                 |
| `text-body`    | 17–19px | Body copy, form inputs        |
| `text-label`   | 15–17px | Form labels                   |
| `text-caption` | 13px    | Helper text, timestamps       |

Line height: 1.4–1.6 for body text.

---

## Spacing

8px base grid. Common values: 8, 16, 24, 32, 48, 64.

| Context         | Padding                       |
| --------------- | ----------------------------- |
| Card            | 24px (`p-6`)                  |
| Page horizontal | 16–24px mobile, 32px+ desktop |
| Form field gap  | 16–24px                       |
| Section gap     | 32–48px                       |

---

## Radius & Shadow

| Element | Radius                  | Shadow            |
| ------- | ----------------------- | ----------------- |
| Button  | `rounded-xl` (12px)     | none              |
| Card    | `rounded-2xl` (16px)    | soft `shadow-sm`  |
| Modal   | `rounded-2xl`           | `shadow-lg`       |
| Input   | `rounded-xl`            | none, border only |
| Bubble  | `rounded-bubble` (20px) | subtle, no border |

---

## Motion

Framer Motion presets in `src/lib/motion.js`.

| Transition        | Duration | Easing                                         |
| ----------------- | -------- | ---------------------------------------------- |
| Page enter        | 250ms    | ease-out                                       |
| Button press      | 150ms    | ease-out                                       |
| Modal open        | 250ms    | ease-out                                       |
| Toast             | 200ms    | ease-out                                       |
| Bubble/card entry | spring   | `springTransition` (stiffness 320, damping 26) |

Use `springVariants` + `springTransition` for bubble and card entrance animations (scale + fade + slide).

**Reduced motion:** All animations respect `prefers-reduced-motion: reduce` in `animations.css`.

---

## Component Inventory

Located in `src/components/ui/`. Sidebar and Navbar live in `src/components/navigation/`.

| Component         | Variants                               | States                   |
| ----------------- | -------------------------------------- | ------------------------ |
| Button            | primary, secondary, ghost, destructive | loading, disabled        |
| Input             | default                                | error, disabled          |
| Textarea          | default                                | error, disabled          |
| Card              | default, interactive                   | —                        |
| Avatar            | image, initials                        | —                        |
| Logo              | default                                | —                        |
| Loader            | spinner, skeleton                      | —                        |
| Toast             | success, error, info                   | —                        |
| Modal             | default                                | —                        |
| ProgressIndicator | steps 1–4                              | —                        |
| EmptyState        | default                                | —                        |
| VoiceButton       | placeholder                            | disabled ("coming soon") |
| Sidebar           | expanded, collapsed                    | —                        |
| Navbar            | default                                | —                        |

### Component API Conventions

Every component supports:

- `className` for composition
- `size`: `sm` | `md` | `lg` (default `md`)
- `variant` where applicable
- `isLoading`, `isDisabled` where applicable
- `aria-label` on icon-only controls

---

## Accessibility — Definition of Done (Every Component)

Accessibility is **not a separate phase**. Every UI component must pass this checklist before merge:

- [ ] Keyboard operable (Tab, Enter, Escape where applicable)
- [ ] Visible focus ring (`focus-visible`)
- [ ] ARIA labels on icon-only buttons
- [ ] Error states announced (`aria-invalid`, `aria-describedby`)
- [ ] Minimum touch target **44×44px**
- [ ] Color contrast ≥ **4.5:1** (WCAG AA)
- [ ] `prefers-reduced-motion` respected
- [ ] No information conveyed by color alone

---

## Layouts

| Layout           | Used by                                     | Characteristics                          |
| ---------------- | ------------------------------------------- | ---------------------------------------- |
| AuthLayout       | `/`                                         | Centered card, logo, max-width 400px     |
| OnboardingLayout | `/welcome`, `/care-recipient`, `/caregiver` | Progress indicator, back/continue footer |
| AppLayout        | `/dashboard`, `/notes`                      | Sidebar + Navbar + outlet                |
| DashboardLayout  | `/dashboard`                                | Health-style card grid inside AppLayout  |

---

## Forms

- One step per onboarding screen
- Large labels above inputs (not placeholder-only labels)
- Helpful example placeholders (not empty fields)
- Inline errors on blur/submit
- Back + Continue buttons in OnboardingLayout footer
- Progress indicator shows step 1–4
