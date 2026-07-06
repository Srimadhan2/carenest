# CareNest — Deployment

**Status:** Frozen (plan)

---

## Build

```bash
npm run build    # Output: dist/
npm run preview  # Local preview of production build
```

Vite produces static assets suitable for CDN hosting.

---

## Environment Variables

### Development

Create `.env.local` (gitignored):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Leave empty during Phases 0–9. Populate in Phase 10.

### Production

Set in hosting provider dashboard. Never commit real values.

| Variable                 | Required | Phase |
| ------------------------ | -------- | ----- |
| `VITE_SUPABASE_URL`      | Yes      | 10    |
| `VITE_SUPABASE_ANON_KEY` | Yes      | 10    |

Server-only secrets (Edge Functions):

```env
OPENAI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

Set via Supabase Edge Function secrets — not in Vite env.

---

## Recommended Hosts

| Provider             | Notes                                 |
| -------------------- | ------------------------------------- |
| **Vercel**           | Zero-config Vite, preview deployments |
| **Netlify**          | Similar to Vercel                     |
| **Cloudflare Pages** | Fast global CDN                       |

All support environment variables and custom domains.

---

## CI/CD (Phase 0)

GitHub Actions workflow (`.github/workflows/ci.yml`):

```yaml
# Triggers: push to main, pull_request
# Steps:
#   1. checkout
#   2. setup-node (LTS)
#   3. npm ci
#   4. npm run lint
#   5. npm run build
#   6. npm run test (Phase 8.5+)
```

### Branch strategy

| Branch      | Purpose          |
| ----------- | ---------------- |
| `main`      | Production-ready |
| `feature/*` | Phase work       |
| `fix/*`     | Bug fixes        |

---

## SPA Routing

Configure host for client-side routing — all paths serve `index.html`:

**Vercel:** `vercel.json`

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Netlify:** `_redirects`

```
/*    /index.html   200
```

---

## Security Headers (Production)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: microphone=(), camera=()
```

Add Content Security Policy per [Security.md](./Security.md).

Enable `microphone` permission only when voice features launch (Phase 11).

---

## Google OAuth Redirect URIs

Configure in Google Cloud Console and Supabase Auth:

| Environment | URI                      |
| ----------- | ------------------------ |
| Development | `http://localhost:5173`  |
| Production  | `https://yourdomain.com` |

Supabase callback: `https://<project>.supabase.co/auth/v1/callback`

---

## Performance Targets

| Metric                   | Target                   |
| ------------------------ | ------------------------ |
| Lighthouse Performance   | ≥ 90                     |
| Lighthouse Accessibility | ≥ 95                     |
| First Contentful Paint   | < 1.5s                   |
| Bundle size (initial)    | < 200KB gzipped (target) |

Run Lighthouse in Phase 8.5 before Supabase integration.

---

## Staging Environment

Recommended before Phase 10:

- Separate Supabase project for staging
- `staging.carenest.app` subdomain
- Seed data only — no real PHI

---

## Related Documents

- [Security.md](./Security.md)
- [CodingStandards.md](./CodingStandards.md)
- [Architecture.md](./Architecture.md)
