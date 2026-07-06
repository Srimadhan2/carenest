# CareNest — AI Architecture

**Status:** Frozen (design); implementation Phase 11

---

## Critical Rule

**No AI API key may ever exist in the frontend.**

All AI and telephony operations run server-side via **Supabase Edge Functions**.

---

## Architecture Flow

```
Browser (React)
    │
    │  HTTPS + Supabase JWT
    ▼
Supabase Edge Functions
    │
    ├──► OpenAI API        (transcription, summaries, assistance)
    │
    └──► Twilio API        (voice calls, recordings)
    │
    ▼
PostgreSQL / Storage     (persist transcripts, summaries)
    │
    ▼
Browser                  (display results via services/api/client.js)
```

---

## Frontend Responsibilities

| Responsibility       | Implementation                             |
| -------------------- | ------------------------------------------ |
| Voice UI placeholder | `VoiceButton` component (Phases 6, 8)      |
| Trigger AI requests  | `services/ai/` → Axios → Edge Function     |
| Display results      | Notes timeline, summary cards              |
| Consent UI           | "Allow AI to process this note" — Phase 11 |
| Loading states       | Loader component during async              |
| Error handling       | Toast + friendly messages                  |

**Frontend never:**

- Holds OpenAI or Twilio credentials
- Calls OpenAI/Twilio directly
- Stores raw API responses without sanitization

---

## Edge Functions (Planned)

| Function               | Input                             | Output                                 |
| ---------------------- | --------------------------------- | -------------------------------------- |
| `transcribe-voice`     | Audio blob URL from Storage       | Transcript text                        |
| `summarize-notes`      | Note IDs + care recipient context | Summary text                           |
| `medication-assist`    | Question + profile context        | Informational response + disclaimer    |
| `doctor-visit-summary` | Voice recording                   | Structured summary                     |
| `twilio-webhook`       | Twilio POST                       | Recording URL → transcription pipeline |

---

## Planned Services (`services/ai/`)

| Service                      | Phase |
| ---------------------------- | ----- |
| `transcriptionService.js`    | 11    |
| `summaryService.js`          | 11    |
| `medicationAssistService.js` | 11    |

All call `services/api/client.js` (Axios) with Supabase auth header.

---

## Note Types

Database and service layer support:

| Type         | Source                          |
| ------------ | ------------------------------- |
| `manual`     | User typed                      |
| `voice`      | Voice recording → transcription |
| `ai_summary` | AI-generated from note batch    |

---

## Safety & Liability

| Requirement               | Implementation                                         |
| ------------------------- | ------------------------------------------------------ |
| Medical disclaimer        | All AI responses include non-medical-advice disclaimer |
| No dosing recommendations | Medication assist is informational only                |
| User consent              | Explicit opt-in before AI processes health content     |
| Rate limiting             | Edge Functions enforce per-user limits                 |
| Cost controls             | Token limits per request; monitoring in Supabase       |

---

## Feature Flags

```js
// utils/constants/featureFlags.js (Phase 11)
FEATURES = {
  VOICE_NOTES: false,
  AI_SUMMARIES: false,
  MEDICATION_ASSIST: false,
};
```

Enable incrementally in production.

---

## UI Placeholders (Phases 6, 8)

VoiceButton and voice note placeholders show **"Coming soon"** — no implied medical functionality until Phase 11 is complete and reviewed.

---

## Related Documents

- [Security.md](./Security.md)
- [Compliance.md](./Compliance.md)
- [API.md](./API.md)
- [Database.md](./Database.md)
