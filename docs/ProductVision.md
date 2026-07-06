# CareNest — Product Vision

## Mission

CareNest reduces caregiver stress by giving adults aged 40–70 a calm, simple way to organize care for elderly parents — without complexity, clutter, or clinical coldness.

We are building a **real product** for **real caregivers**, not a demo or tutorial.

---

## Target Audience

**Primary users:** Adults aged 40–70 caring for elderly parents.

**Common care situations:**

- Dementia and memory loss
- Parkinson's disease
- Diabetes management
- Arthritis and mobility issues
- General old-age care

**User needs:**

- Reduce mental load
- Keep important care information in one place
- Feel reassured, not overwhelmed
- Use the app without technical expertise

---

## Design Philosophy

Inspired by Apple's Human Interface Guidelines. The app should feel like a **native Apple application in Safari**.

| Reference      | What we borrow                                      |
| -------------- | --------------------------------------------------- |
| Apple Health   | Calm cards, minimal dashboard, reassuring summaries |
| Apple Notes    | Simple content creation, timeline, search           |
| iMessage       | Conversational familiarity, friendly tone           |
| Apple Settings | Clear hierarchy, one task per screen                |
| Apple Calendar | Clean layout, generous whitespace                   |

**We avoid:** Material UI, Bootstrap, Android patterns, glassmorphism, neumorphism.

**CEO mandate:**

- One task per screen
- No clutter
- Extremely simple dashboard
- Reassuring tone
- Americans prefer clean experiences

---

## User Personas

### Persona 1 — Sarah, 52, Primary Caregiver

- Cares for her 78-year-old mother with mild dementia
- Works full-time, checks the app mornings and evenings
- Wants quick notes and a calm overview — not a medical chart
- Uses iPhone Safari; needs large text and simple navigation

### Persona 2 — Michael, 61, Co-Caregiver

- Shares care duties with his sister for their father (Parkinson's)
- Needs to see recent activity and add notes after doctor visits
- Low patience for complicated software
- May use a shared family iPad — session security matters

### Persona 3 — Linda, 45, New Caregiver

- Recently became caregiver after parent's diabetes diagnosis
- Overwhelmed by responsibility; needs encouragement and guidance
- Onboarding must feel simple and non-clinical
- Will abandon the app if the first screen feels complex

---

## Core Problems We Solve

1. **Scattered information** — care details live in texts, paper, and memory
2. **Cognitive overload** — caregivers juggle too much without a calm system
3. **Stress and isolation** — no simple tool that feels supportive
4. **Hard-to-use health apps** — clinical UIs built for providers, not families

---

## Out-of-Scope (Current Phases)

| Feature                           | Status                                  |
| --------------------------------- | --------------------------------------- |
| Real authentication (Supabase)    | Phase 10                                |
| AI voice notes, summaries         | Phase 11                                |
| Medication dosing recommendations | Phase 11+ (high liability)              |
| Doctor/provider portal            | Future                                  |
| Insurance / billing               | Out of scope                            |
| Real-time family chat             | Future                                  |
| Native iOS/Android apps           | Future (web-first)                      |
| Offline-first sync                | Designed for; implemented post-Supabase |
| Apple Sign In (functional)        | UI placeholder until Phase 10           |
| HIPAA certification               | Compliance process; see Compliance.md   |

---

## Future Roadmap (Product)

| Phase  | Product capability                                                |
| ------ | ----------------------------------------------------------------- |
| 0–8    | Complete frontend UI with mock data                               |
| 8.5    | QA, mandatory tests, Lighthouse                                   |
| 9      | Database design (no implementation)                               |
| 10     | Supabase: auth, profiles, notes, storage                          |
| 11     | AI: voice notes, summaries, medication assistance, Twilio         |
| Beyond | Family sharing, multiple recipients, provider export, native apps |

---

## Success Metrics (Future)

- Onboarding completion rate > 80%
- Weekly active caregiver retention
- Notes created per active user per week
- Accessibility audit pass (WCAG AA)
- Lighthouse Performance ≥ 90, Accessibility ≥ 95
