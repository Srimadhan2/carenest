# CareNest — Security

**Status:** Frozen (policies); implementation phased

---

## Principles

1. **No secrets in source code** — environment variables only
2. **No PHI in `localStorage`** — ever
3. **Mock PHI in `sessionStorage` only** — clears on tab close
4. **RLS on all Supabase tables** — no exceptions
5. **AI API keys server-side only** — Edge Functions
6. **Sign out clears all client state**

---

## Environment Variables

| Variable                 | Exposure               | Phase |
| ------------------------ | ---------------------- | ----- |
| `VITE_SUPABASE_URL`      | Public (safe)          | 10    |
| `VITE_SUPABASE_ANON_KEY` | Public (safe with RLS) | 10    |
| `OPENAI_API_KEY`         | **Server only**        | 11    |
| `TWILIO_*`               | **Server only**        | 11    |

**Never prefix server secrets with `VITE_`.** Vite exposes all `VITE_*` vars to the browser bundle.

Document all vars in `.env.example` (no real values).

---

## Mock Phase Security (Phases 5–8)

| Rule                       | Implementation                                               |
| -------------------------- | ------------------------------------------------------------ |
| No real health data in dev | Use fictional seed data only                                 |
| sessionStorage only        | `sessionStorageAdapter.js`                                   |
| Dev banner                 | Optional UI: "Development — not for real health information" |
| Sign out                   | Clears sessionStorage + all context state                    |

---

## Authentication (Phase 10)

- Google OAuth via Supabase Auth
- Session managed by Supabase client (`onAuthStateChange`)
- Token refresh handled by Supabase SDK
- Apple Sign In when enabled — same flow

### Session timeout (shared devices)

Plan for Phase 10:

- Optional "Remember me" off by default on shared devices
- Sign out prominently in sidebar
- Consider idle timeout (30 min) for future release

---

## Authorization

- **Row Level Security** enforces data access at database level
- Frontend guards (`ProtectedRoute`, `OnboardingGuard`) are UX only — not security boundaries
- Never trust client-side checks alone

---

## Content Security Policy (Production)

Add to hosting config (see Deployment.md):

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://*.supabase.co;
font-src 'self';
```

Adjust when Edge Functions domains are known.

---

## XSS Prevention

- React escapes JSX by default
- Never use `dangerouslySetInnerHTML` for user content
- Sanitize note content if rich text is added later

---

## Sign-Out Procedure

On `signOut()`:

1. Call `authService.signOut()`
2. Clear `sessionStorage` via adapter
3. Reset AuthContext, CareContext
4. Navigate to `/`

---

## Related Documents

- [Compliance.md](./Compliance.md)
- [AI.md](./AI.md)
- [Deployment.md](./Deployment.md)
